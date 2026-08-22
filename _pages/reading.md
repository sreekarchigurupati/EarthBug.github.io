---
layout: page
title: Reading
permalink: /reading/
hide_title: true
---

{%- assign reading = site.data.reading -%}

<section class="about-hero reveal">
  <h1 class="about-name"><em>Reading.</em></h1>
  <p class="about-role">A shelf, kept honest by <a href="https://hardcover.app" target="_blank" rel="noopener">Hardcover</a></p>
</section>

<section class="section reveal">
  <div class="section-head section-head--stacked">
    <div class="num">/ 01</div>
    <h2>Currently <em>reading</em>.</h2>
    {%- if reading.updated %}<div class="meta">Synced · {{ reading.updated | date: "%B %-d, %Y" }}</div>{% endif -%}
  </div>
  {% include book-shelf.html books=reading.current empty="Between books at the moment." %}
</section>

<section class="section reveal">
  <div class="section-head section-head--stacked">
    <div class="num">/ 02</div>
    <h2>Already <em>read</em>.</h2>
    {%- if reading.read %}<div class="meta">{{ reading.read | size }} books</div>{% endif -%}
  </div>
  {% include book-shelf.html books=reading.read empty="Nothing here yet." %}
</section>

<section class="section reveal">
  <div class="section-head section-head--stacked">
    <div class="num">/ 03</div>
    <h2>On the <em>shelf</em>.</h2>
    {%- if reading.owned and reading.owned.size > 0 %}<div class="meta">{{ reading.owned | size }} owned</div>{% endif -%}
  </div>
  {% include book-shelf.html books=reading.owned empty="No copies logged as owned yet." %}
</section>
