---\nlayout: base\ntitle: Home\n---
---
layout: base
title: Search
permalink: /search/
searchIndex: {{ collections.searchIndex }}
---
<script src="/js/marked.js"></script>
<script>
  console.log('Script loaded!');
  console.log(marked)
  console.log(window.marked)
</script>
<div>
  <input type="text" id="search-input" placeholder="Search...">
  <ul id="results"></ul>
</div>
<script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
<script>
  console.log('fuse loaded!');
</script>
<script src="/js/search.js"></script>
<script>
  console.log('search loaded!');
</script>