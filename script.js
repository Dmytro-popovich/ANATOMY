// ================== CORE UI ==================
(function () {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header elevation on scroll
  const header = document.querySelector('.site-header');
  const elevate = () => header && header.setAttribute('data-elevated', window.scrollY > 10);
  elevate();
  window.addEventListener('scroll', elevate, { passive: true });

  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.setAttribute('aria-expanded', String(!expanded));
    });
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Smooth scroll (skip booking modal & course link)
  document.querySelectorAll('a[href^="#"], .scroll-indicator').forEach(el => {
    el.addEventListener('click', (e) => {
      const href = el.getAttribute('href');
      if (href === '#booking' || href === '#course') return;
      const targetId = href || '#services';
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Reveal animations
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-fade, .card, .gallery-item, .testimonial, .accordion, .contacts .map, .ba-slider, #lead-quiz'
  );
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // Parallax hero image
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
      if (!lightbox || !lbImg) return;
      lbImg.src = img.src.replace(/w=\d+/, 'w=1600');
      lbImg.alt = img.alt || '';
      lightbox.showModal();
    });
  });
  lbClose?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

  // ===== Booking Modal =====
  const bookingModal = document.getElementById('bookingModal');
  document.querySelectorAll('a[href="#booking"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      bookingModal?.showModal();
    });
  });
  bookingModal?.querySelector('.modal-close')?.addEventListener('click', () => bookingModal.close());
  bookingModal?.addEventListener('click', (e) => { if (e.target === bookingModal) bookingModal.close(); });

  // Load Booksy widget once
  const booksyBtn = document.getElementById('booksyBtn');
  let booksyLoaded = false;
  booksyBtn?.addEventListener('click', () => {
    if (booksyLoaded) return;
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://booksy.com/widget/code.js?id=1587543&country=us&lang=uk';
    document.body.appendChild(s);
    booksyLoaded = true;
    booksyBtn.disabled = true;
    booksyBtn.textContent = 'Widget loaded!';
  });

  // ===== Before / After slider =====
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const handle   = slider.querySelector('.handle');
    const resizeEl = slider.querySelector('.resize');
    const imgs     = slider.querySelectorAll('img');
    const before   = imgs[0];
    const after    = resizeEl ? resizeEl.querySelector('img') : null;
    if (!slider || !handle || !resizeEl || !before || !after) return;

    const setRatio = () => {
      const w = before.naturalWidth  || before.width;
      const h = before.naturalHeight || before.height;
      if (w && h) slider.style.aspectRatio = `${w} / ${h}`;
    };
    before.complete ? setRatio() : before.addEventListener('load', setRatio);

    const setPosPct = (pct) => {
      pct = Math.max(0, Math.min(100, pct));
      slider.style.setProperty('--pos', pct + '%');
    };
    const setFromClientX = (x) => {
      const r = slider.getBoundingClientRect();
      const pct = ((x - r.left) / r.width) * 100;
      setPosPct(pct);
    };

    setPosPct(50);

    let dragging = false;
    const start = (x) => { dragging = true; setFromClientX(x); };
    const move  = (x) => { if (dragging) setFromClientX(x); };
    const end   = () => { dragging = false; };

    handle.addEventListener('mousedown', e => { e.preventDefault(); start(e.clientX); });
    window.addEventListener('mousemove', e => move(e.clientX));
    window.addEventListener('mouseup', end);

    handle.addEventListener('touchstart', e => start(e.touches[0].clientX), { passive:false });
    window.addEventListener('touchmove',  e => move(e.touches[0].clientX),  { passive:false });
    window.addEventListener('touchend',   end);

    slider.addEventListener('mousedown', e => { e.preventDefault(); start(e.clientX); });
    slider.addEventListener('touchstart', e => start(e.touches[0].clientX), { passive:false });

    window.addEventListener('resize', () => {
      const cur = parseFloat(getComputedStyle(slider).getPropertyValue('--pos')) || 50;
      setPosPct(cur);
    });
  });

  // Logo behavior (home vs course)
  document.addEventListener('DOMContentLoaded', () => {
    const path = location.pathname.replace(/\/+$/, '');
    const isHome   = path === '' || /(?:^|\/)index\.html?$/i.test(path);
    const isCourse = /(?:^|\/)course\.html$/i.test(path);
    const logo = document.querySelector('.logo');
    if (!logo) return;

    if (isHome) {
      logo.setAttribute('href', '#home');
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else if (isCourse) {
      const fresh = logo.cloneNode(true);
      logo.replaceWith(fresh);
      fresh.setAttribute('href', 'index.html#home');
    }
  });
})();

