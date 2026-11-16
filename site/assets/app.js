'use strict';
(() => {
  const C = window.COURSE, Q = window.QUIZZES || {}, E = window.EXAMS || [], G = window.GUIDES || {};
  const main = document.getElementById('main');
  const LETTERS = 'ABCDEF';

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // Markdown used by the questions: fenced code blocks, `code`, **bold**, *italic*, line breaks.
  function inline(s) {
    return String(s).split('`').map((part, i) => {
      if (i % 2) return '<code>' + esc(part) + '</code>';
      return esc(part).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>').replace(/\n/g, '<br>');
    }).join('');
  }
  function md(s) {
    return String(s).split(/```[a-z]*\n([\s\S]*?)```/).map((chunk, i) => (i % 2 ? '<pre><code>' + esc(chunk.replace(/\n$/, '')) + '</code></pre>' : inline(chunk.replace(/^\n+|\n+$/g, '')))).join('');
  }
  const objective = (qs) => qs.filter((q) => q.type !== 'essay').length;
  const norm = (s) => String(s).trim().toLowerCase();
  const store = {
    get() { try { return JSON.parse(localStorage.getItem('g247-progress') || '{}'); } catch { return {}; } },
    set(key, value) { try { const p = store.get(); p[key] = value; localStorage.setItem('g247-progress', JSON.stringify(p)); } catch { /* storage unavailable */ } },
  };
  const setTitle = (t) => { document.title = t ? t + ' · G247' : 'G247 · Sitio de estudio'; };
  function render(html, title) { main.innerHTML = html; setTitle(title); window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
  function quizMeta(n) {
    for (const b of C.blocks) if (b.quizzes.includes(n)) return b;
    return null;
  }
  const best = (key, total) => { const v = store.get()[key]; return v == null ? '' : `<span class="pill done">Mejor resultado: ${v}/${total}</span>`; };

  // ---------- pages ----------
  function home() {
    const examDate = new Date(C.exam.date), days = Math.ceil((examDate - new Date()) / 86400000);
    const quizCount = Object.keys(Q).length;
    render(`
      <p class="eyebrow">${esc(C.code)} · ${esc(C.group)}</p>
      <h1>Sitio de estudio de ${esc(C.title)}</h1>
      <p class="lead">Material de repaso de la asignatura, organizado por bloques: guías teóricas, quizzes de autoevaluación por laboratorio, simulacros de la parte tipo test del examen y enlaces a los laboratorios.</p>
      <div class="countdown">
        <div><div class="eyebrow">Examen final</div><div>${esc(C.exam.label)} · ${esc(C.exam.room)}</div></div>
        <div>${days > 0 ? `<strong>${days}</strong> días` : '<strong>Examen</strong>'}</div>
      </div>
      <h2>Bloques</h2>
      <div class="grid">
        ${C.blocks.map((b) => `<a class="card" href="#/bloque/${b.id}"><p class="eyebrow">Bloque ${b.roman} · ${esc(b.weeks)}</p><h3>${esc(b.title)}</h3><p>${esc(b.subtitle)}</p></a>`).join('')}
      </div>
      <h2>Preparación del examen</h2>
      <div class="grid">
        <a class="card" href="#/quizzes"><h3>Quizzes</h3><p>${quizCount} quizzes, uno por laboratorio, con corrección y explicación inmediatas.</p></a>
        <a class="card" href="#/examen"><h3>Simulacros</h3><p>${E.length} simulacros con el formato de la parte tipo test: 8 preguntas de 0,5 puntos.</p></a>
        <a class="card" href="#/guia/I"><h3>Guías teóricas</h3><p>Guías completas de los bloques I y II, con ejemplos y errores habituales.</p></a>
        <a class="card" href="#/recursos"><h3>Recursos</h3><p>Laboratorios, documentación oficial y material complementario.</p></a>
      </div>`, '');
  }

  function block(id) {
    const b = C.blocks.find((x) => String(x.id) === id);
    if (!b) return notFound();
    const labs = C.labs.filter((l) => b.sessions.some((s) => s.lab === l.id));
    render(`
      <p class="eyebrow">Bloque ${b.roman} · ${esc(b.weeks)}</p>
      <h1>${esc(b.title)}</h1>
      <p class="lead">${esc(b.subtitle)}</p>
      ${b.notes ? `<div class="note"><strong>Criterios de este curso</strong><ul>${b.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>` : ''}
      <h2>Guía teórica</h2>
      ${b.guide && G[b.guide] ? `<p><a class="btn" href="#/guia/${b.guide}">Abrir la guía del bloque ${b.roman}</a></p>` : '<p class="pill soon">Guía en preparación</p>'}
      <h2>Sesiones</h2>
      <div class="table-wrap"><table><thead><tr><th>Sesión</th><th>Fecha</th><th>Contenido</th></tr></thead><tbody>
        ${b.sessions.map((s) => `<tr><td>${esc(s.n)}</td><td>${esc(s.date)}</td><td>${esc(s.title)}</td></tr>`).join('')}
      </tbody></table></div>
      <h2>Quizzes del bloque</h2>
      <div class="grid">${b.quizzes.map(quizCard).join('')}</div>
      <h2>Laboratorios</h2>
      ${labsTable(labs)}`, 'Bloque ' + b.roman);
  }

  function quizCard(n) {
    const q = Q[n];
    if (!q) return `<div class="card"><p class="eyebrow">Quiz ${n}</p><h3>Disponible próximamente</h3><p>Quiz del laboratorio L${n}.</p></div>`;
    const essays = q.questions.length - objective(q.questions);
    return `<a class="card" href="#/quiz/${n}"><p class="eyebrow">Quiz ${n} · ${esc(q.lab)}</p><h3>${esc(q.title)}</h3><p>${q.questions.length} preguntas${essays ? ` (${essays} de programar)` : ''} · sesiones ${esc(q.sessions)}</p>${best('quiz-' + n, objective(q.questions))}</a>`;
  }

  function labsTable(labs) {
    return `<div class="table-wrap"><table><thead><tr><th>Laboratorio</th><th>Enunciado</th><th>Solución</th></tr></thead><tbody>
      ${labs.map((l) => `<tr><td><strong>${l.id}</strong> · ${esc(l.title)}</td>
        <td>${l.brief ? `<a href="${l.brief}" target="_blank" rel="noopener">Abrir</a>` : '<span class="pill soon">Próximamente</span>'}</td>
        <td>${l.solutionUrl ? `<a href="${l.solutionUrl}" target="_blank" rel="noopener">Abrir</a>` : '<span class="pill">No publicada</span>'}</td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function guide(id) {
    const g = G[id];
    if (!g) return notFound();
    render(`
      <p class="eyebrow"><a href="#/bloque/${id === 'I' ? 1 : 2}">Bloque ${id}</a></p>
      <h1>Guía teórica del bloque ${id}</h1>
      <div class="guide-layout">
        <nav class="toc" aria-label="Índice">${g.toc.map((t) => `<a class="l${t.level}" href="#/guia/${id}/${t.id}">${esc(t.text)}</a>`).join('')}</nav>
        <article class="guide">${g.html}</article>
      </div>`, 'Guía del bloque ' + id);
  }

  function quizzesPage() {
    render(`
      <h1>Quizzes</h1>
      <p class="lead">Un quiz por laboratorio. Cada pregunta se corrige al momento y muestra la explicación de la respuesta correcta.</p>
      ${C.blocks.map((b) => `<h2>Bloque ${b.roman} · ${esc(b.title)}</h2><div class="grid">${b.quizzes.map(quizCard).join('')}</div>`).join('')}
      <h2>Simulacros del examen</h2>
      <div class="grid">${E.map(examCard).join('')}</div>`, 'Quizzes');
  }

  function examCard(x) {
    return `<a class="card" href="#/simulacro/${x.n}"><p class="eyebrow">Simulacro ${x.n}</p><h3>Parte tipo test</h3><p>${x.questions.length} preguntas · 0,5 puntos cada una</p>${best('simulacro-' + x.n, x.questions.length)}</a>`;
  }

  function choiceButtons(q, qi) {
    return `<div class="choices" role="group">${q.choices.map((c, i) => `<button class="choice" data-q="${qi}" data-i="${i}"><span class="letter">${LETTERS[i]}</span><span>${md(c)}</span></button>`).join('')}</div>`;
  }

  // Practice quiz: one question at a time, immediate feedback.
  function quiz(n) {
    const quiz = Q[n];
    if (!quiz) return notFound();
    const b = quizMeta(Number(n));
    let i = 0, right = 0;
    const show = () => {
      const q = quiz.questions[i];
      let body;
      if (q.type === 'fib') body = `<div class="actions"><input class="fib" id="fib" type="text" autocomplete="off" spellcheck="false" aria-label="Respuesta"><button class="btn" id="check">Comprobar</button></div>`;
      else if (q.type === 'essay') body = `<p class="pill">Ejercicio de programación: se resuelve en la consola del navegador y no suma al resultado</p><div class="actions"><button class="btn" id="reveal">Ver la solución</button></div>`;
      else body = choiceButtons(q, i);
      render(`
        <p class="eyebrow"><a href="#/bloque/${b.id}">Bloque ${b.roman}</a> · Quiz ${n} · ${esc(quiz.lab)}</p>
        <h1>${esc(quiz.title)}</h1>
        <div class="progress" aria-hidden="true"><span style="width:${(i / quiz.questions.length) * 100}%"></span></div>
        <section class="question">
          <div class="qnum">Pregunta ${i + 1} de ${quiz.questions.length}</div>
          <div class="qtext">${md(q.q)}</div>
          ${body}
          <div id="fb"></div>
        </section>`, 'Quiz ' + n);
      main.querySelectorAll('.choice').forEach((btn) => btn.addEventListener('click', () => answer(Number(btn.dataset.i))));
      const fib = main.querySelector('#fib');
      if (fib) {
        const check = () => { if (fib.value.trim()) answer(fib.value); };
        main.querySelector('#check').addEventListener('click', check);
        fib.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
        fib.focus();
      }
      const reveal = main.querySelector('#reveal');
      if (reveal) reveal.addEventListener('click', () => answer(null));
    };
    const answer = (pick) => {
      const q = quiz.questions[i];
      let ok = null, html;
      if (q.type === 'essay') {
        main.querySelector('#reveal').remove();
        html = `<div class="feedback"><strong>Solución de referencia.</strong>${md(q.model)}${quiz.rubric ? `<p><strong>Criterio de corrección:</strong></p><ul>${quiz.rubric.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}</div>`;
      } else if (q.type === 'fib') {
        ok = q.accept.map(norm).includes(norm(pick));
        main.querySelector('#fib').disabled = true; main.querySelector('#check').disabled = true;
        html = `<div class="feedback ${ok ? 'ok' : 'ko'}"><strong>${ok ? 'Correcto.' : 'Incorrecto.'}</strong> Respuesta: <code>${esc(q.accept[0])}</code>. ${md(q.why || '')}</div>`;
      } else {
        ok = pick === q.answer;
        main.querySelectorAll('.choice').forEach((btn) => {
          const k = Number(btn.dataset.i);
          btn.disabled = true;
          if (k === q.answer) btn.classList.add('correct');
          else if (k === pick) btn.classList.add('wrong');
        });
        html = `<div class="feedback ${ok ? 'ok' : 'ko'}"><strong>${ok ? 'Correcto.' : 'Incorrecto.'}</strong> ${md(q.why)}</div>`;
      }
      if (ok) right++;
      const last = i === quiz.questions.length - 1;
      main.querySelector('#fb').innerHTML = html + `<div class="actions"><button class="btn" id="next">${last ? 'Ver resultado' : 'Siguiente'}</button></div>`;
      const next = main.querySelector('#next');
      next.focus();
      next.addEventListener('click', () => { if (last) finish(); else { i++; show(); } });
    };
    const finish = () => {
      const total = objective(quiz.questions), prev = store.get()['quiz-' + n];
      if (prev == null || right > prev) store.set('quiz-' + n, right);
      render(`
        <p class="eyebrow">Quiz ${n} · ${esc(quiz.lab)}</p>
        <h1>${esc(quiz.title)}</h1>
        <p class="score">${right} / ${total}</p>
        <p>${right === total ? 'Todas las respuestas son correctas.' : 'Conviene repasar en la guía los conceptos de las preguntas falladas y volver a intentarlo.'}</p>
        <div class="actions"><a class="btn" href="#/quiz/${n}" id="again">Repetir el quiz</a><a class="btn secondary" href="#/quizzes">Volver a los quizzes</a></div>`, 'Quiz ' + n);
      main.querySelector('#again').addEventListener('click', (e) => { e.preventDefault(); i = 0; right = 0; show(); });
    };
    show();
  }

  // Practice exam: all questions, graded at the end, 0.5 points each, no penalty.
  function simulacro(n) {
    const x = E.find((e) => String(e.n) === n);
    if (!x) return notFound();
    const picks = new Array(x.questions.length).fill(null);
    render(`
      <p class="eyebrow"><a href="#/examen">Examen</a> · Simulacro ${n}</p>
      <h1>Simulacro ${n} · parte tipo test</h1>
      <p class="lead">${x.questions.length} preguntas de opción múltiple, 0,5 puntos cada una. Las respuestas incorrectas no descuentan. La corrección se muestra al terminar.</p>
      ${x.questions.map((q, qi) => `<section class="question" id="q${qi}"><div class="qnum">Pregunta ${qi + 1}</div><div class="qtext">${md(q.q)}</div>${choiceButtons(q, qi)}<div class="fb"></div></section>`).join('')}
      <div class="actions"><button class="btn" id="grade" disabled>Corregir</button><span class="pill" id="left"></span></div>
      <div id="result"></div>`, 'Simulacro ' + n);
    const grade = main.querySelector('#grade'), left = main.querySelector('#left');
    const update = () => { const missing = picks.filter((p) => p === null).length; grade.disabled = missing > 0; left.textContent = missing ? `Faltan ${missing} por responder` : 'Todo respondido'; };
    update();
    main.querySelectorAll('.choice').forEach((btn) => btn.addEventListener('click', () => {
      const qi = Number(btn.dataset.q), k = Number(btn.dataset.i);
      picks[qi] = k;
      main.querySelectorAll(`.choice[data-q="${qi}"]`).forEach((b2) => b2.classList.toggle('selected', Number(b2.dataset.i) === k));
      update();
    }));
    grade.addEventListener('click', () => {
      let right = 0;
      x.questions.forEach((q, qi) => {
        const ok = picks[qi] === q.answer;
        if (ok) right++;
        main.querySelectorAll(`.choice[data-q="${qi}"]`).forEach((b2) => {
          const k = Number(b2.dataset.i);
          b2.disabled = true; b2.classList.remove('selected');
          if (k === q.answer) b2.classList.add('correct'); else if (k === picks[qi]) b2.classList.add('wrong');
        });
        main.querySelector(`#q${qi} .fb`).innerHTML = `<div class="feedback ${ok ? 'ok' : 'ko'}"><strong>${ok ? 'Correcto.' : 'Incorrecto.'}</strong> ${md(q.why)}</div>`;
      });
      const prev = store.get()['simulacro-' + n];
      if (prev == null || right > prev) store.set('simulacro-' + n, right);
      grade.remove(); left.remove();
      const pts = (right * 0.5).toLocaleString('es-ES', { minimumFractionDigits: 1 });
      main.querySelector('#result').innerHTML = `<section class="card"><p class="eyebrow">Resultado</p><p class="score">${pts} / 4 puntos</p><p>${right} de ${x.questions.length} respuestas correctas.</p>
        <div class="actions"><a class="btn" href="#/examen">Otros simulacros</a></div></section>`;
      main.querySelector('#result').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function exam() {
    const e = C.exam;
    render(`
      <h1>Examen final</h1>
      <p class="lead">${esc(e.label)} · ${esc(e.room)}</p>
      <div class="table-wrap"><table><tbody>
        <tr><th>Peso</th><td>${esc(e.weight)}</td></tr>
        <tr><th>Nota mínima</th><td>${esc(e.minimum)}</td></tr>
        ${e.parts.map((p) => `<tr><th>${esc(p.name)}</th><td><strong>${esc(p.points)}</strong>. ${esc(p.detail)}</td></tr>`).join('')}
        <tr><th>Repaso</th><td>${esc(e.review.label)} (sesión ${e.review.session})</td></tr>
      </tbody></table></div>
      <h2>Simulacros de la parte tipo test</h2>
      <p>Cada simulacro reproduce el formato de la parte tipo test: 8 preguntas de los tres bloques, 0,5 puntos cada una y sin penalización. La corrección se muestra al terminar.</p>
      <div class="grid">${E.map(examCard).join('')}</div>
      <h2>Parte práctica</h2>
      <p>La mejor preparación para la parte práctica son los laboratorios: repetir cada uno desde el enunciado, sin consultar la solución, y compararlo después con ella.</p>
      ${labsTable(C.labs)}`, 'Examen');
  }

  function resources() {
    const s = C.coordinatorSite;
    render(`
      <h1>Recursos</h1>
      <h2>Laboratorios</h2>
      ${labsTable(C.labs)}
      <h2>Documentación oficial</h2>
      <div class="grid">${C.docs.map((d) => `<div class="card"><h3>${esc(d.group)}</h3><p>${d.items.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join('<br>')}</p></div>`).join('')}</div>
      <h2>Sitio de estudio del coordinador</h2>
      <p>El coordinador de la asignatura mantiene un sitio de estudio con tarjetas de concepto, herramientas interactivas y preguntas de autoevaluación: <a href="${s.url}" target="_blank" rel="noopener">${esc(s.url)}</a>. Es un recurso complementario. Antes de usarlo, conviene tener en cuenta estas diferencias con lo trabajado en este grupo:</p>
      <div class="note"><ul>${s.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>`, 'Recursos');
  }

  function notFound() {
    render('<h1>Página no encontrada</h1><p><a href="#/">Volver al inicio</a></p>', 'No encontrada');
  }

  // ---------- router ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('active', location.hash.startsWith(a.getAttribute('href'))));
    const [page, arg, anchor] = parts;
    if (!page) return home();
    if (page === 'bloque') return block(arg);
    if (page === 'guia') {
      if (main.dataset.guide !== arg) { guide(arg); main.dataset.guide = arg; }
      if (anchor) { const el = document.getElementById(decodeURIComponent(anchor)); if (el) el.scrollIntoView(); }
      return;
    }
    main.dataset.guide = '';
    if (page === 'quizzes') return quizzesPage();
    if (page === 'quiz') return quiz(arg);
    if (page === 'simulacro') return simulacro(arg);
    if (page === 'examen') return exam();
    if (page === 'recursos') return resources();
    return notFound();
  }
  window.addEventListener('hashchange', route);
  route();
})();
