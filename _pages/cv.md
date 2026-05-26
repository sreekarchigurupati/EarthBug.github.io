---
layout: page
title: Curriculum Vitae
permalink: /cv/
hide_title: true
---

<section class="about-hero reveal">
  <h1 class="about-name">Curriculum <em>Vitae</em></h1>
  <p class="about-role">Sreekar Chigurupati · Neuroscience &amp; AI PhD Student</p>
  <p class="about-tag cv-links">
    <a href="{{ '/assets/cv.pdf' | relative_url }}" target="_blank" rel="noopener">Open in new tab ↗</a>
    <a href="{{ '/assets/cv.pdf' | relative_url }}" download="Sreekar-Chigurupati-CV.pdf">Download PDF ↓</a>
  </p>
</section>

<section class="section reveal cv-embed-wrap">
  <object class="cv-embed" data="{{ '/assets/cv.pdf' | relative_url }}#view=FitH" type="application/pdf">
    <iframe class="cv-embed" src="{{ '/assets/cv.pdf' | relative_url }}#view=FitH" title="Curriculum Vitae — PDF"></iframe>
    <p class="cv-fallback">
      Your browser can&rsquo;t display the embedded PDF.
      <a href="{{ '/assets/cv.pdf' | relative_url }}">Download the CV</a> instead.
    </p>
  </object>
</section>

<style>
.cv-links a { margin-right: 18px; }
.cv-embed-wrap { padding-top: 0; }
.cv-embed {
  display: block;
  width: 100%;
  height: 88vh;
  min-height: 600px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--bg-2);
}
.cv-fallback {
  font-family: var(--mono); font-size: 13px;
  color: var(--fg-dim); padding: 28px;
}
@media (max-width: 720px) {
  .cv-embed { height: 72vh; min-height: 460px; }
}
</style>
