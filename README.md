# G247 study site

Study site for **Web Application Programming (G247)**, CUNEF Universidad. It is shared by the
groups of both semesters, so it names no group and shows no calendar dates: the course is organised
by week and session, in the same order as the Canvas course. Students use it to prepare the final
exam: course map by week and session, the theory guides, ten practice quizzes (one per lab), three practice exams in the format of the
multiple-choice part, and links to the labs and official documentation.

Published with GitHub Pages: <https://vctorchamizo.github.io/cunef-web-programming-study/>

The site is in Spanish. Code, comments and repository documentation are in English.

## Structure

```text
site/                 everything that is published
  index.html          app shell (top bar, sidebar, search dialog, icon sprite)
  sw.js               offline support: network first, cached copy as fallback
  404.html            sends deep links (/quiz/1) back to the app, which restores the clean URL
  assets/             app.js (router, pages, quiz and practice-exam engines, search, progress),
                      styles.css (light and dark themes) and icon.svg
  data/
    course.js         weeks, sessions, labs, practices and links (hand-written, sources in comments)
    quizzes.js        GENERATED: quizzes 1-10 and practice exams
    guides.js         GENERATED: theory guides, converted from Markdown
    exercises.js      practical exercises: study mode and practical part of the practice exams
    practice-bank.js  register fixes and extra questions for the quizzes, the DOM and Context API
                      quizzes, and the composition of the six practice exams
.github/workflows/    syntax check and Pages deployment
```

Plain HTML, CSS and JavaScript: no build step, no dependencies, no CDN. Works opened directly from
disk and on GitHub Pages.

## What students get

- **Home**: "continue where you left off", the course map, progress summary and the three blocks.
- **Course map**: every week with its sessions, lab and reference links, as in Canvas, and the two
  practices.
- **Guides**: table of contents that follows the reading, copy buttons and
  language labels on code, links to each section, search, print-friendly layout.
- **Quizzes**: one question at a time with immediate feedback, keyboard shortcuts (A-D, Enter),
  resume after leaving, results with a full review and "retry only the failed ones".
- **Practice exams**: six fixed ones and a random one, each with 8 quiz questions (4 points) and
  3 practical exercises (6 points), question navigator, indicative timer, automatic grading of the
  test and rubric-based self-assessment of the practical part, for an indicative grade out of 10.
- **Practical exercises**: 21 short exercises, at least six per block, (fix, complete, connect, explain) with two progressive
  hints, the reference solution on request and a rubric for self-assessment out of 10.
- **Error review**: every failed question is kept until it is answered correctly anywhere.
- **Search** (`Ctrl K`, `⌘ K` or `/`) across guide sections, questions, sessions, labs and docs.
- **Progress** page, light and dark themes, mobile layout, offline support.

Progress is stored only in the browser's `localStorage` (key `g247-study-v2`; best scores from the
first version, `g247-progress`, are migrated).

## Where the content comes from

`site/data/quizzes.js` and `site/data/guides.js` are **generated, never edited by hand**. They are
built in the course corpus (`cunef/01-asignaturas/03-evaluacion/examenes/preparacion/`) with
`scripts/build-site.cjs`, from:

- the theory guides of blocks I and II written for this group;
- quizzes 1-3 by the course coordinator, Alberto Turégano, translated into Spanish;
- quizzes 4-10 and the practice exams, selected from the question bank of the coordinator's study
  site and filtered to what this group was taught.

The coordinator's material is used with his permission. To update the content, regenerate it there
and copy `sitio/data/*.js` into `site/data/`.

The block III guide in `guides.js` was converted without pandoc, which was not available, with an
equivalent converter (same header ids and `sourceCode` blocks). When the content is regenerated with
`build-site.cjs`, block III must be added to its list of guides so it is not lost.

`site/data/exercises.js` and `site/data/practice-bank.js` are hand-written here as well. Every
practice exam is built only from quiz questions (8, by id, 3/2/3 by block) and practical exercises
(3, by id), as listed in `SIMULACROS`; the `EXAMS` of the generated `quizzes.js` are no longer used.
The review pack in `cunef/01-asignaturas/03-evaluacion/examenes/revision-coordinador/` is exported
from these files.

`site/data/course.js` is hand-written in this repository (weeks, sessions, labs, links, quiz
placeholders). Copy it back to `sitio/data/` in the corpus before regenerating, so the two stay equal.

### Data contract for new content

**Quizzes without a lab.** A quiz is keyed by its lab number (`"1"` to `"10"`) or, when there is no
lab, by a word. Two are already announced in `course.js` (`quizMeta` and the `quizzes` list of each
block) and show as "Próximamente" until `quizzes.js` contains them under the same key:

```js
window.QUIZZES.dom = {           // also: window.QUIZZES.context (Context API, session 37)
  title: 'Manipulación del DOM',
  lab: null,                      // no lab: the site shows "Sin laboratorio"
  sessions: '10-11',
  questions: [ /* same question format as quizzes 1-10: mc, tf, fib, essay */ ],
};
```

**Practical part of the practice exams.** Each entry of `window.EXAMS` may carry `practical`, an
array of exercises worth 6 points in total. The test part keeps working as before; with `practical`
the exam page adds the exercises, a code box for each one and, after grading, the reference
solution with a rubric the student ticks to get an indicative grade out of 10. The random practice
exam takes one exercise of each `kind` from all the practice exams.

```js
practical: [
  {
    id: 's1-js',                  // unique across all practice exams
    kind: 'js',                   // 'js' | 'react' | 'express'
    title: 'Triplicar los impares',
    points: 2,
    statement: 'Markdown: text, `code` and fenced code blocks.',
    starter: '// Código de partida que aparece en el recuadro\n',
    model: 'Markdown with the reference solution, usually a fenced code block.',
    rubric: [                     // a string, or { text, points }; strings share the remaining points
      { text: 'Recorre el array con `filter` y `map`', points: 1 },
      'Devuelve un array nuevo sin modificar el original',
    ],
  },
]
```

The reference exams in `cunef/.../examenes/referencia/` are for internal use only and must not be
published: practical exercises have to be original, with the same format and difficulty.

## Preview locally

```bash
cd site && python3 -m http.server 8080   # http://localhost:8080
```

## Deployment

Every push to `main` runs `.github/workflows/pages.yml`: a syntax check of the JavaScript, then the
upload of `site/` to GitHub Pages. Pages must be configured with "GitHub Actions" as its source.

## Ownership

Local changes (code, content, documentation) are made by Cowork; remote operations (repository
creation, pushes, Pages settings) by Claude Code. Every commit and every publication needs the
explicit approval of the teacher, Víctor Chamizo. See `cunef-project/CLAUDE.md` §2 and §4.
