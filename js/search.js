const render = marked.marked

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('results');

  // Fetch the search index
  fetch('/search-index.json')
    .then(response => response.json())
    .then(searchIndex => {
      searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const results = search(query, searchIndex);
        console.log(marked)
        // Clear previous results
        resultsContainer.innerHTML = '';

        // Display new results
        results.forEach(function (result) {
          console.log(result.item)
          const content = document.createElement('div');
          const li = document.createElement('li');
          const a  = document.createElement('a')
          a.appendChild(document.createTextNode(result.item.title))
          a.href = result.item.url
          li.innerHTML = render(result.item.content)
          resultsContainer.appendChild(a)
          resultsContainer.appendChild(li);
        });
      });
    })
    .catch(error => console.error('Error fetching search index:', error));

  function search(query, data) {
    const options = {
      keys: ['title', 'content'],
    };
    const fuse = new Fuse(data, options); // Create an empty Fuse object
    return fuse.search(query);
  }
});
