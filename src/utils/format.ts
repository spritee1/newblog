const TZ = 'Asia/Shanghai';

/** 2026-10-28 */
export function formatDate(date: Date): string {
	const parts = new Intl.DateTimeFormat('zh-CN', {
		timeZone: TZ,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(date);
	const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
	return `${get('year')}-${get('month')}-${get('day')}`;
}

/** 2026 年 10 月 28 日 */
export function formatDateLong(date: Date): string {
	return new Intl.DateTimeFormat('zh-CN', {
		timeZone: TZ,
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(date);
}

export function yearOf(date: Date): string {
	return new Intl.DateTimeFormat('zh-CN', { timeZone: TZ, year: 'numeric' }).format(date);
}

/** 粗略估算阅读时间（中文按 ~380 字/分钟，英文按 ~200 词/分钟） */
export function readingTime(markdown: string | undefined): string {
	if (!markdown) return '1 分钟';
	const text = markdown
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`[^`]*`/g, '')
		.replace(/!?\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/<[^>]+>/g, '');
	const cjk = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
	const words = (text.match(/[A-Za-z0-9]+/g) ?? []).length;
	const minutes = Math.max(1, Math.round(cjk / 380 + words / 200));
	return `${minutes} 分钟`;
}

export function tagSlug(tag: string): string {
	return encodeURIComponent(tag);
}
