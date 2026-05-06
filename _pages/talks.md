---
title: "Talks"
layout: page
permalink: /talks/
hide_title: true
---

<section class="about-hero reveal">
  <h1 class="about-name">Talks</h1>
  <p class="about-role">Selected presentations, lectures, and reading-group sessions</p>
</section>

<div class="talks-list reveal">
{% assign talks_by_year = site.talks | sort: "date" | reverse | group_by_exp: "talk", "talk.date | date: '%Y'" %}
{% for year in talks_by_year %}
  <h2 class="talks-year">{{ year.name }}</h2>
  {% for talk in year.items %}
  <article class="pub-item talk-item">
    {% if talk.image %}
    <a class="talk-thumb" href="{{ talk.link.url | default: '#' }}"{% if talk.link.url contains '://' %} target="_blank" rel="noopener"{% endif %} aria-label="{{ talk.title | escape }}">
      <img src="{{ site.url }}/assets/imgs/talks/{{ talk.image }}" alt="{{ talk.title | escape }}" loading="lazy" />
    </a>
    {% endif %}
    <div class="talk-body">
      <h3 class="pub-title">{{ talk.title }}</h3>
      <p class="pub-venue"><em>{{ talk.location }}</em> · {{ talk.date | date: "%b %-d, %Y" }}</p>
      {% if talk.description %}<p class="pub-authors">{{ talk.description }}</p>{% endif %}
    </div>
    {% if talk.link.url %}
    <div class="pub-links">
      <a href="{{ talk.link.url }}"{% if talk.link.url contains '://' %} target="_blank" rel="noopener"{% endif %}>{{ talk.link.display | default: "Slides" }}</a>
    </div>
    {% endif %}
  </article>
  {% endfor %}
{% endfor %}
</div>
