module.exports = (highlighter) => {
    return (code, options) => {
        try {
            return highlighter.codeToHtml(code, { lang: options.lang });
        } catch (e) {
            console.error(e);
            return `<pre><code>${code}</code></pre>`;
        }
    };
};
