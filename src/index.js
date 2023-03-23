const { sleep } = require("deasync");
const shiki = require("shiki");

const config = (hexo.config.shiki = Object.assign(
    {
        theme: "github-light",
    },
    hexo.config.shiki || {}
));

let highlighter = undefined;
let getting = false;

hexo.extend.highlight.register("shiki", (code, options) => {
    if (highlighter === undefined && !getting) {
        getting = true;
        shiki
            .getHighlighter({
                theme: config.theme,
            })
            .then((hl) => {
                highlighter = hl;
                getting = false;
            });
    }
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
