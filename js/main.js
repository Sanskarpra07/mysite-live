// =====================================================
//  THEME TOGGLE (data-theme on <html>)
// =====================================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const root = document.documentElement;

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  if (themeIcon) {
    themeIcon.classList.toggle('fa-moon', theme !== 'light');
    themeIcon.classList.toggle('fa-sun', theme === 'light');
  }
};

const readStoredValue = (key) => {
  try { return localStorage.getItem(key); } catch (e) { return null; }
};
const writeStoredValue = (key, value) => {
  try { localStorage.setItem(key, value); } catch (e) { /* storage may be unavailable */ }
};

const savedTheme = readStoredValue('theme');
if (savedTheme === 'light') applyTheme('light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    writeStoredValue('theme', next);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.classList.add('theme-fading');
    setTimeout(() => root.classList.remove('theme-fading'), 350);
  });
}

// =====================================================
//  HAMBURGER MOBILE MENU
// =====================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
let mobileMenuOpen = false;

const closeMenu = () => {
  mobileMenuOpen = false;
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  }
  if (navLinks) { navLinks.classList.remove('nav-mobile-open'); navLinks.style.display = ''; }
  document.querySelectorAll('.nav-drop.open').forEach(dd => {
    dd.classList.remove('open');
    const t = dd.querySelector('.nav-drop-toggle');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
};

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
    hamburger.setAttribute('aria-label', mobileMenuOpen ? 'Close menu' : 'Open menu');
    if (mobileMenuOpen) {
      navLinks.classList.add('nav-mobile-open');
      navLinks.style.display = 'flex';
    } else {
      navLinks.classList.remove('nav-mobile-open');
      navLinks.style.display = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      // Mobile dropdown toggles expand their submenu instead of closing the menu.
      if (link.classList.contains('nav-drop-toggle') && window.innerWidth <= 900) return;
      closeMenu();
    });
  });
  document.addEventListener('click', (e) => {
    if (mobileMenuOpen && !hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

// =====================================================
//  NAV DROPDOWN SUBMENUS ("Projects ▾")
// =====================================================
document.querySelectorAll('.nav-drop').forEach(drop => {
  const toggle = drop.querySelector('.nav-drop-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', (e) => {
    // On mobile/tablet the submenu opens as an accordion instead of scrolling.
    if (window.innerWidth <= 900) {
      e.preventDefault();
      const open = drop.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    }
  });
});

// =====================================================
//  SMOOTH SCROLL (accounting for sticky header)
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (a.classList.contains('nav-drop-toggle') && window.innerWidth <= 900) return;
    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMenu();
        const offset = 68;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// =====================================================
//  ACTIVE NAV LINK ON SCROLL
// =====================================================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links > li > a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(s => navObserver.observe(s));

// =====================================================
//  TYPEWRITER TAGLINE
// =====================================================
const typeEl = document.getElementById('typewriter-text');
const taglines = [
  'Content Writer',
  'Content Handler',
  'WordPress Specialist',
  'Static Web Designer',
  'BCA Student',
];
let ti = 0, ci = 0, isDeleting = false;

function typeLoop() {
  if (!typeEl) return;
  const txt = taglines[ti];
  if (!isDeleting) {
    typeEl.textContent = 'I am a ' + txt.slice(0, ci++);
    if (ci > txt.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    typeEl.textContent = 'I am a ' + txt.slice(0, ci--);
    if (ci < 0) {
      isDeleting = false;
      ti = (ti + 1) % taglines.length;
      ci = 0;
      setTimeout(typeLoop, 400);
      return;
    }
  }
  setTimeout(typeLoop, isDeleting ? 55 : 100);
}
if (typeEl) typeLoop();

// =====================================================
//  BACKGROUND TORCH SPOTLIGHT (fine pointer only)
// =====================================================
(() => {
  if (!window.matchMedia('(pointer:fine)').matches) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let mx = targetX;
  let my = targetY;
  const lerp = 0.18;

  window.addEventListener('pointermove', e => { targetX = e.clientX; targetY = e.clientY; }, { passive: true });
  window.addEventListener('pointerleave', () => { targetX = -9999; targetY = -9999; });

  (function loop() {
    mx += (targetX - mx) * lerp;
    my += (targetY - my) * lerp;
    root.style.setProperty('--mx', `${mx}px`);
    root.style.setProperty('--my', `${my}px`);
    requestAnimationFrame(loop);
  })();
})();

// =====================================================
//  INTERSECTION OBSERVER — COUNTERS + SKILL BARS
// =====================================================
const animate = (target) => {
  target.querySelectorAll('.count').forEach(el => {
    if (el.dataset.started) return;
    el.dataset.started = '1';
    const goal = +el.dataset.target;
    const duration = 1400;
    let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(goal * eased);
      el.textContent = goal >= 100 ? value.toLocaleString() : value;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  target.querySelectorAll('.skill-bar').forEach((bar, i) => {
    const fill = bar.querySelector('.skill-fill');
    if (!fill) return;
    fill.style.transitionDelay = `${i * 90}ms`;
    fill.style.width = fill.dataset.percent + '%';
  });
};

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animate(entry.target);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('#about, #skills').forEach(el => skillObserver.observe(el));

// =====================================================
//  PROJECTS CAROUSEL (infinite loop + autoplay)
// =====================================================
const projectsCarousel = document.querySelector('.projects-carousel');
const projectsTrack = document.querySelector('[data-projects-track]');
const carouselPrev = document.querySelector('[data-carousel-prev]');
const carouselNext = document.querySelector('[data-carousel-next]');
const carouselStatus = document.querySelector('[data-carousel-status]');

if (projectsCarousel && projectsTrack && carouselPrev && carouselNext) {
  const originalCards = Array.from(projectsTrack.querySelectorAll('.project-card'));
  const count = originalCards.length;

  if (count < 2) {
    const toolbar = projectsCarousel.previousElementSibling;
    if (toolbar && toolbar.classList.contains('projects-toolbar')) toolbar.hidden = true;
    projectsCarousel.removeAttribute('tabindex');
  } else {
    // Three copies: [wrap-before][originals][wrap-after] so there is always a card in either direction.
    const cloneSet = () => {
      const fragment = document.createDocumentFragment();
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a, button, input').forEach((el) => el.setAttribute('tabindex', '-1'));
        fragment.appendChild(clone);
      });
      return fragment;
    };
    projectsTrack.prepend(cloneSet());
    projectsTrack.append(cloneSet());

    const mod = (n, m) => ((n % m) + m) % m;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const AUTOPLAY_MS = 4000;

    let step = 0;
    let setWidth = 0;
    let targetLeft = 0;
    let index = 0;
    let hoverPaused = false;
    let focusPaused = false;
    let inView = true;
    let autoplayTimer = null;
    let settleTimer;
    let resizeTimer;

    let isPointerDown = false;
    let isSwiping = false;
    let suppressClick = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;

    const measure = () => {
      const card = originalCards[0];
      const gap = parseFloat(getComputedStyle(projectsTrack).columnGap) || 0;
      step = card.getBoundingClientRect().width + gap;
      setWidth = step * count;
    };

    const setScroll = (left, instant = false) => {
      const previous = projectsCarousel.style.scrollBehavior;
      projectsCarousel.style.scrollBehavior = instant ? 'auto' : 'smooth';
      projectsCarousel.scrollLeft = left;
      projectsCarousel.style.scrollBehavior = previous;
    };

    const renderStatus = () => {
      if (carouselStatus) {
        carouselStatus.textContent = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
      }
    };

    const syncIndex = () => {
      const next = mod(Math.round((projectsCarousel.scrollLeft - setWidth) / step), count);
      if (next !== index) {
        index = next;
        renderStatus();
      }
    };

    const wrapIfNeeded = () => {
      const left = projectsCarousel.scrollLeft;
      const set = Math.floor((left + 1) / setWidth);
      if (set === 1) return;
      const nextLeft = left - set * setWidth + setWidth;
      targetLeft = Math.round(nextLeft / step) * step;
      setScroll(targetLeft, true);
    };

    const goTo = (direction) => {
      targetLeft += direction * step;
      projectsCarousel.scrollTo({ left: targetLeft, behavior: 'smooth' });
    };

    const shouldAutoplay = () => !reduceMotion.matches && !hoverPaused && !focusPaused && inView && !document.hidden;

    const stopAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (shouldAutoplay()) autoplayTimer = setInterval(() => goTo(1), AUTOPLAY_MS);
    };

    const move = (direction) => {
      goTo(direction);
      startAutoplay();
    };

    carouselPrev.addEventListener('click', () => move(-1));
    carouselNext.addEventListener('click', () => move(1));

    projectsCarousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
    });

    // Swipe / drag support
    projectsCarousel.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isPointerDown = true;
      isSwiping = false;
      suppressClick = false;
      startX = e.clientX;
      startY = e.clientY;
      startScrollLeft = projectsCarousel.scrollLeft;
      projectsCarousel.style.scrollBehavior = 'auto';
    });

    projectsCarousel.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      if (!isSwiping) {
        if (Math.abs(deltaX) < 8 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        isSwiping = true;
        projectsCarousel.classList.add('dragging');
        if (projectsCarousel.setPointerCapture) {
          projectsCarousel.setPointerCapture(e.pointerId);
        }
      }
      e.preventDefault();
      projectsCarousel.scrollLeft = startScrollLeft - deltaX;
    });

    const endPointer = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      projectsCarousel.style.scrollBehavior = 'smooth';
      projectsCarousel.classList.remove('dragging');
      if (!isSwiping) return;
      isSwiping = false;
      suppressClick = true;
      targetLeft = Math.round(projectsCarousel.scrollLeft / step) * step;
      projectsCarousel.scrollTo({ left: targetLeft, behavior: 'smooth' });
      startAutoplay();
    };

    projectsCarousel.addEventListener('pointerup', endPointer);
    projectsCarousel.addEventListener('pointercancel', endPointer);
    projectsCarousel.addEventListener('click', (e) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    }, true);

    const onScrollSettled = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        if (isPointerDown) return;
        wrapIfNeeded();
        syncIndex();
      }, 90);
    };

    projectsCarousel.addEventListener('scroll', onScrollSettled, { passive: true });

    projectsCarousel.addEventListener('mouseenter', () => { hoverPaused = true; startAutoplay(); });
    projectsCarousel.addEventListener('mouseleave', () => { hoverPaused = false; startAutoplay(); });
    projectsCarousel.addEventListener('focusin', () => { focusPaused = true; startAutoplay(); });
    projectsCarousel.addEventListener('focusout', () => { focusPaused = false; startAutoplay(); });

    document.addEventListener('visibilitychange', startAutoplay);

    if ('IntersectionObserver' in window) {
      const carouselObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        startAutoplay();
      }, { threshold: 0.15 });
      carouselObserver.observe(projectsCarousel);
    }

    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', startAutoplay);
    }

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        measure();
        targetLeft = setWidth + index * step;
        setScroll(targetLeft, true);
      }, 120);
    });

    measure();
    targetLeft = setWidth;
    setScroll(targetLeft, true);
    renderStatus();
    startAutoplay();
  }
}