// ================== SMART QUIZ (Services vs Courses) ==================
(function () {
  const quiz = document.getElementById('lead-quiz');
  if (!quiz) return;

  // Elements
  const steps    = Array.from(quiz.querySelectorAll('.quiz-step'));
  const nextBtn  = quiz.querySelector('#quizNext');
  const prevBtn  = quiz.querySelector('#quizPrev');
  const bar      = quiz.querySelector('.quiz-bar__fill');
  const stepNow  = quiz.querySelector('#quizStepNow');

  const s1Box    = quiz.querySelector('#quizStep1Options') || quiz.querySelector('[data-step="1"] .quiz-grid');

  const s2Title  = quiz.querySelector('#quizStep2Title') || quiz.querySelector('[data-step="2"] .quiz-title');
  const s2Sub    = quiz.querySelector('#quizStep2Sub')   || quiz.querySelector('[data-step="2"] .quiz-sub');
  const s2Box    = quiz.querySelector('#quizStep2Options') || quiz.querySelector('[data-step="2"] .quiz-grid');

  const s3Title  = quiz.querySelector('#quizStep3Title') || quiz.querySelector('[data-step="3"] .quiz-title');
  const s3Sub    = quiz.querySelector('#quizStep3Sub')   || quiz.querySelector('[data-step="3"] .quiz-sub');
  const s3Box    = quiz.querySelector('#quizStep3Options') || quiz.querySelector('[data-step="3"] .quiz-grid');

  const form       = quiz.querySelector('#quizForm');
  const phoneInput = form?.querySelector('input[name="phone"]');
  const err        = form?.querySelector('.error');
  const okEl       = quiz.querySelector('#quizOk');
  const submitBtn  = quiz.querySelector('#quizSubmit');
  const editBtn    = quiz.querySelector('#quizEdit');

  // State
  const values = { interest: '', experience: '', details: [], phone: '' };
  let idx = 0;
  const TOTAL = 4;
  const pctPerStep = 100 / TOTAL;

  // Dictionary
  const DATA = {
    courses: {
      levels: [
        'Beginner (no procedures yet)',
        'Some experience (1–10 clients)',
        'Working artist (10+ clients)'
      ],
      goals: [
        'Start taking paying clients',
        'Master lip blush technique',
        'Improve retention & healing',
        'Color neutralization (dark lips)',
        'Communications & marketing'
      ]
    },
    services: {
      expYes: [
        'Faded pigment / poor retention',
        'Discoloration (cool/warm)',
        'Unsatisfied with shape/result',
        'Old microblading',
        'Need removal/lightening'
      ],
      expNo: [
        'Natural everyday look',
        'Define shape / add volume',
        'Correct asymmetry',
        'Wake up ready / save time',
        'Consultation first'
      ],
      extras: {
        'Brows': {
          yes: ['Cover microblading', 'Sparse tails / gaps'],
          no:  ['Soft powder look', 'Brow reconstruction']
        },
        'Lips': {
          yes: ['Neutralize dark/cool tone', 'Fix asymmetry'],
          no:  ['Soft baby tint', 'Even out contour']
        },
        'Lash Line': {
          yes: ['Gaps in lash line', 'Allergy to makeup'],
          no:  ['Smudge-free daily look', 'Open-eye effect']
        }
      }
    }
  };

  // Helpers
  const clear = el => { if (el) el.innerHTML = ''; };
  const chipHTML = (label) => `<button class="chip" data-value="${label.replace(/"/g,'&quot;')}">${label}</button>`;

  const getSelected = (container) =>
    Array.from(container?.querySelectorAll('.chip.active') || []).map(c => c.dataset.value);

  const renderChips = (container, labels, { single = true, onChange } = {}) => {
    if (!container) return;
    clear(container);
    container.insertAdjacentHTML('beforeend', (labels || []).map(chipHTML).join(''));
    container.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        if (single) {
          container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
        } else {
          btn.classList.toggle('active');
        }
        onChange && onChange(getSelected(container));
        validateStep();
      });
    });
  };

  // Step renderers
  const renderStep2 = () => {
    values.experience = '';
    if (values.interest === 'Courses') {
      if (s2Title) s2Title.textContent = 'Step 2: Your experience level';
      if (s2Sub)   s2Sub.textContent   = 'Pick the best match.';
      renderChips(s2Box, DATA.courses.levels, {
        single: true,
        onChange: (sel) => { values.experience = sel[0] || ''; renderStep3(); }
      });
    } else {
      if (s2Title) s2Title.textContent = 'Step 2: Have you had PMU before?';
      if (s2Sub)   s2Sub.textContent   = '';
      renderChips(s2Box, ['Yes','No','Not sure'], {
        single: true,
        onChange: (sel) => { values.experience = sel[0] || ''; renderStep3(); }
      });
    }
  };

  const renderStep3 = () => {
    values.details = [];
    let labels = [];
    if (values.interest === 'Courses') {
      if (s3Title) s3Title.textContent = 'Step 3: Your goals';
      if (s3Sub)   s3Sub.textContent   = 'Choose all that apply.';
      labels = DATA.courses.goals;
    } else {
      const extras = DATA.services.extras[values.interest] || { yes: [], no: [] };
      if (values.experience === 'Yes') {
        if (s3Title) s3Title.textContent = 'Step 3: What brings you back?';
        if (s3Sub)   s3Sub.textContent   = 'Choose all that apply.';
        labels = [...DATA.services.expYes, ...extras.yes];
      } else if (values.experience === 'No') {
        if (s3Title) s3Title.textContent = 'Step 3: What’s your main goal?';
        if (s3Sub)   s3Sub.textContent   = 'Choose all that apply.';
        labels = [...DATA.services.expNo, ...extras.no];
      } else {
        if (s3Title) s3Title.textContent = 'Step 3: Not sure?';
        if (s3Sub)   s3Sub.textContent   = 'Tell us what area needs advice.';
        labels = ['Brows','Lips','Lash Line','Need advice'];
      }
    }
    renderChips(s3Box, labels, {
      single: false,
      onChange: (sel) => { values.details = sel; }
    });
  };

  // Init step2/3 on interest select
  s1Box?.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      s1Box.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      values.interest = btn.dataset.value || '';
      renderStep2();
      renderStep3();
      validateStep();
    });
  });

  // Nav + validation
  const go = (to) => {
    steps[idx].classList.remove('is-active');
    idx = to;
    steps[idx].classList.add('is-active');
    validateStep();
  };

  const validateStep = () => {
    const step = steps[idx];
    let ok = false;

    if (step.dataset.step === '1') ok = !!values.interest;
    if (step.dataset.step === '2') ok = !!values.experience;
    if (step.dataset.step === '3') ok = (values.details && values.details.length > 0);
    if (step.dataset.step === '4') ok = true;

    prevBtn.disabled = idx === 0;

    if (idx === steps.length - 1) {
      nextBtn.classList.add('is-hidden');
      nextBtn.disabled = true;
    } else {
      nextBtn.classList.remove('is-hidden');
      nextBtn.disabled = !ok;
    }

    stepNow.textContent = String(idx + 1);
    bar.style.width = (pctPerStep * (idx + 1)) + '%';
  };

  nextBtn.addEventListener('click', () => { if (idx < steps.length - 1) go(idx + 1); });
  prevBtn.addEventListener('click', () => { if (idx > 0) go(idx - 1); });

  // Submit (Web3Forms)
  if (editBtn) { editBtn.hidden = true; editBtn.disabled = true; }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const phone = phoneInput.value.trim();
    const valid = /^\+?[0-9\s\-()]{7,}$/.test(phone);
    if (!valid) {
      err.textContent = 'Please enter a valid phone number';
      phoneInput.setAttribute('aria-invalid', 'true');
      return;
    }
    phoneInput.setAttribute('aria-invalid', 'false');
    err.textContent = '';
    values.phone = phone;

    // Honeypot
    const hp = document.getElementById('hpWebsite');
    if (hp && hp.value) { err.textContent = 'Spam detected.'; return; }

    // Build message (Details now guaranteed)
    const detailsStr = (values.details && values.details.length) ? values.details.join(', ') : '—';

    const WEB3FORMS_KEY = 'd87bc65f-f6b7-4124-8d5c-1321f3af519b'; // <- your key
    const msg =
      `New lead from Quiz\n\n` +
      `Interest: ${values.interest}\n` +
      `Experience: ${values.experience || '—'}\n` +
      `Details: ${detailsStr}\n` +
      `Phone: ${values.phone}\n` +
      `Page: ${location.href}`;

    const fd = new FormData();
    fd.append('access_key', WEB3FORMS_KEY);
    fd.append('subject', 'New Lead • PERMA Quiz');
    fd.append('from_name', 'PERMA Website');
    fd.append('message', msg);

    // Duplicate key fields
    fd.append('interest', values.interest);
    fd.append('experience', values.experience || '');
    fd.append('details', detailsStr);
    fd.append('phone', values.phone);
    fd.append('page', location.href);
    fd.append('botcheck', hp ? hp.value : '');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => {
        okEl.hidden = false;
        submitBtn.textContent = 'Sent ✓';
        phoneInput.setAttribute('disabled', 'true');
        if (editBtn) { editBtn.hidden = false; editBtn.disabled = false; }
      })
      .catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
        err.textContent = 'Could not send. Try again or DM us on Instagram.';
      });
  });

  editBtn?.addEventListener('click', () => {
    okEl.hidden = true;
    phoneInput.removeAttribute('disabled');
    editBtn.hidden = true;
    editBtn.disabled = true;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Update';

    const step4 = quiz.querySelector('.quiz-step[data-step="4"]');
    steps.forEach(s => s.classList.remove('is-active'));
    step4.classList.add('is-active');
    idx = steps.indexOf(step4);
    phoneInput.focus();
    if (typeof phoneInput.select === 'function') phoneInput.select();
    validateStep();
  });

  // Initial paint
  renderStep2();
  renderStep3();
  steps[0].classList.add('is-active');
  validateStep();
})();

