const shiki = require("shiki");
const config = (hexo.config.shiki = Object.assign(
    {
        theme: "github-light",
    },
    hexo.config.shiki || {}
));
return shiki
        .getHighlighter({
            theme: config.theme,
        })
        .then((hl) => {
            hexo.extend.highlight.register("shiki", (code, options) => {
                try {
                    return hl.codeToHtml(code, { lang: options.lang });
                } catch (e) {
                    console.error(e);
                    return `<pre><code>${code}</code></pre>`;
                }
            });
        });
