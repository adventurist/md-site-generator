const fetch_exception = e => console.error('Error fetching search index')
const render          = marked.marked
const search_url      = '/search-index.json'
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

  //------------
  input.addEventListener('input', async () =>
  {
    const results       = search(input.value.toLowerCase(), data)
    container.innerHTML = ''

    results.forEach(result =>
    {
      const content = document.createElement('div');
      const li      = document.createElement('li');
      const a       = document.createElement('a')
      a.href        = result.item.url
      li.innerHTML  = render(result.item.content)

      a        .appendChild(document.createTextNode(result.item.title))
      container.appendChild(a)
      container.appendChild(li);
    })
  })
})
//-------------------------------------------------------------------
function search (query, data)
{
  return new Fuse(data, { keys: ['title', 'content'] }).search(query)
}
