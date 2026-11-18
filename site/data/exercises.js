// Practical programming exercises for the study site (study mode and the practical part of the
// practice exams). Hand-written. Conventions follow the course labs: CommonJS in the backend,
// node-postgres with parameterized queries, JWT payload in req.user ({ sub, role }), pagination
// responses as { page, limit, items }, React with useState/useEffect, Axios through a client created
// with axios.create, async/await only, React Router imported from "react-router".
// Context API (sessions 37-38) is covered by C3. Left out, as in the course: effect cleanup and
// nested routes.
//
// Inside these template literals, a backtick is written \` and a dollar-brace is written \${.
'use strict';
window.EXERCISES = [
  // ------------------------------------------------------------------ A1
  {
    id: 'A1', kind: 'js', category: 'Corrección de errores', tech: 'JavaScript',
    title: 'Nombres de los usuarios activos',
    concepts: ['filter', 'map', 'return en funciones flecha'],
    level: 'Básica', minutes: '5-8',
    statement: `Una aplicación guarda los usuarios en un array de objetos. La función \`getActiveNames\` debe devolver **solo los nombres** de los usuarios activos, pero al ejecutarla aparece \`[ undefined, undefined ]\`.

Se pide:

1. Corregir la función para que devuelva los nombres esperados.
2. Indicar en una línea, como comentario, cuál era el error.`,
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
    expected: `La llamada \`getActiveNames(users)\` devuelve \`[ "Ana", "Marta" ]\`. El array \`users\` original no cambia.`,
    hints: [
      'Revisar cómo devuelve un valor una función flecha cuando su cuerpo va entre llaves y cuando no las lleva.',
      'El \`filter\` funciona bien: el problema está en el callback de \`map\`. ¿Qué devuelve ese callback para cada usuario?',
    ],
    solution: {
      code: `function getActiveNames(list) {
  return list
    .filter((user) => user.active)
    .map((user) => user.name); // el callback de map no devolvía nada
}`,
      changes: ['En el callback de \`map\`, sustituir el cuerpo entre llaves por una expresión: \`(user) => user.name\`.'],
      explanation: `\`map\` construye un array nuevo con lo que **devuelve** el callback para cada elemento. Una función flecha con llaves es un bloque: si no tiene \`return\`, devuelve \`undefined\`. Por eso el array resultante tiene un \`undefined\` por cada usuario activo. Sin llaves, la función flecha devuelve directamente el valor de la expresión.`,
      alternatives: 'Mantener las llaves y añadir \`return\`: \`.map((user) => { return user.name; })\`. Es igual de correcto.',
    },
    rubric: [
      { text: 'Identifica que el error está en el callback de \`map\`, no en \`filter\`', points: 3 },
      { text: 'El callback devuelve \`user.name\`, sin llaves o con \`return\`', points: 4 },
      { text: 'Conserva \`filter\` y no modifica el array original', points: 2 },
      { text: 'El comentario explica que el callback no devolvía ningún valor', points: 1 },
    ],
    penalties: ['Sustituir \`filter\` y \`map\` por un bucle que modifica \`users\`: -2.', 'Devolver los objetos completos en lugar de los nombres: no se concede el criterio de 4 puntos.'],
    partial: 'Si se añade \`return\` pero se devuelve un valor equivocado (por ejemplo, \`user\`), se conceden los 3 puntos de identificación.',
  },

  // ------------------------------------------------------------------ B1
  {
    id: 'B1', kind: 'js', category: 'Completar código', tech: 'JavaScript y DOM',
    title: 'Añadir tareas desde un formulario',
    concepts: ['addEventListener', 'preventDefault', 'createElement', 'textContent'],
    level: 'Básica', minutes: '10',
    statement: `Una página tiene un formulario para añadir tareas a una lista. El script ya selecciona los elementos y registra el evento \`submit\`, pero el manejador está incompleto.

Se pide completar los tres puntos marcados en el manejador:

1. Evitar que el envío del formulario recargue la página.
2. Si el campo está vacío, mostrar el texto \`Escribe una tarea\` en \`#message\` y no añadir nada.
3. Si tiene texto, crear un elemento \`<li>\` con ese texto y añadirlo al final de \`#task-list\`.`,
    files: [
      { name: 'index.html', lang: 'html', code: `<form id="task-form">
  <input id="task-input" type="text" placeholder="Nueva tarea">
  <button type="submit">Añadir</button>
</form>
<p id="message"></p>
<ul id="task-list"></ul>` },
      { name: 'app.js', lang: 'js', code: `const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");

form.addEventListener("submit", (event) => {
  // 1. Evitar que el formulario recargue la página

  const text = input.value.trim();

  // 2. Si el texto está vacío, mostrar "Escribe una tarea" en #message
  //    y terminar sin añadir nada

  // 3. Crear un <li> con el texto y añadirlo al final de la lista

  message.textContent = "";
  input.value = "";
});` },
    ],
    edit: 'app.js',
    expected: `- Al pulsar **Añadir** con el texto \`Comprar pan\`, aparece \`<li>Comprar pan</li>\` al final de la lista, el campo se vacía y la página no se recarga.
- Al pulsar **Añadir** con el campo vacío o solo con espacios, aparece \`Escribe una tarea\` y la lista no cambia.`,
    hints: [
      'Repasar qué hace el navegador por defecto al enviar un formulario y qué método del objeto \`event\` lo impide.',
      'Para el punto 2 basta un \`if\` que termine el manejador con \`return\`. Para el punto 3 hacen falta tres pasos: crear el elemento, darle el texto y añadirlo a la lista.',
    ],
    solution: {
      code: `form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    message.textContent = "Escribe una tarea";
    return;
  }

  const li = document.createElement("li");
  li.textContent = text;
  list.appendChild(li);

  message.textContent = "";
  input.value = "";
});`,
      changes: ['\`event.preventDefault()\` al principio del manejador.', 'Un \`if\` que muestra el mensaje y sale con \`return\` cuando el texto está vacío.', 'Creación del \`<li>\` con \`createElement\`, texto con \`textContent\` y \`appendChild\` sobre la lista.'],
      explanation: `Enviar un formulario hace que el navegador recargue la página; \`preventDefault\` cancela ese comportamiento para gestionarlo con JavaScript. El \`return\` dentro del \`if\` evita que se ejecute el resto del manejador. \`textContent\` inserta el texto tal cual, sin interpretarlo como HTML.`,
      alternatives: '\`list.append(li)\` en lugar de \`appendChild\`. \`if (!text)\` en lugar de \`text === ""\`. Construir el \`<li>\` con \`innerHTML\` también funciona, aunque \`textContent\` es preferible porque no interpreta el texto como HTML.',
    },
    rubric: [
      { text: 'Llama a \`event.preventDefault()\`', points: 2 },
      { text: 'Comprueba el texto vacío, muestra el mensaje y sale sin añadir', points: 3 },
      { text: 'Crea el \`<li>\` y le asigna el texto', points: 3 },
      { text: 'Añade el \`<li>\` al final de \`#task-list\`', points: 2 },
    ],
    penalties: ['Sin \`return\` en el caso vacío, de forma que se añade un \`<li>\` vacío: se pierde 1 de los 3 puntos del criterio.', 'Sustituir toda la lista en cada envío (\`list.innerHTML = ...\`): -2.'],
    partial: 'Si el \`<li>\` se crea pero no se añade a la lista, se conceden los 3 puntos de creación.',
  },

  // ------------------------------------------------------------------ A2
  {
    id: 'A2', kind: 'express', category: 'Corrección de errores', tech: 'Express y PostgreSQL',
    title: 'Tarea inexistente con código 200',
    concepts: ['códigos de estado HTTP', '404', 'return en un controlador'],
    level: 'Básica', minutes: '8',
    statement: `Una API de tareas tiene el endpoint \`GET /tasks/:id\`. Cuando la tarea existe funciona bien, pero cuando no existe responde \`200\` con el cuerpo \`null\`. Un cliente no puede distinguir así entre «la tarea existe» y «no existe».

Se pide corregir el endpoint para que, si la tarea no existe, responda \`404\` con el cuerpo \`{ "error": "Task not found" }\`. El modelo es correcto y no debe cambiarse.`,
    files: [
      { name: 'models/tasksModel.js', lang: 'js', code: `const db = require("../db");

async function findById(id) {
  const { rows } = await db.query(
    "SELECT id, title, done FROM tasks WHERE id = $1",
    [id]
  );
  return rows[0] ?? null; // null si no hay ninguna fila
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
    expected: `| Petición | Respuesta |
|---|---|
| \`GET /tasks/1\` (existe) | \`200\` con \`{ "id": 1, "title": "Estudiar SQL", "done": false }\` |
| \`GET /tasks/999\` (no existe) | \`404\` con \`{ "error": "Task not found" }\` |`,
    hints: [
      'Revisar qué devuelve \`findById\` cuando la consulta no encuentra ninguna fila y qué código HTTP corresponde a «el recurso no existe».',
      'Hace falta comprobar el resultado antes de responder. Cuidado con enviar dos respuestas en la misma petición.',
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
      changes: ['Un \`if (!task)\` que responde \`404\` con el mensaje de error.', '\`return\` en esa respuesta, para que no se ejecute también la respuesta 200.'],
      explanation: `El modelo devuelve \`null\` cuando no hay fila, y \`null\` es un JSON válido: por eso Express respondía 200. El controlador es quien traduce «no hay resultado» a un código HTTP. El \`return\` es necesario porque, sin él, la ejecución continúa y Express intenta enviar una segunda respuesta, lo que provoca el error *Cannot set headers after they are sent*.`,
      alternatives: 'Usar \`if (task === null)\`. Escribir la respuesta correcta en un \`else\` en lugar de usar \`return\`. Mantener \`res.status(200).json(task)\` en el caso correcto: 200 es el código por defecto, pero indicarlo no es un error.',
    },
    rubric: [
      { text: 'Comprueba si \`task\` es \`null\` antes de responder', points: 3 },
      { text: 'Responde \`404\` con \`{ error: "Task not found" }\`', points: 3 },
      { text: 'Evita la doble respuesta con \`return\` o con \`else\`', points: 2 },
      { text: 'Mantiene la respuesta \`200\` con la tarea cuando existe', points: 2 },
    ],
    penalties: ['Modificar el modelo para que lance un error o responda él mismo: -2, porque el modelo no conoce \`res\`.', 'Usar 400 o 500 en lugar de 404: no se conceden los 3 puntos del código.'],
    partial: 'Si se responde 404 pero sin el cuerpo indicado, se conceden 2 de los 3 puntos del código.',
  },

  // ------------------------------------------------------------------ A3
  {
    id: 'A3', kind: 'express', category: 'Corrección de errores', tech: 'Express y PostgreSQL',
    title: 'La tarea creada llega vacía',
    concepts: ['async/await', 'promesas', 'modelo y controlador'],
    level: 'Intermedia-baja', minutes: '10',
    statement: `En una API de tareas, \`POST /tasks\` inserta la tarea en PostgreSQL y debe devolver la fila creada. La tarea se guarda bien en la base de datos, pero el cliente recibe \`201\` con el cuerpo \`{}\` en lugar de la tarea.

Se pide corregir el controlador para que responda con la tarea creada y explicar en un comentario por qué llegaba \`{}\`. El modelo es correcto.`,
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
    expected: `\`POST /tasks\` con el cuerpo \`{ "title": "Repasar JWT" }\` responde \`201\` con \`{ "id": 7, "title": "Repasar JWT", "done": false }\`.`,
    hints: [
      'Repasar qué devuelve una función declarada con \`async\` cuando se la llama.',
      'Comparar la línea que llama al modelo con las líneas del propio modelo que llaman a \`db.query\`. ¿Qué tiene una que le falta a la otra?',
    ],
    solution: {
      code: `async function createTask(req, res) {
  const { title } = req.body;
  // Sin await, task era una promesa pendiente, y una promesa se convierte en {} al pasarla a JSON
  const task = await tasksModel.create(title);
  res.status(201).json(task);
}`,
      changes: ['Añadir \`await\` delante de \`tasksModel.create(title)\`.'],
      explanation: `\`create\` es una función \`async\`: al llamarla devuelve inmediatamente una **promesa**, no la fila. Sin \`await\`, el controlador envía esa promesa, que al convertirse a JSON queda como \`{}\`. La inserción sí se ejecuta, por eso la tarea aparece en la base de datos. Con \`await\`, el controlador espera a que la consulta termine y recibe la fila que devuelve \`RETURNING\`. \`createTask\` ya es \`async\`, así que puede usar \`await\`.`,
      alternatives: 'No hay una alternativa razonable dentro de las convenciones del curso, que trabaja las promesas con \`async/await\`.',
    },
    rubric: [
      { text: 'Identifica que \`create\` devuelve una promesa', points: 3 },
      { text: 'Añade \`await\` en la llamada al modelo', points: 4 },
      { text: 'Mantiene la respuesta \`201\` con la tarea', points: 1 },
      { text: 'El comentario explica por qué llegaba \`{}\`', points: 2 },
    ],
    penalties: ['Quitar \`async\` del modelo o reescribirlo: -2.', 'Cambiar el código a 200: -1.'],
    partial: 'Si la explicación menciona la asincronía pero no la relaciona con la promesa enviada como JSON, se concede 1 de los 2 puntos.',
  },

  // ------------------------------------------------------------------ B2
  {
    id: 'B2', kind: 'express', category: 'Completar código', tech: 'Express y JWT',
    title: 'Middleware de autenticación',
    concepts: ['middleware', 'cabecera Authorization', 'jwt.verify', '401'],
    level: 'Intermedia-baja', minutes: '10-12',
    statement: `Las rutas de tareas solo deben atender a usuarios autenticados. El cliente envía el token en la cabecera \`Authorization: Bearer <token>\`. El middleware \`auth\` está a medio escribir.

Se pide completar los tres puntos marcados:

1. Si no hay cabecera o no empieza por \`Bearer \`, responder \`401\` con \`{ "error": "Missing token" }\`.
2. Verificar el token con \`process.env.JWT_SECRET\` y guardar su contenido en \`req.user\`.
3. Si el token no es válido o ha caducado, responder \`401\` con \`{ "error": "Invalid or expired token" }\`.`,
    files: [{ name: 'middleware/auth.js', lang: 'js', code: `const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization; // "Bearer <token>"

  // 1. Sin cabecera, o sin el prefijo "Bearer ": 401 { error: "Missing token" }

  const token = header.slice(7); // quita "Bearer "

  try {
    // 2. Verificar el token y guardar su contenido en req.user

    next();
  } catch (error) {
    // 3. Token no válido o caducado: 401 { error: "Invalid or expired token" }
  }
}

module.exports = auth;

// Uso: router.get("/", auth, tasksController.list);` }],
    expected: `| Petición | Resultado |
|---|---|
| Sin cabecera \`Authorization\` | \`401\` con \`{ "error": "Missing token" }\` |
| \`Authorization: Bearer abc\` (token falso) | \`401\` con \`{ "error": "Invalid or expired token" }\` |
| Token válido | Se ejecuta el controlador y \`req.user\` contiene, por ejemplo, \`{ sub: 4, role: "user", iat: …, exp: … }\` |`,
    hints: [
      'Repasar qué hace \`jwt.verify\` cuando el token es válido y qué hace cuando no lo es.',
      'El punto 1 debe terminar el middleware antes de llegar a \`header.slice(7)\`: si \`header\` no existe, esa línea fallaría.',
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
      changes: ['Comprobación de la cabecera con \`return\` y 401.', '\`req.user = jwt.verify(token, process.env.JWT_SECRET)\` dentro del \`try\`.', 'Respuesta 401 en el \`catch\`.'],
      explanation: `\`jwt.verify\` comprueba la firma con el secreto y la fecha de caducidad. Si todo es correcto, devuelve el contenido del token (el *payload*); si no, **lanza un error**, por eso va dentro de \`try/catch\`. Guardar el payload en \`req.user\` permite que los controladores sepan quién hace la petición sin fiarse de datos que envíe el cliente. Las dos respuestas son 401 porque el problema es la identidad: el 403 se reserva para un usuario identificado que no tiene permiso.`,
      alternatives: '\`if (!header?.startsWith("Bearer "))\`. Extraer el token con \`header.split(" ")[1]\`. No usar \`return\` en el \`catch\` es aceptable, porque es la última instrucción del middleware.',
    },
    rubric: [
      { text: 'Comprueba la cabecera y el prefijo, y responde 401 con \`return\`', points: 3 },
      { text: 'Verifica con \`jwt.verify\` y el secreto de \`process.env\`', points: 3 },
      { text: 'Guarda el resultado en \`req.user\` antes de \`next()\`', points: 2 },
      { text: 'Responde 401 con el mensaje indicado en el \`catch\`', points: 2 },
    ],
    penalties: ['Usar \`jwt.decode\` en lugar de \`jwt.verify\`: no se conceden los 3 puntos de verificación, porque \`decode\` no comprueba la firma.', 'Responder 403 en lugar de 401: -1 por cada caso.', 'Escribir el secreto en el código: -1.'],
    partial: 'Si falta el \`return\` del punto 1, se conceden 2 de sus 3 puntos.',
  },

  // ------------------------------------------------------------------ D1
  {
    id: 'D1', kind: 'express', category: 'Comprensión de código', tech: 'Express, PostgreSQL y JWT',
    title: 'Recorrido de una petición paginada',
    concepts: ['middleware', 'paginación con LIMIT y OFFSET', 'consultas parametrizadas', 'propietario desde el token'],
    level: 'Intermedia-baja', minutes: '12-15',
    statement: `El siguiente código pertenece a una API de tareas en la que cada usuario solo ve las suyas. No hay que modificarlo: se pide **explicar su funcionamiento** respondiendo a las cinco preguntas del recuadro.

Un cliente con un token válido del usuario con \`sub: 4\` envía \`GET /tasks?page=2&limit=5\`.`,
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
    answerStarter: `1. ¿En qué orden se ejecutan auth, list y findByOwner, y qué hace cada uno?

2. ¿Qué valores toman page, limit y offset? ¿Qué tareas devuelve la consulta?

3. ¿Qué ocurre si la petición llega sin token? ¿Se ejecuta list?

4. ¿Por qué la consulta usa $1, $2 y $3 en lugar de concatenar los valores en el texto SQL?

5. ¿Por qué el usuario se toma de req.user.sub y no de un parámetro de la URL o del cuerpo?
`,
    expected: 'Cinco respuestas breves, de una a tres frases cada una, que expliquen el flujo, los valores concretos de esta petición y el motivo de las dos decisiones técnicas.',
    hints: [
      'Para la pregunta 1, repasar qué significa pasar varias funciones a \`router.get\` y para qué sirve \`next()\`.',
      'Para la pregunta 2, sustituir los valores de la URL en las tres primeras líneas de \`list\`: \`req.query\` siempre llega como texto.',
    ],
    solution: {
      code: `1. Express ejecuta las funciones en orden. auth comprueba el token y, si es válido,
   guarda su contenido en req.user y llama a next(). Después list (el controlador) lee
   la paginación, llama al modelo y responde. findByOwner (el modelo) ejecuta la consulta
   en PostgreSQL y devuelve las filas.

2. page = 2, limit = 5, offset = (2 - 1) * 5 = 5. La consulta devuelve las tareas del
   usuario 4 ordenadas por id, saltándose las 5 primeras: de la sexta a la décima.
   La respuesta es { page: 2, limit: 5, items: [ ...hasta 5 tareas ] }.

3. auth responde 401 y no llama a next(), así que list no llega a ejecutarse.

4. Son consultas parametrizadas: pg envía los valores aparte del texto SQL, así que no
   pueden alterar la consulta. Concatenarlos permitiría una inyección SQL.

5. El token está firmado por el servidor, así que req.user.sub es fiable. Un id en la URL
   o en el cuerpo lo elige el cliente y permitiría ver las tareas de otro usuario.`,
      changes: ['No aplica: es un ejercicio de comprensión.'],
      explanation: `\`Number(req.query.page) || 1\` convierte el texto a número y usa 1 si el resultado no es válido (\`NaN\`) o es 0; \`Math.max\` y \`Math.min\` acotan los valores para que \`limit\` quede entre 1 y 50. \`ORDER BY\` es necesario para que la paginación sea estable: sin un orden, PostgreSQL no garantiza qué filas caen en cada página.`,
      alternatives: 'Cualquier explicación equivalente con otras palabras. En la pregunta 2 basta con indicar que se devuelven las tareas 6 a 10 del usuario.',
    },
    rubric: [
      { text: 'Pregunta 1: orden correcto y papel de \`next()\`', points: 2 },
      { text: 'Pregunta 2: valores de \`page\`, \`limit\` y \`offset\`, y qué filas devuelve', points: 3 },
      { text: 'Pregunta 3: 401 y el controlador no se ejecuta', points: 1.5 },
      { text: 'Pregunta 4: consultas parametrizadas frente a inyección SQL', points: 2 },
      { text: 'Pregunta 5: el propietario sale del token firmado', points: 1.5 },
    ],
    penalties: ['Afirmar que \`offset\` es 10: -1.', 'Confundir 401 con 403 en la pregunta 3: -0,5.'],
    partial: 'En la pregunta 2, si \`offset\` es correcto pero no se explica qué filas se devuelven, se conceden 2 de los 3 puntos.',
  },

  // ------------------------------------------------------------------ A4
  {
    id: 'A4', kind: 'react', category: 'Corrección de errores', tech: 'React',
    title: 'La tarea no se tacha al pulsarla',
    concepts: ['useState', 'inmutabilidad del estado', 'map con spread'],
    level: 'Intermedia-baja', minutes: '10',
    statement: `Un componente muestra una lista de tareas. Al pulsar una tarea debería tacharse o destacharse, pero no ocurre nada en pantalla. Si se inspecciona el array con \`console.log\`, el valor de \`done\` sí ha cambiado.

Se pide corregir la función \`toggle\` para que la pantalla se actualice, sin cambiar el resto del componente.`,
    files: [{ name: 'TaskList.jsx', lang: 'jsx', code: `import { useState } from "react";

const INITIAL = [
  { id: 1, title: "Leer la guía", done: false },
  { id: 2, title: "Hacer el quiz", done: false },
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
    expected: 'Al pulsar «Leer la guía» se tacha; al pulsarla otra vez se destacha. Las demás tareas no cambian.',
    hints: [
      'Repasar cómo decide React si debe volver a renderizar un componente cuando se llama a la función que actualiza un estado.',
      '\`setTasks\` recibe exactamente el mismo array que ya tenía, aunque su contenido se haya modificado. Hace falta pasarle un array nuevo.',
    ],
    solution: {
      code: `function toggle(id) {
  setTasks(
    tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
  );
}`,
      changes: ['Sustituir la modificación directa por un \`map\` que crea un array nuevo.', 'Crear un objeto nuevo para la tarea pulsada con \`{ ...t, done: !t.done }\`.'],
      explanation: `React compara el estado nuevo con el anterior por **referencia**. El código original modificaba el objeto y volvía a pasar el mismo array, así que React consideraba que nada había cambiado y no renderizaba. El estado debe tratarse como inmutable: se crea un array nuevo, y un objeto nuevo para el elemento que cambia.`,
      alternatives: 'Copiar el array y el objeto antes de modificarlos: \`const copy = tasks.map((t) => ({ ...t }));\`, cambiar \`done\` en la copia y llamar a \`setTasks(copy)\`. Usar la forma funcional \`setTasks((prev) => prev.map(...))\` también es correcto.',
    },
    rubric: [
      { text: 'Identifica que se modifica el estado directamente y se pasa la misma referencia', points: 3 },
      { text: 'Pasa a \`setTasks\` un array nuevo', points: 3 },
      { text: 'Crea un objeto nuevo para la tarea modificada, sin mutar el original', points: 2 },
      { text: 'Solo cambia la tarea pulsada', points: 2 },
    ],
    penalties: ['Forzar el renderizado con un segundo estado auxiliar: no se conceden los criterios de 3 y 2 puntos.', 'Copiar el array con \`[...tasks]\` pero seguir mutando el objeto: se pierden los 2 puntos del objeto nuevo.'],
    partial: '\`setTasks([...tasks])\` después de mutar el objeto hace que la pantalla se actualice: se conceden 3 + 3 + 2 puntos, pero no los 2 de no mutar el original.',
  },

  // ------------------------------------------------------------------ B3
  {
    id: 'B3', kind: 'react', category: 'Completar código', tech: 'React y Axios',
    title: 'Cargar las tareas desde la API',
    concepts: ['useEffect', 'async/await', 'try/catch/finally', 'data, loading y error'],
    level: 'Intermedia-baja', minutes: '10',
    statement: `El componente \`TaskList\` debe pedir las tareas a la API al montarse y mostrar una de tres ramas: cargando, error o lista. Los estados, el efecto y el renderizado ya están escritos; falta el cuerpo de la función \`load\`.

Se pide completar \`load\` para que:

1. Pida \`GET /tasks\` con el cliente \`api\`.
2. Guarde los datos recibidos en \`tasks\`.
3. Si la petición falla, guarde el mensaje \`No se han podido cargar las tareas\` en \`error\`.
4. Desactive \`loading\` tanto si la petición sale bien como si falla.`,
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
      // Completar
    }
    load();
  }, []);

  if (loading) return <p>Cargando…</p>;
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
    expected: `- Mientras llega la respuesta se ve \`Cargando…\`.
- Si la API responde con \`[{ "id": 1, "title": "Leer la guía" }]\`, se ve una lista con «Leer la guía».
- Si la API no responde o devuelve un error 4xx o 5xx, se ve \`No se han podido cargar las tareas\` y nunca se queda en \`Cargando…\`.`,
    hints: [
      'Repasar el patrón de tres estados del laboratorio 9 y qué bloque de \`try/catch/finally\` se ejecuta siempre.',
      'Con Axios, los datos están en una propiedad concreta de la respuesta, y cualquier código 4xx o 5xx hace que \`await\` lance un error.',
    ],
    solution: {
      code: `async function load() {
  try {
    const response = await api.get("/tasks");
    setTasks(response.data);
  } catch (err) {
    setError("No se han podido cargar las tareas");
  } finally {
    setLoading(false);
  }
}`,
      changes: ['\`await api.get("/tasks")\` dentro de \`try\` y \`setTasks(response.data)\`.', '\`setError\` con el mensaje en \`catch\`.', '\`setLoading(false)\` en \`finally\`.'],
      explanation: `Axios devuelve el JSON ya convertido en \`response.data\` y lanza un error ante cualquier respuesta 4xx o 5xx o si no hay conexión, por eso un único \`catch\` cubre todos los fallos. \`finally\` se ejecuta en los dos casos: si \`setLoading(false)\` solo estuviera en el \`try\`, un error dejaría la pantalla cargando para siempre. La función \`async\` se declara dentro del efecto porque el efecto no puede ser \`async\`: React espera que no devuelva una promesa.`,
      alternatives: 'Desestructurar la respuesta: \`const { data } = await api.get("/tasks"); setTasks(data);\`. Poner \`setLoading(false)\` al final del \`try\` y del \`catch\` en lugar de en \`finally\` es funcionalmente equivalente, aunque \`finally\` es la forma vista en clase.',
    },
    rubric: [
      { text: 'Hace la petición con \`await api.get("/tasks")\`', points: 3 },
      { text: 'Guarda \`response.data\` en \`tasks\`', points: 2 },
      { text: 'Gestiona el error con \`try/catch\` y el mensaje indicado', points: 2.5 },
      { text: 'Desactiva \`loading\` en todos los casos', points: 2.5 },
    ],
    penalties: ['Usar \`fetch\` o \`.then\` en lugar del cliente y \`async/await\`: -1, por no seguir la convención del curso.', 'Guardar \`response\` completo en lugar de \`response.data\`: no se conceden los 2 puntos.', 'Convertir el callback de \`useEffect\` en \`async\`: -1.'],
    partial: 'Si \`setLoading(false)\` solo está en el \`try\`, se conceden 1 de los 2,5 puntos de ese criterio.',
  },

  // ------------------------------------------------------------------ C1
  {
    id: 'C1', kind: 'react', category: 'Integración', tech: 'React Router',
    title: 'Página de detalle de una tarea',
    concepts: ['Routes y Route', 'rutas con parámetros', 'Link', 'useParams'],
    level: 'Básica', minutes: '8',
    statement: `Una aplicación React ya tiene \`BrowserRouter\` en \`main.jsx\`, una lista de tareas y un componente \`TaskDetail\` terminado. Falta conectarlos.

Se pide completar los tres puntos marcados para que, al pulsar una tarea de la lista, se navegue a \`/tasks/:id\` y se muestre su detalle.`,
    files: [
      { name: 'data.js', lang: 'js', code: `export const TASKS = [
  { id: 1, title: "Leer la guía", done: false },
  { id: 2, title: "Hacer el quiz", done: true },
];` },
      { name: 'App.jsx', lang: 'jsx', code: `import { Routes, Route } from "react-router";
import TaskList from "./TaskList.jsx";
import TaskDetail from "./TaskDetail.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskList />} />
      {/* 1. Ruta del detalle: /tasks/:id */}
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
          {/* 2. Enlace a /tasks/<id> con el título de la tarea */}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;` },
      { name: 'TaskDetail.jsx', lang: 'jsx', code: `import { useParams } from "react-router";
import { TASKS } from "./data.js";

function TaskDetail() {
  // 3. Leer el id de la URL
  const id = null;

  const task = TASKS.find((t) => t.id === Number(id));
  if (!task) return <p>Tarea no encontrada</p>;

  return <h1>{task.title}</h1>;
}

export default TaskDetail;` },
    ],
    edit: 'TaskDetail.jsx',
    answerStarter: `// App.jsx · punto 1


// TaskList.jsx · punto 2


// TaskDetail.jsx · punto 3
`,
    expected: `- En \`/\` se ve la lista; cada título es un enlace.
- Al pulsar «Hacer el quiz», la URL cambia a \`/tasks/2\` sin recargar la página y se ve el título en un \`<h1>\`.
- En \`/tasks/99\` se ve \`Tarea no encontrada\`.`,
    hints: [
      'Repasar cómo se declara en \`<Route>\` una parte variable de la ruta y con qué hook se lee después.',
      'El \`to\` del enlace se construye con el \`id\` de cada tarea. Y fijarse en por qué \`TaskDetail\` usa \`Number(id)\`.',
    ],
    solution: {
      code: `// App.jsx · punto 1
<Route path="/tasks/:id" element={<TaskDetail />} />

// TaskList.jsx · punto 2
<Link to={\`/tasks/\${task.id}\`}>{task.title}</Link>

// TaskDetail.jsx · punto 3
const { id } = useParams();`,
      changes: ['Una \`<Route>\` con el parámetro \`:id\` que renderiza \`TaskDetail\`.', 'Un \`<Link>\` con la ruta construida a partir de \`task.id\`.', '\`useParams()\` para leer \`id\`.'],
      explanation: `\`:id\` declara un segmento variable: React Router lo hace corresponder con cualquier valor y lo expone con \`useParams\`. Los parámetros llegan siempre como **texto**, por eso \`TaskDetail\` los convierte con \`Number\` antes de compararlos con el \`id\` numérico. \`Link\` cambia la URL sin recargar la página, que es lo que distingue a una SPA; un \`<a href>\` también navegaría, pero recargando toda la aplicación.`,
      alternatives: '\`<Link to={"/tasks/" + task.id}>\`. Leer el parámetro con \`const params = useParams();\` y usar \`params.id\`.',
    },
    rubric: [
      { text: 'Declara la ruta \`/tasks/:id\` con \`element={<TaskDetail />}\`', points: 3 },
      { text: 'Usa \`<Link>\` con el \`to\` construido con \`task.id\`', points: 3 },
      { text: 'Muestra el título dentro del enlace', points: 1 },
      { text: 'Lee el \`id\` con \`useParams\`', points: 3 },
    ],
    penalties: ['Usar \`<a href>\` en lugar de \`<Link>\`: se conceden 1 de los 3 puntos del criterio.', 'Escribir la ruta sin los dos puntos (\`/tasks/id\`): no se conceden los 3 puntos de la ruta.'],
    partial: 'Si el \`to\` se escribe con comillas simples y \`\${}\` sin acento grave, el enlace no funciona: se concede 1 de los 3 puntos.',
  },

  // ------------------------------------------------------------------ C2
  {
    id: 'C2', kind: 'react', category: 'Integración', tech: 'React y Axios',
    title: 'Botón «Eliminar» conectado a la API',
    concepts: ['eventos en React', 'llamada a la API con async/await', 'actualizar el estado con filter'],
    level: 'Intermedia-baja', minutes: '10',
    statement: `Una lista de tareas tiene un botón «Eliminar» en cada fila, pero no hace nada. El cliente de la API ya incluye la función \`deleteTask(id)\`, que envía \`DELETE /tasks/:id\`.

Se pide:

1. Conectar cada botón con \`handleDelete\`, pasándole el \`id\` de su tarea.
2. Completar \`handleDelete\` para que borre la tarea en la API y, si va bien, la quite de la lista en pantalla.
3. Si la petición falla, guardar \`No se ha podido borrar la tarea\` en \`error\` y dejar la lista como estaba.`,
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
    // 2 y 3. Completar
  }

  return (
    <>
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button>Eliminar</button> {/* 1. Conectar */}
          </li>
        ))}
      </ul>
    </>
  );
}

