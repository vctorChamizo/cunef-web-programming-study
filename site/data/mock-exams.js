// Complete mock exams (practice exams 4-6), modelled on the format of the final exam: 8
// multiple-choice questions (4 points, 0.5 each, no penalty) and 3 practical exercises (6 points:
// JavaScript, React and Express with PostgreSQL, 2 points each). Original questions and exercises,
// written for this site; the 2025-26 reference exams are only a model of format and difficulty.
// Question ids start with the topic prefix the site uses to place them in a block (js, express,
// sql, auth, components, state, routing). Practical exercises use the format of exercises.js.
// Inside these template literals, a backtick is written \` and a dollar-brace is written \${.
'use strict';
window.MOCK_EXAMS = [
  // ================================================================== Simulacro 4
  {
    n: 4,
    questions: [
      { id: 'js-mx401', type: 'mc', q: 'Dado `const user = { name: "Ana" };`, ¿qué ocurre al ejecutar `user.name = "Luis";`?',
        choices: ['La propiedad cambia: `const` impide reasignar la variable, no modificar el objeto', 'Se produce un error, porque `user` se declaró con `const`', 'Se crea una copia de `user` con el nuevo nombre', 'No ocurre nada: la asignación se ignora en silencio'], answer: 0,
        why: '`const` impide que la variable apunte a otro valor (`user = ...` daría error), pero el objeto al que apunta sigue siendo modificable.' },
      { id: 'js-mx402', type: 'mc', q: '¿Qué devuelve `[5, 12, 8, 20].filter((n) => n > 10)`?',
        choices: ['`true`, porque algún elemento cumple la condición', '`12`, el primer elemento que cumple la condición', '`[12, 20]`, un array nuevo con los elementos que cumplen la condición', '`[5, 8]`, los elementos que no la cumplen'], answer: 2,
        why: '`filter` devuelve siempre un array nuevo con los elementos para los que el callback devuelve `true`. El que devuelve solo el primero es `find`.' },
      { id: 'js-mx403', type: 'mc', q: 'En el manejador del evento `submit` de un formulario, ¿para qué se llama a `event.preventDefault()`?',
        choices: ['Para evitar que el navegador envíe el formulario y recargue la página', 'Para vaciar los campos del formulario', 'Para impedir que se ejecuten otros manejadores del mismo evento', 'Para validar los campos marcados como `required`'], answer: 0,
        why: 'Por defecto, enviar un formulario recarga la página. `preventDefault` cancela ese comportamiento para gestionar el envío con JavaScript.' },
      { id: 'express-mx404', type: 'mc', q: 'Un endpoint `POST /products` crea un producto correctamente. ¿Qué código de estado debe devolver?',
        choices: ['200', '302', '204', '201'], answer: 3,
        why: '201 *Created* indica que se ha creado un recurso nuevo. 204 se usa cuando la respuesta no lleva cuerpo, por ejemplo tras un borrado.' },
      { id: 'sql-mx405', type: 'mc', q: '¿Por qué se escribe `db.query("SELECT * FROM products WHERE id = $1", [id])` en lugar de concatenar el `id` en el texto SQL?',
        choices: ['Porque PostgreSQL no admite números dentro del texto de la consulta', 'Porque así la consulta es más rápida', 'Porque `pg` envía los valores aparte del SQL y así no pueden alterar la consulta (inyección SQL)', 'Porque `$1` convierte el valor a número automáticamente'], answer: 2,
        why: 'Con una consulta parametrizada, el valor nunca se interpreta como parte del SQL. Concatenar datos del usuario permite la inyección SQL.' },
      { id: 'components-mx406', type: 'mc', q: 'Al renderizar una lista con `items.map(...)`, ¿para qué sirve la prop `key`?',
        choices: ['Para dar estilo a cada elemento', 'Para que React identifique cada elemento entre un renderizado y el siguiente', 'Para ordenar la lista alfabéticamente', 'Para que el elemento se pueda pulsar'], answer: 1,
        why: '`key` debe ser única y estable entre hermanos: React la usa para saber qué elemento se ha añadido, movido o eliminado.' },
      { id: 'state-mx407', type: 'mc', q: 'Un componente tiene `const [items, setItems] = useState([])`. ¿Por qué `items.push(x); setItems(items);` no vuelve a renderizar?',
        choices: ['Porque `push` no funciona con arrays de estado', 'Porque `setItems` solo acepta valores primitivos', 'Porque falta llamar a `useEffect`', 'Porque React compara por referencia y recibe el mismo array, así que considera que no hay cambio'], answer: 3,
        why: 'El estado se trata como inmutable: hay que pasar un array nuevo, por ejemplo `setItems([...items, x])`.' },
      { id: 'state-mx408', type: 'mc', q: '¿Cuándo se ejecuta el efecto de `useEffect(() => { cargarDatos(); }, [])`?',
        choices: ['Antes del primer renderizado', 'Una vez, después del primer renderizado', 'Después de cada renderizado', 'Solo cuando el usuario pulsa un botón'], answer: 1,
        why: 'Con el array de dependencias vacío, el efecto se ejecuta una sola vez, tras montar el componente. Sin array, se ejecutaría tras cada renderizado.' },
    ],
    practical: [
      {
        id: 'S4-JS', kind: 'js', category: 'Completar código', tech: 'JavaScript', title: 'Valor del inventario',
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
        id: 'S4-REACT', kind: 'react', category: 'Completar código', tech: 'React', title: 'Contador que no baja de cero',
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
        id: 'S4-EXPRESS', kind: 'express', category: 'Completar código', tech: 'Express y PostgreSQL', title: 'Borrar un producto',
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
    ],
  },

  // ================================================================== Simulacro 5
  {
    n: 5,
    questions: [
      { id: 'js-mx501', type: 'mc', q: '¿Qué valor tiene `nums` después de ejecutar `const nums = [1, 2, 3]; const doubled = nums.map((n) => n * 2);`?',
        choices: ['`[2, 4, 6]`', '`[1, 2, 3, 2, 4, 6]`', '`undefined`', '`[1, 2, 3]`'], answer: 3,
        why: '`map` no modifica el array original: devuelve uno nuevo, que aquí se guarda en `doubled`.' },
      { id: 'js-mx502', type: 'mc', q: '¿Cuál de estos valores es *falsy* en JavaScript?',
        choices: ['`"0"`', '`[]`', '`""`', '`{}`'], answer: 2,
        why: 'Son *falsy* `false`, `0`, `""`, `null`, `undefined` y `NaN`. La cadena `"0"`, el array vacío y el objeto vacío son *truthy*.' },
      { id: 'js-mx503', type: 'mc', q: '¿Qué hace `await` delante de una llamada que devuelve una promesa?',
        choices: ['Espera, dentro de una función `async`, a que la promesa se resuelva y devuelve su valor', 'Bloquea todo el navegador hasta que termina la petición', 'Convierte la promesa en una función síncrona para siempre', 'Repite la llamada si falla'], answer: 0,
        why: '`await` solo puede usarse dentro de una función `async`. Pausa esa función, no el navegador, hasta que la promesa se resuelve; si se rechaza, lanza un error.' },
      { id: 'express-mx504', type: 'mc', q: 'Un middleware de Express ni responde ni llama a `next()`. ¿Qué le ocurre a la petición?',
        choices: ['Express pasa automáticamente al siguiente middleware', 'La petición se queda sin respuesta hasta que el cliente agota el tiempo de espera', 'Express responde 404', 'Express responde 500'], answer: 1,
        why: 'Un middleware debe terminar la respuesta o ceder el control con `next()`. Si no hace ninguna de las dos cosas, la petición queda pendiente.' },
      { id: 'auth-mx505', type: 'mc', q: 'Un usuario envía un token válido, pero intenta borrar una tarea de otro usuario. ¿Qué código corresponde?',
        choices: ['400', '401', '403', '404'], answer: 2,
        why: '401 significa que no se sabe quién es (sin token o token no válido). 403 significa que se sabe quién es, pero no tiene permiso para esa acción.' },
      { id: 'components-mx506', type: 'mc', q: '¿Qué son las *props* de un componente React?',
        choices: ['Datos que el componente padre pasa al hijo; el hijo no debe modificarlos', 'Variables internas que el componente cambia con un *setter*', 'Las propiedades CSS del componente', 'Las rutas de la aplicación'], answer: 0,
        why: 'Las props llegan desde fuera y son de solo lectura. Lo que el propio componente necesita cambiar se guarda en estado.' },
      { id: 'state-mx507', type: 'mc', q: 'Con `const response = await api.get("/tasks")`, usando Axios, ¿dónde está la lista de tareas?',
        choices: ['En `response`', 'En `response.json()`', 'En `response.body`', 'En `response.data`'], answer: 3,
        why: 'Axios convierte el JSON automáticamente y lo deja en `response.data`. `response.json()` es propio de `fetch`, que no se usa en el curso.' },
      { id: 'routing-mx508', type: 'mc', q: 'Con la ruta `<Route path="/tasks/:id" ... />` y la URL `/tasks/7`, ¿qué devuelve `useParams()` en el componente?',
        choices: ['`{ id: 7 }`', '`{ id: "7" }`', '`7`', '`"/tasks/7"`'], answer: 1,
        why: 'Los parámetros de la URL siempre llegan como texto. Para compararlos con un id numérico hay que convertirlos, por ejemplo con `Number(id)`.' },
    ],
    practical: [
      {
        id: 'S5-JS', kind: 'js', category: 'Corrección de errores', tech: 'JavaScript', title: 'Iniciales de los alumnos',
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
        id: 'S5-REACT', kind: 'react', category: 'Completar código', tech: 'React', title: 'Formulario controlado',
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
        id: 'S5-EXPRESS', kind: 'express', category: 'Completar código', tech: 'Express y PostgreSQL', title: 'Crear un producto con validación',
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
    ],
  },

  // ================================================================== Simulacro 6
  {
    n: 6,
    questions: [
      { id: 'js-mx601', type: 'mc', q: '¿Qué diferencia hay entre `let` y `const`?',
        choices: ['`let` permite reasignar la variable; `const` no', '`const` crea variables globales', '`let` solo admite números', 'Ninguna: son sinónimos'], answer: 0,
        why: 'Las dos tienen ámbito de bloque. `const` impide reasignar la variable; `let` lo permite.' },
      { id: 'js-mx602', type: 'mc', q: '¿Qué devuelve `users.find((u) => u.id === 99)` si ningún usuario tiene ese `id`?',
        choices: ['`null`', '`[]`', '`false`', '`undefined`'], answer: 3,
        why: '`find` devuelve el primer elemento que cumple la condición o `undefined` si no hay ninguno. `filter` devolvería `[]`.' },
      { id: 'js-mx603', type: 'mc', q: 'Para mostrar en un elemento el texto que ha escrito un usuario, ¿por qué es preferible `textContent` a `innerHTML`?',
        choices: ['Porque `textContent` es más rápido de escribir', 'Porque `textContent` inserta el texto tal cual, sin interpretarlo como HTML', 'Porque `innerHTML` no funciona con texto', 'Porque `textContent` aplica estilos automáticamente'], answer: 1,
        why: 'Con `innerHTML`, un texto con etiquetas se interpretaría como HTML, lo que permite inyectar contenido o código. `textContent` lo muestra literalmente.' },
      { id: 'express-mx604', type: 'mc', q: 'En la ruta `router.get("/tasks/:id", ...)` y la petición `GET /tasks/7?done=true`, ¿dónde está el valor `7`?',
        choices: ['`req.query.id`', '`req.body.id`', '`req.params.id`', '`req.headers.id`'], answer: 2,
        why: 'Los segmentos declarados con `:` en la ruta llegan en `req.params`. Lo que va tras `?` llega en `req.query`, así que `done` estaría en `req.query.done`.' },
      { id: 'sql-mx605', type: 'mc', q: '¿Qué aporta `RETURNING id, title` al final de un `INSERT` en PostgreSQL?',
        choices: ['Que la consulta devuelva las columnas indicadas de la fila insertada', 'Que se deshaga la inserción si hay un error', 'Que solo se inserten esas dos columnas', 'Nada: es obligatorio en todos los `INSERT`'], answer: 0,
        why: 'Sin `RETURNING`, un `INSERT` no devuelve filas. Con él, `rows` contiene la fila creada, incluido el `id` generado por la base de datos.' },
      { id: 'auth-mx606', type: 'mc', q: '¿Por qué las contraseñas se guardan con `bcrypt.hash` y se comprueban con `bcrypt.compare`?',
        choices: ['Para poder descifrarlas y enviarlas por correo al usuario', 'Para que nunca se guarden en claro: el *hash* no se puede invertir y `compare` comprueba si una contraseña coincide con él', 'Porque PostgreSQL no admite texto con caracteres especiales', 'Para que el JWT ocupe menos'], answer: 1,
        why: 'Un *hash* no se puede descifrar. En el login, `compare` calcula el *hash* de la contraseña recibida y lo contrasta con el guardado.' },
      { id: 'components-mx607', type: 'mc', q: '¿Qué ocurre con `<button onClick={handleDelete(task.id)}>Eliminar</button>`?',
        choices: ['La función se ejecuta solo al hacer clic', 'El botón queda deshabilitado', 'React muestra un error y no renderiza el botón', 'La función se ejecuta en cada renderizado, sin esperar al clic'], answer: 3,
        why: 'Entre llaves se evalúa la expresión, y `handleDelete(task.id)` es una llamada. Para esperar al clic hay que pasar una función: `onClick={() => handleDelete(task.id)}`.' },
      { id: 'state-mx608', type: 'mc', q: 'En el patrón con los estados `data`, `loading` y `error`, ¿por qué se suele poner `setLoading(false)` en un bloque `finally`?',
        choices: ['Porque `finally` se ejecuta antes que `try`', 'Porque `setLoading` no funciona dentro de `try`', 'Porque así se desactiva la carga tanto si la petición sale bien como si falla', 'Porque `finally` repite la petición si falla'], answer: 2,
        why: '`finally` se ejecuta siempre. Si `setLoading(false)` solo estuviera en el `try`, un error dejaría la pantalla en «Cargando…» para siempre.' },
    ],
    practical: [
      {
        id: 'S6-JS', kind: 'js', category: 'Completar código', tech: 'JavaScript', title: 'Buscar un usuario por email',
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
        id: 'S6-REACT', kind: 'react', category: 'Corrección de errores', tech: 'React y Axios', title: 'Peticiones sin fin',
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
        id: 'S6-EXPRESS', kind: 'express', category: 'Corrección de errores', tech: 'Express y PostgreSQL', title: 'Consulta vulnerable',
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
    ],
  },
];
