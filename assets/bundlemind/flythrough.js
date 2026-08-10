(function () {
  var root = document.getElementById('bm-fly');
  var data = window.BUNDLEMIND;
  if (!root || !data || !data.segments || !data.segments.length) return;

  /* The pace — quick rotation, then a beat on each selection — is baked into the
     clip itself. Driving it from JS meant pause()/play() per query, and every
     such cycle can wedge the decoder: it drops to readyState 2 and fires
     `waiting` forever, even with the whole file buffered. So the element just
     plays straight through and this script only keeps the page in sync with it. */

  var video = root.querySelector('video');
  var screenEl = root.querySelector('.bm-screen');
  var cap = root.querySelector('.bm-cap');
  var capType = cap.querySelector('.t'),
      capQuery = cap.querySelector('.q'),
      capDsl = cap.querySelector('.d'),
      capCount = cap.querySelector('.c b');
  var ticks = Array.prototype.slice.call(root.querySelectorAll('.bm-tick'));
  var listed = Array.prototype.slice.call(root.querySelectorAll('.bm-q'));

  var segs = data.segments;
  var colorOf = {}, labelOf = {};
  (data.types || []).forEach(function (t) { colorOf[t.id] = t.color; labelOf[t.id] = t.label; });

  var current = -1;

  function segmentAt(t) {
    for (var i = 0; i < segs.length; i++) {
      if (t >= segs[i].start && t < segs[i].end) return i;
    }
    return t >= segs[segs.length - 1].end ? segs.length - 1 : 0;
  }

  function render(i) {
    if (i === current) return;
    current = i;
    var s = segs[i];
    var color = colorOf[s.type] || '#5fa3f0';

    screenEl.style.setProperty('--seg', color);
    cap.style.setProperty('--seg', color);
    capType.textContent = labelOf[s.type] || s.type;
    capQuery.textContent = '“' + s.query + '”';
    capDsl.textContent = s.dsl;
    capCount.textContent = s.n.toLocaleString();

    ticks.forEach(function (b, bi) { b.setAttribute('aria-current', bi === i ? 'true' : 'false'); });
    listed.forEach(function (b, bi) { b.setAttribute('aria-current', bi === i ? 'true' : 'false'); });
  }

  function sync() { render(segmentAt(video.currentTime)); }

  video.addEventListener('timeupdate', sync);
  video.addEventListener('seeked', sync);
  video.addEventListener('playing', sync);

  /* Jump to the segment's freeze, which the encode puts a keyframe on — an
     off-keyframe seek makes the decoder walk forward and it can stall there.
     If it does stall anyway, reload the element at the target and carry on. */
  var recover = null;
  function goTo(i) {
    var target = segs[i].seek;
    render(i);
    video.currentTime = target;
    if (recover) clearTimeout(recover);
    recover = setTimeout(function () {
      recover = null;
      if (video.readyState >= 3 || Math.abs(video.currentTime - target) > 0.5) return;
      video.load();                       // decoder wedged on the seek — rebuild it
      video.currentTime = target;
      var p = video.play(); if (p && p.catch) p.catch(function () {});
    }, 900);
  }

  ticks.concat(listed).forEach(function (b) {
    b.addEventListener('click', function () { goTo(parseInt(b.dataset.i, 10)); });
  });

  render(0);
})();