// ================== INFO HUB TABS ==================
(function () {
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const panels = Array.from(group.querySelectorAll('[role="tabpanel"]'));
    const activate = (tab) => {
      tabs.forEach(t => {
        const selected = t === tab;
        t.classList.toggle('is-active', selected);
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
      panels.forEach(p => {
        const show = p.id === tab.getAttribute('aria-controls');
        p.hidden = !show;
        p.classList.toggle('is-active', show);
      });
    };
    tabs.forEach(tab => tab.addEventListener('click', () => activate(tab)));
    group.addEventListener('keydown', (e) => {
      const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowRight') { e.preventDefault(); activate(tabs[(i+1)%tabs.length]); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); activate(tabs[(i-1+tabs.length)%tabs.length]); }
    });
  });
})();


// ================== COURSE PAGE HELPERS (sticky CTA) ==================
(function () {
  // працюємо ТІЛЬКИ на course.html
  const path = location.pathname.replace(/\/+$/, '');
  const isCourse = /(?:^|\/)course\.html$/i.test(path);
  if (!isCourse) return;

  document.body.classList.add('page-course');

  // якщо нижня панель уже є — перевикористаємо її, інакше створимо
  let cta = document.querySelector('.cta-sticky');
  if (!cta) {
    cta = document.createElement('div');
    cta.className = 'cta-sticky';
    document.body.appendChild(cta);
  }

  // УСЕ: тільки IG + Call (жодних Book/Calendly тут)
  cta.innerHTML = `
    <a class="btn btn--primary" 
       href="https://instagram.com/dari_permanent?utm_source=website&utm_medium=course_bottom&utm_campaign=ig_redirect" 
       target="_blank" rel="noopener">DM on Instagram</a>
    <a class="btn" href="tel:+17574079859">Call: +1 (757) 407-985-9</a>
  `;

  // на випадок, якщо всередині панелі десь був Book — прибираємо
  cta.querySelectorAll('.btn-book,[data-booking],a[href="#booking"]').forEach(el => el.remove());

  // логіка показу/приховування під час скролу (залишаємо як було)
  const toggleCta = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const doc = document.documentElement;
    const BOTTOM_OFFSET = 220;
    const nearBottom = (window.innerHeight + y) >= (doc.scrollHeight - BOTTOM_OFFSET);
    if (y > 500 && !nearBottom) cta.classList.add('is-visible');
    else cta.classList.remove('is-visible');
  };
  toggleCta();
  window.addEventListener('scroll', toggleCta, { passive: true });
  window.addEventListener('resize', toggleCta, { passive: true });
})();


