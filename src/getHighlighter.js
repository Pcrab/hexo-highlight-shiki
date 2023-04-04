const deasync = require("deasync");
const shiki = require("shiki");

module.exports = (config) => {
    return deasync((cb) => {
        shiki
            .getHighlighter({
                theme: config.theme,
            })
            .then((hl) => {
                cb(null, hl);
            });
    });
};
