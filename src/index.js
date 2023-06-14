const shiki = require("shiki");
const fsPromises = require("fs/promises");
const config = (hexo.config.shiki = Object.assign(
    {
        renderer: "marked",
        theme: "github-light",
        languages: [],
    },
    hexo.config.shiki || {}
));
return shiki
    .getHighlighter({
        theme: config.theme,
    })
    .then(async (hl) => {
        for (const lang of config.languages) {
            const grammarDef = JSON.parse(await fsPromises.readFile(lang.grammar));
            const langDef = {
                id: lang.id,
                scopeName: lang.scope_name,
                grammar: grammarDef,
                aliases: lang.aliases || [],
            };
            await hl.loadLanguage(langDef);
        }
        if (config.renderer === "djot") {
            hexo.extend.filter.register("djot:renderer", (renderOverrides) => {
                renderOverrides.code_block = (node) => {
                    const { lang, text } = node;
                    try {
                        return hl.codeToHtml(text, { lang });
                    } catch (e) {
                        console.error(e);
                        return `<pre><code>${text}</code></pre>`;
                    }
                };
            });
        } else {
            hexo.extend.highlight.register("shiki", (code, options) => {
                try {
                    return hl.codeToHtml(code, { lang: options.lang });
                } catch (e) {
                    console.error(e);
                    return `<pre><code>${code}</code></pre>`;
                }
            });
        }
    });
