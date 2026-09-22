export default function (eleventyConfig) {
  // The portfolio page is hand-written HTML. Copy it through untouched rather
  // than running it through a template engine.
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );

  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));

  return {
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
  };
}
