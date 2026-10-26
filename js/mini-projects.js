// =====================================================
//  MINI-PROJECTS — vanilla JS demos
// =====================================================

// =====================================================
//  POMODORO TIMER
// =====================================================
(() => {
  const root = document.querySelector('.demo[data-demo="pomodoro"]');
  if (!root) return;
  const timeEl = root.querySelector('.pt-time');
  const sessionEl = root.querySelector('.pt-session');
  const modeBtns = root.querySelectorAll('.pt-mode');
  const startBtn = root.querySelector('.pt-start');
  const resetBtn = root.querySelector('.pt-reset');

  const DUR = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const LABELS = { focus: 'focus', short: 'short break', long: 'long break' };

  let mode = 'focus';
  let remaining = DUR.focus;
  let timer = null;
  let endTime = null;

  const fmt = s => {
    s = Math.max(0, Math.ceil(s));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  const render = () => { timeEl.textContent = fmt(remaining); };
  const stop = () => {
    if (timer) { clearInterval(timer); timer = null; }
    endTime = null;
    root.classList.remove('pt-running');
  };
  const setMode = (m) => {
    stop();
    mode = m;
    remaining = DUR[m];
    sessionEl.textContent = LABELS[m];
    startBtn.textContent = 'start';
    modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    render();
  };

  startBtn.addEventListener('click', () => {
    if (timer) {
      stop();
      startBtn.textContent = 'start';
      render();
      return;
    }
    if (remaining <= 0) remaining = DUR[mode];
    endTime = Date.now() + remaining * 1000;
    root.classList.add('pt-running');
    startBtn.textContent = 'pause';
    timer = setInterval(() => {
      remaining = (endTime - Date.now()) / 1000;
      render();
      if (remaining <= 0) {
        stop();
        remaining = DUR[mode];
        startBtn.textContent = 'start';
        render();
      }
    }, 250);
  });

  resetBtn.addEventListener('click', () => {
    stop();
    remaining = DUR[mode];
    startBtn.textContent = 'start';
    render();
  });

  modeBtns.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  render();
})();

// =====================================================
//  TO-DO LIST (localStorage)
// =====================================================
(() => {
  const root = document.querySelector('.demo[data-demo="todo"]');
  if (!root) return;
  const form = root.querySelector('.td-form');
  const input = root.querySelector('.td-input');
  const list = root.querySelector('.td-list');
  const countEl = root.querySelector('.td-count');

  const KEY = 'smp-mini-todos';
  let todos = [];
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    todos = Array.isArray(saved)
      ? saved.filter(t => t && typeof t.text === 'string').map(t => ({
          id: t.id,
          text: t.text,
          done: Boolean(t.done),
        }))
      : [];
  } catch (e) { todos = []; }

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(todos)); } catch (e) { /* ignore */ }
  };

  const render = () => {
    list.innerHTML = '';
    todos.forEach(t => {
      const li = document.createElement('li');
      li.className = 'td-item' + (t.done ? ' done' : '');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = t.done;
      cb.setAttribute('aria-label', 'Mark done');
      cb.addEventListener('change', () => { t.done = cb.checked; save(); render(); });
      const span = document.createElement('span');
      span.textContent = t.text;
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'td-del';
      del.textContent = '✕';
      del.setAttribute('aria-label', 'Delete task');
      del.addEventListener('click', () => { todos = todos.filter(x => x !== t); save(); render(); });
      li.append(cb, span, del);
      list.appendChild(li);
    });
    countEl.textContent = todos.filter(t => !t.done).length + ' open';
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    todos.unshift({ id: Date.now(), text: v, done: false });
    input.value = '';
    save();
    render();
  });

  render();
})();

