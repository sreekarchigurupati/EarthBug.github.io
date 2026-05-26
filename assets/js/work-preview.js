/* hover-driven floating preview tile for the .work-list / .work-row pattern */
(function () {
  if (window.matchMedia('(max-width: 720px), (pointer: coarse)').matches) return;
  const preview = document.getElementById('preview');
  if (!preview) return;
  const slots = preview.querySelectorAll('.slot');
  const rows = document.querySelectorAll('.work-row');
  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      preview.classList.add('show');
      slots.forEach((s) => s.classList.toggle('active', s.dataset.id === row.dataset.prev));
    });
    row.addEventListener('mouseleave', () => preview.classList.remove('show'));
  });
  document.addEventListener('mousemove', (e) => {
    if (!preview.classList.contains('show')) return;
    preview.style.left = e.clientX + 'px';
    preview.style.top = e.clientY + 'px';
  });
})();
