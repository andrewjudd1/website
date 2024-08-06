// .eleventy.js
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("svgdrawings/my_svgs");

    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addCollection("svgs", function (collectionApi) {
        const svgDir = "svgdrawings/my_svgs";
        const svgs = fs.readdirSync(svgDir).map(file => {
            const filePath = path.join(svgDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            return {
                content: content,
                fileName: file
            };
        });
        return svgs;
    });
    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "snippets"
        }
    };
};