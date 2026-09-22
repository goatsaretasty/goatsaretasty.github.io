// Posts marked `draft: true` show up under `npm start` so they can be
// previewed, and are left out of the production build entirely.
const isDraftInBuild = (data) => data.draft && process.env.ELEVENTY_RUN_MODE === "build";

export default {
  tags: "posts",
  layout: "post.njk",
  eleventyComputed: {
    permalink: (data) => (isDraftInBuild(data) ? false : `/blog/${data.page.fileSlug}/`),
    eleventyExcludeFromCollections: (data) => isDraftInBuild(data),
  },
};
