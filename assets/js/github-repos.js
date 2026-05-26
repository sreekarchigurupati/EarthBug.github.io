/* Live GitHub repo cards — fetched client-side, no token required. */
(function () {
  'use strict';

  function esc(s) {
    return (s == null ? '' : '' + s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function timeAgo(iso) {
    var then = new Date(iso).getTime();
    if (isNaN(then)) return '';
    var s = Math.floor((Date.now() - then) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 2592000) return Math.floor(s / 86400) + 'd ago';
    if (s < 31536000) return Math.floor(s / 2592000) + 'mo ago';
    return Math.floor(s / 31536000) + 'y ago';
  }

  function render(repos, mount) {
    mount.innerHTML = repos.map(function (r) {
      var lang = r.language ? '<span class="gh-lang"><span class="gh-dot"></span>' + esc(r.language) + '</span>' : '';
      var stars = r.stargazers_count ? '<span class="gh-stars">★ ' + r.stargazers_count + '</span>' : '';
      var desc = r.description ? '<p class="gh-desc">' + esc(r.description) + '</p>' : '<p class="gh-desc gh-desc-empty">No description.</p>';
      var updated = '<span class="gh-updated">' + esc(timeAgo(r.pushed_at || r.updated_at)) + '</span>';
      return '<a class="gh-card" href="' + esc(r.html_url) + '" target="_blank" rel="noopener">' +
             '  <h3 class="gh-name">' + esc(r.name) + '</h3>' +
             desc +
             '  <div class="gh-meta">' + lang + stars + updated + '</div>' +
             '</a>';
    }).join('');
    Array.prototype.forEach.call(mount.querySelectorAll('.gh-card'), function (el, i) {
      el.style.transitionDelay = (i * 60) + 'ms';
      requestAnimationFrame(function () { el.classList.add('gh-in'); });
    });
  }

  function init() {
    var mount = document.getElementById('github-repos');
    if (!mount) return;
    var user = mount.getAttribute('data-user') || 'sreekarchigurupati';
    var limit = parseInt(mount.getAttribute('data-limit') || '6', 10);

    mount.innerHTML = '<p class="gh-status">Loading from GitHub…</p>';

    fetch('https://api.github.com/users/' + encodeURIComponent(user) + '/repos?sort=updated&per_page=40')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var filtered = data
          .filter(function (r) { return !r.fork && !r.archived && !r.private; })
          .slice(0, limit);
        if (!filtered.length) {
          mount.innerHTML = '<p class="gh-status">No public repos found for <code>' + esc(user) + '</code>.</p>';
          return;
        }
        render(filtered, mount);
      })
      .catch(function () {
        mount.innerHTML = '<p class="gh-status gh-error">Couldn\u2019t load repos right now — try <a href="https://github.com/' + esc(user) + '" target="_blank" rel="noopener">GitHub directly</a>.</p>';
      });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
