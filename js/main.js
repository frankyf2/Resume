document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('nav ul');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }
});

/* ---- console easter egg ---- */
console.log(
  '%c👋 poking around, are we?',
  'font-family:monospace; font-size:14px; color:#4ECDC4; font-weight:bold;'
);
console.log(
  '%cthis whole site is one static repo — HTML, CSS, a bit of JS, and Jekyll includes for the nav/footer.\nno framework, no build step. if you found something broken, that\'s on me: abdullahharun96@gmail.com',
  'font-family:monospace; font-size:12px; color:#ACA3B8;'
);

/* ---- toast helper ---- */
function showToast(text, ms) {
  var el = document.createElement('div');
  el.className = 'egg-toast';
  el.textContent = text;
  document.body.appendChild(el);
  requestAnimationFrame(function () { el.classList.add('show'); });
  setTimeout(function () {
    el.classList.remove('show');
    setTimeout(function () { el.remove(); }, 400);
  }, ms || 3000);
}

/* ---- konami code ---- */
(function () {
  var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var pos = 0;
  document.addEventListener('keydown', function (e) {
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === seq[pos]) {
      pos++;
      if (pos === seq.length) {
        pos = 0;
        showToast('🎉 achievement unlocked: you remembered the Konami code', 3500);
        document.documentElement.style.setProperty('--coral', '#FFD54F');
        setTimeout(function () {
          document.documentElement.style.removeProperty('--coral');
        }, 4000);
      }
    } else {
      pos = (key === seq[0]) ? 1 : 0;
    }
  });
})();

/* ---- "sus" gag, typed anywhere ---- */
(function () {
  var buffer = '';
  document.addEventListener('keydown', function (e) {
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-3);
    if (buffer === 'sus') {
      showToast('🧑\u200d🚀 emergency meeting: this dev might be sus', 3000);
    }
  });
})();

