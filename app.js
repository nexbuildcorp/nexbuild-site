(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const sun = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const moon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  let mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  function apply() {
    root.setAttribute('data-theme', mode);
    if (!toggle) return;
    toggle.innerHTML = mode === 'dark' ? sun : moon;
    toggle.setAttribute('aria-label', 'Switch to ' + (mode === 'dark' ? 'light' : 'dark') + ' mode');
  }
  apply();
  toggle && toggle.addEventListener('click', () => { mode = mode === 'dark' ? 'light' : 'dark'; apply(); });

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
    const href = 'mailto:ergi@nexbuildcorp.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Opening your email app with the request pre-filled.';
    window.open(href, '_blank', 'noopener');
  });
})();
