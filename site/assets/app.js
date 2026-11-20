'use strict';
// G247 study site: router, pages, quiz and practice-exam engines, search and local progress.
// Plain JavaScript, no dependencies. Content comes from data/*.js: COURSE, QUIZZES, GUIDES,
// EXERCISES, and PRACTICE_BANK and SIMULACROS (practice-bank.js).
(() => {
  const C = window.COURSE, Q = window.QUIZZES || {}, G = window.GUIDES || {};
  // Practice bank: register fixes, extra questions for the generated quizzes and the quizzes without a lab.
  const PB = window.PRACTICE_BANK || {};
  for (const [k, qs] of Object.entries(PB.add || {})) if (Q[k]) Q[k] = { ...Q[k], questions: [...Q[k].questions, ...qs] };
  for (const [k, quiz] of Object.entries(PB.quizzes || {})) Q[k] = quiz;
  for (const quiz of Object.values(Q)) for (const q of quiz.questions) if (PB.fixes?.[q.id]) Object.assign(q, PB.fixes[q.id]);
  // Practical exercises, ordered by block (JavaScript, Express, React) and id.
  const KIND_BLOCK = { js: 1, express: 2, react: 3 };
  const X = (window.EXERCISES || []).slice().sort((a, b) => KIND_BLOCK[a.kind] - KIND_BLOCK[b.kind] || a.id.localeCompare(b.id));
  const XB = Object.fromEntries(X.map((x) => [x.id, x]));
  // Practice exams: built only from quiz questions and practical exercises (practice-bank.js).
  const QB = Object.fromEntries(Object.values(Q).flatMap((quiz) => quiz.questions).map((q) => [q.id, q]));
  const E = window.SIMULACROS
    ? window.SIMULACROS.map((x) => ({ n: x.n, questions: x.questions.map((id) => QB[id]).filter(Boolean), practical: x.practical }))
    : (window.EXAMS || []);
  // Clean URLs: the app lives at BASE (e.g. /cunef-web-programming-study/) and routes by path.
  // Links are written as "#/route" in the templates and turned into BASE + "route" when rendered.
  const BASE = new URL('..', document.currentScript.src).pathname;
  // Language: chosen by index.html from the URL (/en/...) or the saved preference.
  const LANG = window.LANG === 'en' ? 'en' : 'es';
  const PREFIX = LANG === 'en' ? 'en/' : '';
  const LOCALE = LANG === 'en' ? 'en-GB' : 'es-ES';
  const toPath = (href) => (href.startsWith('#/') ? BASE + PREFIX + href.slice(2) : href);
  // English interface: whole texts first, then the rules for texts built with numbers (i18n-en.js).
  const I18N = LANG === 'en' ? window.I18N_EN : null;
  const RULES = I18N ? I18N.rules.map(([re, to]) => [new RegExp(re, 'g'), to]) : [];
  function tr(text) {
    if (!I18N || text == null) return text;
    const t = String(text), core = t.trim();
    if (!core) return t;
    if (Object.prototype.hasOwnProperty.call(I18N.exact, core)) return t.replace(core, I18N.exact[core]);
    let out = t;
    for (const [re, to] of RULES) { re.lastIndex = 0; out = out.replace(re, to); }
    if (out !== t) { const c2 = out.trim(); if (Object.prototype.hasOwnProperty.call(I18N.exact, c2)) out = out.replace(c2, I18N.exact[c2]); }
    return out;
  }
  const SKIP_TR = 'code, pre, textarea, script, style, .prose, [data-no-tr]';
  function translateTree(node) {
    if (!I18N || !node) return;
    if (node.nodeType === 3) { if (!node.parentElement?.closest(SKIP_TR)) { const v = tr(node.nodeValue); if (v !== node.nodeValue) node.nodeValue = v; } return; }
    if (node.nodeType !== 1 || node.matches(SKIP_TR)) return;
    for (const a of ['aria-label', 'title', 'placeholder']) if (node.hasAttribute(a)) node.setAttribute(a, tr(node.getAttribute(a)));
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = walker.nextNode())) {
      if (n.nodeType === 1) {
        if (n.matches(SKIP_TR)) { /* skip its subtree */ let next = n; while (next && !next.nextSibling && next !== node) next = next.parentNode; continue; }
        for (const a of ['aria-label', 'title', 'placeholder']) if (n.hasAttribute(a)) n.setAttribute(a, tr(n.getAttribute(a)));
      } else if (!n.parentElement?.closest(SKIP_TR)) { const v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
    }
  }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const main = $('#main');
  const LETTERS = 'ABCDEF';
  const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  // ---------- Helpers ----------
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const icon = (name, cls = '') => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  // The small Markdown subset used by questions: fenced code, `code`, **bold**, *italic*, line breaks.
  function inline(s) {
    return String(s).split('`').map((part, i) => {
      if (i % 2) return '<code>' + esc(part) + '</code>';
      return esc(part).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>').replace(/\n/g, '<br>');
    }).join('');
  }
  function md(s) {
    return String(s ?? '').split(/```[a-z]*\n([\s\S]*?)```/).map((chunk, i) => (i % 2
      ? '<pre><code>' + esc(chunk.replace(/\n$/, '')) + '</code></pre>'
      : inline(chunk.replace(/^\n+|\n+$/g, '')))).join('');
  }
  // Block Markdown for exercises: paragraphs, lists, tables and fenced code.
  function mdBlock(src) {
    return String(src ?? '').split(/```[a-z]*\n([\s\S]*?)```/).map((chunk, i) => {
      if (i % 2) return '<pre><code>' + esc(chunk.replace(/\n$/, '')) + '</code></pre>';
      return chunk.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean).map((b) => {
        const lines = b.split('\n');
        if (lines.every((l) => /^\|.*\|$/.test(l.trim()))) {
          const rows = lines.filter((l) => !/^\|[\s:|-]+\|$/.test(l.trim())).map((l) => l.trim().slice(1, -1).split('|').map((c) => c.trim()));
          return `<div class="table-wrap"><table><thead><tr>${rows[0].map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
        }
        if (lines.every((l) => /^\d+\.\s/.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\.\s/, ''))}</li>`).join('')}</ol>`;
        if (lines.every((l) => /^-\s/.test(l))) return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^-\s/, ''))}</li>`).join('')}</ul>`;
        const head = lines.findIndex((l) => /^(\d+\.|-)\s/.test(l));
        if (head > 0 && lines.slice(head).every((l) => /^(\d+\.|-)\s/.test(l))) return mdBlock(lines.slice(0, head).join('\n')) + mdBlock(lines.slice(head).join('\n'));
        return `<p>${inline(b)}</p>`;
      }).join('');
    }).join('');
  }
  const codeFile = (f, open = true) => `<figure class="code-file"><figcaption><span>${esc(f.name)}</span><button class="copy-mini" type="button" data-copy>${icon('copy')}Copiar</button></figcaption><pre${open ? '' : ' hidden'}><code>${esc(f.code)}</code></pre></figure>`;
  const plain = (s) => String(s ?? '').replace(/```[a-z]*\n[\s\S]*?```/g, ' […] ').replace(/[`*]/g, '').replace(/\s+/g, ' ').trim();
  const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const fmtNum = (n, d = 1) => n.toLocaleString(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const fmtPts = (n) => n.toLocaleString(LOCALE, { maximumFractionDigits: 2 });
  // "sesiones 10-11", "sesión 37"; a non-numeric value ("repaso transversal") is shown as is.
  const sessLabel = (v) => { const t = String(v ?? ''); return /^\d/.test(t) ? `${/[-,]/.test(t) ? 'sesiones' : 'sesión'} ${t}` : t; };
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const fmtShort = (ts) => new Date(ts).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' });
  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const isObjective = (q) => q.type !== 'essay';
  const objective = (qs) => qs.filter(isObjective).length;
  const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  const typeLabel = { mc: 'Opción múltiple', tf: 'Verdadero o falso', fib: 'Completar', essay: 'Ejercicio de programación' };

  // ---------- Course model ----------
  const BLOCKS = C.blocks.map((b) => ({ ...b, color: `b${b.id}`, sessions: b.weekList.flatMap((w) => w.sessions.map((s) => ({ ...s, week: w.n }))) }));
  // Quizzes are keyed by lab number (1-10) or, for topics without a lab, by a word ("dom", "context").
  const blockOfQuiz = (n) => BLOCKS.find((b) => b.quizzes.some((k) => String(k) === String(n)));
  const QUIZ_META = C.quizMeta || {};
  const quizInfo = (n) => ({ ...(QUIZ_META[n] || {}), ...(Q[n] || {}) });
  const quizName = (n) => quizInfo(n).name || `Quiz ${n}`;
  const quizShort = (n) => (/^\d+$/.test(String(n)) ? 'Q' + n : (quizInfo(n).short || String(n).slice(0, 3).toUpperCase()));
  const QUIZ_ORDER = [...BLOCKS.flatMap((b) => b.quizzes.map(String)), ...Object.keys(Q)].filter((k, i, a) => Q[k] && a.indexOf(k) === i);
  const blockById = (id) => BLOCKS.find((b) => String(b.id) === String(id));
  const SESSIONS = BLOCKS.flatMap((b) => b.sessions.map((s) => ({ ...s, block: b })));
  const labSession = (id) => SESSIONS.find((s) => s.lab === id);

  // Question index: every question by id, with its source and block.
  const PREFIX_BLOCK = { c1: 1, c2: 1, c3: 1, html: 1, css: 1, js: 1, dom: 1, node: 2, express: 2, rest: 2, sql: 2, auth: 2, components: 3, state: 3, routing: 3 };
  const QI = {};
  for (const n of Object.keys(Q)) for (const q of Q[n].questions) QI[q.id] = { q, quiz: String(n), block: blockOfQuiz(n)?.id, rubric: Q[n].rubric };
  for (const x of E) for (const q of x.questions) if (!QI[q.id]) QI[q.id] = { q, exam: x.n, block: PREFIX_BLOCK[q.id.split('-')[0]] || null };
  const allObjective = Object.values(QI).filter((e) => isObjective(e.q) && e.q.choices);

  // ---------- Local progress ----------
  const KEY = 'g247-study-v2';
  const S = (() => {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { s = null; }
    if (!s || typeof s !== 'object') s = {};
    for (const k of ['quiz', 'exam', 'wrong', 'current', 'ex']) if (!s[k] || typeof s[k] !== 'object') s[k] = {};
    if (!s.migrated) { // best scores saved by the first version of the site
      try {
        const old = JSON.parse(localStorage.getItem('g247-progress') || '{}');
        for (const [k, v] of Object.entries(old)) {
          let m = k.match(/^quiz-(\d+)$/);
          if (m && Q[m[1]]) s.quiz[m[1]] = { best: v, last: v, attempts: 1, total: objective(Q[m[1]].questions) };
          m = k.match(/^simulacro-(\d+)$/);
          if (m) s.exam[m[1]] = { best: v, last: v, attempts: 1, total: 8 };
        }
      } catch { /* nothing to migrate */ }
      s.migrated = 1;
    }
    return s;
  })();
  let saveTimer = 0;
  const save = (now) => {
    clearTimeout(saveTimer);
    const write = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage unavailable */ } };
    if (now) write(); else saveTimer = setTimeout(write, 250);
  };
  function recordAttempt(kind, key, right, total) {
    const e = S[kind][key] || (S[kind][key] = { attempts: 0 });
    const improved = e.best == null || right > e.best;
    const prevBest = e.best;
    e.attempts++; e.last = right; e.total = total; e.at = Date.now();
    if (improved) e.best = right;
    save(true);
    return { improved, prevBest };
  }
  function markAnswer(id, ok) {
    if (ok === true) delete S.wrong[id];
    else if (ok === false) S.wrong[id] = Date.now();
    save();
  }
  const setLast = (href, title, sub) => { S.last = { href, title, sub, lang: LANG, at: Date.now() }; save(); };
  // "Continue where you left off" saved in the other language: rebuild its label from the data.
  function lastInLang(last) {
    if (!last || (last.lang || 'es') === LANG) return last;
    const [, page, arg] = last.href.replace(/^#\/?/, '').split('/').concat('', '');
    if (page === 'quiz' && Q[arg]) return { ...last, title: `${quizName(arg)} · ${Q[arg].title}`, sub: '' };
    if (page === 'ejercicio' && XB[arg]) return { ...last, title: `Ejercicio ${arg} · ${XB[arg].title}`, sub: '' };
    if (page === 'simulacro') return { ...last, title: arg === 'aleatorio' ? 'Simulacro aleatorio' : `Simulacro ${arg}`, sub: '' };
    if (page === 'guia') return { ...last, title: `Guía del bloque ${arg}`, sub: '' };
    return { ...last, title: tr('Continuar'), sub: '' };
  }
  const wrongIds = () => Object.keys(S.wrong).filter((id) => QI[id]);

  // ---------- Shell: sidebar, theme, toast, mobile menu ----------
  function navLink(href, label, key, active, extra = '', ic = '') {
    return `<a class="nav-link${key === active ? ' active' : ''}" href="${href}"${key === active ? ' aria-current="page"' : ''}>${ic}<span>${label}</span>${extra}</a>`;
  }
  function renderNav(active) {
    const wrong = wrongIds().length;
    $('#side-nav').innerHTML = `
      <div class="nav-group">
        ${navLink('#/', 'Inicio', 'home', active, '', icon('home'))}
      </div>
      <div class="nav-group"><div class="nav-label">Curso</div>
        ${navLink('#/curso', 'Mapa del curso', 'curso', active, '', icon('calendar'))}
        ${BLOCKS.map((b) => navLink(`#/bloque/${b.id}`, `Bloque ${b.roman} · ${esc(b.title)}`, 'b' + b.id, active, '', `<span class="nav-dot" style="background:var(--${b.color})"></span>`)).join('')}
      </div>
      <div class="nav-group"><div class="nav-label">Estudiar</div>
        ${BLOCKS.filter((b) => b.guide && G[b.guide]).map((b) => navLink(`#/guia/${b.guide}`, `Guía del bloque ${b.roman}`, 'g-' + b.guide, active, '', icon('book'))).join('')}
        ${C.architecture ? navLink('#/arquitectura', esc(C.architecture.title), 'arquitectura', active, '', icon('layers')) : ''}
      </div>
      <div class="nav-group"><div class="nav-label">Practicar</div>
        ${navLink('#/quizzes', 'Quizzes por laboratorio', 'quizzes', active, '', icon('check-square'))}
        ${X.length ? navLink('#/ejercicios', 'Ejercicios prácticos', 'ejercicios', active, '', icon('code')) : ''}
        ${navLink('#/simulacros', 'Simulacros del examen', 'simulacros', active, '', icon('clipboard'))}
        ${navLink('#/repaso', 'Repaso de errores', 'repaso', active, wrong ? `<span class="badge">${wrong}</span>` : '', icon('rotate'))}
      </div>
      <div class="nav-group"><div class="nav-label">Recursos</div>
        ${navLink('#/recursos', 'Laboratorios y recursos', 'recursos', active, '', icon('link'))}
        ${navLink('#/progreso', 'Progreso', 'progreso', active, '', icon('chart'))}
      </div>`;
  }

  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
  }

  $('#theme-btn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('g247-theme', next); } catch { /* ignore */ }
    toast(next === 'dark' ? 'Tema oscuro' : 'Tema claro');
  });

  const menuBtn = $('#menu-btn'), backdrop = $('#backdrop');
  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    backdrop.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', tr(open ? 'Cerrar el menú' : 'Abrir el menú'));
    if (open) $('#sidebar .nav-link')?.focus();
  }
  menuBtn.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  backdrop.addEventListener('click', () => setNav(false));
  $('#sidebar').addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });

  // ---------- View lifecycle ----------
  let view = { ac: new AbortController(), cleanups: [] };
  function newView() {
    view.ac.abort();
    view.cleanups.forEach((f) => { try { f(); } catch { /* ignore */ } });
    view = { ac: new AbortController(), cleanups: [] };
    return view;
  }
  const on = (el, ev, fn, opts = {}) => el.addEventListener(ev, fn, { ...opts, signal: view.ac.signal });
  function render(html, title, { wide = false, keepScroll = false } = {}) {
    main.classList.toggle('wide', wide);
    main.innerHTML = html;
    document.title = title ? `${tr(title)} · G247` : `G247 · ${tr('Programación de aplicaciones Web')}`;
    if (!keepScroll) window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  // ---------- Shared fragments ----------
  function crumbs(items) {
    const all = [['Inicio', '#/'], ...items];
    return `<nav class="crumbs" aria-label="Ruta">${all.map(([t, h], i) => (i < all.length - 1 || h
      ? `${i ? icon('chevron') : ''}<a href="${h}">${esc(t)}</a>`
      : `${icon('chevron')}<span aria-current="page">${esc(t)}</span>`)).join('')}</nav>`;
  }
  function pageHead({ path = [], eyebrow = '', title, lead = '', meta = '', right = '', eyebrowStyle = '' }) {
    return `<header class="page-head">${crumbs(path)}
      <div class="page-head-row"><div>
        ${eyebrow ? `<p class="eyebrow"${eyebrowStyle ? ` style="${eyebrowStyle}"` : ''}>${eyebrow}</p>` : ''}
        <h1>${title}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ''}
      </div>${right}</div>
      ${meta ? `<div class="meta-row">${meta}</div>` : ''}
    </header>`;
  }
  const sectionHead = (title, link = '') => `<div class="section-head"><h2>${title}</h2>${link}</div>`;
  const bar = (p, cls = '') => `<div class="bar ${cls}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}"><span style="width:${p}%"></span></div>`;

  function quizCard(n) {
    const q = Q[n];
    const b = blockOfQuiz(n);
    if (!q) { const m = quizInfo(n); return `<div class="card muted-card quiz-card"><div class="card-top"><span class="q-num">${esc(quizName(n))}${m.sessions ? ` · ${esc(sessLabel(m.sessions))}` : ''}</span><span class="chip">Próximamente</span></div><h3>${esc(m.title || 'Disponible próximamente')}</h3><p>${/^\d+$/.test(String(n)) ? `Quiz del laboratorio L${n}.` : 'Quiz de repaso del tema, sin laboratorio asociado.'}</p></div>`; }
    const total = objective(q.questions), essays = q.questions.length - total;
    const rec = S.quiz[n], cur = S.current['quiz-' + n];
    let foot;
    if (cur && cur.i > 0) foot = `<span class="chip warn">${icon('clock')}A medias · ${cur.i}/${cur.order.length}</span>`;
    else if (rec?.best != null) {
      const p = pct(rec.best, rec.total || total);
      foot = `<span class="chip ${p >= 70 ? 'ok' : p >= 50 ? 'warn' : 'bad'} score-pill">${icon('award')}Mejor: ${rec.best}/${rec.total || total}</span><span class="chip plain">${plural(rec.attempts, 'intento', 'intentos')}</span>`;
    } else foot = '<span class="chip plain">Sin empezar</span>';
    return `<a class="card quiz-card" href="#/quiz/${n}">
      ${icon('arrow-right', 'go')}
      <div class="card-top"><span class="q-num">${esc(quizName(n))} · ${q.lab ? esc(q.lab) : 'Sin laboratorio'}</span><span class="chip ${b.color}">Bloque ${b.roman}</span></div>
      <h3>${esc(q.title)}</h3>
      <p>${plural(q.questions.length, 'pregunta', 'preguntas')}${essays ? ` · ${essays} de programar` : ''} · ${esc(sessLabel(q.sessions))}</p>
      ${rec?.best != null ? bar(pct(rec.best, rec.total || total), pct(rec.best, rec.total || total) >= 70 ? 'ok' : '') : ''}
      <div class="card-foot">${foot}</div></a>`;
  }

  function examCard(x) {
    const rec = S.exam[x.n], cur = S.current['sim-' + x.n];
    const foot = cur ? `<span class="chip warn">${icon('clock')}En curso</span>`
      : rec?.best != null ? `<span class="chip ${rec.best >= 4 ? 'ok' : 'bad'} score-pill">${icon('award')}Mejor: ${fmtNum(rec.best * 0.5)} / 4</span><span class="chip plain">${plural(rec.attempts, 'intento', 'intentos')}</span>`
        : '<span class="chip plain">Sin hacer</span>';
    return `<a class="card" href="#/simulacro/${x.n}">${icon('arrow-right', 'go')}
      <div class="card-top"><span class="icon-tile">${icon('clipboard')}</span></div>
      <h3>Simulacro ${x.n}</h3><p>${x.questions.length} preguntas tipo test${x.practical?.length ? ` y ${plural(x.practical.length, 'ejercicio práctico', 'ejercicios prácticos')}` : ' de los tres bloques · 0,5 puntos cada una'}</p>
      <div class="card-foot">${foot}</div></a>`;
  }
  function randomExamCard() {
    const rec = S.exam.aleatorio;
    return `<a class="card" href="#/simulacro/aleatorio">${icon('arrow-right', 'go')}
      <div class="card-top"><span class="icon-tile">${icon('shuffle')}</span></div>
      <h3>Simulacro aleatorio</h3><p>8 preguntas nuevas en cada intento, sacadas de todo el banco: 3 del bloque I, 3 del II y 2 del III${HAS_PRACTICAL ? ', y un ejercicio práctico de cada tipo' : ''}.</p>
      <div class="card-foot">${rec?.attempts ? `<span class="chip plain">${plural(rec.attempts, 'intento', 'intentos')}</span>` : '<span class="chip plain">Ilimitado</span>'}</div></a>`;
  }

  function labRows(labs) {
    return `<div class="list-card">${labs.map((l) => {
      const s = labSession(l.id);
      return `<div class="lab-row">
        <span class="lab-id">${esc(l.id)}</span>
        <div class="lab-main"><div class="t">${esc(l.title)}</div><div class="s">${s ? `Semana ${s.week} · Sesión ${esc(s.n)} · Bloque ${s.block.roman}` : ''}</div></div>
        <div class="lab-links">
          ${l.brief ? `<a class="btn sm secondary" href="${l.brief}" target="_blank" rel="noopener">Enunciado ${icon('external')}</a>` : '<span class="chip">Enunciado próximamente</span>'}
          ${l.solutionUrl ? `<a class="btn sm secondary" href="${l.solutionUrl}" target="_blank" rel="noopener">Solución ${icon('external')}</a>` : l.brief ? '<span class="chip">Solución no publicada</span>' : ''}
        </div></div>`;
    }).join('')}</div>`;
  }

  // "el bloque I", "los bloques I y II", "los bloques I, II y III": follows whatever guides data/guides.js contains.
  const listRomans = (bs) => { const r = bs.map((b) => b.roman); return r.length < 2 ? `el bloque ${r[0] || ''}` : `los bloques ${r.slice(0, -1).join(', ')} y ${r[r.length - 1]}`; };

  // ---------- Home ----------
  function home() {
    const quizKeys = Object.keys(Q);
    const doneQuizzes = quizKeys.filter((n) => S.quiz[n]?.attempts);
    const avg = doneQuizzes.length ? Math.round(doneQuizzes.reduce((a, n) => a + pct(S.quiz[n].best, S.quiz[n].total || objective(Q[n].questions)), 0) / doneQuizzes.length) : null;
    const exams = Object.values(S.exam).filter((e) => e.attempts);
    const bestExam = exams.length ? Math.max(...exams.map((e) => e.best)) : null;
    const wrong = wrongIds().length;
    const last = lastInLang(S.last);

    const cont = last
      ? `<a class="card continue-card" href="${esc(last.href)}"><span class="icon-tile">${icon(last.href.includes('/guia/') ? 'book' : 'play')}</span>
          <div class="txt"><div class="s">Continuar donde se dejó</div><div class="t">${esc(last.title)}</div><div class="s">${esc(last.sub || '')}</div></div>${icon('arrow-right')}</a>`
      : `<a class="card continue-card" href="#/guia/I"><span class="icon-tile">${icon('book')}</span>
          <div class="txt"><div class="s">Por dónde empezar</div><div class="t">Guía teórica del bloque I</div><div class="s">Leer la guía y hacer después el quiz de cada laboratorio</div></div>${icon('arrow-right')}</a>`;

    const WEEKS = BLOCKS.flatMap((b) => b.weekList);
    const map = `<a class="card continue-card" href="#/curso"><span class="icon-tile">${icon('calendar')}</span>
          <div class="txt"><div class="s">Mapa del curso</div><div class="t">El curso semana a semana</div><div class="s">${WEEKS.length} semanas, ${SESSIONS.length} sesiones y ${C.labs.length} laboratorios, con la documentación de cada semana</div></div>${icon('arrow-right')}</a>`;

    render(`
      <section class="hero">
        <div class="hero-main">
          <p class="eyebrow">${esc(C.code)}</p>
          <h1>${esc(C.title)}</h1>
          <p class="lead">Material de estudio de la asignatura: guías teóricas, un quiz por laboratorio con corrección inmediata, simulacros de la parte tipo test del examen y repaso de las preguntas falladas.</p>
          <div class="actions">
            <a class="btn secondary" href="#/simulacro/aleatorio">${icon('shuffle')}Simulacro aleatorio</a>
          </div>
        </div>
      </section>

      <div class="grid-2" style="margin-top:24px">${cont}${map}</div>
      ${C.architecture ? `<a class="card continue-card arch-banner" href="#/arquitectura" style="margin-top:16px"><span class="icon-tile">${icon('layers')}</span>
          <div class="txt"><div class="s">Repaso transversal</div><div class="t">${esc(C.architecture.title)}</div><div class="s">Del input del usuario a PostgreSQL y de vuelta: capas, middleware y carpetas de la Práctica 2</div></div>${icon('arrow-right')}</a>` : ''}

      ${sectionHead('Progreso', `<a href="#/progreso">Ver el detalle ${icon('arrow-right')}</a>`)}
      <div class="grid-4 stats">
        <div class="card stat"><span class="k">Quizzes hechos</span><span class="v">${doneQuizzes.length}<small> / ${quizKeys.length}</small></span>${bar(pct(doneQuizzes.length, quizKeys.length))}</div>
        <div class="card stat"><span class="k">Acierto medio</span><span class="v">${avg == null ? '—' : avg + '<small> %</small>'}</span><span class="d">Mejor intento de cada quiz</span></div>
        <div class="card stat"><span class="k">Mejor simulacro</span><span class="v">${bestExam == null ? '—' : fmtNum(bestExam * 0.5) + '<small> / 4</small>'}</span><span class="d">${plural(exams.reduce((a, e) => a + e.attempts, 0), 'intento', 'intentos')}</span></div>
        <a class="card stat" href="#/repaso" style="text-decoration:none;color:inherit"><span class="k">Por repasar</span><span class="v">${wrong}<small> ${wrong === 1 ? 'pregunta' : 'preguntas'}</small></span><span class="d">${wrong ? 'Falladas y aún no acertadas' : 'Ninguna pendiente'}</span></a>
      </div>

      ${sectionHead('Bloques del curso')}
      <div class="grid-3">${BLOCKS.map((b) => {
        const qd = b.quizzes.filter((n) => S.quiz[n]?.attempts).length;
        return `<a class="card block-card" href="#/bloque/${b.id}" style="--bc:var(--${b.color})">${icon('arrow-right', 'go')}
          <p class="eyebrow" style="color:var(--${b.color})">Bloque ${b.roman} · ${esc(b.weeks)}</p>
          <h3>${esc(b.title)}</h3><p>${esc(b.subtitle)}</p>
          <div class="card-foot"><span class="chip plain">${plural(b.weekList.length, 'semana', 'semanas')}</span><span class="chip plain">${plural(b.sessions.length, 'sesión', 'sesiones')}</span><span class="chip plain">Quizzes ${qd}/${b.quizzes.length}</span></div></a>`;
      }).join('')}</div>

      ${sectionHead('Preparar el examen')}
      <div class="grid-3">
        <a class="card" href="#/guia/I">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('book')}</span></div><h3>Guías teóricas</h3><p>Explicaciones completas de ${listRomans(BLOCKS.filter((b) => b.guide && G[b.guide]))}, con ejemplos de clase y errores habituales.</p></a>
        <a class="card" href="#/quizzes">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('check-square')}</span></div><h3>Quizzes</h3><p>${quizKeys.length} quizzes, uno por laboratorio, con la explicación de cada respuesta.</p></a>
        ${X.length ? `<a class="card" href="#/ejercicios">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('code')}</span></div><h3>Ejercicios prácticos</h3><p>${X.length} ejercicios cortos como los de la parte práctica, con pistas, solución y criterios de corrección.</p></a>` : ''}
        <a class="card" href="#/simulacros">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('clipboard')}</span></div><h3>Simulacros</h3><p>El examen completo: 8 preguntas tipo test (4 puntos) y 3 ejercicios prácticos (6 puntos).</p></a>
        <a class="card" href="#/recursos">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('link')}</span></div><h3>Laboratorios</h3><p>Enunciados y soluciones: repetirlos sin mirar la solución es la mejor preparación para la parte práctica.</p></a>
        <a class="card" href="#/repaso">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('rotate')}</span>${wrong ? `<span class="badge">${wrong}</span>` : ''}</div><h3>Repaso de errores</h3><p>Las preguntas falladas se guardan aquí hasta que se responden bien.</p></a>
      </div>`, '');
  }

  // ---------- Block ----------
  function blockPage(id) {
    const b = blockById(id);
    if (!b) return notFound();
    const labs = C.labs.filter((l) => b.sessions.some((s) => s.lab === l.id));
    const qd = b.quizzes.filter((n) => S.quiz[n]?.attempts).length;
    const blockWrong = wrongIds().filter((qid) => QI[qid].block === b.id).length;
    render(`
      ${pageHead({
        path: [[`Bloque ${b.roman}`, '']],
        eyebrow: `Bloque ${b.roman} · ${esc(b.weeks)}`, eyebrowStyle: `color:var(--${b.color})`,
        title: esc(b.title), lead: esc(b.subtitle),
        meta: `<span class="chip plain">${icon('calendar')}${plural(b.weekList.length, 'semana', 'semanas')} · sesiones ${esc(b.sessions[0].n)} a ${esc(b.sessions[b.sessions.length - 1].n)}</span><span class="chip plain">${plural(labs.length, 'laboratorio', 'laboratorios')}</span>`,
      })}
      ${b.notes ? `<div class="callout info">${icon('info')}<div><strong>Criterios de este curso</strong><ul>${b.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div></div>` : ''}
      <div class="grid-2">
        ${b.guide && G[b.guide]
          ? `<a class="card" href="#/guia/${b.guide}">${icon('arrow-right', 'go')}
              <div class="card-top"><span class="icon-tile">${icon('book')}</span></div>
              <h3>Guía teórica del bloque ${b.roman}</h3><p>Explicación completa del bloque, con ejemplos de clase y errores habituales.</p></a>`
          : `<div class="card muted-card"><div class="card-top"><span class="icon-tile">${icon('book')}</span><span class="chip">En preparación</span></div><h3>Guía teórica del bloque ${b.roman}</h3><p>Se publicará al cerrar el bloque. Mientras tanto, las referencias son las presentaciones de cada semana y la documentación oficial que aparece abajo.</p></div>`}
        <div class="card">
          <div class="card-top"><span class="icon-tile">${icon('check-square')}</span></div>
          <h3>Práctica del bloque</h3>
          <p>${qd} de ${b.quizzes.length} quizzes hechos${blockWrong ? ` · ${plural(blockWrong, 'pregunta', 'preguntas')} por repasar` : ''}.</p>
          ${bar(pct(qd, b.quizzes.length))}
          <div class="card-foot">${blockWrong ? `<a class="btn sm" href="#/repaso/practicar/${b.id}">${icon('rotate')}Repasar errores del bloque</a>` : `<a class="btn sm secondary" href="#/quiz/${b.quizzes.find((n) => Q[n] && !S.quiz[n]?.attempts) || b.quizzes.find((n) => Q[n])}">${icon('play')}Hacer un quiz</a>`}</div>
        </div>
      </div>
      ${sectionHead('Quizzes del bloque')}
      <div class="grid">${b.quizzes.map(quizCard).join('')}</div>
      ${sectionHead('Semanas y sesiones')}
      ${weeksHtml(b)}
      ${sectionHead('Laboratorios')}
      ${labRows(labs)}`, `Bloque ${b.roman}`);
  }

  // ---------- Resource links ----------
  // Labels are "Name — what it is"; the tile shows the name, the description and the site.
  function monogram(name) {
    const n = name.replace(/\(.*?\)/g, '').split(' / ')[0].trim();
    if (n.length <= 4) return n;
    const caps = n.replace(/[^A-Z]/g, '');
    return caps.length >= 2 ? caps.slice(0, 2) : n.charAt(0).toUpperCase() + n.charAt(1);
  }
  function linkTile([label, url]) {
    const [name, ...rest] = label.split(' — ');
    let host = '';
    try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { /* keep empty */ }
    return `<a class="res-link" href="${url}" target="_blank" rel="noopener">
      <span class="res-mono${monogram(name).length > 3 ? ' long' : ''}" aria-hidden="true">${esc(monogram(name))}</span>
      <span class="res-txt"><span class="res-name">${esc(name)}</span>${rest.length ? `<span class="res-meta">${esc(rest.join(' — '))}</span>` : ''}<span class="res-host">${esc(host)}</span></span>
      ${icon('external', 'res-ext')}</a>`;
  }
  const linkGrid = (links, cls = '') => `<div class="res-grid ${cls}">${links.map(linkTile).join('')}</div>`;

  // ---------- Weeks (same order as the Canvas modules) ----------
  function weeksHtml(b) {
    return `<div class="weeks">${b.weekList.map((w) => `<section class="card week" id="semana-${w.n}" style="--bc:var(--${b.color})">
      <header class="week-head"><span class="week-n">Semana ${w.n}</span><h3>${esc(w.title)}</h3>${w.pending ? '<span class="chip warn">Pendiente de actualización</span>' : ''}</header>
      <ol class="week-sessions">${w.sessions.map((s) => `<li class="${s.lab ? 'lab' : ''}"><span class="n">Sesión ${esc(s.n)}</span><span class="t">${esc(s.title)}</span>${s.lab ? `<span class="chip accent">${esc(s.lab)}</span>` : ''}</li>`).join('')}</ol>
      ${w.milestone ? `<p class="week-note">${icon('flag')}${esc(w.milestone)}</p>` : ''}
      ${w.links.length ? `<div class="week-res">${linkGrid(w.links, 'compact')}</div>` : ''}
      ${w.note ? `<p class="week-info">${icon('info')}<span>${esc(w.note)}</span></p>` : ''}
    </section>`).join('')}</div>`;
  }
  function coursePage() {
    render(`
      ${pageHead({ path: [['Mapa del curso', '']], eyebrow: 'Curso', title: 'Mapa del curso',
        lead: 'El curso semana a semana, en el mismo orden que Canvas: las sesiones de cada semana, su laboratorio y la documentación de referencia.',
        meta: `<span class="chip plain">${plural(BLOCKS.reduce((a, b) => a + b.weekList.length, 0), 'semana', 'semanas')}</span><span class="chip plain">${plural(SESSIONS.length, 'sesión', 'sesiones')}</span><span class="chip plain">${plural(C.labs.length, 'laboratorio', 'laboratorios')}</span>` })}
      ${BLOCKS.map((b) => `${sectionHead(`<span style="color:var(--${b.color})">Bloque ${b.roman}</span> · ${esc(b.title)}`, `<a href="#/bloque/${b.id}">Ver el bloque ${icon('arrow-right')}</a>`)}${weeksHtml(b)}`).join('')}
      ${C.architecture ? `${sectionHead('Repaso transversal')}
      <div class="grid-2">
        <a class="card" href="#/arquitectura">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('layers')}</span></div><h3>${esc(C.architecture.title)}</h3><p>El recorrido completo de una petición, el orden de los middleware y la carpeta de la Práctica 2 donde vive cada pieza.</p></a>
        ${Q.arch ? `<a class="card" href="#/quiz/arch">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('check-square')}</span></div><h3>${esc(quizName('arch'))}</h3><p>${plural(Q.arch.questions.length, 'pregunta', 'preguntas')} sobre cómo encajan cliente, API y base de datos.</p></a>` : ''}
      </div>` : ''}
      ${sectionHead('Prácticas')}
      <div class="grid-2">${C.practices.map((x) => `<div class="card"><div class="card-top"><span class="icon-tile">${icon('code')}</span><span class="chip plain">${esc(x.name)}</span></div><h3>${esc(x.title)}</h3><p>${esc(x.detail)}</p></div>`).join('')}</div>
      <p class="muted" style="margin-top:14px;font-size:.88rem">Los enunciados de las prácticas, las presentaciones de cada semana y las entregas están en Canvas.</p>`, 'Mapa del curso');
  }

  // ---------- How it all fits together ----------
  function architecturePage() {
    const A = C.architecture;
    if (!A) return notFound();
    const laneCls = { client: 'b3', net: 'muted', server: 'b2', db: 'b1' };
    render(`
      ${pageHead({ path: [[A.title, '']], eyebrow: 'Repaso transversal', title: esc(A.title), lead: inline(A.lead),
        meta: Q.arch ? `<a class="chip accent" href="#/quiz/arch" style="text-decoration:none">${icon('check-square')}${esc(quizName('arch'))} · ${plural(Q.arch.questions.length, 'pregunta', 'preguntas')}</a>` : '' })}
      ${sectionHead('El recorrido de una petición')}
      <p class="muted" style="margin:-4px 0 12px">${inline(A.example)}</p>
      <ol class="flow" aria-label="Recorrido de una petición, paso a paso">${A.steps.map((st, i) => `<li class="flow-step lane-${st.lane}" style="--lc:var(--${laneCls[st.lane]}, var(--text-3))">
        <span class="flow-n" aria-hidden="true">${i + 1}</span>
        <div class="flow-body"><span class="flow-lane">${esc(A.lanes[st.lane])}</span><h3>${esc(st.title)}</h3><p>${inline(st.detail)}</p>${st.where ? `<code class="flow-where">${esc(st.where)}</code>` : ''}</div></li>`).join('')}</ol>
      <div class="callout warn">${icon('alert')}<div>${inline(A.errorNote)}</div></div>
      ${sectionHead('El orden de los middleware')}
      <ol class="mw-list">${A.middleware.map((m) => `<li><code>${esc(m.code)}</code><span>${inline(m.why)}</span></li>`).join('')}</ol>
      ${sectionHead('Qué código HTTP sale de cada capa')}
      <div class="table-wrap"><table><thead><tr><th>Capa</th><th>Código</th></tr></thead><tbody>${A.codes.map(([a, b]) => `<tr><td>${inline(a)}</td><td>${inline(b)}</td></tr>`).join('')}</tbody></table></div>
      ${sectionHead('Dónde vive cada pieza en la Práctica 2')}
      <div class="grid-2">${[['api', 'api/ · Express y PostgreSQL'], ['client', 'client/ · React, Axios y AuthContext']].map(([k, t]) => `<div class="card"><h3>${esc(t)}</h3><dl class="folders">${A.folders[k].map(([f, d]) => `<dt><code>${esc(f)}</code></dt><dd>${inline(d)}</dd>`).join('')}</dl></div>`).join('')}</div>
      <div class="card-foot" style="margin-top:20px;gap:10px">${Q.arch ? `<a class="btn" href="#/quiz/arch">${icon('play')}Hacer el ${esc(quizName('arch'))}</a>` : ''}${G.II ? '<a class="btn secondary" href="#/guia/II">Guía del bloque II</a>' : ''}${G.III ? '<a class="btn secondary" href="#/guia/III">Guía del bloque III</a>' : ''}</div>`, A.title);
  }

  // ---------- Guide ----------
  function guidePage(id, anchor) {
    const g = G[id];
    if (!g) return notFound();
    if (LANG === 'en') {
      const bb = BLOCKS.find((x) => x.guide === id);
      return render(`${pageHead({ path: [[`Bloque ${bb.roman}`, `#/bloque/${bb.id}`], ['Guía teórica', '']], eyebrow: `Bloque ${bb.roman}`, title: `Guía teórica del bloque ${bb.roman}`,
        lead: 'The theory guides of the course are available in Spanish only. The quizzes, exercises and practice exams of this block are available in English.' })}
        <div class="card"><p style="margin-top:0">${esc(bb.title)}: ${esc(bb.subtitle)}.</p>
        <div class="card-foot"><a class="btn" href="${BASE}guia/${id}" data-lang="es">${icon('book')}Open the guide in Spanish</a>${bb.quizzes.filter((n) => Q[n]).slice(0, 1).map((n) => `<a class="btn secondary" href="#/quiz/${n}">${esc(quizName(n))}</a>`).join('')}</div></div>`, `Guía del bloque ${bb.roman}`);
    }
    const b = BLOCKS.find((x) => x.guide === id);
    const words = g.html.replace(/<[^>]+>/g, ' ').split(/\s+/).length;
    const tocHtml = g.toc.map((t) => `<a class="l${t.level}" href="#/guia/${id}/${encodeURIComponent(t.id)}" data-id="${esc(t.id)}">${esc(t.text)}</a>`).join('');
    render(`
      <div class="guide-head">
        ${crumbs([[`Bloque ${b.roman}`, `#/bloque/${b.id}`], ['Guía teórica', '']])}
        <p class="eyebrow" style="color:var(--${b.color})">Bloque ${b.roman} · ${esc(b.weeks)}</p>
        <h1>Guía teórica del bloque ${b.roman}</h1>
        <p class="lead">${esc(b.title)}: ${esc(b.subtitle)}.</p>
        <div class="meta-row"><span class="chip plain">${icon('clock')}${Math.round(words / 200)} min de lectura</span><span class="chip plain">${icon('list')}${plural(g.toc.filter((t) => t.level === 2).length, 'capítulo', 'capítulos')}</span><button class="chip plain" id="print-guide" type="button" style="cursor:pointer">Imprimir o guardar en PDF</button></div>
      </div>
      <details class="toc-mobile card" style="padding:0"><summary>${icon('list')}Índice de la guía${icon('chevron', 'ri-chev')}</summary><nav class="toc-list" aria-label="Índice">${tocHtml}</nav></details>
      <div class="guide-layout">
        <article class="prose" id="guide">${g.html}</article>
        <aside class="guide-toc" aria-label="Índice de la guía"><p class="toc-title"><span>En esta guía</span></p><nav>${tocHtml}</nav></aside>
      </div>
      <section class="guide-end">
        <div class="card"><div class="card-top"><span class="icon-tile">${icon('check-square')}</span></div>
          <h3>Comprobar lo aprendido</h3><p>Los quizzes del bloque ${b.roman} cubren lo que explica esta guía.</p>
          <div class="card-foot">${b.quizzes.filter((n) => Q[n]).map((n) => `<a class="btn sm secondary" href="#/quiz/${n}">${esc(quizName(n))} · ${esc(Q[n].title)}</a>`).join('')}</div></div>
      </section>`, `Guía del bloque ${b.roman}`, { wide: true });

    const art = $('#guide');
    // Pandoc's per-line anchors (#cb1-1) would be read as routes: remove them.
    $$('a[href^="#cb"]', art).forEach((a) => a.remove());
    $$('div.sourceCode', art).forEach((box) => {
      const lang = (box.querySelector('pre')?.className.match(/sourceCode (\w+)/) || [])[1];
      if (lang) box.insertAdjacentHTML('afterbegin', `<span class="code-lang">${esc(lang === 'javascript' ? 'JavaScript' : lang.toUpperCase())}</span>`);
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'copy-btn'; btn.innerHTML = `${icon('copy')}Copiar`;
      btn.addEventListener('click', async () => {
        if (await copyText(box.querySelector('pre').innerText)) {
          btn.classList.add('done'); btn.innerHTML = `${icon('check')}Copiado`;
          setTimeout(() => { btn.classList.remove('done'); btn.innerHTML = `${icon('copy')}Copiar`; }, 1600);
        }
      });
      box.appendChild(btn);
    });
    $$('pre', art).forEach((pre) => { if (!pre.closest('div.sourceCode')) pre.setAttribute('tabindex', '0'); });
    const heads = $$('h2[id], h3[id]', art);
    heads.forEach((h) => {
      const a = document.createElement('button');
      a.type = 'button'; a.className = 'anchor'; a.title = 'Copiar el enlace a esta sección'; a.setAttribute('aria-label', 'Copiar el enlace a esta sección');
      a.innerHTML = icon('link');
      a.addEventListener('click', async () => {
        const url = location.origin + BASE + `guia/${id}/${encodeURIComponent(h.id)}`;
        if (await copyText(url)) toast('Enlace copiado');
      });
      h.prepend(a);
    });
    on($('#print-guide'), 'click', () => window.print());

    const tocLinks = $$('.guide-toc a, .toc-mobile a');
    on($('.toc-mobile'), 'click', (e) => { if (e.target.closest('a')) $('.toc-mobile').open = false; });
    let active = null, ticking = false;
    const sig = view.ac.signal;
    const update = () => {
      ticking = false;
      if (sig.aborted || !art.isConnected) return; // a frame queued before leaving the guide
      let cur = null;
      for (const h of heads) { if (h.getBoundingClientRect().top < 170) cur = h; else break; }
      if (cur && cur.id !== active) {
        active = cur.id;
        tocLinks.forEach((a) => a.classList.toggle('active', a.dataset.id === active));
        const act = $('.guide-toc a.active');
        if (act) { const box = $('.guide-toc'); const ar = act.getBoundingClientRect(), br = box.getBoundingClientRect(); if (ar.top < br.top + 40 || ar.bottom > br.bottom - 40) box.scrollTop += ar.top - br.top - br.height / 3; }
        setLast(`#/guia/${id}/${encodeURIComponent(active)}`, cur.textContent.trim(), `Guía del bloque ${b.roman}`);
        history.replaceState(null, '', `${BASE}guia/${id}/${encodeURIComponent(active)}`);
      }
    };
    on(window, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    if (anchor) scrollToHeading(anchor, false); else setLast(`#/guia/${id}`, `Guía teórica del bloque ${b.roman}`, 'Inicio de la guía');
    requestAnimationFrame(update);
  }
  function scrollToHeading(anchor, smooth) {
    let idv = anchor;
    try { idv = decodeURIComponent(anchor); } catch { /* keep raw */ }
    const el = document.getElementById(idv);
    if (!el) return;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }

  // ---------- Quizzes hub ----------
  function quizzesPage() {
    const n = Object.keys(Q).length;
    const done = Object.keys(Q).filter((k) => S.quiz[k]?.attempts).length;
    render(`
      ${pageHead({ path: [['Quizzes', '']], eyebrow: 'Practicar', title: 'Quizzes por laboratorio',
        lead: 'Un quiz por laboratorio. Cada pregunta se corrige al momento y muestra la explicación de la respuesta correcta. Se puede salir a mitad: el quiz se retoma donde se dejó.',
        meta: `<span class="chip plain">${done} de ${n} hechos</span><span class="chip plain">${Object.values(Q).reduce((a, q) => a + q.questions.length, 0)} preguntas</span><span class="chip plain">Atajos de teclado: A–D y Intro</span>` })}
      ${BLOCKS.map((b) => `${sectionHead(`<span style="color:var(--${b.color})">Bloque ${b.roman}</span> · ${esc(b.title)}`, `<a href="#/bloque/${b.id}">Ver el bloque ${icon('arrow-right')}</a>`)}<div class="grid">${b.quizzes.map(quizCard).join('')}</div>`).join('')}
`, 'Quizzes');
  }

  // ---------- Question runner (quizzes and error review) ----------
  // cfg: { id, ids, persist, record: [kind, key] | null, head(state) -> html, title, back: [href, label], next: [href, label] | null }
  function runner(cfg) {
    const valid = (st) => st && Array.isArray(st.order) && st.order.length && st.order.every((x) => QI[x]) && typeof st.i === 'number';
    let st = cfg.persist && valid(S.current[cfg.id]) ? S.current[cfg.id] : null;
    const persist = () => { if (cfg.persist) { S.current[cfg.id] = st; save(); } };
    const fresh = (ids) => ({ order: ids.slice(), i: 0, ans: {} });

    if (st && (st.i > 0 || Object.keys(st.ans).length)) {
      const right = Object.values(st.ans).filter((a) => a.ok === true).length;
      render(`${cfg.head()}
        <div class="card resume-card"><div class="card-top"><span class="icon-tile">${icon('clock')}</span></div>
          <h3>Este quiz quedó a medias</h3>
          <p>Respondidas ${Object.keys(st.ans).length} de ${st.order.length} preguntas, ${plural(right, 'correcta', 'correctas')}.</p>
          ${bar(pct(Object.keys(st.ans).length, st.order.length))}
          <div class="actions"><button class="btn" id="resume">${icon('play')}Continuar</button><button class="btn secondary" id="restart">${icon('rotate')}Empezar de nuevo</button></div></div>`, cfg.title);
      on($('#resume'), 'click', () => show());
      on($('#restart'), 'click', () => { st = fresh(cfg.ids); persist(); show(); });
      $('#resume').focus();
      return;
    }
    st = fresh(cfg.ids);
    persist();
    show();

    function segs() {
      return st.order.map((qid, k) => {
        const a = st.ans[qid];
        return `<span class="${a ? (a.ok === true ? 'ok' : a.ok === false ? 'ko' : 'skip') : k === st.i ? 'cur' : ''}"></span>`;
      }).join('');
    }
    function scoreChips() {
      const v = Object.values(st.ans);
      return `<span class="chip ok">${icon('check')}${v.filter((a) => a.ok === true).length}</span><span class="chip bad">${icon('x')}${v.filter((a) => a.ok === false).length}</span>`;
    }

    function show() {
      const qid = st.order[st.i], e = QI[qid], q = e.q;
      const a = st.ans[qid];
      let body;
      if (q.type === 'fib') body = `<div class="fib-row"><input class="input" id="fib" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Respuesta" placeholder="Escribir la respuesta"><button class="btn" id="check" type="button">Comprobar</button></div>`;
      else if (q.type === 'essay') body = `<div class="callout info">${icon('code')}<div>Ejercicio de programación: se resuelve en la consola del navegador (<kbd>F12</kbd> → Console) o en un fichero. No suma al resultado del quiz.</div></div><button class="btn secondary" id="reveal" type="button">Ver la solución de referencia</button>`;
      else body = choicesHtml(q, 0, false);
      const src = e.quiz && cfg.showSource ? `<span class="chip plain">${esc(quizName(e.quiz))}</span>` : e.exam && cfg.showSource ? `<span class="chip plain">Simulacro ${e.exam}</span>` : '';
      render(`${cfg.head()}
        <div class="runner">
          <div class="runner-top"><span class="runner-count">${st.i + 1} / ${st.order.length}</span><div class="segments" aria-hidden="true">${segs()}</div><div class="runner-score">${scoreChips()}</div></div>
          <section class="qcard" aria-labelledby="qtext">
            <div class="qhead"><span class="qnum">Pregunta ${st.i + 1} de ${st.order.length}</span><span style="display:flex;gap:6px">${src}<span class="chip">${typeLabel[q.type] || 'Pregunta'}</span></span></div>
            <div class="qtext" id="qtext">${md(q.q)}</div>
            ${body}
            <div id="fb" aria-live="polite"></div>
          </section>
          <div class="runner-actions" id="ra">
            <a class="btn ghost" href="${cfg.back[0]}">${icon('arrow-left')}Salir</a><span class="spacer"></span>
            ${q.type !== 'essay' ? '<button class="btn secondary" id="idk" type="button">No lo sé</button>' : ''}
          </div>
          <p class="hint">${q.choices ? `<kbd>A</kbd>–<kbd>${LETTERS[q.choices.length - 1]}</kbd> para responder · ` : ''}<kbd>Intro</kbd> para continuar · el avance se guarda en este navegador</p>
        </div>`, cfg.title);
      $$('.choice').forEach((btn) => on(btn, 'click', () => answer(Number(btn.dataset.i))));
      const fib = $('#fib');
      if (fib) {
        const check = () => { if (fib.value.trim()) answer(fib.value); else fib.focus(); };
        on($('#check'), 'click', check);
        on(fib, 'keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); ev.stopPropagation(); check(); } });
        if (!a && matchMedia('(pointer: fine)').matches) fib.focus();
      }
      if ($('#reveal')) on($('#reveal'), 'click', () => answer(null));
      if ($('#idk')) on($('#idk'), 'click', () => answer(undefined));
      if (a) applyAnswer(q, a);
    }

    function answer(pick) {
      const qid = st.order[st.i], q = QI[qid].q;
      if (st.ans[qid]) return;
      let ok;
      if (q.type === 'essay') ok = null;
      else if (pick === undefined) ok = false; // "No lo sé"
      else if (q.type === 'fib') ok = fibOk(q, pick);
      else ok = pick === q.answer;
      const a = { pick: pick === undefined ? null : pick, ok };
      st.ans[qid] = a;
      if (ok !== null) markAnswer(qid, ok);
      persist();
      applyAnswer(q, a);
      const s = $('.segments'); if (s) s.innerHTML = segs();
      const sc = $('.runner-score'); if (sc) sc.innerHTML = scoreChips();
    }

    function applyAnswer(q, a) {
      if (q.choices) markChoices(main, q, a.pick, 0);
      if (q.type === 'fib') {
        const fib = $('#fib');
        fib.value = a.pick ?? ''; fib.disabled = true; fib.classList.add(a.ok ? 'ok' : 'ko'); $('#check').disabled = true;
      }
      if ($('#reveal')) $('#reveal').remove();
      $('#fb').innerHTML = feedbackHtml(q, a);
      const last = st.i === st.order.length - 1;
      $('#ra').innerHTML = `<a class="btn ghost" href="${cfg.back[0]}">${icon('arrow-left')}Salir</a><span class="spacer"></span>
        <button class="btn" id="next" type="button">${last ? 'Ver el resultado' : 'Siguiente'}${icon('arrow-right')}</button>`;
      const next = $('#next');
      on(next, 'click', goNext);
      next.focus({ preventScroll: true });
      const fbr = $('#fb').getBoundingClientRect();
      if (fbr.bottom > window.innerHeight) next.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    function goNext() {
      if (st.i >= st.order.length - 1) return finish();
      st.i++; persist(); show();
    }

    on(document, 'keydown', (ev) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey || !$('#qtext') || !$('#search-dialog').hidden) return;
      const tag = (ev.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const qid = st.order[st.i], q = QI[qid]?.q;
      if (!q) return;
      if (!st.ans[qid] && q.choices) {
        let k = LETTERS.toLowerCase().indexOf(ev.key.toLowerCase());
        if (k < 0 && /^[1-6]$/.test(ev.key)) k = Number(ev.key) - 1;
        if (k >= 0 && k < q.choices.length) { ev.preventDefault(); answer(k); return; }
      }
      if (st.ans[qid] && (ev.key === 'Enter' || ev.key === 'ArrowRight') && tag !== 'button' && tag !== 'a') { ev.preventDefault(); goNext(); }
    });

    function finish() {
      const ids = st.order;
      const objIds = ids.filter((x) => isObjective(QI[x].q));
      const right = objIds.filter((x) => st.ans[x]?.ok === true).length;
      const failed = objIds.filter((x) => st.ans[x]?.ok !== true);
      const total = objIds.length;
      const rec = cfg.record ? recordAttempt(cfg.record[0], cfg.record[1], right, total) : null;
      if (cfg.persist) { delete S.current[cfg.id]; save(true); }
      const answers = st.ans;
      resultsView({
        head: cfg.head(), title: cfg.title, right, total, rec,
        unit: 'correctas',
        actions: `<button class="btn" id="again" type="button">${icon('rotate')}Repetir</button>
          ${failed.length && failed.length < total ? `<button class="btn secondary" id="retry" type="button">Repetir solo las ${failed.length} falladas</button>` : ''}
          ${cfg.next ? `<a class="btn secondary" href="${cfg.next[0]}">${esc(cfg.next[1])}${icon('arrow-right')}</a>` : ''}
          <a class="btn ghost" href="${cfg.back[0]}">${esc(cfg.back[1])}</a>`,
        ids, answers,
      });
      on($('#again'), 'click', () => { st = fresh(cfg.ids); persist(); show(); });
      if ($('#retry')) on($('#retry'), 'click', () => { cfg = { ...cfg, persist: false, record: null, ids: failed }; st = fresh(failed); show(); });
    }
  }

  function fibOk(q, v) {
    const n = (s) => String(s).trim().replace(/^[`'"]+|[`'";]+$/g, '').trim().toLowerCase();
    return q.accept.map(n).includes(n(v));
  }
  function choicesHtml(q, qi, examMode) {
    return `<div class="choices${q.choices.length === 2 ? ' tf' : ''}" role="group" aria-label="Opciones">${q.choices.map((c, i) =>
      `<button class="choice" type="button" data-q="${qi}" data-i="${i}"${examMode ? ' aria-pressed="false"' : ''}><span class="letter">${LETTERS[i]}</span><span class="ctext">${md(c)}</span></button>`).join('')}</div>`;
  }
  function markChoices(root, q, pick, qi) {
    $$(`.choice[data-q="${qi}"]`, root).forEach((btn) => {
      const k = Number(btn.dataset.i);
      btn.disabled = true; btn.classList.remove('selected'); btn.removeAttribute('aria-pressed');
      if (k === q.answer) { btn.classList.add('correct'); btn.insertAdjacentHTML('beforeend', `${icon('check', 'mark')}<span class="sr-only">(respuesta correcta)</span>`); }
      else if (k === pick) { btn.classList.add('wrong'); btn.insertAdjacentHTML('beforeend', `${icon('x', 'mark')}<span class="sr-only">(respuesta elegida, incorrecta)</span>`); }
    });
  }
  function feedbackHtml(q, a) {
    if (q.type === 'essay') {
      const rubric = QI[q.id]?.rubric;
      return `<div class="feedback"><div class="fb-title">${icon('code')}Solución de referencia</div>${md(q.model)}${rubric ? `<p style="margin:10px 0 0"><strong>Criterio de corrección</strong></p><ul>${rubric.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}</div>`;
    }
    const title = a.ok ? `${icon('check')}Correcto` : a.pick == null ? `${icon('info')}Respuesta` : `${icon('x')}Incorrecto`;
    let extra = '';
    if (q.type === 'fib') extra = `<p style="margin:0 0 6px">Respuesta esperada: <code>${esc(q.accept[0])}</code>${q.accept.length > 1 ? ` (también vale ${q.accept.slice(1).map((x) => `<code>${esc(x)}</code>`).join(', ')})` : ''}.</p>`;
    else if (!a.ok) extra = `<p style="margin:0 0 6px">La respuesta correcta es la <strong>${LETTERS[q.answer]}</strong>.</p>`;
    return `<div class="feedback ${a.ok ? 'ok' : 'ko'}"><div class="fb-title">${title}</div>${extra}${q.why ? `<div>${md(q.why)}</div>` : ''}</div>`;
  }

  // Results screen shared by quizzes, reviews and practice exams.
  function resultsView({ head, title, right, total, rec, actions, ids, answers, grade, time }) {
    const p = pct(right, total);
    const tier = p >= 90 ? ['ok', 'Excelente dominio del tema.'] : p >= 70 ? ['ok', 'Buen resultado. Conviene revisar las preguntas falladas para afianzarlo.']
      : p >= 50 ? ['mid', 'Resultado justo. Conviene repasar la guía antes de repetir.'] : ['low', 'Hace falta repasar este tema: volver a la guía y repetir después.'];
    const C2 = 2 * Math.PI * 54;
    const review = ids.map((qid, k) => {
      const q = QI[qid].q, a = answers[qid] || { pick: null, ok: q.type === 'essay' ? null : false };
      const cls = q.type === 'essay' ? 'na' : a.ok ? 'ok' : 'ko';
      let body;
      if (q.choices) {
        body = `<div class="choices${q.choices.length === 2 ? ' tf' : ''}">${q.choices.map((c, i) => `<div class="choice${i === q.answer ? ' correct' : i === a.pick ? ' wrong' : ''}" style="cursor:default"><span class="letter">${LETTERS[i]}</span><span class="ctext">${md(c)}</span>${i === q.answer ? icon('check', 'mark') : i === a.pick ? icon('x', 'mark') : ''}</div>`).join('')}</div>`;
        if (a.pick == null) body = '<p class="muted" style="margin:0 0 8px">Sin responder.</p>' + body;
      } else if (q.type === 'fib') body = `<p style="margin:0">Respuesta dada: ${a.pick ? `<code>${esc(a.pick)}</code>` : '<span class="muted">ninguna</span>'}</p>`;
      else body = '';
      return `<details class="review-item ${cls}"><summary><span class="ri-icon">${icon(cls === 'ok' ? 'check' : cls === 'ko' ? 'x' : 'code')}</span><span class="ri-text"><strong>${k + 1}.</strong> ${inline(plain(q.q))}</span>${icon('chevron', 'ri-chev')}</summary>
        <div class="review-body">${q.q.includes('```') ? `<div class="qtext" style="font-size:.95rem">${md(q.q)}</div>` : ''}${body}${feedbackHtml(q, a)}</div></details>`;
    }).join('');
    const wrongCount = ids.filter((x) => isObjective(QI[x].q) && !answers[x]?.ok).length;
    render(`${head}
      <div class="runner">
        <section class="card result-hero">
          <div class="ring ${tier[0]}"><svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="54"/><circle class="val" cx="60" cy="60" r="54" stroke-dasharray="${C2}" stroke-dashoffset="${C2}"/></svg>
            <div class="label"><span class="pct">${grade ?? p + ' %'}</span><span class="sub">${grade ? 'puntos' : 'acierto'}</span></div></div>
          <div>
            <h2>${right} de ${total} ${right === 1 ? 'correcta' : 'correctas'}</h2>
            <p class="muted" style="margin:0 0 6px">${tier[1]}</p>
            <div class="meta-row" style="margin-top:8px">${rec?.improved && rec.prevBest != null ? `<span class="chip ok">${icon('award')}Nuevo mejor resultado</span>` : ''}${rec && !rec.improved ? `<span class="chip plain">Mejor resultado: ${rec.prevBest}/${total}</span>` : ''}${time != null ? `<span class="chip plain">${icon('clock')}${fmtTime(time)}</span>` : ''}${wrongCount ? `<span class="chip warn">${icon('rotate')}${plural(wrongCount, 'pregunta añadida', 'preguntas añadidas')} al repaso</span>` : ''}</div>
            <div class="actions" style="margin-top:14px">${actions}</div>
          </div>
        </section>
        ${sectionHead('Revisión de las respuestas', wrongCount && wrongCount < ids.length ? '<label class="hint" style="cursor:pointer"><input type="checkbox" id="only-wrong"> Solo las falladas</label>' : '')}
        <div class="review-list" id="review">${review}</div>
      </div>`, title);
    requestAnimationFrame(() => requestAnimationFrame(() => { const v = $('.ring .val'); if (v) v.style.strokeDashoffset = String(C2 * (1 - p / 100)); }));
    const ow = $('#only-wrong');
    if (ow) on(ow, 'change', () => $$('#review .review-item').forEach((d) => { d.hidden = ow.checked && !d.classList.contains('ko'); }));
    renderNav(currentKey);
  }

  function quizPage(n) {
    const quiz = Q[n];
    if (!quiz) return notFound();
    const b = blockOfQuiz(n);
    const nextN = QUIZ_ORDER[QUIZ_ORDER.indexOf(String(n)) + 1];
    const head = () => pageHead({
      path: [[`Bloque ${b.roman}`, `#/bloque/${b.id}`], [quizName(n), '']],
      eyebrow: `${esc(quizName(n))} · ${quiz.lab ? `Laboratorio ${esc(quiz.lab.replace('L', ''))}` : 'Sin laboratorio'} · ${esc(sessLabel(quiz.sessions))}`, eyebrowStyle: `color:var(--${b.color})`,
      title: esc(quiz.title),
    });
    setLast(`#/quiz/${n}`, `${quizName(n)} · ${quiz.title}`, `Bloque ${b.roman}`);
    runner({
      id: 'quiz-' + n, ids: quiz.questions.map((q) => q.id), persist: true, record: ['quiz', String(n)], head, title: quizName(n),
      back: [`#/bloque/${b.id}`, `Volver al bloque ${b.roman}`], next: nextN ? [`#/quiz/${nextN}`, quizName(nextN)] : null,
    });
  }

  // ---------- Error review ----------
  function reviewPage() {
    const ids = wrongIds();
    const byBlock = BLOCKS.map((b) => ({ b, ids: ids.filter((x) => QI[x].block === b.id) }));
    render(`
      ${pageHead({ path: [['Repaso de errores', '']], eyebrow: 'Practicar', title: 'Repaso de errores',
        lead: 'Cada pregunta fallada en un quiz o en un simulacro se guarda aquí. Sale de la lista en cuanto se responde bien, aquí o en cualquier otro sitio.' })}
      ${ids.length ? `
        <div class="card" style="display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between">
          <div class="stat"><span class="k">Pendientes de acertar</span><span class="v">${ids.length}<small> ${ids.length === 1 ? 'pregunta' : 'preguntas'}</small></span></div>
          <div class="actions" style="margin:0"><a class="btn" href="#/repaso/practicar">${icon('play')}Repasar todas</a></div>
        </div>
        ${sectionHead('Por bloque')}
        <div class="grid-3">${byBlock.map(({ b, ids: bi }) => `<div class="card block-card" style="--bc:var(--${b.color})">
          <p class="eyebrow" style="color:var(--${b.color})">Bloque ${b.roman}</p><h3>${esc(b.title)}</h3>
          <p>${bi.length ? plural(bi.length, 'pregunta pendiente', 'preguntas pendientes') : 'Nada pendiente'}</p>
          <div class="card-foot">${bi.length ? `<a class="btn sm secondary" href="#/repaso/practicar/${b.id}">Repasar el bloque ${b.roman}</a>` : '<span class="chip ok">' + icon('check') + 'Al día</span>'}</div></div>`).join('')}</div>
        ${sectionHead('Preguntas pendientes', '<button class="btn sm danger" id="clear-wrong" type="button">' + icon('trash') + 'Vaciar la lista</button>')}
        <div class="list-card">${ids.map((x) => { const e = QI[x]; return `<div class="lab-row"><span class="lab-id" style="font-size:.72rem">${e.quiz ? esc(quizShort(e.quiz)) : 'S' + e.exam}</span><div class="lab-main"><div class="t" style="font-weight:500">${inline(plain(e.q.q).slice(0, 180))}${plain(e.q.q).length > 180 ? '…' : ''}</div><div class="s">${e.quiz ? `${esc(quizName(e.quiz))} · ${esc(Q[e.quiz].title)}` : `Simulacro ${e.exam}`} · fallada el ${fmtShort(S.wrong[x])}</div></div></div>`; }).join('')}</div>`
      : `<div class="card empty"><span class="icon-tile">${icon('check')}</span><h3>No hay preguntas pendientes</h3><p>Las preguntas falladas en quizzes y simulacros aparecerán aquí para repasarlas.</p><div class="actions" style="justify-content:center"><a class="btn" href="#/quizzes">Ir a los quizzes</a></div></div>`}`, 'Repaso de errores');
    if ($('#clear-wrong')) on($('#clear-wrong'), 'click', () => {
      if (!confirm(tr('¿Vaciar la lista de preguntas pendientes de repaso?'))) return;
      S.wrong = {}; save(true); renderNav('repaso'); reviewPage();
    });
  }
  function reviewRun(blockId) {
    const b = blockId ? blockById(blockId) : null;
    const ids = shuffle(wrongIds().filter((x) => !b || QI[x].block === b.id));
    if (!ids.length) { navigate('#/repaso', true); return; }
    const head = () => pageHead({ path: [['Repaso de errores', '#/repaso'], [b ? `Bloque ${b.roman}` : 'Todas', '']], eyebrow: 'Repaso de errores', title: b ? `Repaso del bloque ${b.roman}` : 'Repaso de todas las preguntas falladas' });
    runner({ id: 'review', ids, persist: false, record: null, head, title: 'Repaso de errores', back: ['#/repaso', 'Volver al repaso'], next: null, showSource: true });
  }

  // ---------- Practice exams ----------
  function simulacrosPage() {
    render(`
      ${pageHead({ path: [['Simulacros', '']], eyebrow: 'Practicar', title: 'Simulacros del examen',
        lead: HAS_PRACTICAL
        ? 'Cada simulacro reproduce el examen final: una parte tipo test de 8 preguntas (4 puntos, sin penalización por error), que se corrige sola, y una parte práctica de ejercicios de programación (6 puntos), que se autoevalúa con la solución de referencia y sus criterios de corrección.'
        : 'Cada simulacro reproduce la parte tipo test del examen final: 8 preguntas de los tres bloques, 0,5 puntos cada una y sin penalización por error. Se responde todo y se corrige al final.',
        meta: `<span class="chip plain">${icon('award')}Tipo test: 4 puntos</span>${HAS_PRACTICAL ? `<span class="chip plain">${icon('code')}Parte práctica: 6 puntos</span>` : ''}<span class="chip plain">${icon('clock')}Con cronómetro orientativo</span>` })}
      <div class="grid">${E.map(examCard).join('')}${randomExamCard()}</div>`, 'Simulacros');
  }

  // An exercise (exercises.js format) becomes a practical item of a practice exam, worth `points`.
  function toPractical(ex, points = 2) {
    const edit = ex.files.find((f) => f.name === ex.edit) || ex.files[ex.files.length - 1];
    return {
      id: ex.id, kind: ex.kind, title: ex.title, points, ex,
      starter: ex.answerStarter ?? edit.code,
      rubric: ex.rubric.map((r) => ({ text: r.text, points: (r.points * points) / 10 })),
    };
  }
  for (const x of E) {
    const src = x.practical;
    if (!src) continue;
    x.practical = src.map((it) => (typeof it === 'string' ? (XB[it] ? toPractical(XB[it]) : null) : it.files ? toPractical(it) : it)).filter(Boolean);
  }
  // Practical exercises (EXAMS[i].practical): one of each kind in the random practice exam.
  const PRACTICAL = E.flatMap((x) => (x.practical || []).map((p) => ({ ...p, exam: x.n })));
  const PI = Object.fromEntries(PRACTICAL.map((p) => [p.id, p]));
  const HAS_PRACTICAL = PRACTICAL.length > 0;
  function randomPracticalIds() {
    const kinds = [...new Set(PRACTICAL.map((p) => p.kind || p.id))];
    return kinds.map((k) => shuffle(PRACTICAL.filter((p) => (p.kind || p.id) === k))[0].id);
  }
  const rubricItems = (p) => (p.rubric || []).map((r) => (typeof r === 'string' ? { text: r, points: null } : r));
  // Points of a rubric item; items without points share the rest of the exercise equally.
  function rubricPoints(p) {
    const items = rubricItems(p);
    const fixed = items.reduce((a, r) => a + (r.points || 0), 0), free = items.filter((r) => r.points == null).length;
    return items.map((r) => (r.points != null ? r.points : free ? Math.max(0, (p.points || 0) - fixed) / free : 0));
  }

  function randomExamIds() {
    const pick = (blk, n) => shuffle(allObjective.filter((e) => e.block === blk && e.q.choices.length > 2)).slice(0, n).map((e) => e.q.id);
    return [...pick(1, 3), ...pick(2, 3), ...pick(3, 2)];
  }

  function simulacroPage(n) {
    const random = n === 'aleatorio';
    const x = random ? null : E.find((e) => String(e.n) === n);
    if (!random && !x) return notFound();
    const key = random ? 'aleatorio' : String(x.n);
    const ck = 'sim-' + key;
    let cur = S.current[ck];
    // A fixed practice exam whose composition has changed since it was started starts again.
    const fixedIds = random ? null : x.questions.map((q) => q.id).join();
    const fixedP = random ? null : (x.practical || []).map((p) => p.id).join();
    if (cur && !random && (cur.ids?.join() !== fixedIds || (cur.pids && cur.pids.join() !== fixedP))) cur = null;
    if (!cur || !Array.isArray(cur.ids) || !cur.ids.every((id) => QI[id])) {
      cur = S.current[ck] = { ids: random ? randomExamIds() : x.questions.map((q) => q.id), picks: {}, start: Date.now() };
      save();
    }
    if (!Array.isArray(cur.pids) || !cur.pids.every((id) => PI[id])) cur.pids = random ? (HAS_PRACTICAL ? randomPracticalIds() : []) : (x.practical || []).map((p) => p.id);
    cur.code = cur.code || {};
    const qs = cur.ids.map((id) => QI[id].q);
    const ps = cur.pids.map((id) => PI[id]);
    const pTotal = ps.reduce((a, p) => a + (p.points || 0), 0);
    const name = random ? 'Simulacro aleatorio' : `Simulacro ${x.n}`;
    setLast(`#/simulacro/${key}`, name, ps.length ? 'Simulacro completo del examen' : 'Parte tipo test del examen');
    const head = pageHead({ path: [['Simulacros', '#/simulacros'], [name, '']], eyebrow: ps.length ? 'Simulacro · examen completo' : 'Simulacro · parte tipo test', title: name,
      lead: ps.length
        ? `Parte tipo test: ${qs.length} preguntas de 0,5 puntos, sin penalización. Parte práctica: ${plural(ps.length, 'ejercicio', 'ejercicios')}, ${fmtPts(pTotal)} puntos. Al corregir se muestra la solución de referencia de cada ejercicio para autoevaluarlo.`
        : `${qs.length} preguntas de opción múltiple, 0,5 puntos cada una. Las respuestas incorrectas no descuentan. La corrección se muestra al terminar.` });
    render(`${head}
      <div class="exam-layout">
        <div>
          <div id="exam-result"></div>
          ${qs.map((q, qi) => `<section class="qcard" id="q-${qi}" aria-labelledby="qt-${qi}">
            <div class="qhead"><span class="qnum">Pregunta ${qi + 1} de ${qs.length}</span><span class="chip">${typeLabel[q.type] || 'Pregunta'}</span></div>
            <div class="qtext" id="qt-${qi}">${md(q.q)}</div>${choicesHtml(q, qi, true)}<div class="fb" aria-live="polite"></div></section>`).join('')}
          ${ps.length ? `<div class="part-head" id="practical"><h2>Parte práctica</h2><span class="chip accent">${fmtPts(pTotal)} puntos</span></div>
          <p class="muted part-lead">Escribir cada solución en su recuadro, como en el examen. Al corregir se muestra la solución de referencia con sus criterios: marcar los que se cumplen para obtener la nota orientativa.</p>
          ${ps.map((p, pi) => `<section class="qcard pcard" id="p-${pi}" data-pid="${esc(p.id)}">
            <div class="qhead"><span class="qnum">Ejercicio ${pi + 1} de ${ps.length}</span><span class="chip accent">${fmtPts(p.points || 0)} ${p.points === 1 ? 'punto' : 'puntos'}</span></div>
            <h3 class="ptitle">${esc(p.title)}</h3>
            ${p.ex ? `<div class="qtext prose-sm">${mdBlock(p.ex.statement)}</div>${p.ex.files.map((f) => codeFile(f)).join('')}<div class="expected"><strong>Resultado esperado</strong>${mdBlock(p.ex.expected)}</div>` : `<div class="qtext">${md(p.statement)}</div>`}
            <label class="sr-only" for="code-${pi}">Solución del ejercicio ${pi + 1}</label>
            <textarea class="code-input" id="code-${pi}" spellcheck="false" autocapitalize="off" autocomplete="off" rows="${Math.max(8, String(cur.code[p.id] ?? p.starter ?? '').split('\n').length + 3)}">${esc(cur.code[p.id] ?? p.starter ?? '')}</textarea>
            <div class="pfb"></div></section>`).join('')}` : ''}
          <div class="actions" id="exam-actions"><button class="btn" id="grade" type="button">${icon('check')}Corregir el simulacro</button><span class="hint" id="grade-hint"></span></div>
          <div class="exam-mobile-bar" id="mbar"><span class="txt" id="mbar-txt"></span><button class="btn sm" id="grade-m" type="button">Corregir</button></div>
        </div>
        <aside class="exam-side">
          <div class="card"><div class="stat"><span class="k">Tiempo</span><span class="timer" id="timer">00:00</span><span class="d">Orientativo, no limita</span></div></div>
          <div class="card"><div class="stat" style="margin-bottom:10px"><span class="k">Preguntas</span><span class="d" id="answered"></span></div>
            <nav class="exam-nav" aria-label="Ir a la pregunta">${qs.map((_, qi) => `<a href="#q-${qi}" data-q="${qi}">${qi + 1}</a>`).join('')}${ps.map((_, pi) => `<a href="#p-${pi}" data-p="${pi}" class="pnav">P${pi + 1}</a>`).join('')}</nav>
            <button class="btn sm" id="grade-s" type="button" style="width:100%;margin-top:14px">Corregir</button></div>
        </aside>
      </div>`, name);

    let graded = false, confirmArmed = false;
    const timerEl = $('#timer');
    const tick = () => { if (!graded) timerEl.textContent = fmtTime(Math.floor((Date.now() - cur.start) / 1000)); };
    tick();
    const iv = setInterval(tick, 1000);
    view.cleanups.push(() => clearInterval(iv));

    const update = () => {
      const done = Object.keys(cur.picks).length, missing = qs.length - done;
      $('#answered').textContent = `${done} de ${qs.length} respondidas`;
      $('#mbar-txt').textContent = `${done} de ${qs.length} respondidas`;
      $('#grade-hint').textContent = missing ? `Quedan ${missing} sin responder` : 'Todo respondido';
      $$('.exam-nav a[data-q]').forEach((a) => a.classList.toggle('answered', cur.picks[a.dataset.q] != null));
      confirmArmed = false;
      $('#grade').innerHTML = `${icon('check')}Corregir el simulacro`;
    };
    // Restore picks from an unfinished attempt.
    for (const [qi, k] of Object.entries(cur.picks)) $$(`.choice[data-q="${qi}"]`).forEach((b2) => { const sel = Number(b2.dataset.i) === k; b2.classList.toggle('selected', sel); b2.setAttribute('aria-pressed', String(sel)); });
    update();
    $$('.choice').forEach((btn) => on(btn, 'click', () => {
      if (graded) return;
      const qi = Number(btn.dataset.q), k = Number(btn.dataset.i);
      cur.picks[qi] = k; save();
      $$(`.choice[data-q="${qi}"]`).forEach((b2) => { const sel = Number(b2.dataset.i) === k; b2.classList.toggle('selected', sel); b2.setAttribute('aria-pressed', String(sel)); });
      update();
    }));
    $$('.exam-nav a').forEach((a) => on(a, 'click', (ev) => { ev.preventDefault(); $(a.dataset.p != null ? '#p-' + a.dataset.p : '#q-' + a.dataset.q).scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    const markWritten = () => ps.forEach((p, pi) => $(`.exam-nav a[data-p="${pi}"]`)?.classList.toggle('answered', !!cur.code[p.id] && cur.code[p.id] !== (p.starter || '')));
    $$('.code-input').forEach((ta, pi) => {
      on(ta, 'input', () => { cur.code[ps[pi].id] = ta.value; save(); markWritten(); });
      on(ta, 'keydown', (ev) => { // Tab indents instead of leaving the box; Esc then Tab leaves it.
        if (ev.key !== 'Tab' || ev.shiftKey || ta.dataset.esc) { if (ev.key === 'Tab') delete ta.dataset.esc; return; }
        ev.preventDefault();
        const a = ta.selectionStart, b2 = ta.selectionEnd;
        ta.value = ta.value.slice(0, a) + '  ' + ta.value.slice(b2); ta.selectionStart = ta.selectionEnd = a + 2;
        ta.dispatchEvent(new Event('input'));
      });
      on(ta, 'keyup', (ev) => { if (ev.key === 'Escape') ta.dataset.esc = '1'; });
    });
    markWritten();
    wireCopy(main);

    const grade = () => {
      if (graded) return;
      const missing = qs.length - Object.keys(cur.picks).length;
      if (missing && !confirmArmed) {
        confirmArmed = true;
        $('#grade').innerHTML = `${icon('alert')}Hay ${missing} sin responder: corregir igualmente`;
        toast(`Quedan ${missing} preguntas sin responder. Pulsar de nuevo para corregir.`);
        return;
      }
      graded = true; clearInterval(iv);
      const secs = Math.floor((Date.now() - cur.start) / 1000);
      let right = 0;
      qs.forEach((q, qi) => {
        const pick = cur.picks[qi] ?? null, ok = pick === q.answer;
        if (ok) right++;
        markAnswer(q.id, ok);
        markChoices(main, q, pick, qi);
        $(`#q-${qi} .fb`).innerHTML = feedbackHtml(q, { pick, ok });
        const nav = $(`.exam-nav a[data-q="${qi}"]`); nav.classList.remove('answered'); nav.classList.add(ok ? 'ok' : 'ko');
      });
      const rec = recordAttempt('exam', key, right, qs.length);
      delete S.current[ck]; save(true);
      $$('.code-input').forEach((ta) => { ta.readOnly = true; });
      ps.forEach((p, pi) => {
        const pts = rubricPoints(p);
        $(`#p-${pi} .pfb`).innerHTML = `<div class="feedback"><div class="fb-title">${icon('code')}Solución de referencia</div>${p.ex ? `<pre><code>${esc(p.ex.solution.code)}</code></pre><div class="prose-sm">${mdBlock(p.ex.solution.explanation)}</div>` : md(p.model)}
          ${pts.length ? `<p class="rubric-title"><strong>Criterios de corrección</strong> · marcar los que cumple la solución escrita</p>
          <ul class="rubric">${rubricItems(p).map((r, ri) => `<li><label><input type="checkbox" data-p="${pi}" data-r="${ri}"><span>${md(r.text)}</span><span class="rp">${fmtPts(pts[ri])} p.</span></label></li>`).join('')}</ul>
          <p class="pscore">Nota orientativa del ejercicio: <strong id="ps-${pi}">0</strong> de ${fmtPts(p.points || 0)}</p>` : ''}</div>`;
      });
      const practicalScore = () => ps.reduce((sum, p, pi) => {
        const pts = rubricPoints(p);
        const got = $$(`input[data-p="${pi}"]:checked`).reduce((a, cb) => a + pts[Number(cb.dataset.r)], 0);
        const el = $('#ps-' + pi); if (el) el.textContent = fmtPts(got);
        $(`.exam-nav a[data-p="${pi}"]`)?.classList.toggle('ok', got > 0);
        return sum + got;
      }, 0);
      const pts = right * 0.5, p = pct(right, qs.length);
      const C2 = 2 * Math.PI * 54;
      const tier = p >= 75 ? 'ok' : p >= 50 ? 'mid' : 'low';
      $('#exam-actions').remove(); $('#mbar').remove();
      $('#grade-s').remove();
      $('#exam-result').innerHTML = `<section class="card result-hero" style="margin-bottom:20px">
        <div class="ring ${tier}"><svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="54"/><circle class="val" cx="60" cy="60" r="54" stroke-dasharray="${C2}" stroke-dashoffset="${C2}"/></svg>
          <div class="label"><span class="pct">${fmtNum(pts)}</span><span class="sub">de 4 puntos</span></div></div>
        <div><h2>${right} de ${qs.length} correctas</h2>
          ${ps.length ? `<div class="total-note"><span>Tipo test <strong>${fmtPts(pts)}</strong> / 4</span><span>Práctica <strong id="pr-score">0</strong> / ${fmtPts(pTotal)}</span><span class="tn-total">Nota orientativa <strong id="total-score">${fmtPts(pts)}</strong> / ${fmtNum(4 + pTotal, 0)}</span></div>
          <p class="hint" style="display:block;margin:6px 0 0">La parte práctica se autoevalúa: marcar los criterios que cumple cada solución, en la parte práctica, más abajo. <a href="#practical" id="go-practical">Ir a la parte práctica</a></p>` : ''}
          <p class="muted" style="margin:0">${p >= 75 ? 'Buen nivel para la parte tipo test.' : p >= 50 ? 'Aprobaría esta parte, pero hay margen: revisar las falladas.' : 'Conviene repasar los temas de las preguntas falladas y repetir.'}</p>
          <div class="meta-row"><span class="chip plain">${icon('clock')}${fmtTime(secs)}</span>${rec.improved && rec.prevBest != null ? `<span class="chip ok">${icon('award')}Nuevo mejor resultado</span>` : ''}${right < qs.length ? `<span class="chip warn">${icon('rotate')}${plural(qs.length - right, 'pregunta añadida', 'preguntas añadidas')} al repaso</span>` : ''}</div>
          <div class="actions">${random ? `<a class="btn" href="#/simulacro/aleatorio" id="again">${icon('shuffle')}Otro simulacro aleatorio</a>` : `<button class="btn" id="again" type="button">${icon('rotate')}Repetir</button>`}<a class="btn secondary" href="#/simulacros">Ver los simulacros</a>${right < qs.length ? `<a class="btn ghost" href="#/repaso">Ir al repaso</a>` : ''}</div>
        </div></section>`;
      on($('#again'), 'click', (ev) => { ev.preventDefault(); delete S.current[ck]; save(true); simulacroPage(n); });
      if (ps.length) {
        const refresh = () => {
          const pr = practicalScore();
          $('#pr-score').textContent = fmtPts(pr);
          $('#total-score').textContent = fmtPts(pts + pr);
          const e2 = S.exam[key]; if (e2) { e2.practical = pr; e2.practicalTotal = pTotal; save(); }
        };
        $$('.rubric input').forEach((cb) => on(cb, 'change', refresh));
        on($('#go-practical'), 'click', (ev) => { ev.preventDefault(); $('#practical').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        refresh();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(() => requestAnimationFrame(() => { const v = $('#exam-result .ring .val'); if (v) v.style.strokeDashoffset = String(C2 * (1 - p / 100)); }));
      renderNav(currentKey);
    };
    on($('#grade'), 'click', grade);
    on($('#grade-m'), 'click', () => { if (!confirmArmed && Object.keys(cur.picks).length < qs.length) { $('#exam-actions').scrollIntoView({ behavior: 'smooth', block: 'center' }); } grade(); });
    on($('#grade-s'), 'click', () => { if (!confirmArmed && Object.keys(cur.picks).length < qs.length) $('#exam-actions').scrollIntoView({ behavior: 'smooth', block: 'center' }); grade(); });
  }

  // ---------- Practical exercises (study mode) ----------
  const EX_CATS = ['Corrección de errores', 'Completar código', 'Integración', 'Comprensión de código'];
  function wireCopy(root) {
    $$('[data-copy]', root).forEach((b) => on(b, 'click', async () => {
      const pre = b.closest('figure').querySelector('pre');
      if (await copyText(pre.innerText)) { b.innerHTML = `${icon('check')}Copiado`; setTimeout(() => { b.innerHTML = `${icon('copy')}Copiar`; }, 1500); }
    }));
  }
  function exerciseCard(x) {
    const r = S.ex[x.id];
    return `<a class="card ex-card" href="#/ejercicio/${x.id}">${icon('arrow-right', 'go')}
      <div class="card-top"><span class="q-num">Ejercicio ${esc(x.id)} · ${esc(x.category)}</span><span class="chip plain">${esc(x.tech)}</span></div>${x.conceptual ? `<span class="chip accent" style="align-self:flex-start;margin-bottom:6px">${icon('layers')}Incluye parte conceptual</span>` : ''}
      <h3>${esc(x.title)}</h3>
      <p>${x.concepts.map(esc).join(' · ')}</p>
      <div class="card-foot"><span class="chip plain">${icon('clock')}${esc(x.minutes)} min</span><span class="chip plain">${esc(x.level)}</span>${r?.score != null ? `<span class="chip ${r.score >= 7 ? 'ok' : r.score >= 5 ? 'warn' : 'bad'}">${icon('award')}${fmtPts(r.score)} / 10</span>` : r?.code ? '<span class="chip warn">Empezado</span>' : ''}</div></a>`;
  }
  function exercisesPage() {
    const done = X.filter((x) => S.ex[x.id]?.score != null).length;
    render(`
      ${pageHead({ path: [['Ejercicios prácticos', '']], eyebrow: 'Practicar', title: 'Ejercicios prácticos',
        lead: 'Ejercicios cortos como los de la parte práctica del examen: corregir un error, completar un fragmento, conectar piezas que ya existen o explicar un código. Cada uno trae dos pistas, la solución de referencia y los criterios de corrección para autoevaluarse sobre 10.',
        meta: `<span class="chip plain">${done} de ${X.length} autoevaluados</span><span class="chip plain">${icon('clock')}5-15 minutos cada uno</span>` })}
      <div class="callout info">${icon('info')}<div>Se recomienda escribir la solución sin abrir las pistas y consultar la solución solo al terminar. En el examen no hay pistas.</div></div>
      ${BLOCKS.map((b) => { const xs = X.filter((x) => KIND_BLOCK[x.kind] === b.id); return xs.length ? `${sectionHead(`<span style="color:var(--${b.color})">Bloque ${b.roman}</span> · ${esc(b.title)}`, `<span class="hint">${plural(xs.length, 'ejercicio', 'ejercicios')}</span>`)}<div class="grid">${xs.map(exerciseCard).join('')}</div>` : ''; }).join('')}`, 'Ejercicios prácticos');
  }
  function exercisePage(id) {
    const x = XB[id];
    if (!x) return notFound();
    const st = S.ex[id] || (S.ex[id] = {});
    const edit = x.files.find((f) => f.name === x.edit) || x.files[x.files.length - 1];
    const startCode = x.answerStarter ?? edit.code;
    const i = X.indexOf(x), prev = X[i - 1], next = X[i + 1];
    setLast(`#/ejercicio/${id}`, `Ejercicio ${id} · ${x.title}`, 'Ejercicios prácticos');
    render(`
      ${pageHead({ path: [['Ejercicios prácticos', '#/ejercicios'], [`Ejercicio ${x.id}`, '']], eyebrow: `Ejercicio ${esc(x.id)} · ${esc(x.category)}`, title: esc(x.title),
        meta: `<span class="chip plain">${icon('code')}${esc(x.tech)}</span><span class="chip plain">${esc(x.level)}</span><span class="chip plain">${icon('clock')}${esc(x.minutes)} min</span>${x.concepts.map((c) => `<span class="chip plain">${esc(c)}</span>`).join('')}` })}
      <div class="ex-layout">
        <section class="card ex-sec"><h2>Enunciado</h2><div class="prose-sm">${mdBlock(x.statement)}</div></section>
        <section class="card ex-sec"><h2>Código inicial</h2>${x.files.map((f) => codeFile(f)).join('')}</section>
        <section class="card ex-sec"><h2>Resultado esperado</h2><div class="prose-sm">${mdBlock(x.expected)}</div></section>
        <section class="card ex-sec"><h2>Solución propia</h2>
          <p class="muted" style="margin:0 0 10px;font-size:.9rem">Se guarda en este navegador. ${x.answerStarter ? '' : `Parte del fichero <code>${esc(edit.name)}</code>.`}</p>
          <label class="sr-only" for="ex-code">Solución propia</label>
          <textarea class="code-input" id="ex-code" spellcheck="false" autocapitalize="off" autocomplete="off" rows="${Math.min(28, Math.max(10, String(st.code ?? startCode).split('\n').length + 2))}">${esc(st.code ?? startCode)}</textarea>
          <div class="actions" style="margin-top:12px"><button class="btn ghost sm" id="ex-reset" type="button">${icon('rotate')}Volver al código inicial</button></div>
        </section>
        <section class="card ex-sec"><h2>Pistas</h2>
          <div id="hints">${x.hints.map((h, k) => `<div class="hint-box" data-h="${k}" ${k < (st.hints || 0) ? '' : 'hidden'}><span class="hint-n">Pista ${k + 1}</span><div>${mdBlock(h)}</div></div>`).join('')}</div>
          <button class="btn secondary sm" id="hint-btn" type="button"${(st.hints || 0) >= x.hints.length ? ' hidden' : ''}>${icon('info')}Ver la pista ${(st.hints || 0) + 1}</button>
        </section>
        <section class="card ex-sec" id="sol-sec"><h2>Solución y autoevaluación</h2>
          <div id="sol"${st.open ? '' : ' hidden'}>
            <h3>Solución de referencia</h3><pre><code>${esc(x.solution.code)}</code></pre>
            <h3>Cambios</h3><ul>${x.solution.changes.map((c) => `<li>${inline(c)}</li>`).join('')}</ul>
            <h3>Explicación</h3><div class="prose-sm">${mdBlock(x.solution.explanation)}</div>
            ${x.solution.alternatives ? `<h3>Soluciones alternativas aceptables</h3><div class="prose-sm">${mdBlock(x.solution.alternatives)}</div>` : ''}
            <h3>Criterios de corrección</h3>
            <p class="muted" style="margin:0 0 8px;font-size:.9rem">Marcar los criterios que cumple la solución propia.</p>
            <ul class="rubric">${x.rubric.map((r, k) => `<li><label><input type="checkbox" data-r="${k}"${st.checks?.[k] ? ' checked' : ''}><span>${inline(r.text)}</span><span class="rp">${fmtPts(r.points)} p.</span></label></li>`).join('')}</ul>
            ${x.penalties?.length ? `<div class="callout warn" style="margin-top:12px">${icon('alert')}<div><strong>Penalizaciones</strong><ul>${x.penalties.map((t) => `<li>${inline(t)}</li>`).join('')}</ul></div></div>` : ''}
            ${x.partial ? `<p class="muted" style="font-size:.9rem"><strong>Puntuación parcial.</strong> ${inline(x.partial)}</p>` : ''}
            <div class="ex-score"><span>Nota orientativa</span><strong id="ex-score">0</strong><span>/ 10</span></div>
          </div>
          <button class="btn" id="sol-btn" type="button"${st.open ? ' hidden' : ''}>${icon('check')}Ver la solución y autoevaluar</button>
        </section>
      </div>
      <nav class="ex-pager">${prev ? `<a class="btn secondary" href="#/ejercicio/${prev.id}">${icon('arrow-left')}Ejercicio ${prev.id}</a>` : '<span></span>'}${next ? `<a class="btn secondary" href="#/ejercicio/${next.id}">Ejercicio ${next.id}${icon('arrow-right')}</a>` : `<a class="btn secondary" href="#/ejercicios">Todos los ejercicios</a>`}</nav>`, `Ejercicio ${id}`);

    wireCopy(main);
    const ta = $('#ex-code');
    on(ta, 'input', () => { st.code = ta.value; save(); });
    on(ta, 'keydown', (ev) => {
      if (ev.key !== 'Tab' || ev.shiftKey || ta.dataset.esc) { if (ev.key === 'Tab') delete ta.dataset.esc; return; }
      ev.preventDefault();
      const a = ta.selectionStart, b2 = ta.selectionEnd;
      ta.value = ta.value.slice(0, a) + '  ' + ta.value.slice(b2); ta.selectionStart = ta.selectionEnd = a + 2;
      st.code = ta.value; save();
    });
    on(ta, 'keyup', (ev) => { if (ev.key === 'Escape') ta.dataset.esc = '1'; });
    on($('#ex-reset'), 'click', () => { if (!confirm(tr('¿Sustituir la solución propia por el código inicial?'))) return; ta.value = startCode; delete st.code; save(); });
    on($('#hint-btn'), 'click', () => {
      st.hints = Math.min(x.hints.length, (st.hints || 0) + 1); save();
      $$('.hint-box').forEach((h) => { h.hidden = Number(h.dataset.h) >= st.hints; });
      const b = $('#hint-btn');
      if (st.hints >= x.hints.length) b.hidden = true; else b.innerHTML = `${icon('info')}Ver la pista ${st.hints + 1}`;
    });
    const score = () => {
      const got = $$('#sol .rubric input').reduce((a, cb) => a + (cb.checked ? x.rubric[Number(cb.dataset.r)].points : 0), 0);
      $('#ex-score').textContent = fmtPts(got);
      return got;
    };
    on($('#sol-btn'), 'click', () => {
      st.open = true; save();
      $('#sol').hidden = false; $('#sol-btn').hidden = true;
      $('#sol').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $$('#sol .rubric input').forEach((cb) => on(cb, 'change', () => {
      st.checks = st.checks || {};
      st.checks[cb.dataset.r] = cb.checked;
      st.score = score(); st.at = Date.now(); save();
    }));
    score();
  }

  // ---------- Resources ----------
  function resourcesPage() {
    render(`
      ${pageHead({ path: [['Laboratorios y recursos', '']], eyebrow: 'Recursos', title: 'Laboratorios y recursos', lead: 'Enunciados y soluciones de los laboratorios, repositorios del curso y documentación oficial de cada semana.' })}
      ${sectionHead('Laboratorios')}
      ${labRows(C.labs)}
      ${sectionHead('Repositorios y material general')}
      ${linkGrid(C.resources)}
      ${sectionHead('Documentación por semana', `<a href="#/curso">Mapa del curso ${icon('arrow-right')}</a>`)}
      <div class="res-blocks">${BLOCKS.map((b) => `<section class="res-block" style="--bc:var(--${b.color})">
        <p class="eyebrow" style="color:var(--${b.color})">Bloque ${b.roman} · ${esc(b.title)}</p>
        ${b.weekList.map((w) => `<div class="res-week"><div class="res-week-label"><span class="week-n">Semana ${w.n}</span><span>${esc(w.title)}</span>${w.pending ? '<span class="chip warn">Pendiente</span>' : ''}</div>${w.links.length ? linkGrid(w.links) : `<p class="week-info">${icon('info')}<span>${esc(w.note || 'Sin documentación asociada.')}</span></p>`}</div>`).join('')}
      </section>`).join('')}</div>`, 'Recursos');
  }

  // ---------- Progress ----------
  // Quizzes, practice exams and exercises started and not finished.
  function inProgress() {
    const items = [];
    for (const n of QUIZ_ORDER) {
      const c = S.current['quiz-' + n];
      if (c && Array.isArray(c.order) && (c.i > 0 || Object.keys(c.ans || {}).length)) items.push({ href: `#/quiz/${n}`, ic: 'check-square', title: `${quizName(n)} · ${Q[n].title}`, sub: `Pregunta ${Math.min(c.i + 1, c.order.length)} de ${c.order.length}`, p: pct(Math.min(c.i, c.order.length), c.order.length) });
    }
    for (const k of [...E.map((x) => String(x.n)), 'aleatorio']) {
      const c = S.current['sim-' + k];
      if (!c) continue;
      const answered = Object.keys(c.picks || {}).length, written = Object.keys(c.code || {}).length;
      if (answered || written) items.push({ href: `#/simulacro/${k}`, ic: 'clipboard', title: k === 'aleatorio' ? 'Simulacro aleatorio' : `Simulacro ${k}`, sub: `${answered} de ${(c.ids || []).length} preguntas respondidas${written ? ` · ${plural(written, 'ejercicio empezado', 'ejercicios empezados')}` : ''}`, p: pct(answered, (c.ids || []).length || 8) });
    }
    for (const x of X) {
      const r = S.ex[x.id];
      if (r && r.score == null && (r.code != null || r.hints || r.open)) items.push({ href: `#/ejercicio/${x.id}`, ic: 'code', title: `Ejercicio ${x.id} · ${x.title}`, sub: r.open ? 'Solución abierta, sin autoevaluar' : `${r.hints ? plural(r.hints, 'pista vista', 'pistas vistas') : 'Solución empezada'}`, p: null });
    }
    return items;
  }

  function progressPage() {
    const pending = inProgress();
    const rows = QUIZ_ORDER.map((n) => {
      const c = S.current['quiz-' + n], going = c && Array.isArray(c.order) && c.i > 0;
      const r = S.quiz[n], total = r?.total || objective(Q[n].questions), p = r ? pct(r.best, total) : 0;
      return `<tr><td><a href="#/quiz/${n}"><strong>${esc(quizName(n))}</strong></a> · ${esc(Q[n].title)}</td><td class="num">${r?.attempts || 0}</td><td class="num">${r ? `${r.last}/${total}` : '—'}</td><td class="num">${r ? `${r.best}/${total}` : '—'}</td><td style="min-width:120px">${r ? bar(p, p >= 70 ? 'ok' : '') : (going ? `<span class="chip warn">${icon('clock')}A medias · ${c.i}/${c.order.length}</span>` : '<span class="muted">Sin empezar</span>')}</td><td class="num">${r?.at ? fmtShort(r.at) : '—'}</td></tr>`;
    }).join('');
    const exKeys = [...E.map((x) => String(x.n)), 'aleatorio'];
    const exRows = exKeys.map((k) => {
      const r = S.exam[k];
      return `<tr><td><a href="#/simulacro/${k}"><strong>${k === 'aleatorio' ? 'Simulacro aleatorio' : 'Simulacro ' + k}</strong></a></td><td class="num">${r?.attempts || 0}</td><td class="num">${r ? fmtNum(r.last * 0.5) : '—'}</td><td class="num">${r ? fmtNum(r.best * 0.5) : '—'}</td>${HAS_PRACTICAL ? `<td class="num">${r?.practical != null ? `${fmtPts(r.practical)} / ${fmtPts(r.practicalTotal || 6)}` : '—'}</td>` : ''}<td class="num">${r?.at ? fmtShort(r.at) : '—'}</td></tr>`;
    }).join('');
    render(`
      ${pageHead({ path: [['Progreso', '']], eyebrow: 'Seguimiento', title: 'Progreso', lead: 'Resultados guardados en este navegador. No se envían a ningún sitio ni cuentan para la evaluación: si se cambia de navegador o de dispositivo, se empieza de cero.' })}
      ${pending.length ? `${sectionHead('En curso')}
      <div class="list-card">${pending.map((it) => `<a class="lab-row progress-row" href="${it.href}"><span class="lab-id">${icon(it.ic)}</span><div class="lab-main"><div class="t">${esc(it.title)}</div><div class="s">${esc(it.sub)}</div>${it.p != null ? `<div style="margin-top:6px;max-width:320px">${bar(it.p)}</div>` : ''}</div><span class="btn sm secondary">${icon('play')}Continuar</span></a>`).join('')}</div>` : ''}
      ${sectionHead('Quizzes')}
      <div class="table-wrap"><table><thead><tr><th>Quiz</th><th class="num">Intentos</th><th class="num">Último</th><th class="num">Mejor</th><th>Nivel</th><th class="num">Fecha</th></tr></thead><tbody>${rows}</tbody></table></div>
      ${sectionHead('Simulacros')}
      <div class="table-wrap"><table><thead><tr><th>Simulacro</th><th class="num">Intentos</th><th class="num">Test, último</th><th class="num">Test, mejor</th>${HAS_PRACTICAL ? '<th class="num">Práctica, último</th>' : ''}<th class="num">Fecha</th></tr></thead><tbody>${exRows}</tbody></table></div>
      ${X.length ? `${sectionHead('Ejercicios prácticos')}
      <div class="table-wrap"><table><thead><tr><th>Ejercicio</th><th>Pistas vistas</th><th class="num">Autoevaluación</th><th class="num">Fecha</th></tr></thead><tbody>${X.map((x) => { const r = S.ex[x.id]; return `<tr><td><a href="#/ejercicio/${x.id}"><strong>${x.id}</strong></a> · ${esc(x.title)}</td><td>${r?.hints ? `${r.hints} de ${x.hints.length}` : '—'}</td><td class="num">${r?.score != null ? `${fmtPts(r.score)} / 10` : '—'}</td><td class="num">${r?.at ? fmtShort(r.at) : '—'}</td></tr>`; }).join('')}</tbody></table></div>` : ''}
      ${sectionHead('Datos')}
      <div class="card" style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">
        <p style="margin:0;max-width:60ch">Borrar el progreso elimina resultados, quizzes a medias y la lista de repaso de este navegador. No se puede deshacer.</p>
        <button class="btn danger" id="reset" type="button">${icon('trash')}Borrar todo el progreso</button>
      </div>`, 'Progreso');
    on($('#reset'), 'click', () => {
      if (!confirm(tr('¿Borrar todo el progreso guardado en este navegador? No se puede deshacer.'))) return;
      for (const k of ['quiz', 'exam', 'wrong', 'current', 'ex']) S[k] = {};
      delete S.last; delete S.guide; save(true);
      try { localStorage.removeItem('g247-progress'); } catch { /* ignore */ }
      toast('Progreso borrado'); renderNav('progreso'); progressPage();
    });
  }

  function notFound() {
    render(`<div class="card empty" style="margin-top:40px"><span class="icon-tile">${icon('alert')}</span><h1 style="font-size:1.4rem">Página no encontrada</h1><p>La dirección no corresponde a ninguna página del sitio.</p><div class="actions" style="justify-content:center"><a class="btn" href="#/">Volver al inicio</a></div></div>`, 'No encontrada');
  }

  // ---------- Search ----------
  let IDX = null;
  function buildIndex() {
    const items = [];
    const add = (o) => { o.nt = fold(o.title); o.nx = fold(o.text || ''); items.push(o); };
    [['Mapa del curso', '#/curso', 'semanas sesiones calendario canvas practicas'], ['Cómo encaja todo', '#/arquitectura', 'arquitectura capas middleware orden cors jwt cliente servidor peticion recorrido carpetas practica 2'], ['Simulacros del examen', '#/simulacros', 'simulacro test aleatorio examen'],
      ['Quizzes por laboratorio', '#/quizzes', 'quiz autoevaluacion'], ['Repaso de errores', '#/repaso', 'falladas errores repasar'],
      ['Laboratorios y recursos', '#/recursos', 'laboratorio enunciado solucion documentacion mdn'], ['Progreso', '#/progreso', 'resultados borrar progreso estadisticas']]
      .forEach(([t, h, k]) => add({ type: 'page', title: t, sub: 'Página', href: h, text: k, ic: 'chevron' }));
    for (const gid of LANG === 'en' ? [] : Object.keys(G)) {
      const div = document.createElement('div');
      div.innerHTML = G[gid].html;
      let cur = null;
      for (const el of Array.from(div.children)) {
        if (/^H[23]$/.test(el.tagName) && el.id) {
          cur = { type: 'guide', title: el.textContent.trim(), sub: `Guía del bloque ${gid}`, href: `#/guia/${gid}/${encodeURIComponent(el.id)}`, text: '', ic: 'book' };
          items.push(cur);
        } else if (cur) cur.text += ' ' + el.textContent.replace(/\s+/g, ' ');
      }
    }
    items.filter((o) => o.type === 'guide').forEach((o) => { o.nt = fold(o.title); o.nx = fold(o.text); });
    for (const s of SESSIONS) add({ type: 'session', title: `Sesión ${s.n}: ${s.title}`, sub: `Bloque ${s.block.roman} · Semana ${s.week}`, href: `#/curso/${s.week}`, text: s.lab || '', ic: 'calendar' });
    for (const x of X) add({ type: 'page', title: `Ejercicio ${x.id}: ${x.title}`, sub: `Ejercicios prácticos · ${x.category}`, href: `#/ejercicio/${x.id}`, text: [x.tech, ...x.concepts, plain(x.statement)].join(' '), ic: 'code' });
    for (const l of C.labs) add({ type: 'lab', title: `${l.id} · ${l.title}`, sub: l.brief ? 'Enunciado en GitHub' : 'Próximamente', href: l.brief || '#/recursos', ext: !!l.brief, text: 'laboratorio', ic: 'code' });
    for (const b of BLOCKS) for (const w of b.weekList) for (const [t, u] of w.links) add({ type: 'doc', title: t, sub: `Documentación · Semana ${w.n}`, href: u, ext: true, text: '', ic: 'external' });
    for (const [t, u] of C.resources) add({ type: 'doc', title: t, sub: 'Recursos del curso', href: u, ext: true, text: '', ic: 'external' });
    for (const [id, e] of Object.entries(QI)) {
      const q = e.q;
      add({ type: 'question', title: plain(q.q), sub: e.quiz ? `${quizName(e.quiz)} · ${Q[e.quiz].title}` : `Simulacro ${e.exam}`, href: e.quiz ? `#/quiz/${e.quiz}` : `#/simulacro/${e.exam}`, text: plain([...(q.choices || []), q.why || ''].join(' ')), ic: 'check-square', id });
    }
    return items;
  }
  const GROUPS = [['page', 'Páginas', 4], ['guide', 'Guías teóricas', 8], ['session', 'Sesiones', 5], ['lab', 'Laboratorios', 4], ['question', 'Preguntas de práctica', 6], ['doc', 'Documentación oficial', 4]];
  function highlight(text, terms, max) {
    let t = text;
    if (max && t.length > max) {
      const f = fold(t);
      let pos = -1;
      for (const term of terms) { const p = f.indexOf(term); if (p >= 0 && (pos < 0 || p < pos)) pos = p; }
      const start = Math.max(0, pos - 50);
      t = (start ? '…' : '') + t.slice(start, start + max).trim() + (start + max < text.length ? '…' : '');
    }
    const f = fold(t);
    if (f.length !== t.length) return esc(t);
    const marks = new Array(t.length).fill(false);
    for (const term of terms) { let p = f.indexOf(term); while (p >= 0) { for (let k = p; k < p + term.length; k++) marks[k] = true; p = f.indexOf(term, p + term.length); } }
    let out = '', open = false;
    for (let k = 0; k < t.length; k++) {
      if (marks[k] && !open) { out += '<mark>'; open = true; }
      if (!marks[k] && open) { out += '</mark>'; open = false; }
      out += esc(t[k]);
    }
    return out + (open ? '</mark>' : '');
  }
  function searchItems(query) {
    IDX = IDX || buildIndex();
    const terms = fold(query).split(/\s+/).filter((t) => t.length > 0);
    if (!terms.length) return { terms, groups: [] };
    const scored = [];
    for (const it of IDX) {
      let score = 0, okAll = true;
      for (const t of terms) {
        const inT = it.nt.includes(t), inX = !inT && it.nx.includes(t);
        if (!inT && !inX) { okAll = false; break; }
        score += inT ? (it.nt.startsWith(t) ? 14 : 10) : 2;
      }
      if (okAll) scored.push({ it, score });
    }
    scored.sort((a, b) => b.score - a.score);
    const groups = GROUPS.map(([type, label, max]) => ({ label, items: scored.filter((s) => s.it.type === type).slice(0, max).map((s) => s.it) })).filter((g) => g.items.length);
    return { terms, groups };
  }
  const dlg = $('#search-dialog'), sInput = $('#search-input'), sResults = $('#search-results');
  let sSel = 0, sFlat = [], lastFocus = null;
  function renderSearch() {
    const q = sInput.value.trim();
    if (!q) {
      sFlat = [];
      sResults.innerHTML = `<div class="sr-empty">Buscar en las guías, las preguntas de práctica, las sesiones y los laboratorios.<div class="sr-suggest">${['flexbox', 'middleware', 'JOIN', 'JWT', 'useEffect', 'especificidad', 'async await', 'status 404'].map((s) => `<button type="button" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>`;
      $$('.sr-suggest button', sResults).forEach((b) => b.addEventListener('click', () => { sInput.value = b.dataset.s; renderSearch(); sInput.focus(); }));
      return;
    }
    const { terms, groups } = searchItems(q);
    sFlat = groups.flatMap((g) => g.items);
    sSel = 0;
    if (!sFlat.length) { sResults.innerHTML = `<div class="sr-empty">Sin resultados para «${esc(q)}».</div>`; return; }
    let k = 0;
    sResults.innerHTML = groups.map((g) => `<div class="sr-group">${g.label}</div>${g.items.map((it) => {
      const idx = k++;
      return `<a class="sr-item${idx === 0 ? ' sel' : ''}" role="option" aria-selected="${idx === 0}" id="sr-${idx}" data-idx="${idx}" href="${esc(it.href)}"${it.ext ? ' target="_blank" rel="noopener"' : ''}>
        <span class="icon-tile">${icon(it.ic)}</span><span class="sr-main"><span class="sr-title">${highlight(it.type === 'question' ? (it.title.length > 140 ? it.title.slice(0, 140) + '…' : it.title) : it.title, terms)}</span>
        <span class="sr-sub">${esc(it.sub)}</span>${it.type === 'guide' && it.text ? `<span class="sr-snip">${highlight(it.text.trim(), terms, 160)}</span>` : ''}</span></a>`;
    }).join('')}`).join('');
    $$('.sr-item', sResults).forEach((a) => {
      a.addEventListener('mousemove', () => selectResult(Number(a.dataset.idx), false));
      a.addEventListener('click', () => closeSearch(false));
    });
  }
  function selectResult(i, scroll = true) {
    if (!sFlat.length) return;
    sSel = (i + sFlat.length) % sFlat.length;
    $$('.sr-item', sResults).forEach((a) => { const sel = Number(a.dataset.idx) === sSel; a.classList.toggle('sel', sel); a.setAttribute('aria-selected', String(sel)); });
    sInput.setAttribute('aria-activedescendant', 'sr-' + sSel);
    if (scroll) $('#sr-' + sSel)?.scrollIntoView({ block: 'nearest' });
  }
  function openSearch() {
    lastFocus = document.activeElement;
    dlg.hidden = false; document.body.style.overflow = 'hidden';
    sInput.select(); sInput.focus();
    renderSearch();
  }
  function closeSearch(restore = true) {
    dlg.hidden = true; document.body.style.overflow = '';
    if (restore && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('#search-btn').addEventListener('click', openSearch);
  $('#search-close').addEventListener('click', () => closeSearch());
  $('#search-kbd').textContent = IS_MAC ? '⌘ K' : 'Ctrl K';
  dlg.addEventListener('mousedown', (e) => { if (e.target === dlg) closeSearch(); });
  let sDeb = 0;
  sInput.addEventListener('input', () => { clearTimeout(sDeb); sDeb = setTimeout(renderSearch, 60); });
  sInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selectResult(sSel + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selectResult(sSel - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const it = sFlat[sSel];
      if (!it) return;
      closeSearch(false);
      if (it.ext) window.open(it.href, '_blank', 'noopener'); else navigate(it.href);
    }
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
    if (e.key === 'Tab') { // keep focus inside the dialog
      const f = $$('input, button, a[href]', dlg).filter((x) => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.addEventListener('keydown', (e) => {
    const typing = /^(input|textarea|select)$/i.test(e.target.tagName || '') || e.target.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); if (dlg.hidden) openSearch(); else closeSearch(); }
    else if (e.key === '/' && !typing && dlg.hidden) { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setNav(false);
  });

  // ---------- Router ----------
  let currentKey = 'home', currentGuide = null;
  function navigate(href, replace = false) {
    const path = toPath(href);
    if (path !== location.pathname + location.search) history[replace ? 'replaceState' : 'pushState'](null, '', path);
    route();
  }
  // Rewrites "#/route" links to clean paths whenever content is rendered.
  function fixLinks(rootEl) {
    if (rootEl.nodeType !== 1) return;
    const list = rootEl.matches?.('a[href^="#/"]') ? [rootEl] : [];
    list.concat($$('a[href^="#/"]', rootEl)).forEach((a) => a.setAttribute('href', toPath(a.getAttribute('href'))));
  }
  fixLinks(document.body);
  new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => { fixLinks(n); translateTree(n); }))).observe(document.body, { childList: true, subtree: true });
  translateTree(document.body);
  // Language switch: ES <-> EN on the same page, remembered in this browser.
  const langBtn = $('#lang-btn');
  if (langBtn) {
    const other = LANG === 'en' ? 'es' : 'en';
    langBtn.textContent = other.toUpperCase();
    langBtn.setAttribute('aria-label', other === 'en' ? 'Read in English' : 'Leer en castellano');
    langBtn.setAttribute('title', other === 'en' ? 'English' : 'Castellano');
    langBtn.setAttribute('data-no-tr', '');
    langBtn.addEventListener('click', () => {
      try { localStorage.setItem('g247-lang', other); } catch { /* storage unavailable */ }
      let raw = location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length) : '';
      if (/^en(\/|$)/.test(raw)) raw = raw.slice(3);
      location.assign(BASE + (other === 'en' ? 'en/' : '') + raw + location.hash);
    });
  }
  // Internal links navigate without reloading; "#id" links scroll within the page.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target || a.hasAttribute('download') || a.hasAttribute('data-lang')) return;
    const href = a.getAttribute('href');
    if (href.startsWith('#') && !href.startsWith('#/')) {
      const el = document.getElementById(decodeURIComponent(href.slice(1)));
      if (el) { e.preventDefault(); el.scrollIntoView({ block: 'start' }); if (el.tabIndex < 0 && !/^(A|BUTTON|INPUT|TEXTAREA)$/.test(el.tagName)) el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
      return;
    }
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(BASE) || /\.[a-z0-9]+$/i.test(url.pathname)) return;
    e.preventDefault();
    navigate(url.pathname + url.search);
  });
  function route() {
    let raw = location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length) : '';
    if (/^en(\/|$)/.test(raw)) raw = raw.slice(3);
    const parts = raw.split('/').filter(Boolean);
    const [page, arg, a3] = parts;
    // Same guide, new section: scroll without re-rendering.
    if (page === 'guia' && currentGuide === arg && $('#guide')) {
      if (a3) scrollToHeading(a3, true);
      return;
    }
    newView();
    setNav(false);
    currentGuide = null;
    const keyFor = () => {
      if (!page) return 'home';
      if (page === 'bloque') return 'b' + arg;
      if (page === 'guia') return 'g-' + arg;
      if (page === 'quiz') return 'quizzes';
      if (page === 'examen') return 'home';
      if (page === 'simulacro') return 'simulacros';
      if (page === 'ejercicio') return 'ejercicios';
      return page;
    };
    currentKey = keyFor();
    renderNav(currentKey);
    if (page === 'examen') history.replaceState(null, '', BASE + PREFIX);
    if (!page || page === 'examen') return home();
    switch (page) {
      case 'bloque': return blockPage(arg);
      case 'guia': currentGuide = arg; return guidePage(arg, a3);
      case 'quizzes': return quizzesPage();
      case 'quiz': return quizPage(arg);
      case 'simulacros': return simulacrosPage();
      case 'ejercicios': return exercisesPage();
      case 'arquitectura': return architecturePage();
      case 'ejercicio': return exercisePage(arg);
      case 'simulacro': return simulacroPage(arg);
      case 'repaso': return arg === 'practicar' ? reviewRun(a3) : reviewPage();
      case 'curso': coursePage(); if (arg) document.getElementById('semana-' + arg)?.scrollIntoView({ block: 'start' }); return;
      case 'recursos': return resourcesPage();
      case 'progreso': return progressPage();
      default: return notFound();
    }
  }
  window.addEventListener('popstate', route);
  // Old links with a hash (#/quiz/1) and deep links redirected by 404.html (?p=quiz/1) become clean paths.
  window.addEventListener('hashchange', () => { if (location.hash.startsWith('#/')) navigate(location.hash, true); });
  {
    const params = new URLSearchParams(location.search);
    if (location.hash.startsWith('#/')) history.replaceState(null, '', toPath(location.hash));
    else if (params.has('p')) history.replaceState(null, '', BASE + params.get('p').replace(/^\//, '') + location.hash);
    const cur = location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length) : '';
    if (LANG === 'en' && !/^en(\/|$)/.test(cur)) history.replaceState(null, '', BASE + 'en/' + cur + location.hash);
    if (LANG === 'en') { try { localStorage.setItem('g247-lang', 'en'); } catch { /* storage unavailable */ } }
  }
  window.addEventListener('pagehide', () => save(true));
  route();

  // Offline support: network first, cache as fallback (see sw.js).
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register(BASE + 'sw.js').catch(() => { /* offline support is optional */ }));
  }
})();
