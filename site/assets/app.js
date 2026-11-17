'use strict';
// G247 study site: hash router, pages, quiz and practice-exam engines, search and local progress.
// Plain JavaScript, no dependencies. Content comes from data/*.js (COURSE, QUIZZES, EXAMS, GUIDES).
(() => {
  const C = window.COURSE, Q = window.QUIZZES || {}, E = window.EXAMS || [], G = window.GUIDES || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const main = $('#main');
  const LETTERS = 'ABCDEF';
  const MONTHS = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
  const EXAM_DATE = new Date(C.exam.date);
  const YEAR = EXAM_DATE.getFullYear();
  const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  // "Today" can be overridden with ?hoy=YYYY-MM-DD to check the calendar views.
  const TODAY = (() => {
    const p = new URLSearchParams(location.search).get('hoy');
    const d = p && /^\d{4}-\d{2}-\d{2}$/.test(p) ? new Date(p + 'T00:00:00') : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

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
  const plain = (s) => String(s ?? '').replace(/```[a-z]*\n[\s\S]*?```/g, ' […] ').replace(/[`*]/g, '').replace(/\s+/g, ' ').trim();
  const fold = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const fmtNum = (n, d = 1) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const dayMs = 86400000;
  const parseDay = (s) => { const [d, m] = String(s).split(' '); return new Date(YEAR, MONTHS[m], Number(d)); };
  const fmtDate = (d) => d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtShort = (ts) => new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const isObjective = (q) => q.type !== 'essay';
  const objective = (qs) => qs.filter(isObjective).length;
  const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  const typeLabel = { mc: 'Opción múltiple', tf: 'Verdadero o falso', fib: 'Completar', essay: 'Ejercicio de programación' };

  // ---------- Course model ----------
  const BLOCKS = C.blocks.map((b) => {
    const dates = b.sessions.map((s) => parseDay(s.date));
    const first = dates[0], last = dates[dates.length - 1];
    const status = TODAY < first ? 'soon' : TODAY > last ? 'done' : 'now';
    return { ...b, first, last, status, color: `b${b.id}` };
  });
  const blockOfQuiz = (n) => BLOCKS.find((b) => b.quizzes.includes(Number(n)));
  const blockById = (id) => BLOCKS.find((b) => String(b.id) === String(id));
  const SESSIONS = BLOCKS.flatMap((b) => b.sessions.map((s) => ({ ...s, block: b, day: parseDay(s.date) })));
  const labSession = (id) => SESSIONS.find((s) => s.lab === id);
  const statusChip = { soon: '<span class="chip">Próximamente</span>', now: '<span class="chip accent">En curso</span>', done: '<span class="chip ok">Impartido</span>' };

  // Question index: every question by id, with its source and block.
  const PREFIX_BLOCK = { c1: 1, c2: 1, c3: 1, html: 1, css: 1, js: 1, dom: 1, node: 2, express: 2, rest: 2, sql: 2, auth: 2, components: 3, state: 3, routing: 3 };
  const QI = {};
  for (const n of Object.keys(Q)) for (const q of Q[n].questions) QI[q.id] = { q, quiz: Number(n), block: blockOfQuiz(n)?.id, rubric: Q[n].rubric };
  for (const x of E) for (const q of x.questions) if (!QI[q.id]) QI[q.id] = { q, exam: x.n, block: PREFIX_BLOCK[q.id.split('-')[0]] || null };
  const allObjective = Object.values(QI).filter((e) => isObjective(e.q) && e.q.choices);

  // ---------- Local progress ----------
  const KEY = 'g247-study-v2';
  const S = (() => {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { s = null; }
    if (!s || typeof s !== 'object') s = {};
    for (const k of ['quiz', 'exam', 'wrong', 'guide', 'current']) if (!s[k] || typeof s[k] !== 'object') s[k] = {};
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
  const setLast = (href, title, sub) => { S.last = { href, title, sub, at: Date.now() }; save(); };
  const wrongIds = () => Object.keys(S.wrong).filter((id) => QI[id]);
  const guideRead = (id) => { const g = S.guide[id]; const toc = G[id]?.toc || []; return g?.read ? pct(toc.filter((t) => g.read[t.id]).length, toc.length) : 0; };

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
        ${BLOCKS.map((b) => navLink(`#/bloque/${b.id}`, `Bloque ${b.roman} · ${esc(b.title)}`, 'b' + b.id, active, '', `<span class="nav-dot" style="background:var(--${b.color})"></span>`)).join('')}
      </div>
      <div class="nav-group"><div class="nav-label">Estudiar</div>
        ${BLOCKS.filter((b) => b.guide && G[b.guide]).map((b) => navLink(`#/guia/${b.guide}`, `Guía del bloque ${b.roman}`, 'g-' + b.guide, active, guideRead(b.guide) ? `<span class="badge soft">${guideRead(b.guide)} %</span>` : '', icon('book'))).join('')}
      </div>
      <div class="nav-group"><div class="nav-label">Practicar</div>
        ${navLink('#/quizzes', 'Quizzes por laboratorio', 'quizzes', active, '', icon('check-square'))}
        ${navLink('#/simulacros', 'Simulacros del examen', 'simulacros', active, '', icon('clipboard'))}
        ${navLink('#/repaso', 'Repaso de errores', 'repaso', active, wrong ? `<span class="badge">${wrong}</span>` : '', icon('rotate'))}
      </div>
      <div class="nav-group"><div class="nav-label">Examen y recursos</div>
        ${navLink('#/examen', 'Examen final', 'examen', active, '', icon('flag'))}
        ${navLink('#/recursos', 'Laboratorios y recursos', 'recursos', active, '', icon('link'))}
        ${navLink('#/progreso', 'Progreso', 'progreso', active, '', icon('chart'))}
      </div>`;
    const days = Math.round((new Date(EXAM_DATE).setHours(0, 0, 0, 0) - TODAY) / dayMs);
    $('#side-foot').innerHTML = `<a class="side-exam" href="#/examen">
        <div class="k">Examen final</div>
        <div class="v">${days > 1 ? `${days} días` : days === 1 ? 'Mañana' : days === 0 ? 'Hoy' : 'Realizado'}</div>
        <div class="d">${esc(C.exam.label.replace(/^\w+ /, ''))}</div></a>`;
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
    menuBtn.setAttribute('aria-label', open ? 'Cerrar el menú' : 'Abrir el menú');
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
    $('#read-progress span').style.width = '0';
    return view;
  }
  const on = (el, ev, fn, opts = {}) => el.addEventListener(ev, fn, { ...opts, signal: view.ac.signal });
  function render(html, title, { wide = false, keepScroll = false } = {}) {
    main.classList.toggle('wide', wide);
    main.innerHTML = html;
    document.title = title ? `${title} · G247` : 'G247 · Sitio de estudio';
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
    if (!q) return `<div class="card muted-card quiz-card"><span class="q-num">Quiz ${n}</span><h3>Disponible próximamente</h3><p>Quiz del laboratorio L${n}.</p></div>`;
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
      <div class="card-top"><span class="q-num">Quiz ${n} · ${esc(q.lab)}</span><span class="chip ${b.color}">Bloque ${b.roman}</span></div>
      <h3>${esc(q.title)}</h3>
      <p>${plural(q.questions.length, 'pregunta', 'preguntas')}${essays ? ` · ${essays} de programar` : ''} · sesiones ${esc(q.sessions)}</p>
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
      <h3>Simulacro ${x.n}</h3><p>${x.questions.length} preguntas de los tres bloques · 0,5 puntos cada una</p>
      <div class="card-foot">${foot}</div></a>`;
  }
  function randomExamCard() {
    const rec = S.exam.aleatorio;
    return `<a class="card" href="#/simulacro/aleatorio">${icon('arrow-right', 'go')}
      <div class="card-top"><span class="icon-tile">${icon('shuffle')}</span></div>
      <h3>Simulacro aleatorio</h3><p>8 preguntas nuevas en cada intento, sacadas de todo el banco: 3 del bloque I, 3 del II y 2 del III.</p>
      <div class="card-foot">${rec?.attempts ? `<span class="chip plain">${plural(rec.attempts, 'intento', 'intentos')}</span>` : '<span class="chip plain">Ilimitado</span>'}</div></a>`;
  }

  function labRows(labs) {
    return `<div class="list-card">${labs.map((l) => {
      const s = labSession(l.id);
      return `<div class="lab-row">
        <span class="lab-id">${esc(l.id)}</span>
        <div class="lab-main"><div class="t">${esc(l.title)}</div><div class="s">${s ? `Sesión ${esc(s.n)} · ${esc(s.date)} · Bloque ${s.block.roman}` : ''}</div></div>
        <div class="lab-links">
          ${l.brief ? `<a class="btn sm secondary" href="${l.brief}" target="_blank" rel="noopener">Enunciado ${icon('external')}</a>` : '<span class="chip">Enunciado próximamente</span>'}
          ${l.solutionUrl ? `<a class="btn sm secondary" href="${l.solutionUrl}" target="_blank" rel="noopener">Solución ${icon('external')}</a>` : l.brief ? '<span class="chip">Solución no publicada</span>' : ''}
        </div></div>`;
    }).join('')}</div>`;
  }

  // ---------- Home ----------
  function home() {
    const examDay = new Date(EXAM_DATE); examDay.setHours(0, 0, 0, 0);
    const days = Math.round((examDay - TODAY) / dayMs);
    const done = SESSIONS.filter((s) => s.day < TODAY).length;
    const upcoming = SESSIONS.filter((s) => s.day >= TODAY);
    const nextDay = upcoming[0]?.day;
    const nextSessions = nextDay ? upcoming.filter((s) => +s.day === +nextDay) : [];
    const quizKeys = Object.keys(Q);
    const doneQuizzes = quizKeys.filter((n) => S.quiz[n]?.attempts);
    const avg = doneQuizzes.length ? Math.round(doneQuizzes.reduce((a, n) => a + pct(S.quiz[n].best, S.quiz[n].total || objective(Q[n].questions)), 0) / doneQuizzes.length) : null;
    const exams = Object.values(S.exam).filter((e) => e.attempts);
    const bestExam = exams.length ? Math.max(...exams.map((e) => e.best)) : null;
    const wrong = wrongIds().length;
    const last = S.last;

    const cont = last
      ? `<a class="card continue-card" href="${esc(last.href)}"><span class="icon-tile">${icon(last.href.includes('/guia/') ? 'book' : 'play')}</span>
          <div class="txt"><div class="s">Continuar donde se dejó</div><div class="t">${esc(last.title)}</div><div class="s">${esc(last.sub || '')}</div></div>${icon('arrow-right')}</a>`
      : `<a class="card continue-card" href="#/guia/I"><span class="icon-tile">${icon('book')}</span>
          <div class="txt"><div class="s">Por dónde empezar</div><div class="t">Guía teórica del bloque I</div><div class="s">Leer la guía y hacer después el quiz de cada laboratorio</div></div>${icon('arrow-right')}</a>`;

    const today = nextSessions.length
      ? `<div class="card"><div class="card-top"><span class="eyebrow" style="margin:0">${+nextDay === +TODAY ? 'Hoy en clase' : 'Próxima clase · ' + esc(fmtDate(nextDay))}</span><a class="chip ${nextSessions[0].block.color}" href="#/bloque/${nextSessions[0].block.id}" style="text-decoration:none">Bloque ${nextSessions[0].block.roman}</a></div>
          <ul class="today-list">${nextSessions.map((s) => `<li><span class="n">Sesión ${esc(s.n)}</span><span>${esc(s.title)}${s.lab ? ` <span class="chip accent">${esc(s.lab)}</span>` : ''}</span></li>`).join('')}</ul></div>`
      : `<div class="card"><span class="eyebrow">Clases</span><p>Las sesiones del curso han terminado. Queda el examen final.</p></div>`;

    render(`
      <section class="hero">
        <div class="hero-main">
          <p class="eyebrow">${esc(C.code)} · ${esc(C.group)}</p>
          <h1>${esc(C.title)}</h1>
          <p class="lead">Material de estudio de la asignatura: guías teóricas, un quiz por laboratorio con corrección inmediata, simulacros de la parte tipo test del examen y repaso de las preguntas falladas.</p>
          <div class="actions">
            <a class="btn" href="${last ? esc(last.href) : '#/guia/I'}">${icon(last ? 'play' : 'book')}${last ? 'Continuar' : 'Empezar por la guía del bloque I'}</a>
            <a class="btn secondary" href="#/simulacro/aleatorio">${icon('shuffle')}Simulacro aleatorio</a>
          </div>
        </div>
        <a class="countdown-card" href="#/examen">
          <span class="k">Examen final</span>
          <span class="big">${days > 0 ? days : days === 0 ? 'Hoy' : '—'}${days > 0 ? `<small>${days === 1 ? 'día' : 'días'}</small>` : ''}</span>
          <span class="d">${icon('calendar')}${esc(C.exam.label)}</span>
          <span class="d">${icon('pin')}${esc(C.exam.room)}</span>
          ${bar(pct(done, SESSIONS.length))}
          <span class="cap">${done} de ${SESSIONS.length} sesiones impartidas</span>
        </a>
      </section>

      <div class="grid-2" style="margin-top:24px">${cont}${today}</div>

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
          <div class="card-foot">${statusChip[b.status]}<span class="chip plain">${plural(b.sessions.length, 'sesión', 'sesiones')}</span><span class="chip plain">Quizzes ${qd}/${b.quizzes.length}</span>${b.guide && guideRead(b.guide) ? `<span class="chip plain">Guía ${guideRead(b.guide)} %</span>` : ''}</div></a>`;
      }).join('')}</div>

      ${sectionHead('Preparar el examen')}
      <div class="grid-4">
        <a class="card" href="#/guia/I">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('book')}</span></div><h3>Guías teóricas</h3><p>Explicaciones completas de los bloques I y II, con ejemplos de clase y errores habituales.</p></a>
        <a class="card" href="#/quizzes">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('check-square')}</span></div><h3>Quizzes</h3><p>${quizKeys.length} quizzes, uno por laboratorio, con la explicación de cada respuesta.</p></a>
        <a class="card" href="#/simulacros">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('clipboard')}</span></div><h3>Simulacros</h3><p>La parte tipo test del examen: 8 preguntas de 0,5 puntos, sin penalización.</p></a>
        <a class="card" href="#/repaso">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('rotate')}</span>${wrong ? `<span class="badge">${wrong}</span>` : ''}</div><h3>Repaso de errores</h3><p>Las preguntas falladas se guardan aquí hasta que se responden bien.</p></a>
      </div>`, '');
  }

  // ---------- Block ----------
  function blockPage(id) {
    const b = blockById(id);
    if (!b) return notFound();
    const labs = C.labs.filter((l) => b.sessions.some((s) => s.lab === l.id));
    const upcoming = b.sessions.map((s) => parseDay(s.date)).find((d) => d >= TODAY);
    const timeline = b.sessions.map((s) => {
      const d = parseDay(s.date);
      const cls = +d === +TODAY ? 'today' : d < TODAY ? 'past' : +d === +upcoming ? 'next' : '';
      return `<li class="tl-item ${cls}${s.lab ? ' lab' : ''}"><span class="tl-date">${esc(s.date)}</span><span class="tl-dot"></span>
        <div class="tl-body"><span class="n">S${esc(s.n)}</span><span class="t">${esc(s.title)}</span>${s.lab ? `<span class="chip accent">${esc(s.lab)}</span>` : ''}${cls === 'today' ? '<span class="chip ok">Hoy</span>' : cls === 'next' ? '<span class="chip">Próxima</span>' : ''}</div></li>`;
    }).join('');
    const gr = b.guide && G[b.guide] ? guideRead(b.guide) : 0;
    const qd = b.quizzes.filter((n) => S.quiz[n]?.attempts).length;
    const blockWrong = wrongIds().filter((qid) => QI[qid].block === b.id).length;
    render(`
      ${pageHead({
        path: [[`Bloque ${b.roman}`, '']],
        eyebrow: `Bloque ${b.roman} · ${esc(b.weeks)}`, eyebrowStyle: `color:var(--${b.color})`,
        title: esc(b.title), lead: esc(b.subtitle),
        meta: `${statusChip[b.status]}<span class="chip plain">${icon('calendar')}${plural(b.sessions.length, 'sesión', 'sesiones')} · ${esc(b.sessions[0].date)} a ${esc(b.sessions[b.sessions.length - 1].date)}</span><span class="chip plain">${plural(labs.length, 'laboratorio', 'laboratorios')}</span>`,
      })}
      ${b.notes ? `<div class="callout info">${icon('info')}<div><strong>Criterios de este curso</strong><ul>${b.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div></div>` : ''}
      <div class="grid-2">
        ${b.guide && G[b.guide]
          ? `<a class="card" href="#/guia/${b.guide}${S.guide[b.guide]?.section ? '/' + encodeURIComponent(S.guide[b.guide].section) : ''}">${icon('arrow-right', 'go')}
              <div class="card-top"><span class="icon-tile">${icon('book')}</span></div>
              <h3>Guía teórica del bloque ${b.roman}</h3><p>${gr ? `Leído el ${gr} % de las secciones. Continuar donde se dejó.` : 'Explicación completa del bloque, con ejemplos de clase y errores habituales.'}</p>
              ${bar(gr)}</a>`
          : `<div class="card muted-card"><div class="card-top"><span class="icon-tile">${icon('book')}</span><span class="chip">En preparación</span></div><h3>Guía teórica del bloque ${b.roman}</h3><p>Se publicará al cerrar el bloque. Mientras tanto, las referencias son las presentaciones de cada semana y la documentación oficial.</p></div>`}
        <div class="card">
          <div class="card-top"><span class="icon-tile">${icon('check-square')}</span></div>
          <h3>Práctica del bloque</h3>
          <p>${qd} de ${b.quizzes.length} quizzes hechos${blockWrong ? ` · ${plural(blockWrong, 'pregunta', 'preguntas')} por repasar` : ''}.</p>
          ${bar(pct(qd, b.quizzes.length))}
          <div class="card-foot">${blockWrong ? `<a class="btn sm" href="#/repaso/practicar/${b.id}">${icon('rotate')}Repasar errores del bloque</a>` : `<a class="btn sm secondary" href="#/quiz/${b.quizzes.find((n) => !S.quiz[n]?.attempts) || b.quizzes[0]}">${icon('play')}Hacer un quiz</a>`}</div>
        </div>
      </div>
      ${sectionHead('Quizzes del bloque')}
      <div class="grid">${b.quizzes.map(quizCard).join('')}</div>
      ${sectionHead('Sesiones')}
      <div class="card"><ol class="timeline">${timeline}</ol></div>
      ${sectionHead('Laboratorios')}
      ${labRows(labs)}`, `Bloque ${b.roman}`);
  }

  // ---------- Guide ----------
  function guidePage(id, anchor) {
    const g = G[id];
    if (!g) return notFound();
    const b = BLOCKS.find((x) => x.guide === id);
    const words = g.html.replace(/<[^>]+>/g, ' ').split(/\s+/).length;
    const st = S.guide[id] || (S.guide[id] = { read: {} });
    st.read = st.read || {};
    const tocHtml = g.toc.map((t) => `<a class="l${t.level}${st.read[t.id] ? ' read' : ''}" href="#/guia/${id}/${encodeURIComponent(t.id)}" data-id="${esc(t.id)}">${esc(t.text)}</a>`).join('');
    render(`
      <div class="guide-head">
        ${crumbs([[`Bloque ${b.roman}`, `#/bloque/${b.id}`], ['Guía teórica', '']])}
        <p class="eyebrow" style="color:var(--${b.color})">Bloque ${b.roman} · ${esc(b.weeks)}</p>
        <h1>Guía teórica del bloque ${b.roman}</h1>
        <p class="lead">${esc(b.title)}: ${esc(b.subtitle)}.</p>
        <div class="meta-row"><span class="chip plain">${icon('clock')}${Math.round(words / 200)} min de lectura</span><span class="chip plain">${icon('list')}${plural(g.toc.filter((t) => t.level === 2).length, 'capítulo', 'capítulos')}</span><button class="chip plain" id="print-guide" type="button" style="cursor:pointer">Imprimir o guardar en PDF</button></div>
        <div class="guide-progress"><span id="gp-label">${guideRead(id)} % leído</span>${bar(guideRead(id))}</div>
      </div>
      <details class="toc-mobile card" style="padding:0"><summary>${icon('list')}Índice de la guía${icon('chevron', 'ri-chev')}</summary><nav class="toc-list" aria-label="Índice">${tocHtml}</nav></details>
      <div class="guide-layout">
        <article class="prose" id="guide">${g.html}</article>
        <aside class="guide-toc" aria-label="Índice de la guía"><p class="toc-title"><span>En esta guía</span></p><nav>${tocHtml}</nav></aside>
      </div>
      <section class="guide-end">
        <div class="card"><div class="card-top"><span class="icon-tile">${icon('check-square')}</span></div>
          <h3>Comprobar lo aprendido</h3><p>Los quizzes del bloque ${b.roman} cubren lo que explica esta guía, laboratorio a laboratorio.</p>
          <div class="card-foot">${b.quizzes.map((n) => `<a class="btn sm secondary" href="#/quiz/${n}">Quiz ${n} · ${esc(Q[n]?.title || '')}</a>`).join('')}</div></div>
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
        const url = location.href.split('#')[0] + `#/guia/${id}/${encodeURIComponent(h.id)}`;
        if (await copyText(url)) toast('Enlace copiado');
      });
      h.prepend(a);
    });
    on($('#print-guide'), 'click', () => window.print());

    const tocLinks = $$('.guide-toc a, .toc-mobile a');
    on($('.toc-mobile'), 'click', (e) => { if (e.target.closest('a')) $('.toc-mobile').open = false; });
    const progressSpan = $('#read-progress span');
    let active = null, ticking = false;
    const update = () => {
      ticking = false;
      const r = art.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      progressSpan.style.width = Math.max(0, Math.min(100, (-r.top / Math.max(total, 1)) * 100)) + '%';
      let cur = null;
      for (const h of heads) { if (h.getBoundingClientRect().top < 170) cur = h; else break; }
      if (cur && cur.id !== active) {
        active = cur.id;
        tocLinks.forEach((a) => a.classList.toggle('active', a.dataset.id === active));
        const act = $('.guide-toc a.active');
        if (act) { const box = $('.guide-toc'); const ar = act.getBoundingClientRect(), br = box.getBoundingClientRect(); if (ar.top < br.top + 40 || ar.bottom > br.bottom - 40) box.scrollTop += ar.top - br.top - br.height / 3; }
        if (!st.read[active]) { st.read[active] = 1; tocLinks.forEach((a) => { if (a.dataset.id === active) a.classList.add('read'); }); }
        st.section = active;
        const p = guideRead(id);
        $('#gp-label').textContent = `${p} % leído`;
        $('.guide-progress .bar span').style.width = p + '%';
        setLast(`#/guia/${id}/${encodeURIComponent(active)}`, cur.textContent.trim(), `Guía del bloque ${b.roman}`);
        history.replaceState(null, '', `#/guia/${id}/${encodeURIComponent(active)}`);
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
      ${sectionHead('Más práctica')}
      <div class="grid">
        <a class="card" href="#/simulacros">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('clipboard')}</span></div><h3>Simulacros del examen</h3><p>${E.length} simulacros fijos y uno aleatorio, con el formato de la parte tipo test.</p></a>
        <a class="card" href="#/repaso">${icon('arrow-right', 'go')}<div class="card-top"><span class="icon-tile">${icon('rotate')}</span></div><h3>Repaso de errores</h3><p>${wrongIds().length ? `${plural(wrongIds().length, 'pregunta pendiente', 'preguntas pendientes')} de acertar.` : 'Sin preguntas pendientes por ahora.'}</p></a>
      </div>`, 'Quizzes');
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
      const src = e.quiz && cfg.showSource ? `<span class="chip plain">Quiz ${e.quiz}</span>` : e.exam && cfg.showSource ? `<span class="chip plain">Simulacro ${e.exam}</span>` : '';
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
    const keys = Object.keys(Q).map(Number).sort((x, y) => x - y);
    const nextN = keys[keys.indexOf(Number(n)) + 1];
    const head = () => pageHead({
      path: [[`Bloque ${b.roman}`, `#/bloque/${b.id}`], [`Quiz ${n}`, '']],
      eyebrow: `Quiz ${n} · Laboratorio ${esc(quiz.lab.replace('L', ''))} · sesiones ${esc(quiz.sessions)}`, eyebrowStyle: `color:var(--${b.color})`,
      title: esc(quiz.title),
    });
    setLast(`#/quiz/${n}`, `Quiz ${n} · ${quiz.title}`, `Bloque ${b.roman}`);
    runner({
      id: 'quiz-' + n, ids: quiz.questions.map((q) => q.id), persist: true, record: ['quiz', String(n)], head, title: `Quiz ${n}`,
      back: [`#/bloque/${b.id}`, `Volver al bloque ${b.roman}`], next: nextN ? [`#/quiz/${nextN}`, `Quiz ${nextN}`] : null,
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
        <div class="list-card">${ids.map((x) => { const e = QI[x]; return `<div class="lab-row"><span class="lab-id" style="font-size:.72rem">${e.quiz ? 'Q' + e.quiz : 'S' + e.exam}</span><div class="lab-main"><div class="t" style="font-weight:500">${inline(plain(e.q.q).slice(0, 180))}${plain(e.q.q).length > 180 ? '…' : ''}</div><div class="s">${e.quiz ? `Quiz ${e.quiz} · ${esc(Q[e.quiz].title)}` : `Simulacro ${e.exam}`} · fallada el ${fmtShort(S.wrong[x])}</div></div></div>`; }).join('')}</div>`
      : `<div class="card empty"><span class="icon-tile">${icon('check')}</span><h3>No hay preguntas pendientes</h3><p>Las preguntas falladas en quizzes y simulacros aparecerán aquí para repasarlas.</p><div class="actions" style="justify-content:center"><a class="btn" href="#/quizzes">Ir a los quizzes</a></div></div>`}`, 'Repaso de errores');
    if ($('#clear-wrong')) on($('#clear-wrong'), 'click', () => {
      if (!confirm('¿Vaciar la lista de preguntas pendientes de repaso?')) return;
      S.wrong = {}; save(true); renderNav('repaso'); reviewPage();
    });
  }
  function reviewRun(blockId) {
    const b = blockId ? blockById(blockId) : null;
    const ids = shuffle(wrongIds().filter((x) => !b || QI[x].block === b.id));
    if (!ids.length) { location.hash = '#/repaso'; return; }
    const head = () => pageHead({ path: [['Repaso de errores', '#/repaso'], [b ? `Bloque ${b.roman}` : 'Todas', '']], eyebrow: 'Repaso de errores', title: b ? `Repaso del bloque ${b.roman}` : 'Repaso de todas las preguntas falladas' });
    runner({ id: 'review', ids, persist: false, record: null, head, title: 'Repaso de errores', back: ['#/repaso', 'Volver al repaso'], next: null, showSource: true });
  }

  // ---------- Practice exams ----------
  function simulacrosPage() {
    render(`
      ${pageHead({ path: [['Simulacros', '']], eyebrow: 'Practicar', title: 'Simulacros del examen',
        lead: 'Cada simulacro reproduce la parte tipo test del examen final: 8 preguntas de los tres bloques, 0,5 puntos cada una y sin penalización por error. Se responde todo y se corrige al final.',
        meta: `<span class="chip plain">${icon('award')}Parte tipo test: 4 de los 10 puntos del examen</span><span class="chip plain">${icon('clock')}Con cronómetro orientativo</span>` })}
      <div class="grid">${E.map(examCard).join('')}${randomExamCard()}</div>
      <div class="callout info" style="margin-top:28px">${icon('info')}<div>La parte práctica del examen (6 puntos) se prepara con los laboratorios: repetir cada uno desde el enunciado, sin mirar la solución, y compararlo después con ella. <a href="#/recursos">Ver los laboratorios</a>.</div></div>`, 'Simulacros');
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
    if (!cur || !Array.isArray(cur.ids) || !cur.ids.every((id) => QI[id])) {
      cur = S.current[ck] = { ids: random ? randomExamIds() : x.questions.map((q) => q.id), picks: {}, start: Date.now() };
      save();
    }
    const qs = cur.ids.map((id) => QI[id].q);
    const name = random ? 'Simulacro aleatorio' : `Simulacro ${x.n}`;
    setLast(`#/simulacro/${key}`, name, 'Parte tipo test del examen');
    const head = pageHead({ path: [['Simulacros', '#/simulacros'], [name, '']], eyebrow: 'Simulacro · parte tipo test', title: name,
      lead: `${qs.length} preguntas de opción múltiple, 0,5 puntos cada una. Las respuestas incorrectas no descuentan. La corrección se muestra al terminar.` });
    render(`${head}
      <div class="exam-layout">
        <div>
          <div id="exam-result"></div>
          ${qs.map((q, qi) => `<section class="qcard" id="q-${qi}" aria-labelledby="qt-${qi}">
            <div class="qhead"><span class="qnum">Pregunta ${qi + 1} de ${qs.length}</span><span class="chip">${typeLabel[q.type] || 'Pregunta'}</span></div>
            <div class="qtext" id="qt-${qi}">${md(q.q)}</div>${choicesHtml(q, qi, true)}<div class="fb" aria-live="polite"></div></section>`).join('')}
          <div class="actions" id="exam-actions"><button class="btn" id="grade" type="button">${icon('check')}Corregir el simulacro</button><span class="hint" id="grade-hint"></span></div>
          <div class="exam-mobile-bar" id="mbar"><span class="txt" id="mbar-txt"></span><button class="btn sm" id="grade-m" type="button">Corregir</button></div>
        </div>
        <aside class="exam-side">
          <div class="card"><div class="stat"><span class="k">Tiempo</span><span class="timer" id="timer">00:00</span><span class="d">Orientativo, no limita</span></div></div>
          <div class="card"><div class="stat" style="margin-bottom:10px"><span class="k">Preguntas</span><span class="d" id="answered"></span></div>
            <nav class="exam-nav" aria-label="Ir a la pregunta">${qs.map((_, qi) => `<a href="#q-${qi}" data-q="${qi}">${qi + 1}</a>`).join('')}</nav>
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
      $$('.exam-nav a').forEach((a) => a.classList.toggle('answered', cur.picks[a.dataset.q] != null));
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
    $$('.exam-nav a').forEach((a) => on(a, 'click', (ev) => { ev.preventDefault(); $('#q-' + a.dataset.q).scrollIntoView({ behavior: 'smooth', block: 'start' }); }));

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
      const pts = right * 0.5, p = pct(right, qs.length);
      const C2 = 2 * Math.PI * 54;
      const tier = p >= 75 ? 'ok' : p >= 50 ? 'mid' : 'low';
      $('#exam-actions').remove(); $('#mbar').remove();
      $('#grade-s').remove();
      $('#exam-result').innerHTML = `<section class="card result-hero" style="margin-bottom:20px">
        <div class="ring ${tier}"><svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="54"/><circle class="val" cx="60" cy="60" r="54" stroke-dasharray="${C2}" stroke-dashoffset="${C2}"/></svg>
          <div class="label"><span class="pct">${fmtNum(pts)}</span><span class="sub">de 4 puntos</span></div></div>
        <div><h2>${right} de ${qs.length} correctas</h2>
          <p class="muted" style="margin:0">${p >= 75 ? 'Buen nivel para la parte tipo test.' : p >= 50 ? 'Aprobaría esta parte, pero hay margen: revisar las falladas.' : 'Conviene repasar los temas de las preguntas falladas y repetir.'}</p>
          <div class="meta-row"><span class="chip plain">${icon('clock')}${fmtTime(secs)}</span>${rec.improved && rec.prevBest != null ? `<span class="chip ok">${icon('award')}Nuevo mejor resultado</span>` : ''}${right < qs.length ? `<span class="chip warn">${icon('rotate')}${plural(qs.length - right, 'pregunta añadida', 'preguntas añadidas')} al repaso</span>` : ''}</div>
          <div class="actions">${random ? `<a class="btn" href="#/simulacro/aleatorio" id="again">${icon('shuffle')}Otro simulacro aleatorio</a>` : `<button class="btn" id="again" type="button">${icon('rotate')}Repetir</button>`}<a class="btn secondary" href="#/simulacros">Ver los simulacros</a>${right < qs.length ? `<a class="btn ghost" href="#/repaso">Ir al repaso</a>` : ''}</div>
        </div></section>`;
      on($('#again'), 'click', (ev) => { ev.preventDefault(); delete S.current[ck]; save(true); simulacroPage(n); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(() => requestAnimationFrame(() => { const v = $('#exam-result .ring .val'); if (v) v.style.strokeDashoffset = String(C2 * (1 - p / 100)); }));
      renderNav(currentKey);
    };
    on($('#grade'), 'click', grade);
    on($('#grade-m'), 'click', () => { if (!confirmArmed && Object.keys(cur.picks).length < qs.length) { $('#exam-actions').scrollIntoView({ behavior: 'smooth', block: 'center' }); } grade(); });
    on($('#grade-s'), 'click', () => { if (!confirmArmed && Object.keys(cur.picks).length < qs.length) $('#exam-actions').scrollIntoView({ behavior: 'smooth', block: 'center' }); grade(); });
  }

  // ---------- Exam info ----------
  function examPage() {
    const e = C.exam;
    const examDay = new Date(EXAM_DATE); examDay.setHours(0, 0, 0, 0);
    const days = Math.round((examDay - TODAY) / dayMs);
    render(`
      ${pageHead({ path: [['Examen final', '']], eyebrow: 'Evaluación', title: 'Examen final', lead: `${esc(e.label)} · ${esc(e.room)}`,
        meta: days > 0 ? `<span class="chip accent">${icon('clock')}Faltan ${plural(days, 'día', 'días')}</span>` : '' })}
      <div class="grid-4">
        <div class="card stat"><span class="k">Fecha</span><span class="v" style="font-size:1.15rem">${esc(e.label.split(',')[0])}</span><span class="d">${esc((e.label.split(',')[1] || '').trim())} h</span></div>
        <div class="card stat"><span class="k">Aula</span><span class="v" style="font-size:1.15rem">${esc(e.room)}</span></div>
        <div class="card stat"><span class="k">Peso</span><span class="v" style="font-size:1.15rem">${esc(e.weight)}</span></div>
        <div class="card stat"><span class="k">Nota mínima</span><span class="v" style="font-size:1.15rem">5 / 10</span><span class="d">${esc(e.minimum)}</span></div>
      </div>
      ${sectionHead('Estructura')}
      <div class="grid-2">${e.parts.map((p, i) => `<div class="card"><div class="card-top"><span class="icon-tile">${icon(i ? 'code' : 'check-square')}</span><span class="chip accent">${esc(p.points)}</span></div><h3>${esc(p.name)}</h3><p>${esc(p.detail)}</p>
        <div class="card-foot">${i ? '<a class="btn sm secondary" href="#/recursos">Practicar con los laboratorios</a>' : '<a class="btn sm secondary" href="#/simulacros">Hacer un simulacro</a>'}</div></div>`).join('')}</div>
      <div class="callout info">${icon('calendar')}<div><strong>Sesión de repaso.</strong> ${esc(e.review.label)} (sesión ${esc(e.review.session)}).</div></div>
      ${sectionHead('Simulacros de la parte tipo test', `<a href="#/simulacros">Todos ${icon('arrow-right')}</a>`)}
      <div class="grid">${E.map(examCard).join('')}${randomExamCard()}</div>
      ${sectionHead('Parte práctica')}
      <p class="lead" style="font-size:1rem">La mejor preparación para la parte práctica son los laboratorios: repetir cada uno desde el enunciado, sin consultar la solución, y compararlo después con ella.</p>
      ${labRows(C.labs)}`, 'Examen');
  }

  // ---------- Resources ----------
  function resourcesPage() {
    const s = C.coordinatorSite;
    render(`
      ${pageHead({ path: [['Laboratorios y recursos', '']], eyebrow: 'Recursos', title: 'Laboratorios y recursos', lead: 'Enunciados y soluciones de los laboratorios, documentación oficial de las tecnologías del curso y material complementario.' })}
      ${sectionHead('Laboratorios')}
      ${labRows(C.labs)}
      ${sectionHead('Documentación oficial')}
      <div class="grid-3">${C.docs.map((d) => `<div class="card"><h3>${esc(d.group)}</h3><div style="display:grid;gap:2px;margin-top:8px">${d.items.map(([t, u]) => `<a class="nav-link" style="padding:7px 8px;margin:0 -8px" href="${u}" target="_blank" rel="noopener"><span>${esc(t)}</span>${icon('external', 'muted')}</a>`).join('')}</div></div>`).join('')}</div>
      ${sectionHead('Sitio de estudio del coordinador')}
      <div class="card">
        <p>El coordinador de la asignatura mantiene un sitio de estudio con tarjetas de concepto, herramientas interactivas y preguntas de autoevaluación. Es un recurso complementario.</p>
        <div class="callout warn">${icon('alert')}<div><strong>Diferencias con lo trabajado en este grupo</strong><ul>${s.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div></div>
        <a class="btn secondary" href="${s.url}" target="_blank" rel="noopener">Abrir el sitio del coordinador ${icon('external')}</a>
      </div>`, 'Recursos');
  }

  // ---------- Progress ----------
  function progressPage() {
    const keys = Object.keys(Q).map(Number).sort((a, b) => a - b);
    const rows = keys.map((n) => {
      const r = S.quiz[n], total = r?.total || objective(Q[n].questions), p = r ? pct(r.best, total) : 0;
      return `<tr><td><a href="#/quiz/${n}"><strong>Quiz ${n}</strong></a> · ${esc(Q[n].title)}</td><td class="num">${r?.attempts || 0}</td><td class="num">${r ? `${r.last}/${total}` : '—'}</td><td class="num">${r ? `${r.best}/${total}` : '—'}</td><td style="min-width:120px">${r ? bar(p, p >= 70 ? 'ok' : '') : '<span class="muted">Sin empezar</span>'}</td><td class="num">${r?.at ? fmtShort(r.at) : '—'}</td></tr>`;
    }).join('');
    const exKeys = [...E.map((x) => String(x.n)), 'aleatorio'];
    const exRows = exKeys.map((k) => {
      const r = S.exam[k];
      return `<tr><td><a href="#/simulacro/${k}"><strong>${k === 'aleatorio' ? 'Simulacro aleatorio' : 'Simulacro ' + k}</strong></a></td><td class="num">${r?.attempts || 0}</td><td class="num">${r ? fmtNum(r.last * 0.5) : '—'}</td><td class="num">${r ? fmtNum(r.best * 0.5) : '—'}</td><td class="num">${r?.at ? fmtShort(r.at) : '—'}</td></tr>`;
    }).join('');
    render(`
      ${pageHead({ path: [['Progreso', '']], eyebrow: 'Seguimiento', title: 'Progreso', lead: 'Resultados guardados en este navegador. No se envían a ningún sitio ni cuentan para la evaluación: si se cambia de navegador o de dispositivo, se empieza de cero.' })}
      ${sectionHead('Guías teóricas')}
      <div class="grid-2">${BLOCKS.filter((b) => b.guide && G[b.guide]).map((b) => `<a class="card" href="#/guia/${b.guide}">${icon('arrow-right', 'go')}<h3>Guía del bloque ${b.roman}</h3><p>${guideRead(b.guide)} % de las secciones leídas</p><div style="margin-top:12px">${bar(guideRead(b.guide))}</div></a>`).join('')}</div>
      ${sectionHead('Quizzes')}
      <div class="table-wrap"><table><thead><tr><th>Quiz</th><th class="num">Intentos</th><th class="num">Último</th><th class="num">Mejor</th><th>Nivel</th><th class="num">Fecha</th></tr></thead><tbody>${rows}</tbody></table></div>
      ${sectionHead('Simulacros')}
      <div class="table-wrap"><table><thead><tr><th>Simulacro</th><th class="num">Intentos</th><th class="num">Último</th><th class="num">Mejor</th><th class="num">Fecha</th></tr></thead><tbody>${exRows}</tbody></table></div>
      ${sectionHead('Datos')}
      <div class="card" style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">
        <p style="margin:0;max-width:60ch">Borrar el progreso elimina resultados, quizzes a medias, lectura de las guías y la lista de repaso de este navegador. No se puede deshacer.</p>
        <button class="btn danger" id="reset" type="button">${icon('trash')}Borrar todo el progreso</button>
      </div>`, 'Progreso');
    on($('#reset'), 'click', () => {
      if (!confirm('¿Borrar todo el progreso guardado en este navegador? No se puede deshacer.')) return;
      for (const k of ['quiz', 'exam', 'wrong', 'guide', 'current']) S[k] = {};
      delete S.last; save(true);
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
    [['Examen final', '#/examen', 'fecha aula estructura parte tipo test practica nota minima peso'], ['Simulacros del examen', '#/simulacros', 'simulacro test aleatorio'],
      ['Quizzes por laboratorio', '#/quizzes', 'quiz autoevaluacion'], ['Repaso de errores', '#/repaso', 'falladas errores repasar'],
      ['Laboratorios y recursos', '#/recursos', 'laboratorio enunciado solucion documentacion mdn'], ['Progreso', '#/progreso', 'resultados borrar progreso estadisticas']]
      .forEach(([t, h, k]) => add({ type: 'page', title: t, sub: 'Página', href: h, text: k, ic: 'chevron' }));
    for (const gid of Object.keys(G)) {
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
    for (const s of SESSIONS) add({ type: 'session', title: `Sesión ${s.n}: ${s.title}`, sub: `Bloque ${s.block.roman} · ${s.date}`, href: `#/bloque/${s.block.id}`, text: s.lab || '', ic: 'calendar' });
    for (const l of C.labs) add({ type: 'lab', title: `${l.id} · ${l.title}`, sub: l.brief ? 'Enunciado en GitHub' : 'Próximamente', href: l.brief || '#/recursos', ext: !!l.brief, text: 'laboratorio', ic: 'code' });
    for (const d of C.docs) for (const [t, u] of d.items) add({ type: 'doc', title: t, sub: `Documentación · ${d.group}`, href: u, ext: true, text: '', ic: 'external' });
    for (const [id, e] of Object.entries(QI)) {
      const q = e.q;
      add({ type: 'question', title: plain(q.q), sub: e.quiz ? `Quiz ${e.quiz} · ${Q[e.quiz].title}` : `Simulacro ${e.exam}`, href: e.quiz ? `#/quiz/${e.quiz}` : `#/simulacro/${e.exam}`, text: plain([...(q.choices || []), q.why || ''].join(' ')), ic: 'check-square', id });
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
  function navigate(href) {
    if (location.hash === href) route(); else location.hash = href;
  }
  function route() {
    const raw = location.hash.replace(/^#\/?/, '');
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
      if (page === 'simulacro') return 'simulacros';
      return page;
    };
    currentKey = keyFor();
    renderNav(currentKey);
    if (!page) return home();
    switch (page) {
      case 'bloque': return blockPage(arg);
      case 'guia': currentGuide = arg; return guidePage(arg, a3);
      case 'quizzes': return quizzesPage();
      case 'quiz': return quizPage(arg);
      case 'simulacros': return simulacrosPage();
      case 'simulacro': return simulacroPage(arg);
      case 'repaso': return arg === 'practicar' ? reviewRun(a3) : reviewPage();
      case 'examen': return examPage();
      case 'recursos': return resourcesPage();
      case 'progreso': return progressPage();
      default: return notFound();
    }
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('pagehide', () => save(true));
  route();

  // Offline support: network first, cache as fallback (see sw.js).
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ }));
  }
})();
