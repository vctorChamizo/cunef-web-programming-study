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
  assets/             app.js (router, pages, quiz and practice-exam engines, search, progress),
                      styles.css (light and dark themes) and icon.svg
  data/
    course.js         weeks, sessions, labs, practices and links (hand-written, sources in comments)
    quizzes.js        GENERATED: quizzes 1-10 and practice exams
    guides.js         GENERATED: theory guides, converted from Markdown
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
- **Practice exams**: the three fixed ones plus a random one (3 + 3 + 2 questions from blocks I, II
  and III), question navigator, indicative timer, grade out of 4.
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
