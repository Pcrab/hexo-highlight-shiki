import { readFile } from "node:fs/promises";
import type { LanguageInput, ThemeInput } from "shiki";
import { bundledLanguages, createHighlighter } from "shiki";
import { shikiConfig } from "./config.js";

const HIGHLIGHTER_NAME = "shiki";

const { data: config, error } = shikiConfig.safeParse(hexo.config.shiki ?? {});
if (!config) {
	throw error;
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
				: { themes: config.themes }),
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

if (
	hexo.config.syntax_highlighter === HIGHLIGHTER_NAME &&
	"themes" in config &&
	config.autoInjectCSS !== false
) {
	hexo.extend.injector.register(
		"head_end",
		`<style>${
			config.autoInjectCSS === "query"
				? `
@media (prefers-color-scheme: dark) {
  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
    `
				: `
${config.darkSelector} .shiki,
${config.darkSelector} .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  /* Optional, if you also want font styles */
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
                `
		}</style>`,
	);
}
