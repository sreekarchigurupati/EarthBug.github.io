/* lerp custom cursor + ring on interactive elements */
(function () {
  if (window.matchMedia('(max-width: 720px), (pointer: coarse)').matches) return;
  const c = document.getElementById('cursor');
  if (!c) return;

  let tx = 0, ty = 0, x = 0, y = 0;
  let started = false;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    // First move after a (re)load: snap to the real pointer position and
    // reveal the cursor — avoids the glide-from-centre jump on navigation.
    if (!started) {
      started = true;
      x = tx; y = ty;
      c.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      c.classList.add('is-active');
    }
  });

  function loop() {
    if (started) {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      c.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(loop);
  }
  loop();

  const interactive = 'a, button, .work-row, [data-cursor-ring]';
  document.querySelectorAll(interactive).forEach((el) => {
    el.addEventListener('mouseenter', () => c.classList.add('ring'));
    el.addEventListener('mouseleave', () => c.classList.remove('ring'));
  });
})();