// =====================================================
//  CONTACT FORM WITH VALIDATION (Formspree)
// =====================================================
const form = document.getElementById('contact-form');
if (form) {
  let successTimeout;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    clearTimeout(successTimeout);
    const showSuccess = (message) => {
      status.textContent = message;
      status.style.color = 'var(--accent)';
      successTimeout = setTimeout(() => {
        status.textContent = '';
        status.style.color = '';
      }, 5000);
    };
    const setErr = (msg) => {
      status.textContent = '✗ ' + msg;
      status.style.color = '#ff6b6b';
    };

    const trap = form.querySelector('input[name="_gotcha"]');
    const trap2 = form.querySelector('input[name="website"]');
    if ((trap && trap.value) || (trap2 && trap2.value)) {
      showSuccess('✓ message sent! thank you.');
      return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    status.textContent = '';
    status.style.color = '';

    if (!name || name.length < 2) return setErr('name is required (min 2 characters).');
    if (name.length > 50) return setErr('name must be under 50 characters.');
    if (!email) return setErr('email is required.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setErr('please enter a valid email address.');
    if (!message || message.length < 5) return setErr('message is required (min 5 characters).');
    if (message.length > 2000) return setErr('message must be under 2000 characters.');
    if (subject && subject.length > 100) return setErr('subject must be under 100 characters.');

    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> sending...';
    }

    const formData = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          showSuccess('✓ message sent! thank you, ' + name + '.');
          form.reset();
        } else {
          return response.json().then(data => {
            const msg = (data && data.errors)
              ? data.errors.map(x => x.message).join(', ')
              : 'something went wrong — try again.';
            setErr(msg);
          });
        }
      })
      .catch(() => setErr('network error — check your connection and try again.'))
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> send message';
        }
      });
  });
}

