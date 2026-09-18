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
  try { todos = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { todos = []; }

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

  const randInt = (max) => {
    if (window.crypto && crypto.getRandomValues) {
      const b = new Uint32Array(1);
      crypto.getRandomValues(b);
      return b[0] % max;
    }
    return Math.floor(Math.random() * max);
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
    if (!value || value === 'pick at least one set') return;
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