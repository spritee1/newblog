/**
 * 老浏览器兼容后处理
 *
 * Firefly 用的 Tailwind v4 会输出：
 *   - @layer properties/theme/base/components/utilities（Chrome 99+ / iOS 15.4+）
 *   - oklch()/color-mix()/lab()（Chrome 111+ / iOS 16.4+）
 * 微信内置浏览器内核较老时会整块忽略 @layer，导致白屏/无样式。
 *
 * 这里做两件事：
 *   1. 用 lightningcss 按 Chrome 79 / Safari 12 的目标补上 rgb 回退
 *   2. 把 @layer 包层拆平（顺序不变），让老内核也能应用规则
 *
 * 现代浏览器不受影响：回退色在前，现代色在后，后者覆盖前者。
 */
import fs from 'node:fs';
import path from 'node:path';
import { transform } from 'lightningcss';

const DIST = path.resolve('dist');
const TARGETS = { chrome: 79 << 16, safari: 12 << 16 };

function walk(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(full));
		else if (/\.(css|html)$/.test(entry.name)) out.push(full);
	}
	return out;
}

/** 去掉 @layer 包层，保留内部规则与原有顺序 */
function flattenLayers(css) {
	let out = '';
	let i = 0;
	while (i < css.length) {
		if (!css.startsWith('@layer', i)) {
			const next = css.indexOf('@layer', i);
			if (next === -1) {
				out += css.slice(i);
				break;
			}
			out += css.slice(i, next);
			i = next;
			continue;
		}
		const semi = css.indexOf(';', i);
		const brace = css.indexOf('{', i);
		// 形如 `@layer a, b;` 的声明直接丢掉
		if (semi !== -1 && (brace === -1 || semi < brace)) {
			i = semi + 1;
			continue;
		}
		if (brace === -1) {
			out += css.slice(i);
			break;
		}
		let depth = 0;
		let j = brace;
		for (; j < css.length; j++) {
			if (css[j] === '{') depth++;
			else if (css[j] === '}') {
				depth--;
				if (depth === 0) break;
			}
		}
		out += flattenLayers(css.slice(brace + 1, j));
		i = j + 1;
	}
	return out;
}

function lowerColors(css, filename) {
	const { code } = transform({
		filename,
		code: Buffer.from(css),
		minify: false,
		targets: TARGETS,
	});
	return code.toString();
}

function processCss(css, filename) {
	return flattenLayers(lowerColors(css, filename));
}

let cssCount = 0;
let htmlCount = 0;

for (const file of walk(DIST)) {
	const source = fs.readFileSync(file, 'utf8');

	if (file.endsWith('.css')) {
		if (!source.includes('@layer') && !source.includes('oklch(') && !source.includes('color-mix(')) continue;
		fs.writeFileSync(file, processCss(source, path.basename(file)));
		cssCount++;
		continue;
	}

	// HTML 里的内联 <style> 也要处理
	if (!source.includes('@layer')) continue;
	const updated = source.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (match, attrs, css) => {
		if (!css.includes('@layer')) return match;
		try {
			return `<style${attrs}>${processCss(css, 'inline.css')}</style>`;
		} catch (error) {
			console.warn(`[legacy-css] 内联样式处理失败，保留原样: ${error.message}`);
			return match;
		}
	});
	if (updated !== source) {
		fs.writeFileSync(file, updated);
		htmlCount++;
	}
}

console.log(`[legacy-css] 处理 ${cssCount} 个 CSS 文件、${htmlCount} 个 HTML 文件`);
