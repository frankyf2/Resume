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

/* ---- theme toggle ---- */
(function () {
  var btn = document.getElementById('theme-btn');
  if (!btn) return;
  function apply(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    btn.textContent = theme === 'light' ? '◑' : '◐';
  }
  var current = (function () { try { return localStorage.getItem('theme'); } catch (e) { return null; } })();
  apply(current === 'light' ? 'light' : 'dark');
  btn.addEventListener('click', function () {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    var next = isLight ? 'dark' : 'light';
    apply(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

/* ---- command palette ---- */
(function () {
  var btn = document.getElementById('palette-btn');
  var inWork = location.pathname.indexOf('/work/') !== -1;
  var p = inWork ? '../' : '';
  var wp = inWork ? '' : 'work/';
  var items = [
    { name: 'Home', tag: 'page start', href: p + 'index.html' },
    { name: 'Work — all projects', tag: 'page projects list', href: p + 'work.html' },
    { name: 'About', tag: 'page bio skills timeline certificates', href: p + 'about.html' },
    { name: 'Contact', tag: 'page email form', href: p + 'contact.html' },
    { name: 'MIRAR Platform', tag: 'project blazor certificate quiz survey', href: p + wp + 'mirar.html' },
    { name: 'iSeliaIntel', tag: 'project risk intelligence regulatory', href: p + wp + 'iseliaintel.html' },
    { name: 'iSusun', tag: 'project kanban open source docker', href: p + wp + 'isusun.html' },
    { name: 'star8892', tag: 'project alumni social network', href: p + wp + 'star8892.html' },
    { name: 'Autumn Twilight', tag: 'project mud dragonlance ongoing', href: p + wp + 'autumn-twilight.html' },
    { name: 'Résumé (PDF)', tag: 'download cv resume', href: p + 'resume.pdf' }
  ];

  var overlay, input, list;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'palette-overlay';
    overlay.innerHTML =
      '<div class="palette-box">' +
        '<input type="text" class="palette-input" placeholder="Search pages &amp; projects…" autocomplete="off">' +
        '<ul class="palette-list"></ul>' +
      '</div>';
    document.body.appendChild(overlay);
    input = overlay.querySelector('.palette-input');
    list = overlay.querySelector('.palette-list');
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter') {
        var active = list.querySelector('li');
        if (active) location.href = active.getAttribute('data-href');
      }
    });
  }

  function render() {
    var q = input.value.toLowerCase();
    var filtered = items.filter(function (it) {
      return !q || (it.name + ' ' + it.tag).toLowerCase().indexOf(q) !== -1;
    });
    list.innerHTML = filtered.map(function (it) {
      return '<li data-href="' + it.href + '">' + it.name + '<span>' + it.tag.split(' ')[0] + '</span></li>';
    }).join('') || '<li class="empty">No matches</li>';
    Array.prototype.forEach.call(list.querySelectorAll('li[data-href]'), function (li) {
      li.addEventListener('click', function () { location.href = li.getAttribute('data-href'); });
    });
  }

  function open() {
    if (!overlay) build();
    overlay.classList.add('show');
    input.value = '';
    render();
    setTimeout(function () { input.focus(); }, 30);
  }
  function close() {
    if (overlay) overlay.classList.remove('show');
  }

  if (btn) btn.addEventListener('click', open);
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (e.key === '/' && tag !== 'input' && tag !== 'textarea') {
      e.preventDefault();
      open();
    }
  });
})();

/* ---- cursor-follow blob (hero photo) ---- */
(function () {
  var frame = document.querySelector('.photo-frame');
  if (!frame || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var blob = frame.querySelector('.blob');
  if (!blob) return;
  document.addEventListener('mousemove', function (e) {
    var r = frame.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    var dx = (e.clientX - cx) / r.width;
    var dy = (e.clientY - cy) / r.height;
    blob.style.transform = 'translate(' + (dx * 14).toFixed(1) + 'px,' + (dy * 14).toFixed(1) + 'px)';
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
