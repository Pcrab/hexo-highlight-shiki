try {
    const config = (hexo.config.shiki = Object.assign(
        {
            theme: "github-light",
        },
        hexo.config.shiki || {}
    ));

    const highlighter = require("./getHighlighter.js")(config)();

    hexo.extend.highlight.register("shiki", require("./lib.js")(highlighter));
} catch (e) {
    console.error(e);
}
