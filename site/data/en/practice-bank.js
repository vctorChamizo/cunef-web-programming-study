// English version of practice-bank.js: the same structure, ids and practice exams. Canonical in
// this repository: any change to the Spanish practice bank must be carried over here by hand.
'use strict';
window.PRACTICE_BANK = {
  "adapted": [
    "express-23",
    "express-12",
    "components-29",
    "js-41",
    "components-34",
    "dom-01",
    "dom-05",
    "dom-14",
    "dom-16",
    "dom-21"
  ],
  "fixes": {
    "rest-23": {
      "why": "A 204 never has a body; Express drops it. The options are 204 without a body, or 200 with a body."
    },
    "sql-31": {
      "q": "Migration `003_add_due_date.sql` has already run on every database, and it has a mistake. What should be done?"
    },
    "sql-12": {
      "why": "Comparing anything with NULL gives \"unknown\", which WHERE treats as not true, so the query returns no rows. The condition must be written as `due_date IS NULL`."
    },
    "auth-36": {
      "why": "Anyone can bypass the form with curl or a script. Front-end checks are a convenience; the server must validate everything that arrives."
    },
    "components-26": {
      "why": "With `{ }` the body is a block and must `return`. An implicit return is written as `(t) => <li>…</li>` or `(t) => (…)`."
    },
    "routing-12": {
      "why": "`7 === '7'` is false. The value must be converted first: `Number(id)`."
    }
  },
  "add": {
    "3": [
      {
        "id": "js-16",
        "type": "mc",
        "q": "What is `'7' + 3`?",
        "why": "With a string on either side, `+` concatenates: the number 3 is coerced to `'3'`.",
        "choices": [
          "`10`",
          "`NaN`",
          "`'10'`",
          "`'73'`"
        ],
        "answer": 3
      },
      {
        "id": "js-35",
        "type": "mc",
        "q": "What does `[3, 8, 1].map((n) => n * 10)` return?",
        "why": "`map` builds a new array of the same length from the values the callback returns; the original stays as it was.",
        "choices": [
          "`undefined`",
          "`90`",
          "`[30, 80, 10]`",
          "`[3, 8, 1]` changed in place"
        ],
        "answer": 2
      },
      {
        "id": "js-11",
        "type": "mc",
        "q": "What does this print? `console.log(y); let y = 3;`",
        "why": "`let` is hoisted but stays in the temporal dead zone until its line runs, so reading it earlier throws a `ReferenceError`.",
        "choices": [
          "`3`",
          "It throws a `ReferenceError`",
          "`undefined`",
          "`null`"
        ],
        "answer": 1
      },
      {
        "id": "js-19",
        "type": "mc",
        "q": "Which of these values is **truthy**?",
        "why": "An empty array is an object, and every object is truthy. `0`, `''` and `NaN` are on the short falsy list.",
        "choices": [
          "`[]`",
          "`''`",
          "`0`",
          "`NaN`"
        ],
        "answer": 0
      },
      {
        "id": "js-38",
        "type": "mc",
        "q": "What does this print? `const a = [1, 2]; const b = a; b.push(3); console.log(a.length);`",
        "why": "`b = a` copies the reference, so both names point at the same array; pushing through `b` is visible through `a`.",
        "choices": [
          "`2`",
          "`3`",
          "`undefined`",
          "A `TypeError` because `a` is `const`"
        ],
        "answer": 1
      },
      {
        "id": "js-46",
        "type": "mc",
        "q": "Which arrow function returns an **object** with a property `ok` set to `true`?",
        "why": "Without parentheses the braces are read as a block body (containing a label), so the function returns `undefined`. Parentheses make them an object literal.",
        "choices": [
          "`() => { ok: true }`",
          "`() => return { ok: true }`",
          "`() => [ok: true]`",
          "`() => ({ ok: true })`"
        ],
        "answer": 3
      },
      {
        "id": "js-25",
        "type": "mc",
        "q": "What does `'' || 'anonymous'` evaluate to?",
        "why": "`||` returns the first truthy operand, or the last one if none is truthy. `''` is falsy, so it returns `'anonymous'` itself, not `true`.",
        "choices": [
          "`true`",
          "`''`",
          "`'anonymous'`",
          "`false`"
        ],
        "answer": 2
      },
      {
        "id": "js-41",
        "type": "mc",
        "q": "What does `const r = [1, 2].forEach((n) => n * 2);` store in `r`?",
        "why": "`forEach` runs the callback for its effect and returns nothing. `map` is the method that collects the transformed values.",
        "choices": [
          "`undefined`",
          "`[1, 2]`",
          "`[2, 4]`",
          "`6`"
        ],
        "answer": 0
      },
      {
        "id": "js-12",
        "type": "mc",
        "q": "After `if (true) { let a = 1; var b = 2; }`, which names can be read on the next line, outside the block?",
        "why": "`let` is block-scoped, so `a` exists only inside the braces. `var` ignores blocks and leaks out to the enclosing function or script.",
        "choices": [
          "Both `a` and `b`",
          "Only `a`",
          "Neither",
          "Only `b`"
        ],
        "answer": 3
      },
      {
        "id": "js-mx401",
        "type": "mc",
        "q": "Given `const user = { name: \"Ana\" };`, what happens when `user.name = \"Luis\";` is executed?",
        "choices": [
          "The property changes: `const` prevents reassigning the variable, not modifying the object",
          "An error is thrown, because `user` was declared with `const`",
          "A copy of `user` is created with the new name",
          "Nothing happens: the assignment is silently ignored"
        ],
        "answer": 0,
        "why": "`const` prevents the variable from pointing to another value (`user = ...` would throw an error), but the object it points to remains mutable."
      },
      {
        "id": "js-mx402",
        "type": "mc",
        "q": "What does `[5, 12, 8, 20].filter((n) => n > 10)` return?",
        "choices": [
          "`true`, because some element meets the condition",
          "`12`, the first element that meets the condition",
          "`[12, 20]`, a new array with the elements that meet the condition",
          "`[5, 8]`, the elements that do not meet it"
        ],
        "answer": 2,
        "why": "`filter` always returns a new array with the elements for which the callback returns `true`. The method that returns only the first one is `find`."
      },
      {
        "id": "js-mx501",
        "type": "mc",
        "q": "What is the value of `nums` after executing `const nums = [1, 2, 3]; const doubled = nums.map((n) => n * 2);`?",
        "choices": [
          "`[2, 4, 6]`",
          "`[1, 2, 3, 2, 4, 6]`",
          "`undefined`",
          "`[1, 2, 3]`"
        ],
        "answer": 3,
        "why": "`map` does not modify the original array: it returns a new one, which here is stored in `doubled`."
      },
      {
        "id": "js-mx502",
        "type": "mc",
        "q": "Which of these values is *falsy* in JavaScript?",
        "choices": [
          "`\"0\"`",
          "`[]`",
          "`\"\"`",
          "`{}`"
        ],
        "answer": 2,
        "why": "The *falsy* values are `false`, `0`, `\"\"`, `null`, `undefined` and `NaN`. The string `\"0\"`, the empty array and the empty object are *truthy*."
      },
      {
        "id": "js-mx601",
        "type": "mc",
        "q": "What is the difference between `let` and `const`?",
        "choices": [
          "`let` allows the variable to be reassigned; `const` does not",
          "`const` creates global variables",
          "`let` only accepts numbers",
          "None: they are synonyms"
        ],
        "answer": 0,
        "why": "Both are block-scoped. `const` prevents reassigning the variable; `let` allows it."
      },
      {
        "id": "js-mx602",
        "type": "mc",
        "q": "What does `users.find((u) => u.id === 99)` return if no user has that `id`?",
        "choices": [
          "`null`",
          "`[]`",
          "`false`",
          "`undefined`"
        ],
        "answer": 3,
        "why": "`find` returns the first element that meets the condition, or `undefined` if there is none. `filter` would return `[]`."
      }
    ],
    "4": [
      {
        "id": "express-23",
        "type": "mc",
        "q": "A middleware function must, before it finishes its work for a request…",
        "why": "The request is either passed on or ended. Doing neither leaves the request hanging; doing both sends two responses.",
        "choices": [
          "either call next() or send a response",
          "always call next()",
          "always send a response",
          "return a value"
        ],
        "answer": 0
      },
      {
        "id": "express-12",
        "type": "mc",
        "q": "With `app.get('/tasks/:id', getTask)`, what is `req.params.id` for `GET /tasks/42`?",
        "why": "URL parts are text: route parameters are always **strings**. They are converted with `Number(…)`.",
        "choices": [
          "The number 42",
          "`undefined`",
          "The string \"42\"",
          "`{ id: 42 }`"
        ],
        "answer": 2
      },
      {
        "id": "express-mx504",
        "type": "mc",
        "q": "An Express middleware neither responds nor calls `next()`. What happens to the request?",
        "choices": [
          "Express automatically moves on to the next middleware",
          "The request remains unanswered until the client times out",
          "Express responds with 404",
          "Express responds with 500"
        ],
        "answer": 1,
        "why": "A middleware must either end the response or pass control on with `next()`. If it does neither, the request is left pending."
      },
      {
        "id": "express-mx604",
        "type": "mc",
        "q": "Given the route `router.get(\"/tasks/:id\", ...)` and the request `GET /tasks/7?done=true`, where is the value `7`?",
        "choices": [
          "`req.query.id`",
          "`req.body.id`",
          "`req.params.id`",
          "`req.headers.id`"
        ],
        "answer": 2,
        "why": "Segments declared with `:` in the route arrive in `req.params`. Whatever comes after `?` arrives in `req.query`, so `done` would be in `req.query.done`."
      }
    ],
    "5": [
      {
        "id": "express-39",
        "type": "mc",
        "q": "How does Express recognise an error-handling middleware?",
        "why": "Express checks the function's parameter count (`fn.length === 4`). Being last is where it must be, not how it is recognised.",
        "choices": [
          "Its name contains \"error\"",
          "It is registered last",
          "It declares four parameters: (err, req, res, next)",
          "It calls res.status(500)"
        ],
        "answer": 2
      },
      {
        "id": "express-mx404",
        "type": "mc",
        "q": "A `POST /products` endpoint creates a product successfully. Which status code should it return?",
        "choices": [
          "200",
          "302",
          "204",
          "201"
        ],
        "answer": 3,
        "why": "201 *Created* indicates that a new resource has been created. 204 is used when the response has no body, for example after a deletion."
      }
    ],
    "6": [
      {
        "id": "sql-19",
        "type": "mc",
        "q": "dan has no tasks. Does he appear in `SELECT u.email, t.title FROM users u JOIN tasks t ON t.user_id = u.id`?",
        "why": "JOIN (INNER JOIN) drops rows without a match. A LEFT JOIN from users would keep dan with NULL task columns.",
        "choices": [
          "No: an inner join keeps only rows that found a partner",
          "Yes, once per task in the table",
          "Yes, once, with a NULL title",
          "Only if he was created first"
        ],
        "answer": 0
      },
      {
        "id": "sql-14",
        "type": "mc",
        "q": "The API shows 20 tasks per page, ordered by id. Which clause returns page 3?",
        "why": "Page p skips (p − 1) × size rows: page 3 skips 40 and takes 20, so it shows rows 41–60.",
        "choices": [
          "`LIMIT 20 OFFSET 60`",
          "`LIMIT 20 OFFSET 40`",
          "`LIMIT 3 OFFSET 20`",
          "`LIMIT 60 OFFSET 40`"
        ],
        "answer": 1
      },
      {
        "id": "sql-mx405",
        "type": "mc",
        "q": "Why is `db.query(\"SELECT * FROM products WHERE id = $1\", [id])` written instead of concatenating the `id` into the SQL text?",
        "choices": [
          "Because PostgreSQL does not accept numbers inside the query text",
          "Because the query runs faster this way",
          "Because `pg` sends the values separately from the SQL, so they cannot alter the query (SQL injection)",
          "Because `$1` automatically converts the value to a number"
        ],
        "answer": 2,
        "why": "With a parameterised query, the value is never interpreted as part of the SQL. Concatenating user data enables SQL injection."
      },
      {
        "id": "sql-mx605",
        "type": "mc",
        "q": "What does `RETURNING id, title` add at the end of an `INSERT` in PostgreSQL?",
        "choices": [
          "It makes the query return the specified columns of the inserted row",
          "It rolls back the insertion if an error occurs",
          "It makes only those two columns be inserted",
          "Nothing: it is mandatory in every `INSERT`"
        ],
        "answer": 0,
        "why": "Without `RETURNING`, an `INSERT` returns no rows. With it, `rows` contains the created row, including the `id` generated by the database."
      }
    ],
    "7": [
      {
        "id": "auth-01",
        "type": "mc",
        "q": "Ben sends `DELETE /tasks/12` with a valid, unexpired token. Task 12 exists and belongs to Ana. What should the API answer?",
        "why": "The token proves **who** Ben is (authentication passed), so not 401. The ownership check fails, which is an authorisation failure: **403**. (Some APIs answer 404 to hide existence; 403 is the plain, honest answer.)",
        "choices": [
          "200, because the token is valid",
          "401, because Ben is not authorised",
          "403, because Ben is authenticated but it is not his task",
          "404, to hide that the task exists"
        ],
        "answer": 2
      },
      {
        "id": "auth-mx505",
        "type": "mc",
        "q": "A user sends a valid token but attempts to delete a task belonging to another user. Which code applies?",
        "choices": [
          "400",
          "401",
          "403",
          "404"
        ],
        "answer": 2,
        "why": "401 means that the identity of the user is unknown (no token or an invalid token). 403 means that the identity is known, but the user lacks permission for that action."
      },
      {
        "id": "auth-mx606",
        "type": "mc",
        "q": "Why are passwords stored with `bcrypt.hash` and checked with `bcrypt.compare`?",
        "choices": [
          "So that they can be decrypted and emailed to the user",
          "So that they are never stored in plain text: the *hash* cannot be reversed and `compare` checks whether a password matches it",
          "Because PostgreSQL does not accept text with special characters",
          "So that the JWT takes up less space"
        ],
        "answer": 1,
        "why": "A *hash* cannot be decrypted. At login, `compare` computes the *hash* of the received password and checks it against the stored one."
      }
    ],
    "8": [
      {
        "id": "components-13",
        "type": "mc",
        "q": "How does `TaskItem` receive the props in `<TaskItem title=\"Buy milk\" done={false} />`?",
        "why": "All attributes arrive as one object, usually destructured: `function TaskItem({ title, done })`.",
        "choices": [
          "As two parameters: `TaskItem(title, done)`",
          "As one object, the first parameter: `{ title: 'Buy milk', done: false }`",
          "Through a global variable `props`",
          "Through `this.title` and `this.done`"
        ],
        "answer": 1
      },
      {
        "id": "components-22",
        "type": "mc",
        "q": "What does React use the `key` of a list item for?",
        "why": "Keys identify items across renders, so React can move, add and remove the right ones. They are not passed as props.",
        "choices": [
          "As the element's HTML id",
          "As a prop the component can read",
          "To sort the list",
          "To match each item with the same item in the previous render, keeping its DOM and state"
        ],
        "answer": 3
      },
      {
        "id": "components-29",
        "type": "mc",
        "q": "With `count = 0`, what does `<div>{count && <p>{count} new</p>}</div>` show?",
        "why": "`0 && …` evaluates to `0`, and React renders numbers. The correct form is `count > 0 && …` or a ternary.",
        "choices": [
          "Nothing",
          "The text 0",
          "The text false",
          "0 new"
        ],
        "answer": 1
      },
      {
        "id": "components-34",
        "type": "mc",
        "q": "Which button calls `save` only when clicked?",
        "why": "The function itself is passed. `save()` runs during render; a string is an HTML habit (and an error in React); event props are camelCase.",
        "choices": [
          "`<button onClick={save}>`",
          "`<button onClick=\"save()\">`",
          "`<button onClick={save()}>`",
          "`<button onclick={save}>`"
        ],
        "answer": 0
      },
      {
        "id": "components-mx406",
        "type": "mc",
        "q": "When rendering a list with `items.map(...)`, what is the `key` prop for?",
        "choices": [
          "To style each element",
          "To let React identify each element from one render to the next",
          "To sort the list alphabetically",
          "To make the element clickable"
        ],
        "answer": 1,
        "why": "`key` must be unique and stable among siblings: React uses it to determine which element has been added, moved or removed."
      },
      {
        "id": "components-mx506",
        "type": "mc",
        "q": "What are the *props* of a React component?",
        "choices": [
          "Data that the parent component passes to the child; the child should not modify them",
          "Internal variables that the component changes with a *setter*",
          "The CSS properties of the component",
          "The routes of the application"
        ],
        "answer": 0,
        "why": "Props come from outside and are read-only. Whatever the component itself needs to change is kept in state."
      },
      {
        "id": "components-mx607",
        "type": "mc",
        "q": "What happens with `<button onClick={handleDelete(task.id)}>Delete</button>`?",
        "choices": [
          "The function runs only when the button is clicked",
          "The button becomes disabled",
          "React shows an error and does not render the button",
          "The function runs on every render, without waiting for the click"
        ],
        "answer": 3,
        "why": "The expression inside the braces is evaluated, and `handleDelete(task.id)` is a call. To wait for the click, a function must be passed: `onClick={() => handleDelete(task.id)}`."
      }
    ],
    "9": [
      {
        "id": "state-07",
        "type": "mc",
        "q": "With `count` equal to 0, a click runs `setCount(count + 1); setCount(count + 1); console.log(count);`. What does the console show, and what does the screen show next?",
        "why": "State is a snapshot: both calls read `count = 0` and queue \"set to 1\", and the log still sees the old value. The next render shows 1.",
        "choices": [
          "0, then 1",
          "2, then 2",
          "0, then 2",
          "1, then 1"
        ],
        "answer": 0
      },
      {
        "id": "state-13",
        "type": "mc",
        "q": "Which update removes the task with id 7 from the `tasks` state?",
        "why": "`filter` returns a **new** array without the item. `splice`, `delete` and `pop` change the existing array.",
        "choices": [
          "`tasks.splice(tasks.findIndex((t) => t.id === 7), 1)`",
          "`setTasks(tasks.pop())`",
          "`delete tasks[7]; setTasks(tasks)`",
          "`setTasks(tasks.filter((t) => t.id !== 7))`"
        ],
        "answer": 3
      },
      {
        "id": "state-20",
        "type": "mc",
        "q": "An effect has the dependency array `[userId]`. When does it run?",
        "why": "It always runs on mount, then again whenever a listed value differs (by `Object.is`) from the previous run.",
        "choices": [
          "After every render",
          "Only after the first render",
          "After the first render and after any render where `userId` changed",
          "Only when `userId` changes, never on mount"
        ],
        "answer": 2
      },
      {
        "id": "state-12",
        "type": "mc",
        "q": "Which line correctly marks the task in state as done?",
        "why": "React compares references with `Object.is`. Only a **new** object signals a change; the others mutate the same object.",
        "choices": [
          "`task.done = true; setTask(task);`",
          "`setTask({ ...task, done: true });`",
          "`setTask(task.done = true);`",
          "`Object.assign(task, { done: true }); setTask(task);`"
        ],
        "answer": 1
      },
      {
        "id": "state-mx407",
        "type": "mc",
        "q": "A component has `const [items, setItems] = useState([])`. Why does `items.push(x); setItems(items);` not trigger a re-render?",
        "choices": [
          "Because `push` does not work with state arrays",
          "Because `setItems` only accepts primitive values",
          "Because a call to `useEffect` is missing",
          "Because React compares by reference and receives the same array, so it considers that nothing has changed"
        ],
        "answer": 3,
        "why": "State is treated as immutable: a new array must be passed, for example `setItems([...items, x])`."
      },
      {
        "id": "js-mx503",
        "type": "mc",
        "q": "What does `await` do in front of a call that returns a promise?",
        "choices": [
          "Inside an `async` function, it waits for the promise to resolve and returns its value",
          "It blocks the entire browser until the request finishes",
          "It permanently turns the promise into a synchronous function",
          "It retries the call if it fails"
        ],
        "answer": 0,
        "why": "`await` can only be used inside an `async` function. It pauses that function, not the browser, until the promise resolves; if the promise is rejected, it throws an error."
      },
      {
        "id": "state-mx507",
        "type": "mc",
        "q": "With `const response = await api.get(\"/tasks\")`, using Axios, where is the list of tasks?",
        "choices": [
          "In `response`",
          "In `response.json()`",
          "In `response.body`",
          "In `response.data`"
        ],
        "answer": 3,
        "why": "Axios parses the JSON automatically and places it in `response.data`. `response.json()` belongs to `fetch`, which is not used in the course."
      },
      {
        "id": "state-mx408",
        "type": "mc",
        "q": "When does the effect in `useEffect(() => { loadData(); }, [])` run?",
        "choices": [
          "Before the first render",
          "Once, after the first render",
          "After every render",
          "Only when the user clicks a button"
        ],
        "answer": 1,
        "why": "With an empty dependency array, the effect runs only once, after the component mounts. Without the array, it would run after every render."
      },
      {
        "id": "state-mx608",
        "type": "mc",
        "q": "In the pattern with the `data`, `loading` and `error` states, why is `setLoading(false)` usually placed in a `finally` block?",
        "choices": [
          "Because `finally` runs before `try`",
          "Because `setLoading` does not work inside `try`",
          "Because this way loading is turned off whether the request succeeds or fails",
          "Because `finally` retries the request if it fails"
        ],
        "answer": 2,
        "why": "`finally` always runs. If `setLoading(false)` were only in the `try`, an error would leave the screen showing “Loading…” forever."
      }
    ],
    "10": [
      {
        "id": "routing-11",
        "type": "mc",
        "q": "For the URL `/tasks/7` and `path=\"/tasks/:id\"`, what is `useParams()`?",
        "why": "An object with one key per param; values are strings, because URLs are text.",
        "choices": [
          "`{ id: 7 }`",
          "`'7'`",
          "`['7']`",
          "`{ id: '7' }`"
        ],
        "answer": 3
      }
    ]
  },
  "quizzes": {
    "dom": {
      "name": "Quiz DOM",
      "short": "DOM",
      "title": "DOM manipulation",
      "lab": null,
      "sessions": "10-11",
      "questions": [
        {
          "id": "dom-01",
          "type": "mc",
          "q": "A script adds three `<li>` elements to a list. Where can they be seen?",
          "why": "JavaScript changes the DOM, the live in-memory tree, which the Elements panel shows. View Source and the file show the original HTML.",
          "choices": [
            "In View Source",
            "In the `.html` file on disk",
            "In the DevTools Elements panel",
            "Nowhere until the page is saved"
          ],
          "answer": 2
        },
        {
          "id": "dom-04",
          "type": "mc",
          "q": "Which call finds the element `<button id=\"save\">`?",
          "why": "`querySelector` takes a CSS selector, so an id needs `#`. `getElementById` takes the bare id (`'save'`); `'save'` alone as a selector means a `<save>` tag.",
          "choices": [
            "`document.getElementById('#save')`",
            "`document.querySelector('save')`",
            "`document.querySelectorAll('.save')`",
            "`document.querySelector('#save')`"
          ],
          "answer": 3
        },
        {
          "id": "dom-05",
          "type": "mc",
          "q": "What does `document.querySelector('.missing')` return when no element has that class?",
          "why": "The single-element methods return `null` when nothing matches; the error only comes later, when the `null` is used as if it were an element.",
          "choices": [
            "An empty NodeList",
            "`null`",
            "`undefined`",
            "It throws an error"
          ],
          "answer": 1
        },
        {
          "id": "dom-07",
          "type": "mc",
          "q": "`app.js` is loaded with a plain `<script src=\"app.js\">` in `<head>` and calls `document.querySelector('#list').append(li)`. It fails with \"Cannot read properties of null\". What is the simplest fix?",
          "why": "The script runs before the body is parsed, so `#list` does not exist yet. `defer` runs it after the HTML has been parsed.",
          "choices": [
            "Use `getElementById` instead",
            "Wrap the code in a `for` loop",
            "Add `defer` to the script tag",
            "Change `#list` to `.list`"
          ],
          "answer": 2
        },
        {
          "id": "dom-09",
          "type": "mc",
          "q": "A user types `<b>hi</b>` as their nickname. Which line displays exactly those characters, safely?",
          "why": "`textContent` inserts plain text; the `innerHTML` variants parse it as HTML, which renders bold text here and runs code in a malicious nickname.",
          "choices": [
            "`el.innerHTML = nickname`",
            "`el.textContent = nickname`",
            "`el.outerHTML = nickname`",
            "`el.innerHTML += nickname`"
          ],
          "answer": 1
        },
        {
          "id": "dom-12",
          "type": "mc",
          "q": "An element has `class=\"task urgent\"`. Which line marks it done **and keeps** its other classes?",
          "why": "`classList.add` touches one class only. `className` and `setAttribute('class', …)` replace the whole class string.",
          "choices": [
            "`el.className = 'done'`",
            "`el.setAttribute('class', 'done')`",
            "`el.style = 'done'`",
            "`el.classList.add('done')`"
          ],
          "answer": 3
        },
        {
          "id": "dom-14",
          "type": "mc",
          "q": "Given `<li data-price=\"12\">`, what is `li.dataset.price + 1`?",
          "why": "Attribute values are always strings, so `+` concatenates. The value must be converted first: `Number(li.dataset.price) + 1`.",
          "choices": [
            "`'121'`",
            "`13`",
            "`NaN`",
            "`undefined`"
          ],
          "answer": 0
        },
        {
          "id": "dom-16",
          "type": "tf",
          "q": "After `const p = document.createElement('p'); p.textContent = 'Hi';` the paragraph is already visible on the page.",
          "why": "A created element is detached until it is attached to a parent in the page, e.g. `document.body.append(p)`.",
          "choices": [
            "True",
            "False"
          ],
          "answer": 1
        },
        {
          "id": "dom-21",
          "type": "mc",
          "q": "Which line registers `save` to run on every click of `btn`?",
          "why": "The function value is passed. `save()` calls it immediately and registers its return value; `click` without quotes is an undefined variable.",
          "choices": [
            "`btn.addEventListener('click', save)`",
            "`btn.addEventListener('click', save())`",
            "`btn.addEventListener(click, save)`",
            "`btn.click(save)`"
          ],
          "answer": 0
        },
        {
          "id": "dom-22",
          "type": "mc",
          "q": "Which event fires on a text `<input>` on **every** keystroke that changes its value?",
          "why": "`input` fires for each change; `change` waits until the user commits the value (for example by leaving the field).",
          "choices": [
            "`change`",
            "`submit`",
            "`input`",
            "`load`"
          ],
          "answer": 2
        },
        {
          "id": "dom-25",
          "type": "mc",
          "q": "A to-do form adds an item and the item disappears a split second later. What is missing?",
          "why": "Without `preventDefault()` the form is really submitted and the page reloads, wiping what JavaScript added.",
          "choices": [
            "`e.stopPropagation()` in the submit handler",
            "A `defer` attribute",
            "`e.preventDefault()` in the submit handler",
            "`type=\"button\"` on the input"
          ],
          "answer": 2
        },
        {
          "id": "dom-26",
          "type": "tf",
          "q": "Listening to `submit` on the form (rather than `click` on its button) also handles the user pressing Enter in the text field.",
          "why": "Pressing Enter in a text field triggers implicit submission, which fires `submit` on the form, so one listener covers both the button and the Enter key.",
          "choices": [
            "True",
            "False"
          ],
          "answer": 0
        },
        {
          "id": "js-mx403",
          "type": "mc",
          "q": "In the handler for a form's `submit` event, why is `event.preventDefault()` called?",
          "choices": [
            "To prevent the browser from submitting the form and reloading the page",
            "To clear the form fields",
            "To prevent other handlers for the same event from running",
            "To validate the fields marked as `required`"
          ],
          "answer": 0,
          "why": "By default, submitting a form reloads the page. `preventDefault` cancels that behaviour so that the submission can be handled with JavaScript."
        },
        {
          "id": "js-mx603",
          "type": "mc",
          "q": "To display text typed by a user inside an element, why is `textContent` preferable to `innerHTML`?",
          "choices": [
            "Because `textContent` is quicker to type",
            "Because `textContent` inserts the text as is, without interpreting it as HTML",
            "Because `innerHTML` does not work with text",
            "Because `textContent` applies styles automatically"
          ],
          "answer": 1,
          "why": "With `innerHTML`, text containing tags would be interpreted as HTML, which allows content or code to be injected. `textContent` displays it literally."
        }
      ]
    },
    "context": {
      "name": "Quiz Context API",
      "short": "CTX",
      "title": "Shared state and the Context API",
      "lab": null,
      "sessions": "37-38",
      "questions": [
        {
          "id": "ctx-01",
          "type": "mc",
          "q": "What are the three pieces of the Context API?",
          "choices": [
            "`useState`, `useEffect` and `useContext`",
            "`createContext`, a Provider that holds the value and `useContext` to read it",
            "`BrowserRouter`, `Routes` and `Route`",
            "`localStorage`, `sessionStorage` and cookies"
          ],
          "answer": 1,
          "why": "`createContext` creates the Context; the Provider holds the value and wraps the components that can read it; `useContext` reads it from any component inside."
        },
        {
          "id": "ctx-02",
          "type": "mc",
          "q": "In the course application, where is `AuthProvider` placed?",
          "choices": [
            "Inside every component that needs the session",
            "Outside `BrowserRouter`, wrapping only `NavBar`",
            "Inside `BrowserRouter`, wrapping `App`",
            "In `index.html`, as just another tag"
          ],
          "answer": 2,
          "why": "It goes inside the router so that it can use navigation, and it wraps `App` so that the menu, the login and the protected routes can read the session."
        },
        {
          "id": "state-mx409",
          "type": "mc",
          "q": "What problem does the React Context API solve?",
          "choices": [
            "Storing the application data on the server",
            "Delivering a piece of data to distant components without passing it as props through every intermediate one (*prop drilling*)",
            "Replacing `useState` in every component",
            "Speeding up the rendering of long lists"
          ],
          "answer": 1,
          "why": "Context places a piece of data in a Provider, and any component inside reads it with `useContext`. It avoids *prop drilling*: passing data through components that do not use it."
        },
        {
          "id": "state-mx509",
          "type": "mc",
          "q": "The Context was created with `createContext(null)`. What does `useContext(AuthContext)` receive in a component that is **outside** `AuthProvider`?",
          "choices": [
            "The Provider's value, because Context is global",
            "`null`, the default value, and the application fails when reading its properties",
            "A Vite compilation error",
            "`undefined` only on the first render and the correct value afterwards"
          ],
          "answer": 1,
          "why": "Only components inside the Provider receive its value. Outside it, `useContext` returns the default value given to `createContext`, here `null`."
        },
        {
          "id": "ctx-03",
          "type": "tf",
          "q": "When the value of a Context changes, the components that read it are re-rendered.",
          "choices": [
            "True",
            "False"
          ],
          "answer": 0,
          "why": "This is why Context suits data that changes rarely, such as the session, and not data that changes very frequently."
        },
        {
          "id": "ctx-04",
          "type": "mc",
          "q": "Why does `AuthProvider` initialise the token with `useState(localStorage.getItem(\"token\"))`?",
          "choices": [
            "So that the session persists when the page is reloaded",
            "Because `useState` does not accept `null` as an initial value",
            "To send the token to the server on every render",
            "To encrypt the token"
          ],
          "answer": 0,
          "why": "React state is lost on reload. Saving the token in `localStorage` at login and reading it when the state is created makes it possible to restore the session."
        },
        {
          "id": "ctx-05",
          "type": "mc",
          "q": "In `export const useAuth = () => useContext(AuthContext);`, what is `useAuth`?",
          "choices": [
            "A component that renders the login form",
            "A shortcut for reading the value of `AuthContext` from any component inside the Provider",
            "A function that calls the login API",
            "A second Context, independent of the first"
          ],
          "answer": 1,
          "why": "It is a one-line custom hook: it avoids importing `useContext` and `AuthContext` in every component that needs the session."
        },
        {
          "id": "state-mx609",
          "type": "mc",
          "q": "Two sibling components, `SearchInput` and `TaskList`, need the same search term. Which solution is recommended in the course?",
          "choices": [
            "Giving each one its own `useState` and synchronising them with `useEffect`",
            "Storing the term in a global JavaScript variable",
            "Lifting the state up to the common parent and passing the value and the function to change it as props",
            "Storing the term in `localStorage` and reading it on every render"
          ],
          "answer": 2,
          "why": "This is *lifting state*: the parent is the single source of truth, passes the data down to the children and gives them a function to change it. Data flows down and events flow up."
        },
        {
          "id": "ctx-06",
          "type": "mc",
          "q": "A piece of data is shared only by a component and its sibling, within the same parent. Which solution is the simplest?",
          "choices": [
            "Creating a Context for that data",
            "Lifting the state up to the parent and passing it as props",
            "Storing it in `localStorage`",
            "Duplicating the state in both components"
          ],
          "answer": 1,
          "why": "Context is meant for data that travels far or is used by many components. For nearby components, lifting the state up to the common parent is enough."
        },
        {
          "id": "ctx-07",
          "type": "tf",
          "q": "The recommended approach is to create a single Context holding all of the application state.",
          "choices": [
            "True",
            "False"
          ],
          "answer": 1,
          "why": "One Context is created per concern (the session, the theme, the language). Putting everything into one means that any change re-renders every component that reads it."
        },
        {
          "id": "ctx-08",
          "type": "mc",
          "q": "A `Protected` component reads `isLoggedIn` with `useAuth()`. If it is `false`, what does it return?",
          "choices": [
            "`null`, and the page is left blank",
            "A `<Navigate to=\"/login\" />` to redirect to the login page",
            "An error that stops the application",
            "The `children` anyway, without checking anything"
          ],
          "answer": 1,
          "why": "A protected route displays its content if there is a session and, otherwise, redirects to the login page with React Router's `Navigate` component."
        }
      ]
    },
    "arch-api": {
      "name": "Quiz Backend architecture",
      "short": "API",
      "title": "Backend architecture: layers, middleware and HTTP status codes",
      "lab": null,
      "sessions": "13-27",
      "questions": [
        {
          "id": "arch-04",
          "type": "mc",
          "q": "Which layer of the API is the only one that executes SQL?",
          "choices": [
            "The routes (`routes/`)",
            "The controllers (`controllers/`)",
            "The middleware (`middleware/`)",
            "The models (`models/`)"
          ],
          "answer": 3,
          "why": "The model is the only layer that talks to the data, and it returns data, never HTTP responses. That is why changing the storage only requires rewriting `models/`."
        },
        {
          "id": "arch-05",
          "type": "mc",
          "q": "Why is `app.use(express.json())` registered before the routes?",
          "choices": [
            "Because Express only allows one middleware before the routes",
            "So that `req.body` has already been parsed when the validation and the controller read it",
            "So that responses are sent in JSON format",
            "So that the database accepts the request body"
          ],
          "answer": 1,
          "why": "Express runs middleware in the order in which it is declared. If `express.json()` came after the routes, they would receive `req.body` as `undefined`."
        },
        {
          "id": "arch-06",
          "type": "mc",
          "q": "With `router.post(\"/\", requireAuth, validateItem, controller.create)`, a request arrives **without a token** and with an empty body. What does the API respond?",
          "choices": [
            "`400`, because the body fails validation",
            "`201`, because the controller creates the item anyway",
            "`401`, because `requireAuth` stops the request before validation",
            "`500`, because `req.user` is missing"
          ],
          "answer": 2,
          "why": "Middleware runs in order. `requireAuth` responds with `401` and does not call `next()`, so the validation and the controller never run."
        },
        {
          "id": "arch-07",
          "type": "mc",
          "q": "Why is the error handler `(err, req, res, next)` registered last?",
          "choices": [
            "Because it only receives errors from what has been declared before it",
            "Because Express always runs it at the end of every request, whether or not there is an error",
            "Because that way it runs before `express.json()`",
            "Because it must come after `app.listen`"
          ],
          "answer": 0,
          "why": "Express recognises it by its four parameters and passes it the errors from the preceding middleware and routes. If registered before the routes, it would not receive their errors."
        },
        {
          "id": "arch-08",
          "type": "mc",
          "q": "The Zod validation middleware receives a body that does not match the schema. Which code does it return?",
          "choices": [
            "`401 Unauthorized`",
            "`400 Bad Request`",
            "`404 Not Found`",
            "`500 Internal Server Error`"
          ],
          "answer": 1,
          "why": "Incorrect input data is a client error: `400`. The middleware responds and does not call `next()`, so the controller only ever receives valid data."
        },
        {
          "id": "arch-09",
          "type": "mc",
          "q": "A user with a valid token attempts to delete a task that belongs to another user. Which layer decides to respond with `403`?",
          "choices": [
            "The model, because it is the one that queries the table",
            "The authentication middleware",
            "The controller, by comparing `req.user` with the owner of the task",
            "The `cors` middleware"
          ],
          "answer": 2,
          "why": "Authentication only establishes who the user is (`401` if it fails). Deciding whether the user may perform the operation is authorisation, and the controller makes that decision using the data returned by the model."
        },
        {
          "id": "arch-10",
          "type": "mc",
          "q": "The model does not find the requested row in `GET /tasks/9`. What happens?",
          "choices": [
            "The model responds with `404` directly",
            "PostgreSQL returns an error and the API responds with `500`",
            "The model returns `undefined` (or `null`) and the controller responds with `404`",
            "Express responds with `404` because the route does not exist"
          ],
          "answer": 2,
          "why": "The model returns data, never HTTP responses. Turning “no row found” into a `404` is the controller's job."
        },
        {
          "id": "arch-11",
          "type": "mc",
          "q": "The model fails because the connection to PostgreSQL has dropped. What does the client receive?",
          "choices": [
            "A `500` with a generic message, sent by the error handler",
            "The full text of the PostgreSQL error",
            "A `401`, because the session is no longer valid",
            "A `404`, because there is no data"
          ],
          "answer": 0,
          "why": "The error reaches the error handler, which logs it on the server and responds with `500` without internal details. Sending stack traces or queries to the browser is a security risk."
        },
        {
          "id": "arch-18",
          "type": "mc",
          "q": "What is the advantage of splitting the API into routes, controllers and models?",
          "choices": [
            "The API uses less memory",
            "Middleware can be dispensed with",
            "Each layer has one responsibility: changing the storage only requires rewriting the models",
            "The client can call the models directly"
          ],
          "answer": 2,
          "why": "Routes map a URL to a controller; the controller decides the response; the model talks to the data. This is how the in-memory array of L5 was replaced by PostgreSQL in L6 without touching routes or controllers."
        }
      ]
    },
    "arch": {
      "name": "Quiz Client-server architecture",
      "short": "ARCH",
      "title": "Client-server architecture: how it all fits together",
      "lab": null,
      "sessions": "cross-cutting review",
      "questions": [
        {
          "id": "arch-01",
          "type": "mc",
          "q": "In Practice 2, which part of the application runs in the user's browser?",
          "choices": [
            "The Express routes and controllers",
            "The React client: components, state and requests with Axios",
            "The PostgreSQL queries with `pg`",
            "Signing the JWT with `jwt.sign`"
          ],
          "answer": 1,
          "why": "The browser downloads and runs the React client (`client/`). Express, `pg`, `jwt.sign` and `jwt.verify` run on the server (`api/`), in Node.js."
        },
        {
          "id": "arch-02",
          "type": "mc",
          "q": "Where does `jwt.verify` run when a protected request arrives?",
          "choices": [
            "In the Axios interceptor, before the request is sent",
            "In PostgreSQL, when querying the `users` table",
            "On the server, inside the authentication middleware",
            "In `AuthContext`, when reading the token from `localStorage`"
          ],
          "answer": 2,
          "why": "Only the server knows `JWT_SECRET`, so only the server can check the signature. The client stores and sends the token, but does not verify it."
        },
        {
          "id": "arch-03",
          "type": "mc",
          "q": "A user types the name of an item and clicks “Add”. What is the correct flow?",
          "choices": [
            "React state → Axios (`POST`) → Express route → middleware → controller → model with `pg` → PostgreSQL → response → state → render",
            "React state → model with `pg` → PostgreSQL → render, without going through Express",
            "Express route → React state → Axios → PostgreSQL → controller",
            "Axios → PostgreSQL → Express → React, because the database responds first"
          ],
          "answer": 0,
          "why": "The client never talks to the database: it sends an HTTP request to the API, the API passes it through its chain down to the model, which queries PostgreSQL, and the response returns to the client, which updates the state so that React re-renders."
        },
        {
          "id": "arch-12",
          "type": "mc",
          "q": "Why is a form validated on the client and also on the server?",
          "choices": [
            "Because Zod only works on the server",
            "Because client-side validation replaces server-side validation in production",
            "On the client, to give the user immediate feedback; on the server, because anyone can call the API without going through the interface",
            "So that PostgreSQL does not have to check the types"
          ],
          "answer": 2,
          "why": "Client-side validation improves the experience, but protects nothing: a request made with `curl` bypasses it. Server-side validation is mandatory."
        },
        {
          "id": "arch-13",
          "type": "mc",
          "q": "After login, how does the token reach each protected request in Practice 2?",
          "choices": [
            "The server keeps it in memory and associates it with each request",
            "It is sent in the URL as a query parameter",
            "The browser sends it automatically, in a cookie",
            "The client stores it in `localStorage` and an Axios interceptor adds it in `Authorization: Bearer <token>`"
          ],
          "answer": 3,
          "why": "`signIn` stores the token returned by `/auth/login`. The request interceptor in `services/api.js` reads it and adds it to the header; the server does not store the JWT."
        },
        {
          "id": "arch-14",
          "type": "mc",
          "q": "In the controller of a protected route, what is `req.user` and where does it come from?",
          "choices": [
            "The request body, sent by the client",
            "A value that the Axios interceptor adds to the request",
            "A row from the `users` table that Express loads automatically",
            "The content of the token, which the authentication middleware stores after verifying it"
          ],
          "answer": 3,
          "why": "`requireAuth` verifies the token with `jwt.verify` and stores its *payload* in `req.user`. The controller trusts that data because it is signed by the server, rather than whatever the client sends."
        },
        {
          "id": "arch-15",
          "type": "mc",
          "q": "The API responds with `401` to an authenticated request because the token has expired. What does the Practice 2 client do?",
          "choices": [
            "The response interceptor deletes the token and takes the user to the login page",
            "Axios retries the request until it succeeds",
            "React renews the token without notice",
            "The API returns a new token in the same response"
          ],
          "answer": 0,
          "why": "When the token expires, `jwt.verify` fails and the API responds with `401`. The response interceptor in `services/api.js` removes the token and redirects to `/login` so that the user can log in again."
        },
        {
          "id": "arch-16",
          "type": "mc",
          "q": "Why does the API need `cors({ origin: process.env.CLIENT_ORIGIN })`?",
          "choices": [
            "To encrypt the requests between the client and the API",
            "Because the client (`localhost:5173`) and the API (`localhost:3000`) are different origins and the browser blocks the response unless the API allows it",
            "So that the API can connect to PostgreSQL",
            "So that Express accepts bodies in JSON format"
          ],
          "answer": 1,
          "why": "Under the same-origin policy, the browser only hands responses from another origin to the page if the server allows it with the CORS headers."
        },
        {
          "id": "arch-17",
          "type": "mc",
          "q": "The CORS configuration is missing from the API. Where does the error appear?",
          "choices": [
            "In the browser console: the request reaches the API, but the browser discards the response",
            "In the API terminal, as an Express error",
            "In PostgreSQL, as a rejected query",
            "Nowhere: the request works just the same"
          ],
          "answer": 0,
          "why": "CORS is enforced by the browser, not by the server. The API may have responded correctly; it is the browser that prevents the client code from reading the response."
        },
        {
          "id": "arch-19",
          "type": "mc",
          "q": "After `const response = await api.post(\"/items\", { name })`, what makes the new item appear in the list?",
          "choices": [
            "PostgreSQL updates the screen when it inserts the row",
            "The component stores the data with its state *setter* and React re-renders",
            "Axios modifies the DOM with the response",
            "Express sends the HTML of the updated list"
          ],
          "answer": 1,
          "why": "The API only returns JSON data. The client updates its state with a new value (for example, a new array including the item) and React re-renders the component."
        },
        {
          "id": "arch-20",
          "type": "mc",
          "q": "In Practice 2, which file creates the Axios client with the base URL of the API?",
          "choices": [
            "`api/src/app.js`",
            "`api/src/db.js`",
            "`client/src/main.jsx`",
            "`client/src/services/api.js`"
          ],
          "answer": 3,
          "why": "`client/src/services/api.js` creates the client with `axios.create({ baseURL: import.meta.env.VITE_API_URL })` and defines the interceptors for the token and for `401`. `api/src/db.js` creates the `pg` connection to PostgreSQL."
        }
      ]
    }
  }
};