// =====================================================
//  CALCULATOR (expression parser, no eval)
// =====================================================
(() => {
  const root = document.querySelector('.demo[data-demo="calculator"]');
  if (!root) return;
  const display = root.querySelector('.calc-display');
  const keys = root.querySelectorAll('.calc-grid button');

  let expr = '';
  let justEvaluated = false;

  const parse = (() => {
    const tokenize = s => s.match(/\d+(?:\.\d+)?|[()+\-*/]/g) || [];
    let toks, pos;
    const peek = () => toks[pos];
    const eat = () => toks[pos++];
    const num = () => {
      const t = peek();
      if (t === '(') { eat(); const v = exprFn(); if (peek() === ')') eat(); return v; }
      if (t === '-') { eat(); return -num(); }
      if (t === '+') { eat(); return num(); }
      if (t === undefined) throw new Error('incomplete');
      eat();
      return parseFloat(t);
    };
    const term = () => {
      let v = num();
      let t;
      while ((t = peek()) === '*' || t === '/') {
        eat();
        const r = num();
        if (t === '/' && r === 0) throw new Error('div0');
        v = t === '*' ? v * r : v / r;
      }
      return v;
    };
    const exprFn = () => {
      let v = term();
      let t;
      while ((t = peek()) === '+' || t === '-') {
        eat();
        v = t === '+' ? v + term() : v - term();
      }
      return v;
    };
    return s => {
      toks = tokenize(s);
      pos = 0;
      if (!toks.length) return 0;
      const v = exprFn();
      if (pos !== toks.length) throw new Error('parse');
      return v;
    };
  })();

  const show = () => {
    display.textContent = expr || '0';
    display.scrollLeft = display.scrollWidth;
  };
  const clear = () => { expr = ''; justEvaluated = false; show(); };
  const backspace = () => { expr = expr.slice(0, -1); justEvaluated = false; show(); };
  const evaluate = () => {
    if (!expr) return;
    let result;
    try { result = parse(expr); } catch (e) { result = NaN; }
    if (!isFinite(result)) { expr = 'error'; }
    else {
      if (Math.abs(result) === 0) result = 0;
      const rounded = Math.round(result * 1e10) / 1e10;
      expr = String(rounded);
    }
    justEvaluated = true;
    show();
  };

  const append = (k) => {
    if (/[0-9.]/.test(k) || k === '(') {
      if (justEvaluated) { expr = ''; justEvaluated = false; }
    } else {
      justEvaluated = false;
    }
    if (expr === 'error') expr = '';
    const last = expr.slice(-1);
    if ('+-*/'.includes(last) && '+-*/'.includes(k)) {
      expr = expr.slice(0, -1) + k;
    } else {
      if (expr.length >= 34) return;
      expr += k;
    }
    show();
  };

  keys.forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.k;
      const c = btn.dataset.c;
      if (c === 'cls') clear();
      else if (c === 'eq') evaluate();
      else append(k);
    });
  });

  display.addEventListener('keydown', e => {
    if (/[0-9+\-*/().]/.test(e.key)) { e.preventDefault(); append(e.key); }
    else if (e.key === 'Enter') { e.preventDefault(); evaluate(); }
    else if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
    else if (e.key === 'Escape') { e.preventDefault(); clear(); }
  });

  show();
})();

// =====================================================
//  PASSWORD GENERATOR
// =====================================================
(() => {
  const root = document.querySelector('.demo[data-demo="password"]');
  if (!root) return;
  const out = root.querySelector('.pg-out');
  const copyBtn = root.querySelector('.pg-copy');
  const lenEl = root.querySelector('.pg-len');
  const lenVal = root.querySelector('.pg-len-val');
  const checks = root.querySelectorAll('.pg-checks input');
  const genBtn = root.querySelector('.pg-gen');
  const bar = root.querySelector('.pg-strength-bar');
  const barTxt = root.querySelector('.pg-strength-txt');

  const SETS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
  };

  const secureRandomAvailable = Boolean(window.crypto && typeof crypto.getRandomValues === 'function');
  const randInt = (max) => {
    if (!secureRandomAvailable) throw new Error('Secure randomness is unavailable');
    // Reject the small out-of-range tail so every result has equal probability.
    const range = 0x100000000;
    const limit = range - (range % max);
    const b = new Uint32Array(1);
    do { crypto.getRandomValues(b); } while (b[0] >= limit);
    return b[0] % max;
  };

  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const selectedSets = () => [...checks].filter(c => c.checked).map(c => c.dataset.set);

  const generate = () => {
    if (!secureRandomAvailable) {
      out.value = 'secure randomness unavailable';
      return;
    }
    const sets = selectedSets();
    if (!sets.length) {
      out.value = 'pick at least one set';
      return;
    }
    const len = +lenEl.value;
    const chars = [];
    sets.forEach(s => chars.push(SETS[s][randInt(SETS[s].length)]));
    while (chars.length < len) {
      const s = sets[randInt(sets.length)];
      chars.push(SETS[s][randInt(SETS[s].length)]);
    }
    out.value = shuffle(chars).slice(0, len).join('');
    updateStrength();
  };

  const updateStrength = () => {
    const sets = selectedSets().length;
    const len = +lenEl.value;
    let score = 0;
    if (len >= 12) score++;
    if (len >= 16) score++;
    if (sets >= 2) score++;
    if (sets >= 3) score++;
    if (sets === 4) score++;
    let label, level, width;
    if (score <= 2) { label = 'weak'; level = 'weak'; width = 33; }
    else if (score <= 4) { label = 'medium'; level = 'medium'; width = 66; }
    else { label = 'strong'; level = 'strong'; width = 100; }
    bar.className = 'pg-strength-bar ' + level;
    bar.querySelector('i').style.width = width + '%';
    barTxt.textContent = label;
  };

  const copy = async () => {
    const value = out.value;
    if (!value || value === 'pick at least one set' || value === 'secure randomness unavailable') return;
    let ok = false;
    try { await navigator.clipboard.writeText(value); ok = true; }
    catch (e) {
      out.select();
      try { document.execCommand('copy'); ok = true; } catch (e2) { /* ignore */ }
    }
    if (ok) {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
      }, 1200);
    }
  };

  lenEl.addEventListener('input', () => {
    lenVal.textContent = lenEl.value;
    updateStrength();
  });
  checks.forEach(c => c.addEventListener('change', updateStrength));
  genBtn.addEventListener('click', generate);
  copyBtn.addEventListener('click', copy);

  generate();
})();

