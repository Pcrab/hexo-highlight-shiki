import type { BundledTheme } from "shiki";
import { bundledLanguages, bundledThemes } from "shiki";
import type { ZodLiteral } from "zod";
import { z } from "zod";

const themeLiteralType = z.union(
	Object.keys(bundledThemes).map((theme) => z.literal(theme)) as [
		ZodLiteral<BundledTheme>,
		ZodLiteral<BundledTheme>,
		...ZodLiteral<BundledTheme>[],
	],
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

const languageItem = z.union(
	Object.keys(bundledLanguages).map((lang) => z.literal(lang)) as [
		ZodLiteral<string>,
		ZodLiteral<string>,
		...ZodLiteral<string>[],
	],
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
