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

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') applyTheme('light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
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
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  if (navLinks) { navLinks.classList.remove('nav-mobile-open'); navLinks.style.display = ''; }
};

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));
    if (mobileMenuOpen) {
      navLinks.classList.add('nav-mobile-open');
      navLinks.style.display = 'flex';
    } else {
      navLinks.classList.remove('nav-mobile-open');
      navLinks.style.display = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (mobileMenuOpen && !hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

// =====================================================
//  SMOOTH SCROLL (accounting for sticky header)
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
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
const navItems = document.querySelectorAll('.nav-links a');

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
//  PROJECT FILTER BUTTONS
// =====================================================
document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? 'flex' : 'none';
    });
  });
});

// =====================================================
//  CONTACT FORM WITH VALIDATION (Formspree)
// =====================================================
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const setErr = (msg) => {
      status.textContent = '✗ ' + msg;
      status.style.color = '#ff6b6b';
    };

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
          status.textContent = '✓ message sent! thank you, ' + name + '.';
          status.style.color = 'var(--accent)';
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
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

window.addEventListener('scroll', () => {
  const el = document.getElementById('scroll-progress');
  if (!el) return;
  const max = document.body.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / max) * 100;
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
  if (!log || !cform || !input) return;

  const LIMIT = 30;
  let busy = false;
  let count = 0;

  const chips = [
    'what is your stack?',
    'are you available for hire?',
    'tell me about a recent project',
    'what is your education?',
    'how can I contact you?',
  ];

  chips.forEach(label => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.addEventListener('click', () => send(label));
    chipsWrap.appendChild(b);
  });

  const answers = {
    stack: 'My focus is on content: writing, managing, and delivering website content, plus WordPress/WooCommerce for content sites. I also design static web pages with HTML/CSS and handle layout with Figma and Photoshop, and I\'m currently learning React to deepen my web skills.',
    hire: 'Yes — I\'m open to freelance work and new opportunities. Freelance or part-time content roles fit best with my BCA studies, and I also take on static web page design. Drop a message via the contact form below.',
    project: 'A few things I\'ve worked on: this static portfolio site (hand-built with HTML/CSS/JS and a working contact form), a WordPress + WooCommerce content site with SEO basics, and content/design work in Figma and Photoshop. See the projects section above.',
    education: 'I\'m studying for my BCA (Bachelor in Computer Applications) at Mega College since 2023, and before that I completed higher secondary (+2) there in 2021–2023.',
    contact: 'You can email me at pradhansanskar86@gmail.com, find me on GitHub (@Sanskarpra07) or LinkedIn (Sanskar Pradhan), or use the contact form at the bottom of the page.',
    default: 'Hmm, I\'m not sure about that one. Try one of the suggestions above — stack, availability, projects, education, or contact.',
  };

  const getAnswer = (text) => {
    const t = text.toLowerCase();
    if (/(stack|tech|technolog|language|what.*use|build.*with)/.test(t)) return answers.stack;
    if (/(hire|available|work|freelance|opportunit|job|role)/.test(t)) return answers.hire;
    if (/(project|portfolio|built|work you)/.test(t)) return answers.project;
    if (/(education|study|degree|college|bca|school)/.test(t)) return answers.education;
    if (/(contact|email|message|reach|linkedin|github|social)/.test(t)) return answers.contact;
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
//  KEYBOARD FOCUS STYLES
// =====================================================
let usingMouse = false;
window.addEventListener('mousedown', () => usingMouse = true, { passive: true });
window.addEventListener('keydown', () => usingMouse = false, { passive: true });
document.addEventListener('focusin', e => { if (!usingMouse) e.target.classList.add('focus-visible'); });
document.addEventListener('focusout', e => e.target.classList.remove('focus-visible'));

// end of file