// =====================================================
//  DICE ROLLER
// =====================================================
(() => {
  const root = document.querySelector('.demo[data-demo="dice"]');
  if (!root) return;
  const dice = root.querySelectorAll('.dc-die');
  const totalEl = root.querySelector('.dc-total');
  const rollBtn = root.querySelector('.dc-roll');
  const clearBtn = root.querySelector('.dc-clear');
  const history = root.querySelector('.dc-history');

  const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  const rand = n => Math.floor(Math.random() * n) + 1;
  let rolling = false;

  const addHistory = item => {
    const li = document.createElement('li');
    li.textContent = item;
    history.prepend(li);
    while (history.children.length > 8) history.removeChild(history.lastChild);
  };

  clearBtn.addEventListener('click', () => { history.innerHTML = ''; });

  rollBtn.addEventListener('click', () => {
    if (rolling) return;
    rolling = true;
    dice.forEach(d => d.classList.add('rolling'));
    setTimeout(() => {
      const a = rand(6);
      const b = rand(6);
      dice[0].textContent = FACES[a - 1];
      dice[1].textContent = FACES[b - 1];
      totalEl.textContent = `total: ${a + b}`;
      addHistory(`${a} + ${b} = ${a + b}`);
      dice.forEach(d => d.classList.remove('rolling'));
      rolling = false;
    }, 420);
  });

  rollBtn.click();
})();

// =====================================================
//  WORD COUNTER
// =====================================================
(() => {
  const root = document.querySelector('.demo[data-demo="counter"]');
  if (!root) return;
  const input = root.querySelector('.wc-input');
  const nums = root.querySelectorAll('.wc-num');

  const update = () => {
    const t = input.value;
    const trimmed = t.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = t.length;
    const sentences = (t.match(/[.!?]+(\s|$)/g) || []).length;
    const mins = words ? Math.max(1, Math.ceil(words / 200)) : 0;

    nums.forEach(el => {
      const kind = el.dataset.kind;
      const val = kind === 'words' ? words : kind === 'chars' ? chars : kind === 'sentences' ? sentences : mins;
      el.textContent = val;
    });
  };

  input.addEventListener('input', update);
  update();
})();

