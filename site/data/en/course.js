// English version of ../course.js. The Spanish file in this repository is canonical: any change made
// to it must be carried over to this file by hand, keeping the same structure, keys, ids and order.
// The site is shared by the groups of both semesters, so it carries no group, no calendar dates and
// no exam date: the course is organised by week and session, in the same order as the Canvas course.
'use strict';
const LABS_REPO = 'https://github.com/vctorChamizo/cunef-web-programming-labs/tree/main/labs/';
window.COURSE = {
  title: 'Web Application Programming',
  code: 'G247',
  blocks: [
    {
      id: 1, roman: 'I', title: 'Browser fundamentals', subtitle: 'HTML, CSS, JavaScript and the DOM', weeks: 'Weeks 1 to 4',
      guide: 'I', quizzes: [1, 2, 3, 'dom'],
      weekList: [
        { n: 1, title: 'HTML: structure of a page',
          sessions: [
            { n: '1', title: 'Course introduction and client-server architecture' },
            { n: '2', title: 'Semantic HTML' },
            { n: '3', title: 'Lab 1: structuring a page. Introduction to Git and GitHub', lab: 'L1' },
          ],
          links: [['HTML — Official documentation (MDN)', 'https://developer.mozilla.org/en-US/docs/Web/HTML']] },
        { n: 2, title: 'CSS: boxes and layout',
          sessions: [
            { n: '4', title: 'CSS selectors and the box model' },
            { n: '5', title: 'Flexbox and Grid' },
            { n: '6', title: 'Lab 2: responsive static page', lab: 'L2' },
          ],
          links: [['CSS — Official documentation (MDN)', 'https://developer.mozilla.org/en-US/docs/Web/CSS'], ['Flexbox Froggy — Interactive Flexbox practice', 'https://flexboxfroggy.com/#en']] },
        { n: 3, title: 'JavaScript: fundamentals',
          sessions: [
            { n: '7', title: 'JavaScript: variables and data types' },
            { n: '8', title: 'JavaScript: control structures and functions' },
            { n: '9', title: 'Lab 3: logic and functions', lab: 'L3' },
          ],
          links: [['JavaScript — Official documentation (MDN)', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'], ['JavaScript — Cheatsheet', 'https://www.javascriptcheatsheet.org/']] },
        { n: 4, title: 'DOM',
          sessions: [
            { n: '10', title: 'DOM manipulation' },
            { n: '11', title: 'Integration exercise: interactive to-do list' },
            { n: '12', title: 'Block I review' },
          ],
          links: [['DOM — Official documentation (MDN)', 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model']] },
      ],
    },
    {
      id: 2, roman: 'II', title: 'Backend', subtitle: 'Node.js, Express, PostgreSQL and authentication', weeks: 'Weeks 5 to 9',
      guide: 'II', quizzes: [4, 5, 6, 7, 'arch-api'],
      notes: ['The database of the course, and of the exam, is PostgreSQL: SQL from Node.js with the pg package.'], // [V-214, V-276]
      weekList: [
        { n: 5, title: 'Node.js and Express',
          sessions: [
            { n: '13', title: 'Node.js, npm and project structure' },
            { n: '14', title: 'Express: routes and middleware' },
            { n: '15', title: 'Lab 4: first routes with Express', lab: 'L4' },
          ],
          milestone: 'Practice 1: Foundations API is introduced.',
          links: [['Express.js — Official documentation', 'https://expressjs.com/en/'], ['Node.js — Official documentation', 'https://nodejs.org/docs/latest/api/']] },
        { n: 6, title: 'Controllers, errors and REST APIs',
          sessions: [
            { n: '16', title: 'Controllers and error handling' },
            { n: '17', title: 'REST API design principles' },
            { n: '18', title: 'Lab 5: in-memory CRUD API', lab: 'L5' },
          ],
          links: [['Express — Routing guide', 'https://expressjs.com/en/guide/routing.html'], ['Express — Error handling guide', 'https://expressjs.com/en/guide/error-handling.html']] },
        { n: 7, title: 'SQL and models',
          sessions: [
            { n: '20', title: 'The relational model and PostgreSQL' },
            { n: '21', title: 'SQL queries and migrations' },
            { n: '22', title: 'Lab 6: SQL and the model layer', lab: 'L6' },
          ],
          links: [['PostgreSQL — Official documentation', 'https://www.postgresql.org/docs/current/'], ['node-postgres (pg) — Official documentation', 'https://node-postgres.com/'], ['dbdiagram — Official DBML documentation', 'https://dbdiagram.io/docs'], ['Docker — Official PostgreSQL image', 'https://hub.docker.com/_/postgres']] },
        { n: 8, title: 'Authentication and security',
          sessions: [
            { n: '25', title: 'Authentication: sessions and JWT' },
            { n: '26', title: 'Password hashing and validation' },
            { n: '27', title: 'Lab 7: pagination and permission control', lab: 'L7' },
          ],
          links: [['JWT — Official documentation', 'https://jwt.io/introduction'], ['Zod — Official documentation', 'https://zod.dev/'], ['jsonwebtoken — Official documentation', 'https://github.com/auth0/node-jsonwebtoken#readme'], ['bcrypt.js — Official documentation', 'https://github.com/dcodeIO/bcrypt.js#readme']] },
        { n: 9, title: 'Practice 1 submission and Block II review',
          note: 'Week devoted to the submission and review of Practice 1. It introduces no new content and therefore has no documentation of its own: the reference is the documentation of weeks 5 to 8.',
          sessions: [
            { n: '29', title: 'Practice 1 submission and introduction of Practice 2' },
            { n: '30', title: 'Practice 1 review and other API styles' },
          ],
          links: [] },
      ],
    },
    {
      id: 3, roman: 'III', title: 'Frontend with React', subtitle: 'Components, hooks, data, navigation and shared state', weeks: 'Weeks 10 to 13',
      guide: 'III', quizzes: [8, 9, 'context', 10, 'arch'],
      notes: [ // [V-261, V-262]
        'Requests to the API are made with Axios, through a client created with axios.create and the base URL in VITE_API_URL.',
        'Promises are handled with async/await.',
      ],
      weekList: [
        { n: 10, title: 'React fundamentals and hooks',
          sessions: [
            { n: '31', title: 'React: JSX, components, props and state' },
            { n: '32', title: 'Lab 8: first components', lab: 'L8' },
            { n: '33', title: 'Hooks: useState, useEffect and useContext' },
          ],
          links: [['React — Official documentation', 'https://react.dev/learn'], ['Vite — Official documentation', 'https://vite.dev/guide/'], ['Material UI — Official documentation', 'https://mui.com/material-ui/getting-started/'], ['shadcn/ui — Official documentation', 'https://ui.shadcn.com/docs'], ['Ant Design — Official documentation', 'https://ant.design/docs/react/introduce']] },
        { n: 11, title: 'Data and navigation in React',
          sessions: [
            { n: '34', title: 'Communicating with APIs: Axios, async/await and loading and error states' },
            { n: '35', title: 'React Router and navigation' },
            { n: '36', title: 'Lab 9: hooks in practice', lab: 'L9' },
          ],
          links: [['Axios — Official documentation', 'https://axios-http.com/docs/intro'], ['React Router — Official documentation', 'https://reactrouter.com/start/library/installation']] },
        { n: 12, title: 'Shared state and the Context API',
          sessions: [
            { n: '37', title: 'Shared state: lifting state up and prop drilling' },
            { n: '38', title: 'Context API: AuthContext, login and protected routes' },
            { n: '39', title: 'Lab 10: routing and global state', lab: 'L10' },
          ],
          links: [
            ['React — Sharing state between components', 'https://react.dev/learn/sharing-state-between-components'],
            ['React — Passing data deeply with Context', 'https://react.dev/learn/passing-data-deeply-with-context'],
            ['React — useContext', 'https://react.dev/reference/react/useContext'],
            ['React Router — Installation', 'https://reactrouter.com/start/library/installation'],
          ] },
        { n: 13, title: 'Practice 2 presentations and general review',
          note: 'Closing week of the course: Practice 2 presentations and general review. It introduces no new content and therefore has no documentation of its own: the reference is the theory guides of the three blocks.',
          sessions: [
            { n: '40', title: 'Practice 2 presentations' },
            { n: '41', title: 'Practice 2 presentations' },
            { n: '42', title: 'General review and exam preparation' },
          ],
          links: [] },
      ],
    },
  ],
  // Quizzes without a lab. They appear as "coming soon" until the quiz data includes them under the
  // same key; the fields there take precedence over these.
  quizMeta: {
    dom: { name: 'Quiz DOM', short: 'DOM', title: 'DOM manipulation', sessions: '10-11' },
    context: { name: 'Quiz Context API', short: 'CTX', title: 'Shared state and the Context API', sessions: '37-38' },
  },
  // "How it all fits together": the full path of a request, the order of the middleware and the
  // folders of Practice 2.
  architecture: {
    title: 'How it all fits together',
    lead: 'Cross-cutting review of the complete Practice 2 application: what happens from the moment the user types a value until the response is displayed, in which order each middleware acts and in which folder each piece lives.',
    example: 'Example: a logged-in user types the name of an item and presses “Add” (`POST /items`).',
    lanes: { client: 'Browser · React', net: 'Network · HTTP', server: 'Server · Express', db: 'Database · PostgreSQL' },
    steps: [
      { lane: 'client', title: 'The user types', detail: 'The field value lives in the component state: a controlled *input* with `useState`.', where: 'client/src/pages/' },
      { lane: 'client', title: 'The component sends the request', detail: 'Submitting the form calls `api.post("/items", { name })`. The Axios interceptor adds `Authorization: Bearer <token>`.', where: 'client/src/services/api.js' },
      { lane: 'net', title: 'The request travels to the API', detail: 'From the client (`localhost:5173`) to the API (`localhost:3000`): these are different origins, so the browser applies CORS.', where: '' },
      { lane: 'server', title: 'CORS and JSON body', detail: '`cors` authorises the client origin and `express.json()` turns the body into `req.body`.', where: 'api/src/app.js' },
      { lane: 'server', title: 'The route selects the chain', detail: '`router.post("/", requireAuth, validateItem, controller.create)`: each link either calls `next()` or responds.', where: 'api/src/routes/' },
      { lane: 'server', title: 'Authentication', detail: '`requireAuth` verifies the JWT and stores its payload in `req.user`. Without a valid token: `401` and the chain stops.', where: 'api/src/middleware/auth.js' },
      { lane: 'server', title: 'Validation', detail: 'The Zod schema checks the body. If it is not valid: `400`. If it is, the controller only receives valid data.', where: 'api/src/validators/' },
      { lane: 'server', title: 'Controller', detail: 'Calls the model and decides the response and its status code: `201` with the created item (or `403`, `404`…).', where: 'api/src/controllers/' },
      { lane: 'server', title: 'Model', detail: 'The only layer that talks to the data: it runs the parameterised `INSERT` with `pg` and returns the row, never an HTTP response.', where: 'api/src/models/ · api/src/db.js' },
      { lane: 'db', title: 'PostgreSQL', detail: 'Inserts the row and returns it thanks to `RETURNING`.', where: 'api/db/migrations/' },
      { lane: 'client', title: 'Response, state and render', detail: 'Axios delivers the JSON in `response.data`; the component updates its state and React re-renders the list.', where: 'client/src/pages/' },
    ],
    errorNote: 'If something fails along the way, the error jumps to the error handler at the end, which responds with `500` and a generic message and logs the details on the server.',
    middleware: [
      { code: 'cors({ origin: process.env.CLIENT_ORIGIN })', why: 'First: it allows the client, which is on another origin, to read the API responses.' },
      { code: 'express.json()', why: 'Before any route that reads `req.body`; if it comes later, the body arrives as `undefined`.' },
      { code: 'Public routes: /auth/login, /health', why: 'They require no authentication: nobody has a token before logging in.' },
      { code: 'requireAuth', why: 'Before what it protects. It responds with `401` when there is no token, before validating or touching the database.' },
      { code: 'Validation (Zod)', why: 'After authentication and before the controller. It responds with `400` if the data is not valid.' },
      { code: 'Controller', why: 'Receives valid data and `req.user`; calls the model and decides the status code: `200`, `201`, `204`, `403` or `404`.' },
      { code: '404 for unmatched routes', why: 'After all the routes: it only runs if none of them matches.' },
      { code: '(err, req, res, next)', why: 'Always last: it receives the errors from everything before it and responds with `400` (malformed JSON) or `500`.' },
    ],
    codes: [
      ['Browser (CORS)', 'No status code for the application: the error appears in the browser console'],
      ['`express.json()`', '`400` if the JSON is malformed (sent by the error handler)'],
      ['Authentication', '`401` with no token, or with an invalid or expired token'],
      ['Validation', '`400` if the data does not match the schema'],
      ['Controller', '`200`, `201` or `204` on success; `403` without permission; `404` if the resource does not exist'],
      ['Route not found', '`404`'],
      ['Error handler', '`500` on an unexpected failure'],
    ],
    folders: {
      api: [
        ['api/src/server.js', 'Starts the API: reads the configuration and calls `listen`'],
        ['api/src/app.js', 'Creates the application and registers the middleware and the routes, in order'],
        ['api/src/routes/', 'Maps each verb and URL to its chain of middleware and controller'],
        ['api/src/middleware/', '`auth.js` (JWT) and `errors.js` (error handler)'],
        ['api/src/validators/', 'Zod schemas and their validation middleware'],
        ['api/src/controllers/', 'Logic of each endpoint and its response status code'],
        ['api/src/models/', 'SQL queries with `pg`'],
        ['api/src/db.js', 'Connection to PostgreSQL (`pg.Pool`)'],
        ['api/db/migrations/', 'Table creation'],
      ],
      client: [
        ['client/src/main.jsx', 'Mounts React: `BrowserRouter` → `AuthProvider` → `App`'],
        ['client/src/App.jsx', 'Navigation and routes with React Router'],
        ['client/src/services/api.js', 'Axios client: base URL and interceptors for the token and the `401`'],
        ['client/src/auth/AuthContext.jsx', 'Shared session: `isLoggedIn`, `signIn` and `signOut`'],
        ['client/src/components/Protected.jsx', 'Protected route: redirects to the login page when there is no session'],
        ['client/src/pages/', 'Screens: state, requests and rendering'],
      ],
    },
  },
  practices: [
    { name: 'Practice 1', title: 'Foundations API', detail: 'REST API with CRUD operations and in-memory data, with a client in HTML, CSS and JavaScript. It is introduced in week 5 and submitted in week 9.' },
    { name: 'Practice 2', title: 'Full-Stack Application', detail: 'Evolution of the same project: a PostgreSQL database, JWT authentication and a React frontend with React Router. It is introduced in week 9 and presented in week 13.' },
  ],
  labs: [
    { id: 'L1', title: 'Structuring a page with semantic HTML', dir: 'lab-01-semantic-html', solution: true },
    { id: 'L2', title: 'Applying CSS and building a responsive page', dir: 'lab-02-responsive-css', solution: true },
    { id: 'L3', title: 'Logic and functions in JavaScript', dir: 'lab-03-javascript-logic-functions', solution: true },
    { id: 'L4', title: 'First routes with Express', dir: 'lab-04-express-routes', solution: true },
    { id: 'L5', title: 'In-memory CRUD API', dir: 'lab-05-crud-api', solution: true },
    { id: 'L6', title: 'SQL and the model layer', dir: 'lab-06-sql-models', solution: true },
    { id: 'L7', title: 'Authentication, pagination and permissions', dir: 'lab-07-auth-pagination-permissions', solution: true },
    { id: 'L8', title: 'First React components', dir: 'lab-08-react-components', solution: false },
    { id: 'L9', title: 'Hooks in practice', dir: 'lab-09-react-hooks', solution: false },
    { id: 'L10', title: 'Routing and global state', dir: 'lab-10-routing-state', solution: false },
  ].map((l) => ({ ...l, brief: l.dir ? LABS_REPO + l.dir : null, solutionUrl: l.dir && l.solution ? LABS_REPO + l.dir + '/solution' : null })),
  // General resources (Canvas "Resources" module).
  resources: [
    ['Labs — Repository with briefs and solutions', 'https://github.com/vctorChamizo/cunef-web-programming-labs'],
    ['Class examples — Repository with the code from the sessions', 'https://github.com/vctorChamizo/cunef-web-programming-class-examples-iacd-a-2026-27'],
    ['Git — Command cheat sheet', 'https://education.github.com/git-cheat-sheet-education.pdf'],
  ],
};
