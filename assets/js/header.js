/* topbar: solidify into a blurred bar once the page is scrolled */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
})();