// =====================================================
//  MD5 CRACKER (dictionary + numeric brute force)
// =====================================================
(() => {
  const root = document.querySelector('.demo[data-demo="md5"]');
  if (!root) return;

  const form = root.querySelector('.md5-form');
  const input = root.querySelector('.md5-in');
  const btn = root.querySelector('.md5-btn');
  const out = root.querySelector('.md5-out');
  const status = root.querySelector('.md5-status');
  const tryBtn = root.querySelector('.md5-try');
  const wordsEl = root.querySelector('.md5-words');
  const fileEl = root.querySelector('.md5-file');
  const listCount = root.querySelector('.md5-list-count');

  // Compact, dependency-free MD5 (works on UTF-8 bytes).
  const md5 = (() => {
    const S = [
      7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
      5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
      4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
      6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21,
    ];
    const K = new Int32Array(64);
    for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
    const enc = new TextEncoder();
    const hex = x => {
      let s = '';
      for (let i = 0; i < 4; i++) s += ((x >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
      return s;
    };
    return str => {
      const bytes = enc.encode(str);
      const len = bytes.length;
      const buf = new Uint8Array((((len + 8) >> 6) + 1) << 6);
      buf.set(bytes);
      buf[len] = 0x80;
      const view = new DataView(buf.buffer);
      const bits = len * 8;
      view.setUint32(buf.length - 8, bits >>> 0, true);
      view.setUint32(buf.length - 4, Math.floor(bits / 4294967296), true);

      let a0 = 0x67452301 | 0;
      let b0 = 0xefcdab89 | 0;
      let c0 = 0x98badcfe | 0;
      let d0 = 0x10325476 | 0;
      const M = new Int32Array(16);

      for (let off = 0; off < buf.length; off += 64) {
        for (let i = 0; i < 16; i++) M[i] = view.getInt32(off + i * 4, true);
        let A = a0, B = b0, C = c0, D = d0;
        for (let i = 0; i < 64; i++) {
          let F, g;
          if (i < 16) { F = (B & C) | (~B & D); g = i; }
          else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) & 15; }
          else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) & 15; }
          else { F = C ^ (B | ~D); g = (7 * i) & 15; }
          F = (F + A + K[i] + M[g]) | 0;
          A = D; D = C; C = B;
          const s = S[i];
          B = (B + ((F << s) | (F >>> (32 - s)))) | 0;
        }
        a0 = (a0 + A) | 0;
        b0 = (b0 + B) | 0;
        c0 = (c0 + C) | 0;
        d0 = (d0 + D) | 0;
      }
      return hex(a0) + hex(b0) + hex(c0) + hex(d0);
    };
  })();

  const WORDS = `
    123456 password 12345678 qwerty 123456789 12345 1234 111111 1234567
    dragon 123123 baseball abc123 football monkey letmein shadow master 666666
    qwertyuiop 123321 mustang 1234567890 michael 654321 superman 1qaz2wsx
    7777777 121212 000000 qazwsx 123qwe killer trustno1 jordan jennifer
    zxcvbnm asdfgh hunter buster soccer harley batman andrew tigger sunshine
    iloveyou 2000 charlie robert thomas hockey ranger daniel starwars klaster
    112233 george computer michelle jessica pepper 1111 zxcvbn 555555 11111111
    131313 freedom 777777 pass maggie 159753 aaaaaa ginger princess joshua
    cheese amanda summer love ashley 6969 nicole chelsea biteme matthew access
    yankees 987654321 dallas austin thunder taylor matrix montana moon moscow
    1234qwer admin root welcome login guest test test123 password1 password123
    password12 password2 passw0rd p@ssw0rd qwerty123 qwerty1 iloveyou1 admin123
    root123 abcdef abcdefg abcd1234 1q2w3e4r 1q2w3e 1qaz2wsx3edc zaq12wsx
    qazxsw asdf asdfghjkl asdf1234 qwer1234 welcome1 letmein1 sunshine1
    princess1 football1 baseball1 dragon1 master1 shadow1 monkey1 superman1
    batman1 hello hello123 whatever nothing secret secret123 default changeme
    letmein123 mypassword mypass pass1234 testing demo demo123 sample temp
    temporary 123abc abc1234 111222 121314 12344321 159357 246810 135790
    102030 123654 147258 2580 11223344 87654321 99999999 88888888 77777777
    66666666 55555555 44444444 33333333 22222222 00000000 12341234 1122 1212
    1313 4321 2222 3333 4444 5555 7777 8888 9999 1004 2001 2020 2021 2022
    2023 2024 2025 2026 nepal kathmandu pokhara himalaya everest sanskar
    pradhan john james david mary sarah jessica michael jennifer
  `.trim().split(/\s+/);

  const MAX_WORDS = 500000;
  const MAX_FILE = 5 * 1024 * 1024;

  const wordVariants = w => {
    const list = [w, w + '1', w + '123', w + '1234', w + '!'];
    if (/^[a-z]/.test(w)) {
      list.push(w[0].toUpperCase() + w.slice(1));
      list.push(w.toUpperCase());
    }
    return [...new Set(list)];
  };

  let busy = false;
  let token = 0;
  let customWords = [];
  let countTimer = null;

  const setStatus = t => { status.textContent = t; };
  const setOut = (t, found) => {
    out.textContent = t;
    out.classList.toggle('found', Boolean(found));
  };

  const finish = (plain, message) => {
    busy = false;
    btn.disabled = false;
    btn.textContent = 'crack';
    if (plain === null) setOut('not found', false);
    else setOut(plain, true);
    setStatus(message);
  };

  const readyStatus = () => {
    setStatus(customWords.length
      ? `ready · built-in + ${customWords.length.toLocaleString()} custom words + PINs`
      : 'ready · dictionary + numeric PINs');
  };

  const readCustom = () => {
    const seen = new Set();
    const list = [];
    const lines = wordsEl.value.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const w = lines[i].trim();
      if (w && !seen.has(w)) {
        seen.add(w);
        list.push(w);
        if (list.length >= MAX_WORDS) break;
      }
    }
    customWords = list;
    listCount.textContent = list.length.toLocaleString() + ' word' +
      (list.length === 1 ? '' : 's') +
      (list.length >= MAX_WORDS ? ' (limit)' : '');
    if (!busy) readyStatus();
  };

  const scheduleRead = () => {
    clearTimeout(countTimer);
    countTimer = setTimeout(readCustom, 200);
  };

  const crack = () => {
    const hash = input.value.trim().toLowerCase();
    if (!/^[a-f0-9]{32}$/.test(hash)) {
      setOut('—', false);
      setStatus('enter a valid 32-character md5 hash');
      return;
    }

    clearTimeout(countTimer);
    readCustom();

    const myToken = ++token;
    busy = true;
    btn.disabled = true;
    btn.textContent = 'cracking…';
    setOut('…', false);
    setStatus('checking built-in dictionary…');

    const runWords = (words, label, next) => {
      let i = 0;
      const STEP = 600;
      const tick = () => {
        if (myToken !== token) return;
        const stop = Math.min(i + STEP, words.length);
        for (; i < stop; i++) {
          const variants = wordVariants(words[i]);
          for (let v = 0; v < variants.length; v++) {
            if (md5(variants[v]) === hash) {
              finish(variants[v], `match found · ${label} #${i + 1}`);
              return;
            }
          }
        }
        if (i < words.length) {
          setStatus(`checking ${label}… ${Math.floor((i / words.length) * 100)}%`);
          setTimeout(tick, 0);
        } else {
          next();
        }
      };
      tick();
    };

    const runNumeric = () => {
      if (myToken !== token) return;
      const LIMIT = 1000000;
      const STEP = 6000;
      let n = 0;

      const tick = () => {
        if (myToken !== token) return;
        const stop = Math.min(n + STEP, LIMIT);
        for (; n < stop; n++) {
          const plain = String(n);
          if (md5(plain) === hash) {
            finish(plain, `match found · numeric candidate ${plain}`);
            return;
          }
          if (n < 10000) {
            const pin = plain.padStart(4, '0');
            if (pin !== plain && md5(pin) === hash) {
              finish(pin, `match found · numeric candidate ${pin}`);
              return;
            }
          }
          if (n < 100000) {
            const padded = plain.padStart(6, '0');
            if (md5(padded) === hash) {
              finish(padded, `match found · numeric candidate ${padded}`);
              return;
            }
          }
        }
        if (n < LIMIT) {
          setStatus(`checking numeric PINs… ${Math.floor((n / LIMIT) * 100)}%`);
          setTimeout(tick, 0);
        } else {
          finish(null, customWords.length
            ? 'no match in built-in list, custom list, or 0–999999'
            : 'no match in dictionary or 0–999999');
        }
      };

      tick();
    };

    runWords(WORDS, 'built-in dictionary', () => {
      if (myToken !== token) return;
      if (customWords.length) {
        setStatus(`checking custom list (${customWords.length.toLocaleString()} words)…`);
        runWords(customWords, 'custom list', runNumeric);
      } else {
        runNumeric();
      }
    });
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    crack();
  });

  input.addEventListener('input', () => {
    token++;
    if (busy) {
      busy = false;
      btn.disabled = false;
      btn.textContent = 'crack';
    }
    setOut('—', false);
    readyStatus();
  });

  wordsEl.addEventListener('input', scheduleRead);

  fileEl.addEventListener('change', async () => {
    const file = fileEl.files && fileEl.files[0];
    if (!file) return;
    if (file.size > MAX_FILE) {
      setStatus('file too large · max 5 MB');
      fileEl.value = '';
      return;
    }
    try {
      wordsEl.value = await file.text();
      clearTimeout(countTimer);
      readCustom();
      setStatus(`loaded ${file.name} · ${customWords.length.toLocaleString()} words`);
    } catch (e) {
      setStatus('could not read that file');
    }
    fileEl.value = '';
  });

  tryBtn.addEventListener('click', () => {
    input.value = '5f4dcc3b5aa765d61d8327deb882cf99';
    crack();
  });

  readCustom();
})();
