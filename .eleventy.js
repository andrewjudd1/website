// .eleventy.js
module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("css");

    return {
        dir: {
            input: ".",
            output: "_site",
        }
    };
};