const shiki = require("shiki");
const config = (hexo.config.shiki = Object.assign(
    {
        renderer: "marked",
        theme: "github-light",
    },
    hexo.config.shiki || {}
));
return shiki
    .getHighlighter({
        theme: config.theme,
    })
    .then((hl) => {
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