// ================== NAV: force Course link ==================
(function () {
  const goCourse = (e) => { e.preventDefault(); window.location.href = 'course.html'; };
  document.querySelectorAll('a[href="#course"]').forEach(a => {
    a.addEventListener('click', goCourse);
    a.setAttribute('href', 'course.html'); // fallback if JS disabled
  });
})();

// ================== CTA control for course section ==================
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.replace(/\/+$/, '');
  const isHome  = path === '' || /(?:^|\/)index\.html?$/i.test(path);
  const isCourse = /(?:^|\/)course\.html$/i.test(path);

  const cta = document.querySelector('#course .course-content a.btn');
  if (!cta) return;

  if (isHome) {
    cta.textContent = 'View more';
    cta.setAttribute('href', 'course.html');
    cta.setAttribute('target', '_self');
    cta.removeAttribute('rel');
    cta.classList.add('btn--primary');
  } else if (isCourse) {
    cta.textContent = 'DM on Instagram';
    cta.setAttribute('href', 'https://instagram.com/dari_permanent');
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener');
    cta.classList.add('btn--primary');
  }
});

// ================== CARE TABS (Pre/After/Lips/Brows/Timeline) ==================
(function () {
  const root = document.getElementById('precare');
  if (!root) return;
  const tabs = root.querySelectorAll('.care-tab');
  const panels = root.querySelectorAll('.care-panel');

  const activate = (name) => {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    panels.forEach(p => p.hidden = (p.dataset.tab !== name));
  };

  tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.tab)));
  activate('pre'); // initial
})();