// =====================================================
//  BACK TO TOP + SCROLL PROGRESS
// =====================================================
const backBtn = document.getElementById('back-to-top');
if (backBtn) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const BACK_TOP_SHOW_AT = 400;
  let backTopVisible = null;

  const renderBackTop = () => {
    const show = window.scrollY > BACK_TOP_SHOW_AT;
    if (show === backTopVisible) return;
    backTopVisible = show;
    backBtn.classList.toggle('is-visible', show);
    // Keep the hidden control out of the tab order and off screen readers.
    backBtn.setAttribute('aria-hidden', String(!show));
    backBtn.tabIndex = show ? 0 : -1;
  };

  backBtn.classList.remove('is-visible');
  backBtn.setAttribute('aria-hidden', 'true');
  backBtn.tabIndex = -1;

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });

  // Re-evaluate on resize too: a short page can stop being scrollable.
  window.addEventListener('scroll', renderBackTop, { passive: true });
  window.addEventListener('resize', renderBackTop, { passive: true });
  renderBackTop();
}

window.addEventListener('scroll', () => {
  const el = document.getElementById('scroll-progress');
  if (!el) return;
  const max = document.body.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  el.style.width = Math.min(100, Math.max(0, pct)) + '%';
}, { passive: true });

// =====================================================
//  FOOTER YEAR
// =====================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =====================================================
//  ~/ask-me.sh CHAT WIDGET
// =====================================================
(() => {
  const log = document.getElementById('chat-log');
  const cform = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const chipsWrap = document.getElementById('chat-chips');
  if (!log || !cform || !input || !chipsWrap) return;

  const LIMIT = 30;
  let busy = false;
  let count = 0;

  const chips = [
    'what is your stack?',
    'what services do you offer?',
    'are you available for hire?',
    'tell me about MegaFoot',
    'what is your work experience?',
    'what is your education?',
    'where are you based?',
  ];

  chipsWrap.textContent = '';
  chips.forEach(label => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.addEventListener('click', () => send(label));
    chipsWrap.appendChild(b);
  });

  const answers = {
    intro: 'I\'m Sanskar Man Pradhan, a content writer and content handler based in Lalitpur, Nepal. I also build static web pages and am studying for a Bachelor in Computer Applications (BCA) at Mega College.',
    stack: 'My tools and skills include content writing and management, WordPress and WooCommerce, HTML, CSS, JavaScript, PHP, MySQL, responsive web design, and SEO basics. I use Figma and Photoshop for design work, and I\'m currently learning React.',
    services: 'I can help with writing and managing website content, content delivery workflows, WordPress/WooCommerce content sites, and clean static web pages. I can also help with page layouts using Figma or Photoshop and basic SEO.',
    hire: 'Yes, I\'m accepting work. I\'m open to freelance projects and new opportunities in content writing/handling and static web design. You can reach me through the contact form or email me at pradhansanskar86@gmail.com.',
    experience: 'I\'ve worked as a Content Writer at Longtail E-Media since August 2024, writing and managing website content, including hotel-related content, and supporting CMS/content workflows and basic technical tasks. I also worked as a Receptionist at Swornim Multipurpose Co-operative from August to November 2023.',
    education: 'I\'m studying for a Bachelor in Computer Applications (BCA) at Mega College, where I started in 2023. I completed higher secondary (+2) there from 2021 to 2023.',
    location: 'I\'m based in Lalitpur, Nepal (Nepal Time, UTC+5:45).',
    projects: 'My featured projects include this responsive portfolio built with HTML, CSS, and JavaScript; Medical-IMS, a PHP/MySQL inventory system; MegaFoot, a PHP/MySQL shoe store; and Daura & Co., a responsive static clothing storefront built with HTML, CSS, JavaScript, and Bootstrap 5. You can find links and details in the Projects section.',
    megafoot: 'MegaFoot is a PHP and MySQL shoe store project. It includes product/category/brand filters, a cart, wishlist, order tracking, customer accounts with OTP login, an admin panel, and eSewa/Khalti sandbox checkout. The Projects section links to a browsable storefront demo and the source on GitHub.',
    medical: 'Medical-IMS is a PHP and MySQL medical inventory management system with a stock dashboard, product and category management, stock logs, and authenticated user accounts. The Projects section links to its GitHub repository; it does not have a live demo.',
    daura: 'Daura & Co. is a responsive static clothing storefront built with HTML, CSS, JavaScript, and Bootstrap 5. It has product grids, category sections, cart interactions, and a mobile-first layout. See the Projects section for its live site and GitHub links.',
    portfolio: 'This portfolio is a responsive static site built with HTML, CSS, and JavaScript. It includes light/dark themes, interactive page effects, a contact form, and this scripted FAQ chat widget.',
    contact: 'Email me at pradhansanskar86@gmail.com, use the contact form, or find me on GitHub as @Sanskarpra07 and on LinkedIn as Sanskar Pradhan. My social links are also listed in the Contact section.',
    default: 'I can answer questions about Sanskar\'s background, skills, services, work experience, education, projects, availability, location, and contact details. Try asking about one of those topics.',
  };

  const getAnswer = (text) => {
    const t = text.toLowerCase().replace(/[^\w\s&.-]/g, ' ');
    if (/(mega\s*foot|shoe store|shoe shop)/.test(t)) return answers.megafoot;
    if (/(medical[\s-]*ims|inventory system|medical inventory)/.test(t)) return answers.medical;
    if (/(daura|clothing store|clothes store|fashion store)/.test(t)) return answers.daura;
    if (/(portfolio|this website|this site|your website)/.test(t)) return answers.portfolio;
    if (/(contact|email|message|reach|linkedin|github|social|instagram|facebook)/.test(t)) return answers.contact;
    if (/(education|study|degree|college|bca|school|student|qualifications)/.test(t)) return answers.education;
    if (/(experience|career|previous job|work history|where.*work|work.*experience|worked|employment|longtail|receptionist)/.test(t)) return answers.experience;
    if (/(where|location|located|based|live|from)/.test(t)) return answers.location;
    if (/(service|offer|help with|do for me|what do you do|speciali[sz]|hire for)/.test(t)) return answers.services;
    if (/(hire|available|freelance|opportunit|job|role|accepting work|open to work)/.test(t)) return answers.hire;
    if (/(stack|tech|technolog|language|skill|good at|strength|tool|wordpress|woocommerce|html|css|javascript|\bjs\b|\bphp\b|mysql|react|figma|photoshop|seo|what.*use|build.*with)/.test(t)) return answers.stack;
    if (/(project|built|work you|what have you made|what have you worked on)/.test(t)) return answers.projects;
    if (/(who are you|who.*sanskar|about you|tell me about yourself|introduce yourself|your background)/.test(t)) return answers.intro;
    return answers.default;
  };
  const addMessage = (who, body, animate) => {
    const row = document.createElement('div');
    row.className = `msg ${who}`;
    const labels = { system: '// system', bot: '› sanskar-bot', user: '› you' };
    const label = document.createElement('div');
    label.className = 'msg-label';
    label.textContent = labels[who];
    row.appendChild(label);
    const bodyEl = document.createElement('div');
    bodyEl.className = 'msg-body';
    bodyEl.textContent = body;
    row.appendChild(bodyEl);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;

    if (animate) {
      bodyEl.textContent = '';
      const dots = document.createElement('span');
      dots.className = 'typing-dots';
      dots.innerHTML = '<span></span><span></span><span></span>';
      bodyEl.appendChild(dots);
      log.scrollTop = log.scrollHeight;
      setTimeout(() => {
        bodyEl.textContent = body;
        log.scrollTop = log.scrollHeight;
      }, 900);
    }
  };

  const setDisabled = (disabled) => {
    input.disabled = disabled;
    const sendBtn = cform.querySelector('.chat-send');
    if (sendBtn) sendBtn.disabled = disabled;
    document.querySelectorAll('.chip').forEach(c => (c.disabled = disabled));
  };

  const setPlaceholder = () => {
    input.placeholder = count >= LIMIT ? 'conversation limit reached' : 'ask anything about sanskar…';
  };

  const send = (text) => {
    text = (text || '').trim();
    if (!text || busy) return;
    if (count >= LIMIT) { addMessage('system', '// conversation limit reached — refresh to start over.'); return; }

    busy = true;
    setDisabled(true);
    count += 1;
    input.value = '';
    addMessage('user', text);

    const reply = getAnswer(text);
    setTimeout(() => {
      addMessage('bot', reply, true);
      busy = false;
      setDisabled(false);
      setPlaceholder();
    }, 400);
  };

  cform.addEventListener('submit', e => {
    e.preventDefault();
    send(input.value);
  });

  setDisabled(false);
})();

