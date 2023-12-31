const fetch_exception = e => console.error('Error fetching search index', e)
const render          = marked.marked
const search_url      = '/search-index.json'
//-------------------------------------------------------------------
//-------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () =>
{
  const input     = document.getElementById('search-input')
  const viewbtn   = document.getElementById('toggle-button')
  const container = document.getElementById('results')
  const response  = await fetch(search_url).catch(fetch_exception)

  if (!response || !response.ok)
    throw new Error("Failed to fetch search index")

  const data           = await response.json()
  const do_search      = query =>
  {
    if (!query) return

    const words         = query.split(/\s+/)
    const search_pred   = item => { return words.every((word) => get_text(item).includes(word)) }
    const results       = data.filter(search_pred);
    container.innerHTML = ''

    results.forEach(item =>
    {
      const content = document.createElement('div')
      const prev    = document.createElement('div');
      const li      = document.createElement('li')
      const a       = document.createElement('a')
      a.href        = item.url
      prev.innerHTML    = item.content.length > 300 ? `${item.content.substring(0, 300)}...` : item.content
      content.innerHTML = render(item.content)

      li     .classList.add('collapsible')
      li     .classList.add('collapsed')
      prev   .classList.add('preview')
      prev   .classList.add('visible')
      content.classList.add('content')

      a        .appendChild(document.createTextNode(item.url))
      li       .appendChild(a)
      li       .appendChild(prev)
      li       .appendChild(content)
      container.appendChild(li)

        li.addEventListener('click', () =>
        {
          li  .classList.toggle('collapsed')
          prev.classList.toggle('collapsed')
        })
    })
  }
  const delayed_search = debounce(do_search, 400)
  //------------
  input.addEventListener('input', async () => { delayed_search(input.value.toLowerCase()) })

  viewbtn.addEventListener('click', () =>
  {
    document.querySelectorAll('.collapsible').forEach((item) =>
    {
      item.classList.toggle('collapsed')
    })
    document.querySelectorAll('.preview').forEach((item) =>
    {
      item.classList.toggle('collapsed')
      item.classList.toggle('visible')
    })
  })
})
//-------------------------------------------------------------------
function debounce (fn, ms)
{
  let timer
  return (...args) =>
  {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => { fn(...args) }, ms)
  }
}
//-------------------------------------------------------------------
function get_text(item) { return `${item.url} ${item.title} ${item.content}`.toLowerCase() }
