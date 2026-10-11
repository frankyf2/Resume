(function () {
  'use strict';

  var root = document.documentElement;
  var ROOT = root.getAttribute('data-root') || '';
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isTyping(el) {
    if (!el) return false;
    var t = (el.tagName || '').toLowerCase();
    return t === 'input' || t === 'textarea' || t === 'select' || el.isContentEditable;
  }

  /* ---- mobile nav ---- */
  (function () {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('site-menu');
    if (!toggle || !menu) return;
    function set(open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    }
    toggle.addEventListener('click', function () { set(!menu.classList.contains('open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { set(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) set(false);
    });
  })();

  /* ---- console easter egg ---- */
  console.log('%cpoking around, are we?', 'font-family:monospace; font-size:14px; color:#4ECDC4; font-weight:bold;');
  console.log(
    '%cthis whole site is one static repo: HTML, CSS and a bit of JS. no framework, no build step.\nif you found something broken, that\'s on me: abdullahharun96@gmail.com',
    'font-family:monospace; font-size:12px; color:#ACA3B8;'
  );

  /* ---- toast ---- */
  function showToast(text, ms) {
    var el = document.createElement('div');
    el.className = 'egg-toast';
    el.setAttribute('role', 'status');
    el.textContent = text;
    document.body.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('show'); }); });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 300);
    }, ms || 3000);
  }

  /* ---- konami + "sus" (never while typing in a field) ---- */
  (function () {
    var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    var pos = 0, buffer = '';
    document.addEventListener('keydown', function (e) {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      if (key === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          pos = 0;
          showToast('achievement unlocked: you remembered the Konami code', 3500);
          root.style.setProperty('--coral', '#FFD54F');
          root.style.setProperty('--coral-fill', '#FFD54F');
          setTimeout(function () {
            root.style.removeProperty('--coral');
            root.style.removeProperty('--coral-fill');
          }, 4000);
        }
      } else {
        pos = (key === seq[0]) ? 1 : 0;
      }

      if (e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-3);
        if (buffer === 'sus') showToast('emergency meeting: this dev might be sus', 3000);
      }
    });
  })();

  /* ---- theme (defaults to the OS preference until the visitor chooses) ---- */
  var giscusFrameTheme = function () {};
  (function () {
    var btn = document.getElementById('theme-btn');
    var metaColor = document.querySelectorAll('meta[name="theme-color"]');

    function current() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }

    function apply(theme) {
      root.setAttribute('data-theme', theme);
      if (btn) {
        var next = theme === 'light' ? 'dark' : 'light';
        btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
        btn.setAttribute('title', 'Switch to ' + next + ' theme');
      }
      for (var i = 0; i < metaColor.length; i++) {
        metaColor[i].setAttribute('content', theme === 'light' ? '#FAF7F2' : '#14121A');
        metaColor[i].removeAttribute('media');
      }
      giscusFrameTheme(theme);
    }

    apply(current());
    if (btn) {
      btn.addEventListener('click', function () {
        var next = current() === 'light' ? 'dark' : 'light';
        apply(next);
        try { localStorage.setItem('theme', next); } catch (e) {}
      });
    }
    // follow the OS if the visitor hasn't picked a side
    var mq = matchMedia('(prefers-color-scheme: light)');
    var onChange = function (e) {
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) apply(e.matches ? 'light' : 'dark');
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
  })();

  /* ---- command palette ---- */
  (function () {
    var btn = document.getElementById('palette-btn');
    var P = ROOT, W = 'work/'; // project pages always live in /work/, whichever page we're on
    var items = [
      { name: 'Home', tag: 'page start', href: P + 'index.html' },
      { name: 'Work: all projects', tag: 'page projects list', href: P + 'work.html' },
      { name: 'About', tag: 'page bio skills timeline certificates', href: P + 'about.html' },
      { name: 'Contact', tag: 'page email form guestbook', href: P + 'contact.html' },
      { name: 'MIRAR Platform', tag: 'project blazor certificate quiz survey', href: P + W + 'mirar.html' },
      { name: 'Puncak Nilam (PNMS)', tag: 'project blazor consultancy pnms puncak nilam enquiries insights', href: P + W + 'pnms.html' },
      { name: 'iSeliaIntel', tag: 'project risk intelligence regulatory', href: P + W + 'iseliaintel.html' },
      { name: 'iSusun', tag: 'project kanban open source docker', href: P + W + 'isusun.html' },
      { name: 'star8892', tag: 'project alumni social network', href: P + W + 'star8892.html' },
      { name: 'Autumn Twilight', tag: 'project mud dragonlance ongoing', href: P + W + 'autumn-twilight.html' },
      { name: 'Résumé (PDF)', tag: 'download cv resume', href: P + 'resume.pdf' }
    ];
    var overlay, input, list, shown = [], active = 0, opener = null;

    function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    function build() {
      overlay = document.createElement('div');
      overlay.className = 'palette-overlay';
      overlay.hidden = true;
      overlay.innerHTML =
        '<div class="palette-box" role="dialog" aria-modal="true" aria-label="Search pages and projects">' +
          '<input type="text" class="palette-input" placeholder="Search pages &amp; projects…" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="go" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list">' +
          '<ul class="palette-list" id="palette-list" role="listbox" aria-label="Results"></ul>' +
        '</div>';
      document.body.appendChild(overlay);
      input = overlay.querySelector('.palette-input');
      list = overlay.querySelector('.palette-list');

      overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
      input.addEventListener('input', function () { active = 0; render(); });
      list.addEventListener('mousemove', function (e) {
        var a = e.target.closest && e.target.closest('a');
        if (!a) return;
        var i = Number(a.getAttribute('data-i'));
        if (i !== active) { active = i; paint(); }
      });
      overlay.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Enter') {
          e.preventDefault();
          if (shown[active]) location.href = shown[active].href;
        }
        else if (e.key === 'Tab') { e.preventDefault(); } // focus stays in the dialog
      });
    }

    function move(d) {
      if (!shown.length) return;
      active = (active + d + shown.length) % shown.length;
      paint();
    }

    function paint() {
      var links = list.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        var on = i === active;
        links[i].setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) {
          input.setAttribute('aria-activedescendant', links[i].id);
          links[i].scrollIntoView({ block: 'nearest' });
        }
      }
    }

    function render() {
      var q = input.value.trim().toLowerCase();
      shown = items.filter(function (it) { return !q || (it.name + ' ' + it.tag).toLowerCase().indexOf(q) !== -1; });
      if (!shown.length) {
        list.innerHTML = '<li class="empty" role="option" aria-disabled="true">No matches</li>';
        input.removeAttribute('aria-activedescendant');
        return;
      }
      list.innerHTML = shown.map(function (it, i) {
        return '<li role="presentation"><a role="option" id="pal-' + i + '" data-i="' + i + '" href="' + esc(it.href) + '">' +
               esc(it.name) + '<span>' + esc(it.tag.split(' ')[0]) + '</span></a></li>';
      }).join('');
      paint();
    }

    function open() {
      if (!overlay) build();
      opener = document.activeElement;
      overlay.hidden = false;
      root.style.overflow = 'hidden';
      input.value = '';
      active = 0;
      render();
      input.focus();
    }
    function close() {
      if (!overlay || overlay.hidden) return;
      overlay.hidden = true;
      root.style.overflow = '';
      input.blur();
      if (opener && opener !== document.body && opener.focus) opener.focus();
    }

    if (btn) btn.addEventListener('click', open);
    document.addEventListener('keydown', function (e) {
      var slash = e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target);
      var cmdk = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (slash || cmdk) { e.preventDefault(); open(); }
    });
  })();

  /* ---- cursor-follow blob (fine pointers only, one write per frame) ---- */
  (function () {
    var frame = document.querySelector('.hero .photo-frame');
    if (!frame || reduceMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var blob = frame.querySelector('.blob');
    if (!blob) return;
    var x = 0, y = 0, queued = false;
    document.addEventListener('mousemove', function (e) {
      var r = frame.getBoundingClientRect();
      x = ((e.clientX - (r.left + r.width / 2)) / r.width) * 14;
      y = ((e.clientY - (r.top + r.height / 2)) / r.height) * 14;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        blob.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
        queued = false;
      });
    }, { passive: true });
  })();

  /* ---- contact form: inline sending / success / error (falls back to a normal POST) ---- */
  (function () {
    var form = document.querySelector('.contact-form');
    if (!form || !window.fetch || !window.FormData) return;
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var label = button.textContent;
      button.disabled = true;
      button.textContent = 'Sending…';
      status.className = 'form-status';
      status.textContent = '';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('bad status');
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Thanks. Your message is in; I\'ll reply within a day or two.';
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'That didn\'t send. Check your connection and try again, or email me directly.';
        })
        .then(function () {
          button.disabled = false;
          button.textContent = label;
        });
    });
  })();

  /* ---- guestbook (giscus) follows the site theme, not just the OS ---- */
  (function () {
    var host = document.getElementById('giscus-host');
    if (!host) return;
    function name(theme) { return theme === 'light' ? 'light' : 'dark'; }
    var s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    var attrs = {
      'data-repo': 'frankyf2/Resume', 'data-repo-id': 'R_kgDOHh4CHQ',
      'data-category': 'General', 'data-category-id': 'DIC_kwDOHh4CHc4DGSKU',
      'data-mapping': 'pathname', 'data-strict': '0', 'data-reactions-enabled': '1',
      'data-emit-metadata': '0', 'data-input-position': 'bottom', 'data-lang': 'en',
      'data-theme': name(root.getAttribute('data-theme'))
    };
    Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    host.appendChild(s);
    giscusFrameTheme = function (theme) {
      var frame = document.querySelector('iframe.giscus-frame');
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({ giscus: { setConfig: { theme: name(theme) } } }, 'https://giscus.app');
      }
    };
  })();

  /* ---- 404 snake ---- */
  (function () {
    var canvas = document.getElementById('snake');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var scoreEl = document.getElementById('snake-score');
    var size = 16, cols = canvas.width / size, rows = canvas.height / size;
    var snake, dir, food, score, alive, started;
    var HINT = 'Score: 0. Arrow keys, WASD or swipe to move.';

    function css(name, fallback) { return getComputedStyle(root).getPropertyValue(name).trim() || fallback; }
    function reset() {
      snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
      dir = { x: 1, y: 0 }; score = 0; alive = true; started = false;
      placeFood();
      scoreEl.textContent = HINT;
    }
    function placeFood() {
      do { food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }; }
      while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
    }
    function tick() {
      if (document.hidden) return;
      if (!alive || !started) return draw();
      var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows || snake.some(function (s) { return s.x === head.x && s.y === head.y; })) {
        alive = false;
        scoreEl.textContent = 'Game over. Score: ' + score + '. Move to play again.';
        return draw();
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { score++; scoreEl.textContent = 'Score: ' + score; placeFood(); }
      else snake.pop();
      draw();
    }
    function draw() {
      ctx.fillStyle = css('--surface', '#1E1B27');
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = css('--coral-fill', '#FF6B5B');
      ctx.fillRect(food.x * size + 2, food.y * size + 2, size - 4, size - 4);
      ctx.fillStyle = css('--teal-fill', '#4ECDC4');
      snake.forEach(function (s, i) {
        ctx.globalAlpha = i === 0 ? 1 : 0.75;
        ctx.fillRect(s.x * size + 1, s.y * size + 1, size - 2, size - 2);
      });
      ctx.globalAlpha = 1;
    }
    function steer(k) {
      if (!alive) { reset(); }
      if (k.x === -dir.x && k.y === -dir.y) return;
      dir = k; started = true;
    }
    reset(); draw();
    document.addEventListener('keydown', function (e) {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      var map = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }
      };
      var k = map[e.key];
      if (!k) return;
      if (e.key.indexOf('Arrow') === 0) e.preventDefault(); // don't scroll the page mid-game
      steer(k);
    });
    var sx = 0, sy = 0;
    canvas.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    canvas.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      steer(Math.abs(dx) > Math.abs(dy) ? { x: dx > 0 ? 1 : -1, y: 0 } : { x: 0, y: dy > 0 ? 1 : -1 });
    }, { passive: true });
    setInterval(tick, 140);
  })();
})();