window.SIMULACROS = [
  {
    "n": 1,
    "questions": [
      "js-16",
      "js-35",
      "express-23",
      "express-12",
      "components-13",
      "state-07",
      "arch-03",
      "arch-06"
    ],
    "practical": [
      "A1",
      "A4",
      "A2",
      "E5"
    ]
  },
  {
    "n": 2,
    "questions": [
      "js-19",
      "js-38",
      "auth-01",
      "sql-19",
      "components-29",
      "state-13",
      "arch-12",
      "arch-16"
    ],
    "practical": [
      "B1",
      "B3",
      "B2",
      "E4"
    ]
  },
  {
    "n": 3,
    "questions": [
      "js-25",
      "js-41",
      "express-39",
      "sql-14",
      "components-34",
      "state-12",
      "arch-10",
      "arch-13"
    ],
    "practical": [
      "D2",
      "C3",
      "A3",
      "E8"
    ]
  },
  {
    "n": 4,
    "questions": [
      "js-mx401",
      "js-mx403",
      "express-mx404",
      "sql-mx405",
      "components-mx406",
      "state-mx407",
      "arch-05",
      "arch-09"
    ],
    "practical": [
      "B4",
      "B5",
      "B6",
      "E1"
    ]
  },
  {
    "n": 5,
    "questions": [
      "js-mx501",
      "js-mx502",
      "express-mx504",
      "auth-mx505",
      "components-mx506",
      "state-mx509",
      "arch-01",
      "arch-14"
    ],
    "practical": [
      "A5",
      "B7",
      "B8",
      "E6"
    ]
  },
  {
    "n": 6,
    "questions": [
      "js-mx601",
      "js-mx602",
      "express-mx604",
      "sql-mx605",
      "components-mx607",
      "state-mx609",
      "arch-07",
      "arch-19"
    ],
    "practical": [
      "B9",
      "A6",
      "A7",
      "E9"
    ]
  }
];
