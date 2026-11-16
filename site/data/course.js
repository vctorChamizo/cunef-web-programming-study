// Course data for the study site. Hand-written from the cunef/ corpus; every fact carries its
// source in a comment. Sessions and dates: 03-calendario/planificacion-1c-iacd-a.md.
// Exam: 04-contexto/04-calendario-horarios-y-aulas.md [V-110] and 03-asignatura-g247.md [D-01 §3.4].
// Labs: 01-asignaturas/05-laboratorios/estado-publicacion.md (public briefs and solutions).
'use strict';
const LABS_REPO = 'https://github.com/vctorChamizo/cunef-web-programming-labs/tree/main/labs/';
window.COURSE = {
  title: 'Programación de aplicaciones Web',
  code: 'G247',
  group: 'IACD-A · curso 2026-27',
  exam: {
    date: '2026-12-22T12:00:00+01:00', // [V-110]
    label: 'Martes 22 de diciembre de 2026, 12:00',
    room: 'Aula PIR 0.11',
    weight: '60 % de la nota final',
    minimum: 'Calificación mínima de 5 sobre 10 en el examen para aprobar la asignatura', // [D-01]
    parts: [ // [D-01 §3.4]
      { name: 'Parte tipo test', points: '4 puntos', detail: '8 preguntas de 0,5 puntos cada una. Las respuestas incorrectas no descuentan.' },
      { name: 'Parte práctica', points: '6 puntos', detail: 'Ejercicios de programación sobre el temario de la asignatura. La base de datos es PostgreSQL, con SQL.' }, // [V-276]
    ],
    review: { session: 42, label: 'Miércoles 2 de diciembre: repaso general y preparación del examen' },
  },
  blocks: [
    {
      id: 1, roman: 'I', title: 'Fundamentos del navegador', subtitle: 'HTML, CSS, JavaScript y el DOM', weeks: 'Semanas 1 a 4',
      guide: 'I', quizzes: [1, 2, 3],
      sessions: [
        { n: '1', date: '1 sep', title: 'Presentación de la asignatura y arquitectura cliente-servidor' },
        { n: '2', date: '1 sep', title: 'HTML semántico' },
        { n: '3', date: '2 sep', title: 'Laboratorio 1: estructurar una página. Introducción a Git y GitHub', lab: 'L1' },
        { n: '4', date: '8 sep', title: 'Selectores CSS y modelo de caja' },
        { n: '5', date: '8 sep', title: 'Flexbox y Grid' },
        { n: '6', date: '9 sep', title: 'Laboratorio 2: página estática responsive', lab: 'L2' },
        { n: '7', date: '15 sep', title: 'JavaScript: variables y tipos de datos' },
        { n: '8', date: '15 sep', title: 'JavaScript: estructuras de control y funciones' },
        { n: '9', date: '16 sep', title: 'Laboratorio 3: lógica y funciones', lab: 'L3' },
        { n: '10', date: '22 sep', title: 'Manipulación del DOM' },
        { n: '11', date: '22 sep', title: 'Práctica de integración: lista de tareas interactiva' },
        { n: '12', date: '23 sep', title: 'Repaso del bloque I' },
      ],
    },
    {
      id: 2, roman: 'II', title: 'Backend', subtitle: 'Node.js, Express, PostgreSQL y autenticación', weeks: 'Semanas 5 a 9',
      guide: 'II', quizzes: [4, 5, 6, 7],
      notes: ['La base de datos del curso, y la del examen, es PostgreSQL: SQL desde Node.js con el paquete pg.'], // [V-214, V-276]
      sessions: [
        { n: '13', date: '29 sep', title: 'Node.js, npm y estructura de un proyecto' },
        { n: '14', date: '29 sep', title: 'Express: rutas y middleware' },
        { n: '15', date: '30 sep', title: 'Laboratorio 4: primeras rutas con Express', lab: 'L4' },
        { n: '16', date: '13 oct', title: 'Controladores y manejo de errores' },
        { n: '17', date: '13 oct', title: 'Principios de diseño de APIs REST' },
        { n: '18', date: '14 oct', title: 'Laboratorio 5: API CRUD en memoria', lab: 'L5' },
        { n: '20', date: '19 oct', title: 'Modelo relacional y PostgreSQL' },
        { n: '21', date: '19 oct', title: 'Consultas SQL y migraciones' },
        { n: '22', date: '20 oct', title: 'Laboratorio 6: SQL y capa de modelos', lab: 'L6' },
        { n: '25', date: '27 oct', title: 'Autenticación: sesiones y JWT' },
        { n: '26', date: '28 oct', title: 'Cifrado de contraseñas y validación' },
        { n: '27', date: '28 oct', title: 'Laboratorio 7: paginación y control de permisos', lab: 'L7' },
        { n: '30', date: '4 nov', title: 'Repaso de la Práctica 1 y otros estilos de API' },
      ],
    },
    {
      id: 3, roman: 'III', title: 'Frontend con React', subtitle: 'Componentes, hooks, datos y navegación', weeks: 'Semanas 10 a 13',
      guide: null, quizzes: [8, 9, 10],
      sessions: [
        { n: '31', date: '10 nov', title: 'React: JSX, componentes, props y estado' },
        { n: '32', date: '10 nov', title: 'Laboratorio 8: primeros componentes', lab: 'L8' },
        { n: '33', date: '11 nov', title: 'Hooks: useState, useEffect y useContext' },
        { n: '34', date: '17 nov', title: 'Comunicación con APIs: Axios, async/await y estados de carga y error' },
        { n: '35', date: '17 nov', title: 'React Router y navegación' },
        { n: '36', date: '18 nov', title: 'Laboratorio 9: hooks en la práctica', lab: 'L9' },
        { n: '37', date: '24 nov', title: 'Gestión de estado: elevar el estado y Context API' },
        { n: '38', date: '24 nov', title: 'Estilos y extras' },
        { n: '39', date: '25 nov', title: 'Laboratorio 10: routing y estado', lab: 'L10' },
        { n: '42', date: '2 dic', title: 'Repaso general y preparación del examen' },
      ],
      notes: [ // [V-261, V-262]
        'Las peticiones a la API se hacen con Axios, con un cliente creado con axios.create y la URL base en VITE_API_URL.',
        'Las promesas se trabajan con async/await.',
        'La guía del bloque III se publicará al cerrar el bloque. Mientras tanto, las referencias son las presentaciones de cada semana y la documentación oficial.',
      ],
    },
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
  docs: [
    { group: 'Navegador', items: [
      ['MDN: HTML', 'https://developer.mozilla.org/es/docs/Web/HTML'],
      ['MDN: CSS', 'https://developer.mozilla.org/es/docs/Web/CSS'],
      ['MDN: JavaScript', 'https://developer.mozilla.org/es/docs/Web/JavaScript'],
      ['MDN: el DOM', 'https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model'],
    ] },
    { group: 'Servidor', items: [
      ['Node.js', 'https://nodejs.org/docs/latest/api/'],
      ['Express', 'https://expressjs.com/es/'],
      ['PostgreSQL', 'https://www.postgresql.org/docs/'],
      ['node-postgres (pg)', 'https://node-postgres.com/'],
      ['JSON Web Tokens', 'https://jwt.io/introduction'],
    ] },
    { group: 'React', items: [
      ['React', 'https://es.react.dev/learn'],
      ['Axios', 'https://axios-http.com/es/docs/intro'],
      ['React Router', 'https://reactrouter.com/'],
      ['Vite', 'https://vite.dev/guide/'],
    ] },
  ],
  coordinatorSite: { // [M-12, V-272]
    url: 'https://ture2.github.io/web-programming/#/',
    warnings: [
      'En la sección de peticiones de datos se usa fetch; en este curso se usa Axios.',
      'La conexión a la base de datos desde Node se hace con SQLite; en este curso, y en el examen, se usa PostgreSQL con pg.',
      'La sección de MongoDB no forma parte del temario de este grupo ni del examen.',
      'La limpieza de efectos, AbortController y las rutas anidadas con Outlet no se han trabajado en este curso.',
    ],
  },
};
