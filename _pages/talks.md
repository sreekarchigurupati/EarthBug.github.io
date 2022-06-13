---
title: "Talks"
layout: gridlay
permalink: /talks/
---

# Talks

{% assign number_printed = 0 %}
{% for talk in site.talks %}

{% assign even_odd = number_printed | modulo: 2 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-6 clearfix">
 <div class="well">
  <pubtit>{{ talk.title }}</pubtit>
  <p><img src="{{ site.url }}/assets/imgs/talks/{{ talk.image }}" class="img-responsive" width="50%" style="float: left"  alt="{{ talk.title }}"/></p>
  <p>{{ talk.description }}</p>

  <p style="float: none;"><em>{{ talk.location }}</em></p>
   <p><em>{{ talk.date | date: "%a, %b %d, %Y" }}</em></p>
  <p><strong><a href="{{ talk.link.url }}">{{ talk.link.display }}</a></strong></p>
  <p class="text-danger"><strong> {{ talk.news1 }}</strong></p>
  <p> {{ talk.news2 }}</p>
 </div>
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 1 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if even_odd == 1 %}
</div>
{% endif %}


