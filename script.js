(() => {
  'use strict';

  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const navButton = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const modal = document.getElementById('certificateModal');
  const modalTitle = document.getElementById('certificateTitle');
  const modalImage = document.getElementById('certificateImage');
  const modalClose = document.getElementById('closeCertificate');
  let lastModalTrigger = null;

  const certificates = {
    genai: { title: 'Generative AI Application', image: 'certificates/Gen AI app Cirt.jpg' },
    cyber: { title: 'Cyber Hygiene Training', image: 'certificates/cyber hygiene cirt.jpg' },
    agile: { title: 'Agile Scrum', image: 'certificates/agile scrum cert.png' },
    nvivo: { title: 'NVivo Training', image: 'certificates/nvivo cirt.png' }
  };

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    try { localStorage.setItem('portfolio-theme', theme); } catch (_) { /* Storage may be disabled */ }
  }
  themeButton.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  themeButton.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  themeButton.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));

  function closeMenu() {
    nav.classList.remove('is-open');
    navButton.setAttribute('aria-expanded', 'false');
  }
  navButton.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navButton.setAttribute('aria-expanded', String(open));
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (nav.classList.contains('is-open') && !nav.contains(event.target) && !navButton.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-20% 0px -65% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }

  function openCertificate(id, trigger) {
    const item = certificates[id];
    if (!item) return;
    lastModalTrigger = trigger;
    modalTitle.textContent = item.title;
    modalImage.src = item.image;
    modalImage.alt = 'Certificate for ' + item.title;
    modal.hidden = false;
    document.body.classList.add('dialog-open');
    modalClose.focus();
  }
  function closeCertificate() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('dialog-open');
    modalImage.removeAttribute('src');
    if (lastModalTrigger) lastModalTrigger.focus();
  }
  document.querySelectorAll('[data-certificate]').forEach(button => {
    button.addEventListener('click', () => openCertificate(button.dataset.certificate, button));
  });
  modalClose.addEventListener('click', closeCertificate);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeCertificate);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!modal.hidden) closeCertificate();
      else closeMenu();
    }
    if (!modal.hidden && event.key === 'Tab') {
      event.preventDefault();
      modalClose.focus();
    }
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
