import type { ShikiConfig } from "./types";

import fsPromises from "node:fs/promises";
import shiki, { bundledLanguages } from "shiki";
import type {
    BundledLanguage,
    BundledTheme,
    LanguageInput,
    SpecialTheme,
} from "shiki";
import { verifyConfig } from "./verify";

const config: ShikiConfig = hexo.config.shiki ?? {};

console.log(config);
verifyConfig(config);

const themes: (BundledTheme | SpecialTheme)[] = config.themes
    ? Object.values(config.themes)
    : [config.theme ?? "none"];

// @ts-ignore
const langs = await // only ignore await, prevent auto format
Promise.all(
    config.languages?.map(async (lang) => {
        if (typeof lang === "string") {
            return lang;
        }

        const textMateGrammar: LanguageInput = JSON.parse(
            await fsPromises.readFile(lang.path ?? "", "utf-8"),
        );
        return textMateGrammar;
    }) ?? [],
);

// @ts-ignore
const hl = await // only ignore await, prevent auto format
shiki.createHighlighter({
    themes,
    langs: [
        ...langs,
        ...(config.loadAllLanguages ? Object.keys(bundledLanguages) : []),
    ],
});

hexo.extend.highlight.register("shiki", (code, options) => {
    try {
        return hl.codeToHtml(code, {
            ...(config.themes
                ? { themes: config.themes }
                : { theme: config.theme ?? "none" }),
            lang: options.lang as BundledLanguage | SpecialTheme,
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
