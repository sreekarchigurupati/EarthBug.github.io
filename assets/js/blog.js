/* Blog category filter — progressive enhancement.
   Without JS every post stays visible; this only adds client-side filtering. */
(function () {
  var chips = document.querySelectorAll('.blog-filters .filter-chip');
  var items = document.querySelectorAll('.blog-list .blog-item');
  if (!chips.length || !items.length) return;

  var empty = document.querySelector('.blog-empty');

  function apply(filter) {
    var shown = 0;
    items.forEach(function (li) {
      var cats = (li.dataset.categories || '').split(/\s+/);
      var match = filter === 'all' || cats.indexOf(filter) !== -1;
      li.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (btn) {
    btn.addEventListener('click', function () {
      chips.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      apply(btn.dataset.filter);
    });
  });
})();
