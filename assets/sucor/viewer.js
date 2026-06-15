(function () {
  var root = document.getElementById('su-viewer');
  var data = window.SUCOR;
  if (!root || !data || !data.datasets || !data.datasets.length) return;

  var dsIndex = 0, slice = 0, showField = false, wipe = 50;

  function ds() { return data.datasets[dsIndex]; }
  function mid(arr) { return Math.floor(arr.length / 2); }

  root.removeAttribute('data-loading');
  root.innerHTML =
    '<div class="su-ds"></div>' +
    '<div class="su-stage">' +
      '<span class="badge l">distorted</span><span class="badge r">corrected</span>' +
      '<img class="dist" alt="distorted"><img class="corr" alt="corrected"><img class="fmap" alt="fieldmap" style="display:none">' +
      '<div class="vline"></div><div class="vhandle">⟷</div>' +
    '</div>' +
    '<div class="su-controls">' +
      '<label>slice <input type="range" class="slice" min="0"></label>' +
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
      b.onclick = function () { dsIndex = i; setupDataset(); paint();
        dsWrap.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); };
      dsWrap.appendChild(b);
    });
  }

  function preload(list) { list.forEach(function (s) { var im = new Image(); im.src = s; }); }

  function setupDataset() {
    var s = ds().slices;
    sliceInput.max = s.distorted.length - 1;
    slice = mid(s.distorted);
    sliceInput.value = slice;
    unit.textContent = ds().unit || '';
    preload(s.distorted); preload(s.corrected); preload(s.fieldmap);
  }

  function setWipe(pct) {
    wipe = Math.max(2, Math.min(98, pct));
    imgCorr.style.clipPath = 'inset(0 0 0 ' + wipe + '%)';
    vline.style.left = wipe + '%'; vhandle.style.left = wipe + '%';
  }

  function paint() {
    var s = ds().slices;
    imgDist.src = s.distorted[slice];
    imgCorr.src = s.corrected[slice];
    imgFmap.src = s.fieldmap[slice];
    var f = showField;
    imgFmap.style.display = f ? 'block' : 'none';
    imgDist.style.opacity = f ? 0 : 1;
    imgCorr.style.display = f ? 'none' : 'block';
    vline.style.display = vhandle.style.display = f ? 'none' : 'block';
    cbar.style.visibility = f ? 'visible' : 'hidden';
    stage.style.cursor = f ? 'default' : 'ew-resize';
  }

  var dragging = false;
  function pctFromEvent(e) {
    var r = stage.getBoundingClientRect();
    var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    return x / r.width * 100;
  }
  function down(e) { if (showField) return; dragging = true; setWipe(pctFromEvent(e)); }
  function move(e) { if (dragging) { setWipe(pctFromEvent(e)); e.preventDefault(); } }
  function up() { dragging = false; }
  stage.addEventListener('mousedown', down); stage.addEventListener('touchstart', down, {passive:true});
  window.addEventListener('mousemove', move); window.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('mouseup', up); window.addEventListener('touchend', up);

  sliceInput.addEventListener('input', function () { slice = +sliceInput.value; paint(); });
  fmapBtn.addEventListener('click', function () {
    showField = !showField;
    fmapBtn.classList.toggle('on', showField);
    fmapBtn.textContent = 'B0 field: ' + (showField ? 'on' : 'off');
    paint();
  });

  setupDataset(); setWipe(50); paint();
})();
