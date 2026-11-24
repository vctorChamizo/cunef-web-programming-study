// English version of ../exercises.js, canonical in this repository. Hand-written translation:
// any change to the Spanish exercises must be carried over to this file by hand.
//
// Practical programming exercises for the study site: study mode, and the practical part of every
// practice exam. Conventions follow the course labs: CommonJS in the backend, node-postgres with
// parameterized queries, JWT payload in req.user ({ sub, role }), pagination responses as
// { page, limit, items }, React with useState/useEffect, Axios through a client created with
// axios.create, async/await only, React Router imported from "react-router".
// Context API (sessions 37-38) is covered by C3. Left out, as in the course: effect cleanup and
// nested routes.
//
// Inside these template literals, a backtick is written \` and a dollar-brace is written \${.
'use strict';
window.EXERCISES = [
  // ------------------------------------------------------------------ A1
  {
    id: 'A1', kind: 'js', category: 'Bug fixing', tech: 'JavaScript',
    title: 'Names of the active users',
    concepts: ['filter', 'map', 'return in arrow functions'],
    level: 'Basic', minutes: '5-8',
    statement: `An application stores its users in an array of objects. The function \`getActiveNames\` must return **only the names** of the active users, but running it prints \`[ undefined, undefined ]\`.

The task is to:

1. Fix the function so that it returns the expected names.
2. State in one line, as a comment, what the bug was.`,
    files: [{ name: 'users.js', lang: 'js', code: `const users = [
  { id: 1, name: "Ana", active: true },
  { id: 2, name: "Luis", active: false },
  { id: 3, name: "Marta", active: true },
];

function getActiveNames(list) {
  return list
    .filter((user) => user.active)
    .map((user) => {
      user.name;
    });
}

console.log(getActiveNames(users));` }],
    expected: `The call \`getActiveNames(users)\` returns \`[ "Ana", "Marta" ]\`. The original \`users\` array does not change.`,
    hints: [
      'Review how an arrow function returns a value when its body is wrapped in braces and when it is not.',
      'The \`filter\` works correctly: the problem lies in the \`map\` callback. What does that callback return for each user?',
    ],
    solution: {
      code: `function getActiveNames(list) {
  return list
    .filter((user) => user.active)
    .map((user) => user.name); // the map callback did not return anything
}`,
      changes: ['In the \`map\` callback, replace the body in braces with an expression: \`(user) => user.name\`.'],
      explanation: `\`map\` builds a new array with whatever the callback **returns** for each element. An arrow function with braces is a block: without \`return\`, it returns \`undefined\`. That is why the resulting array contains one \`undefined\` for each active user. Without braces, the arrow function directly returns the value of the expression.`,
      alternatives: 'Keep the braces and add \`return\`: \`.map((user) => { return user.name; })\`. It is equally correct.',
    },
    rubric: [
      { text: 'Identifies that the bug is in the \`map\` callback, not in \`filter\`', points: 3 },
      { text: 'The callback returns \`user.name\`, without braces or with \`return\`', points: 4 },
      { text: 'Keeps \`filter\` and does not modify the original array', points: 2 },
      { text: 'The comment explains that the callback did not return any value', points: 1 },
    ],
    penalties: ['Replacing \`filter\` and \`map\` with a loop that modifies \`users\`: -2.', 'Returning the whole objects instead of the names: the 4-point criterion is not awarded.'],
    partial: 'If \`return\` is added but the wrong value is returned (for example, \`user\`), the 3 identification points are awarded.',
  },

  // ------------------------------------------------------------------ B1
  {
    id: 'B1', kind: 'js', category: 'Code completion', tech: 'JavaScript and DOM',
    title: 'Adding tasks from a form',
    concepts: ['addEventListener', 'preventDefault', 'createElement', 'textContent'],
    level: 'Basic', minutes: '10',
    statement: `A page has a form for adding tasks to a list. The script already selects the elements and registers the \`submit\` event, but the handler is incomplete.

The task is to complete the three points marked in the handler:

1. Prevent the form submission from reloading the page.
2. If the field is empty, show the text \`Enter a task\` in \`#message\` and add nothing.
3. If it contains text, create an \`<li>\` element with that text and append it to the end of \`#task-list\`.`,
    files: [
      { name: 'index.html', lang: 'html', code: `<form id="task-form">
  <input id="task-input" type="text" placeholder="New task">
  <button type="submit">Add</button>
</form>
<p id="message"></p>
<ul id="task-list"></ul>` },
      { name: 'app.js', lang: 'js', code: `const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");

form.addEventListener("submit", (event) => {
  // 1. Prevent the form from reloading the page

  const text = input.value.trim();

  // 2. If the text is empty, show "Enter a task" in #message
  //    and finish without adding anything

  // 3. Create an <li> with the text and append it to the end of the list

  message.textContent = "";
  input.value = "";
});` },
    ],
    edit: 'app.js',
    expected: `- Clicking **Add** with the text \`Buy bread\` makes \`<li>Buy bread</li>\` appear at the end of the list, the field is cleared and the page does not reload.
- Clicking **Add** with the field empty or containing only spaces shows \`Enter a task\` and the list does not change.`,
    hints: [
      'Review what the browser does by default when a form is submitted and which method of the \`event\` object prevents it.',
      'For point 2, an \`if\` that ends the handler with \`return\` is enough. Point 3 requires three steps: create the element, give it the text and append it to the list.',
    ],
    solution: {
      code: `form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    message.textContent = "Enter a task";
    return;
  }

  const li = document.createElement("li");
  li.textContent = text;
  list.appendChild(li);

  message.textContent = "";
  input.value = "";
});`,
      changes: ['\`event.preventDefault()\` at the start of the handler.', 'An \`if\` that shows the message and exits with \`return\` when the text is empty.', 'Creation of the \`<li>\` with \`createElement\`, text with \`textContent\` and \`appendChild\` on the list.'],
      explanation: `Submitting a form makes the browser reload the page; \`preventDefault\` cancels that behaviour so that it can be handled with JavaScript. The \`return\` inside the \`if\` prevents the rest of the handler from running. \`textContent\` inserts the text as is, without interpreting it as HTML.`,
      alternatives: '\`list.append(li)\` instead of \`appendChild\`. \`if (!text)\` instead of \`text === ""\`. Building the \`<li>\` with \`innerHTML\` also works, although \`textContent\` is preferable because it does not interpret the text as HTML.',
    },
    rubric: [
      { text: 'Calls \`event.preventDefault()\`', points: 2 },
      { text: 'Checks for empty text, shows the message and exits without adding', points: 3 },
      { text: 'Creates the \`<li>\` and assigns the text to it', points: 3 },
      { text: 'Appends the \`<li>\` to the end of \`#task-list\`', points: 2 },
    ],
    penalties: ['No \`return\` in the empty case, so that an empty \`<li>\` is added: 1 of the 3 points of the criterion is lost.', 'Replacing the whole list on every submission (\`list.innerHTML = ...\`): -2.'],
    partial: 'If the \`<li>\` is created but not appended to the list, the 3 creation points are awarded.',
  },

  // ------------------------------------------------------------------ A2
  {
    id: 'A2', kind: 'express', category: 'Bug fixing', tech: 'Express and PostgreSQL',
    title: 'Non-existent task with status 200',
    concepts: ['HTTP status codes', '404', 'return in a controller'],
    level: 'Basic', minutes: '8',
    statement: `A task API has the endpoint \`GET /tasks/:id\`. When the task exists it works correctly, but when it does not exist it responds \`200\` with the body \`null\`. A client therefore cannot distinguish between "the task exists" and "it does not exist".

The task is to fix the endpoint so that, if the task does not exist, it responds \`404\` with the body \`{ "error": "Task not found" }\`. The model is correct and must not be changed.`,
    files: [
      { name: 'models/tasksModel.js', lang: 'js', code: `const db = require("../db");

async function findById(id) {
  const { rows } = await db.query(
    "SELECT id, title, done FROM tasks WHERE id = $1",
    [id]
  );
  return rows[0] ?? null; // null if there are no rows
}

module.exports = { findById };` },
      { name: 'routes/tasks.js', lang: 'js', code: `const express = require("express");
const tasksModel = require("../models/tasksModel");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const task = await tasksModel.findById(id);
  res.status(200).json(task);
});

module.exports = router;` },
    ],
    edit: 'routes/tasks.js',
    expected: `| Request | Response |
|---|---|
| \`GET /tasks/1\` (exists) | \`200\` with \`{ "id": 1, "title": "Study SQL", "done": false }\` |
| \`GET /tasks/999\` (does not exist) | \`404\` with \`{ "error": "Task not found" }\` |`,
    hints: [
      'Review what \`findById\` returns when the query finds no rows and which HTTP status code corresponds to "the resource does not exist".',
      'The result must be checked before responding. Care must be taken not to send two responses for the same request.',
    ],
    solution: {
      code: `router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const task = await tasksModel.findById(id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});`,
      changes: ['An \`if (!task)\` that responds \`404\` with the error message.', '\`return\` on that response, so that the 200 response is not also executed.'],
      explanation: `The model returns \`null\` when there is no row, and \`null\` is valid JSON: that is why Express responded 200. The controller is the one that translates "no result" into an HTTP status code. The \`return\` is necessary because, without it, execution continues and Express tries to send a second response, which causes the error *Cannot set headers after they are sent*.`,
      alternatives: 'Using \`if (task === null)\`. Writing the success response in an \`else\` instead of using \`return\`. Keeping \`res.status(200).json(task)\` in the success case: 200 is the default code, but stating it is not a mistake.',
    },
    rubric: [
      { text: 'Checks whether \`task\` is \`null\` before responding', points: 3 },
      { text: 'Responds \`404\` with \`{ error: "Task not found" }\`', points: 3 },
      { text: 'Avoids the double response with \`return\` or with \`else\`', points: 2 },
      { text: 'Keeps the \`200\` response with the task when it exists', points: 2 },
    ],
    penalties: ['Modifying the model so that it throws an error or responds itself: -2, because the model does not know about \`res\`.', 'Using 400 or 500 instead of 404: the 3 points for the status code are not awarded.'],
    partial: 'If the response is 404 but without the specified body, 2 of the 3 points for the status code are awarded.',
  },

  // ------------------------------------------------------------------ A3
  {
    id: 'A3', kind: 'express', category: 'Bug fixing', tech: 'Express and PostgreSQL',
    title: 'The created task arrives empty',
    concepts: ['async/await', 'promises', 'model and controller'],
    level: 'Lower-intermediate', minutes: '10',
    statement: `In a task API, \`POST /tasks\` inserts the task into PostgreSQL and must return the created row. The task is saved correctly in the database, but the client receives \`201\` with the body \`{}\` instead of the task.

The task is to fix the controller so that it responds with the created task, and to explain in a comment why \`{}\` was being received. The model is correct.`,
    files: [
      { name: 'models/tasksModel.js', lang: 'js', code: `const db = require("../db");

async function create(title) {
  const { rows } = await db.query(
    "INSERT INTO tasks (title, done) VALUES ($1, false) RETURNING id, title, done",
    [title]
  );
  return rows[0];
}

module.exports = { create };` },
      { name: 'controllers/tasksController.js', lang: 'js', code: `const tasksModel = require("../models/tasksModel");

async function createTask(req, res) {
  const { title } = req.body;
  const task = tasksModel.create(title);
  res.status(201).json(task);
}

module.exports = { createTask };` },
    ],
    edit: 'controllers/tasksController.js',
    expected: `\`POST /tasks\` with the body \`{ "title": "Review JWT" }\` responds \`201\` with \`{ "id": 7, "title": "Review JWT", "done": false }\`.`,
    hints: [
      'Review what a function declared with \`async\` returns when it is called.',
      'Compare the line that calls the model with the lines in the model itself that call \`db.query\`. What does one have that the other lacks?',
    ],
    solution: {
      code: `async function createTask(req, res) {
  const { title } = req.body;
  // Without await, task was a pending promise, and a promise becomes {} when converted to JSON
  const task = await tasksModel.create(title);
  res.status(201).json(task);
}`,
      changes: ['Add \`await\` before \`tasksModel.create(title)\`.'],
      explanation: `\`create\` is an \`async\` function: calling it immediately returns a **promise**, not the row. Without \`await\`, the controller sends that promise, which becomes \`{}\` when converted to JSON. The insertion does run, which is why the task appears in the database. With \`await\`, the controller waits for the query to finish and receives the row returned by \`RETURNING\`. \`createTask\` is already \`async\`, so it can use \`await\`.`,
      alternatives: 'There is no reasonable alternative within the course conventions, which handle promises with \`async/await\`.',
    },
    rubric: [
      { text: 'Identifies that \`create\` returns a promise', points: 3 },
      { text: 'Adds \`await\` to the model call', points: 4 },
      { text: 'Keeps the \`201\` response with the task', points: 1 },
      { text: 'The comment explains why \`{}\` was being received', points: 2 },
    ],
    penalties: ['Removing \`async\` from the model or rewriting it: -2.', 'Changing the status code to 200: -1.'],
    partial: 'If the explanation mentions asynchrony but does not relate it to the promise sent as JSON, 1 of the 2 points is awarded.',
  },

  // ------------------------------------------------------------------ B2
  {
    id: 'B2', kind: 'express', category: 'Code completion', tech: 'Express and JWT',
    title: 'Authentication middleware',
    concepts: ['middleware', 'Authorization header', 'jwt.verify', '401'],
    level: 'Lower-intermediate', minutes: '10-12',
    statement: `The task routes must only serve authenticated users. The client sends the token in the header \`Authorization: Bearer <token>\`. The \`auth\` middleware is half written.

The task is to complete the three points marked:

1. If there is no header or it does not start with \`Bearer \`, respond \`401\` with \`{ "error": "Missing token" }\`.
2. Verify the token with \`process.env.JWT_SECRET\` and store its content in \`req.user\`.
3. If the token is invalid or has expired, respond \`401\` with \`{ "error": "Invalid or expired token" }\`.`,
    files: [{ name: 'middleware/auth.js', lang: 'js', code: `const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization; // "Bearer <token>"

  // 1. No header, or no "Bearer " prefix: 401 { error: "Missing token" }

  const token = header.slice(7); // removes "Bearer "

  try {
    // 2. Verify the token and store its content in req.user

    next();
  } catch (error) {
    // 3. Invalid or expired token: 401 { error: "Invalid or expired token" }
  }
}

module.exports = auth;

// Usage: router.get("/", auth, tasksController.list);` }],
    expected: `| Request | Result |
|---|---|
| No \`Authorization\` header | \`401\` with \`{ "error": "Missing token" }\` |
| \`Authorization: Bearer abc\` (fake token) | \`401\` with \`{ "error": "Invalid or expired token" }\` |
| Valid token | The controller runs and \`req.user\` contains, for example, \`{ sub: 4, role: "user", iat: …, exp: … }\` |`,
    hints: [
      'Review what \`jwt.verify\` does when the token is valid and what it does when it is not.',
      'Point 1 must end the middleware before reaching \`header.slice(7)\`: if \`header\` does not exist, that line would fail.',
    ],
    solution: {
      code: `function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.slice(7);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}`,
      changes: ['Header check with \`return\` and 401.', '\`req.user = jwt.verify(token, process.env.JWT_SECRET)\` inside the \`try\`.', '401 response in the \`catch\`.'],
      explanation: `\`jwt.verify\` checks the signature against the secret and the expiry date. If everything is correct, it returns the content of the token (the *payload*); otherwise, it **throws an error**, which is why it goes inside \`try/catch\`. Storing the payload in \`req.user\` lets the controllers know who is making the request without trusting data sent by the client. Both responses are 401 because the problem is identity: 403 is reserved for an identified user who lacks permission.`,
      alternatives: '\`if (!header?.startsWith("Bearer "))\`. Extracting the token with \`header.split(" ")[1]\`. Omitting \`return\` in the \`catch\` is acceptable, because it is the last statement of the middleware.',
    },
    rubric: [
      { text: 'Checks the header and the prefix, and responds 401 with \`return\`', points: 3 },
      { text: 'Verifies with \`jwt.verify\` and the secret from \`process.env\`', points: 3 },
      { text: 'Stores the result in \`req.user\` before \`next()\`', points: 2 },
      { text: 'Responds 401 with the specified message in the \`catch\`', points: 2 },
    ],
    penalties: ['Using \`jwt.decode\` instead of \`jwt.verify\`: the 3 verification points are not awarded, because \`decode\` does not check the signature.', 'Responding 403 instead of 401: -1 for each case.', 'Writing the secret in the code: -1.'],
    partial: 'If the \`return\` in point 1 is missing, 2 of its 3 points are awarded.',
  },

  // ------------------------------------------------------------------ D1
  {
    id: 'D1', kind: 'express', category: 'Code comprehension', tech: 'Express, PostgreSQL and JWT',
    title: 'Path of a paginated request',
    concepts: ['middleware', 'pagination with LIMIT and OFFSET', 'parameterized queries', 'owner taken from the token'],
    level: 'Lower-intermediate', minutes: '12-15',
    statement: `The following code belongs to a task API in which each user only sees their own tasks. It must not be modified: the task is to **explain how it works** by answering the five questions in the box.

A client with a valid token for the user with \`sub: 4\` sends \`GET /tasks?page=2&limit=5\`.`,
    files: [
      { name: 'routes/tasks.js', lang: 'js', code: `router.get("/", auth, tasksController.list);` },
      { name: 'controllers/tasksController.js', lang: 'js', code: `async function list(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const items = await tasksModel.findByOwner(req.user.sub, limit, offset);
  res.json({ page, limit, items });
}` },
      { name: 'models/tasksModel.js', lang: 'js', code: `async function findByOwner(userId, limit, offset) {
  const { rows } = await db.query(
    "SELECT id, title, done FROM tasks WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3",
    [userId, limit, offset]
  );
  return rows;
}` },
    ],
    answerStarter: `1. In what order do auth, list and findByOwner run, and what does each one do?

2. What values do page, limit and offset take? Which tasks does the query return?

3. What happens if the request arrives without a token? Does list run?

4. Why does the query use $1, $2 and $3 instead of concatenating the values into the SQL text?

5. Why is the user taken from req.user.sub and not from a URL or body parameter?
`,
    expected: 'Five short answers, of one to three sentences each, that explain the flow, the concrete values of this request and the reason for the two technical decisions.',
    hints: [
      'For question 1, review what passing several functions to \`router.get\` means and what \`next()\` is for.',
      'For question 2, substitute the URL values into the first three lines of \`list\`: \`req.query\` always arrives as text.',
    ],
    solution: {
      code: `1. Express runs the functions in order. auth checks the token and, if it is valid,
   stores its content in req.user and calls next(). Then list (the controller) reads
   the pagination, calls the model and responds. findByOwner (the model) runs the query
   on PostgreSQL and returns the rows.

2. page = 2, limit = 5, offset = (2 - 1) * 5 = 5. The query returns the tasks of
   user 4 ordered by id, skipping the first 5: from the sixth to the tenth.
   The response is { page: 2, limit: 5, items: [ ...up to 5 tasks ] }.

3. auth responds 401 and does not call next(), so list never runs.

4. They are parameterized queries: pg sends the values separately from the SQL text, so
   they cannot alter the query. Concatenating them would allow SQL injection.

5. The token is signed by the server, so req.user.sub is trustworthy. An id in the URL
   or in the body is chosen by the client and would allow viewing another user's tasks.`,
      changes: ['Not applicable: this is a comprehension exercise.'],
      explanation: `\`Number(req.query.page) || 1\` converts the text to a number and uses 1 if the result is invalid (\`NaN\`) or 0; \`Math.max\` and \`Math.min\` bound the values so that \`limit\` stays between 1 and 50. \`ORDER BY\` is necessary for stable pagination: without an order, PostgreSQL does not guarantee which rows fall on each page.`,
      alternatives: 'Any equivalent explanation in other words. For question 2 it is enough to state that tasks 6 to 10 of the user are returned.',
    },
    rubric: [
      { text: 'Question 1: correct order and role of \`next()\`', points: 2 },
      { text: 'Question 2: values of \`page\`, \`limit\` and \`offset\`, and which rows are returned', points: 3 },
      { text: 'Question 3: 401 and the controller does not run', points: 1.5 },
      { text: 'Question 4: parameterized queries versus SQL injection', points: 2 },
      { text: 'Question 5: the owner comes from the signed token', points: 1.5 },
    ],
    penalties: ['Stating that \`offset\` is 10: -1.', 'Confusing 401 with 403 in question 3: -0.5.'],
    partial: 'In question 2, if \`offset\` is correct but there is no explanation of which rows are returned, 2 of the 3 points are awarded.',
  },

  // ------------------------------------------------------------------ A4
  {
    id: 'A4', kind: 'react', category: 'Bug fixing', tech: 'React',
    title: 'The task is not crossed out when clicked',
    concepts: ['useState', 'state immutability', 'map with spread'],
    level: 'Lower-intermediate', minutes: '10',
    statement: `A component displays a list of tasks. Clicking a task should cross it out or remove the strikethrough, but nothing happens on screen. If the array is inspected with \`console.log\`, the value of \`done\` has indeed changed.

The task is to fix the \`toggle\` function so that the screen updates, without changing the rest of the component.`,
    files: [{ name: 'TaskList.jsx', lang: 'jsx', code: `import { useState } from "react";

const INITIAL = [
  { id: 1, title: "Read the guide", done: false },
  { id: 2, title: "Take the quiz", done: false },
];

function TaskList() {
  const [tasks, setTasks] = useState(INITIAL);

  function toggle(id) {
    const task = tasks.find((t) => t.id === id);
    task.done = !task.done;
    setTasks(tasks);
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li
          key={task.id}
          onClick={() => toggle(task.id)}
          style={{ textDecoration: task.done ? "line-through" : "none" }}
        >
          {task.title}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;` }],
    expected: 'Clicking "Read the guide" crosses it out; clicking it again removes the strikethrough. The other tasks do not change.',
    hints: [
      'Review how React decides whether to re-render a component when the function that updates a state is called.',
      '\`setTasks\` receives exactly the same array it already had, even though its content has been modified. It needs to be given a new array.',
    ],
    solution: {
      code: `function toggle(id) {
  setTasks(
    tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
  );
}`,
      changes: ['Replace the direct modification with a \`map\` that creates a new array.', 'Create a new object for the clicked task with \`{ ...t, done: !t.done }\`.'],
      explanation: `React compares the new state with the previous one by **reference**. The original code modified the object and passed the same array again, so React considered that nothing had changed and did not re-render. State must be treated as immutable: a new array is created, and a new object for the element that changes.`,
      alternatives: 'Copying the array and the object before modifying them: \`const copy = tasks.map((t) => ({ ...t }));\`, changing \`done\` in the copy and calling \`setTasks(copy)\`. Using the functional form \`setTasks((prev) => prev.map(...))\` is also correct.',
    },
    rubric: [
      { text: 'Identifies that the state is modified directly and the same reference is passed', points: 3 },
      { text: 'Passes a new array to \`setTasks\`', points: 3 },
      { text: 'Creates a new object for the modified task, without mutating the original', points: 2 },
      { text: 'Only the clicked task changes', points: 2 },
    ],
    penalties: ['Forcing the re-render with a second auxiliary state: the 3-point and 2-point criteria are not awarded.', 'Copying the array with \`[...tasks]\` but still mutating the object: the 2 points for the new object are lost.'],
    partial: '\`setTasks([...tasks])\` after mutating the object makes the screen update: 3 + 3 + 2 points are awarded, but not the 2 points for not mutating the original.',
  },

  // ------------------------------------------------------------------ B3
  {
    id: 'B3', kind: 'react', category: 'Code completion', tech: 'React and Axios',
    title: 'Loading the tasks from the API',
    concepts: ['useEffect', 'async/await', 'try/catch/finally', 'data, loading and error'],
    level: 'Lower-intermediate', minutes: '10',
    statement: `The \`TaskList\` component must request the tasks from the API when it mounts and display one of three branches: loading, error or list. The states, the effect and the rendering are already written; the body of the \`load\` function is missing.

The task is to complete \`load\` so that it:

1. Requests \`GET /tasks\` with the \`api\` client.
2. Stores the received data in \`tasks\`.
3. If the request fails, stores the message \`The tasks could not be loaded\` in \`error\`.
4. Turns \`loading\` off whether the request succeeds or fails.`,
    files: [
      { name: 'api.js', lang: 'js', code: `import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default api;` },
      { name: 'TaskList.jsx', lang: 'jsx', code: `import { useEffect, useState } from "react";
import api from "./api.js";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      // Complete
    }
    load();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}

export default TaskList;` },
    ],
    edit: 'TaskList.jsx',
    expected: `- While the response is on its way, \`Loading…\` is shown.
- If the API responds with \`[{ "id": 1, "title": "Read the guide" }]\`, a list with "Read the guide" is shown.
- If the API does not respond or returns a 4xx or 5xx error, \`The tasks could not be loaded\` is shown and the screen never stays on \`Loading…\`.`,
    hints: [
      'Review the three-state pattern from lab 9 and which block of \`try/catch/finally\` always runs.',
      'With Axios, the data is in a specific property of the response, and any 4xx or 5xx status code makes \`await\` throw an error.',
    ],
    solution: {
      code: `async function load() {
  try {
    const response = await api.get("/tasks");
    setTasks(response.data);
  } catch (err) {
    setError("The tasks could not be loaded");
  } finally {
    setLoading(false);
  }
}`,
      changes: ['\`await api.get("/tasks")\` inside \`try\` and \`setTasks(response.data)\`.', '\`setError\` with the message in \`catch\`.', '\`setLoading(false)\` in \`finally\`.'],
      explanation: `Axios returns the already parsed JSON in \`response.data\` and throws an error on any 4xx or 5xx response or if there is no connection, which is why a single \`catch\` covers every failure. \`finally\` runs in both cases: if \`setLoading(false)\` were only in the \`try\`, an error would leave the screen loading forever. The \`async\` function is declared inside the effect because the effect cannot be \`async\`: React expects it not to return a promise.`,
      alternatives: 'Destructuring the response: \`const { data } = await api.get("/tasks"); setTasks(data);\`. Placing \`setLoading(false)\` at the end of both the \`try\` and the \`catch\` instead of in \`finally\` is functionally equivalent, although \`finally\` is the form seen in class.',
    },
    rubric: [
      { text: 'Makes the request with \`await api.get("/tasks")\`', points: 3 },
      { text: 'Stores \`response.data\` in \`tasks\`', points: 2 },
      { text: 'Handles the error with \`try/catch\` and the specified message', points: 2.5 },
      { text: 'Turns \`loading\` off in every case', points: 2.5 },
    ],
    penalties: ['Using \`fetch\` or \`.then\` instead of the client and \`async/await\`: -1, for not following the course convention.', 'Storing the whole \`response\` instead of \`response.data\`: the 2 points are not awarded.', 'Making the \`useEffect\` callback \`async\`: -1.'],
    partial: 'If \`setLoading(false)\` is only in the \`try\`, 1 of the 2.5 points of that criterion is awarded.',
  },

  // ------------------------------------------------------------------ C1
  {
    id: 'C1', kind: 'react', category: 'Integration', tech: 'React Router',
    title: 'Task detail page',
    concepts: ['Routes and Route', 'routes with parameters', 'Link', 'useParams'],
    level: 'Basic', minutes: '8',
    statement: `A React application already has \`BrowserRouter\` in \`main.jsx\`, a task list and a finished \`TaskDetail\` component. They still need to be connected.

The task is to complete the three points marked so that clicking a task in the list navigates to \`/tasks/:id\` and shows its detail.`,
    files: [
      { name: 'data.js', lang: 'js', code: `export const TASKS = [
  { id: 1, title: "Read the guide", done: false },
  { id: 2, title: "Take the quiz", done: true },
];` },
      { name: 'App.jsx', lang: 'jsx', code: `import { Routes, Route } from "react-router";
import TaskList from "./TaskList.jsx";
import TaskDetail from "./TaskDetail.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskList />} />
      {/* 1. Detail route: /tasks/:id */}
    </Routes>
  );
}

export default App;` },
      { name: 'TaskList.jsx', lang: 'jsx', code: `import { Link } from "react-router";
import { TASKS } from "./data.js";

function TaskList() {
  return (
    <ul>
      {TASKS.map((task) => (
        <li key={task.id}>
          {/* 2. Link to /tasks/<id> with the task title */}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;` },
      { name: 'TaskDetail.jsx', lang: 'jsx', code: `import { useParams } from "react-router";
import { TASKS } from "./data.js";

function TaskDetail() {
  // 3. Read the id from the URL
  const id = null;

  const task = TASKS.find((t) => t.id === Number(id));
  if (!task) return <p>Task not found</p>;

  return <h1>{task.title}</h1>;
}

export default TaskDetail;` },
    ],
    edit: 'TaskDetail.jsx',
    answerStarter: `// App.jsx · point 1


// TaskList.jsx · point 2


// TaskDetail.jsx · point 3
`,
    expected: `- At \`/\` the list is shown; each title is a link.
- Clicking "Take the quiz" changes the URL to \`/tasks/2\` without reloading the page and the title is shown in an \`<h1>\`.
- At \`/tasks/99\`, \`Task not found\` is shown.`,
    hints: [
      'Review how a variable part of the path is declared in \`<Route>\` and which hook reads it afterwards.',
      'The \`to\` of the link is built from the \`id\` of each task. Also note why \`TaskDetail\` uses \`Number(id)\`.',
    ],
    solution: {
      code: `// App.jsx · point 1
<Route path="/tasks/:id" element={<TaskDetail />} />

// TaskList.jsx · point 2
<Link to={\`/tasks/\${task.id}\`}>{task.title}</Link>

// TaskDetail.jsx · point 3
const { id } = useParams();`,
      changes: ['A \`<Route>\` with the \`:id\` parameter that renders \`TaskDetail\`.', 'A \`<Link>\` with the path built from \`task.id\`.', '\`useParams()\` to read \`id\`.'],
      explanation: `\`:id\` declares a variable segment: React Router matches it against any value and exposes it through \`useParams\`. Parameters always arrive as **text**, which is why \`TaskDetail\` converts them with \`Number\` before comparing them with the numeric \`id\`. \`Link\` changes the URL without reloading the page, which is what distinguishes an SPA; an \`<a href>\` would also navigate, but by reloading the whole application.`,
      alternatives: '\`<Link to={"/tasks/" + task.id}>\`. Reading the parameter with \`const params = useParams();\` and using \`params.id\`.',
    },
    rubric: [
      { text: 'Declares the \`/tasks/:id\` route with \`element={<TaskDetail />}\`', points: 3 },
      { text: 'Uses \`<Link>\` with the \`to\` built from \`task.id\`', points: 3 },
      { text: 'Shows the title inside the link', points: 1 },
      { text: 'Reads the \`id\` with \`useParams\`', points: 3 },
    ],
    penalties: ['Using \`<a href>\` instead of \`<Link>\`: 1 of the 3 points of the criterion is awarded.', 'Writing the route without the colon (\`/tasks/id\`): the 3 points for the route are not awarded.'],
    partial: 'If the \`to\` is written with single quotes and \`\${}\` without backticks, the link does not work: 1 of the 3 points is awarded.',
  },

  // ------------------------------------------------------------------ C2
  {
    id: 'C2', kind: 'react', category: 'Integration', tech: 'React and Axios',
    title: '"Delete" button connected to the API',
    concepts: ['events in React', 'API call with async/await', 'updating state with filter'],
    level: 'Lower-intermediate', minutes: '10',
    statement: `A task list has a "Delete" button on each row, but it does nothing. The API client already includes the function \`deleteTask(id)\`, which sends \`DELETE /tasks/:id\`.

The task is to:

1. Connect each button to \`handleDelete\`, passing it the \`id\` of its task.
2. Complete \`handleDelete\` so that it deletes the task in the API and, if that succeeds, removes it from the list on screen.
3. If the request fails, store \`The task could not be deleted\` in \`error\` and leave the list as it was.`,
    files: [
      { name: 'api.js', lang: 'js', code: `import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export async function deleteTask(id) {
  await api.delete(\`/tasks/\${id}\`);
}` },
      { name: 'TaskItems.jsx', lang: 'jsx', code: `import { useState } from "react";
import { deleteTask } from "./api.js";

function TaskItems({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [error, setError] = useState(null);

  async function handleDelete(id) {
    // 2 and 3. Complete
  }

  return (
    <>
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button>Delete</button> {/* 1. Connect */}
          </li>
        ))}
      </ul>
    </>
  );
}

export default TaskItems;` },
    ],
    edit: 'TaskItems.jsx',
    expected: `- Clicking "Delete" on task 3 sends \`DELETE /tasks/3\` and the task disappears from the list without reloading.
- If the API responds with an error, the task stays in the list and \`The task could not be deleted\` appears.
- Nothing is deleted when the page loads: deletion only happens on click.`,
    hints: [
      'Review how a handler with arguments is passed to \`onClick\` without running it during rendering.',
      'Removing the task from the state requires a new array with every task except one: an array method does this in one line. The on-screen removal must come after the \`await\`.',
    ],
    solution: {
      code: `async function handleDelete(id) {
  try {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  } catch (err) {
    setError("The task could not be deleted");
  }
}

// ...
<button onClick={() => handleDelete(task.id)}>Delete</button>`,
      changes: ['\`onClick={() => handleDelete(task.id)}\` on the button.', '\`await deleteTask(id)\` inside \`try\`.', '\`setTasks\` with \`filter\` after the \`await\`.', '\`setError\` in \`catch\`.'],
      explanation: `\`onClick\` needs a **function**. \`onClick={handleDelete(task.id)}\` would call the function on every render and delete every task on load; the arrow function delays the call until the click. The state is updated only after the API confirms the deletion: if it were done before, an error would leave the screen showing something that does not match the server. \`filter\` returns a new array, so React detects the change.`,
      alternatives: 'The functional form \`setTasks((prev) => prev.filter((t) => t.id !== id))\`. Removing the task on screen first and restoring the list in the \`catch\` is also valid if done correctly.',
    },
    rubric: [
      { text: 'Connects the button with an arrow function that passes \`task.id\`', points: 3 },
      { text: 'Calls \`await deleteTask(id)\`', points: 2 },
      { text: 'Removes the task from the state with a new array', points: 3 },
      { text: 'Handles the error without removing the task', points: 2 },
    ],
    penalties: ['\`onClick={handleDelete(task.id)}\`: the 3 points for the button are not awarded.', 'Removing the task with \`splice\` on \`tasks\`: the 3 points for the state are not awarded.', 'Updating the list before the \`await\` without restoring it in the \`catch\`: -1.'],
    partial: 'If the task is deleted in the API but does not disappear from the screen, the 3-point and 2-point criteria are awarded.',
  },
  // ------------------------------------------------------------------ C3
  {
    id: 'C3', kind: 'react', category: 'Integration', tech: 'React and Context API',
    title: 'Reading the session from the Context',
    concepts: ['Context API', 'Provider', 'useContext', 'prop drilling'],
    level: 'Lower-intermediate', minutes: '10',
    statement: `An application already has a finished \`AuthContext\`, with the \`useAuth\` hook, identical to the one seen in class. It still needs to be connected: the Provider does not yet wrap the application and the navigation bar does not read the session.

The task is to complete the three points marked, without passing the session through props:

1. In \`main.jsx\`, make the session available to the whole application.
2. In \`NavBar.jsx\`, import what is needed to read the session.
3. In \`NavBar.jsx\`, obtain \`isLoggedIn\` and \`signOut\` from the session.`,
    files: [
      { name: 'auth/AuthContext.jsx', lang: 'jsx', code: `import { createContext, useContext, useState } from "react";
import api from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  async function signIn(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
  }

  function signOut() {
    localStorage.removeItem("token");
    setToken(null);
  }

  const value = { isLoggedIn: Boolean(token), signIn, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);` },
      { name: 'main.jsx', lang: 'jsx', code: `import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./auth/AuthContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* 1. Make the session available to the whole application */}
    <App />
  </BrowserRouter>
);` },
      { name: 'NavBar.jsx', lang: 'jsx', code: `import { Link } from "react-router";
// 2. Import what is needed to read the session

function NavBar() {
  // 3. Obtain isLoggedIn and signOut from the session (replace this line)
  const isLoggedIn = false;

  return (
    <nav>
      <Link to="/tasks">Tasks</Link>
      {isLoggedIn
        ? <button onClick={signOut}>Sign out</button>
        : <Link to="/login">Sign in</Link>}
    </nav>
  );
}

export default NavBar;` },
    ],
    edit: 'NavBar.jsx',
    answerStarter: `// main.jsx · point 1


// NavBar.jsx · point 2


// NavBar.jsx · point 3
`,
    expected: `- Without a session, the bar shows the **Sign in** link.
- After signing in on the login screen, which already uses \`signIn\`, the bar shows **Sign out** without reloading the page.
- Clicking **Sign out** makes **Sign in** appear again.
- \`NavBar\` receives no props.`,
    hints: [
      'Review the three pieces of Context: where it is created, which component holds the value and which hook reads it.',
      'The Provider must wrap the components that read the value, and in the course it goes inside the router. In \`NavBar\`, the shortcut exported by \`AuthContext.jsx\` returns an object that can be destructured.',
    ],
    solution: {
      code: `// main.jsx · point 1
<BrowserRouter>
  <AuthProvider>
    <App />
  </AuthProvider>
</BrowserRouter>

// NavBar.jsx · point 2
import { useAuth } from "./auth/AuthContext.jsx";

// NavBar.jsx · point 3
const { isLoggedIn, signOut } = useAuth();`,
      changes: ['\`AuthProvider\` wrapping \`App\`, inside \`BrowserRouter\`.', 'Import of \`useAuth\` in \`NavBar.jsx\`.', '\`const { isLoggedIn, signOut } = useAuth();\` instead of the fixed constant.'],
      explanation: `Context has three pieces: \`createContext\` creates the Context, the **Provider** holds the value and \`useContext\` reads it. A component can only read the value if it is **inside** the Provider; outside it would receive the default value, \`null\`, and the destructuring would fail. The Provider goes inside \`BrowserRouter\` so that its components can use navigation, and it wraps \`App\` so that the menu, the login screen and the protected routes can read it. In this way \`NavBar\` obtains the session directly, without \`App\` and the intermediate components having to pass it through props (*prop drilling*). When \`signIn\` or \`signOut\` change the token, every component that reads the Context re-renders.`,
      alternatives: 'Exporting \`AuthContext\` from its file and reading it with \`useContext(AuthContext)\` instead of \`useAuth\`. Reading the whole object (\`const auth = useAuth();\`) and using \`auth.isLoggedIn\` and \`auth.signOut\`.',
    },
    rubric: [
      { text: '\`AuthProvider\` wraps \`App\`', points: 3 },
      { text: 'The Provider sits inside \`BrowserRouter\`', points: 1 },
      { text: 'Imports \`useAuth\` from \`AuthContext.jsx\`', points: 1 },
      { text: 'Obtains \`isLoggedIn\` and \`signOut\` with \`useAuth()\`', points: 3 },
      { text: 'Does not pass the session through props', points: 2 },
    ],
    penalties: ['Calling \`useAuth\` outside a component or inside an \`if\`: the 3 reading points are not awarded, because it breaks the rules of hooks.', 'Creating a second \`AuthContext\` or a separate session state in \`NavBar\`: the 2 points of the last criterion are not awarded.'],
    partial: 'If only `isLoggedIn` is obtained and `signOut` is missing, 2 of the 3 reading points are awarded.',
  },
  {
    id: 'A5', kind: 'js', category: 'Bug fixing', tech: 'JavaScript', title: 'Student initials',
    concepts: ['forEach versus map', 'return value'], level: 'Basic', minutes: '6-8',
    statement: `The function \`getInitials\` must return an array with the initials of each full name, in uppercase and separated by a full stop. Running it prints \`undefined\`.

The task is to fix the function and explain the bug in a comment.`,
    files: [{ name: 'initials.js', lang: 'js', code: `const students = ["ana garcía", "luis pérez", "marta ruiz"];

function getInitials(names) {
  return names.forEach((fullName) => {
    const [first, last] = fullName.split(" ");
    return first[0].toUpperCase() + "." + last[0].toUpperCase();
  });
}

console.log(getInitials(students));` }],
    expected: '`getInitials(students)` returns `[ "A.G", "L.P", "M.R" ]`.',
    hints: ['Review what `forEach` returns and which array method builds a new array from what the callback returns.', 'The body of the callback is correct: the problem is the method that iterates over the array.'],
    solution: {
      code: `function getInitials(names) {
  // forEach always returns undefined; map returns an array with what the callback returns
  return names.map((fullName) => {
    const [first, last] = fullName.split(" ");
    return first[0].toUpperCase() + "." + last[0].toUpperCase();
  });
}`,
      changes: ['Replace \`forEach\` with \`map\`.'],
      explanation: '`forEach` runs the callback for each element but always returns `undefined`: the values returned by the callback are lost. `map` collects them in a new array of the same length.',
      alternatives: 'Creating an empty array, calling `push` inside the `forEach` and returning that array at the end.',
    },
    rubric: [
      { text: 'Identifies that \`forEach\` returns \`undefined\`', points: 3 },
      { text: 'Uses \`map\` or an accumulated array that is returned', points: 5 },
      { text: 'The comment explains the difference', points: 2 },
    ],
    penalties: ['Rewriting the initials logic unnecessarily and introducing a formatting error: -2.'],
    partial: 'If `push` is used inside the `forEach` but the array is not returned, the 3 identification points are awarded.',
  },
  {
    id: 'A6', kind: 'react', category: 'Bug fixing', tech: 'React and Axios', title: 'Endless requests',
    concepts: ['useEffect', 'dependency array', 'rendering'], level: 'Lower-intermediate', minutes: '8',
    statement: `The \`ProductList\` component loads the products from the API and displays them. It works, but the browser's *Network* tab shows that \`GET /products\` is sent over and over again, without stopping.

The task is to fix the bug and explain in a comment why the request was being repeated.`,
    files: [{ name: 'ProductList.jsx', lang: 'jsx', code: `import { useEffect, useState } from "react";
import api from "./api.js";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const response = await api.get("/products");
      setProducts(response.data);
    }
    load();
  });

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

export default ProductList;` }],
    expected: 'When the component loads, a single `GET /products` request is sent and the list is displayed.',
    hints: ['Review when an effect runs depending on its second argument.', 'Follow the chain: the effect updates the state, the state triggers a render and, after each render, what happens to this effect?'],
    solution: {
      code: `useEffect(() => {
  async function load() {
    const response = await api.get("/products");
    setProducts(response.data);
  }
  load();
}, []); // without the array, the effect ran after every render, and setProducts triggered another one`,
      changes: ['Add the empty dependency array \`[]\` as the second argument of \`useEffect\`.'],
      explanation: 'Without a second argument, the effect runs after every render. Since the effect calls `setProducts` with a new array, it triggers another render, which runs the effect again: a loop of requests. With `[]`, the effect only runs when the component mounts.',
      alternatives: 'There is no other reasonable fix within what is covered in the course.',
    },
    rubric: [
      { text: 'Adds \`[]\` as the second argument', points: 5 },
      { text: 'Explains that without the array the effect runs after every render', points: 3 },
      { text: 'Relates \`setProducts\` to the new render', points: 2 },
    ],
    penalties: ['Using \`[products]\` as the dependency: the 5 points are not awarded, because the loop continues.'],
    partial: 'If the explanation mentions rendering but not the role of `setProducts`, the 3 points of the second criterion are awarded.',
  },
  {
    id: 'A7', kind: 'express', category: 'Bug fixing', tech: 'Express and PostgreSQL', title: 'Vulnerable query',
    concepts: ['SQL injection', 'parameterized queries', 'req.query'], level: 'Lower-intermediate', minutes: '8-10',
    statement: `The endpoint \`GET /users?email=...\` looks up a user by email. It works with normal emails, but an audit has found that it is vulnerable to **SQL injection**: with \`?email=' OR '1'='1\` it returns the first user in the table.

The task is to fix the query without changing the normal behaviour of the endpoint.`,
    files: [{ name: 'routes/users.js', lang: 'js', code: `const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = express.Router();

router.get("/", async (req, res) => {
  const email = req.query.email;
  const { rows } = await pool.query(
    \`SELECT id, email FROM users WHERE email = '\${email}'\`
  );
  res.json(rows[0] ?? null);
});

module.exports = router;` }],
    expected: '`GET /users?email=ana@cunef.edu` returns that user. `GET /users?email=\' OR \'1\'=\'1` returns `null`, because no user has that text as their email.',
    hints: ['Review how values are passed to `pool.query` in labs 6 and 7.', 'The SQL text must not contain any data coming from the request: the value goes in a second argument.'],
    solution: {
      code: `router.get("/", async (req, res) => {
  const email = req.query.email;
  const { rows } = await pool.query(
    "SELECT id, email FROM users WHERE email = $1",
    [email]
  );
  res.json(rows[0] ?? null);
});`,
      changes: ['Replace the template with \`\${email}\` with the placeholder \`$1\`.', 'Pass \`[email]\` as the second argument of \`pool.query\`.'],
      explanation: `When the email is interpolated into the text, the quotes sent by the attacker close the SQL string and add an always-true condition: \`WHERE email = '' OR '1'='1'\`. With \`$1\`, \`pg\` sends the value separately and PostgreSQL always treats it as data, never as part of the query.`,
      alternatives: 'There is no acceptable alternative: escaping quotes by hand is not considered a secure fix.',
    },
    rubric: [
      { text: 'Uses the \`$1\` placeholder in the SQL text', points: 4 },
      { text: 'Passes the value in the parameter array', points: 4 },
      { text: 'Keeps the normal behaviour (\`rows[0] ?? null\`)', points: 2 },
    ],
    penalties: ['Trying to filter or escape quotes by hand instead of parameterizing: the first 8 points are not awarded.'],
    partial: 'If `$1` is used but the parameter array is missing, the 4 points for the placeholder are awarded.',
  },
  {
    id: 'B4', kind: 'js', category: 'Code completion', tech: 'JavaScript', title: 'Inventory value',
    concepts: ['filter', 'loops', 'accumulators'], level: 'Basic', minutes: '8',
    statement: `A shop stores its products in an array. The task is to complete the function \`stockValue\` so that it returns the total value of the inventory: the sum of \`price * units\` for the products with \`units\` greater than 0.

The array received must not be modified.`,
    files: [{ name: 'inventory.js', lang: 'js', code: `const products = [
  { name: "Keyboard", price: 30, units: 4 },
  { name: "Mouse", price: 15, units: 0 },
  { name: "Monitor", price: 120, units: 2 },
];

function stockValue(list) {
  // Complete
}

console.log(stockValue(products)); // 360` }],
    expected: '`stockValue(products)` returns `360` (30·4 + 120·2). With an empty array it returns `0`.',
    hints: ['A variable that starts at 0 and accumulates is needed.', 'The array can be traversed with `for...of`, adding only when `units > 0`, or filtered first with `filter`.'],
    solution: {
      code: `function stockValue(list) {
  let total = 0;
  for (const product of list) {
    if (product.units > 0) {
      total += product.price * product.units;
    }
  }
  return total;
}`,
      changes: ['An accumulator \`total\` starting at 0.', 'A traversal of the array that adds \`price * units\` for the products with units.', '\`return total\`.'],
      explanation: 'The accumulator allows the sum to be computed in a single traversal. The condition leaves out the products without units; in this case their contribution would be 0 anyway, but the statement explicitly asks for them to be filtered. The function does not modify `list`.',
      alternatives: '`list.filter((p) => p.units > 0)` followed by a `for...of` over the result. A `forEach` with the same accumulator.',
    },
    rubric: [
      { text: 'Initializes an accumulator to 0', points: 2 },
      { text: 'Traverses all the products', points: 2 },
      { text: 'Adds \`price * units\` only for the products with units', points: 4 },
      { text: 'Returns the total', points: 2 },
    ],
    penalties: ['Modifying the array received: -2.'],
    partial: 'If `price` is added instead of `price * units`, the points for the accumulator, the traversal and the `return` are awarded.',
  },
  {
    id: 'B5', kind: 'react', category: 'Code completion', tech: 'React', title: 'Counter that does not go below zero',
    concepts: ['useState', 'events', 'conditional rendering'], level: 'Basic', minutes: '8-10',
    statement: `The task is to complete the \`Counter\` component so that:

1. It shows the current value in a paragraph.
2. The **+1** button adds one.
3. The **-1** button subtracts one, but the value never goes below 0.`,
    files: [{ name: 'Counter.jsx', lang: 'jsx', code: `import { useState } from "react";

function Counter() {
  // 1. Counter state, starting at 0

  return (
    <div>
      <p>{/* value */}</p>
      <button>-1</button>
      <button>+1</button>
    </div>
  );
}

export default Counter;` }],
    expected: 'On load, `0` is shown. Three clicks on **+1** show `3`. With the value at `0`, clicking **-1** leaves it at `0`.',
    hints: ['The value that changes and must be shown on screen is state: `useState`.', 'To avoid going below 0, a condition before updating, or `Math.max(0, ...)`, is enough.'],
    solution: {
      code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(Math.max(0, count - 1))}>-1</button>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}`,
      changes: ['\`useState(0)\`.', 'The value in the paragraph.', 'An \`onClick\` on each button; the subtract button does not go below 0.'],
      explanation: 'Each call to `setCount` with a different value triggers a new render with the updated value. `Math.max(0, count - 1)` returns 0 if the subtraction would be negative.',
      alternatives: '`if (count > 0) setCount(count - 1);` in a separate function. The functional form `setCount((c) => c + 1)`. Disabling the button with `disabled={count === 0}` also meets the requirement.',
    },
    rubric: [
      { text: 'Declares the state with \`useState(0)\`', points: 2 },
      { text: 'Shows the value', points: 1 },
      { text: 'The +1 button updates the state', points: 3 },
      { text: 'The -1 button subtracts without going below 0', points: 4 },
    ],
    penalties: ['Using a plain variable instead of state: the criteria for the buttons are not awarded.', '\`onClick={setCount(count + 1)}\`: -2, because it runs on render.'],
    partial: 'If the -1 button subtracts but allows negative values, 2 of its 4 points are awarded.',
  },
  {
    id: 'B6', kind: 'express', category: 'Code completion', tech: 'Express and PostgreSQL', title: 'Deleting a product',
    concepts: ['DELETE', 'rowCount', '204 and 404', 'parameterized query'], level: 'Lower-intermediate', minutes: '10',
    statement: `The task is to complete the endpoint \`DELETE /products/:id\` so that it deletes the product from the \`products\` table:

- If it existed, respond \`204\` with no body.
- If it did not exist, respond \`404\` with \`{ "error": "Product not found" }\`.

Database errors do not need to be handled.`,
    files: [{ name: 'routes/products.js', lang: 'js', code: `const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = express.Router();

router.delete("/:id", async (req, res) => {
  // Complete
});

module.exports = router;

// Note: the result of pool.query includes rowCount,
// the number of rows affected by the query.` }],
    expected: '`DELETE /products/3` (exists) responds `204`. Repeating the same request responds `404` with `{ "error": "Product not found" }`.',
    hints: ['Review which status codes are used for "deleted, with no content to return" and for "does not exist".', '`rowCount` indicates how many rows the `DELETE` has removed: if it is 0, the product did not exist.'],
    solution: {
      code: `router.delete("/:id", async (req, res) => {
  const result = await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(204).end();
});`,
      changes: ['\`DELETE\` parameterized with \`$1\`.', 'Check of \`rowCount\` with a 404 response.', '204 response with \`end()\`.'],
      explanation: 'A `DELETE` that finds no rows is not an error for PostgreSQL: it simply affects 0 rows. `rowCount` allows the two cases to be distinguished without a prior query. 204 indicates success with no body, which is why `end()` is used and not `json()`.',
      alternatives: 'Adding `RETURNING id` and checking `result.rows.length`. Running a `SELECT` first to check that it exists, although that means two queries. `res.sendStatus(204)`.',
    },
    rubric: [
      { text: 'Parameterized \`DELETE\` query', points: 3 },
      { text: 'Uses \`await\` with the query', points: 1 },
      { text: 'Detects that it did not exist (\`rowCount\` or equivalent) and responds 404', points: 3 },
      { text: 'Responds 204 with no body when deleted', points: 3 },
    ],
    penalties: ['Concatenating the \`id\` into the SQL text: the 3 points for the query are not awarded.', 'Responding 200 with a message instead of 204: -1.'],
    partial: 'If it always responds 204, without distinguishing the non-existent case, the points for the query, the `await` and the 204 are awarded.',
  },
  {
    id: 'B7', kind: 'react', category: 'Code completion', tech: 'React', title: 'Controlled form',
    concepts: ['controlled input', 'props with functions', 'onSubmit'], level: 'Lower-intermediate', minutes: '10',
    statement: `The \`NewTaskForm\` component receives the prop \`onAdd\`, a function from the parent component. The task is to complete it so that:

1. The text field is an *input* controlled by the \`title\` state.
2. Submitting the form does not reload the page, calls \`onAdd\` with the title without surrounding spaces and clears the field.
3. The button is disabled while the field is empty.`,
    files: [{ name: 'NewTaskForm.jsx', lang: 'jsx', code: `import { useState } from "react";

function NewTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");

  function handleSubmit(event) {
    // 2. Complete
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="New task" /> {/* 1. Complete */}
      <button type="submit">Add</button> {/* 3. Complete */}
    </form>
  );
}

export default NewTaskForm;` }],
    expected: 'Typing "  Review SQL  " and clicking **Add** makes the parent receive `onAdd("Review SQL")`, the field is cleared and the page does not reload. With the field empty, the button cannot be clicked.',
    hints: ['A controlled *input* needs `value` and `onChange`.', 'In `handleSubmit`: first `preventDefault`, then the call to the parent and finally clearing the state. For the button, the attribute is `disabled`.'],
    solution: {
      code: `function handleSubmit(event) {
  event.preventDefault();
  onAdd(title.trim());
  setTitle("");
}

// ...
<input
  placeholder="New task"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
<button type="submit" disabled={title.trim() === ""}>Add</button>`,
      changes: ['\`value\` and \`onChange\` on the *input*.', '\`preventDefault\`, \`onAdd(title.trim())\` and \`setTitle("")\` in \`handleSubmit\`.', '\`disabled\` on the button.'],
      explanation: 'In a controlled *input*, React is the source of truth: the visible value comes from the state and each keystroke updates it through `onChange`. That is why clearing the state clears the field. The child does not add the task itself: it notifies the parent through the function it receives via props.',
      alternatives: '`disabled={!title.trim()}`. Checking inside `handleSubmit` that the title is not empty, in addition to disabling the button.',
    },
    rubric: [
      { text: '\`value\` and \`onChange\` connected to the state', points: 3 },
      { text: '\`preventDefault\` on submission', points: 1.5 },
      { text: 'Calls \`onAdd\` with the trimmed title', points: 2.5 },
      { text: 'Clears the field after adding', points: 1 },
      { text: 'Disables the button when the field is empty', points: 2 },
    ],
    penalties: ['Reading the value with \`document.querySelector\` instead of the state: the 3 points for the *input* are not awarded.'],
    partial: 'If `onAdd(title)` is called without trimming the spaces, 1.5 of the 2.5 points are awarded.',
  },
  {
    id: 'B8', kind: 'express', category: 'Code completion', tech: 'Express and PostgreSQL', title: 'Creating a product with validation',
    concepts: ['req.body', '400', 'INSERT ... RETURNING', '201'], level: 'Lower-intermediate', minutes: '12',
    statement: `The task is to complete \`POST /products\`:

1. If \`name\` is not a non-empty string or \`price\` is not a number greater than or equal to 0, respond \`400\` with \`{ "error": "Invalid product" }\`.
2. If the data is valid, insert the product into \`products\` and respond \`201\` with the created row.

The table has the columns \`id\` (generated), \`name\` and \`price\`. The app already uses \`express.json()\`.`,
    files: [{ name: 'routes/products.js', lang: 'js', code: `const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, price } = req.body;

  // 1. Validate

  // 2. Insert and respond
});

module.exports = router;` }],
    expected: `| Body | Response |
|---|---|
| \`{ "name": "Lamp", "price": 25 }\` | \`201\` with \`{ "id": 9, "name": "Lamp", "price": 25 }\` |
| \`{ "name": "", "price": 25 }\` | \`400\` with \`{ "error": "Invalid product" }\` |
| \`{ "name": "Chair", "price": -3 }\` | \`400\` with \`{ "error": "Invalid product" }\` |`,
    hints: ['The validation must end the request with `return` if the data is not valid.', '`RETURNING` makes the `INSERT` return the created row in `rows`.'],
    solution: {
      code: `router.post("/", async (req, res) => {
  const { name, price } = req.body;

  if (typeof name !== "string" || name.trim() === "" || typeof price !== "number" || price < 0) {
    return res.status(400).json({ error: "Invalid product" });
  }

  const { rows } = await pool.query(
    "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id, name, price",
    [name.trim(), price]
  );
  res.status(201).json(rows[0]);
});`,
      changes: ['Validation of \`name\` and \`price\` with \`return\` and 400.', 'Parameterized \`INSERT\` with \`RETURNING\`.', '201 response with \`rows[0]\`.'],
      explanation: 'The data in `req.body` is decided by the client, so it is validated before touching the database. The parameterized query prevents SQL injection and `RETURNING` returns the generated `id` without a second query.',
      alternatives: 'Validating with a Zod schema and `safeParse`, as in lab 7. `RETURNING *`.',
    },
    rubric: [
      { text: 'Validates \`name\`', points: 2 },
      { text: 'Validates \`price\` (a number and not negative)', points: 2 },
      { text: 'Responds 400 and ends with \`return\`', points: 1.5 },
      { text: 'Parameterized \`INSERT\` with \`await\`', points: 2.5 },
      { text: 'Responds 201 with the created row', points: 2 },
    ],
    penalties: ['Concatenating the values into the SQL: the 2.5 points for the query are not awarded.'],
    partial: 'If it responds 201 with `req.body` instead of the created row, 1 of the 2 points is awarded.',
  },
  {
    id: 'B9', kind: 'js', category: 'Code completion', tech: 'JavaScript', title: 'Finding a user by email',
    concepts: ['find', 'toLowerCase', 'null versus undefined'], level: 'Basic', minutes: '6-8',
    statement: `The task is to complete \`findByEmail\` so that it returns the user whose email matches the one received **case-insensitively**, or \`null\` if there is none.`,
    files: [{ name: 'users.js', lang: 'js', code: `const users = [
  { id: 1, email: "ana@cunef.edu" },
  { id: 2, email: "Luis@cunef.edu" },
];

function findByEmail(list, email) {
  // Complete
}

console.log(findByEmail(users, "LUIS@cunef.edu")); // { id: 2, email: "Luis@cunef.edu" }
console.log(findByEmail(users, "eva@cunef.edu"));  // null` }],
    expected: 'The two calls in the code print `{ id: 2, email: "Luis@cunef.edu" }` and `null`.',
    hints: ['There is an array method that returns the first element that meets a condition.', 'To ignore case, both emails are compared after converting them to lowercase. Also, that method does not return `null` when it finds nothing.'],
    solution: {
      code: `function findByEmail(list, email) {
  const target = email.toLowerCase();
  const user = list.find((u) => u.email.toLowerCase() === target);
  return user ?? null;
}`,
      changes: ['\`find\` with a lowercase comparison on both sides.', 'Conversion of \`undefined\` to \`null\`.'],
      explanation: 'Both sides of the comparison must be converted to lowercase: converting only one is not enough. `find` returns `undefined` if there is no match; the statement asks for `null`, so it is converted with `??` (or with an `if`).',
      alternatives: '`return user || null;`. A `for...of` loop that returns the user when found and `null` at the end.',
    },
    rubric: [
      { text: 'Uses \`find\` or an equivalent traversal', points: 3 },
      { text: 'Compares both emails in lowercase', points: 4 },
      { text: 'Returns \`null\` if there is no match', points: 3 },
    ],
    penalties: ['Modifying the emails in the original array: -2.'],
    partial: 'If only one of the two sides is converted to lowercase, 2 of the 4 points are awarded.',
  },
  {
    id: 'D2', kind: 'js', category: 'Code comprehension', tech: 'JavaScript and DOM',
    title: 'Rendering a list from the state',
    concepts: ['state → render pattern', 'createElement', 'classList', 'textContent'],
    level: 'Basic', minutes: '10',
    statement: `The following code is the basis of the interactive task list from block I. It must not be modified: the task is to **explain how it works** by answering the five questions in the box.

The page contains \`<ul id="list"></ul>\` and \`<button id="add">Add</button>\`.`,
    files: [{ name: 'app.js', lang: 'js', code: `const list = document.querySelector("#list");
const tasks = [
  { title: "Read the guide", done: true },
  { title: "Take the quiz", done: false },
];

function render() {
  list.textContent = "";
  for (const task of tasks) {
    const li = document.createElement("li");
    li.textContent = task.title;
    if (task.done) li.classList.add("done");
    list.appendChild(li);
  }
}

document.querySelector("#add").addEventListener("click", () => {
  tasks.push({ title: "New task", done: false });
  render();
});

render();` }],
    answerStarter: `1. What is shown in the list when the page loads? Which element has the done class?

2. What is list.textContent = "" for at the start of render?

3. How many elements does the list have after clicking "Add" twice? Which ones?

4. Why is the title assigned with textContent and not with innerHTML?

5. What would happen if the last line, render();, were removed?
`,
    expected: 'Five short answers, of one to three sentences each, with the concrete results and the reason for each decision.',
    hints: [
      'Review the state → render pattern from the integration practice: the data lives in an array and a function rebuilds the list from it.',
      'Follow the code line by line with the two initial objects and then with each click: every time \`render\` is called, what happens to the list first?',
    ],
    solution: {
      code: `1. Two elements: "Read the guide" and "Take the quiz". The first one has the done class
   because its done property is true.

2. It empties the list before rendering it again. Without that line, each call to render
   would add all the tasks again and they would appear duplicated.

3. Four: "Read the guide", "Take the quiz", "New task" and "New task". Each click
   adds an object to the array and renders the whole list again.

4. textContent inserts the text as is. With innerHTML, a title containing tags would be
   interpreted as HTML, which allows content or code to be injected (XSS).

5. The list would appear empty when the page loads and would only be rendered after the first click.`,
      changes: ['Not applicable: this is a comprehension exercise.'],
      explanation: 'This is the state → render pattern: the data lives in `tasks` and the screen is always rebuilt from it with `render`. The handlers do not touch the DOM directly: they change the state and render again. In this way the screen and the data never contradict each other. It is the same idea that React automates in block III.',
      alternatives: 'Any equivalent explanation in other words. For question 2, mentioning `list.innerHTML = ""`, which has the same effect, is also valid.',
    },
    rubric: [
      { text: 'Question 1: the two elements and which one has the class', points: 2 },
      { text: 'Question 2: emptying to avoid duplicates', points: 2 },
      { text: 'Question 3: four elements, with the correct titles', points: 2 },
      { text: 'Question 4: textContent versus innerHTML', points: 2 },
      { text: 'Question 5: empty list until the first click', points: 2 },
    ],
    penalties: ['Stating in question 3 that six elements are shown (duplicates): the points for questions 2 and 3 are not awarded.'],
    partial: 'In question 4, merely stating that `textContent` "is safer" without explaining why: 1 of 2 points.',
  },
  // ------------------------------------------------------------------ conceptual questions (E1-E9)
  {
    "id": "E1",
    "kind": "js",
    "category": "Conceptual question",
    "tech": "JavaScript and DOM",
    "title": "User text: `textContent` or `innerHTML`",
    "concepts": [
      "textContent",
      "innerHTML",
      "code injection (XSS)"
    ],
    "level": "Basic",
    "minutes": "5",
    "statement": "A page shows the name typed by the user with `el.innerHTML = name`. A change to `el.textContent = name` is proposed.\n\nExplain in 2-3 lines the difference between the two options, which one suits this case and why.",
    "files": [],
    "answerStarter": "Answer (2-3 lines):\n",
    "expected": "An answer of 2-3 lines that explains what each property does and justifies the choice.",
    "hints": [
      "Consider what happens if the user types `<b>Ana</b>` or `<img src=x onerror=\"…\">`.",
      "One of the two properties interprets the text as HTML; the other shows it as it is."
    ],
    "solution": {
      "code": "`innerHTML` interprets the text as HTML: if the user types tags or an attribute such as `onerror`, they are inserted into the page and can run code (XSS). `textContent` inserts the literal text, without interpreting it. To show user data, `textContent` is the right choice.",
      "changes": [
        "Not applicable: this is a conceptual question."
      ],
      "explanation": "User input is not trusted. Inserting it as HTML allows code to be injected into the page; as text, it is always shown as it is.",
      "alternatives": "Any equivalent explanation that mentions that `innerHTML` interprets HTML and the injection risk."
    },
    "rubric": [
      {
        "text": "Explains that `innerHTML` interprets the text as HTML",
        "points": 3
      },
      {
        "text": "Explains that `textContent` inserts it as literal text",
        "points": 3
      },
      {
        "text": "Chooses `textContent` and justifies it by security (code injection)",
        "points": 4
      }
    ],
    "penalties": [
      "Choosing `innerHTML` without mentioning the risk: the 4 points of the last criterion are not awarded."
    ],
    "partial": "If `textContent` is chosen \"because it is safer\" without explaining why, 2 of the 4 points of the last criterion are awarded."
  },
  {
    "id": "E2",
    "kind": "js",
    "category": "Conceptual question",
    "tech": "JavaScript and DOM",
    "title": "The DOM versus the HTML file",
    "concepts": [
      "DOM",
      "HTML file",
      "DevTools"
    ],
    "level": "Basic",
    "minutes": "5",
    "statement": "A script adds three `<li>` elements to a list when the page loads. In \"View source\" the elements do not appear; in the DevTools *Elements* panel, they do. When the page is reloaded, the script adds them again.\n\nExplain in 2-3 lines why this happens.",
    "files": [],
    "answerStarter": "Answer (2-3 lines):\n",
    "expected": "An answer of 2-3 lines that distinguishes the HTML file from the DOM and explains the reload.",
    "hints": [
      "Review what the browser builds from the HTML file.",
      "What does JavaScript change: the file that came from the server or something that lives in memory?"
    ],
    "solution": {
      "code": "\"View source\" shows the HTML file as it came from the server. JavaScript does not change that file: it changes the DOM, the tree of objects the browser builds in memory from it, and that is what *Elements* shows. On reload, the DOM is rebuilt from the original file and the script runs again.",
      "changes": [
        "Not applicable: this is a conceptual question."
      ],
      "explanation": "The HTML file is the starting point; the DOM is the live version of the page, the one that is shown and that JavaScript changes.",
      "alternatives": "Any equivalent explanation that distinguishes the file from the in-memory DOM."
    },
    "rubric": [
      {
        "text": "Distinguishes the original HTML file from the in-memory DOM",
        "points": 4
      },
      {
        "text": "Explains that JavaScript changes the DOM and not the file",
        "points": 3
      },
      {
        "text": "Explains why the elements appear again on reload",
        "points": 3
      }
    ],
    "penalties": [
      "Stating that the script changes the file on the server: the 3 points of the second criterion are not awarded."
    ],
    "partial": "If the DOM is mentioned without explaining what each view shows, 2 of the 4 points of the first criterion are awarded."
  },
  {
    "id": "E3",
    "kind": "js",
    "category": "Conceptual question",
    "tech": "JavaScript and DOM",
    "title": "Why `preventDefault` in a form",
    "concepts": [
      "submit event",
      "preventDefault",
      "default behaviour"
    ],
    "level": "Basic",
    "minutes": "5",
    "statement": "In the block I to-do list, the `submit` event handler starts with `event.preventDefault()`. If that line is removed, the task appears for an instant and then disappears.\n\nExplain in 2-3 lines what happens and why `submit` is listened to on the form instead of `click` on the button.",
    "files": [],
    "answerStarter": "Answer (2-3 lines):\n",
    "expected": "An answer of 2-3 lines that explains the reload and justifies the use of `submit`.",
    "hints": [
      "Review what the browser does by default when a form is submitted.",
      "Consider another way of submitting a form apart from clicking the button."
    ],
    "solution": {
      "code": "By default, submitting a form makes the browser send it and reload the page, so whatever JavaScript had added is lost. `preventDefault()` cancels that behaviour. `submit` is used because it covers both clicking the button and pressing Enter in the text field.",
      "changes": [
        "Not applicable: this is a conceptual question."
      ],
      "explanation": "The browser has a default behaviour for each event; `preventDefault` allows it to be replaced by the script's own.",
      "alternatives": "Any equivalent explanation."
    },
    "rubric": [
      {
        "text": "Explains that, without `preventDefault`, submitting reloads the page",
        "points": 4
      },
      {
        "text": "Explains that `preventDefault` cancels that behaviour",
        "points": 3
      },
      {
        "text": "Justifies `submit` over `click` (Enter also submits)",
        "points": 3
      }
    ],
    "penalties": [],
    "partial": "If the reload is explained without justifying `submit`, the first 7 points are awarded."
  },
  {
    "id": "E4",
    "kind": "express",
    "category": "Conceptual question",
    "tech": "Express",
    "title": "Where the `404` is decided",
    "concepts": [
      "layers",
      "controller",
      "model",
      "HTTP status codes"
    ],
    "level": "Basic",
    "minutes": "5",
    "statement": "In an API organised in routes, controllers and models, the `findById(id)` model returns the row or `null`, and the controller responds `404` when the result is `null`.\n\nJustify in 2-3 lines why the `404` check is written in the controller and not in the model.",
    "files": [],
    "answerStarter": "Answer (2-3 lines):\n",
    "expected": "An answer of 2-3 lines on the responsibility of each layer.",
    "hints": [
      "Review what each layer of the API does, according to the block II guide.",
      "Does the model know the `req` and `res` objects?"
    ],
    "solution": {
      "code": "The model only talks to PostgreSQL and returns data (a row or `null`); it knows nothing about `req` or `res`. Deciding which HTTP response applies, such as the `404`, is the job of the controller, which translates data into status codes. This way the model can be reused, and changing the storage does not affect the responses.",
      "changes": [
        "Not applicable: this is a conceptual question."
      ],
      "explanation": "Each layer has one responsibility: the route maps URL and controller, the controller decides the response and the model accesses the data.",
      "alternatives": "Any equivalent explanation based on the separation of responsibilities."
    },
    "rubric": [
      {
        "text": "The model only returns data and knows nothing about `req` or `res`",
        "points": 4
      },
      {
        "text": "The controller translates data into HTTP status codes",
        "points": 4
      },
      {
        "text": "Mentions the benefit: reusing the model or changing the storage without touching the responses",
        "points": 2
      }
    ],
    "penalties": [],
    "partial": "If it only says \"it is the controller's job\" without explaining the role of the model, 4 of the first 8 points are awarded."
  },
  {
    "id": "E5",
    "kind": "express",
    "category": "Conceptual question",
    "tech": "Express",
    "title": "The order of the middleware",
    "concepts": [
      "middleware",
      "express.json",
      "authentication",
      "validation"
    ],
    "level": "Basic",
    "minutes": "5",
    "statement": "In Practice 2, the route that creates an item is `router.post(\"/\", requireAuth, validateItem, controller.create)`, and `app.js` registers `express.json()` before the routes.\n\nJustify this order in 2-3 lines: why `express.json()` goes before the routes and why `requireAuth` goes before the validation.",
    "files": [],
    "answerStarter": "Answer (2-3 lines):\n",
    "expected": "An answer of 2-3 lines that justifies both positions.",
    "hints": [
      "Express runs the middleware in the order in which they are declared.",
      "What does the validation need to work? Does it make sense to validate data from someone without a session?"
    ],
    "solution": {
      "code": "`express.json()` turns the body into `req.body`; if it came after the routes, the validation and the controller would receive it as `undefined`. `requireAuth` goes before validation because, without a session, it responds `401` without validating or touching the database. This way the controller already receives `req.user` and valid data.",
      "changes": [
        "Not applicable: this is a conceptual question."
      ],
      "explanation": "The order of declaration is the configuration of the application: each link prepares `req` for the next one or ends the request.",
      "alternatives": "Any equivalent explanation."
    },
    "rubric": [
      {
        "text": "Justifies `express.json()` before the routes (`req.body`)",
        "points": 4
      },
      {
        "text": "Justifies `requireAuth` before validation (early `401`)",
        "points": 4
      },
      {
        "text": "Mentions that the controller receives `req.user` and valid data",
        "points": 2
      }
    ],
    "penalties": [
      "Stating that the order does not matter: the points of the first two criteria are not awarded."
    ],
    "partial": "If only one of the two positions is justified, its 4 points are awarded."
  },
  {
    "id": "E6",
    "kind": "express",
    "category": "Conceptual question",
    "tech": "Express",
    "title": "Validating on the server even when the client validates",
    "concepts": [
      "validation",
      "Zod",
      "security",
      "400"
    ],
    "level": "Basic",
    "minutes": "5",
    "statement": "The React form of Practice 2 already checks that the name is not empty before sending it.\n\nJustify in 2-3 lines why the API must validate the request body anyway.",
    "files": [],
    "answerStarter": "Answer (2-3 lines):\n",
    "expected": "An answer of 2-3 lines on the role of each validation.",
    "hints": [
      "Is the React interface the only way to call the API?",
      "Consider tools such as curl or Postman."
    ],
    "solution": {
      "code": "Client-side validation only improves the experience: it warns at once. Anyone can call the API without going through the interface (curl, Postman, another script), so the server is the only point that protects the data: it validates everything that arrives in `req.body` and responds `400` if it is not valid.",
      "changes": [
        "Not applicable: this is a conceptual question."
      ],
      "explanation": "What the client sends is never trusted. Server validation is mandatory; client validation is a convenience.",
      "alternatives": "Any equivalent explanation."
    },
    "rubric": [
      {
        "text": "Client validation improves the experience but does not protect",
        "points": 3
      },
      {
        "text": "The API can be called without the interface",
        "points": 4
      },
      {
        "text": "The server validates everything that arrives and responds `400`",
        "points": 3
      }
    ],
    "penalties": [
      "Stating that client validation is enough: no points are awarded."
    ],
    "partial": "If it says the server must validate \"for security\" without explaining why, 3 points are awarded."
  },
  {
    "id": "E7",
    "kind": "react",
    "category": "Conceptual question",
    "tech": "React, Axios, Express and PostgreSQL",
    "title": "From the form to PostgreSQL and back",
    "concepts": [
      "client-server",
      "path of a request",
      "layers"
    ],
    "level": "Basic",
    "minutes": "5",
    "statement": "A user types an email in a React form and clicks \"Search\". The application shows the user's profile, which is stored in PostgreSQL.\n\nDescribe in 2-3 lines the complete path, from the form field to the database and back to the screen, naming the pieces it goes through.",
    "files": [],
    "answerStarter": "Answer (2-3 lines):\n",
    "expected": "An answer of 2-3 lines with the pieces in order, there and back.",
    "hints": [
      "Start with the state of the component and with what sends the request.",
      "On the server, follow the Express chain down to the only layer that talks to the database."
    ],
    "solution": {
      "code": "Controlled *input* → React state → Axios sends `GET /users?email=…` → Express route → validation (middleware) → controller → model with a parameterised `pg` query → PostgreSQL. The row goes back to the controller, which responds with JSON; Axios delivers it in `response.data`, the component stores it in state and React renders again.",
      "changes": [
        "Not applicable: this is a conceptual question."
      ],
      "explanation": "This is the path shown on the \"How it all fits together\" page: the client never talks to the database; everything goes through the API.",
      "alternatives": "Any equivalent path with the pieces in the right order."
    },
    "rubric": [
      {
        "text": "Client side: state and request with Axios",
        "points": 3
      },
      {
        "text": "Server side in order: route, middleware, controller and model with `pg`",
        "points": 4
      },
      {
        "text": "Way back: JSON, state and render",
        "points": 3
      }
    ],
    "penalties": [
      "Stating that React queries the database directly: the 4 points of the server side are not awarded."
    ],
    "partial": "If one or two server pieces are missing but the order is right, 2 of its 4 points are awarded."
  },
  {
    "id": "E8",
    "kind": "react",
    "category": "Conceptual question",
    "tech": "React",
    "title": "Why the request goes in `useEffect`",
    "concepts": [
      "useEffect",
      "rendering",
      "state"
    ],
    "level": "Basic",
    "minutes": "5",
    "statement": "In lab 9, the list of users is requested from the API inside `useEffect(() => { … }, [])` and not directly in the body of the component.\n\nExplain in 2-3 lines why.",
    "files": [],
    "answerStarter": "Answer (2-3 lines):\n",
    "expected": "An answer of 2-3 lines on rendering and the effect.",
    "hints": [
      "How many times does the body of a component run?",
      "Follow the chain: request → store the response in state → what does that trigger?"
    ],
    "solution": {
      "code": "The body of the component runs on every render. If the request were there, storing the response in state would trigger another render and another request, endlessly. `useEffect` with `[]` runs it only once, after the first render; the `async` function is declared inside because the effect cannot return a promise.",
      "changes": [
        "Not applicable: this is a conceptual question."
      ],
      "explanation": "Requests are effects: something that happens outside rendering. `useEffect` is the place for them.",
      "alternatives": "Any equivalent explanation."
    },
    "rubric": [
      {
        "text": "The body of the component runs on every render",
        "points": 3
      },
      {
        "text": "Storing the response in state triggers another render: an endless loop of requests",
        "points": 4
      },
      {
        "text": "`useEffect` with `[]` runs once, after the first render",
        "points": 3
      }
    ],
    "penalties": [],
    "partial": "If the loop is mentioned without explaining why it happens, 2 of the 4 points of the second criterion are awarded."
  },
  {
    "id": "E9",
    "kind": "react",
    "category": "Conceptual question",
    "tech": "React",
    "title": "Lifting state up or using Context",
    "concepts": [
      "lifting state",
      "Context API",
      "prop drilling"
    ],
    "level": "Basic",
    "minutes": "5",
    "statement": "Two situations arise in a React application: (a) a search field and the list it filters are siblings inside the same parent; (b) the user's session is needed by the navigation bar, the login page and the protected routes.\n\nJustify in 2-3 lines which solution suits each case: lifting state up to the parent or using Context.",
    "files": [],
    "answerStarter": "Answer (2-3 lines):\n",
    "expected": "An answer of 2-3 lines that chooses a solution for each case and justifies it.",
    "hints": [
      "How far apart are the components that share the data in each case?",
      "Review what *prop drilling* is and when it appears."
    ],
    "solution": {
      "code": "(a) Lift the state up to the common parent: the data is shared by two nearby components and passing it through props is enough. (b) Context (`AuthContext`): the session is needed by components far apart, and passing it through props would mean *prop drilling* through components that do not use it.",
      "changes": [
        "Not applicable: this is a conceptual question."
      ],
      "explanation": "The simplest option comes first: lifting state up. Context is for data that travels far or that many components use.",
      "alternatives": "Any equivalent justification."
    },
    "rubric": [
      {
        "text": "Case (a): lift the state up to the parent, with a reason",
        "points": 4
      },
      {
        "text": "Case (b): Context, with a reason",
        "points": 4
      },
      {
        "text": "Mentions *prop drilling* or the rule of starting with the simplest option",
        "points": 2
      }
    ],
    "penalties": [
      "Proposing Context for case (a) without justifying it: its 4 points are not awarded."
    ],
    "partial": "If both choices are right but without reasons, 2 points per case are awarded."
  },
];
