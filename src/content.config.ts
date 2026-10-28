import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().default(''),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		category: z.string().optional(),
		// 封面图，填 /images/xxx.jpg 这类 public 下的路径
		cover: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
