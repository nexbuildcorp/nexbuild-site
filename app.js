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