// =====================================================
//  MUSIC PLAYER
//  To publish a track: save the file under assets/audio/,
//  then add one line to the list below, e.g.
//    { title: 'My Song', file: 'assets/audio/my-song.mp3' }
//  The track list and player render automatically.
// =====================================================
const musicTracks = [
  { title: 'behos', file: 'assets/audio/behos.mp3' },
  { title: 'mayalu', file: 'assets/audio/mayalu.mp3' },
  { title: 'sarangi', file: 'assets/audio/sarangi.mp3' },
  { title: 'syndicate', file: 'assets/audio/syndicate.mp3' },
  { title: 'thamana', file: 'assets/audio/thamana.mp3' },
];

(function () {
  const shell = document.getElementById('music-shell');
  const empty = document.getElementById('music-empty');
  const audio = document.getElementById('music-audio');
  const list = document.getElementById('music-list');
  if (!shell || !empty || !audio || !list) return;

  if (!musicTracks.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  shell.hidden = false;

  const toggle = document.getElementById('player-toggle');
  const prevBtn = document.getElementById('player-prev');
  const nextBtn = document.getElementById('player-next');
  const repeatBtn = document.getElementById('player-repeat');
  const shuffleBtn = document.getElementById('player-shuffle');
  const muteBtn = document.getElementById('player-mute');
  const volumeEl = document.getElementById('player-volume');
  const statusEl = document.getElementById('music-status');
  const titleEl = document.getElementById('player-title');
  const currentEl = document.getElementById('player-current');
  const durationEl = document.getElementById('player-duration');
  const fillEl = document.getElementById('player-progress-fill');
  const progress = document.getElementById('player-progress');

  let current = -1;
  let repeatMode = 'off'; // 'off' | 'all' | 'one'
  let shuffle = false;
  const durationCache = new Array(musicTracks.length).fill(0);

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  };

  const setStatus = (msg) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.hidden = false;
    clearTimeout(setStatus._t);
    setStatus._t = setTimeout(() => { statusEl.hidden = true; }, 3400);
  };

  const setPlaying = (playing) => {
    const icon = toggle.querySelector('i');
    if (icon) icon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    toggle.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    const box = toggle.closest('.music-player');
    if (box) box.classList.toggle('playing', playing);
  };

  const updateProgress = () => {
    const dur = durationCache[current] || audio.duration || 0;
    const pct = dur ? (audio.currentTime / dur) * 100 : 0;
    fillEl.style.width = pct + '%';
    currentEl.textContent = fmt(audio.currentTime);
    if (progress) {
      progress.setAttribute('aria-valuenow', String(Math.round(pct)));
      progress.setAttribute('aria-valuetext', fmt(audio.currentTime) + ' of ' + fmt(dur));
    }
  };

  const setRowDuration = (i, seconds) => {
    const rows = list.querySelectorAll('.music-row-dur');
    if (rows[i]) rows[i].textContent = fmt(seconds);
  };

  const syncControls = () => {
    if (!repeatBtn) return;
    repeatBtn.classList.toggle('active', repeatMode === 'all');
    repeatBtn.classList.toggle('is-one', repeatMode === 'one');
    repeatBtn.classList.toggle('active-off', repeatMode === 'off');
    repeatBtn.setAttribute('aria-label', repeatMode === 'one' ? 'Repeat: one' : repeatMode === 'all' ? 'Repeat: all' : 'Repeat: off');
    if (shuffleBtn) {
      shuffleBtn.classList.toggle('active', shuffle);
      shuffleBtn.setAttribute('aria-label', shuffle ? 'Shuffle on' : 'Shuffle off');
    }
  };

  const pickIndex = (dir) => {
    const n = musicTracks.length;
    if (!n) return -1;
    if (shuffle) {
      const others = [];
      for (let i = 0; i < n; i++) if (i !== current) others.push(i);
      if (!others.length) return current;
      return others[Math.floor(Math.random() * others.length)];
    }
    const base = current === -1 ? (dir === 1 ? 0 : n - 1) : current;
    let next = base + dir;
    if (next < 0) next = repeatMode === 'all' ? n - 1 : -1;
    if (next >= n) next = repeatMode === 'all' ? 0 : -1;
    return next;
  };

  const select = (i, autoplay) => {
    if (i < 0 || i >= musicTracks.length) return;
    current = i;
    audio.src = musicTracks[i].file;
    audio.load();
    titleEl.textContent = musicTracks[i].title || musicTracks[i].file;
    const dur = durationCache[i] || 0;
    durationEl.textContent = dur ? fmt(dur) : '--:--';
    if (dur) setRowDuration(i, dur);
    list.querySelectorAll('.music-row').forEach((row, idx) => row.classList.toggle('active', idx === i));
    if (autoplay) audio.play().catch(() => setStatus('// play blocked — click play to start'));
    try { localStorage.setItem('music-track', String(i)); } catch (e) {}
  };

  const seek = (t) => {
    if (!audio.duration) { if (current === -1) select(0); return; }
    audio.currentTime = Math.min(Math.max(t, 0), audio.duration);
    updateProgress();
  };

  const go = (dir) => {
    if (current === -1) { select(dir === 1 ? 0 : musicTracks.length - 1, true); return; }
    const nxt = pickIndex(dir);
    if (nxt === -1) {
      setStatus(dir === 1 ? '// end of playlist' : '// start of playlist');
      if (dir === 1 && repeatMode === 'off') { setPlaying(false); audio.currentTime = 0; }
      return;
    }
    select(nxt, true);
  };

  // Preload durations so the list shows every track's length up front
  musicTracks.forEach((track, i) => {
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.addEventListener('loadedmetadata', () => {
      durationCache[i] = probe.duration;
      setRowDuration(i, probe.duration);
      if (i === current) durationEl.textContent = fmt(probe.duration);
    }, { once: true });
    probe.src = track.file;
  });

  list.textContent = '';
  musicTracks.forEach((track, i) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'music-row';
    row.setAttribute('aria-label', 'Play ' + track.title);

    const play = document.createElement('span');
    play.className = 'music-row-play';
    play.innerHTML = '<i class="fa-solid fa-play"></i>';

    const num = document.createElement('span');
    num.className = 'music-row-num';
    num.textContent = String(i + 1).padStart(2, '0');

    const title = document.createElement('span');
    title.className = 'music-row-title';
    title.textContent = track.title;

    const dur = document.createElement('span');
    dur.className = 'music-row-dur';
    dur.textContent = '--:--';

    row.append(play, num, title, dur);
    row.addEventListener('click', () => {
      if (current === i) {
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
      } else {
        select(i, true);
      }
    });
    list.appendChild(row);
  });

  toggle.addEventListener('click', () => {
    if (current === -1) { select(0, true); return; }
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => go(1));
  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (current !== -1 && audio.currentTime > 3) { seek(0); return; }
    go(-1);
  });

  if (repeatBtn) repeatBtn.addEventListener('click', () => {
    repeatMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
    syncControls();
    setStatus('// repeat: ' + repeatMode);
  });

  if (shuffleBtn) shuffleBtn.addEventListener('click', () => {
    shuffle = !shuffle;
    syncControls();
    setStatus(shuffle ? '// shuffle on' : '// shuffle off');
  });

  if (volumeEl && muteBtn) {
    let lastVol = 0.8;
    const syncVolume = () => {
      const v = audio.muted ? 0 : audio.volume;
      volumeEl.value = String(Math.round(v * 100));
      const icon = muteBtn.querySelector('i');
      if (icon) {
        icon.className = 'fa-solid ' + (v === 0 ? 'fa-volume-xmark' : v < 0.5 ? 'fa-volume-low' : 'fa-volume-high');
      }
      muteBtn.setAttribute('aria-label', v === 0 ? 'Unmute' : 'Mute');
    };
    let vol = parseFloat(readStoredValue('music-volume'));
    audio.volume = vol >= 0 && vol <= 1 ? vol : 0.8;
    volumeEl.addEventListener('input', () => {
      audio.volume = volumeEl.value / 100;
      audio.muted = audio.volume === 0;
      lastVol = audio.volume || lastVol;
      writeStoredValue('music-volume', String(audio.volume));
      syncVolume();
    });
    muteBtn.addEventListener('click', () => {
      if (audio.muted || audio.volume === 0) {
        audio.volume = lastVol || 0.8;
        audio.muted = false;
      } else {
        lastVol = audio.volume;
        audio.muted = true;
      }
      syncVolume();
    });
    syncVolume();
  }

  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => {
    if (repeatMode === 'one') { audio.currentTime = 0; audio.play().catch(() => {}); return; }
    const nxt = pickIndex(1);
    if (nxt === -1) {
      setPlaying(false);
      audio.currentTime = 0;
      setStatus('// end of playlist — press play or repeat to loop');
      return;
    }
    select(nxt, true);
  });
  audio.addEventListener('loadedmetadata', () => {
    if (current < 0) return;
    durationCache[current] = audio.duration;
    durationEl.textContent = fmt(audio.duration);
    setRowDuration(current, audio.duration);
    updateProgress();
  });

  audio.addEventListener('error', () => {
    const name = current >= 0 ? musicTracks[current].title : 'this track';
    setStatus('// could not load "' + name + '" — skipping');
    const nxt = pickIndex(1);
    if (nxt !== -1 && nxt !== current) setTimeout(() => select(nxt, true), 500);
    else setPlaying(false);
  });

  audio.addEventListener('timeupdate', updateProgress);

  progress.addEventListener('click', (e) => {
    if (!audio.duration) { if (current === -1) select(0, true); return; }
    const rect = progress.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    seek(pct * audio.duration);
  });

  progress.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') seek(audio.currentTime + 5);
    else if (e.key === 'ArrowLeft') seek(audio.currentTime - 5);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Run shortcuts only when focus is on the page itself. Native keyboard
    // behavior remains available to links, buttons, and other controls.
    if (e.target !== document.body && e.target !== document.documentElement) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === ' ' && tag === 'BUTTON') return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        if (current === -1) select(0, true);
        else if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
        break;
      case 'ArrowRight':
        if (progress === document.activeElement) return;
        seek(audio.currentTime + 5);
        break;
      case 'ArrowLeft':
        if (progress === document.activeElement) return;
        seek(audio.currentTime - 5);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (volumeEl) { volumeEl.value = Math.min(100, +volumeEl.value + 5); volumeEl.dispatchEvent(new Event('input')); }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (volumeEl) { volumeEl.value = Math.max(0, +volumeEl.value - 5); volumeEl.dispatchEvent(new Event('input')); }
        break;
      case 'r': case 'R': if (repeatBtn) repeatBtn.click(); break;
      case 's': case 'S': if (shuffleBtn) shuffleBtn.click(); break;
      case 'm': case 'M': if (muteBtn) muteBtn.click(); break;
      case 'n': case 'N': if (nextBtn) nextBtn.click(); break;
      case 'p': case 'P': if (prevBtn) prevBtn.click(); break;
    }
  });

  // Restore the last-played track (highlighted, without autoplay)
  try {
    const saved = parseInt(readStoredValue('music-track'), 10);
    if (saved >= 0 && saved < musicTracks.length) select(saved, false);
  } catch (e) {}

  syncControls();
})();

// =====================================================
//  KEYBOARD FOCUS STYLES
// =====================================================
let usingMouse = false;
window.addEventListener('mousedown', () => usingMouse = true, { passive: true });
window.addEventListener('keydown', () => usingMouse = false, { passive: true });
document.addEventListener('focusin', e => { if (!usingMouse) e.target.classList.add('focus-visible'); });
document.addEventListener('focusout', e => e.target.classList.remove('focus-visible'));

// end of file
