const { sleep } = require("deasync");
const shiki = require("shiki");

const config = (hexo.config.shiki = Object.assign(
    {
        theme: "github-light",
    },
    hexo.config.shiki || {}
));

hexo.extend.highlight.register("shiki", (code, options) => {
    let highlighter = undefined;
    shiki
        .getHighlighter({
            theme: config.theme,
            langs: [options.lang],
        })
        .then((hl) => {
            highlighter = hl;
        });
    let count = 200;
    while (!highlighter) {
        if (count-- < 0) {
            throw new Error("Failed to load shiki highlighter");
        }
        sleep(200);
    }
    try {
        return highlighter.codeToHtml(code, { lang: options.lang });
    } catch (e) {
        console.error(e);
        return `<pre><code>${code}</code></pre>`;
    }
});