export default TaskItems;` },
    ],
    edit: 'TaskItems.jsx',
    expected: `- Al pulsar «Eliminar» en la tarea 3, se envía \`DELETE /tasks/3\` y la tarea desaparece de la lista sin recargar.
- Si la API responde con un error, la tarea sigue en la lista y aparece \`No se ha podido borrar la tarea\`.
- Al cargar la página no se borra nada: solo se borra al pulsar.`,
    hints: [
      'Repasar cómo se pasa un manejador con argumentos a \`onClick\` sin ejecutarlo durante el renderizado.',
      'Para quitar la tarea del estado hace falta un array nuevo con todas las tareas menos una: un método de array lo hace en una línea. El borrado en pantalla debe ir después del \`await\`.',
    ],
    solution: {
      code: `async function handleDelete(id) {
  try {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  } catch (err) {
    setError("No se ha podido borrar la tarea");
  }
}

// ...
<button onClick={() => handleDelete(task.id)}>Eliminar</button>`,
      changes: ['\`onClick={() => handleDelete(task.id)}\` en el botón.', '\`await deleteTask(id)\` dentro de \`try\`.', '\`setTasks\` con \`filter\` después del \`await\`.', '\`setError\` en \`catch\`.'],
      explanation: `\`onClick\` necesita una **función**. \`onClick={handleDelete(task.id)}\` llamaría a la función en cada renderizado y borraría todas las tareas al cargar; la función flecha retrasa la llamada hasta el clic. El estado se actualiza solo después de que la API confirme el borrado: si se hiciera antes, un error dejaría la pantalla mostrando algo que no coincide con el servidor. \`filter\` devuelve un array nuevo, así que React detecta el cambio.`,
      alternatives: 'La forma funcional \`setTasks((prev) => prev.filter((t) => t.id !== id))\`. Borrar primero en pantalla y restaurar la lista en el \`catch\` también es válido si se hace correctamente.',
    },
    rubric: [
      { text: 'Conecta el botón con una función flecha que pasa \`task.id\`', points: 3 },
      { text: 'Llama a \`await deleteTask(id)\`', points: 2 },
      { text: 'Quita la tarea del estado con un array nuevo', points: 3 },
      { text: 'Gestiona el error sin quitar la tarea', points: 2 },
    ],
    penalties: ['\`onClick={handleDelete(task.id)}\`: no se conceden los 3 puntos del botón.', 'Quitar la tarea con \`splice\` sobre \`tasks\`: no se conceden los 3 puntos del estado.', 'Actualizar la lista antes del \`await\` y sin restaurarla en el \`catch\`: -1.'],
    partial: 'Si la tarea se borra en la API pero no desaparece de la pantalla, se conceden los criterios de 3 y 2 puntos.',
  },
  // ------------------------------------------------------------------ C3
  {
    id: 'C3', kind: 'react', category: 'Integración', tech: 'React y Context API',
    title: 'Leer la sesión desde el Context',
    concepts: ['Context API', 'Provider', 'useContext', 'prop drilling'],
    level: 'Intermedia-baja', minutes: '10',
    statement: `Una aplicación ya tiene un \`AuthContext\` terminado, con el hook \`useAuth\`, igual que el visto en clase. Falta conectarlo: el Provider no envuelve todavía a la aplicación y la barra de navegación no lee la sesión.

Se pide completar los tres puntos marcados, sin pasar la sesión por props:

1. En \`main.jsx\`, hacer que la sesión esté disponible en toda la aplicación.
2. En \`NavBar.jsx\`, importar lo necesario para leer la sesión.
3. En \`NavBar.jsx\`, obtener \`isLoggedIn\` y \`signOut\` de la sesión.`,
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
    {/* 1. Hacer que la sesión esté disponible en toda la aplicación */}
    <App />
  </BrowserRouter>
);` },
      { name: 'NavBar.jsx', lang: 'jsx', code: `import { Link } from "react-router";
