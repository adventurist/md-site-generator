const fs   = require('fs')
const Fuse = require('fuse.js')
const keys = ['title', 'content', 'url']
//----------------------------------------------------------------------------
module.exports = config =>
{
  config.setTemplateFormats(['md', 'njk'])
  config.addLayoutAlias('default', '_includes/base.njk')
  config.addPassthroughCopy("js")
  config.addFilter('searchIndex', async collection =>
  {
    const index = await Promise.all(collection.map(async item => (
    {
      title:         item.data.title,
      content: await item.template.inputContent,
      url:           item.url
    })))

    const fuse = new Fuse(index, { keys })
    const data = fuse.getIndex()

    fs.writeFileSync('_site/search-index.json', JSON.stringify(data.docs))
    return data.toJSON()
  })
  //-------------------------
  config.addCollection('searchIndex', async collection =>
  {
    return await config.getFilter('searchIndex')(collection.getAll());
  })
}