// ================== POLICIES TOGGLE ==================
(function () {
  const btn = document.getElementById('showPolicies');
  const box = document.getElementById('policiesContent');
  if (!btn || !box) return;
  btn.addEventListener('click', () => {
    const isHidden = box.hasAttribute('hidden');
    if (isHidden) {
      box.removeAttribute('hidden');
      btn.textContent = 'Hide studio policies';
    } else {
      box.setAttribute('hidden', '');
      btn.textContent = 'View full studio policies';
    }
  });
})();
(function(){
  const addUtm = (a, extra={}) => {
    try {
      const u = new URL(a.href);
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source','website');
        u.searchParams.set('utm_medium','cta');
        u.searchParams.set('utm_campaign', location.pathname.includes('course') ? 'course' : 'services');
        Object.entries(extra).forEach(([k,v])=>u.searchParams.set(k,v));
        a.href = u.toString();
      }
    } catch(e){}
  };
  document.querySelectorAll('a[href*="instagram.com/dari_permanent"]').forEach(a => addUtm(a));
})();
/* ===== Add 'Book' into EXISTING bottom bar (skip on course.html) ===== */
(function () {
  // не додаємо Book на course.html
  const isCourse = /(?:^|\/)course\.html$/i.test(location.pathname.replace(/\/+$/, ''));
  if (isCourse) return;

  const BOTTOM_SELECTOR = '.cta-sticky'; // твоя нижня панель
  const CALENDLY_URL =
    'https://calendly.com/lireongames?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=323232&text_color=ffffff&primary_color=fbcd96';

  function ensureCalendlyAssets() {
    if (!document.querySelector('link[href*="assets.calendly.com"]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(l);
    }
    if (!window.Calendly) {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      document.head.appendChild(s);
    }
  }
  function openCalendly(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    ensureCalendlyAssets();
    const tryOpen = () => {
      if (window.Calendly?.initPopupWidget) {
        Calendly.initPopupWidget({ url: CALENDLY_URL });
      } else setTimeout(tryOpen, 120);
    };
    tryOpen();
    return false;
  }

  const bottomBar = document.querySelector(BOTTOM_SELECTOR);
  if (bottomBar && !bottomBar.querySelector('.js-bottom-book')) {
    const bookBtn = document.createElement('button');
    bookBtn.type = 'button';
    bookBtn.className = 'btn btn--primary js-bottom-book';
    bookBtn.textContent = 'Book Now';
    bottomBar.appendChild(bookBtn);
    bookBtn.addEventListener('click', openCalendly);
  }

  // верхні лінки #booking теж відкривають Calendly
  document.querySelectorAll('a[href="#booking"]').forEach(el => {
    const clone = el.cloneNode(true);
    el.replaceWith(clone);
    clone.addEventListener('click', openCalendly, { capture: true });
  });
})();
