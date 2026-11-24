// Practical programming exercises for the study site: study mode, and the practical part of every
// practice exam (composition in practice-bank.js). Hand-written. Conventions follow the course labs: CommonJS in the backend,
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
  {
    id: 'A5', kind: 'js', category: 'Corrección de errores', tech: 'JavaScript', title: 'Iniciales de los alumnos',
    concepts: ['forEach frente a map', 'valor de retorno'], level: 'Básica', minutes: '6-8',
    statement: `La función \`getInitials\` debe devolver un array con las iniciales de cada nombre completo, en mayúsculas y separadas por un punto. Al ejecutarla aparece \`undefined\`.

Se pide corregir la función y explicar el error en un comentario.`,
    files: [{ name: 'initials.js', lang: 'js', code: `const students = ["ana garcía", "luis pérez", "marta ruiz"];

function getInitials(names) {
  return names.forEach((fullName) => {
    const [first, last] = fullName.split(" ");
    return first[0].toUpperCase() + "." + last[0].toUpperCase();
  });
}

console.log(getInitials(students));` }],
    expected: '`getInitials(students)` devuelve `[ "A.G", "L.P", "M.R" ]`.',
    hints: ['Repasar qué devuelve `forEach` y qué método de array construye un array nuevo con lo que devuelve el callback.', 'El cuerpo del callback es correcto: el problema es el método que lo recorre.'],
    solution: {
      code: `function getInitials(names) {
  // forEach siempre devuelve undefined; map devuelve un array con lo que devuelve el callback
  return names.map((fullName) => {
    const [first, last] = fullName.split(" ");
    return first[0].toUpperCase() + "." + last[0].toUpperCase();
  });
}`,
      changes: ['Sustituir \`forEach\` por \`map\`.'],
      explanation: '`forEach` ejecuta el callback para cada elemento pero siempre devuelve `undefined`: los valores que devuelve el callback se pierden. `map` los recoge en un array nuevo de la misma longitud.',
      alternatives: 'Crear un array vacío, hacer `push` dentro del `forEach` y devolver ese array al final.',
    },
    rubric: [
      { text: 'Identifica que \`forEach\` devuelve \`undefined\`', points: 3 },
      { text: 'Usa \`map\` o un array acumulado que se devuelve', points: 5 },
      { text: 'El comentario explica la diferencia', points: 2 },
    ],
    penalties: ['Reescribir la lógica de las iniciales sin necesidad e introducir un error en el formato: -2.'],
    partial: 'Si se usa `push` dentro del `forEach` pero no se devuelve el array, se conceden los 3 puntos de identificación.',
  },
  {
    id: 'A6', kind: 'react', category: 'Corrección de errores', tech: 'React y Axios', title: 'Peticiones sin fin',
    concepts: ['useEffect', 'array de dependencias', 'renderizado'], level: 'Intermedia-baja', minutes: '8',
    statement: `El componente \`ProductList\` carga los productos de la API y los muestra. Funciona, pero la pestaña *Network* del navegador muestra que se envía \`GET /products\` una y otra vez, sin parar.

Se pide corregir el error y explicar en un comentario por qué se repetía la petición.`,
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
    expected: 'Al cargar el componente se envía una sola petición `GET /products` y se muestra la lista.',
    hints: ['Repasar cuándo se ejecuta un efecto según su segundo argumento.', 'Seguir la cadena: el efecto actualiza el estado, el estado provoca un renderizado y, tras cada renderizado, ¿qué pasa con este efecto?'],
    solution: {
      code: `useEffect(() => {
  async function load() {
    const response = await api.get("/products");
    setProducts(response.data);
  }
  load();
}, []); // sin array, el efecto se ejecutaba tras cada renderizado, y setProducts provocaba otro`,
      changes: ['Añadir el array de dependencias vacío \`[]\` como segundo argumento de \`useEffect\`.'],
      explanation: 'Sin segundo argumento, el efecto se ejecuta después de cada renderizado. Como el efecto llama a `setProducts` con un array nuevo, provoca otro renderizado, que vuelve a ejecutar el efecto: un bucle de peticiones. Con `[]`, el efecto solo se ejecuta al montar el componente.',
      alternatives: 'No hay otra corrección razonable dentro de lo visto en el curso.',
    },
    rubric: [
      { text: 'Añade \`[]\` como segundo argumento', points: 5 },
      { text: 'Explica que sin array el efecto se ejecuta tras cada renderizado', points: 3 },
      { text: 'Relaciona \`setProducts\` con el nuevo renderizado', points: 2 },
    ],
    penalties: ['Poner \`[products]\` como dependencia: no se conceden los 5 puntos, porque el bucle continúa.'],
    partial: 'Si la explicación menciona el renderizado pero no el papel de `setProducts`, se conceden los 3 puntos del segundo criterio.',
  },
  {
    id: 'A7', kind: 'express', category: 'Corrección de errores', tech: 'Express y PostgreSQL', title: 'Consulta vulnerable',
    concepts: ['inyección SQL', 'consultas parametrizadas', 'req.query'], level: 'Intermedia-baja', minutes: '8-10',
    statement: `El endpoint \`GET /users?email=...\` busca un usuario por email. Funciona con emails normales, pero una auditoría ha detectado que es vulnerable a **inyección SQL**: con \`?email=' OR '1'='1\` devuelve el primer usuario de la tabla.

Se pide corregir la consulta sin cambiar el comportamiento normal del endpoint.`,
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
    expected: '`GET /users?email=ana@cunef.edu` devuelve ese usuario. `GET /users?email=\' OR \'1\'=\'1` devuelve `null`, porque ningún usuario tiene ese texto como email.',
    hints: ['Repasar cómo se pasan valores a `pool.query` en los laboratorios 6 y 7.', 'El texto SQL no debe contener ningún dato que venga de la petición: el valor va en un segundo argumento.'],
    solution: {
      code: `router.get("/", async (req, res) => {
  const email = req.query.email;
  const { rows } = await pool.query(
    "SELECT id, email FROM users WHERE email = $1",
    [email]
  );
  res.json(rows[0] ?? null);
});`,
      changes: ['Sustituir la plantilla con \`\${email}\` por el marcador \`$1\`.', 'Pasar \`[email]\` como segundo argumento de \`pool.query\`.'],
      explanation: `Al interpolar el email en el texto, las comillas que envía el atacante cierran la cadena SQL y añaden una condición siempre verdadera: \`WHERE email = '' OR '1'='1'\`. Con \`$1\`, \`pg\` envía el valor aparte y PostgreSQL lo trata siempre como un dato, nunca como parte de la consulta.`,
      alternatives: 'No hay alternativa aceptable: escapar las comillas a mano no se considera una corrección segura.',
    },
    rubric: [
      { text: 'Usa el marcador \`$1\` en el texto SQL', points: 4 },
      { text: 'Pasa el valor en el array de parámetros', points: 4 },
      { text: 'Mantiene el comportamiento normal (\`rows[0] ?? null\`)', points: 2 },
    ],
    penalties: ['Intentar filtrar o escapar comillas a mano en lugar de parametrizar: no se conceden los 8 primeros puntos.'],
    partial: 'Si se usa `$1` pero falta el array de parámetros, se conceden los 4 puntos del marcador.',
  },
  {
    id: 'B4', kind: 'js', category: 'Completar código', tech: 'JavaScript', title: 'Valor del inventario',
    concepts: ['filter', 'bucles', 'acumuladores'], level: 'Básica', minutes: '8',
    statement: `Una tienda guarda sus productos en un array. Se pide completar la función \`stockValue\` para que devuelva el valor total del inventario: la suma de \`price * units\` de los productos con \`units\` mayor que 0.

No se debe modificar el array recibido.`,
    files: [{ name: 'inventory.js', lang: 'js', code: `const products = [
  { name: "Teclado", price: 30, units: 4 },
  { name: "Ratón", price: 15, units: 0 },
  { name: "Monitor", price: 120, units: 2 },
];

function stockValue(list) {
  // Completar
}

console.log(stockValue(products)); // 360` }],
    expected: '`stockValue(products)` devuelve `360` (30·4 + 120·2). Con un array vacío devuelve `0`.',
    hints: ['Hace falta una variable que empiece en 0 y vaya acumulando.', 'Se puede recorrer el array con `for...of` y sumar solo cuando `units > 0`, o filtrar primero con `filter`.'],
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
      changes: ['Un acumulador \`total\` que empieza en 0.', 'Un recorrido del array que suma \`price * units\` de los productos con unidades.', '\`return total\`.'],
      explanation: 'El acumulador permite sumar en un recorrido. La condición deja fuera los productos sin unidades; en este caso su aportación sería 0 de todos modos, pero el enunciado pide filtrarlos explícitamente. La función no modifica `list`.',
      alternatives: '`list.filter((p) => p.units > 0)` seguido de un `for...of` sobre el resultado. Un `forEach` con el mismo acumulador.',
    },
    rubric: [
      { text: 'Inicializa un acumulador a 0', points: 2 },
      { text: 'Recorre todos los productos', points: 2 },
      { text: 'Suma \`price * units\` solo de los productos con unidades', points: 4 },
      { text: 'Devuelve el total', points: 2 },
    ],
    penalties: ['Modificar el array recibido: -2.'],
    partial: 'Si se suma `price` en lugar de `price * units`, se conceden los puntos del acumulador, el recorrido y el `return`.',
  },
  {
    id: 'B5', kind: 'react', category: 'Completar código', tech: 'React', title: 'Contador que no baja de cero',
    concepts: ['useState', 'eventos', 'renderizado condicional'], level: 'Básica', minutes: '8-10',
    statement: `Se pide completar el componente \`Counter\` para que:

1. Muestre el valor actual en un párrafo.
2. El botón **+1** sume uno.
3. El botón **-1** reste uno, pero el valor nunca baje de 0.`,
    files: [{ name: 'Counter.jsx', lang: 'jsx', code: `import { useState } from "react";

function Counter() {
  // 1. Estado del contador, empezando en 0

  return (
    <div>
      <p>{/* valor */}</p>
      <button>-1</button>
      <button>+1</button>
    </div>
  );
}

export default Counter;` }],
    expected: 'Al cargar se ve `0`. Tres pulsaciones de **+1** muestran `3`. Con el valor en `0`, pulsar **-1** lo deja en `0`.',
    hints: ['El valor que cambia y debe verse en pantalla es estado: `useState`.', 'Para no bajar de 0 basta una condición antes de actualizar, o `Math.max(0, ...)`.'],
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
      changes: ['\`useState(0)\`.', 'El valor en el párrafo.', 'Un \`onClick\` en cada botón; el de restar no baja de 0.'],
      explanation: 'Cada llamada a `setCount` con un valor distinto provoca un nuevo renderizado con el valor actualizado. `Math.max(0, count - 1)` devuelve 0 si la resta saldría negativa.',
      alternatives: '`if (count > 0) setCount(count - 1);` en una función aparte. La forma funcional `setCount((c) => c + 1)`. Deshabilitar el botón con `disabled={count === 0}` también cumple el requisito.',
    },
    rubric: [
      { text: 'Declara el estado con \`useState(0)\`', points: 2 },
      { text: 'Muestra el valor', points: 1 },
      { text: 'El botón +1 actualiza el estado', points: 3 },
      { text: 'El botón -1 resta sin bajar de 0', points: 4 },
    ],
    penalties: ['Usar una variable normal en lugar de estado: no se conceden los criterios de los botones.', '\`onClick={setCount(count + 1)}\`: -2, porque se ejecuta al renderizar.'],
    partial: 'Si el botón -1 resta pero permite negativos, se conceden 2 de sus 4 puntos.',
  },
  {
    id: 'B6', kind: 'express', category: 'Completar código', tech: 'Express y PostgreSQL', title: 'Borrar un producto',
    concepts: ['DELETE', 'rowCount', '204 y 404', 'consulta parametrizada'], level: 'Intermedia-baja', minutes: '10',
    statement: `Se pide completar el endpoint \`DELETE /products/:id\` para que borre el producto de la tabla \`products\`:

- Si existía, responder \`204\` sin cuerpo.
- Si no existía, responder \`404\` con \`{ "error": "Product not found" }\`.

No hace falta gestionar errores de la base de datos.`,
    files: [{ name: 'routes/products.js', lang: 'js', code: `const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = express.Router();

router.delete("/:id", async (req, res) => {
  // Completar
});

module.exports = router;

// Nota: el resultado de pool.query incluye rowCount,
// el número de filas afectadas por la consulta.` }],
    expected: '`DELETE /products/3` (existe) responde `204`. Repetir la misma petición responde `404` con `{ "error": "Product not found" }`.',
    hints: ['Repasar qué códigos se usan para «borrado sin contenido que devolver» y para «no existe».', '`rowCount` indica cuántas filas ha borrado el `DELETE`: si es 0, el producto no existía.'],
    solution: {
      code: `router.delete("/:id", async (req, res) => {
  const result = await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(204).end();
});`,
      changes: ['\`DELETE\` parametrizado con \`$1\`.', 'Comprobación de \`rowCount\` con respuesta 404.', 'Respuesta 204 con \`end()\`.'],
      explanation: 'Un `DELETE` que no encuentra filas no es un error para PostgreSQL: simplemente afecta a 0 filas. `rowCount` permite distinguir los dos casos sin una consulta previa. 204 indica éxito sin cuerpo, por eso se usa `end()` y no `json()`.',
      alternatives: 'Añadir `RETURNING id` y comprobar `result.rows.length`. Hacer antes un `SELECT` para comprobar que existe, aunque son dos consultas. `res.sendStatus(204)`.',
    },
    rubric: [
      { text: 'Consulta \`DELETE\` parametrizada', points: 3 },
      { text: 'Usa \`await\` con la consulta', points: 1 },
      { text: 'Detecta que no existía (\`rowCount\` o equivalente) y responde 404', points: 3 },
      { text: 'Responde 204 sin cuerpo cuando se borra', points: 3 },
    ],
    penalties: ['Concatenar el \`id\` en el texto SQL: no se conceden los 3 puntos de la consulta.', 'Responder 200 con un mensaje en lugar de 204: -1.'],
    partial: 'Si siempre responde 204, sin distinguir el caso inexistente, se conceden los puntos de la consulta, el `await` y el 204.',
  },
  {
    id: 'B7', kind: 'react', category: 'Completar código', tech: 'React', title: 'Formulario controlado',
    concepts: ['input controlado', 'props con funciones', 'onSubmit'], level: 'Intermedia-baja', minutes: '10',
    statement: `El componente \`NewTaskForm\` recibe la prop \`onAdd\`, una función del componente padre. Se pide completarlo para que:

1. El campo de texto sea un *input* controlado por el estado \`title\`.
2. Al enviar el formulario no se recargue la página, se llame a \`onAdd\` con el título sin espacios sobrantes y el campo se vacíe.
3. El botón esté deshabilitado mientras el campo esté vacío.`,
    files: [{ name: 'NewTaskForm.jsx', lang: 'jsx', code: `import { useState } from "react";

function NewTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");

  function handleSubmit(event) {
    // 2. Completar
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nueva tarea" /> {/* 1. Completar */}
      <button type="submit">Añadir</button> {/* 3. Completar */}
    </form>
  );
}

export default NewTaskForm;` }],
    expected: 'Al escribir «  Repasar SQL  » y pulsar **Añadir**, el padre recibe `onAdd("Repasar SQL")`, el campo se vacía y la página no se recarga. Con el campo vacío, el botón no se puede pulsar.',
    hints: ['Un *input* controlado necesita `value` y `onChange`.', 'En `handleSubmit`: primero `preventDefault`, después la llamada al padre y por último vaciar el estado. Para el botón, el atributo es `disabled`.'],
    solution: {
      code: `function handleSubmit(event) {
  event.preventDefault();
  onAdd(title.trim());
  setTitle("");
}

// ...
<input
  placeholder="Nueva tarea"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
<button type="submit" disabled={title.trim() === ""}>Añadir</button>`,
      changes: ['\`value\` y \`onChange\` en el *input*.', '\`preventDefault\`, \`onAdd(title.trim())\` y \`setTitle("")\` en \`handleSubmit\`.', '\`disabled\` en el botón.'],
      explanation: 'En un *input* controlado, React es la fuente de verdad: el valor visible sale del estado y cada pulsación lo actualiza con `onChange`. Por eso vaciar el estado vacía el campo. El hijo no añade la tarea él mismo: avisa al padre mediante la función que recibe por props.',
      alternatives: '`disabled={!title.trim()}`. Comprobar dentro de `handleSubmit` que el título no está vacío, además de deshabilitar el botón.',
    },
    rubric: [
      { text: '\`value\` y \`onChange\` conectados al estado', points: 3 },
      { text: '\`preventDefault\` en el envío', points: 1.5 },
      { text: 'Llama a \`onAdd\` con el título recortado', points: 2.5 },
      { text: 'Vacía el campo tras añadir', points: 1 },
      { text: 'Deshabilita el botón con el campo vacío', points: 2 },
    ],
    penalties: ['Leer el valor con \`document.querySelector\` en lugar del estado: no se conceden los 3 puntos del *input*.'],
    partial: 'Si se llama a `onAdd(title)` sin recortar los espacios, se conceden 1,5 de los 2,5 puntos.',
  },
  {
    id: 'B8', kind: 'express', category: 'Completar código', tech: 'Express y PostgreSQL', title: 'Crear un producto con validación',
    concepts: ['req.body', '400', 'INSERT ... RETURNING', '201'], level: 'Intermedia-baja', minutes: '12',
    statement: `Se pide completar \`POST /products\`:

1. Si \`name\` no es un texto con contenido o \`price\` no es un número mayor o igual que 0, responder \`400\` con \`{ "error": "Invalid product" }\`.
2. Si los datos son válidos, insertar el producto en \`products\` y responder \`201\` con la fila creada.

La tabla tiene las columnas \`id\` (generado), \`name\` y \`price\`. La app ya usa \`express.json()\`.`,
    files: [{ name: 'routes/products.js', lang: 'js', code: `const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, price } = req.body;

  // 1. Validar

  // 2. Insertar y responder
});

module.exports = router;` }],
    expected: `| Cuerpo | Respuesta |
|---|---|
| \`{ "name": "Lámpara", "price": 25 }\` | \`201\` con \`{ "id": 9, "name": "Lámpara", "price": 25 }\` |
| \`{ "name": "", "price": 25 }\` | \`400\` con \`{ "error": "Invalid product" }\` |
| \`{ "name": "Silla", "price": -3 }\` | \`400\` con \`{ "error": "Invalid product" }\` |`,
    hints: ['La validación debe terminar la petición con `return` si los datos no son válidos.', '`RETURNING` hace que el `INSERT` devuelva la fila creada en `rows`.'],
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
      changes: ['Validación de \`name\` y \`price\` con \`return\` y 400.', '\`INSERT\` parametrizado con \`RETURNING\`.', 'Respuesta 201 con \`rows[0]\`.'],
      explanation: 'Los datos de `req.body` los decide el cliente, así que se validan antes de tocar la base de datos. La consulta parametrizada evita la inyección SQL y `RETURNING` devuelve el `id` generado sin una segunda consulta.',
      alternatives: 'Validar con un esquema de Zod y `safeParse`, como en el laboratorio 7. `RETURNING *`.',
    },
    rubric: [
      { text: 'Valida \`name\`', points: 2 },
      { text: 'Valida \`price\` (número y no negativo)', points: 2 },
      { text: 'Responde 400 y termina con \`return\`', points: 1.5 },
      { text: '\`INSERT\` parametrizado con \`await\`', points: 2.5 },
      { text: 'Responde 201 con la fila creada', points: 2 },
    ],
    penalties: ['Concatenar los valores en el SQL: no se conceden los 2,5 puntos de la consulta.'],
    partial: 'Si responde 201 con `req.body` en lugar de la fila creada, se conceden 1 de los 2 puntos.',
  },
  {
    id: 'B9', kind: 'js', category: 'Completar código', tech: 'JavaScript', title: 'Buscar un usuario por email',
    concepts: ['find', 'toLowerCase', 'null frente a undefined'], level: 'Básica', minutes: '6-8',
    statement: `Se pide completar \`findByEmail\` para que devuelva el usuario cuyo email coincide con el recibido **sin distinguir mayúsculas de minúsculas**, o \`null\` si no hay ninguno.`,
    files: [{ name: 'users.js', lang: 'js', code: `const users = [
  { id: 1, email: "ana@cunef.edu" },
  { id: 2, email: "Luis@cunef.edu" },
];

function findByEmail(list, email) {
  // Completar
}

console.log(findByEmail(users, "LUIS@cunef.edu")); // { id: 2, email: "Luis@cunef.edu" }
console.log(findByEmail(users, "eva@cunef.edu"));  // null` }],
    expected: 'Las dos llamadas del código muestran `{ id: 2, email: "Luis@cunef.edu" }` y `null`.',
    hints: ['Hay un método de array que devuelve el primer elemento que cumple una condición.', 'Para no distinguir mayúsculas, se comparan los dos emails convertidos a minúsculas. Y ese método no devuelve `null` cuando no encuentra nada.'],
    solution: {
      code: `function findByEmail(list, email) {
  const target = email.toLowerCase();
  const user = list.find((u) => u.email.toLowerCase() === target);
  return user ?? null;
}`,
      changes: ['\`find\` con la comparación en minúsculas de los dos lados.', 'Conversión de \`undefined\` a \`null\`.'],
      explanation: 'Hay que pasar a minúsculas los dos lados de la comparación: solo uno no basta. `find` devuelve `undefined` si no hay coincidencia; el enunciado pide `null`, así que se convierte con `??` (o con un `if`).',
      alternatives: '`return user || null;`. Un bucle `for...of` que devuelve el usuario al encontrarlo y `null` al final.',
    },
    rubric: [
      { text: 'Usa \`find\` o un recorrido equivalente', points: 3 },
      { text: 'Compara en minúsculas los dos emails', points: 4 },
      { text: 'Devuelve \`null\` si no hay coincidencia', points: 3 },
    ],
    penalties: ['Modificar los emails del array original: -2.'],
    partial: 'Si solo se pasa a minúsculas uno de los dos lados, se conceden 2 de los 4 puntos.',
  },
  {
    id: 'D2', kind: 'js', category: 'Comprensión de código', tech: 'JavaScript y DOM',
    title: 'Pintar una lista a partir del estado',
    concepts: ['patrón estado → render', 'createElement', 'classList', 'textContent'],
    level: 'Básica', minutes: '10',
    statement: `El siguiente código es la base de la lista de tareas interactiva del bloque I. No hay que modificarlo: se pide **explicar su funcionamiento** respondiendo a las cinco preguntas del recuadro.

La página contiene \`<ul id="list"></ul>\` y \`<button id="add">Añadir</button>\`.`,
    files: [{ name: 'app.js', lang: 'js', code: `const list = document.querySelector("#list");
const tasks = [
  { title: "Leer la guía", done: true },
  { title: "Hacer el quiz", done: false },
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
  tasks.push({ title: "Nueva tarea", done: false });
  render();
});

render();` }],
    answerStarter: `1. ¿Qué se ve en la lista al cargar la página? ¿Qué elemento lleva la clase done?

2. ¿Para qué sirve list.textContent = "" al principio de render?

3. ¿Cuántos elementos tiene la lista después de pulsar «Añadir» dos veces? ¿Cuáles?

4. ¿Por qué el título se asigna con textContent y no con innerHTML?

5. ¿Qué ocurriría si se borrara la última línea, render();?
`,
    expected: 'Cinco respuestas breves, de una a tres frases cada una, con los resultados concretos y el motivo de cada decisión.',
    hints: [
      'Repasar el patrón estado → render de la práctica de integración: los datos están en un array y una función reconstruye la lista a partir de ellos.',
      'Seguir el código línea a línea con los dos objetos iniciales y, después, con cada clic: cada vez que se llama a \`render\`, ¿qué pasa primero con la lista?',
    ],
    solution: {
      code: `1. Dos elementos: «Leer la guía» y «Hacer el quiz». El primero lleva la clase done
   porque su propiedad done es true.

2. Vacía la lista antes de volver a pintarla. Sin esa línea, cada llamada a render
   añadiría otra vez todas las tareas y se verían duplicadas.

3. Cuatro: «Leer la guía», «Hacer el quiz», «Nueva tarea» y «Nueva tarea». Cada clic
   añade un objeto al array y vuelve a pintar la lista completa.

4. textContent inserta el texto tal cual. Con innerHTML, un título con etiquetas se
   interpretaría como HTML, lo que permite inyectar contenido o código (XSS).

5. La lista aparecería vacía al cargar la página y solo se pintaría tras el primer clic.`,
      changes: ['No aplica: es un ejercicio de comprensión.'],
      explanation: 'Es el patrón estado → render: los datos viven en `tasks` y la pantalla se reconstruye siempre desde ellos con `render`. Los manejadores no tocan el DOM directamente: cambian el estado y vuelven a pintar. Así la pantalla y los datos nunca se contradicen. Es la misma idea que React automatiza en el bloque III.',
      alternatives: 'Cualquier explicación equivalente con otras palabras. En la pregunta 2 también es válido mencionar `list.innerHTML = ""`, que tiene el mismo efecto.',
    },
    rubric: [
      { text: 'Pregunta 1: los dos elementos y cuál lleva la clase', points: 2 },
      { text: 'Pregunta 2: vaciar para no duplicar', points: 2 },
      { text: 'Pregunta 3: cuatro elementos, con los títulos correctos', points: 2 },
      { text: 'Pregunta 4: textContent frente a innerHTML', points: 2 },
      { text: 'Pregunta 5: lista vacía hasta el primer clic', points: 2 },
    ],
    penalties: ['Afirmar en la pregunta 3 que se ven seis elementos (duplicados): no se conceden los puntos de las preguntas 2 y 3.'],
    partial: 'En la pregunta 4, mencionar solo que `textContent` «es más seguro» sin explicar por qué: 1 de 2 puntos.',
  },
  // ------------------------------------------------------------------ conceptual questions (E1-E9)
  {
    "id": "E1",
    "kind": "js",
    "category": "Pregunta conceptual",
    "tech": "JavaScript y DOM",
    "title": "Texto del usuario: `textContent` o `innerHTML`",
    "concepts": [
      "textContent",
      "innerHTML",
      "inyección de código (XSS)"
    ],
    "level": "Básica",
    "minutes": "5",
    "statement": "Una página muestra el nombre que escribe el usuario con `el.innerHTML = nombre`. Se propone cambiarlo por `el.textContent = nombre`.\n\nSe pide explicar en 2-3 líneas qué diferencia hay entre las dos opciones, cuál es la adecuada en este caso y por qué.",
    "files": [],
    "answerStarter": "Respuesta (2-3 líneas):\n",
    "expected": "Una respuesta de 2-3 líneas que explique qué hace cada propiedad y justifique la elección.",
    "hints": [
      "Pensar qué ocurre si el usuario escribe `<b>Ana</b>` o `<img src=x onerror=\"…\">`.",
      "Una de las dos propiedades interpreta el texto como HTML; la otra lo muestra tal cual."
    ],
    "solution": {
      "code": "`innerHTML` interpreta el texto como HTML: si el usuario escribe etiquetas o un atributo como `onerror`, se insertan en la página y pueden ejecutar código (XSS). `textContent` inserta el texto literal, sin interpretarlo. Para mostrar datos del usuario, la adecuada es `textContent`.",
      "changes": [
        "No aplica: es una pregunta conceptual."
      ],
      "explanation": "Los datos que escribe el usuario no son de confianza. Insertarlos como HTML permite inyectar código en la página; como texto, siempre se muestran tal cual.",
      "alternatives": "Cualquier explicación equivalente que mencione que `innerHTML` interpreta HTML y el riesgo de inyección."
    },
    "rubric": [
      {
        "text": "Explica que `innerHTML` interpreta el texto como HTML",
        "points": 3
      },
      {
        "text": "Explica que `textContent` lo inserta como texto literal",
        "points": 3
      },
      {
        "text": "Elige `textContent` y lo justifica por la seguridad (inyección de código)",
        "points": 4
      }
    ],
    "penalties": [
      "Elegir `innerHTML` sin mencionar el riesgo: no se conceden los 4 puntos del último criterio."
    ],
    "partial": "Si se elige `textContent` «porque es más seguro» sin explicar el motivo, se conceden 2 de los 4 puntos del último criterio."
  },
  {
    "id": "E2",
    "kind": "js",
    "category": "Pregunta conceptual",
    "tech": "JavaScript y DOM",
    "title": "El DOM frente al fichero HTML",
    "concepts": [
      "DOM",
      "fichero HTML",
      "DevTools"
    ],
    "level": "Básica",
    "minutes": "5",
    "statement": "Un script añade tres elementos `<li>` a una lista al cargar la página. En «Ver código fuente» los elementos no aparecen; en el panel *Elements* de DevTools, sí. Al recargar la página, el script vuelve a añadirlos.\n\nSe pide explicar en 2-3 líneas por qué ocurre esto.",
    "files": [],
    "answerStarter": "Respuesta (2-3 líneas):\n",
    "expected": "Una respuesta de 2-3 líneas que distinga el fichero HTML del DOM y explique la recarga.",
    "hints": [
      "Repasar qué construye el navegador a partir del fichero HTML.",
      "¿Qué modifica JavaScript: el fichero que llegó del servidor o algo que vive en memoria?"
    ],
    "solution": {
      "code": "«Ver código fuente» muestra el fichero HTML tal como llegó del servidor. JavaScript no modifica ese fichero: modifica el DOM, el árbol de objetos que el navegador construye en memoria a partir de él, y eso es lo que muestra *Elements*. Al recargar, el DOM se vuelve a construir desde el fichero original y el script se ejecuta otra vez.",
      "changes": [
        "No aplica: es una pregunta conceptual."
      ],
      "explanation": "El fichero HTML es el punto de partida; el DOM es la versión viva de la página, la que se ve y la que modifica JavaScript.",
      "alternatives": "Cualquier explicación equivalente que distinga el fichero del DOM en memoria."
    },
    "rubric": [
      {
        "text": "Distingue el fichero HTML original del DOM en memoria",
        "points": 4
      },
      {
        "text": "Explica que JavaScript modifica el DOM y no el fichero",
        "points": 3
      },
      {
        "text": "Explica por qué al recargar los elementos vuelven a aparecer",
        "points": 3
      }
    ],
    "penalties": [
      "Afirmar que el script modifica el fichero del servidor: no se conceden los 3 puntos del segundo criterio."
    ],
    "partial": "Si se menciona el DOM sin explicar qué muestra cada vista, se conceden 2 de los 4 puntos del primer criterio."
  },
  {
    "id": "E3",
    "kind": "js",
    "category": "Pregunta conceptual",
    "tech": "JavaScript y DOM",
    "title": "Por qué `preventDefault` en un formulario",
    "concepts": [
      "evento submit",
      "preventDefault",
      "comportamiento por defecto"
    ],
    "level": "Básica",
    "minutes": "5",
    "statement": "En la lista de tareas del bloque I, el manejador del evento `submit` empieza con `event.preventDefault()`. Si se quita esa línea, la tarea aparece un instante y desaparece.\n\nSe pide explicar en 2-3 líneas qué ocurre y por qué se escucha `submit` en el formulario en lugar de `click` en el botón.",
    "files": [],
    "answerStarter": "Respuesta (2-3 líneas):\n",
    "expected": "Una respuesta de 2-3 líneas que explique la recarga y justifique el uso de `submit`.",
    "hints": [
      "Repasar qué hace el navegador por defecto al enviar un formulario.",
      "Pensar en otra forma de enviar un formulario que no sea pulsar el botón."
    ],
    "solution": {
      "code": "Por defecto, enviar un formulario hace que el navegador lo envíe y recargue la página, así que se pierde lo que JavaScript había añadido. `preventDefault()` cancela ese comportamiento. Se escucha `submit` porque cubre tanto el clic en el botón como pulsar Intro en el campo de texto.",
      "changes": [
        "No aplica: es una pregunta conceptual."
      ],
      "explanation": "El navegador tiene un comportamiento por defecto para cada evento; `preventDefault` permite sustituirlo por el del script.",
      "alternatives": "Cualquier explicación equivalente."
    },
    "rubric": [
      {
        "text": "Explica que, sin `preventDefault`, el envío recarga la página",
        "points": 4
      },
      {
        "text": "Explica que `preventDefault` cancela ese comportamiento",
        "points": 3
      },
      {
        "text": "Justifica `submit` frente a `click` (también se envía con Intro)",
        "points": 3
      }
    ],
    "penalties": [],
    "partial": "Si se explica la recarga sin justificar el uso de `submit`, se conceden los 7 primeros puntos."
  },
  {
    "id": "E4",
    "kind": "express",
    "category": "Pregunta conceptual",
    "tech": "Express",
    "title": "Dónde se decide el `404`",
    "concepts": [
      "capas",
      "controlador",
      "modelo",
      "códigos HTTP"
    ],
    "level": "Básica",
    "minutes": "5",
    "statement": "En una API organizada en rutas, controladores y modelos, el modelo `findById(id)` devuelve la fila o `null`, y el controlador responde `404` cuando el resultado es `null`.\n\nSe pide justificar en 2-3 líneas por qué la comprobación del `404` se escribe en el controlador y no en el modelo.",
    "files": [],
    "answerStarter": "Respuesta (2-3 líneas):\n",
    "expected": "Una respuesta de 2-3 líneas sobre la responsabilidad de cada capa.",
    "hints": [
      "Repasar qué hace cada capa de la API según la guía del bloque II.",
      "¿Conoce el modelo los objetos `req` y `res`?"
    ],
    "solution": {
      "code": "El modelo solo habla con PostgreSQL y devuelve datos (una fila o `null`); no conoce `req` ni `res`. Decidir qué respuesta HTTP corresponde, como el `404`, es trabajo del controlador, que traduce los datos a códigos de estado. Así el modelo se puede reutilizar y cambiar el almacenamiento no afecta a las respuestas.",
      "changes": [
        "No aplica: es una pregunta conceptual."
      ],
      "explanation": "Cada capa tiene una responsabilidad: la ruta asocia URL y controlador, el controlador decide la respuesta y el modelo accede a los datos.",
      "alternatives": "Cualquier explicación equivalente basada en la separación de responsabilidades."
    },
    "rubric": [
      {
        "text": "El modelo solo devuelve datos y no conoce `req` ni `res`",
        "points": 4
      },
      {
        "text": "El controlador traduce los datos a códigos HTTP",
        "points": 4
      },
      {
        "text": "Menciona la ventaja: reutilizar el modelo o cambiar el almacenamiento sin tocar las respuestas",
        "points": 2
      }
    ],
    "penalties": [],
    "partial": "Si solo se dice que «es trabajo del controlador» sin explicar el papel del modelo, se conceden 4 de los 8 primeros puntos."
  },
  {
    "id": "E5",
    "kind": "express",
    "category": "Pregunta conceptual",
    "tech": "Express",
    "title": "El orden de los middleware",
    "concepts": [
      "middleware",
      "express.json",
      "autenticación",
      "validación"
    ],
    "level": "Básica",
    "minutes": "5",
    "statement": "En la Práctica 2, la ruta para crear un elemento es `router.post(\"/\", requireAuth, validateItem, controller.create)`, y en `app.js` se registra `express.json()` antes de las rutas.\n\nSe pide justificar en 2-3 líneas este orden: por qué `express.json()` va antes de las rutas y por qué `requireAuth` va antes de la validación.",
    "files": [],
    "answerStarter": "Respuesta (2-3 líneas):\n",
    "expected": "Una respuesta de 2-3 líneas que justifique las dos posiciones.",
    "hints": [
      "Express ejecuta los middleware en el orden en que se declaran.",
      "¿Qué necesita la validación para funcionar? ¿Tiene sentido validar los datos de alguien sin sesión?"
    ],
    "solution": {
      "code": "`express.json()` convierte el cuerpo en `req.body`; si fuera después de las rutas, la validación y el controlador lo recibirían como `undefined`. `requireAuth` va antes de validar porque, si no hay sesión, se responde `401` sin validar ni tocar la base de datos. Así el controlador recibe ya `req.user` y datos válidos.",
      "changes": [
        "No aplica: es una pregunta conceptual."
      ],
      "explanation": "El orden de declaración es la configuración de la aplicación: cada eslabón prepara `req` para el siguiente o corta la petición.",
      "alternatives": "Cualquier explicación equivalente."
    },
    "rubric": [
      {
        "text": "Justifica `express.json()` antes de las rutas (`req.body`)",
        "points": 4
      },
      {
        "text": "Justifica `requireAuth` antes de la validación (`401` temprano)",
        "points": 4
      },
      {
        "text": "Menciona que el controlador recibe `req.user` y datos válidos",
        "points": 2
      }
    ],
    "penalties": [
      "Afirmar que el orden no importa: no se conceden los puntos de los dos primeros criterios."
    ],
    "partial": "Si se justifica solo una de las dos posiciones, se conceden sus 4 puntos."
  },
  {
    "id": "E6",
    "kind": "express",
    "category": "Pregunta conceptual",
    "tech": "Express",
    "title": "Validar en el servidor aunque el cliente valide",
    "concepts": [
      "validación",
      "Zod",
      "seguridad",
      "400"
    ],
    "level": "Básica",
    "minutes": "5",
    "statement": "El formulario de React de la Práctica 2 ya comprueba que el nombre no esté vacío antes de enviarlo.\n\nSe pide justificar en 2-3 líneas por qué la API tiene que validar igualmente el cuerpo de la petición.",
    "files": [],
    "answerStarter": "Respuesta (2-3 líneas):\n",
    "expected": "Una respuesta de 2-3 líneas sobre el papel de cada validación.",
    "hints": [
      "¿Es la interfaz de React la única forma de llamar a la API?",
      "Pensar en herramientas como curl o Postman."
    ],
    "solution": {
      "code": "La validación del cliente solo mejora la experiencia: avisa al momento. Cualquiera puede llamar a la API sin pasar por la interfaz (curl, Postman, otro script), así que el servidor es el único punto que protege los datos: valida todo lo que llega en `req.body` y responde `400` si no es válido.",
      "changes": [
        "No aplica: es una pregunta conceptual."
      ],
      "explanation": "Nunca se confía en lo que envía el cliente. La validación del servidor es obligatoria; la del cliente, una comodidad.",
      "alternatives": "Cualquier explicación equivalente."
    },
    "rubric": [
      {
        "text": "La validación del cliente mejora la experiencia, pero no protege",
        "points": 3
      },
      {
        "text": "La API se puede llamar sin la interfaz",
        "points": 4
      },
      {
        "text": "El servidor valida todo lo que llega y responde `400`",
        "points": 3
      }
    ],
    "penalties": [
      "Afirmar que basta con la validación del cliente: no se conceden puntos."
    ],
    "partial": "Si se dice que el servidor debe validar «por seguridad» sin explicar por qué, se conceden 3 puntos."
  },
  {
    "id": "E7",
    "kind": "react",
    "category": "Pregunta conceptual",
    "tech": "React, Axios, Express y PostgreSQL",
    "title": "Del formulario a PostgreSQL y de vuelta",
    "concepts": [
      "cliente-servidor",
      "recorrido de una petición",
      "capas"
    ],
    "level": "Básica",
    "minutes": "5",
    "statement": "Un usuario escribe su email en un formulario de React y pulsa «Buscar». La aplicación muestra su perfil, que está guardado en PostgreSQL.\n\nSe pide describir en 2-3 líneas el recorrido completo, desde el campo del formulario hasta la base de datos y de vuelta a la pantalla, nombrando las piezas por las que pasa.",
    "files": [],
    "answerStarter": "Respuesta (2-3 líneas):\n",
    "expected": "Una respuesta de 2-3 líneas con las piezas en orden, de ida y de vuelta.",
    "hints": [
      "Empezar por el estado del componente y por quién envía la petición.",
      "En el servidor, seguir la cadena de Express hasta la única capa que habla con la base de datos."
    ],
    "solution": {
      "code": "*Input* controlado → estado de React → Axios envía `GET /users?email=…` → ruta de Express → validación (middleware) → controlador → modelo con consulta parametrizada de `pg` → PostgreSQL. La fila vuelve al controlador, que responde con JSON; Axios la entrega en `response.data`, el componente la guarda en el estado y React vuelve a renderizar.",
      "changes": [
        "No aplica: es una pregunta conceptual."
      ],
      "explanation": "Es el recorrido de la página «Cómo encaja todo»: el cliente nunca habla con la base de datos; todo pasa por la API.",
      "alternatives": "Cualquier recorrido equivalente con las piezas en el orden correcto."
    },
    "rubric": [
      {
        "text": "Parte del cliente: estado y petición con Axios",
        "points": 3
      },
      {
        "text": "Parte del servidor en orden: ruta, middleware, controlador y modelo con `pg`",
        "points": 4
      },
      {
        "text": "Vuelta: JSON, estado y renderizado",
        "points": 3
      }
    ],
    "penalties": [
      "Afirmar que React consulta directamente la base de datos: no se conceden los 4 puntos del servidor."
    ],
    "partial": "Si faltan una o dos piezas del servidor pero el orden es correcto, se conceden 2 de sus 4 puntos."
  },
  {
    "id": "E8",
    "kind": "react",
    "category": "Pregunta conceptual",
    "tech": "React",
    "title": "Por qué la petición va en `useEffect`",
    "concepts": [
      "useEffect",
      "renderizado",
      "estado"
    ],
    "level": "Básica",
    "minutes": "5",
    "statement": "En el laboratorio 9, la lista de usuarios se pide a la API dentro de `useEffect(() => { … }, [])` y no directamente en el cuerpo del componente.\n\nSe pide explicar en 2-3 líneas por qué.",
    "files": [],
    "answerStarter": "Respuesta (2-3 líneas):\n",
    "expected": "Una respuesta de 2-3 líneas sobre el renderizado y el efecto.",
    "hints": [
      "¿Cuántas veces se ejecuta el cuerpo de un componente?",
      "Seguir la cadena: petición → guardar la respuesta en el estado → ¿qué provoca eso?"
    ],
    "solution": {
      "code": "El cuerpo del componente se ejecuta en cada renderizado. Si la petición estuviera ahí, guardar la respuesta en el estado provocaría otro renderizado y otra petición, sin fin. `useEffect` con `[]` la ejecuta una sola vez, después del primer renderizado; la función `async` se declara dentro porque el efecto no puede devolver una promesa.",
      "changes": [
        "No aplica: es una pregunta conceptual."
      ],
      "explanation": "Las peticiones son efectos: algo que ocurre fuera del renderizado. `useEffect` es el lugar para ellas.",
      "alternatives": "Cualquier explicación equivalente."
    },
    "rubric": [
      {
        "text": "El cuerpo del componente se ejecuta en cada renderizado",
        "points": 3
      },
      {
        "text": "Guardar la respuesta en el estado provoca otro renderizado: bucle de peticiones",
        "points": 4
      },
      {
        "text": "`useEffect` con `[]` se ejecuta una vez, tras el primer renderizado",
        "points": 3
      }
    ],
    "penalties": [],
    "partial": "Si se menciona el bucle sin explicar por qué se produce, se conceden 2 de los 4 puntos del segundo criterio."
  },
  {
    "id": "E9",
    "kind": "react",
    "category": "Pregunta conceptual",
    "tech": "React",
    "title": "Subir el estado o usar Context",
    "concepts": [
      "lifting state",
      "Context API",
      "prop drilling"
    ],
    "level": "Básica",
    "minutes": "5",
    "statement": "En una aplicación de React se dan dos situaciones: (a) un campo de búsqueda y la lista que filtra son hermanos dentro del mismo padre; (b) la sesión del usuario la necesitan la barra de navegación, la página de login y las rutas protegidas.\n\nSe pide justificar en 2-3 líneas qué solución conviene en cada caso: subir el estado al padre o usar Context.",
    "files": [],
    "answerStarter": "Respuesta (2-3 líneas):\n",
    "expected": "Una respuesta de 2-3 líneas que elija una solución para cada caso y la justifique.",
    "hints": [
      "¿Qué distancia hay entre los componentes que comparten el dato en cada caso?",
      "Repasar qué es el *prop drilling* y cuándo aparece."
    ],
    "solution": {
      "code": "(a) Subir el estado al padre común: es un dato compartido por dos componentes cercanos y basta con pasarlo por props. (b) Context (`AuthContext`): la sesión la necesitan componentes lejanos entre sí, y pasarla por props obligaría a hacer *prop drilling* a través de componentes que no la usan.",
      "changes": [
        "No aplica: es una pregunta conceptual."
      ],
      "explanation": "Se empieza siempre por lo más sencillo: subir el estado. Context es para datos que llegan lejos o que usan muchos componentes.",
      "alternatives": "Cualquier justificación equivalente."
    },
    "rubric": [
      {
        "text": "Caso (a): subir el estado al padre, con motivo",
        "points": 4
      },
      {
        "text": "Caso (b): Context, con motivo",
        "points": 4
      },
      {
        "text": "Menciona el *prop drilling* o la regla de empezar por lo sencillo",
        "points": 2
      }
    ],
    "penalties": [
      "Proponer Context para el caso (a) sin justificarlo: no se conceden sus 4 puntos."
    ],
    "partial": "Si las dos elecciones son correctas pero sin motivo, se conceden 2 puntos por caso."
  },
];

