/* live clock in the topbar (and home hero "Local time" if present) */
(function () {
  const fmt = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false,
    timeZone: 'America/Indiana/Indianapolis',
  });
  function tick() {
    const t = fmt.format(new Date()) + ' EST';
    document.querySelectorAll('#clock, #localTime').forEach((el) => {
      el.textContent = t;
    });
  }
  tick();
  setInterval(tick, 1000 * 30);
})();