// 2. Importar lo necesario para leer la sesión

function NavBar() {
  // 3. Obtener isLoggedIn y signOut de la sesión (sustituir esta línea)
  const isLoggedIn = false;

  return (
    <nav>
      <Link to="/tasks">Tareas</Link>
      {isLoggedIn
        ? <button onClick={signOut}>Salir</button>
        : <Link to="/login">Entrar</Link>}
    </nav>
  );
}

export default NavBar;` },
    ],
    edit: 'NavBar.jsx',
    answerStarter: `// main.jsx · punto 1


// NavBar.jsx · punto 2


// NavBar.jsx · punto 3
`,
    expected: `- Sin sesión, la barra muestra el enlace **Entrar**.
- Tras iniciar sesión en la pantalla de login, que ya usa \`signIn\`, la barra muestra **Salir** sin recargar la página.
- Al pulsar **Salir**, vuelve a aparecer **Entrar**.
- \`NavBar\` no recibe ninguna prop.`,
    hints: [
      'Repasar las tres piezas de Context: dónde se crea, qué componente guarda el valor y con qué hook se lee.',
      'El Provider debe envolver a los componentes que leen el valor, y en el curso va dentro del router. En \`NavBar\`, el atajo que exporta \`AuthContext.jsx\` devuelve un objeto que se puede desestructurar.',
    ],
    solution: {
      code: `// main.jsx · punto 1
<BrowserRouter>
  <AuthProvider>
    <App />
  </AuthProvider>
</BrowserRouter>

// NavBar.jsx · punto 2
import { useAuth } from "./auth/AuthContext.jsx";

// NavBar.jsx · punto 3
const { isLoggedIn, signOut } = useAuth();`,
      changes: ['\`AuthProvider\` envolviendo a \`App\`, dentro de \`BrowserRouter\`.', 'Import de \`useAuth\` en \`NavBar.jsx\`.', '\`const { isLoggedIn, signOut } = useAuth();\` en lugar de la constante fija.'],
      explanation: `Context tiene tres piezas: \`createContext\` crea el Context, el **Provider** guarda el valor y \`useContext\` lo lee. Un componente solo puede leer el valor si está **dentro** del Provider; fuera recibiría el valor por defecto, \`null\`, y la desestructuración fallaría. El Provider va dentro de \`BrowserRouter\` para que sus componentes puedan usar la navegación, y envuelve a \`App\` para que lo lean el menú, el login y las rutas protegidas. Así \`NavBar\` obtiene la sesión directamente, sin que \`App\` y los componentes intermedios tengan que pasársela por props (*prop drilling*). Cuando \`signIn\` o \`signOut\` cambian el token, todos los componentes que leen el Context se vuelven a renderizar.`,
      alternatives: 'Exportar \`AuthContext\` desde su fichero y leerlo con \`useContext(AuthContext)\` en lugar de \`useAuth\`. Leer el objeto completo (\`const auth = useAuth();\`) y usar \`auth.isLoggedIn\` y \`auth.signOut\`.',
    },
    rubric: [
      { text: '\`AuthProvider\` envuelve a \`App\`', points: 3 },
      { text: 'El Provider queda dentro de \`BrowserRouter\`', points: 1 },
      { text: 'Importa \`useAuth\` desde \`AuthContext.jsx\`', points: 1 },
      { text: 'Obtiene \`isLoggedIn\` y \`signOut\` con \`useAuth()\`', points: 3 },
      { text: 'No pasa la sesión por props', points: 2 },
    ],
    penalties: ['Llamar a \`useAuth\` fuera de un componente o dentro de un \`if\`: no se conceden los 3 puntos de lectura, porque incumple las reglas de los hooks.', 'Crear un segundo \`AuthContext\` o un estado propio de sesión en \`NavBar\`: no se conceden los 2 puntos del último criterio.'],
    partial: 'Si solo se obtiene `isLoggedIn` y falta `signOut`, se conceden 2 de los 3 puntos de lectura.',
  },
];

// Practical part of the fixed practice exams: one JavaScript, one React and one Express exercise,
// 2 points each. The random practice exam draws one of each kind from all the exercises above.
window.EXAM_PRACTICAL = { 1: ['A1', 'A4', 'A2'], 2: ['B1', 'B3', 'B2'], 3: ['A1', 'C3', 'A3'] };
