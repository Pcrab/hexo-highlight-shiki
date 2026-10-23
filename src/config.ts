import { bundledLanguages, bundledThemes } from "shiki";
import { z } from "zod";

const themeLiteralType = z.string().and(
	z.custom<keyof typeof bundledThemes>(
		(value) => typeof value === "string" && Object.hasOwn(bundledThemes, value),
		{
			abort: false,
			error: (err) =>
				`Only shiki bundled themes are allowed, but got ${err.input}`,
		},
	),
);

const themeItem = z.union([
	z.object({
		name: z.string(),
		path: z.string(),
	}),
	themeLiteralType,
]);

const themeConfig = z.union([
	z.object({
		theme: themeItem,
	}),
	z.intersection(
		z.object({
			themes: z.object({
				light: themeItem,
				dark: themeItem,
			}),
		}),
		z.union([
			z.object({
				autoInjectCSS: z.literal("query").default("query"),
			}),
			z.object({
				autoInjectCSS: z.literal("selector"),
				darkSelector: z.string().default("html.dark"),
			}),
			z.object({
				autoInjectCSS: z.literal(false),
			}),
		]),
	),
]);

const languageItem = z.string().and(
	z.custom<keyof typeof bundledLanguages>(
		(value) =>
			typeof value === "string" && Object.hasOwn(bundledLanguages, value),
		{
			abort: false,
			error: (err) =>
				`Only shiki bundled languages are allowed, but got ${err.input}`,
		},
	),
);

const languageConfig = z.intersection(
	z.object({
		languages: z
			.array(
				z.union([
					// custom language
					z.object({
						name: z.string(),
						path: z.string(),
					}),
					languageItem,
				]),
			)
			.default([]),
	}),
	z.object({
		loadAllLanguages: z.boolean().optional(),
	}),
);

export const shikiConfig = z.intersection(languageConfig, themeConfig);

export type ShikiConfig = z.infer<typeof shikiConfig>;
