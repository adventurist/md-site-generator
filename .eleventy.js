const Fuse = require('fuse.js')
const fs = require('fs')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("js");

  eleventyConfig.addFilter('searchIndex', async function (collection) {
    const index = await Promise.all(collection.map(async item => ({
      title: item.data.title,
      content: await item.template.inputContent,
      url: item.url,
    })));

    const fuse = new Fuse(index, { keys: ['title', 'content', 'url'] });
    const data = fuse.getIndex()
    fs.writeFileSync('_site/search-index.json', JSON.stringify(data.docs))
    return data.toJSON()
  });

  eleventyConfig.addCollection('searchIndex', async function (collection) {
    return await eleventyConfig.getFilter('searchIndex')(collection.getAll());
  });
};
