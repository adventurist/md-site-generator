const fetch_exception = e => console.error('Error fetching search index')
const render          = marked.marked
const search_url      = '/search-index.json'
const fuse_options    = { keys: ['title', 'content'],
                          threshold: 0.2,
                          caseSensitive: false }
//-------------------------------------------------------------------
//-------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () =>
{
  const input     = document.getElementById('search-input')
  const container = document.getElementById('results')
  const response  = await fetch(search_url).catch(fetch_exception)

  if (!response || !response.ok)
    throw new Error("Failed to fetch search index")

  const data = await response.json()
  const fuse = new Fuse(data, fuse_options)
  const do_search = query =>
    {
      if (!query) return

      const results       = fuse.search(query)
      container.innerHTML = ''

      results.forEach(result =>
      {
        const content = document.createElement('div')
        const li      = document.createElement('li')
        const a       = document.createElement('a')
        a.href        = result.item.url
        li.innerHTML  = render(result.item.content)

        a        .appendChild(document.createTextNode(result.item.title))
        container.appendChild(a)
        container.appendChild(li)
      })
    }

    const delayed_search = debounce(do_search, 400)

  //------------
  input.addEventListener('input', async () =>
  {
    delayed_search(input.value.toLowerCase())
  })
})
//-------------------------------------------------------------------
function search (query, data)
{
  return new Fuse(data, { keys: ['title', 'content'] }).search(query)
}
//-------------------------------------------------------------------
function debounce (func, delay)
{
  let timer
  return (...args) =>
  {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => { func(...args) }, delay)
  }
}
