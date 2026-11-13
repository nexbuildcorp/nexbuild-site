(function () {
  const root = document.documentElement;
  // Header shadow on scroll
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  function setMenu(open) {
    mobileNav.setAttribute('data-open', String(open));
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', () => setMenu(mobileNav.getAttribute('data-open') !== 'true'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Scroll reveals
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('is-visible'));
  }


  // Project photo lightbox
  const dataEl = document.getElementById('galleryData');
  const lb = document.getElementById('lightbox');
  if (dataEl && lb) {
    const data = JSON.parse(dataEl.textContent);
    const img = document.getElementById('lbImg');
    const cap = document.getElementById('lbCap');
    let site = null, idx = 0, lastFocus = null;
    const src = (s, id) => './assets/projects/' + s + '/' + id + '.webp';
    function show(i) {
      const list = data[site].items;
      idx = (i + list.length) % list.length;
      img.src = src(site, list[idx]);
      img.alt = data[site].label + ' — project photo ' + (idx + 1) + ' of ' + list.length;
      cap.textContent = data[site].label + ' · ' + (idx + 1) + ' / ' + list.length;
      // preload neighbours
      [idx + 1, idx - 1].forEach(j => { const p = new Image(); p.src = src(site, list[(j + list.length) % list.length]); });
    }
    function open(s, i, trigger) {
      site = s; lastFocus = trigger || document.activeElement;
      lb.hidden = false; document.body.classList.add('lb-open');
      show(i);
      document.getElementById('lbClose').focus();
    }
    function close() {
      lb.hidden = true; document.body.classList.remove('lb-open'); img.src = '';
      lastFocus && lastFocus.focus && lastFocus.focus();
    }
    document.querySelectorAll('[data-site][data-index]').forEach(btn => {
      btn.addEventListener('click', () => open(btn.dataset.site, Number(btn.dataset.index), btn));
    });
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', () => show(idx - 1));
    document.getElementById('lbNext').addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
    });
    let tx = null;
    lb.addEventListener('touchstart', (e) => { tx = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1);
    }, { passive: true });
  }

  // Year
  const y = document.getElementById('year');
  y && (y.textContent = new Date().getFullYear());

  // Proposal form -> pre-filled email
  const form = document.getElementById('proposalForm');
  const status = document.getElementById('formStatus');
  form && form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const f = new FormData(form);
    const required = ['name', 'email', 'details'];
    const missing = required.filter(k => !String(f.get(k) || '').trim());
    if (missing.length) {
      status.textContent = 'Please add your name, email and a short description of the project.';
      form.querySelector('#' + missing[0]).focus();
      return;
    }
    const subject = 'Proposal request: ' + (f.get('type') || 'Project') + (f.get('address') ? ' at ' + f.get('address') : '');
    const body = [
      'Name: ' + f.get('name'),
      'Company: ' + (f.get('company') || '-'),
      'Email: ' + f.get('email'),
      'Phone: ' + (f.get('phone') || '-'),
      'Project type: ' + f.get('type'),
      'Project address: ' + (f.get('address') || '-'),
      '',
      'Details:',
      f.get('details')
    ].join('\n');
    const href = 'mailto:info@nexbuildcorp.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Opening your email app with the request pre-filled.';
    window.open(href, '_blank', 'noopener');
  });
})();
