// English version of the quizzes (quizzes 1-3: the coordinator's English originals; 4-10: the English
// version of the coordinator's site bank). Canonical in this repository: any change to the Spanish
// quizzes must be carried over here by hand.
'use strict';
window.QUIZZES = {
 "1": {
  "title": "Structuring an HTML page",
  "lab": "L1",
  "sessions": "1-3",
  "origin": "coordinador",
  "questions": [
   {
    "id": "c1-01",
    "type": "mc",
    "q": "Which element should wrap the **primary, unique content** of the page?",
    "choices": [
     "`<header>`",
     "`<main>`",
     "`<section>`",
     "`<footer>`"
    ],
    "answer": 1,
    "why": "`<main>` is the landmark for the page's core content — exactly one per page."
   },
   {
    "id": "c1-02",
    "type": "mc",
    "q": "Which line correctly starts an HTML5 document?",
    "choices": [
     "`<!DOCTYPE html5>`",
     "`<!DOCTYPE html>`",
     "`<doctype html>`",
     "`<?xml version=\"1.0\"?>`"
    ],
    "answer": 1,
    "why": "`<!DOCTYPE html>` must be at the start of the file (only comments or blank lines may precede it): it tells the browser to use standards mode."
   },
   {
    "id": "c1-03",
    "type": "mc",
    "q": "Inside one of your `<section>`s you place a news post that **would make sense on its own** if shared elsewhere (e.g. syndicated). Which element is the correct choice?",
    "choices": [
     "`<div>`",
     "`<span>`",
     "`<article>`",
     "`<aside>`"
    ],
    "answer": 2,
    "why": "`<article>` is for self-contained, independently distributable content."
   },
   {
    "id": "c1-04",
    "type": "mc",
    "q": "Which heading sequence **violates** the course rule about heading order?",
    "choices": [
     "`<h1>` → `<h2>` → `<h3>`",
     "`<h1>` → `<h2>` → `<h2>`",
     "`<h1>` → `<h3>`",
     "`<h1>` → `<h2>` → `<h3>` → `<h4>`"
    ],
    "answer": 2,
    "why": "Heading levels must never skip. Going straight from `<h1>` to `<h3>` breaks the document outline."
   },
   {
    "id": "c1-05",
    "type": "mc",
    "q": "Which set of attributes is **required on every `<img>`** in this course?",
    "choices": [
     "`href`, `src`, `alt`",
     "`alt`, `width`, `height`",
     "`src`, `title`, `lang`",
     "`alt`, `class`, `id`"
    ],
    "answer": 1,
    "why": "Every image needs `alt` (accessibility), plus `width` and `height` so the browser can reserve space before the image loads."
   },
   {
    "id": "c1-06",
    "type": "mc",
    "q": "On your login page, how do you correctly bind a `<label>` to the email `<input>`?",
    "choices": [
     "`<label for=\"email\">…</label> <input type=\"email\" id=\"email\">`",
     "`<label to=\"email\">…</label> <input type=\"email\" name=\"email\">`",
     "`<label id=\"email\">…</label> <input type=\"email\" for=\"email\">`",
     "`<label>…</label> <!-- binding is impossible -->`"
    ],
    "answer": 0,
    "why": "The label's `for` attribute must equal the input's `id`."
   },
   {
    "id": "c1-07",
    "type": "mc",
    "q": "What does `<a href=\"fixtures.html#results\">` do?",
    "choices": [
     "Jumps to an element with `id=\"results\"` on the **current** page",
     "Opens `fixtures.html` and jumps to its `id=\"results\"` section",
     "Links to an external site called `results.fixtures.html`",
     "It is invalid HTML"
    ],
    "answer": 1,
    "why": "This is a **file + fragment** link: a relative URL to a sibling page plus the `#` fragment of a section inside it."
   },
   {
    "id": "c1-08",
    "type": "tf",
    "q": "A page without styles, but with a correct structure that passes the W3C Markup Validator without errors, meets what the HTML structure lab asks for.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 0,
    "why": "At this stage the structure is what is assessed. A valid skeleton without styles is exactly what is expected; styles come later."
   },
   {
    "id": "c1-09",
    "type": "mc",
    "q": "Which attribute adds **supplementary text** that appears when hovering over an element?",
    "choices": [
     "`alt`",
     "`placeholder`",
     "`title`",
     "`lang`"
    ],
    "answer": 2,
    "why": "`title` provides supplementary text shown on hover; keyboard and touch-screen users do not see it, so it must not contain essential information. `alt` is only for images and describes them."
   },
   {
    "id": "c1-10",
    "type": "tf",
    "q": "A front-end-only HTML login form needs an `action` attribute so that clicking *Sign in* actually logs the user in.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1,
    "why": "Before real authentication exists, the form can legitimately have no `action` and submit nowhere — the structure is the deliverable; the server side comes later in the course."
   },
   {
    "id": "c1-11",
    "type": "mc",
    "q": "You want to credit the authors at the top of your HTML file **without** the text appearing on the page. Which syntax is correct?",
    "choices": [
     "`// Ana & Luis`",
     "`<!-- Ana & Luis -->`",
     "`/* Ana & Luis */`",
     "`<comment>Ana & Luis</comment>`"
    ],
    "answer": 1,
    "why": "HTML comments use `<!-- … -->`; the browser hides them but anyone viewing source can read them."
   },
   {
    "id": "c1-12",
    "type": "mc",
    "q": "Which of these is an **inline** element — one that flows inside running text?",
    "choices": [
     "`<p>`",
     "`<section>`",
     "`<span>`",
     "`<header>`"
    ],
    "answer": 2,
    "why": "`<span>` (like `<a>`, `<em>`, `<strong>`) sits inside a line of text; `<p>`, `<section>` and `<header>` are block-level and start on new lines."
   },
   {
    "id": "c1-13",
    "type": "mc",
    "q": "In a multi-page site stored in one folder, which `href` links from `index.html` to the sibling page `squad.html`?",
    "choices": [
     "`href=\"https://squad.html\"`",
     "`href=\"squad.html\"`",
     "`href=\"#squad.html\"`",
     "`href=\"file://squad.html\"`"
    ],
    "answer": 1,
    "why": "A plain relative URL points at the sibling file. `#…` is a fragment on the same page; `https://…` treats the filename as a domain."
   },
   {
    "id": "c1-14",
    "type": "mc",
    "q": "Which set of controls makes a correct semantic sign-in form?",
    "choices": [
     "`<input type=\"text\">` ×2, `<div>Sign in</div>`",
     "`<input type=\"email\">`, `<input type=\"password\">`, `<button type=\"submit\">Sign in</button>`",
     "`<input type=\"mail\">`, `<input type=\"secret\">`, `<submit>`",
     "`<form type=\"login\">`, `<button action=\"submit\">`"
    ],
    "answer": 1,
    "why": "Typed inputs (`email`, `password`) plus a real submit `<button>` — each wrapped in a `<form>` with `<label>`s."
   },
   {
    "id": "c1-15",
    "type": "mc",
    "q": "Which pair of attributes gets the browser to validate a form **before** submission?",
    "choices": [
     "`checked` and `selected`",
     "`validate` and `validate-on=\"submit\"`",
     "`required` and `minlength`",
     "`novalidate` and `pattern-required`"
    ],
    "answer": 2,
    "why": "`required` blocks empty fields; `minlength` enforces a minimum length — both are plain HTML validation attributes."
   },
   {
    "id": "c1-16",
    "type": "mc",
    "q": "Where does the `<title>` element belong?",
    "choices": [
     "In the `<body>`, as the first element",
     "Inside `<main>`",
     "In the `<head>`",
     "Immediately after `</html>`"
    ],
    "answer": 2,
    "why": "`<title>` is document metadata — it lives in `<head>` and drives the browser-tab text and bookmarks."
   },
   {
    "id": "c1-17",
    "type": "mc",
    "q": "What is `<aside>` for?",
    "choices": [
     "The page's primary content",
     "Tangentially related content, such as a sidebar stat or a related link",
     "The site navigation",
     "Content hidden from the browser"
    ],
    "answer": 1,
    "why": "`<aside>` holds content *related to but separable from* the main flow; hiding content is a CSS job, not an element's."
   },
   {
    "id": "c1-18",
    "type": "mc",
    "q": "A footer link should jump to the section with `id=\"tickets\"` **on the same page**. Which `href` does that?",
    "choices": [
     "`href=\"#tickets\"`",
     "`href=\"tickets\"`",
     "`href=\"/tickets\"`",
     "`href=\"page#tickets.html\"`"
    ],
    "answer": 0,
    "why": "`#tickets` is an on-page fragment link — `href` plus the target element's `id`."
   },
   {
    "id": "c1-19",
    "type": "mc",
    "q": "How many `<h1>` elements should a correctly structured page have?",
    "choices": [
     "One per `<section>`",
     "Exactly one",
     "Any number — headings are decorative",
     "At least two, for SEO"
    ],
    "answer": 1,
    "why": "One `<h1>` names the page; sections then use `<h2>`, nested content `<h3>`, and so on without skipping levels."
   },
   {
    "id": "c1-20",
    "type": "mc",
    "q": "Which attribute on `<img>` points to the image **file** to load?",
    "choices": [
     "`alt`",
     "`href`",
     "`src`",
     "`link`"
    ],
    "answer": 2,
    "why": "`src` carries the file path (only `<a>` uses `href`); `alt` describes the image for screen readers and broken loads."
   },
   {
    "id": "c1-21",
    "type": "fib",
    "q": "The `<html>` element declares the page's language using the `______` attribute (e.g. `\"en\"` or `\"es\"`).",
    "accept": [
     "lang"
    ],
    "why": "`lang` states the main language of the document."
   },
   {
    "id": "c1-22",
    "type": "fib",
    "q": "The attribute that provides alternative, screen-reader-friendly text for an image is `______`.",
    "accept": [
     "alt"
    ],
    "why": "`alt` describes the image when it cannot be seen."
   },
   {
    "id": "c1-23",
    "type": "fib",
    "q": "The destination of a hyperlink `<a>` is set with the `______` attribute.",
    "accept": [
     "href"
    ],
    "why": "`href` holds the destination URL."
   },
   {
    "id": "c1-24",
    "type": "fib",
    "q": "A bulleted (unordered) list is opened with the `<______>` tag.",
    "accept": [
     "ul",
     "<ul>"
    ],
    "why": "`<ul>` opens an unordered list; each item goes in an `<li>`."
   },
   {
    "id": "c1-25",
    "type": "fib",
    "q": "The online service used in this course to check HTML for markup errors is the `______` Markup Validator.",
    "accept": [
     "W3C"
    ],
    "why": "The W3C Markup Validator checks that the HTML is valid."
   }
  ]
 },
 "2": {
  "title": "Applying CSS",
  "lab": "L2",
  "sessions": "4-6",
  "origin": "coordinador",
  "questions": [
   {
    "id": "c2-01",
    "type": "mc",
    "q": "Why is `* { box-sizing: border-box; }` the first rule in almost every stylesheet?",
    "choices": [
     "It removes all margins from the page",
     "It makes `padding` and `border` count **inside** the declared `width`",
     "It disables the browser's default font",
     "It is required by the W3C validator"
    ],
    "answer": 1,
    "why": "With `border-box`, a `width: 300px` element stays 300px wide even after adding padding and borders — layouts become predictable."
   },
   {
    "id": "c2-02",
    "type": "mc",
    "q": "Which declaration turns a `<header>` into a one-dimensional flex row?",
    "choices": [
     "`display: block`",
     "`display: flex`",
     "`position: flex`",
     "`float: left`"
    ],
    "answer": 1,
    "why": "`display: flex` lays the header's children (title, `<nav>`) out in a row along the main axis."
   },
   {
    "id": "c2-03",
    "type": "mc",
    "q": "To push the site title to the far left of a flex header and the navigation to the far right, which property do you use?",
    "choices": [
     "`justify-content: space-between`",
     "`align-items: center`",
     "`text-align: justify`",
     "`gap: auto`"
    ],
    "answer": 0,
    "why": "On a flex container, `justify-content: space-between` pushes items to the extremes of the main axis. (`align-items: center` only controls cross-axis vertical alignment.)"
   },
   {
    "id": "c2-04",
    "type": "mc",
    "q": "A page needs `<main>` split into **two columns**: a wider articles area on the left and a narrower sidebar on the right. Which technique fits best?",
    "choices": [
     "Floats and clearfixes",
     "A table with two `<td>`s",
     "CSS Grid with `grid-template-columns`",
     "`position: absolute` on the `<aside>`"
    ],
    "answer": 2,
    "why": "Two-dimensional page-level layout (content + sidebar tracks) is exactly what Grid's `grid-template-columns` is for."
   },
   {
    "id": "c2-05",
    "type": "mc",
    "q": "What does this rule do?\n\n```css\n@media (max-width: 768px) {\n  main { grid-template-columns: 1fr; }\n}\n```",
    "choices": [
     "Makes the whole page unreadable below 768px",
     "Collapses the two-column grid to a single column on screens **up to** 768px wide",
     "Enlarges the sidebar on tablets",
     "Sets the minimum width of `main` to 768px"
    ],
    "answer": 1,
    "why": "`max-width: 768px` applies the enclosed rules to viewports **narrower than or equal to** 768px — the sidebar drops below the articles."
   },
   {
    "id": "c2-06",
    "type": "mc",
    "q": "Which pair of declarations stops an article image from overflowing its container?",
    "choices": [
     "`overflow: hidden; float: left;`",
     "`max-width: 100%; height: auto;`",
     "`width: fixed; height: fixed;`",
     "`display: none;`"
    ],
    "answer": 1,
    "why": "`max-width: 100%` caps the image at its container's width, and `height: auto` preserves the aspect ratio."
   },
   {
    "id": "c2-07",
    "type": "tf",
    "q": "When two rules conflict, the recommended fix is to add `!important` to the rule you want to win.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1,
    "why": "The correct fix is a selector of the **right specificity** — not `!important`, and not inline `style=\"\"` attributes. Reaching for `!important` is a sign the cascade wasn't understood."
   },
   {
    "id": "c2-08",
    "type": "mc",
    "q": "How do you attach an external stylesheet to a page?",
    "choices": [
     "`<style href=\"styles.css\">` in the `<body>`",
     "`<link rel=\"stylesheet\" href=\"styles.css\">` in the `<head>`",
     "`<script src=\"styles.css\">` in the `<head>`",
     "`<a href=\"styles.css\">` in the `<nav>`"
    ],
    "answer": 1,
    "why": "An external stylesheet is linked from the `<head>` with `<link rel=\"stylesheet\">`."
   },
   {
    "id": "c2-09",
    "type": "mc",
    "q": "A multi-page site (home, squad, tickets, login) shares one header, nav, and footer. How many stylesheets does it need, and why?",
    "choices": [
     "One per page, so each page can look different",
     "One per page, because browsers cannot cache shared files",
     "**One** shared `styles.css` linked from every page — the identical header/nav/footer are styled once and every page updates together",
     "None; styles belong in inline `style=\"\"` attributes"
    ],
    "answer": 2,
    "why": "A single external stylesheet reused across the whole site is the whole point of external styles — consistency maintained in one place."
   },
   {
    "id": "c2-10",
    "type": "mc",
    "q": "On a styled sign-in form, what is the purpose of an `input:focus { … }` rule?",
    "choices": [
     "It validates the email before submitting",
     "It visibly highlights the field the user is currently typing in — a keyboard-accessibility win",
     "It prevents the user from leaving the field empty",
     "It bolds the label above the input"
    ],
    "answer": 1,
    "why": "A visible focus style lets keyboard users see which control is active; it is an accessibility feature, not decoration."
   },
   {
    "id": "c2-11",
    "type": "mc",
    "q": "In the CSS box model, what is `padding`?",
    "choices": [
     "The space outside the border, separating neighboring elements",
     "The space **between the content and the border**, inside the element",
     "The thickness of the border itself",
     "The text size inside the box"
    ],
    "answer": 1,
    "why": "Padding is inner breathing room (content → padding → border → margin)."
   },
   {
    "id": "c2-12",
    "type": "mc",
    "q": "A sign-in card should be centered on the page with `max-width: 420px`. Which declaration centers it horizontally?",
    "choices": [
     "`text-align: center`",
     "`margin: 0 auto`",
     "`align: middle`",
     "`float: center`"
    ],
    "answer": 1,
    "why": "With a constrained width, auto left/right margins center a block element. (`text-align: center` only centers the text *inside* it.)"
   },
   {
    "id": "c2-13",
    "type": "mc",
    "q": "A flex-row navigation needs equal space *between* its links without adding margins to each one. Which property does that on the container?",
    "choices": [
     "`gap`",
     "`word-spacing`",
     "`letter-spacing`",
     "`border-spacing`"
    ],
    "answer": 0,
    "why": "`gap` sets consistent spacing between flex (and grid) items directly on the container."
   },
   {
    "id": "c2-14",
    "type": "mc",
    "q": "What does `grid-template-columns: 2fr 1fr;` define?",
    "choices": [
     "Two rows, each one fraction tall",
     "Two columns — the first twice as wide as the second",
     "Two fixed-pixel columns",
     "Two `1fr`-sized gaps"
    ],
    "answer": 1,
    "why": "`fr` units split the available space proportionally: 2 fr for the left column, 1 fr for the sidebar."
   },
   {
    "id": "c2-15",
    "type": "mc",
    "q": "How do you remove the bullet points from the `<ul>` inside a navigation bar?",
    "choices": [
     "`text-decoration: none`",
     "`list-style: none`",
     "`display: no-bullets`",
     "Delete the `<ul>` tags"
    ],
    "answer": 1,
    "why": "`list-style: none` drops the markers; `text-decoration: none` removes link underlines instead."
   },
   {
    "id": "c2-16",
    "type": "mc",
    "q": "Both rules target the same element:\n\n```css\n.card-title { color: orange; }\n#featured   { color: navy; }\n```\n\nWhich color wins?",
    "choices": [
     "Orange — classes are more specific than ids",
     "Navy — an `#id` selector beats a `.class` selector",
     "Whichever appears first in the file",
     "Neither; the browser ignores the conflict"
    ],
    "answer": 1,
    "why": "Specificity order: inline > `#id` > `.class` > element. No `!important` needed."
   },
   {
    "id": "c2-17",
    "type": "mc",
    "q": "Cards are stacked and touching each other's borders. Which property adds space **outside** each card to separate them?",
    "choices": [
     "`padding`",
     "`margin`",
     "`border-width`",
     "`gap` — but only if the parent is `display: block`"
    ],
    "answer": 1,
    "why": "`margin` is the outer space; `padding` would grow each card inward instead. (`gap` works only on flex/grid parents.)"
   },
   {
    "id": "c2-18",
    "type": "mc",
    "q": "A submit button should change color while the mouse is over it. Which selector does that?",
    "choices": [
     "`button:hover { … }`",
     "`button:active:hovered { … }`",
     "`button hover: { … }`",
     "`button:focus { … }`"
    ],
    "answer": 0,
    "why": "`:hover` fires while the pointer is over the element; `:focus` fires for the keyboard/selection state; `:active` is while it's being pressed."
   },
   {
    "id": "c2-19",
    "type": "mc",
    "q": "Which declaration makes the mouse pointer turn into a hand over a clickable button?",
    "choices": [
     "`pointer: hand`",
     "`cursor: pointer`",
     "`mouse: hand`",
     "`cursor: hand-click`"
    ],
    "answer": 1,
    "why": "`cursor: pointer` is the standard hover-pointer declaration — a small usability detail the sign-in card is expected to have."
   },
   {
    "id": "c2-20",
    "type": "mc",
    "q": "How do you write a comment inside a CSS file?",
    "choices": [
     "`// comment`",
     "`<!-- comment -->`",
     "`/* comment */`",
     "`# comment`"
    ],
    "answer": 2,
    "why": "CSS comments are `/* … */`. `//` is JavaScript, `<!-- -->` is HTML, `#` is for scripts like YAML/shell."
   },
   {
    "id": "c2-21",
    "type": "fib",
    "q": "The CSS property that rounds the corners of cards is `______`.",
    "accept": [
     "border-radius"
    ],
    "why": "`border-radius` rounds the corners of the border."
   },
   {
    "id": "c2-22",
    "type": "fib",
    "q": "The pseudo-class `______` matches an element while the user's pointer is over it.",
    "accept": [
     "hover",
     ":hover"
    ],
    "why": "`:hover` applies when the pointer is over the element."
   },
   {
    "id": "c2-23",
    "type": "fib",
    "q": "To make `<main>` a grid container you write `display: ______;`.",
    "accept": [
     "grid"
    ],
    "why": "`display: grid` creates a Grid container."
   },
   {
    "id": "c2-24",
    "type": "fib",
    "q": "The property that switches `content-box` sizing so padding stays inside the width is `______` (just the property name).",
    "accept": [
     "box-sizing"
    ],
    "why": "`box-sizing: border-box` includes padding and border in the width."
   },
   {
    "id": "c2-25",
    "type": "fib",
    "q": "In `grid-template-columns: 2fr 1fr;`, the proportional unit is `______`.",
    "accept": [
     "fr"
    ],
    "why": "`fr` is a fraction of the available space."
   }
  ]
 },
 "3": {
  "title": "JavaScript Logic & Functions",
  "lab": "L3",
  "sessions": "7-9",
  "origin": "coordinador",
  "questions": [
   {
    "id": "c3-01",
    "type": "mc",
    "q": "Which of the following is a **function expression**?",
    "choices": [
     "`function greet(name) { return \"Hi \" + name; }`",
     "`const greet = function (name) { return \"Hi \" + name; };`",
     "`const greet = (name) => \"Hi \" + name;`",
     "`greet(name) => { return \"Hi \" + name; }`"
    ],
    "answer": 1,
    "why": "A function expression creates the function *inline as part of an expression* (typically assigned to a variable). A is a declaration, C is an arrow function, D is invalid syntax."
   },
   {
    "id": "c3-02",
    "type": "mc",
    "q": "Which arrow function correctly doubles a number?",
    "choices": [
     "`const double = x -> x * 2;`",
     "`const double = (x) => x * 2;`",
     "`const double => (x) x * 2;`",
     "`arrow double(x) { return x * 2; }`"
    ],
    "answer": 1,
    "why": "Arrow syntax is `params => body`; with a single expression the `return` is implicit. `->` is Java/C-style, not JavaScript."
   },
   {
    "id": "c3-03",
    "type": "mc",
    "q": "What is the difference between a **parameter** and an **argument**?",
    "choices": [
     "They are two names for the same thing",
     "A parameter is the value passed at call time; an argument is the variable in the definition",
     "A parameter is the variable listed in the function definition; an argument is the actual value passed when calling",
     "Parameters belong to arrow functions; arguments belong to declarations"
    ],
    "answer": 2,
    "why": "In `function square(n)` the parameter is `n`; in `square(5)` the argument is `5`."
   },
   {
    "id": "c3-04",
    "type": "mc",
    "q": "Given this function:\n\n```javascript\nfunction greet(name = \"friend\") {\n  return \"Hello, \" + name + \"!\";\n}\n```\n\nWhat does `greet()` return?",
    "choices": [
     "`\"Hello, !\"`",
     "`undefined`",
     "`\"Hello, friend!\"`",
     "It throws an error — no argument was passed"
    ],
    "answer": 2,
    "why": "The default parameter kicks in when the argument is missing, so the result is `\"Hello, friend!\"`."
   },
   {
    "id": "c3-05",
    "type": "tf",
    "q": "A function that finishes without executing any `return` statement returns `undefined`.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 0,
    "why": "`console.log` printing a value is **not** returning it — a function must `return` its value, not just log it."
   },
   {
    "id": "c3-06",
    "type": "mc",
    "q": "A function adds up the values of an array with a running total that starts at `0`. What does it return for the empty array `[]`?",
    "choices": [
     "`undefined`",
     "`0`",
     "`null`",
     "`\"empty\"`"
    ],
    "answer": 1,
    "why": "The running total starts at `0`, so summing no numbers yields `0`."
   },
   {
    "id": "c3-07",
    "type": "mc",
    "q": "Which HTML tag loads the external script `app.js` so that it runs **after the page's HTML is parsed**?",
    "choices": [
     "`<script src=\"app.js\" defer></script>`",
     "`<link rel=\"script\" href=\"app.js\">`",
     "`<js file=\"app.js\">`",
     "`<script src=\"app.js\" async=\"parse\">`"
    ],
    "answer": 0,
    "why": "`<script src=\"…\" defer></script>` placed in the `<head>` (or just before `</body>`) waits for parsing to finish before executing the script."
   },
   {
    "id": "c3-08",
    "type": "mc",
    "q": "What does the expression `n % 2` evaluate to for `const n = 7`?",
    "choices": [
     "`0`",
     "`1`",
     "`3.5`",
     "`\"odd\"`"
    ],
    "answer": 1,
    "why": "`%` is the remainder operator: 7 divided by 2 is 3 with a remainder of `1`. That is also why `n % 2 === 0` is the classic even-number test."
   },
   {
    "id": "c3-09",
    "type": "mc",
    "q": "What is the value of `total` after this code runs?\n\n```javascript\nlet total = 0;\nfor (let i = 1; i <= 4; i++) {\n  total += i;\n}\n```",
    "choices": [
     "`4`",
     "`6`",
     "`10`",
     "`undefined`"
    ],
    "answer": 2,
    "why": "The loop adds 1 + 2 + 3 + 4 = 10. This \"running total\" pattern — initialize, loop, accumulate, return — is how you write any summing function."
   },
   {
    "id": "c3-10",
    "type": "mc",
    "q": "You are validating a text field. Which condition is `true` exactly when `text` has **no characters at all**?",
    "choices": [
     "`text === \"\"`",
     "`text === 0`",
     "`text == null`",
     "`text.length === 1`"
    ],
    "answer": 0,
    "why": "An empty string is `\"\"` — its `length` is `0`. A number, `null`, and a one-character string are all different things; JavaScript will not coerce them the way you might hope."
   },
   {
    "id": "c3-11",
    "type": "mc",
    "q": "`isPalindrome(\"A man, a plan, a canal: Panama\")` must return `true`. What must the function do **before** comparing characters?",
    "choices": [
     "Reverse the string twice",
     "Lowercase it and strip spaces and punctuation",
     "Convert it to a number",
     "Nothing — compare it as-is"
    ],
    "answer": 1,
    "why": "Normalization (case-insensitive, ignoring spaces and punctuation) is the whole trick of a robust palindrome check."
   },
   {
    "id": "c3-12",
    "type": "mc",
    "q": "What does `console.assert(condition, \"message\")` print?",
    "choices": [
     "`\"message\"` every time it runs",
     "Nothing when the condition is true; an \"Assertion failed\" message when it is false",
     "The condition's value, always",
     "An error that stops the script"
    ],
    "answer": 1,
    "why": "That's why *a silent console means every assertion passed*."
   },
   {
    "id": "c3-13",
    "type": "essay",
    "q": "**Write a function `isEven(n)`** that returns `true` if `n` is divisible by 2 and `false` otherwise. Any of the three function syntaxes may be used (declaration, expression or arrow).\n\nTest the function in the Chrome DevTools console (`F12` → Console) and check it, for example, with:\n```javascript\nconsole.assert(isEven(4) === true, \"4 is even\");\nconsole.assert(isEven(7) === false, \"7 is odd\");\nconsole.assert(isEven(0) === true, \"0 is even\");\n```",
    "model": "```javascript\nfunction isEven(n) {\n  return n % 2 === 0;\n}\n```",
    "points": 2
   },
   {
    "id": "c3-14",
    "type": "essay",
    "q": "**Write a function `sumTo(n)`** that returns the sum of all integers from `1` to `n` using a **loop** (for example, `sumTo(4)` → `10`). Assume `n ≥ 1`.\n\nTest it in the console with at least three `console.assert` checks, including `sumTo(1) === 1`.",
    "model": "```javascript\nfunction sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}\n```",
    "points": 2
   },
   {
    "id": "c3-15",
    "type": "essay",
    "q": "**Write a function `countVowels(str)`** that returns how many vowels (`a`, `e`, `i`, `o`, `u`) the string contains, **ignoring case** (for example, `countVowels(\"Riverside\")` → `4`).\n\nTest it in the console with several `console.assert` checks. Hint: `str.toLowerCase()` and a loop over the characters are enough.",
    "model": "```javascript\nfunction countVowels(str) {\n  const vowels = \"aeiou\";\n  let count = 0;\n  for (const ch of str.toLowerCase()) {\n    if (vowels.includes(ch)) {\n      count++;\n    }\n  }\n  return count;\n}\n```",
    "points": 2
   }
  ],
  "rubric": ["0 points: there is no code or the code does not run.","1 point: it runs and is close, but has a logic error (for example, an off-by-one error or not ignoring case).","2 points: it is correct, returns the value (not only prints it) and includes the requested console.assert checks."]
 },
 "4": {
  "title": "Node.js and Express: routes and middleware",
  "lab": "L4",
  "sessions": "13-15",
  "questions": [
   {
    "id": "node-01",
    "type": "mc",
    "q": "Which statement about Node.js is correct?",
    "why": "Node is the environment (runtime) around the V8 engine. The language is plain JavaScript; Express is a framework that runs on Node.",
    "choices": [
     "It is a new programming language based on JavaScript",
     "It is a web framework, like Express",
     "It is a runtime that runs JavaScript outside the browser, built on the V8 engine",
     "It is a browser without a window"
    ],
    "answer": 2
   },
   {
    "id": "node-10",
    "type": "mc",
    "q": "Which line exports two functions from a CommonJS module?",
    "why": "`exports = …` only re-points the shortcut, `module.export` (no s) is a typo that creates an unused property, and `export { }` is ES-module syntax.",
    "choices": [
     "`exports = { listTasks, createTask };`",
     "`module.exports = { listTasks, createTask };`",
     "`module.export = { listTasks, createTask };`",
     "`export { listTasks, createTask };`"
    ],
    "answer": 1
   },
   {
    "id": "node-12",
    "type": "tf",
    "q": "`require('express')` works without `npm install`, because Express is part of Node.",
    "why": "Express is a package: it must be installed into `node_modules`. Built-in modules such as `node:fs` need no installation.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   },
   {
    "id": "node-26",
    "type": "mc",
    "q": "`server.js` has `const PORT = process.env.PORT || 3000;` and is started with `PORT=4000 npm start`. What is `PORT`?",
    "why": "Environment variables are always strings. `app.listen` accepts it, but convert with `Number(…)` before doing arithmetic.",
    "choices": [
     "The number `4000`",
     "`3000`",
     "The string `'4000'`",
     "`undefined`"
    ],
    "answer": 2
   },
   {
    "id": "node-34",
    "type": "mc",
    "q": "`let data; fs.readFile('a.txt', 'utf8', (err, d) => { data = d; }); console.log(data);` What is printed?",
    "why": "`readFile` returns at once; the callback runs later, after `console.log` has already printed the still-empty `data`.",
    "choices": [
     "The contents of `a.txt`",
     "`null`",
     "`undefined`",
     "An error"
    ],
    "answer": 2
   },
   {
    "id": "express-01",
    "type": "mc",
    "q": "Which of these does Express add on top of Node's built-in `http` module?",
    "why": "Node's `http` already listens on ports; Node itself runs JavaScript outside the browser. Express adds **routing**, **middleware** and helpers on `req`/`res`.",
    "choices": [
     "The ability to open a port and receive requests",
     "A routing API (method + path → function) and a middleware pipeline",
     "A database",
     "A way to run JavaScript outside the browser"
    ],
    "answer": 1
   },
   {
    "id": "express-13",
    "type": "mc",
    "q": "For `GET /tasks?done=false&page=2`, which route definition matches?",
    "why": "The query string is never part of route matching; it is parsed into `req.query`.",
    "choices": [
     "`app.get('/tasks?done=false')`",
     "`app.get('/tasks')`",
     "`app.get('/tasks/:done')`",
     "`app.get('/tasks/page/2')`"
    ],
    "answer": 1
   },
   {
    "id": "express-16",
    "type": "mc",
    "q": "Routes are registered in this order: `GET /tasks/:id`, then `GET /tasks/stats`. What happens on `GET /tasks/stats`?",
    "why": "The first match wins and `:id` matches any segment. Put fixed paths before parameter paths.",
    "choices": [
     "The stats route runs because it is more specific",
     "The `:id` route runs with `id = \"stats\"`",
     "Both routes run",
     "Express reports a conflict at start-up"
    ],
    "answer": 1
   },
   {
    "id": "express-24",
    "type": "mc",
    "q": "Your logger prints `GET /health`, but the browser spins forever. What is the most likely bug?",
    "why": "The logger ran (it printed), but it never passed the request on, so nothing else ever ran.",
    "choices": [
     "The logger forgot to call next()",
     "The route has the wrong method",
     "express.json() is missing",
     "The port is wrong"
    ],
    "answer": 0
   },
   {
    "id": "express-28",
    "type": "tf",
    "q": "Middleware registered after a route still runs before that route's handler.",
    "why": "Layers run in registration order. A layer below a route only runs if the request gets past that route.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   }
  ]
 },
 "5": {
  "title": "REST API: controllers, errors and design",
  "lab": "L5",
  "sessions": "16-18",
  "questions": [
   {
    "id": "express-21",
    "type": "mc",
    "q": "`if (!title) res.status(400).json({ error: 'title is required' });` is followed by code that sends a 201. What is the fix?",
    "why": "Sending does not stop the function; `return` does. Calling `next()` too would also try to answer twice.",
    "choices": [
     "Add `return` before `res.status(400)`",
     "Use `res.send` instead of `res.json`",
     "Swap the two responses",
     "Add `next()` after the 400"
    ],
    "answer": 0
   },
   {
    "id": "express-40",
    "type": "mc",
    "q": "Why must the error handler be registered after the routes?",
    "why": "An error handler above a route can never receive that route's errors.",
    "choices": [
     "Because Express reads app.js backwards",
     "Errors only travel forward: Express looks for the next error handler after the layer that failed",
     "So it runs on every request",
     "Because it must call app.listen"
    ],
    "answer": 1
   },
   {
    "id": "express-45",
    "type": "mc",
    "q": "Where does a JSON 404 catch-all `app.use((req, res) => res.status(404).json(…))` go?",
    "why": "Without a path it matches every request; placed early it would hide all routes.",
    "choices": [
     "First, before the routes",
     "After every route, before the error handler",
     "Inside each router",
     "After app.listen"
    ],
    "answer": 1
   },
   {
    "id": "express-47",
    "type": "mc",
    "q": "A controller cannot find task 999. What should it do?",
    "why": "The route exists but the resource does not: a 404 with a clear message, directly or via the error handler.",
    "choices": [
     "Throw a string",
     "Answer 404 itself, or call next(err) with err.status = 404",
     "Answer 500",
     "Call next() so the catch-all answers"
    ],
    "answer": 1
   },
   {
    "id": "rest-07",
    "type": "mc",
    "q": "Which URL design is RESTful for reading task 7?",
    "why": "A plural noun for the collection, the id in the path, and the verb in the method.",
    "choices": [
     "`GET /api/getTask?id=7`",
     "`GET /api/task/7`",
     "`GET /api/tasks/7`",
     "`POST /api/tasks/read/7`"
    ],
    "answer": 2
   },
   {
    "id": "rest-08",
    "type": "mc",
    "q": "Which request is the RESTful way to mark task 4 as done?",
    "why": "An action on one field is an update of the item. GET must never change data.",
    "choices": [
     "`POST /api/tasks/4/markDone`",
     "`PATCH /api/tasks/4` with `{\"done\":true}`",
     "`GET /api/tasks/4?done=true`",
     "`PUT /api/markDone` with `{\"id\":4}`"
    ],
    "answer": 1
   },
   {
    "id": "rest-16",
    "type": "mc",
    "q": "Which methods are **idempotent**?",
    "why": "Sending them twice leaves the server in the same state as sending them once. POST is not; PATCH is not guaranteed.",
    "choices": [
     "GET, PUT and DELETE",
     "Only GET",
     "POST and PATCH",
     "All five"
    ],
    "answer": 0
   },
   {
    "id": "rest-22",
    "type": "mc",
    "q": "A `POST /api/tasks` succeeds. What should the response contain?",
    "why": "201 says a resource was created; `Location` says where; echoing the body saves a GET.",
    "choices": [
     "200 and an empty body",
     "201, a `Location` header with the new URL, and usually the created task",
     "204 and the created task in the body",
     "302 redirecting to `/api/tasks`"
    ],
    "answer": 1
   },
   {
    "id": "rest-23",
    "type": "tf",
    "q": "`res.status(204).json({ message: \"Deleted\" })` sends the message to the client.",
    "why": "A 204 never has a body; Express drops it. Use 204 with nothing, or 200 with a body.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   },
   {
    "id": "rest-17",
    "type": "tf",
    "q": "Because the second `DELETE /api/tasks/5` answers 404 while the first answered 204, DELETE is not idempotent.",
    "why": "Idempotence is about the **state** of the server (task 5 is gone either way), not about getting the same status code.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   }
  ]
 },
 "6": {
  "title": "Relational databases and SQL",
  "lab": "L6",
  "sessions": "20-22",
  "questions": [
   {
    "id": "sql-05",
    "type": "mc",
    "q": "One user owns many tasks. Where does the foreign key go?",
    "why": "In a one-to-many relationship the \"many\" side stores the reference: each task has exactly one owner, so one `user_id` per task is enough.",
    "choices": [
     "In `users`: a `task_id` column",
     "In `tasks`: a `user_id` column",
     "In both tables",
     "In a separate join table"
    ],
    "answer": 1
   },
   {
    "id": "sql-04",
    "type": "mc",
    "q": "Students can enrol in many courses and each course has many students. How do you store this?",
    "why": "Many-to-many needs a third table where each row is one pair. A list in a column cannot be checked by foreign keys, and one `student_id` per course allows only one student.",
    "choices": [
     "A `course_ids TEXT` column in `students` with values such as `'3,7,9'`",
     "A `student_id` column in `courses`",
     "A join table `enrolments (student_id, course_id)` with two foreign keys",
     "One table with a row per student and a column per course"
    ],
    "answer": 2
   },
   {
    "id": "sql-03",
    "type": "mc",
    "q": "`tasks.user_id` has `ON DELETE CASCADE`. What does `DELETE FROM users WHERE id = 2` do?",
    "why": "CASCADE propagates the delete to the rows that reference the deleted one. Refusing is the default behaviour (no ON DELETE clause), and SET NULL is a different option.",
    "choices": [
     "Fails because user 2 still has tasks",
     "Deletes user 2 and sets their tasks' `user_id` to NULL",
     "Deletes user 2 and every task with `user_id = 2`",
     "Deletes only the tasks, not the user"
    ],
    "answer": 2
   },
   {
    "id": "sql-10",
    "type": "mc",
    "q": "Which SQL statement does `PATCH /tasks/7` with `{ \"done\": true }` run?",
    "why": "PATCH changes an existing resource: an UPDATE limited by WHERE to that one row. ALTER TABLE changes the schema, not the data.",
    "choices": [
     "`INSERT INTO tasks (id, done) VALUES (7, TRUE)`",
     "`UPDATE tasks SET done = TRUE WHERE id = 7`",
     "`SELECT done FROM tasks WHERE id = 7`",
     "`ALTER TABLE tasks SET done = TRUE`"
    ],
    "answer": 1
   },
   {
    "id": "auth-42",
    "type": "mc",
    "q": "Which code is safe against SQL injection?",
    "why": "A parameterised query sends the value separately from the SQL text, so it can never be run as SQL. Concatenation and template literals both build SQL from user input.",
    "choices": [
     "`db.query(\"SELECT * FROM users WHERE email = '\" + email + \"'\")`",
     "A template literal that inserts `${email}` into the SQL text",
     "`db.query('SELECT * FROM users WHERE email = $1', [email])`",
     "`db.query('SELECT * FROM users WHERE email = ' + escape(email))`"
    ],
    "answer": 2
   },
   {
    "id": "sql-22",
    "type": "mc",
    "q": "Which query lists the users who have no tasks?",
    "why": "Only a LEFT JOIN produces the padded rows, and `IS NULL` (never `= NULL`) keeps them. The inner join never has a NULL t.id.",
    "choices": [
     "`SELECT u.email FROM users u JOIN tasks t ON t.user_id = u.id WHERE t.id IS NULL`",
     "`SELECT u.email FROM users u LEFT JOIN tasks t ON t.user_id = u.id WHERE t.id IS NULL`",
     "`SELECT u.email FROM users u LEFT JOIN tasks t ON t.user_id = u.id WHERE t.id = NULL`",
     "`SELECT email FROM users WHERE tasks = 0`"
    ],
    "answer": 1
   },
   {
    "id": "sql-31",
    "type": "mc",
    "q": "Migration `003_add_due_date.sql` has already run on every database, and it has a mistake. What do you do?",
    "why": "Databases that already ran 003 will never run it again, so edits to it are ignored. A new migration reaches every database in order.",
    "choices": [
     "Edit 003 and run it again",
     "Delete 003 from the repository",
     "Write a new migration 004 that fixes it",
     "Fix each database by hand"
    ],
    "answer": 2
   },
   {
    "id": "sql-40",
    "type": "mc",
    "q": "In the layered architecture, where does the SQL for `GET /tasks/:id` live?",
    "why": "Routes map URLs to controllers, controllers deal with HTTP, and only the model talks to the database.",
    "choices": [
     "In the route file",
     "In the controller",
     "In the model",
     "In `server.js`"
    ],
    "answer": 2
   },
   {
    "id": "sql-12",
    "type": "tf",
    "q": "`SELECT id FROM tasks WHERE due_date = NULL` returns the tasks that have no due date.",
    "why": "Comparing anything with NULL gives \"unknown\", which WHERE treats as not true, so the query returns no rows. Use `due_date IS NULL`.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   },
   {
    "id": "sql-37",
    "type": "tf",
    "q": "Replacing every `'` in the input with `''` before concatenating it is as safe as using placeholders.",
    "why": "Hand escaping misses cases (numbers need no quotes: `1 OR 1=1`; encodings; one forgotten route). Placeholders never put the input in the SQL text at all.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   }
  ]
 },
 "7": {
  "title": "Authentication and security",
  "lab": "L7",
  "sessions": "25-27",
  "questions": [
   {
    "id": "auth-02",
    "type": "mc",
    "q": "A request reaches `GET /tasks` with no `Authorization` header at all. Which part of a typical Express API answers, and with what?",
    "why": "`app.use('/tasks', auth, tasksRouter)` puts `auth` first; with no token it answers **401** `Missing token` and never calls `next()`.",
    "choices": [
     "The tasks controller, with 403",
     "The auth middleware, with 401, before any tasks handler runs",
     "The Zod validator, with 400",
     "Express itself, with 404"
    ],
    "answer": 1
   },
   {
    "id": "auth-04",
    "type": "mc",
    "q": "When creating a task, where must the server take the owner's id from?",
    "why": "Everything in the body, query or form is controlled by the client. Only the verified token is trustworthy, so the owner is `req.user.sub`.",
    "choices": [
     "`req.body.userId`",
     "`req.query.userId`",
     "`req.user.sub`, set by the auth middleware from the verified token",
     "A hidden form field"
    ],
    "answer": 2
   },
   {
    "id": "auth-09",
    "type": "mc",
    "q": "Why do APIs store a password **hash** rather than an **encrypted** password?",
    "why": "The server never needs to read a password back, only to check one. A one-way hash leaves an attacker nothing to decrypt; an encrypted column falls with its key.",
    "choices": [
     "Hashes are shorter, so they save disk space",
     "Encryption can be reversed by anyone who gets the key, which lives on the same server; a hash cannot be reversed at all",
     "Hashing is faster, so log-ins are quicker",
     "Encrypted values cannot be stored in SQL"
    ],
    "answer": 1
   },
   {
    "id": "auth-12",
    "type": "mc",
    "q": "Two users register with the same password `123456`. With bcrypt, what does the users table contain?",
    "why": "`bcrypt.hash` generates a new salt every time, so the stored strings differ and the attacker learns nothing from comparing rows.",
    "choices": [
     "Two identical hashes",
     "Two different hashes, because each was made with its own random salt",
     "The password once and a pointer to it",
     "An error: bcrypt refuses duplicate passwords"
    ],
    "answer": 1
   },
   {
    "id": "auth-18",
    "type": "mc",
    "q": "What are the three dot-separated parts of a JWT, in order?",
    "why": "`header.payload.signature`: the algorithm, the claims, and the HMAC of the first two.",
    "choices": [
     "payload.header.signature",
     "header.payload.signature",
     "header.signature.payload",
     "id.secret.expiry"
    ],
    "answer": 1
   },
   {
    "id": "auth-20",
    "type": "mc",
    "q": "A user decodes their token, changes `\"role\":\"user\"` to `\"role\":\"admin\"`, re-encodes it and sends it. What happens in an API that uses `jwt.verify`?",
    "why": "Without the secret they cannot produce the signature for the new payload, so verification fails with `invalid signature` → **401**.",
    "choices": [
     "They become admin, because the payload says so",
     "`jwt.verify` recomputes the signature, it no longer matches, and the middleware answers 401",
     "The server re-signs the token automatically",
     "The request succeeds but `req.user` is `undefined`"
    ],
    "answer": 1
   },
   {
    "id": "auth-28",
    "type": "mc",
    "q": "`curl http://localhost:3000/api/tasks` prints the tasks, but the same call from the React page on port 5173 fails. What is the most likely reason?",
    "why": "Only browsers apply the same-origin policy. The API answered both requests; the browser refused to give the answer to the page.",
    "choices": [
     "The API is down",
     "The browser enforces CORS and the API sends no `Access-Control-Allow-Origin` header; curl never checks CORS",
     "curl adds a token automatically",
     "React cannot call APIs on localhost"
    ],
    "answer": 1
   },
   {
    "id": "auth-35",
    "type": "mc",
    "q": "A `validate` middleware calls `taskSchema.safeParse(req.body)` and gets `success: false`. What should it do?",
    "why": "`safeParse` never throws; the middleware turns a failure into **400** with the list of issues, so malformed bodies never reach the controller.",
    "choices": [
     "Throws, so the error handler answers 500",
     "Answers 400 with `error.issues` and does not call the controller",
     "Calls `next()` and lets the model reject it",
     "Answers 201 with the corrected data"
    ],
    "answer": 1
   },
   {
    "id": "auth-19",
    "type": "tf",
    "q": "The payload of a JWT is encrypted, so only the server can read it.",
    "why": "It is only base64url-**encoded**: anyone can decode it (the JWT inspector does it with no secret). The signature protects integrity, not confidentiality.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   },
   {
    "id": "auth-36",
    "type": "tf",
    "q": "If the front-end form already validates every field, the API does not need to validate `req.body` again.",
    "why": "Anyone can bypass your form with curl or a script. Front-end checks are a convenience; the server must validate everything that arrives.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   }
  ]
 },
 "8": {
  "title": "React components",
  "lab": "L8",
  "sessions": "31-32",
  "questions": [
   {
    "id": "components-01",
    "type": "mc",
    "q": "What is a React component?",
    "why": "A component is a function: it receives props and returns elements (usually written as JSX). React calls it whenever it needs that part of the UI.",
    "choices": [
     "An HTML template file processed on the server",
     "A JavaScript function, with a capitalised name, that returns a description of UI",
     "A CSS class that styles a part of the page",
     "An object you create with `new Component()`"
    ],
    "answer": 1
   },
   {
    "id": "components-07",
    "type": "mc",
    "q": "Which of these can go inside `{ }` in JSX?",
    "why": "Braces take an **expression** (something with a value), because they become a function argument. `if`, `for` and declarations are statements.",
    "choices": [
     "`if (done) { … }`",
     "`for (const t of tasks) { … }`",
     "`done ? 'Yes' : 'No'`",
     "`const x = 1`"
    ],
    "answer": 2
   },
   {
    "id": "components-17",
    "type": "mc",
    "q": "A child needs to tell its parent \"the user deleted this task\". The usual React way is…",
    "why": "Data flows down as props; requests flow up as callbacks. The parent changes its own state, and React re-renders.",
    "choices": [
     "The child edits the parent's array directly",
     "The parent passes a function prop (`onDelete`) and the child calls it",
     "The child dispatches a DOM event and the parent queries the DOM",
     "The child returns the id from the component function"
    ],
    "answer": 1
   },
   {
    "id": "components-21",
    "type": "mc",
    "q": "Why do lists use `tasks.map(…)` and not `tasks.forEach(…)` inside JSX?",
    "why": "JSX needs a value. `map` returns the array of elements; `forEach` returns nothing, so nothing renders.",
    "choices": [
     "`map` is faster",
     "`map` returns a new array of elements that React can render; `forEach` returns `undefined`",
     "`forEach` is not allowed in components",
     "There is no difference"
    ],
    "answer": 1
   },
   {
    "id": "components-23",
    "type": "mc",
    "q": "Which key is the best choice for tasks loaded from an API?",
    "why": "A stable, unique id from the data. The index changes when the list changes; a random key changes every render; titles can repeat.",
    "choices": [
     "`key={index}`",
     "`key={Math.random()}`",
     "`key={task.id}`",
     "`key={task.title}` even if two tasks can share a title"
    ],
    "answer": 2
   },
   {
    "id": "components-26",
    "type": "mc",
    "q": "`tasks.map((t) => { <li>{t.title}</li> })` renders nothing. Why?",
    "why": "With `{ }` the body is a block and must `return`. Use `(t) => <li>…</li>` or `(t) => (…)` for an implicit return.",
    "choices": [
     "`li` needs a key to render",
     "The arrow function has a block body and no `return`, so every item is `undefined`",
     "`map` cannot return JSX",
     "Curly braces are not allowed in JSX"
    ],
    "answer": 1
   },
   {
    "id": "components-35",
    "type": "mc",
    "q": "How do you pass a task id to a delete handler on click?",
    "why": "The arrow creates a function that calls `remove(task.id)` later, when the click happens.",
    "choices": [
     "`onClick={remove(task.id)}`",
     "`onClick={() => remove(task.id)}`",
     "`onClick={remove, task.id}`",
     "`onClick={remove}` with `id={task.id}`"
    ],
    "answer": 1
   },
   {
    "id": "components-39",
    "type": "mc",
    "q": "An input has `value={title}` but no `onChange`. What happens when the user types?",
    "why": "A controlled input always shows the state. Without `onChange`, the state never changes, so the input is read-only.",
    "choices": [
     "The text changes and `title` updates",
     "Nothing appears to change, and React warns about `value` without `onChange`",
     "The page reloads",
     "React throws an error and the app crashes"
    ],
    "answer": 1
   },
   {
    "id": "components-24",
    "type": "tf",
    "q": "Using the array index as key is safe for a list where users can insert items at the top.",
    "why": "Inserting at the top shifts every index, so React matches items to the wrong previous items (inputs and state end up on the wrong rows).",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   },
   {
    "id": "components-31",
    "type": "tf",
    "q": "A component can return `null` to render nothing.",
    "why": "Returning `null` is the way for a component to hide itself, for example a badge with nothing to show.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 0
   }
  ]
 },
 "9": {
  "title": "State, effects and data",
  "lab": "L9",
  "sessions": "33-36",
  "questions": [
   {
    "id": "state-05",
    "type": "mc",
    "q": "How does React know which `useState` call a value belongs to?",
    "why": "State lives in a list of slots handed out in call order, which is why the order must be the same on every render.",
    "choices": [
     "By the variable name you destructure into",
     "By the order of the hook calls in each render",
     "By a hidden id written by the compiler",
     "By the initial value"
    ],
    "answer": 1
   },
   {
    "id": "state-06",
    "type": "mc",
    "q": "Which of these breaks the rules of hooks?",
    "why": "The early return makes the number of hooks depend on `user`. Put the condition inside the effect or move the hooks above the return.",
    "choices": [
     "`const [a, setA] = useState(0);` as the first line",
     "`if (!user) return <Login />;` followed by `useState`",
     "A `useEffect` whose setup starts with `if (!enabled) return;`",
     "Calling `useToggle()` at the top of a component"
    ],
    "answer": 1
   },
   {
    "id": "state-08",
    "type": "mc",
    "q": "Which call adds 3 to `count` when it appears three times in one click handler?",
    "why": "An **updater function** receives the result of the previous queued update, so the queue goes 0 → 1 → 2 → 3.",
    "choices": [
     "`setCount(count + 1)`",
     "`setCount((c) => c + 1)`",
     "`count += 1`",
     "`setCount(count++)`"
    ],
    "answer": 1
   },
   {
    "id": "state-15",
    "type": "mc",
    "q": "To toggle one task in a list, which expression is right?",
    "why": "A new array **and** a new object for the changed item. The other options edit the existing task object, which the previous render still uses.",
    "choices": [
     "`tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))`",
     "`tasks.map((t) => { if (t.id === id) t.done = !t.done; return t; })`",
     "`tasks.forEach((t) => t.id === id && (t.done = !t.done))`",
     "`[...tasks].find((t) => t.id === id).done = true`"
    ],
    "answer": 0
   },
   {
    "id": "state-19",
    "type": "mc",
    "q": "When does React run the setup function of `useEffect`?",
    "why": "Effects run **after** React has updated the DOM, so render stays pure and the screen is already up to date.",
    "choices": [
     "While rendering, before the JSX is returned",
     "After the commit, once the page shows the new render",
     "Only when the user clicks",
     "Before the first render"
    ],
    "answer": 1
   },
   {
    "id": "state-23",
    "type": "mc",
    "q": "Which situation does NOT need an effect?",
    "why": "Filtering is a calculation from state: do it during render. The others synchronise with something outside React.",
    "choices": [
     "Keeping a WebSocket connected while the chat is visible",
     "Showing the tasks that match the search text",
     "Starting a clock while the component is on the screen",
     "Loading the tasks for the `userId` on screen"
    ],
    "answer": 1
   },
   {
    "id": "fetch-09",
    "type": "mc",
    "q": "A user presses \"Delete task\". Where should the `DELETE` request be sent from?",
    "why": "The request is caused by a user action, so it belongs in the handler of that action, which also knows which task was clicked.",
    "choices": [
     "An effect that watches a `deleteRequested` state",
     "The component body, guarded by an if",
     "The button's event handler",
     "A setInterval that checks for pending deletes"
    ],
    "answer": 2
   },
   {
    "id": "fetch-11",
    "type": "mc",
    "q": "A list loaded successfully but the API returned `[]`. Which state should the component show?",
    "why": "Success with zero items is the empty state. It needs its own message; a blank area looks broken.",
    "choices": [
     "Loading",
     "Error",
     "Empty: a message that there is nothing yet and what to do",
     "Nothing at all"
    ],
    "answer": 2
   },
   {
    "id": "state-01",
    "type": "tf",
    "q": "Writing `let clicks = 0; clicks++` inside a component is enough to show a click counter on screen.",
    "why": "A local variable starts again from 0 on every render, and changing it does not tell React to render. State (`useState`) keeps the value between renders and its setter schedules a render.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   },
   {
    "id": "state-21",
    "type": "tf",
    "q": "An effect with no dependency array at all runs only once, like `[]`.",
    "why": "No array means \"after **every** render\". `[]` means \"after the first render only\".",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   }
  ]
 },
 "10": {
  "title": "Navigation with React Router",
  "lab": "L10",
  "sessions": "35, 39",
  "questions": [
   {
    "id": "routing-01",
    "type": "mc",
    "q": "In a single-page app, the user clicks a link from the task list to \"Task 7\". What does the browser request from the server?",
    "why": "After the first load, the router draws the new screen in the browser. Only data travels, as JSON.",
    "choices": [
     "A new HTML page for `/tasks/7`",
     "Nothing for the page; at most the task's data, such as `GET /api/tasks/7`",
     "The whole JavaScript bundle again",
     "`index.html` again, then the data"
    ],
    "answer": 1
   },
   {
    "id": "routing-17",
    "type": "mc",
    "q": "Where should the router (`<BrowserRouter>`) be placed?",
    "why": "Hooks like `useNavigate` and `useParams` only work inside a router, so it goes at the top, once.",
    "choices": [
     "Inside each page that uses links",
     "Once, at the top of the app, around everything that uses routes, links or navigation hooks",
     "Inside `<Routes>`",
     "Only around the navigation bar"
    ],
    "answer": 1
   },
   {
    "id": "routing-26",
    "type": "mc",
    "q": "Inside a React app, what is the difference between `<a href=\"/tasks\">` and `<Link to=\"/tasks\">`?",
    "why": "`Link` renders an `<a>`, but intercepts normal clicks and navigates with the History API.",
    "choices": [
     "None: `Link` is a styled `a`",
     "`<a href>` reloads the whole page and the app restarts; `<Link>` changes the URL through the router and keeps the app running",
     "`<Link>` cannot be opened in a new tab",
     "`<a href>` does not change the URL"
    ],
    "answer": 1
   },
   {
    "id": "routing-32",
    "type": "mc",
    "q": "Which element should navigate to a task's detail page from a list?",
    "why": "It is a navigation, so it is a link: it can be opened in a new tab, shows its target, and is announced as a link.",
    "choices": [
     "`<button onClick={() => navigate(url)}>`",
     "`<Link to={url}>`",
     "`<div onClick={() => navigate(url)}>`",
     "`<span role=\"link\">`"
    ],
    "answer": 1
   },
   {
    "id": "routing-27",
    "type": "mc",
    "q": "After a form creates a task and the API answers 201, how do you show the new task?",
    "why": "Navigation caused by an action belongs in its handler, after the work succeeded. `location.href` would reload the app.",
    "choices": [
     "`<Link to={'/tasks/' + created.id} />` returned from the handler",
     "`navigate('/tasks/' + created.id)` in the submit handler, after the request succeeded",
     "`window.location.href = '/tasks/' + created.id`",
     "Call `navigate` in the body of the component"
    ],
    "answer": 1
   },
   {
    "id": "routing-41",
    "type": "mc",
    "q": "`/tasks/999` matches `/tasks/:id`, but the API answers 404. Who shows \"This task does not exist\"?",
    "why": "The route matched, so the catch-all is not involved. The page must handle the 404 of its own request.",
    "choices": [
     "The catch-all `*` route",
     "The detail page, from the API's 404",
     "The server's SPA fallback",
     "React Router, automatically"
    ],
    "answer": 1
   },
   {
    "id": "routing-34",
    "type": "mc",
    "q": "What does a `RequireAuth` guard render when nobody is logged in?",
    "why": "It redirects to the log-in page, replacing the history entry and remembering where the user wanted to go.",
    "choices": [
     "`null`",
     "The page, with a warning",
     "`<Navigate to=\"/login\" replace state={{ from: location }} />`",
     "An error boundary"
    ],
    "answer": 2
   },
   {
    "id": "routing-31",
    "type": "mc",
    "q": "What does `<NavLink to=\"/tasks\">` add when the current URL is `/tasks/7`?",
    "why": "By default a NavLink is active for its URL and everything below it; `end` makes it exact (needed for `/`).",
    "choices": [
     "Nothing: it only matches `/tasks` exactly",
     "The class `active` and `aria-current=\"page\"`",
     "A `disabled` attribute",
     "A redirect to `/tasks`"
    ],
    "answer": 1
   },
   {
    "id": "routing-12",
    "type": "tf",
    "q": "`tasks.find((t) => t.id === id)`, with `id` from `useParams()` and numeric ids in the data, finds the task.",
    "why": "`7 === '7'` is false. Convert first: `Number(id)`.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   },
   {
    "id": "routing-35",
    "type": "tf",
    "q": "A protected route on the front end is enough to keep private data safe.",
    "why": "Anyone can bypass front-end code or call the API directly. The server must check the token on every request.",
    "choices": [
     "True",
     "False"
    ],
    "answer": 1
   }
  ]
 }
};
