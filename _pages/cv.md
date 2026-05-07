---
layout: page
title: Curriculum Vitae
permalink: /cv/
---

<style>
.buttonDownload {
  display: inline-block;
  position: relative;
  padding: 10px 25px;
  border-radius: 25px;
  background-color: #d7bef7;
  color: white;
  font-family: sans-serif;
  text-decoration: none;
  font-size: 0.9em;
  text-align: center;
  text-indent: 15px;
}
.buttonDownload:hover { background-color: #333; color: white; }
.buttonDownload:before, .buttonDownload:after {
  content: ' ';
  display: block;
  position: absolute;
  left: 15px;
  top: 52%;
}
.buttonDownload:before {
  width: 10px; height: 2px;
  border-style: solid; border-width: 0 2px 2px;
}
.buttonDownload:after {
  width: 0; height: 0;
  margin-left: 3px; margin-top: -7px;
  border-style: solid; border-width: 4px 4px 0 4px;
  border-color: transparent; border-top-color: inherit;
  animation: downloadArrow 2s linear infinite;
  animation-play-state: paused;
}
.buttonDownload:hover:before { border-color: #d7bef7; }
.buttonDownload:hover:after  { border-top-color: #d7bef7; animation-play-state: running; }
@keyframes downloadArrow {
  0%     { margin-top: -7px;  opacity: 1; }
  0.001% { margin-top: -15px; opacity: 0; }
  50%    { opacity: 1; }
  100%   { margin-top: 0;     opacity: 0; }
}
</style>

<section class="about-hero reveal">
  <h1 class="about-name">Curriculum Vitae</h1>
  <p class="about-role">Sreekar Chigurupati · Neuroscience &amp; AI PhD Student</p>
  <p class="about-tag">
    <a href="/assets/cv.pdf" class="buttonDownload" download="Sreekar-CV.pdf">Download PDF</a>
  </p>
</section>

<section class="cv-section reveal">
  <h2>Education</h2>
  <div class="cv-entry">
    <div class="cv-when">2024 — present</div>
    <div class="cv-what">
      <h3>PhD, Neuroscience &amp; Artificial Intelligence</h3>
      <p class="cv-where">University · Department</p>
      <p>Research at the intersection of computational neuroscience and representation learning. Advisor: TBD.</p>
    </div>
  </div>
  <div class="cv-entry">
    <div class="cv-when">2020 — 2024</div>
    <div class="cv-what">
      <h3>BS / MS in Computer Science (or equivalent)</h3>
      <p class="cv-where">University</p>
      <p>Coursework in machine learning, statistics, signal processing, and computational neuroscience.</p>
    </div>
  </div>
</section>

<section class="cv-section reveal">
  <h2>Research Experience</h2>
  <div class="cv-entry">
    <div class="cv-when">2025</div>
    <div class="cv-what">
      <h3>Research Intern</h3>
      <p class="cv-where">Industry Lab</p>
      <p>Worked on probing methods for large self-supervised audio models; contributed to an internal evaluation harness.</p>
    </div>
  </div>
  <div class="cv-entry">
    <div class="cv-when">2023 — 2024</div>
    <div class="cv-what">
      <h3>Undergraduate Researcher</h3>
      <p class="cv-where">University Lab</p>
      <p>Studied learning dynamics in simple recurrent models; wrote the first preprint that eventually became my PhD pitch.</p>
    </div>
  </div>
</section>

<section class="cv-section reveal">
  <h2>Teaching</h2>
  <ul class="cv-list">
    <li><strong>2025 — Graduate ML course (TA)</strong> — problem sets, office hours, grading.</li>
    <li><strong>2024 — Intro to Python for scientists (instructor)</strong> — a short workshop for incoming grad students.</li>
  </ul>
</section>

<section class="cv-section reveal">
  <h2>Awards &amp; Honours</h2>
  <ul class="cv-list">
    <li><strong>2024</strong> — Departmental PhD Fellowship</li>
    <li><strong>2023</strong> — Best Undergraduate Thesis, Department</li>
    <li><strong>2022</strong> — University Dean's List</li>
  </ul>
</section>

<section class="cv-section reveal">
  <h2>Selected Publications</h2>
  <p>See the <a href="/publications/">publications page</a> for the full list and links.</p>
  <ul class="cv-list">
    <li><strong>Chigurupati, S.</strong> et al. Efficient probing of representation geometry in recurrent networks. <em>ICML 2026 Workshop</em>.</li>
    <li><strong>Chigurupati, S.</strong>, Coauthor, C. Sample-efficient contrastive audio representations. <em>NeurIPS 2025</em> (poster).</li>
    <li><strong>Chigurupati, S.</strong> Learning dynamics under limited supervision. arXiv, 2024.</li>
  </ul>
</section>

<section class="cv-section reveal">
  <h2>Skills</h2>
  <div class="about-tags">
    <span>Python</span><span>PyTorch</span><span>JAX</span><span>NumPy</span>
    <span>Jupyter</span><span>Git</span><span>Linux</span><span>LaTeX</span>
    <span>Matplotlib</span><span>scikit-learn</span><span>SLURM</span>
  </div>
</section>

<section class="cv-section reveal">
  <h2>Service</h2>
  <ul class="cv-list">
    <li>Reviewer — NeurIPS, ICML workshops (2025 — )</li>
    <li>Co-organiser — departmental paper reading group (2023 — )</li>
  </ul>
</section>

<section class="cv-section reveal">
  <h2>Contact</h2>
  <p>
    <a href="mailto:chigurupatisreekar@gmail.com">chigurupatisreekar@gmail.com</a> ·
    <a href="https://github.com/sreekarchigurupati">GitHub</a> ·
    {%- comment -%}<a href="https://scholar.google.com/citations?user=BXjw99IAAAAJ">Scholar</a> ·{%- endcomment -%}
    <a href="https://www.linkedin.com/in/sreekar-chigurupati">LinkedIn</a>
  </p>
</section>
