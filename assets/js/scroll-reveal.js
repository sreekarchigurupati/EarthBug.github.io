/* Scroll reveal + particle burst dispatcher */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        var rect = el.getBoundingClientRect();
        try {
          window.dispatchEvent(new CustomEvent('particle:burst', {
            detail: {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            }
          }));
        } catch (e) { /* ignore */ }
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  });
})();
