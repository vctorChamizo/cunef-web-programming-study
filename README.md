# G247 study site

Study site for **Web Application Programming (G247)**, group IACD-A, CUNEF Universidad, 2026-27.
Students use it to prepare the final exam: course map by block and session, the theory guides of
blocks I and II, ten practice quizzes (one per lab), three practice exams in the format of the
multiple-choice part, and links to the labs and official documentation.

Published with GitHub Pages: <https://vctorchamizo.github.io/cunef-web-programming-study/>

The site is in Spanish. Code, comments and repository documentation are in English.

## Structure

```text
site/                 everything that is published
  index.html
  assets/             app.js (hash router, quiz engine) and styles.css
  data/
    course.js         course map, exam facts, labs and links (hand-written, sources in comments)
    quizzes.js        GENERATED: quizzes 1-10 and practice exams
    guides.js         GENERATED: theory guides of blocks I and II, converted from Markdown
.github/workflows/    syntax check and Pages deployment
```

Plain HTML, CSS and JavaScript: no build step, no dependencies, no CDN. Progress is stored in the
browser's `localStorage`. Works opened directly from disk and on GitHub Pages.

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
