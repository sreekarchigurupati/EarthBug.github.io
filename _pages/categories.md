---
layout: page
title: Categories
permalink: /categories/
---
Archives are sorted by newest first
<nav class="menu archives text-center" aria-label="browse archives">
  <strong aria-hidden="true">Browse archives by:</strong>
  <a href="/archive">year</a>
  <a href="/categories" class="active" aria-current="page">category</a>
  <a href="/tags">tag</a>
</nav>


{% include archives/by-taxonomy.html taxonomy="Categories" items=site.categories %}