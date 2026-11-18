// Course data for the study site. Hand-written from the cunef/ corpus. The site is shared by the
// groups of both semesters, so it carries no group, no calendar dates and no exam date: the course
// is organised by week and session, in the same order as the Canvas course.
// Weeks and sessions: 03-calendario/planificacion-1c-iacd-a.md (numbering [V-244]); the week titles
// and the reference links of each week follow the Canvas modules ("Semana 1" to "Semana 11").
// Labs: 01-asignaturas/05-laboratorios/estado-publicacion.md (public briefs and solutions).
'use strict';
const LABS_REPO = 'https://github.com/vctorChamizo/cunef-web-programming-labs/tree/main/labs/';
window.COURSE = {
  title: 'Programación de aplicaciones Web',
  code: 'G247',
  blocks: [
    {
      id: 1, roman: 'I', title: 'Fundamentos del navegador', subtitle: 'HTML, CSS, JavaScript y el DOM', weeks: 'Semanas 1 a 4',
      guide: 'I', quizzes: [1, 2, 3],
      weekList: [
        { n: 1, title: 'HTML: estructura de una página',
          sessions: [
            { n: '1', title: 'Presentación de la asignatura y arquitectura cliente-servidor' },
            { n: '2', title: 'HTML semántico' },
            { n: '3', title: 'Laboratorio 1: estructurar una página. Introducción a Git y GitHub', lab: 'L1' },
          ],
          links: [['HTML — Documentación oficial (MDN)', 'https://developer.mozilla.org/es/docs/Web/HTML']] },
        { n: 2, title: 'CSS: cajas y layout',
          sessions: [
            { n: '4', title: 'Selectores CSS y modelo de caja' },
            { n: '5', title: 'Flexbox y Grid' },
            { n: '6', title: 'Laboratorio 2: página estática responsive', lab: 'L2' },
          ],
          links: [['CSS — Documentación oficial (MDN)', 'https://developer.mozilla.org/es/docs/Web/CSS'], ['Flexbox Froggy — Práctica interactiva de Flexbox', 'https://flexboxfroggy.com/#es']] },
        { n: 3, title: 'JavaScript: fundamentos',
          sessions: [
            { n: '7', title: 'JavaScript: variables y tipos de datos' },
            { n: '8', title: 'JavaScript: estructuras de control y funciones' },
            { n: '9', title: 'Laboratorio 3: lógica y funciones', lab: 'L3' },
          ],
          links: [['JavaScript — Documentación oficial (MDN)', 'https://developer.mozilla.org/es/docs/Web/JavaScript'], ['JavaScript — Cheatsheet', 'https://www.javascriptcheatsheet.org/']] },
        { n: 4, title: 'DOM',
          sessions: [
            { n: '10', title: 'Manipulación del DOM' },
            { n: '11', title: 'Práctica de integración: lista de tareas interactiva' },
            { n: '12', title: 'Repaso del bloque I' },
          ],
          links: [['DOM — Documentación oficial (MDN)', 'https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model']] },
      ],
    },
    {
      id: 2, roman: 'II', title: 'Backend', subtitle: 'Node.js, Express, PostgreSQL y autenticación', weeks: 'Semanas 5 a 9',
      guide: 'II', quizzes: [4, 5, 6, 7],
      notes: ['La base de datos del curso, y la del examen, es PostgreSQL: SQL desde Node.js con el paquete pg.'], // [V-214, V-276]
      weekList: [
        { n: 5, title: 'Node.js y Express',
          sessions: [
            { n: '13', title: 'Node.js, npm y estructura de un proyecto' },
            { n: '14', title: 'Express: rutas y middleware' },
            { n: '15', title: 'Laboratorio 4: primeras rutas con Express', lab: 'L4' },
          ],
          milestone: 'Se presenta la Práctica 1: Foundations API.',
          links: [['Express.js — Documentación oficial', 'https://expressjs.com/es/'], ['Node.js — Documentación oficial', 'https://nodejs.org/docs/latest/api/']] },
        { n: 6, title: 'Controladores, errores y API REST',
          sessions: [
            { n: '16', title: 'Controladores y manejo de errores' },
            { n: '17', title: 'Principios de diseño de APIs REST' },
            { n: '18', title: 'Laboratorio 5: API CRUD en memoria', lab: 'L5' },
          ],
          links: [['Express — Guía de routing', 'https://expressjs.com/es/guide/routing.html'], ['Express — Guía de control de errores', 'https://expressjs.com/es/guide/error-handling.html']] },
        { n: 7, title: 'SQL y modelos',
          sessions: [
            { n: '20', title: 'Modelo relacional y PostgreSQL' },
            { n: '21', title: 'Consultas SQL y migraciones' },
            { n: '22', title: 'Laboratorio 6: SQL y capa de modelos', lab: 'L6' },
          ],
          links: [['PostgreSQL — Documentación oficial', 'https://www.postgresql.org/docs/current/'], ['node-postgres (pg) — Documentación oficial', 'https://node-postgres.com/'], ['dbdiagram — Documentación oficial de DBML', 'https://dbdiagram.io/docs'], ['Docker — Imagen oficial de PostgreSQL', 'https://hub.docker.com/_/postgres']] },
        { n: 8, title: 'Autenticación y seguridad',
          sessions: [
            { n: '25', title: 'Autenticación: sesiones y JWT' },
            { n: '26', title: 'Cifrado de contraseñas y validación' },
            { n: '27', title: 'Laboratorio 7: paginación y control de permisos', lab: 'L7' },
          ],
          links: [['JWT — Documentación oficial', 'https://jwt.io/introduction'], ['Zod — Documentación oficial', 'https://zod.dev/'], ['jsonwebtoken — Documentación oficial', 'https://github.com/auth0/node-jsonwebtoken#readme'], ['bcrypt.js — Documentación oficial', 'https://github.com/dcodeIO/bcrypt.js#readme']] },
        { n: 9, title: 'Entrega de la Práctica 1 y repaso del bloque II',
          sessions: [
            { n: '29', title: 'Entrega de la Práctica 1 y presentación de la Práctica 2' },
            { n: '30', title: 'Repaso de la Práctica 1 y otros estilos de API' },
          ],
          links: [] },
      ],
    },
    {
      id: 3, roman: 'III', title: 'Frontend con React', subtitle: 'Componentes, hooks, datos y navegación', weeks: 'Semanas 10 a 13',
      guide: null, quizzes: [8, 9, 10],
      notes: [ // [V-261, V-262]
        'Las peticiones a la API se hacen con Axios, con un cliente creado con axios.create y la URL base en VITE_API_URL.',
        'Las promesas se trabajan con async/await.',
      ],
      weekList: [
        { n: 10, title: 'Fundamentos de React y hooks',
          sessions: [
            { n: '31', title: 'React: JSX, componentes, props y estado' },
            { n: '32', title: 'Laboratorio 8: primeros componentes', lab: 'L8' },
            { n: '33', title: 'Hooks: useState, useEffect y useContext' },
          ],
          links: [['React — Documentación oficial', 'https://es.react.dev/learn'], ['Vite — Documentación oficial', 'https://vite.dev/guide/'], ['Material UI — Documentación oficial', 'https://mui.com/material-ui/getting-started/'], ['shadcn/ui — Documentación oficial', 'https://ui.shadcn.com/docs'], ['Ant Design — Documentación oficial', 'https://ant.design/docs/react/introduce']] },
        { n: 11, title: 'Datos y navegación en React',
          sessions: [
            { n: '34', title: 'Comunicación con APIs: Axios, async/await y estados de carga y error' },
            { n: '35', title: 'React Router y navegación' },
            { n: '36', title: 'Laboratorio 9: hooks en la práctica', lab: 'L9' },
          ],
          links: [['Axios — Documentación oficial', 'https://axios-http.com/es/docs/intro'], ['React Router — Documentación oficial', 'https://reactrouter.com/start/library/installation']] },
        { n: 12, title: 'Gestión de estado y estilos',
          sessions: [
            { n: '37', title: 'Gestión de estado: elevar el estado y Context API' },
            { n: '38', title: 'Estilos y extras' },
            { n: '39', title: 'Laboratorio 10: routing y estado', lab: 'L10' },
          ],
          links: [] },
        { n: 13, title: 'Presentaciones de la Práctica 2 y repaso general',
          sessions: [
            { n: '40', title: 'Presentaciones de la Práctica 2' },
            { n: '41', title: 'Presentaciones de la Práctica 2' },
            { n: '42', title: 'Repaso general y preparación del examen' },
          ],
          links: [] },
      ],
    },
  ],
  practices: [
    { name: 'Práctica 1', title: 'Foundations API', detail: 'API REST con operaciones CRUD y datos en memoria, con un cliente en HTML, CSS y JavaScript. Se presenta en la semana 5 y se entrega en la semana 9.' },
    { name: 'Práctica 2', title: 'Full-Stack Application', detail: 'Evolución del mismo proyecto: base de datos PostgreSQL, autenticación con JWT y frontend en React con React Router. Se presenta en la semana 9 y se expone en la semana 13.' },
  ],
  labs: [
    { id: 'L1', title: 'Estructurar una página con HTML semántico', dir: 'lab-01-semantic-html', solution: true },
    { id: 'L2', title: 'Aplicar CSS y construir una página responsive', dir: 'lab-02-responsive-css', solution: true },
    { id: 'L3', title: 'Lógica y funciones en JavaScript', dir: 'lab-03-javascript-logic-functions', solution: true },
    { id: 'L4', title: 'Primeras rutas con Express', dir: 'lab-04-express-routes', solution: true },
    { id: 'L5', title: 'API CRUD en memoria', dir: 'lab-05-crud-api', solution: true },
    { id: 'L6', title: 'SQL y capa de modelos', dir: 'lab-06-sql-models', solution: true },
    { id: 'L7', title: 'Autenticación, paginación y permisos', dir: 'lab-07-auth-pagination-permissions', solution: true },
    { id: 'L8', title: 'Primeros componentes React', dir: 'lab-08-react-components', solution: false },
    { id: 'L9', title: 'Hooks en la práctica', dir: 'lab-09-react-hooks', solution: false },
    { id: 'L10', title: 'Routing y gestión de estado', dir: null, solution: false },
  ].map((l) => ({ ...l, brief: l.dir ? LABS_REPO + l.dir : null, solutionUrl: l.dir && l.solution ? LABS_REPO + l.dir + '/solution' : null })),
  // General resources (Canvas module "Recursos").
  resources: [
    ['Laboratorios — Repositorio con enunciados y soluciones', 'https://github.com/vctorChamizo/cunef-web-programming-labs'],
    ['Ejemplos de clase — Repositorio con el código de las sesiones', 'https://github.com/vctorChamizo/g247-labs-IACD-A-2026-27'],
    ['Git — Cheat sheet de comandos', 'https://education.github.com/git-cheat-sheet-education.pdf'],
  ],
};
