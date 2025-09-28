
(function() {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header elevation on scroll
  const header = document.querySelector('.site-header');
  const elevate = () => header && header.setAttribute('data-elevated', window.scrollY > 10);
  elevate();
  window.addEventListener('scroll', elevate);

  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.setAttribute('aria-expanded', String(!expanded));
    });
    // close on link click
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scroll for .to-top and scroll-indicator
  document.querySelectorAll('a[href^="#"], .scroll-indicator').forEach(el => {
    el.addEventListener('click', (e) => {
      const targetId = el.getAttribute('href') || '#services';
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Intersection Observer — reveal animations
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade, .card, .gallery-item, .testimonial, .form, .accordion, .contacts .map');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // Parallax hero image on scroll
  const heroImg = document.querySelector('.hero-media img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroImg.style.transform = `translateY(${y * 0.08}px) scale(1.06)`;
    }, { passive: true });
  }

  // Lightbox for gallery
  const lightbox = document.querySelector('.lightbox');
  const lbImg = document.querySelector('.lightbox-img');
  const lbClose = document.querySelector('.lightbox-close');
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src.replace(/w=\d+/, 'w=1600');
      lbImg.alt = img.alt;
      lightbox.showModal();
    });
  });
  lbClose?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

  // Form validation (basic)
  const form = document.querySelector('.form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('input[name="name"]');
    const phone = form.querySelector('input[name="phone"]');
    const success = form.querySelector('.form-success');
    let ok = true;

    // simple checks
    if (!name.value.trim()) { setError(name, 'Вкажіть ім\'я'); ok = false; } else setError(name, '');
    if (!/^\+?\d[\d\s\-]{7,}$/.test(phone.value.trim())) { setError(phone, 'Некоректний номер'); ok = false; } else setError(phone, '');

    if (ok) {
      // Here you can send data to your backend (fetch)
      success.hidden = false;
      form.reset();
      setTimeout(() => success.hidden = true, 4000);
    }
  });

  function setError(input, msg) {
    const small = input.parentElement.querySelector('.error');
    if (small) small.textContent = msg || '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  // Redirect services cards and portfolio items to booking
  document.querySelectorAll('#services .card, #portfolio .gallery-item').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const booking = document.querySelector('#booking');
      if (booking) booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  // Redirect price rows to booking
  document.querySelectorAll('#pricing .price-row').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const booking = document.querySelector('#booking');
      if (booking) booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

 const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault(); // відміняємо стандартний #home
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
