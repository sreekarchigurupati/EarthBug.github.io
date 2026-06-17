(function () {
  var root = document.getElementById('su-viewer');
  var data = window.SUCOR;
  if (!root || !data || !data.datasets || !data.datasets.length) return;

  var DEFAULT_FRAC = 0.28;   // inferior slice (near sinuses) shows the distortion
  var DEFAULT_WIPE = 72;     // open mostly on the distorted side (the "problem")
  var dsIndex = 0, slice = 0, showField = false, wipe = DEFAULT_WIPE, vertical = false;

  function ds() { return data.datasets[dsIndex]; }

  root.removeAttribute('data-loading');
  root.innerHTML =
    '<div class="su-ds"></div>' +
    '<div class="su-stage">' +
      '<span class="badge l">distorted</span><span class="badge r">corrected</span>' +
      '<img class="dist" alt="distorted EPI input"><img class="corr" alt="SuCor-corrected output"><img class="fmap" alt="estimated B0 fieldmap" style="display:none">' +
      '<div class="vline"></div><div class="vhandle" tabindex="0" role="slider" aria-label="reveal corrected image" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">⟷</div>' +
    '</div>' +
    '<div class="su-controls">' +
      '<label>slice <input type="range" class="slice" min="0" aria-label="slice"></label>' +
      '<button class="su-toggle fmap-btn">B0 field: off</button>' +
      '<span class="su-cbar" style="visibility:hidden">−<span class="strip"></span>+ <span class="unit"></span></span>' +
    '</div>';

  var stage = root.querySelector('.su-stage');
  var imgDist = root.querySelector('.dist'), imgCorr = root.querySelector('.corr'),
      imgFmap = root.querySelector('.fmap');
  var vline = root.querySelector('.vline'), vhandle = root.querySelector('.vhandle');
  var sliceInput = root.querySelector('.slice'), fmapBtn = root.querySelector('.fmap-btn');
  var cbar = root.querySelector('.su-cbar'), unit = root.querySelector('.unit');

  var dsWrap = root.querySelector('.su-ds');
  if (data.datasets.length > 1) {
    data.datasets.forEach(function (dd, i) {
      var b = document.createElement('button');
      b.textContent = dd.label; b.className = (i === 0 ? 'on' : '');
      b.onclick = function () { dsIndex = i; setupDataset(); setWipe(wipe); paint();
        dsWrap.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); };
      dsWrap.appendChild(b);
    });
  }

  function preload(list) { list.forEach(function (s) { var im = new Image(); im.src = s; }); }

  function setupDataset() {
    var d = ds(), s = d.slices;
    // Wipe along the phase-encode axis: AP (fMRI) distorts up/down, so wipe
    // vertically; LR (dMRI) distorts left/right, so wipe horizontally.
    vertical = /fmri/i.test(d.id || '') || /\b(AP|PA)\b/.test(d.meta || '');
    stage.classList.toggle('vert', vertical);
    vhandle.textContent = vertical ? '↕' : '⟷';
    vhandle.setAttribute('aria-label',
      vertical ? 'reveal corrected image (drag up/down)' : 'reveal corrected image (drag left/right)');
    sliceInput.max = s.distorted.length - 1;
    slice = Math.round(DEFAULT_FRAC * (s.distorted.length - 1));
    sliceInput.value = slice;
    unit.textContent = d.unit || '';
    preload(s.distorted); preload(s.corrected); preload(s.fieldmap);
  }

  function setWipe(pct) {
    wipe = Math.max(2, Math.min(98, pct));
    if (vertical) {
      imgCorr.style.clipPath = 'inset(' + wipe + '% 0 0 0)';
      vline.style.left = ''; vline.style.top = wipe + '%';
      vhandle.style.left = '50%'; vhandle.style.top = wipe + '%';
    } else {
      imgCorr.style.clipPath = 'inset(0 0 0 ' + wipe + '%)';
      vline.style.top = ''; vline.style.left = wipe + '%';
      vhandle.style.top = '50%'; vhandle.style.left = wipe + '%';
    }
    vhandle.setAttribute('aria-valuenow', Math.round(wipe));
  }

  function hideOnError(im) { im.onerror = function () { im.style.visibility = 'hidden'; }; }
  hideOnError(imgDist); hideOnError(imgCorr); hideOnError(imgFmap);

  function paint() {
    var s = ds().slices;
    imgDist.style.visibility = imgCorr.style.visibility = imgFmap.style.visibility = 'visible';
    imgDist.src = s.distorted[slice];
    imgCorr.src = s.corrected[slice];
    imgFmap.src = s.fieldmap[slice];
    var f = showField;
    imgFmap.style.display = f ? 'block' : 'none';
    imgDist.style.opacity = f ? 0 : 1;
    imgCorr.style.display = f ? 'none' : 'block';
    vline.style.display = vhandle.style.display = f ? 'none' : 'block';
    cbar.style.visibility = f ? 'visible' : 'hidden';
    stage.style.cursor = f ? 'default' : (vertical ? 'ns-resize' : 'ew-resize');
  }

  var dragging = false;
  function pctFromEvent(e) {
    var r = stage.getBoundingClientRect();
    if (vertical) {
      var y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
      return y / r.height * 100;
    }
    var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    return x / r.width * 100;
  }
  function down(e) { if (showField) return; if (!e.touches) e.preventDefault(); dragging = true; setWipe(pctFromEvent(e)); }
  function move(e) { if (dragging) { setWipe(pctFromEvent(e)); e.preventDefault(); } }
  function up() { dragging = false; }
  stage.addEventListener('mousedown', down); stage.addEventListener('touchstart', down, {passive:true});
  window.addEventListener('mousemove', move); window.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('mouseup', up); window.addEventListener('touchend', up);
  vhandle.addEventListener('keydown', function (e) {
    if (showField) return;
    var step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { setWipe(wipe - step); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { setWipe(wipe + step); e.preventDefault(); }
    else if (e.key === 'Home') { setWipe(2); e.preventDefault(); }
    else if (e.key === 'End') { setWipe(98); e.preventDefault(); }
  });

  sliceInput.addEventListener('input', function () { slice = +sliceInput.value; paint(); });
  fmapBtn.addEventListener('click', function () {
    showField = !showField;
    fmapBtn.classList.toggle('on', showField);
    fmapBtn.textContent = 'B0 field: ' + (showField ? 'on' : 'off');
    paint();
  });

  setupDataset(); setWipe(DEFAULT_WIPE); paint();
})();
