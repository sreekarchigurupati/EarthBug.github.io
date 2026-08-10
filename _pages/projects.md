---
layout: page
title: Projects
permalink: /projects/
hide_title: true
---

<section class="about-hero reveal">
  <h1 class="about-name">Selected work, <em>in progress.</em></h1>
  <p class="about-role">Research, open-source work, and side builds</p>
</section>

<section class="section reveal">
  <div class="section-head section-head--stacked">
    <div class="num">/ 02</div>
    <h2>Index of <em>projects.</em></h2>
    <div class="meta">09 Entries · Hover to preview</div>
  </div>

  <div class="work-list" id="workList">
    <a class="work-row" data-prev="sucor" href="/sucor">
      <div class="work-num">W.01</div>
      <div class="work-title">SuCor <em>— distortion correction, fast</em></div>
      <div class="work-tags"><span>Optimal Transport</span><span>MRI</span><span>Python</span></div>
    </a>
    <a class="work-row" data-prev="clairvoyant" href="/clairvoyant">
      <div class="work-num">W.02</div>
      <div class="work-title">Clairvoyant <em>— Claude Code on smart glasses</em></div>
      <div class="work-tags"><span>Android</span><span>Node/TS</span><span>Claude Code</span></div>
    </a>
    <a class="work-row" data-prev="bundlemind" href="/bundlemind">
      <div class="work-num">W.03</div>
      <div class="work-title">BundleMind <em>— ask for a pathway, get streamlines</em></div>
      <div class="work-tags"><span>Tractography</span><span>On-device LLM</span><span>DIPY/FURY</span></div>
    </a>
    <a class="work-row" data-prev="brainmri" href="#">
      <div class="work-num">W.04</div>
      <div class="work-title">Generalizable Brain MRI <em>— one model, many tasks</em></div>
      <div class="work-tags"><span>PyTorch</span><span>Foundation Models</span><span>MRI</span></div>
    </a>
    <a class="work-row" data-prev="forget" href="#">
      <div class="work-num">W.05</div>
      <div class="work-title">Catastrophic Forgetting in LLMs <em>— replay &amp; LoRA</em></div>
      <div class="work-tags"><span>LLaMA</span><span>LoRA</span><span>Continual Learning</span></div>
    </a>
    <a class="work-row" data-prev="dipy" href="https://github.com/dipy/dipy" target="_blank" rel="noopener">
      <div class="work-num">W.06</div>
      <div class="work-title">DIPY <em>— diffusion imaging in Python</em></div>
      <div class="work-tags"><span>Python</span><span>FURY</span><span>Open Source</span></div>
      <div class="work-arrow">↗</div>
    </a>
    <a class="work-row" data-prev="xmetal" href="#">
      <div class="work-num">W.07</div>
      <div class="work-title">XMetal <em>— an X server for macOS</em></div>
      <div class="work-tags"><span>Rust</span><span>Metal</span><span>GLX</span></div>
    </a>
    <a class="work-row" data-prev="track" href="#">
      <div class="work-num">W.08</div>
      <div class="work-title">Adaptive Object Tracking <em>— for the farm</em></div>
      <div class="work-tags"><span>OpenCV</span><span>SVM</span><span>C++</span></div>
    </a>
    <a class="work-row" data-prev="raga" href="#">
      <div class="work-num">W.09</div>
      <div class="work-title">Raga Detection <em>— Carnatic music IR</em></div>
      <div class="work-tags"><span>Audio</span><span>MIR</span><span>SVM</span></div>
    </a>
  </div>

  <div class="work-preview" id="preview" aria-hidden="true">
    <div class="slot active" data-id="sucor">
      <span class="label">SuCor</span>
      <span class="ttl">25 seconds, not 9 minutes.</span>
    </div>
    <div class="slot" data-id="clairvoyant">
      <span class="label">Clairvoyant</span>
      <span class="ttl">approve with a glance.</span>
    </div>
    <div class="slot" data-id="bundlemind">
      <span class="label">BundleMind</span>
      <span class="ttl">say it, see the tract.</span>
    </div>
    <div class="slot" data-id="brainmri">
      <span class="label">Brain MRI</span>
      <span class="ttl">one model, many tasks.</span>
    </div>
    <div class="slot" data-id="forget">
      <span class="label">Forget less</span>
      <span class="ttl">teaching LLMs to remember.</span>
    </div>
    <div class="slot" data-id="dipy">
      <span class="label">DIPY</span>
      <span class="ttl">open-source dMRI.</span>
    </div>
    <div class="slot" data-id="xmetal">
      <span class="label">XMetal</span>
      <span class="ttl">X11, rendered on Metal.</span>
    </div>
    <div class="slot" data-id="track">
      <span class="label">Tracking</span>
      <span class="ttl">76% out in the field.</span>
    </div>
    <div class="slot" data-id="raga">
      <span class="label">Raga ID</span>
      <span class="ttl">microtones, classified.</span>
    </div>
  </div>
</section>

<section class="about-section reveal">
  <h2>Live from <em>GitHub</em></h2>
  <p class="about-subtle">Most recently updated public repositories — fetched when the page loads.</p>
  <div id="github-repos" class="gh-grid" data-user="sreekarchigurupati" data-limit="6"></div>
</section>
