'use strict';
// "Explain the code" mode of the practical exercises (English). Hand-written; canonical in this repository.
// Mirrors data/explain.js: statement, questions, reference answer, hints and marking criteria out of 10.
window.EXPLAIN = {
  "A1": {
    "statement": "An application stores its users in an array of objects. The function `getActiveNames` must return **only the names** of the active users, but running it prints `[ undefined, undefined ]`.\n\nThe code must not be modified: the task is to **explain the bug** by answering the four questions in the box. The fix is described in words, without writing code.",
    "questions": "1. In which expression is the bug? Does the filter work correctly?\n\n2. Why is the result [ undefined, undefined ] and not the names?\n\n3. What change fixes the bug, and why does it work?\n\n4. What is the difference between an arrow function with its body in braces and one without braces?\n",
    "answer": "1. The bug is in the map callback: (user) => { user.name; }. The filter works correctly and lets Ana and Marta through.\n\n2. map builds a new array with whatever the callback returns for each element. The callback has its body in braces and no return, so it returns undefined; since two active users reach it, the result contains two undefined values.\n\n3. Make the callback return user.name: remove the braces so that the arrow function returns the expression, or keep them and add return. map then collects the names and returns [ \"Ana\", \"Marta\" ] without modifying users.\n\n4. Without braces, the arrow function directly returns the value of the expression. With braces, the body is a block and only returns something if return is written; otherwise it returns undefined.",
    "hints": [
      "Review what each of the two chained methods does and which of them produces the final array.",
      "Compare how the `filter` callback and the `map` callback are written: how do they differ in form?"
    ],
    "rubric": [
      {
        "text": "Question 1: the bug is in the `map` callback, not in `filter`",
        "points": 2
      },
      {
        "text": "Question 2: the callback returns nothing (`undefined`) and `map` stores one value for each active user",
        "points": 3
      },
      {
        "text": "Question 3: return `user.name`, removing the braces or adding `return`",
        "points": 3
      },
      {
        "text": "Question 4: direct return without braces versus a block that needs `return`",
        "points": 2
      }
    ],
    "penalties": [
      "Placing the bug in `filter`: -1.",
      "Proposing as the fix a loop that modifies the `users` array: -1."
    ],
    "partial": "In question 2, if it is stated that the callback returns nothing but there is no explanation of why exactly two `undefined` values appear, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 3 both fixes are equally valid: removing the braces, or keeping them and adding `return`."
  },
  "A2": {
    "statement": "A task API has the endpoint `GET /tasks/:id`. When the task exists it works correctly, but when it does not exist it responds `200` with the body `null`. A client therefore cannot distinguish between \"the task exists\" and \"it does not exist\". The expected behaviour is that, if the task does not exist, it responds `404` with the body `{ \"error\": \"Task not found\" }`.\n\nThe code must not be modified: the task is to **explain the bug** by answering the four questions in the box. The fix is described in words, without writing code.",
    "questions": "1. What does findById return when there is no task with that id, and which line of the controller does not take it into account?\n\n2. Why does the client receive 200 with the body null instead of an error?\n\n3. What change fixes the endpoint? Where must it be made, in the model or in the controller?\n\n4. Why is a return (or an else) needed on the 404 response? What would happen without it?\n",
    "answer": "1. findById returns null: rows[0] is undefined because the query finds no rows, and the ?? operator replaces it with null. The line res.status(200).json(task) always responds the same way, whether or not the task exists.\n\n2. The controller does not check the result and null is valid JSON, so Express sends 200 with null as the body. Nothing in the code translates \"no result\" into an error status code.\n\n3. In the controller, before responding: check whether task is null and, in that case, respond 404 with { error: \"Task not found\" }; if it exists, keep the 200 response with the task. The model is correct and does not know about res, so it cannot choose the HTTP status code.\n\n4. Without return, execution continues after sending the 404 and reaches the 200 response, so Express tries to send a second response and the error Cannot set headers after they are sent occurs. The return (or an else) guarantees a single response per request.",
    "hints": [
      "Follow the case `GET /tasks/999`: what the query returns, what `findById` returns and what reaches `res.json`.",
      "Think about what happens in Express if a controller tries to respond twice to the same request."
    ],
    "rubric": [
      {
        "text": "Question 1: `findById` returns `null` and the controller responds without checking it",
        "points": 2
      },
      {
        "text": "Question 2: `null` is valid JSON and nothing translates the missing result into an HTTP status code",
        "points": 2.5
      },
      {
        "text": "Question 3: check `task` in the controller and respond `404` with `{ error: \"Task not found\" }`, keeping the `200` when it exists",
        "points": 3
      },
      {
        "text": "Question 4: without `return` a second response would be attempted (*Cannot set headers after they are sent*)",
        "points": 2.5
      }
    ],
    "penalties": [
      "Proposing that the model responds or chooses the HTTP status code: -1, because the model does not know about `res`.",
      "Proposing 400 or 500 instead of 404: -1."
    ],
    "partial": "In question 3, if responding 404 is proposed but the body `{ error: \"Task not found\" }` is not stated, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 3, checking `!task` or `task === null` is valid; in question 4, using `return` or placing the success response in an `else`."
  },
  "A3": {
    "statement": "In a task API, `POST /tasks` inserts the task into PostgreSQL and must return the created row. The task is saved correctly in the database, but the client receives `201` with the body `{}` instead of the task. The model is correct.\n\nThe code must not be modified: the task is to **explain the bug** by answering the four questions in the box. The fix is described in words, without writing code.",
    "questions": "1. On which line of the controller is the bug?\n\n2. What value does task have on that line, and why does the client receive {}?\n\n3. If the controller is wrong, why does the task appear saved in the database?\n\n4. What change fixes the bug, and why can createTask use it without further changes?\n",
    "answer": "1. On const task = tasksModel.create(title);: create is called without await.\n\n2. create is an async function, so calling it immediately returns a pending promise, not the row. The controller sends that promise with res.json, and a promise becomes {} when converted to JSON.\n\n3. Calling create starts the INSERT query even though the controller does not wait for its result. The insertion completes in the database, but the response has already been sent without the row.\n\n4. Add await before tasksModel.create(title): the controller waits for the query to finish and receives the row returned by RETURNING. createTask is already declared as async, which is what allows await to be used inside it.",
    "hints": [
      "Review what a function declared with `async` returns at the moment it is called.",
      "Compare how `db.query` is called inside the model and how `create` is called inside the controller."
    ],
    "rubric": [
      {
        "text": "Question 1: the call to `tasksModel.create(title)` without `await`",
        "points": 2
      },
      {
        "text": "Question 2: `task` is a pending promise and a promise becomes `{}` in JSON",
        "points": 3
      },
      {
        "text": "Question 3: the query is started anyway and the insertion completes, even though nobody waits for the result",
        "points": 2
      },
      {
        "text": "Question 4: add `await`, which waits for the row from `RETURNING`, and `createTask` is already `async`",
        "points": 3
      }
    ],
    "penalties": [
      "Placing the bug in the model or in the SQL query: -1.",
      "Stating that `task` is `undefined` instead of a promise: -1."
    ],
    "partial": "In question 4, if adding `await` is stated but there is no explanation of what is obtained or why `createTask` can use it, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 2 it is valid to say that the promise is \"not resolved\" or \"does not have the value yet\"."
  },
  "A4": {
    "statement": "A component displays a list of tasks. Clicking a task should cross it out or remove the strikethrough, but nothing happens on screen. If the array is inspected with `console.log`, the value of `done` has indeed changed.\n\nThe code must not be modified: the task is to **explain the bug** by answering the four questions in the box. The fix is described in words, without writing code.",
    "questions": "1. Which lines of toggle cause the bug?\n\n2. If done changes in the array, why does the screen not update?\n\n3. What change fixes toggle, and why does it make React re-render?\n\n4. What does treating state as immutable mean? Why is creating a new array not enough if the task object is still modified?\n",
    "answer": "1. task.done = !task.done; directly modifies the object stored in the state, and setTasks(tasks); passes the same array again.\n\n2. React compares the new state with the previous one by reference. tasks is the same array it already had, so React considers that nothing has changed and does not re-render. The change exists in memory, which is why console.log shows it, but it never reaches the screen.\n\n3. Pass setTasks a new array created with map, in which the clicked task is replaced by a new object with done inverted (copying its properties with spread) and the others are kept. Receiving a different reference, React detects the change and re-renders.\n\n4. It means not modifying state values, but creating copies with the changes. If the array is new but the object is modified, the previous state is altered too, because both arrays share the same objects; the element that changes must also be a new object.",
    "hints": [
      "Review how React decides whether the new value of a piece of state is different from the previous one.",
      "Look at which array `setTasks` receives and whether it is the same one already stored in the state."
    ],
    "rubric": [
      {
        "text": "Question 1: the mutation of `task.done` and `setTasks(tasks)` with the same array",
        "points": 2
      },
      {
        "text": "Question 2: React compares by reference, sees the same array and does not re-render",
        "points": 3
      },
      {
        "text": "Question 3: new array with `map` and a new object with `done` inverted for the clicked task",
        "points": 3
      },
      {
        "text": "Question 4: immutability: creating copies instead of modifying, including the object that changes",
        "points": 2
      }
    ],
    "penalties": [
      "Attributing the problem to `onClick` or to the function `() => toggle(task.id)`: -1.",
      "Stating that `setTasks` is never executed: -0.5."
    ],
    "partial": "In question 3, if creating a new array is proposed but the original object is still modified, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 3 it is also valid to copy the array and the objects before changing `done` and call `setTasks` with the copy, or to use the functional form `setTasks((prev) => prev.map(...))`."
  },
  "A5": {
    "statement": "The function `getInitials` must return an array with the initials of each full name, in uppercase and separated by a full stop. Running it prints `undefined`.\n\nThe code must not be modified: the task is to **explain the bug** by answering the four questions in the box. The fix is described in words, without writing code.",
    "questions": "1. Which expression causes the bug? Is the code inside the callback correct?\n\n2. Why is undefined printed if the callback does return the initials?\n\n3. What change fixes the function, and what does it return afterwards?\n\n4. When is it appropriate to use forEach and when map?\n",
    "answer": "1. names.forEach(...). The callback is correct: it splits first name and surname with split(\" \") and returns, for example, \"A.G\" for \"ana garcía\".\n\n2. forEach runs the callback for each element but always returns undefined: the values returned by the callback are lost. getInitials directly returns the result of forEach, that is, undefined.\n\n3. Replace forEach with map, which collects what the callback returns in a new array of the same length. The function returns [ \"A.G\", \"L.P\", \"M.R\" ].\n\n4. forEach is for running an action on each element when no result is needed, for example printing it to the console. map is used when a new array is wanted by transforming each element.",
    "hints": [
      "Review what each array method returns, not only what it does with each element.",
      "Mentally test the callback with `\"ana garcía\"`: what does it return? Where does that value go?"
    ],
    "rubric": [
      {
        "text": "Question 1: the bug is in `forEach`, not in the callback",
        "points": 2
      },
      {
        "text": "Question 2: `forEach` always returns `undefined` and discards what the callback returns",
        "points": 3
      },
      {
        "text": "Question 3: replace `forEach` with `map`, and the result `[ \"A.G\", \"L.P\", \"M.R\" ]`",
        "points": 3
      },
      {
        "text": "Question 4: `forEach` for side effects without a result, `map` to obtain a transformed array",
        "points": 2
      }
    ],
    "penalties": [
      "Placing the bug in `split` or in `toUpperCase`: -1.",
      "Stating that the callback's `return` exits `getInitials`: -1."
    ],
    "partial": "In question 2, if it is stated that `forEach` returns `undefined` but there is no explanation of what happens to the values returned by the callback, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 3 it is also valid to create an empty array, `push` inside the `forEach` and return that array at the end."
  },
  "A6": {
    "statement": "The `ProductList` component loads the products from the API and displays them. It works, but the browser's *Network* tab shows that `GET /products` is sent over and over again, without stopping.\n\nThe code must not be modified: the task is to **explain the bug** by answering the four questions in the box. The fix is described in words, without writing code.",
    "questions": "1. Which part of the useEffect call causes the repeated requests?\n\n2. What cycle occurs from the first render onwards, and why does it not stop?\n\n3. What change fixes the bug, and why?\n\n4. What is the difference between passing no second argument to useEffect, passing [] and passing [id]?\n",
    "answer": "1. useEffect only receives the effect function: the second argument, the dependency array, is missing.\n\n2. Without a dependency array, the effect runs after every render. The effect requests the products and calls setProducts with a new array (response.data), which triggers another render, which runs the effect again: a loop of requests.\n\n3. Add the empty dependency array [] as the second argument of useEffect. The effect then only runs when the component mounts: a single request is sent and the render triggered by setProducts no longer starts another one.\n\n4. Without a second argument, the effect runs after every render; with [], only when the component mounts; with [id], when it mounts and every time id changes.",
    "hints": [
      "Review how many arguments `useEffect` receives and what the second one controls.",
      "Follow the order of the steps: render, effect, `setProducts`... what happens next?"
    ],
    "rubric": [
      {
        "text": "Question 1: the `useEffect` dependency array is missing",
        "points": 2
      },
      {
        "text": "Question 2: effect after every render, `setProducts` triggers another render and it repeats",
        "points": 3
      },
      {
        "text": "Question 3: add `[]` so that the effect only runs on mount",
        "points": 3
      },
      {
        "text": "Question 4: no argument, `[]` and `[id]`, with when the effect runs in each case",
        "points": 2
      }
    ],
    "penalties": [
      "Attributing the loop to `load` or to `async/await`: -1.",
      "Stating that with `[]` the effect never runs: -1."
    ],
    "partial": "In question 2, if it is stated that the effect runs after every render but this is not related to `setProducts`, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 4 any variable is valid as an example of a dependency."
  },
  "A7": {
    "statement": "The endpoint `GET /users?email=...` looks up a user by email. It works with normal emails, but an audit has found that it is vulnerable to **SQL injection**: with `?email=' OR '1'='1` it returns the first user in the table.\n\nThe code must not be modified: the task is to **explain the bug** by answering the four questions in the box. The fix is described in words, without writing code.",
    "questions": "1. Which line makes the endpoint vulnerable?\n\n2. With ?email=' OR '1'='1, what does the SQL text look like, and why does the endpoint return the first user?\n\n3. What change fixes the vulnerability, and why does it prevent the injection?\n\n4. Once fixed, what does the endpoint return for that same malicious request, and why?\n",
    "answer": "1. The query built with a template literal that inserts ${email} inside the quotes of the SQL: the text sent by the client becomes part of the query.\n\n2. It becomes SELECT id, email FROM users WHERE email = '' OR '1'='1'. The attacker's quote closes the string and OR '1'='1' is an always-true condition, so the query returns every row and the endpoint responds with rows[0], the first user.\n\n3. Use a parameterized query: write the placeholder $1 in the SQL text and pass [email] as the second argument of pool.query. pg sends the value separately from the text and PostgreSQL always treats it as data, never as part of the query.\n\n4. It returns null: the text ' OR '1'='1 is compared as a whole as an email, no user has it, rows is empty and rows[0] ?? null gives null. With a normal email the behaviour does not change.",
    "hints": [
      "Write out the SQL text that results from replacing `email` with the malicious value, character by character.",
      "Recall the difference between building the SQL with the value inside and sending the value separately."
    ],
    "rubric": [
      {
        "text": "Question 1: the interpolation of `email` into the SQL text with the template literal",
        "points": 2
      },
      {
        "text": "Question 2: the resulting SQL with `OR '1'='1'`, an always-true condition, and why the first user comes back",
        "points": 3
      },
      {
        "text": "Question 3: parameterized query with `$1` and `[email]`; the value is treated as data",
        "points": 3
      },
      {
        "text": "Question 4: it returns `null` because no email matches that text",
        "points": 2
      }
    ],
    "penalties": [
      "Proposing as the fix escaping the quotes by hand or validating the email format: -1.",
      "Confusing the placeholder `$1` with the interpolation `${...}`: -1."
    ],
    "partial": "In question 2, if it is explained that the condition is always true but the resulting SQL text is not shown, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 2 an approximate version of the resulting SQL is valid as long as the condition `OR '1'='1'` is visible."
  },
  "B1": {
    "statement": "A page has a form for adding tasks to a list. The script selects the elements and registers the `submit` event; the original handler is shown, followed by the **completed version**.\n\nThe code must not be modified: the task is to **explain the completed version** by answering the four questions in the box.",
    "questions": "1. What would the browser do when the form is submitted if event.preventDefault() were not called? Why is it necessary in this handler?\n\n2. If the field contains only spaces, what value does text take? What is shown on screen and why is no element added to the list?\n\n3. With the text Buy bread, what do the three lines that create and append the <li> do, in order? Where does the new element appear?\n\n4. Why is the text assigned with textContent and not with innerHTML?\n",
    "answer": "1. By default, submitting a form makes the browser reload the page (or navigate to the action URL). Without `preventDefault` the page would reload and the added task would be lost; with it, the submission is handled with JavaScript only.\n\n2. `trim()` removes the spaces, so text is the empty string \"\". The if condition is met: Enter a task is shown in #message and the return ends the handler, so the <li> is never created or appended (and the message and the field are not cleared).\n\n3. `document.createElement(\"li\")` creates an empty <li> that is not yet on the page; `li.textContent = text` gives it the text Buy bread; `list.appendChild(li)` inserts it as the last child of #task-list. Then #message and the field are cleared.\n\n4. `textContent` inserts the text as is, without interpreting it as HTML. With `innerHTML`, a text containing tags would be turned into HTML, which can break the page or allow code to be injected.",
    "hints": [
      "For question 1, review the browser's default behaviour when a form is submitted.",
      "For question 2, apply `trim()` to a string of spaces and follow the execution line by line up to the `return`."
    ],
    "rubric": [
      {
        "text": "Question 1: submission reloads the page and `preventDefault` cancels it",
        "points": 2.5
      },
      {
        "text": "Question 2: `text` is the empty string, the message is shown and the `return` prevents the `<li>` from being added",
        "points": 3
      },
      {
        "text": "Question 3: role of `createElement`, `textContent` and `appendChild`, and that the element ends up at the end of the list",
        "points": 3
      },
      {
        "text": "Question 4: `textContent` does not interpret the text as HTML",
        "points": 1.5
      }
    ],
    "penalties": [
      "Stating in question 2 that an empty `<li>` is added: -1.",
      "Stating that `createElement` already shows the element on the page: -0.5."
    ],
    "partial": "In question 2, if the message is explained but not the role of the `return`, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 3 it is valid to mention that `list.append(li)` would do the same. In question 4 it is enough to state that `innerHTML` would interpret tags or that it is a security risk."
  },
  "B2": {
    "statement": "The task routes must only serve authenticated users. The client sends the token in the header `Authorization: Bearer <token>`. The original, half-written `auth` middleware is shown together with its **completed version**.\n\nThe code must not be modified: the task is to **explain the completed version** by answering the four questions in the box.",
    "questions": "1. What does the first if check? Why must it run before header.slice(7) and why does it have a return?\n\n2. What does jwt.verify do when the token is valid and what does it do when it is fake or has expired? Why is it inside try/catch?\n\n3. Why is the result stored in req.user? What would happen if next() were called without storing it?\n\n4. For the request with Authorization: Bearer abc (fake token), what does the middleware respond and does the controller run? Why is it 401 and not 403?\n",
    "answer": "1. It checks that the Authorization header exists and starts with `Bearer `; otherwise it responds 401 with Missing token. It must come before `header.slice(7)` because, if header is undefined, that line would throw an error, and the return ends the middleware so that it does not keep running after responding.\n\n2. If the token is valid, `jwt.verify` checks the signature against `process.env.JWT_SECRET` and the expiry, and returns the payload. If it is fake or has expired, it throws an error; that is why it goes inside a try/catch, to catch it and respond 401 instead of letting the request fail.\n\n3. req.user carries the payload (for example, sub: 4 and role) to the following middlewares and to the controller, which can then know who is making the request without trusting data from the client. Without storing it, the controller would run but req.user would be undefined and it could not identify the user.\n\n4. There is a header with `Bearer `, so the first if is passed, but `jwt.verify` throws an error and the catch responds 401 with Invalid or expired token; next() is never called and the controller does not run. It is 401 because identity fails; 403 is reserved for an identified user who lacks permission.",
    "hints": [
      "For question 1, think about what value `req.headers.authorization` has when the request does not include that header.",
      "For question 4, follow the execution with the token `abc`: which condition is met, which line throws an error and which block execution jumps to."
    ],
    "rubric": [
      {
        "text": "Question 1: checks header and prefix, avoids `slice` failing on `undefined` and the `return` ends the middleware",
        "points": 2.5
      },
      {
        "text": "Question 2: `verify` checks signature and expiry, returns the payload or throws an error caught by the `catch`",
        "points": 3
      },
      {
        "text": "Question 3: `req.user` passes the identity to the controller; without it, the controller does not know who the user is",
        "points": 2
      },
      {
        "text": "Question 4: 401 with Invalid or expired token, the controller does not run, and the difference between 401 and 403",
        "points": 2.5
      }
    ],
    "penalties": [
      "Stating that `jwt.verify` returns `null` or `false` with an invalid token: -1.",
      "Answering 403 in question 4: -1."
    ],
    "partial": "In question 2, if it is explained that the payload is returned but not that an error is thrown, 1.5 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 2, \"decodes and validates the token\" is accepted as long as the signature is mentioned. In question 3, any correct example of using `req.user.sub` in a controller is accepted."
  },
  "B3": {
    "statement": "The `TaskList` component requests the tasks from the API when it mounts and displays one of three branches: loading, error or list. The original component, without the body of `load`, is shown together with the **completed version** of that function.\n\nThe code must not be modified: the task is to **explain the completed version** by answering the four questions in the box.",
    "questions": "1. Describe what is shown on screen from the moment the component mounts until the API responds with [{ \"id\": 1, \"title\": \"Read the guide\" }]. Which states change and in what order?\n\n2. Why is response.data stored and not response? In which cases does execution jump to the catch?\n\n3. Why is setLoading(false) in finally? What would happen if it were only at the end of the try?\n\n4. Why is load declared as an async function inside the effect instead of making the useEffect callback async? What is the empty dependency array for?\n",
    "answer": "1. On mount, loading is true and Loading… is shown; the effect calls load, which waits for the response of `api.get(\"/tasks\")`. When it arrives, setTasks stores the array and, in finally, setLoading(false); the new render no longer enters the loading or error branch and shows the list with Read the guide.\n\n2. Axios returns a response object (with status, headers, etc.) and the already parsed JSON is in response.data, which is the array of tasks that tasks.map needs. Execution jumps to the catch if there is no connection or if the API returns a 4xx or 5xx status code, because in those cases the await throws an error.\n\n3. finally runs whether the request succeeds or fails. If setLoading(false) were only in the try, it would not run on an error and the screen would stay on Loading… forever, even though error held the message.\n\n4. An async function always returns a promise, and React expects the effect callback to return nothing or a cleanup function; that is why load is declared inside and then called. The empty array makes the effect run only once, when the component mounts.",
    "hints": [
      "For question 1, remember that each call to a set function triggers a new render and review the three branches of the `return` in order.",
      "For question 3, follow the execution assuming that `api.get` throws an error: which lines of the `try` are skipped and which blocks run."
    ],
    "rubric": [
      {
        "text": "Question 1: first Loading…, then `setTasks` and `setLoading(false)` and the list is shown",
        "points": 2.5
      },
      {
        "text": "Question 2: the data is in `response.data`; the `catch` runs on 4xx, 5xx or no connection",
        "points": 2.5
      },
      {
        "text": "Question 3: `finally` always runs; without it an error leaves the screen loading",
        "points": 2.5
      },
      {
        "text": "Question 4: the effect callback cannot return a promise, and `[]` runs the effect only on mount",
        "points": 2.5
      }
    ],
    "penalties": [
      "Stating that Axios does not throw an error on 4xx or 5xx responses: -1.",
      "Stating that the empty array makes the effect run on every render: -1."
    ],
    "partial": "In question 4, if only one of the two parts (the `async` function or the empty array) is explained, 1.5 of the 2.5 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 2, mentioning the destructuring `const { data } = ...` as an equivalent form is accepted. In question 3, stating that repeating `setLoading(false)` in the `try` and in the `catch` would be equivalent is accepted."
  },
  "B4": {
    "statement": "A shop stores its products in an array. The function `stockValue` returns the total value of the inventory: the sum of `price * units` for the products with `units` greater than 0, without modifying the array received. The original code is shown together with the **completed version** of the function.\n\nThe code must not be modified: the task is to **explain the completed version** by answering the three questions in the box.",
    "questions": "1. What is the variable total for and why does it start at 0? What does the function return with an empty array?\n\n2. Follow the execution with the products array: what value does total have after each product is processed and what does the function return?\n\n3. What role does the condition product.units > 0 play? Would the result change with this array if it were removed? Why can it be stated that the function does not modify list?\n",
    "answer": "1. total is an accumulator: it holds the partial sum and on each iteration the value of one product is added to it. It starts at 0 because 0 is the neutral value of addition; with an empty array the loop does not run and the function returns 0.\n\n2. Keyboard: 30 · 4 = 120, total = 120. Mouse: units is 0, the condition is not met and total stays at 120. Monitor: 120 · 2 = 240, total = 360. The function returns 360.\n\n3. The condition leaves out the products without units, as the statement requires. With this array the result would be the same, because the Mouse would contribute 15 · 0 = 0. The function does not modify list because it only reads product.price and product.units and only assigns values to total; it does not change any product or the array.",
    "hints": [
      "For question 2, write a table with the product, whether it meets the condition and the value of `total` at the end of each iteration.",
      "For question 3, compute what the Mouse would contribute if it were added without checking the condition."
    ],
    "rubric": [
      {
        "text": "Question 1: `total` as an accumulator starting at 0, and result 0 with an empty array",
        "points": 3
      },
      {
        "text": "Question 2: intermediate values 120, 120 and 360, and that the function returns 360",
        "points": 4
      },
      {
        "text": "Question 3: the condition filters out products without units, the result would not change here and `list` is only read",
        "points": 3
      }
    ],
    "penalties": [
      "Adding the Mouse as 15 in question 2: -1.",
      "Stating that without the condition the result would be different with this array: -1."
    ],
    "partial": "In question 2, if the final result 360 is correct but the intermediate values are missing, 2.5 of the 4 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 2, a table or a list with the values of `total` is valid. In question 3, mentioning that `filter` would also return a new array without modifying the original is accepted."
  },
  "B5": {
    "statement": "The `Counter` component shows the current value in a paragraph and has two buttons: **+1** adds one and **-1** subtracts one without the value ever going below 0. The original component is shown together with its **completed version**.\n\nThe code must not be modified: the task is to **explain the completed version** by answering the four questions in the box.",
    "questions": "1. What does useState(0) return and what is each of the two values used for? Why must count be state and not a plain variable declared with let?\n\n2. When +1 is clicked three times starting from 0, what happens on each click and what is shown at the end?\n\n3. With the value at 0, what does Math.max(0, count - 1) compute when -1 is clicked? And with the value at 3?\n\n4. Why does onClick receive an arrow function, () => setCount(count + 1), and not setCount(count + 1) directly?\n",
    "answer": "1. It returns an array with the current value (count, which starts at 0) and the function to change it (setCount). It must be state because each call to setCount with a different value triggers a new render with the updated value; a plain variable would be reset on every render and its change would not be shown on screen.\n\n2. On each click setCount(count + 1) runs: the value becomes 1, 2 and 3, and each change re-renders the component, which shows the new value in the paragraph. At the end 3 is shown.\n\n3. With 0 it computes Math.max(0, -1), which is 0, so the value stays at 0. With 3 it computes Math.max(0, 2), which is 2, and the value goes down to 2.\n\n4. onClick needs a function that React runs on click. Writing setCount(count + 1) directly would run it during render, which would change the state on every render (and cause endless renders) instead of waiting for the click.",
    "hints": [
      "For question 1, review what a call to the `useState` set function triggers and what happens to a local variable when the component runs again.",
      "For question 4, distinguish between passing a function and passing the result of calling it."
    ],
    "rubric": [
      {
        "text": "Question 1: `useState` returns the value and the set function; the state change triggers a new render",
        "points": 3
      },
      {
        "text": "Question 2: values 1, 2 and 3, a new render on each click and 3 is shown",
        "points": 2
      },
      {
        "text": "Question 3: `Math.max` gives 0 with the value at 0 and 2 with the value at 3",
        "points": 2.5
      },
      {
        "text": "Question 4: a function is passed so that it runs on click, not on render",
        "points": 2.5
      }
    ],
    "penalties": [
      "Stating that with the value at 0 `Math.max(0, count - 1)` returns -1: -1.",
      "Stating that a plain variable would also update the screen: -1."
    ],
    "partial": "In question 4, if it is stated that the function would run on render but not the consequence, 1.5 of the 2.5 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. In question 3, comparing with alternatives such as `if (count > 0)` or disabling the button with `disabled` is accepted. In question 2, mentioning the functional form `setCount((c) => c + 1)` is accepted."
  },
  "B6": {
    "statement": "The endpoint `DELETE /products/:id` deletes a product from the `products` table. If it existed, it responds `204` with no body; if it did not exist, it responds `404` with `{ \"error\": \"Product not found\" }`.\n\nThe original files and the **completed version** are shown. The code must not be modified: the task is to **explain how it works** by answering the three questions in the box.\n\nA client sends `DELETE /products/3`, where product 3 exists, and then repeats the same request.",
    "questions": "1. What does the query do, and why is the id passed as $1 together with [req.params.id] instead of being concatenated into the SQL text?\n\n2. What does result.rowCount indicate? What value does it take in the first request and in the second, and what does the endpoint respond in each case?\n\n3. Why does the 404 response have return? Why is the 204 response sent with end() and not with json()?\n",
    "answer": "1. It deletes from products the row whose id matches the one received in the URL. It is a parameterized query: pg sends the value separately from the SQL text, so it cannot alter the query; concatenating it would allow SQL injection.\n\n2. rowCount is the number of rows affected by the query. In the first request it is 1 and 204 is returned; in the second it is 0, because the product no longer exists, and 404 is returned with { error: \"Product not found\" }. A DELETE that finds no rows is not an error for PostgreSQL: it simply affects 0 rows.\n\n3. return ends the function after sending the 404, so that it does not continue to the 204 line and try to send a second response. 204 means success with no content, so no body is sent: end() closes the response with no body, whereas json() would send one.",
    "hints": [
      "For question 2, read the note in the original file about what the result of `pool.query` includes and think about what happens when the same row is deleted twice.",
      "For question 3, follow the function line by line in the 404 case assuming there were no `return`."
    ],
    "rubric": [
      {
        "text": "Question 1: what the query deletes and parameterized query versus SQL injection",
        "points": 3
      },
      {
        "text": "Question 2: meaning of `rowCount`, values 1 and 0, and 204 and 404 responses",
        "points": 4
      },
      {
        "text": "Question 3: `return` stops the function and 204 has no body",
        "points": 3
      }
    ],
    "penalties": [
      "Stating that the `DELETE` of a non-existent product throws a database error: -1.",
      "Confusing 404 with 400 or 204 with 200: -0.5."
    ],
    "partial": "In question 2, if `rowCount` is explained but the values of the two requests are not given, 2 of the 4 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. For question 3 it is valid to state that without `return` the same request would be answered twice."
  },
  "B7": {
    "statement": "The `NewTaskForm` component receives the prop `onAdd`, a function from the parent component. Its text field is an *input* controlled by the `title` state; submitting the form does not reload the page, calls `onAdd` with the title without surrounding spaces and clears the field; and the button is disabled while the field is empty.\n\nThe original files and the **completed version** are shown. The code must not be modified: the task is to **explain how it works** by answering the four questions in the box.",
    "questions": "1. What do value={title} and onChange do on the input? Why is setTitle(\"\") enough to clear the field?\n\n2. What does each of the three lines of handleSubmit do? What would happen without event.preventDefault()?\n\n3. If \"  Review SQL  \" is typed and Add is clicked, with what value is onAdd called? Why does the component call onAdd instead of adding the task itself?\n\n4. When is the button disabled? Is it disabled if the field contains only spaces?\n",
    "answer": "1. value makes the visible text come from the title state, and onChange updates the state on each keystroke with e.target.value. Since React is the source of truth, setting the state to \"\" makes the field re-render empty.\n\n2. preventDefault prevents the default behaviour of the form, which is to submit it by reloading the page; onAdd(title.trim()) notifies the parent with the trimmed title; setTitle(\"\") clears the field. Without preventDefault the browser would reload the page and the application state would be lost.\n\n3. onAdd(\"Review SQL\") is called, because trim() removes the spaces at the start and at the end. The task list belongs to the parent: the child cannot modify it, so it notifies the parent through the function it receives via props.\n\n4. It is disabled when title.trim() === \"\", that is, when the field is empty. Since the trimmed text is compared, it is also disabled if the field contains only spaces.",
    "hints": [
      "For question 1, think about where the text shown in the field comes from on each render.",
      "For question 4, note that the `disabled` condition does not compare `title` directly."
    ],
    "rubric": [
      {
        "text": "Question 1: `value` shows the state, `onChange` updates it and React is the source of truth",
        "points": 3
      },
      {
        "text": "Question 2: role of the three lines and page reload without `preventDefault`",
        "points": 2.5
      },
      {
        "text": "Question 3: value `\"Review SQL\"` and child-to-parent communication through props",
        "points": 2.5
      },
      {
        "text": "Question 4: button condition, including the spaces-only case",
        "points": 2
      }
    ],
    "penalties": [
      "Stating that `setTitle(\"\")` clears the field by modifying the DOM directly: -1."
    ],
    "partial": "In question 3, if the value is correct but there is no explanation of why the parent is called, 1.5 of the 2.5 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. For question 3 it is valid to say that the list state lives in the parent and that the child only notifies it."
  },
  "B8": {
    "statement": "The endpoint `POST /products` validates the body: if `name` is not a non-empty string or `price` is not a number greater than or equal to 0, it responds `400` with `{ \"error\": \"Invalid product\" }`. If the data is valid, it inserts the product into `products` and responds `201` with the created row. The table has the columns `id` (generated), `name` and `price`, and the app already uses `express.json()`.\n\nThe original files and the **completed version** are shown. The code must not be modified: the task is to **explain how it works** by answering the four questions in the box.",
    "questions": "1. What does each part of the if condition check? What does the endpoint respond with { \"name\": \"\", \"price\": 25 }, with { \"name\": \"Chair\", \"price\": -3 } and with { \"name\": \"Lamp\", \"price\": \"25\" }?\n\n2. Why is the validation done before the query, and why does it end with return?\n\n3. Why are the values passed as $1 and $2? What does RETURNING id, name, price do and what does rows[0] contain?\n\n4. What does the endpoint respond with { \"name\": \"Lamp\", \"price\": 25 } and why with code 201?\n",
    "answer": "1. It checks that name is a string, that it is not empty after trim(), that price is of type number and that it is not negative. The three bodies respond 400 with { error: \"Invalid product\" }: the first because of the empty name, the second because of the negative price and the third because \"25\" is a string, not a number.\n\n2. The data in req.body is decided by the client, so it is validated before touching the database. return ends the function after sending the 400, so the INSERT does not run and no second response is attempted.\n\n3. It is a parameterized query: pg sends the values separately from the SQL text and prevents SQL injection. RETURNING makes the INSERT return the created row, with the generated id, without a second query; rows[0] is that row.\n\n4. It responds 201 with the created row, for example { \"id\": 9, \"name\": \"Lamp\", \"price\": 25 }. 201 indicates that a new resource has been created, not just that the request succeeded.",
    "hints": [
      "For question 1, recall what `typeof` returns for `\"25\"` and for `25`.",
      "For question 3, think about how the client would learn the `id` generated by the database if the `INSERT` returned nothing."
    ],
    "rubric": [
      {
        "text": "Question 1: the four checks and 400 in all three cases, with the reason for each",
        "points": 3
      },
      {
        "text": "Question 2: validating before the database and `return` stopping the function",
        "points": 2
      },
      {
        "text": "Question 3: parameterized query, `RETURNING` and contents of `rows[0]`",
        "points": 3
      },
      {
        "text": "Question 4: 201 with the created row, including the `id`",
        "points": 2
      }
    ],
    "penalties": [
      "Stating that `{ \"name\": \"Lamp\", \"price\": \"25\" }` is accepted because the text is converted to a number: -1."
    ],
    "partial": "In question 1, if the checks are explained but the reason for the 400 in the third body is not given, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. For question 4, the specific `id` can be any value: it is enough to state that the database generates it."
  },
  "B9": {
    "statement": "The function `findByEmail` returns the user whose email matches the one received **case-insensitively**, or `null` if there is none.\n\nThe original files and the **completed version** are shown. The code must not be modified: the task is to **explain how it works** by answering the three questions in the box.",
    "questions": "1. For the call findByEmail(users, \"LUIS@cunef.edu\"), what value does target take and what does find compare on each element? Why are both emails converted to lowercase and not only the one received?\n\n2. For findByEmail(users, \"eva@cunef.edu\"), what does find return and what does user ?? null do?\n\n3. Are the emails in the users array modified when the function runs? Why?\n",
    "answer": "1. target is \"luis@cunef.edu\". find compares the lowercase version of each email with target: \"ana@cunef.edu\" does not match and \"luis@cunef.edu\" does, so it returns { id: 2, email: \"Luis@cunef.edu\" }. If only the received email were converted, \"Luis@cunef.edu\" would not match because it has an uppercase letter in the array.\n\n2. find finds no match and returns undefined. ?? returns the right-hand value when the left-hand one is null or undefined, so the function returns null, which is what the statement asks for.\n\n3. No. toLowerCase() returns a new string and does not change the original, and find only traverses the array without modifying it.",
    "hints": [
      "For question 1, go through the array element by element writing down the result of `u.email.toLowerCase()`.",
      "For question 2, recall what `find` returns when no element meets the condition."
    ],
    "rubric": [
      {
        "text": "Question 1: value of `target`, comparison on each element and need to convert both sides",
        "points": 4
      },
      {
        "text": "Question 2: `find` returns `undefined` and `??` turns it into `null`",
        "points": 4
      },
      {
        "text": "Question 3: strings are not modified: `toLowerCase` returns a new one",
        "points": 2
      }
    ],
    "penalties": [
      "Stating that `find` returns `null` when it finds nothing: -1."
    ],
    "partial": "In question 1, if the result is correct but there is no explanation of why both sides must be lowercase, 2 of the 4 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. For question 2 it is valid to explain `??` by comparing it with `||` or with an `if`."
  },
  "C1": {
    "statement": "A React application has `BrowserRouter` in `main.jsx`, a task list and a `TaskDetail` component. In the completed version they are connected: clicking a task in the list navigates to `/tasks/:id` and shows its detail.\n\nThe original files and the **completed version** are shown. The code must not be modified: the task is to **explain how it works** by answering the four questions in the box.",
    "questions": "1. What does :id mean in the path of the new Route? Which component is rendered at /tasks/2 and at /tasks/99, and what is shown in each case?\n\n2. What URL does the Link for \"Take the quiz\" generate? Why is Link used and not an <a href>?\n\n3. At /tasks/2, what value does useParams return for id and of what type is it? What would be shown if TaskDetail compared t.id === id without Number?\n\n4. Describe the whole path from the click on \"Take the quiz\" until the h1 appears: what each file does and how the id travels between TaskList and TaskDetail.\n",
    "answer": "1. :id declares a variable segment: the route matches /tasks/ followed by any value, and that value is available as the id parameter. In both cases TaskDetail is rendered: at /tasks/2 it shows \"Take the quiz\" in an h1 and at /tasks/99 it shows \"Task not found\", because no task has that id.\n\n2. It generates /tasks/2, built from the id of the task. Link changes the URL without reloading the page, as befits an SPA; an <a href> would also navigate, but by reloading the whole application.\n\n3. It returns \"2\", a string: URL parameters always arrive as text. Without Number, 2 === \"2\" is false, find would not find the task and \"Task not found\" would be shown.\n\n4. TaskList goes through TASKS from data.js and renders a Link per task; on click, the URL changes to /tasks/2 without reloading. Routes, in App.jsx, compares the URL with its routes and renders TaskDetail, which reads the id with useParams, looks up the task in the same TASKS and shows its title. The id does not travel through props: it travels in the URL.",
    "hints": [
      "For question 3, recall where the parameter value comes from and what data type everything in a URL has.",
      "For question 4, note that `TaskList` and `TaskDetail` are not rendered one inside the other: think about what they have in common."
    ],
    "rubric": [
      {
        "text": "Question 1: variable segment and result at `/tasks/2` and `/tasks/99`",
        "points": 2.5
      },
      {
        "text": "Question 2: URL `/tasks/2` and navigation without reload with `Link`",
        "points": 2.5
      },
      {
        "text": "Question 3: `\"2\"` as text and failure of the comparison without `Number`",
        "points": 2.5
      },
      {
        "text": "Question 4: path across files and the `id` travels in the URL, not through props",
        "points": 2.5
      }
    ],
    "penalties": [
      "Stating that `/tasks/99` matches no route and nothing is rendered: -1.",
      "Stating that `useParams` returns the `id` as a number: -1."
    ],
    "partial": "In question 4, if the flow is described but there is no mention that the `id` travels in the URL, 1.5 of the 2.5 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. For question 3 it is valid to explain the strict comparison with any example of a number versus text."
  },
  "C2": {
    "statement": "A task list has a \"Delete\" button on each row. The API client includes the function `deleteTask(id)`, which sends `DELETE /tasks/:id`. In the completed version, each button calls `handleDelete` with the `id` of its task; `handleDelete` deletes the task in the API and, if that succeeds, removes it from the list on screen; if the request fails, it stores `The task could not be deleted` in `error` and leaves the list as it was.\n\nThe original files and the **completed version** are shown. The code must not be modified: the task is to **explain how it works** by answering the four questions in the box.",
    "questions": "1. Why does the button use onClick={() => handleDelete(task.id)} and not onClick={handleDelete(task.id)}? What would happen with the second form?\n\n2. When \"Delete\" is clicked on task 3, what runs and in what order, from the click to the request? State what each file does and which request is sent.\n\n3. If the API responds successfully, why does setTasks come after the await and why is filter used instead of modifying tasks directly?\n\n4. If the API responds with an error, which part of the code runs and what is shown on screen? Does the list change?\n",
    "answer": "1. onClick needs a function. The arrow function delays the call until the click; with handleDelete(task.id) the function would run on every render and every task would be deleted when the page loads.\n\n2. The arrow function runs and calls handleDelete(3). In TaskItems.jsx, handleDelete calls deleteTask(3); in api.js, deleteTask uses the Axios instance with baseURL VITE_API_URL to send DELETE /tasks/3. handleDelete waits for the response with await before continuing.\n\n3. This way the list only changes once the API has confirmed the deletion; if it were done before, an error would leave the screen showing something that does not match the server. filter returns a new array with every task except task 3, and React detects the change and re-renders.\n\n4. Axios rejects the promise, the await throws the error and the catch runs: setError stores \"The task could not be deleted\" and it appears in the <p> thanks to error && <p>{error}</p>. setTasks never runs, so the list does not change.",
    "hints": [
      "For question 1, distinguish between passing a function and passing the result of calling it.",
      "For question 4, follow the `try`: at which line it is interrupted if `deleteTask` fails and which lines are left unexecuted."
    ],
    "rubric": [
      {
        "text": "Question 1: `onClick` receives a function and the second form would delete on render",
        "points": 3
      },
      {
        "text": "Question 2: order arrow function → `handleDelete` → `deleteTask` → `DELETE /tasks/3`",
        "points": 2.5
      },
      {
        "text": "Question 3: updating after confirmation and `filter` creates a new array",
        "points": 2.5
      },
      {
        "text": "Question 4: `catch`, visible error message and list unchanged",
        "points": 2
      }
    ],
    "penalties": [
      "Stating that the second form of `onClick` works the same but is less readable: -1.",
      "Stating that the task disappears from the list even if the request fails: -1."
    ],
    "partial": "In question 3, if `filter` is explained but not the reason for updating after the `await`, 1.5 of the 2.5 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. For question 3 it is valid to mention the functional form `setTasks((prev) => ...)` as an equivalent alternative."
  },
  "C3": {
    "statement": "An application has an `AuthContext` with the `useAuth` hook, identical to the one seen in class. In the completed version, the Provider wraps the application and the navigation bar reads the session from the Context, without receiving it through props.\n\nThe original files and the **completed version** are shown. The code must not be modified: the task is to **explain how it works** by answering the four questions in the box.",
    "questions": "1. What does AuthProvider achieve by wrapping App in main.jsx, and why does it go inside BrowserRouter? What would happen if NavBar were rendered outside the Provider?\n\n2. How do isLoggedIn and signOut reach NavBar? State which piece of AuthContext.jsx creates the value and which one reads it. What problem does this avoid compared with passing them through props?\n\n3. A user without a session signs in on the login screen, which uses signIn. What runs, and why does the bar change from Sign in to Sign out without reloading the page?\n\n4. After signing in, the page is reloaded. What does the bar show and why? And after clicking Sign out?\n",
    "answer": "1. It allows every component inside App to read the value of the Context. It goes inside BrowserRouter so that its components can use navigation. Outside the Provider, useContext would return the default value, null, and the destructuring of useAuth() would fail.\n\n2. AuthProvider builds value with isLoggedIn, signIn and signOut and passes it to AuthContext.Provider; NavBar calls useAuth, which uses useContext(AuthContext) and returns that object. This avoids prop drilling: App and the intermediate components do not have to pass the session through props.\n\n3. signIn sends POST /auth/login with api, stores data.token in localStorage and calls setToken. When the state changes, AuthProvider re-renders with isLoggedIn: Boolean(token) set to true, and the components that read the Context, NavBar among them, re-render and show Sign out.\n\n4. It shows Sign out: the token state is initialised with localStorage.getItem(\"token\"), which is still stored, so isLoggedIn is true. Clicking Sign out makes signOut remove the token from localStorage and set the state to null, isLoggedIn becomes false and Sign in appears again.",
    "hints": [
      "For question 2, locate in `AuthContext.jsx` the three pieces of Context: where it is created, which component holds the value and which hook reads it.",
      "For question 4, note the initial value passed to `useState` in `AuthProvider`."
    ],
    "rubric": [
      {
        "text": "Question 1: the Provider gives access to the whole app, sits inside the router and outside it `null` is received",
        "points": 3
      },
      {
        "text": "Question 2: `value` in the Provider, reading with `useAuth`/`useContext` and *prop drilling*",
        "points": 2.5
      },
      {
        "text": "Question 3: `signIn` stores the token, changes the state and the consumers re-render",
        "points": 2.5
      },
      {
        "text": "Question 4: the token is recovered from `localStorage` and `signOut` removes it",
        "points": 2
      }
    ],
    "penalties": [
      "Stating that `NavBar` receives the session through props from `App`: -1.",
      "Stating that the page must be reloaded for the bar to show **Sign out**: -1."
    ],
    "partial": "In question 1, if the purpose of the Provider is explained but not what happens outside it, 2 of the 3 points are awarded.",
    "alternatives": "Any equivalent explanation in other words. For question 2 it is valid to describe `useAuth` as a shortcut for `useContext(AuthContext)`."
  }
};
