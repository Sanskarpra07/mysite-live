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
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
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
    if (current === -1) { select(dir === 1 ? 0 : musicTracks.length - 1); return; }
    const nxt = pickIndex(dir);
    if (nxt === -1) {
      setStatus(dir === 1 ? '// end of playlist' : '// start of playlist');
      if (dir === 1 && repeatMode === 'off') { setPlaying(false); audio.currentTime = 0; }
      return;
    }
    select(nxt);
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
        select(i);
      }
    });
    list.appendChild(row);
  });

  toggle.addEventListener('click', () => {
    if (current === -1) { select(0); return; }
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
    let vol = parseFloat(localStorage.getItem('music-volume'));
    audio.volume = vol >= 0 && vol <= 1 ? vol : 0.8;
    volumeEl.addEventListener('input', () => {
      audio.volume = volumeEl.value / 100;
      audio.muted = audio.volume === 0;
      lastVol = audio.volume || lastVol;
      try { localStorage.setItem('music-volume', String(audio.volume)); } catch (e) {}
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
    select(nxt);
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
    if (nxt !== -1 && nxt !== current) setTimeout(() => select(nxt), 500);
    else setPlaying(false);
  });

  audio.addEventListener('timeupdate', updateProgress);

  progress.addEventListener('click', (e) => {
    if (!audio.duration) { if (current === -1) select(0); return; }
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
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === ' ' && tag === 'BUTTON') return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        if (current === -1) select(0);
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
    const saved = parseInt(localStorage.getItem('music-track'), 10);
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
