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



  /* ---------- statement: words light up as you read down ---------- */
  (function () {
    var host = document.querySelector('[data-moment="word-highlight"] .mo-wh__text');
    if (!host || reduce) return;
    function wrapText(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 1) { wrapText(n); return; }
        if (n.nodeType !== 3) return;
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          var w = document.createElement('span'); w.className = 'wh-w'; w.textContent = p; frag.appendChild(w);
        });
        n.parentNode.replaceChild(frag, n);
      });
    }
    wrapText(host);
    host.classList.add('wh');
    var words = host.querySelectorAll('.wh-w'), last = -1, queued = false;
    function upd() {
      queued = false;
      var r = host.getBoundingClientRect(), vh = innerHeight;
      var start = vh * 0.85, end = vh * 0.45;
      var t = Math.max(0, Math.min(1, (start - r.top) / Math.max(1, (start - end) + r.height)));
      var atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      var k = atEnd ? words.length : Math.round(t * words.length);
      if (k === last) return;
      last = k;
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < k);
    }
    addEventListener('scroll', function () { if (!queued) { queued = true; raf(upd); } }, { passive: true });
    addEventListener('resize', upd);
    upd();
  })();

  /* ---------- projects bath: the new ground opens through a circle ---------- */
  (function () {
    var sec = document.querySelector('[data-moment="iris-opens"]');
    if (!sec || reduce) return;
    var cover = document.createElement('div'); cover.className = 'iris-cover'; cover.setAttribute('aria-hidden', 'true');
    var ring = document.createElement('div'); ring.className = 'iris-ring'; ring.setAttribute('aria-hidden', 'true');
    sec.appendChild(cover); sec.appendChild(ring);
    sec.classList.add('iris-on');
    var wrap = sec.querySelector(':scope > .wrap');
    var queued = false, done = false;
    function upd() {
      queued = false;
      var r = sec.getBoundingClientRect(), vh = innerHeight;
      var u = Math.max(0, Math.min(1, (vh * 0.98 - r.top) / (vh * 0.78)));
      var t = 1 - (1 - u) * (1 - u);
      var v0 = Math.max(0, r.top), v1 = Math.min(vh, r.bottom);
      var cx = r.width / 2, cy = (v0 - r.top) + Math.max(0, v1 - v0) / 2;
      var R = Math.hypot(Math.max(cx, r.width - cx), Math.max(cy, r.height - cy)) + 2;
      // write only to the two leaf layers (and the wrap's own opacity), never to the section:
      // a custom property set on the section would restyle every descendant on each scroll frame
      var rad = t * R;
      cover.style.setProperty('--iris-x', cx.toFixed(1) + 'px');
      cover.style.setProperty('--iris-y', cy.toFixed(1) + 'px');
      cover.style.setProperty('--iris-r', rad.toFixed(1) + 'px');
      ring.style.transform = 'translate(' + (cx - rad).toFixed(1) + 'px,' + (cy - rad).toFixed(1) + 'px)';
      ring.style.width = ring.style.height = (2 * rad).toFixed(1) + 'px';
      ring.style.opacity = (1 - Math.max(0, (t - 0.85) / 0.15)).toFixed(3);
      if (wrap) wrap.style.opacity = Math.max(0, Math.min(1, (t - 0.15) / 0.45)).toFixed(3);
      var d = t >= 0.999;
      if (d !== done) { done = d; sec.classList.toggle('iris-done', d); }
    }
    addEventListener('scroll', function () { if (!queued) { queued = true; raf(upd); } }, { passive: true });
    addEventListener('resize', upd);
    upd();
  })();

  /* ---------- little toasts (same look as main.js) ---------- */
  function toast(text, ms) {
    var el = document.createElement('div');
    el.className = 'egg-toast'; el.setAttribute('role', 'status'); el.textContent = text;
    document.body.appendChild(el);
    raf(function () { raf(function () { el.classList.add('show'); }); });
    setTimeout(function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 320); }, ms || 2600);
  }

  /* ---------- teh tarik: pulled high, poured back, served ---------- */
  var pouring = false;
  function pourTeh() {
    if (pouring) return;
    if (reduce) { toast('Teh tarik satu, siap!'); return; }
    pouring = true;
    var o = document.createElement('div');
    o.className = 'pour'; o.setAttribute('aria-hidden', 'true');
    o.innerHTML = '<svg viewBox="0 0 200 360">' +
      '<g class="p-mug"><path class="p-tea" d="M100 30H146V74H100Z"/><path class="p-line" d="M96 20H150V78H96Z"/><path class="p-line" d="M150 32C166 34 166 62 150 64"/></g>' +
      '<path class="p-stream" d="M100 82V252"/>' +
      '<path class="p-tea p-fill" d="M66.6 262 75.6 341H132.4L141.4 262Z"/>' +
      '<path class="p-froth" d="M65 252C88 244 120 244 143 252L141.6 266C120 259 88 259 66.4 266Z"/>' +
      '<path class="p-line" d="M62 242 73 346H135L146 242"/>' +
      '<path class="p-steam" d="M92 236C86 226 98 220 92 208"/><path class="p-steam" d="M118 236C112 226 124 220 118 208"/>' +
      '</svg>';
    document.body.appendChild(o);
    setTimeout(function () { toast('Teh tarik satu, siap!'); }, 1900);
    setTimeout(function () { o.remove(); pouring = false; }, 3050);
  }

  /* ---------- emergency meeting: somebody typed "sus" ---------- */
  var meeting = false;
  function emergency() {
    if (meeting) return;
    if (reduce) { toast('Emergency meeting. Somebody here is sus.', 3000); return; }
    meeting = true;
    var o = document.createElement('div');
    o.className = 'meeting'; o.setAttribute('role', 'alert');
    var word = function (w, base) {
      return '<span class="m-word">' + Array.prototype.map.call(w, function (c, i) {
        return '<span style="--i:' + (base + i) + '">' + c + '</span>';
      }).join('') + '</span>';
    };
    o.innerHTML = '<div class="m-beams"></div><div class="m-flash"></div>' +
      '<div class="m-stage">' +
        '<svg class="m-siren" viewBox="0 0 120 120" aria-hidden="true"><path class="m-dome" d="M30 82C30 44 44 26 60 26S90 44 90 82Z"/><path class="m-shine" d="M44 70C44 50 50 40 58 36"/><rect class="m-base" x="20" y="82" width="80" height="16" rx="4"/><path class="m-ray" d="M60 6V16M24 24 31 31M96 24 89 31M6 60H16M114 60H104"/></svg>' +
        '<p class="m-title" aria-label="Emergency meeting">' + word('EMERGENCY', 0) + word('MEETING', 9) + '</p>' +
        '<p class="m-sub">Somebody typed <b>sus</b>. Discuss.</p>' +
      '</div>';
    document.body.appendChild(o);
    var main = document.getElementById('main');
    if (main) { main.classList.add('m-shake'); setTimeout(function () { main.classList.remove('m-shake'); }, 700); }
    setTimeout(function () { o.classList.add('out'); }, 2900);
    setTimeout(function () { o.remove(); meeting = false; }, 3400);
  }

  // triggers: main.js typing buffer, buttons on the page, and the command palette (via hash)
  addEventListener('teh-tarik', pourTeh);
  addEventListener('emergency-meeting', emergency);
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-teh], [data-sus]');
    if (!t) return;
    if (t.hasAttribute('data-teh')) pourTeh(); else emergency();
  });
  function fromHash() {
    var h = location.hash;
    if (h !== '#teh-tarik' && h !== '#emergency-meeting') return;
    var pal = document.querySelector('.palette-overlay:not([hidden])');
    if (pal) pal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    history.replaceState(null, '', location.pathname + location.search);
    if (h === '#teh-tarik') pourTeh(); else emergency();
  }
  addEventListener('hashchange', fromHash);
  setTimeout(fromHash, 400);

  // on touch, tapping a menu item plays its dish once
  document.querySelectorAll('.menu-item').forEach(function (li) {
    li.addEventListener('click', function () {
      li.classList.remove('play'); void li.offsetWidth; li.classList.add('play');
      clearTimeout(li.__t); li.__t = setTimeout(function () { li.classList.remove('play'); }, 1400);
    });
  });

  if (reduce) return; // everything below only moves things

  /* ---------- scroll stamps: lists arrive one block at a time ---------- */
  (function () {
    var sel = [
      '.projects > li', '.module', '.tl-item', '.cert-list > li', '.features > li', '.social > li',
      '.fact', '.figure', '.now', '.resume-cta', '.contact-form', '.about > p', '.group-title',
      '.case-lead', '.more', '.jump', '.menu-item', '.board-foot', '.game', '.next-up', '.statement-note', '.foot-word > span', '.snake-wrap', '#giscus-host'
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
    document.querySelectorAll('.tile-floor').forEach(function (el) { io.observe(el); });
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
    var bank = {};
    var tpl = document.getElementById('motif-bank');
    if (tpl && tpl.content) Array.prototype.forEach.call(tpl.content.querySelectorAll('svg'), function (sv) { bank[sv.getAttribute('data-m')] = sv; });
    var names = Object.keys(bank);
    function pick(list, not) {
      var opts = list.filter(function (x) { return not.indexOf(x) === -1; });
      return opts[Math.floor(Math.random() * opts.length)];
    }
    function stamp(t, newDye) {
      if (newDye) {
        t.setAttribute('data-dye', pick(dyes, [t.getAttribute('data-dye')]));
        // a fresh block: sometimes batik, sometimes something from the kopitiam
        if (names.length && Math.random() < 0.7) {
          var onCloth = tiles.map(function (x) { return x.getAttribute('data-motif'); });
          var m = pick(names, onCloth);
          if (m) {
            var old = t.querySelector('svg');
            var fresh = bank[m].cloneNode(true);
            fresh.removeAttribute('data-m');
            if (old) t.replaceChild(fresh, old); else t.appendChild(fresh);
            t.setAttribute('data-motif', m);
          }
        }
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
