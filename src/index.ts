import { readFile } from "node:fs/promises";
import type { LanguageInput, ThemeInput } from "shiki";
import { bundledLanguages, createHighlighter } from "shiki";
import z from "zod";
import { shikiConfig } from "./config.js";

const HIGHLIGHTER_NAME = "shiki";

const { data: config, error } = shikiConfig.safeParse(hexo.config.shiki ?? {});
if (!config) {
	// console.error(z.prettifyError(error));
	throw new Error(
		`Shiki config parse failed:
${z.prettifyError(error)}`,
		{
			cause: error,
		},
	);
}

const langs = await // add comment here to prevent auto format
Promise.all(
	config.languages?.map(async (lang) => {
		if (typeof lang === "string") {
			return lang;
		}

		const textMateGrammar: LanguageInput = JSON.parse(
			await readFile(lang.path ?? "", "utf-8"),
		);
		return textMateGrammar;
	}) ?? [],
);

const themes = await Promise.all(
	("theme" in config ? [config.theme] : Object.values(config.themes)).map(
		async (theme) => {
			if (typeof theme === "string") {
				return theme;
			}

			const themeContent: ThemeInput = JSON.parse(
				await readFile(theme.path ?? "", "utf-8"),
			);
			return {
				...theme,
				content: themeContent,
			};
		},
	),
);

const hl = await createHighlighter({
	themes,
	langs: [
		...langs,
		// if no bundled languages are specified, load all languages
		...(langs.filter((lang) => typeof lang === "string").length === 0 &&
		config.loadAllLanguages !== false
			? Object.keys(bundledLanguages)
			: []),
	],
});

hexo.extend.highlight.register(HIGHLIGHTER_NAME, (code, options) => {
	try {
		return hl.codeToHtml(code, {
			...("theme" in config
				? { theme: config.theme }
				: { themes: config.themes, defaultColor: "light-dark()" }),
			lang: options.lang as string,
		});
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message);
		} else {
			console.error(e);
		}
		return `<pre><code>${code}</code></pre>`;
	}
});
