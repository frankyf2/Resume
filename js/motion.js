/* motion.js — the batik motion layer.
   One grammar: blocks STAMP in, wax lines DRAW, dye FLOODS.
   Every page is complete without this file; it only adds movement.
   Reduced motion: no movement is started here at all (CSS keeps colour and state). */
(function () {
  'use strict';
  window.__motion = true;

  var html = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var raf = window.requestAnimationFrame.bind(window);

  /* ---------- word masks for headings ---------- */
  function splitWords(el) {
    if (el.__split) return 0;
    el.__split = true;
    var i = 0;
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        var parts = n.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          frag.appendChild(mask(document.createTextNode(p), i++));
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1) {
        var m = mask(null, i++);
        n.parentNode.insertBefore(m, n);
        m.firstChild.appendChild(n);
      }
    });
    return i;
  }
  function mask(child, i) {
    var o = document.createElement('span'); o.className = 'w-mask';
    var w = document.createElement('span'); w.className = 'w-in'; w.style.setProperty('--i', i);
    if (child) w.appendChild(child);
    o.appendChild(w);
    return o;
  }

  /* ---------- the first-visit curtain ---------- */
  (function () {
    var c = document.querySelector('.curtain');
    if (!c) return;
    if (!html.classList.contains('curtain-on') || reduce) { c.remove(); return; }
    setTimeout(function () { c.classList.add('out'); }, 820);
    setTimeout(function () { c.remove(); }, 1650);
  })();

  /* ---------- hero entrance: words rise, then the rest follows ---------- */
  document.querySelectorAll('[data-enter] [data-split]').forEach(function (h) {
    var n = splitWords(h);
    h.classList.add('is-split');
    var host = h.closest('[data-enter]');
    if (host && !reduce) {
      var base = html.classList.contains('curtain-on') ? 1050 : 0;
      host.style.setProperty('--d0', base + 'ms');
      host.style.setProperty('--d1', (base + 380 + n * 60) + 'ms');
      host.style.setProperty('--d2', (base + 700 + n * 60) + 'ms');
    }
  });

  /* ---------- header: a hairline once scrolled, tucks away going down ---------- */
  (function () {
    var header = document.querySelector('header');
    var menu = document.getElementById('site-menu');
    var thread = document.querySelector('.thread');
    var cssThread = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
    if (!header) return;
    var last = scrollY, queued = false;
    function update() {
      queued = false;
      var y = scrollY;
      header.classList.toggle('scrolled', y > 8);
      var open = menu && menu.classList.contains('open');
      if (!reduce && !open) header.classList.toggle('tucked', y > 420 && y > last + 2);
      if (y < last - 2 || y < 420) header.classList.remove('tucked');
      last = y;
      if (thread && !cssThread && !reduce) {
        var max = document.documentElement.scrollHeight - innerHeight;
        thread.style.transform = 'scaleX(' + (max > 0 ? y / max : 0).toFixed(4) + ')';
      }
    }
    addEventListener('scroll', function () { if (!queued) { queued = true; raf(update); } }, { passive: true });
    update();
    // keyboard focus inside the header always shows it
    header.addEventListener('focusin', function () { header.classList.remove('tucked'); });
  })();

  /* ---------- letter roll on nav words and the next-project name ---------- */
  function roll(el) {
    var text = el.textContent;
    if (!text.trim()) return;
    var wrap = document.createElement('span'); wrap.setAttribute('aria-hidden', 'true');
    var n = 0;
    text.split(/(\s+)/).forEach(function (word) {
      if (!word) return;
      if (/^\s+$/.test(word)) { wrap.appendChild(document.createTextNode(' ')); return; }
      var r = document.createElement('span'); r.className = 'roll';
      Array.prototype.forEach.call(word, function (ch) {
        var s = document.createElement('span');
        s.textContent = ch; s.setAttribute('data-c', ch); s.style.setProperty('--i', n++);
        r.appendChild(s);
      });
      wrap.appendChild(r);
    });
    el.textContent = '';
    el.appendChild(wrap);
  }
  if (!reduce) {
    document.querySelectorAll('header nav a').forEach(function (a) { a.setAttribute('aria-label', a.textContent.trim()); roll(a); });
    document.querySelectorAll('.next-link').forEach(function (a) {
      var label = (a.querySelector('.next-label') || {}).textContent || 'Next project';
      var name = a.querySelector('.next-name');
      if (!name) return;
      a.setAttribute('aria-label', label + ': ' + name.textContent.trim());
      roll(name);
    });
  }

  if (reduce) return; // everything below only moves things

  /* ---------- scroll stamps: lists arrive one block at a time ---------- */
  (function () {
    var sel = [
      '.projects > li', '.module', '.tl-item', '.cert-list > li', '.features > li', '.social > li',
      '.fact', '.figure', '.now', '.resume-cta', '.contact-form', '.about > p', '.group-title',
      '.case-lead', '.more', '.jump', '.next-up', '.statement-note', '.foot-word > span', '.snake-wrap', '#giscus-host'
    ].join(',');
    var items = Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function (el) {
      return !el.closest('.hero');
    });
    var counts = new Map();
    items.forEach(function (el) {
      var p = el.parentElement, k = counts.get(p) || 0;
      counts.set(p, k + 1);
      el.style.setProperty('--si', Math.min(k, 6));
      el.classList.add('st');
    });
    var heads = Array.prototype.slice.call(document.querySelectorAll('[data-split]')).filter(function (h) { return !h.closest('[data-enter]'); });
    heads.forEach(function (h) { splitWords(h); h.classList.add('h-split'); });

    if (!('IntersectionObserver' in window)) { items.concat(heads).forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.concat(heads).forEach(function (el) { io.observe(el); });
  })();

  /* ---------- the timeline's wax line draws as you read down it ---------- */
  (function () {
    var tl = document.querySelector('.timeline');
    if (!tl) return;
    tl.style.setProperty('--tl', 0);
    var queued = false;
    function upd() {
      queued = false;
      var r = tl.getBoundingClientRect();
      var p = (innerHeight * 0.7 - r.top) / r.height;
      tl.style.setProperty('--tl', Math.max(0, Math.min(1, p)).toFixed(3));
    }
    addEventListener('scroll', function () { if (!queued) { queued = true; raf(upd); } }, { passive: true });
    upd();
  })();

  /* ---------- odometer figures (MIRAR): the real number at rest, one full spin on arrival ---------- */
  (function () {
    var figs = document.querySelectorAll('.figure-num');
    if (!figs.length) return;
    figs.forEach(function (f) {
      var txt = f.textContent.trim();
      if (!/^\d+$/.test(txt)) return;
      f.setAttribute('aria-label', txt);
      f.textContent = '';
      var cols = [];
      Array.prototype.forEach.call(txt, function (d, i) {
        var odo = document.createElement('span'); odo.className = 'odo'; odo.setAttribute('aria-hidden', 'true');
        var strip = document.createElement('span');
        for (var k = 0; k < 30; k++) { var s = document.createElement('span'); s.textContent = k % 10; strip.appendChild(s); }
        odo.appendChild(strip);
        f.appendChild(odo);
        var spins = 1 + (i === txt.length - 1 ? 1 : 0);
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(' + (-d) + 'em)';
        cols.push({ strip: strip, to: -(+d + spins * 10), delay: i * 90 });
      });
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        cols.forEach(function (c) {
          setTimeout(function () {
            c.strip.style.transition = '';
            c.strip.style.transform = 'translateY(' + c.to + 'em)';
          }, c.delay + 150);
        });
      }, { threshold: 0.6 });
      io.observe(f);
    });
  })();

  /* ---------- the selvedge marquee's pause ---------- */
  document.querySelectorAll('[data-marquee]').forEach(function (m) {
    var b = m.querySelector('.marquee-pause');
    if (!b) return;
    b.addEventListener('click', function () {
      var on = m.classList.toggle('paused');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', on ? 'Play the moving list' : 'Pause the moving list');
    });
  });

  /* ---------- the cloth keeps re-stamping itself (pausable; stops off screen) ---------- */
  (function () {
    var cloth = document.querySelector('[data-cloth]');
    if (!cloth) return;
    var tiles = Array.prototype.slice.call(cloth.querySelectorAll('.tile:not(.portrait)'));
    var dyes = ['saffron', 'madder', 'indigo', 'wax'];
    var btn = cloth.querySelector('.cloth-pause');
    var paused = false, visible = true, timer = null, last = -1;
    function stamp(t, newDye) {
      if (newDye) {
        var cur = t.getAttribute('data-dye');
        var opts = dyes.filter(function (d) { return d !== cur; });
        t.setAttribute('data-dye', opts[Math.floor(Math.random() * opts.length)]);
      }
      t.classList.remove('restamp');
      void t.offsetWidth;
      t.classList.add('restamp');
    }
    function tick() {
      if (paused || !visible || document.hidden) return;
      var k;
      do { k = Math.floor(Math.random() * tiles.length); } while (k === last && tiles.length > 1);
      last = k;
      stamp(tiles[k], true);
    }
    function start() { if (!timer) timer = setInterval(tick, 2600); }
    var delay = (html.classList.contains('curtain-on') ? 1050 : 0) + 2600;
    setTimeout(start, delay);
    if (btn) btn.addEventListener('click', function () {
      paused = !paused;
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('aria-label', paused ? 'Resume the stamping' : 'Pause the stamping');
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cloth);
    }
    if (fine) tiles.forEach(function (t) {
      var lastHover = 0;
      t.addEventListener('pointerenter', function () {
        var now = Date.now();
        if (now - lastHover < 700) return;
        lastHover = now;
        stamp(t, true);
      });
    });
  })();

  if (!fine) return; // pointer toys below

  /* ---------- magnetic buttons ---------- */
  document.querySelectorAll('[data-magnetic], .icon-btn').forEach(function (el) {
    var strength = el.classList.contains('icon-btn') ? 0.35 : 0.28;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) * strength;
      var y = (e.clientY - (r.top + r.height / 2)) * strength * 1.3;
      el.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
    });
    el.addEventListener('pointerleave', function () { el.style.translate = ''; });
  });

  /* ---------- cursor: the canting tip and its wax ring ---------- */
  (function () {
    var dot = document.createElement('div'); dot.className = 'cur-dot'; dot.setAttribute('aria-hidden', 'true');
    var ring = document.createElement('div'); ring.className = 'cur-ring'; ring.setAttribute('aria-hidden', 'true');
    ring.innerHTML = '<i></i><b></b>';
    var label = ring.querySelector('b');
    document.body.appendChild(dot); document.body.appendChild(ring);
    var x = -100, y = -100, rx = -100, ry = -100, seen = false, running = false;
    function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)';
      if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) raf(loop); else running = false;
    }
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!seen) { seen = true; rx = x; ry = y; html.classList.add('has-cursor'); }
      if (!running) { running = true; raf(loop); }
      var t = e.target.closest ? e.target : null;
      var view = t && t.closest('[data-cursor]');
      var link = t && t.closest('a, button, [role="button"], label, summary, .tile');
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-link', !!link && !view);
      label.textContent = view ? view.getAttribute('data-cursor') : '';
    }, { passive: true });
    document.addEventListener('pointerdown', function () { ring.classList.add('is-down'); });
    document.addEventListener('pointerup', function () { ring.classList.remove('is-down'); });
    document.documentElement.addEventListener('mouseleave', function () { html.classList.add('cursor-hidden'); });
    document.documentElement.addEventListener('mouseenter', function () { html.classList.remove('cursor-hidden'); });
  })();
})();
