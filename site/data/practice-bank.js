// Practice bank of the study site. Hand-maintained (first written with a one-off script).
//
// - adapted: bank questions copied here whose wording was corrected to the formal register.
// - fixes: register corrections (formal, impersonal) applied to questions of the generated quizzes.
// - add: questions appended to the generated quizzes, by quiz. They include every question of the
//   practice exams, so that every practice exam is built only from quiz questions.
// - quizzes: the quizzes without a lab (DOM, Context API, backend architecture, client-server architecture).
// - SIMULACROS: each practice exam = 8 multiple-choice questions taken from the quizzes (by id) and
//   a 6-point practical part from exercises.js (by id): 3 code exercises and 1 conceptual question.
// Origin of the questions: ids without "mx" or "ctx" come from the coordinator's study-site bank
// (Spanish version); "mx" and "ctx" ids were written for this site.
'use strict';
window.PRACTICE_BANK = {
  "fixes": {
    "rest-23": {
      "why": "Un 204 nunca tiene cuerpo; Express lo descarta. Se usa 204 sin cuerpo, o 200 con un cuerpo."
    },
    "sql-31": {
      "q": "La migración `003_add_due_date.sql` ya se ha ejecutado en todas las bases de datos, y tiene un error. ¿Qué se debe hacer?"
    },
    "sql-12": {
      "why": "Comparar cualquier cosa con NULL da \"desconocido\", que WHERE trata como no verdadero, así que la consulta no devuelve ninguna fila. Hay que usar `due_date IS NULL`."
    },
    "auth-36": {
      "why": "Cualquiera puede saltarse el formulario con curl o un script. Las comprobaciones del frontend son una comodidad; el servidor tiene que validar todo lo que llega."
    },
    "components-26": {
      "why": "Con `{ }` el cuerpo es un bloque y debe hacer `return`. Para un retorno implícito se usa `(t) => <li>…</li>` o `(t) => (…)`."
    },
    "routing-12": {
      "why": "`7 === '7'` es false. Hay que convertir primero: `Number(id)`."
    }
  },
  "add": {
    "3": [
      {
        "id": "js-16",
        "type": "mc",
        "q": "¿Qué es `'7' + 3`?",
        "choices": [
          "`10`",
          "`NaN`",
          "`'10'`",
          "`'73'`"
        ],
        "answer": 3,
        "why": "Con una cadena a cualquiera de los lados, `+` concatena: el número 3 se coerciona a `'3'`."
      },
      {
        "id": "js-35",
        "type": "mc",
        "q": "¿Qué devuelve `[3, 8, 1].map((n) => n * 10)`?",
        "choices": [
          "`undefined`",
          "`90`",
          "`[30, 80, 10]`",
          "`[3, 8, 1]` modificado en su sitio"
        ],
        "answer": 2,
        "why": "`map` construye un array nuevo de la misma longitud con los valores que devuelve el callback; el original se queda como estaba."
      },
      {
        "id": "js-11",
        "type": "mc",
        "q": "¿Qué imprime esto? `console.log(y); let y = 3;`",
        "choices": [
          "`3`",
          "Lanza un `ReferenceError`",
          "`undefined`",
          "`null`"
        ],
        "answer": 1,
        "why": "`let` se eleva pero se queda en la zona muerta temporal hasta que se ejecuta su línea, así que leerlo antes lanza un `ReferenceError`."
      },
      {
        "id": "js-19",
        "type": "mc",
        "q": "¿Cuál de estos valores es **truthy**?",
        "choices": [
          "`[]`",
          "`''`",
          "`0`",
          "`NaN`"
        ],
        "answer": 0,
        "why": "Un array vacío es un objeto, y todos los objetos son truthy. `0`, `''` y `NaN` están en la corta lista de valores falsy."
      },
      {
        "id": "js-38",
        "type": "mc",
        "q": "¿Qué imprime esto? `const a = [1, 2]; const b = a; b.push(3); console.log(a.length);`",
        "choices": [
          "`2`",
          "`3`",
          "`undefined`",
          "Un `TypeError` porque `a` es `const`"
        ],
        "answer": 1,
        "why": "`b = a` copia la referencia, así que los dos nombres apuntan al mismo array; lo que se añade a través de `b` se ve a través de `a`."
      },
      {
        "id": "js-46",
        "type": "mc",
        "q": "¿Qué función flecha devuelve un **objeto** con una propiedad `ok` a `true`?",
        "choices": [
          "`() => { ok: true }`",
          "`() => return { ok: true }`",
          "`() => [ok: true]`",
          "`() => ({ ok: true })`"
        ],
        "answer": 3,
        "why": "Sin paréntesis, las llaves se leen como un cuerpo de bloque (que contiene una etiqueta), así que la función devuelve `undefined`. Los paréntesis las convierten en un objeto literal."
      },
      {
        "id": "js-25",
        "type": "mc",
        "q": "¿Qué valor da `'' || 'anonymous'`?",
        "choices": [
          "`true`",
          "`''`",
          "`'anonymous'`",
          "`false`"
        ],
        "answer": 2,
        "why": "`||` devuelve el primer operando truthy, o el último si ninguno lo es. `''` es falsy, así que devuelve `'anonymous'` en sí, no `true`."
      },
      {
        "id": "js-41",
        "type": "mc",
        "q": "¿Qué guarda `const r = [1, 2].forEach((n) => n * 2);` en `r`?",
        "choices": [
          "`undefined`",
          "`[1, 2]`",
          "`[2, 4]`",
          "`6`"
        ],
        "answer": 0,
        "why": "`forEach` ejecuta el callback por su efecto y no devuelve nada. Para reunir los valores transformados se usa `map`."
      },
      {
        "id": "js-12",
        "type": "mc",
        "q": "Después de `if (true) { let a = 1; var b = 2; }`, ¿qué nombres se pueden leer en la línea siguiente, fuera del bloque?",
        "choices": [
          "Tanto `a` como `b`",
          "Solo `a`",
          "Ninguno",
          "Solo `b`"
        ],
        "answer": 3,
        "why": "`let` tiene ámbito de bloque, así que `a` solo existe dentro de las llaves. `var` ignora los bloques y se escapa a la función o al script que lo contiene."
      },
      {
        "id": "js-mx401",
        "type": "mc",
        "q": "Dado `const user = { name: \"Ana\" };`, ¿qué ocurre al ejecutar `user.name = \"Luis\";`?",
        "choices": [
          "La propiedad cambia: `const` impide reasignar la variable, no modificar el objeto",
          "Se produce un error, porque `user` se declaró con `const`",
          "Se crea una copia de `user` con el nuevo nombre",
          "No ocurre nada: la asignación se ignora en silencio"
        ],
        "answer": 0,
        "why": "`const` impide que la variable apunte a otro valor (`user = ...` daría error), pero el objeto al que apunta sigue siendo modificable."
      },
      {
        "id": "js-mx402",
        "type": "mc",
        "q": "¿Qué devuelve `[5, 12, 8, 20].filter((n) => n > 10)`?",
        "choices": [
          "`true`, porque algún elemento cumple la condición",
          "`12`, el primer elemento que cumple la condición",
          "`[12, 20]`, un array nuevo con los elementos que cumplen la condición",
          "`[5, 8]`, los elementos que no la cumplen"
        ],
        "answer": 2,
        "why": "`filter` devuelve siempre un array nuevo con los elementos para los que el callback devuelve `true`. El que devuelve solo el primero es `find`."
      },
      {
        "id": "js-mx501",
        "type": "mc",
        "q": "¿Qué valor tiene `nums` después de ejecutar `const nums = [1, 2, 3]; const doubled = nums.map((n) => n * 2);`?",
        "choices": [
          "`[2, 4, 6]`",
          "`[1, 2, 3, 2, 4, 6]`",
          "`undefined`",
          "`[1, 2, 3]`"
        ],
        "answer": 3,
        "why": "`map` no modifica el array original: devuelve uno nuevo, que aquí se guarda en `doubled`."
      },
      {
        "id": "js-mx502",
        "type": "mc",
        "q": "¿Cuál de estos valores es *falsy* en JavaScript?",
        "choices": [
          "`\"0\"`",
          "`[]`",
          "`\"\"`",
          "`{}`"
        ],
        "answer": 2,
        "why": "Son *falsy* `false`, `0`, `\"\"`, `null`, `undefined` y `NaN`. La cadena `\"0\"`, el array vacío y el objeto vacío son *truthy*."
      },
      {
        "id": "js-mx601",
        "type": "mc",
        "q": "¿Qué diferencia hay entre `let` y `const`?",
        "choices": [
          "`let` permite reasignar la variable; `const` no",
          "`const` crea variables globales",
          "`let` solo admite números",
          "Ninguna: son sinónimos"
        ],
        "answer": 0,
        "why": "Las dos tienen ámbito de bloque. `const` impide reasignar la variable; `let` lo permite."
      },
      {
        "id": "js-mx602",
        "type": "mc",
        "q": "¿Qué devuelve `users.find((u) => u.id === 99)` si ningún usuario tiene ese `id`?",
        "choices": [
          "`null`",
          "`[]`",
          "`false`",
          "`undefined`"
        ],
        "answer": 3,
        "why": "`find` devuelve el primer elemento que cumple la condición o `undefined` si no hay ninguno. `filter` devolvería `[]`."
      }
    ],
    "4": [
      {
        "id": "express-23",
        "type": "mc",
        "q": "Una función de middleware, antes de terminar su trabajo con una petición, tiene que…",
        "choices": [
          "o llamar a next() o enviar una respuesta",
          "llamar siempre a next()",
          "enviar siempre una respuesta",
          "devolver un valor"
        ],
        "answer": 0,
        "why": "La petición se pasa adelante o se termina. No hacer ninguna de las dos cosas deja la petición colgada; hacer las dos envía dos respuestas."
      },
      {
        "id": "express-12",
        "type": "mc",
        "q": "Con `app.get('/tasks/:id', getTask)`, ¿qué vale `req.params.id` para `GET /tasks/42`?",
        "choices": [
          "El número 42",
          "`undefined`",
          "La cadena \"42\"",
          "`{ id: 42 }`"
        ],
        "answer": 2,
        "why": "Las partes de la URL son texto: los parámetros de ruta son siempre **cadenas**. Se convierten con `Number(…)`."
      },
      {
        "id": "express-mx504",
        "type": "mc",
        "q": "Un middleware de Express ni responde ni llama a `next()`. ¿Qué le ocurre a la petición?",
        "choices": [
          "Express pasa automáticamente al siguiente middleware",
          "La petición se queda sin respuesta hasta que el cliente agota el tiempo de espera",
          "Express responde 404",
          "Express responde 500"
        ],
        "answer": 1,
        "why": "Un middleware debe terminar la respuesta o ceder el control con `next()`. Si no hace ninguna de las dos cosas, la petición queda pendiente."
      },
      {
        "id": "express-mx604",
        "type": "mc",
        "q": "En la ruta `router.get(\"/tasks/:id\", ...)` y la petición `GET /tasks/7?done=true`, ¿dónde está el valor `7`?",
        "choices": [
          "`req.query.id`",
          "`req.body.id`",
          "`req.params.id`",
          "`req.headers.id`"
        ],
        "answer": 2,
        "why": "Los segmentos declarados con `:` en la ruta llegan en `req.params`. Lo que va tras `?` llega en `req.query`, así que `done` estaría en `req.query.done`."
      }
    ],
    "5": [
      {
        "id": "express-39",
        "type": "mc",
        "q": "¿Cómo reconoce Express un middleware de manejo de errores?",
        "choices": [
          "Su nombre contiene \"error\"",
          "Está registrado el último",
          "Declara cuatro parámetros: (err, req, res, next)",
          "Llama a res.status(500)"
        ],
        "answer": 2,
        "why": "Express comprueba el número de parámetros de la función (`fn.length === 4`). Ir el último es dónde tiene que estar, no cómo se reconoce."
      },
      {
        "id": "express-mx404",
        "type": "mc",
        "q": "Un endpoint `POST /products` crea un producto correctamente. ¿Qué código de estado debe devolver?",
        "choices": [
          "200",
          "302",
          "204",
          "201"
        ],
        "answer": 3,
        "why": "201 *Created* indica que se ha creado un recurso nuevo. 204 se usa cuando la respuesta no lleva cuerpo, por ejemplo tras un borrado."
      }
    ],
    "6": [
      {
        "id": "sql-19",
        "type": "mc",
        "q": "dan no tiene tareas. ¿Aparece en `SELECT u.email, t.title FROM users u JOIN tasks t ON t.user_id = u.id`?",
        "choices": [
          "No: un join interno conserva solo las filas que han encontrado pareja",
          "Sí, una vez por cada tarea de la tabla",
          "Sí, una vez, con un título NULL",
          "Solo si se creó el primero"
        ],
        "answer": 0,
        "why": "JOIN (INNER JOIN) descarta las filas sin coincidencia. Un LEFT JOIN desde users conservaría a dan con las columnas de tarea a NULL."
      },
      {
        "id": "sql-14",
        "type": "mc",
        "q": "La API muestra 20 tareas por página, ordenadas por id. ¿Qué cláusula devuelve la página 3?",
        "choices": [
          "`LIMIT 20 OFFSET 60`",
          "`LIMIT 20 OFFSET 40`",
          "`LIMIT 3 OFFSET 20`",
          "`LIMIT 60 OFFSET 40`"
        ],
        "answer": 1,
        "why": "La página p se salta (p − 1) × tamaño filas: la página 3 se salta 40 y toma 20, así que muestra las filas 41–60."
      },
      {
        "id": "sql-mx405",
        "type": "mc",
        "q": "¿Por qué se escribe `db.query(\"SELECT * FROM products WHERE id = $1\", [id])` en lugar de concatenar el `id` en el texto SQL?",
        "choices": [
          "Porque PostgreSQL no admite números dentro del texto de la consulta",
          "Porque así la consulta es más rápida",
          "Porque `pg` envía los valores aparte del SQL y así no pueden alterar la consulta (inyección SQL)",
          "Porque `$1` convierte el valor a número automáticamente"
        ],
        "answer": 2,
        "why": "Con una consulta parametrizada, el valor nunca se interpreta como parte del SQL. Concatenar datos del usuario permite la inyección SQL."
      },
      {
        "id": "sql-mx605",
        "type": "mc",
        "q": "¿Qué aporta `RETURNING id, title` al final de un `INSERT` en PostgreSQL?",
        "choices": [
          "Que la consulta devuelva las columnas indicadas de la fila insertada",
          "Que se deshaga la inserción si hay un error",
          "Que solo se inserten esas dos columnas",
          "Nada: es obligatorio en todos los `INSERT`"
        ],
        "answer": 0,
        "why": "Sin `RETURNING`, un `INSERT` no devuelve filas. Con él, `rows` contiene la fila creada, incluido el `id` generado por la base de datos."
      }
    ],
    "7": [
      {
        "id": "auth-01",
        "type": "mc",
        "q": "Ben envía `DELETE /tasks/12` con un token válido y sin caducar. La tarea 12 existe y es de Ana. ¿Qué debe responder la API?",
        "choices": [
          "200, porque el token es válido",
          "401, porque Ben no está autorizado",
          "403, porque Ben está autenticado pero no es su tarea",
          "404, para ocultar que la tarea existe"
        ],
        "answer": 2,
        "why": "El token demuestra **quién** es Ben (la autenticación ha pasado), así que no es 401. Falla la comprobación de propiedad, que es un fallo de autorización: **403**. (Algunas APIs responden 404 para ocultar la existencia; 403 es la respuesta clara y honesta.)"
      },
      {
        "id": "auth-mx505",
        "type": "mc",
        "q": "Un usuario envía un token válido, pero intenta borrar una tarea de otro usuario. ¿Qué código corresponde?",
        "choices": [
          "400",
          "401",
          "403",
          "404"
        ],
        "answer": 2,
        "why": "401 significa que no se sabe quién es (sin token o token no válido). 403 significa que se sabe quién es, pero no tiene permiso para esa acción."
      },
      {
        "id": "auth-mx606",
        "type": "mc",
        "q": "¿Por qué las contraseñas se guardan con `bcrypt.hash` y se comprueban con `bcrypt.compare`?",
        "choices": [
          "Para poder descifrarlas y enviarlas por correo al usuario",
          "Para que nunca se guarden en claro: el *hash* no se puede invertir y `compare` comprueba si una contraseña coincide con él",
          "Porque PostgreSQL no admite texto con caracteres especiales",
          "Para que el JWT ocupe menos"
        ],
        "answer": 1,
        "why": "Un *hash* no se puede descifrar. En el login, `compare` calcula el *hash* de la contraseña recibida y lo contrasta con el guardado."
      }
    ],
    "8": [
      {
        "id": "components-13",
        "type": "mc",
        "q": "¿Cómo recibe `TaskItem` las props en `<TaskItem title=\"Buy milk\" done={false} />`?",
        "choices": [
          "Como dos parámetros: `TaskItem(title, done)`",
          "Como un solo objeto, el primer parámetro: `{ title: 'Buy milk', done: false }`",
          "A través de una variable global `props`",
          "A través de `this.title` y `this.done`"
        ],
        "answer": 1,
        "why": "Todos los atributos llegan como un solo objeto, normalmente desestructurado: `function TaskItem({ title, done })`."
      },
      {
        "id": "components-22",
        "type": "mc",
        "q": "¿Para qué usa React la `key` de un elemento de una lista?",
        "choices": [
          "Como id HTML del elemento",
          "Como una prop que el componente puede leer",
          "Para ordenar la lista",
          "Para emparejar cada elemento con el mismo elemento del render anterior, conservando su DOM y su estado"
        ],
        "answer": 3,
        "why": "Las keys identifican los elementos entre renders, para que React pueda mover, añadir y quitar los correctos. No se pasan como props."
      },
      {
        "id": "components-29",
        "type": "mc",
        "q": "Con `count = 0`, ¿qué muestra `<div>{count && <p>{count} new</p>}</div>`?",
        "choices": [
          "Nada",
          "El texto 0",
          "El texto false",
          "0 new"
        ],
        "answer": 1,
        "why": "`0 && …` da `0`, y React renderiza los números. Se usa `count > 0 && …` o un ternario."
      },
      {
        "id": "components-34",
        "type": "mc",
        "q": "¿Qué botón llama a `save` solo al hacer clic?",
        "choices": [
          "`<button onClick={save}>`",
          "`<button onClick=\"save()\">`",
          "`<button onClick={save()}>`",
          "`<button onclick={save}>`"
        ],
        "answer": 0,
        "why": "Se pasa la función en sí. `save()` se ejecuta durante el render; una cadena es una costumbre de HTML (y un error en React); las props de evento van en camelCase."
      },
      {
        "id": "components-mx406",
        "type": "mc",
        "q": "Al renderizar una lista con `items.map(...)`, ¿para qué sirve la prop `key`?",
        "choices": [
          "Para dar estilo a cada elemento",
          "Para que React identifique cada elemento entre un renderizado y el siguiente",
          "Para ordenar la lista alfabéticamente",
          "Para que el elemento se pueda pulsar"
        ],
        "answer": 1,
        "why": "`key` debe ser única y estable entre hermanos: React la usa para saber qué elemento se ha añadido, movido o eliminado."
      },
      {
        "id": "components-mx506",
        "type": "mc",
        "q": "¿Qué son las *props* de un componente React?",
        "choices": [
          "Datos que el componente padre pasa al hijo; el hijo no debe modificarlos",
          "Variables internas que el componente cambia con un *setter*",
          "Las propiedades CSS del componente",
          "Las rutas de la aplicación"
        ],
        "answer": 0,
        "why": "Las props llegan desde fuera y son de solo lectura. Lo que el propio componente necesita cambiar se guarda en estado."
      },
      {
        "id": "components-mx607",
        "type": "mc",
        "q": "¿Qué ocurre con `<button onClick={handleDelete(task.id)}>Eliminar</button>`?",
        "choices": [
          "La función se ejecuta solo al hacer clic",
          "El botón queda deshabilitado",
          "React muestra un error y no renderiza el botón",
          "La función se ejecuta en cada renderizado, sin esperar al clic"
        ],
        "answer": 3,
        "why": "Entre llaves se evalúa la expresión, y `handleDelete(task.id)` es una llamada. Para esperar al clic hay que pasar una función: `onClick={() => handleDelete(task.id)}`."
      }
    ],
    "9": [
      {
        "id": "state-07",
        "type": "mc",
        "q": "Con `count` igual a 0, un clic ejecuta `setCount(count + 1); setCount(count + 1); console.log(count);`. ¿Qué muestra la consola, y qué muestra después la pantalla?",
        "choices": [
          "0, luego 1",
          "2, luego 2",
          "0, luego 2",
          "1, luego 1"
        ],
        "answer": 0,
        "why": "El estado es una instantánea: las dos llamadas leen `count = 0` y encolan \"poner a 1\", y el log sigue viendo el valor antiguo. El siguiente render muestra 1."
      },
      {
        "id": "state-13",
        "type": "mc",
        "q": "¿Qué actualización quita del estado `tasks` la tarea con id 7?",
        "choices": [
          "`tasks.splice(tasks.findIndex((t) => t.id === 7), 1)`",
          "`setTasks(tasks.pop())`",
          "`delete tasks[7]; setTasks(tasks)`",
          "`setTasks(tasks.filter((t) => t.id !== 7))`"
        ],
        "answer": 3,
        "why": "`filter` devuelve un array **nuevo** sin el elemento. `splice`, `delete` y `pop` cambian el array existente."
      },
      {
        "id": "state-20",
        "type": "mc",
        "q": "Un efecto tiene el array de dependencias `[userId]`. ¿Cuándo se ejecuta?",
        "choices": [
          "Después de cada render",
          "Solo después del primer render",
          "Después del primer render y después de cualquier render en el que haya cambiado `userId`",
          "Solo cuando cambia `userId`, nunca al montar"
        ],
        "answer": 2,
        "why": "Siempre se ejecuta al montar, y luego otra vez cada vez que un valor de la lista difiere (según `Object.is`) de la ejecución anterior."
      },
      {
        "id": "state-12",
        "type": "mc",
        "q": "¿Qué línea marca correctamente como hecha la tarea del estado?",
        "choices": [
          "`task.done = true; setTask(task);`",
          "`setTask({ ...task, done: true });`",
          "`setTask(task.done = true);`",
          "`Object.assign(task, { done: true }); setTask(task);`"
        ],
        "answer": 1,
        "why": "React compara referencias con `Object.is`. Solo un objeto **nuevo** indica un cambio; las demás opciones mutan el mismo objeto."
      },
      {
        "id": "state-mx407",
        "type": "mc",
        "q": "Un componente tiene `const [items, setItems] = useState([])`. ¿Por qué `items.push(x); setItems(items);` no vuelve a renderizar?",
        "choices": [
          "Porque `push` no funciona con arrays de estado",
          "Porque `setItems` solo acepta valores primitivos",
          "Porque falta llamar a `useEffect`",
          "Porque React compara por referencia y recibe el mismo array, así que considera que no hay cambio"
        ],
        "answer": 3,
        "why": "El estado se trata como inmutable: hay que pasar un array nuevo, por ejemplo `setItems([...items, x])`."
      },
      {
        "id": "js-mx503",
        "type": "mc",
        "q": "¿Qué hace `await` delante de una llamada que devuelve una promesa?",
        "choices": [
          "Espera, dentro de una función `async`, a que la promesa se resuelva y devuelve su valor",
          "Bloquea todo el navegador hasta que termina la petición",
          "Convierte la promesa en una función síncrona para siempre",
          "Repite la llamada si falla"
        ],
        "answer": 0,
        "why": "`await` solo puede usarse dentro de una función `async`. Pausa esa función, no el navegador, hasta que la promesa se resuelve; si se rechaza, lanza un error."
      },
      {
        "id": "state-mx507",
        "type": "mc",
        "q": "Con `const response = await api.get(\"/tasks\")`, usando Axios, ¿dónde está la lista de tareas?",
        "choices": [
          "En `response`",
          "En `response.json()`",
          "En `response.body`",
          "En `response.data`"
        ],
        "answer": 3,
        "why": "Axios convierte el JSON automáticamente y lo deja en `response.data`. `response.json()` es propio de `fetch`, que no se usa en el curso."
      },
      {
        "id": "state-mx408",
        "type": "mc",
        "q": "¿Cuándo se ejecuta el efecto de `useEffect(() => { cargarDatos(); }, [])`?",
        "choices": [
          "Antes del primer renderizado",
          "Una vez, después del primer renderizado",
          "Después de cada renderizado",
          "Solo cuando el usuario pulsa un botón"
        ],
        "answer": 1,
        "why": "Con el array de dependencias vacío, el efecto se ejecuta una sola vez, tras montar el componente. Sin array, se ejecutaría tras cada renderizado."
      },
      {
        "id": "state-mx608",
        "type": "mc",
        "q": "En el patrón con los estados `data`, `loading` y `error`, ¿por qué se suele poner `setLoading(false)` en un bloque `finally`?",
        "choices": [
          "Porque `finally` se ejecuta antes que `try`",
          "Porque `setLoading` no funciona dentro de `try`",
          "Porque así se desactiva la carga tanto si la petición sale bien como si falla",
          "Porque `finally` repite la petición si falla"
        ],
        "answer": 2,
        "why": "`finally` se ejecuta siempre. Si `setLoading(false)` solo estuviera en el `try`, un error dejaría la pantalla en «Cargando…» para siempre."
      }
    ],
    "10": [
      {
        "id": "routing-11",
        "type": "mc",
        "q": "Para la URL `/tasks/7` y `path=\"/tasks/:id\"`, ¿qué es `useParams()`?",
        "choices": [
          "`{ id: 7 }`",
          "`'7'`",
          "`['7']`",
          "`{ id: '7' }`"
        ],
        "answer": 3,
        "why": "Un objeto con una clave por parámetro; los valores son cadenas, porque las URLs son texto."
      }
    ]
  },
  "quizzes": {
    "dom": {
      "name": "Quiz DOM",
      "short": "DOM",
      "title": "Manipulación del DOM",
      "lab": null,
      "sessions": "10-11",
      "questions": [
        {
          "id": "dom-01",
          "type": "mc",
          "q": "Un script añade tres elementos `<li>` a una lista. ¿Dónde se pueden ver?",
          "choices": [
            "En Ver código fuente",
            "En el archivo `.html` del disco",
            "En el panel Elements de DevTools",
            "En ningún sitio hasta que se guarde la página"
          ],
          "answer": 2,
          "why": "JavaScript cambia el DOM, el árbol vivo en memoria, que es lo que muestra el panel Elements. Ver código fuente y el archivo muestran el HTML original."
        },
        {
          "id": "dom-04",
          "type": "mc",
          "q": "¿Qué llamada encuentra el elemento `<button id=\"save\">`?",
          "choices": [
            "`document.getElementById('#save')`",
            "`document.querySelector('save')`",
            "`document.querySelectorAll('.save')`",
            "`document.querySelector('#save')`"
          ],
          "answer": 3,
          "why": "`querySelector` recibe un selector CSS, así que un id necesita `#`. `getElementById` recibe el id sin más (`'save'`); `'save'` solo, como selector, significa una etiqueta `<save>`."
        },
        {
          "id": "dom-05",
          "type": "mc",
          "q": "¿Qué devuelve `document.querySelector('.missing')` cuando ningún elemento tiene esa clase?",
          "choices": [
            "Una NodeList vacía",
            "`null`",
            "`undefined`",
            "Lanza un error"
          ],
          "answer": 1,
          "why": "Los métodos que devuelven un solo elemento devuelven `null` cuando no hay coincidencias; el error solo llega después, cuando se usa el `null` como si fuera un elemento."
        },
        {
          "id": "dom-07",
          "type": "mc",
          "q": "`app.js` se carga con un `<script src=\"app.js\">` normal en el `<head>` y llama a `document.querySelector('#list').append(li)`. Falla con \"Cannot read properties of null\". ¿Cuál es el arreglo más sencillo?",
          "choices": [
            "Usar `getElementById` en su lugar",
            "Envolver el código en un bucle `for`",
            "Añadir `defer` a la etiqueta script",
            "Cambiar `#list` por `.list`"
          ],
          "answer": 2,
          "why": "El script se ejecuta antes de que se analice el body, así que `#list` todavía no existe. `defer` lo ejecuta después de analizar el HTML."
        },
        {
          "id": "dom-09",
          "type": "mc",
          "q": "Un usuario escribe `<b>hi</b>` como apodo. ¿Qué línea muestra exactamente esos caracteres, de forma segura?",
          "choices": [
            "`el.innerHTML = nickname`",
            "`el.textContent = nickname`",
            "`el.outerHTML = nickname`",
            "`el.innerHTML += nickname`"
          ],
          "answer": 1,
          "why": "`textContent` inserta texto plano; las variantes de `innerHTML` lo analizan como HTML, lo que aquí muestra texto en negrita y con un apodo malicioso ejecuta código."
        },
        {
          "id": "dom-12",
          "type": "mc",
          "q": "Un elemento tiene `class=\"task urgent\"`. ¿Qué línea lo marca como hecho **y conserva** sus otras clases?",
          "choices": [
            "`el.className = 'done'`",
            "`el.setAttribute('class', 'done')`",
            "`el.style = 'done'`",
            "`el.classList.add('done')`"
          ],
          "answer": 3,
          "why": "`classList.add` toca solo una clase. `className` y `setAttribute('class', …)` sustituyen la cadena de clases entera."
        },
        {
          "id": "dom-14",
          "type": "mc",
          "q": "Dado `<li data-price=\"12\">`, ¿cuánto vale `li.dataset.price + 1`?",
          "choices": [
            "`'121'`",
            "`13`",
            "`NaN`",
            "`undefined`"
          ],
          "answer": 0,
          "why": "Los valores de los atributos son siempre cadenas, así que `+` concatena. Hay que convertir primero: `Number(li.dataset.price) + 1`."
        },
        {
          "id": "dom-16",
          "type": "tf",
          "q": "Después de `const p = document.createElement('p'); p.textContent = 'Hi';` el párrafo ya es visible en la página.",
          "choices": [
            "Verdadero",
            "Falso"
          ],
          "answer": 1,
          "why": "Un elemento creado está suelto hasta que se une a un padre de la página, por ejemplo con `document.body.append(p)`."
        },
        {
          "id": "dom-21",
          "type": "mc",
          "q": "¿Qué línea registra `save` para que se ejecute en cada clic de `btn`?",
          "choices": [
            "`btn.addEventListener('click', save)`",
            "`btn.addEventListener('click', save())`",
            "`btn.addEventListener(click, save)`",
            "`btn.click(save)`"
          ],
          "answer": 0,
          "why": "La función se pasa como valor. `save()` la llama en el acto y registra su valor de retorno; `click` sin comillas es una variable no definida."
        },
        {
          "id": "dom-22",
          "type": "mc",
          "q": "¿Qué evento se dispara en un `<input>` de texto con **cada** pulsación que cambia su valor?",
          "choices": [
            "`change`",
            "`submit`",
            "`input`",
            "`load`"
          ],
          "answer": 2,
          "why": "`input` se dispara con cada cambio; `change` espera a que el usuario confirme el valor (por ejemplo, al salir del campo)."
        },
        {
          "id": "dom-25",
          "type": "mc",
          "q": "Un formulario de tareas añade un elemento y el elemento desaparece una fracción de segundo después. ¿Qué falta?",
          "choices": [
            "`e.stopPropagation()` en el manejador de submit",
            "Un atributo `defer`",
            "`e.preventDefault()` en el manejador de submit",
            "`type=\"button\"` en el input"
          ],
          "answer": 2,
          "why": "Sin `preventDefault()` el formulario se envía de verdad y la página se recarga, borrando lo que añadió JavaScript."
        },
        {
          "id": "dom-26",
          "type": "tf",
          "q": "Escuchar `submit` en el formulario (en lugar de `click` en su botón) también cubre el caso de que el usuario pulse Intro en el campo de texto.",
          "choices": [
            "Verdadero",
            "Falso"
          ],
          "answer": 0,
          "why": "Pulsar Intro en un campo de texto provoca un envío implícito, que dispara `submit` en el formulario, así que un solo listener cubre el botón y la tecla Intro."
        },
        {
          "id": "js-mx403",
          "type": "mc",
          "q": "En el manejador del evento `submit` de un formulario, ¿para qué se llama a `event.preventDefault()`?",
          "choices": [
            "Para evitar que el navegador envíe el formulario y recargue la página",
            "Para vaciar los campos del formulario",
            "Para impedir que se ejecuten otros manejadores del mismo evento",
            "Para validar los campos marcados como `required`"
          ],
          "answer": 0,
          "why": "Por defecto, enviar un formulario recarga la página. `preventDefault` cancela ese comportamiento para gestionar el envío con JavaScript."
        },
        {
          "id": "js-mx603",
          "type": "mc",
          "q": "Para mostrar en un elemento el texto que ha escrito un usuario, ¿por qué es preferible `textContent` a `innerHTML`?",
          "choices": [
            "Porque `textContent` es más rápido de escribir",
            "Porque `textContent` inserta el texto tal cual, sin interpretarlo como HTML",
            "Porque `innerHTML` no funciona con texto",
            "Porque `textContent` aplica estilos automáticamente"
          ],
          "answer": 1,
          "why": "Con `innerHTML`, un texto con etiquetas se interpretaría como HTML, lo que permite inyectar contenido o código. `textContent` lo muestra literalmente."
        }
      ]
    },
    "context": {
      "name": "Quiz Context API",
      "short": "CTX",
      "title": "Estado compartido y Context API",
      "lab": null,
      "sessions": "37-38",
      "questions": [
        {
          "id": "ctx-01",
          "type": "mc",
          "q": "¿Cuáles son las tres piezas de la Context API?",
          "choices": [
            "`useState`, `useEffect` y `useContext`",
            "`createContext`, un Provider que guarda el valor y `useContext` para leerlo",
            "`BrowserRouter`, `Routes` y `Route`",
            "`localStorage`, `sessionStorage` y las cookies"
          ],
          "answer": 1,
          "why": "`createContext` crea el Context; el Provider guarda el valor y envuelve a los componentes que pueden leerlo; `useContext` lo lee desde cualquier componente de dentro."
        },
        {
          "id": "ctx-02",
          "type": "mc",
          "q": "En la aplicación del curso, ¿dónde se coloca `AuthProvider`?",
          "choices": [
            "Dentro de cada componente que necesita la sesión",
            "Fuera de `BrowserRouter`, envolviendo solo a `NavBar`",
            "Dentro de `BrowserRouter`, envolviendo a `App`",
            "En `index.html`, como una etiqueta más"
          ],
          "answer": 2,
          "why": "Va dentro del router para poder usar la navegación, y envuelve a `App` para que el menú, el login y las rutas protegidas puedan leer la sesión."
        },
        {
          "id": "state-mx409",
          "type": "mc",
          "q": "¿Qué problema resuelve la Context API de React?",
          "choices": [
            "Guardar los datos de la aplicación en el servidor",
            "Hacer llegar un dato a componentes lejanos sin pasarlo por props a través de todos los intermedios (*prop drilling*)",
            "Sustituir a `useState` en todos los componentes",
            "Acelerar el renderizado de listas largas"
          ],
          "answer": 1,
          "why": "Context coloca un dato en un Provider y cualquier componente de dentro lo lee con `useContext`. Evita el *prop drilling*: pasar un dato por componentes que no lo usan."
        },
        {
          "id": "state-mx509",
          "type": "mc",
          "q": "El Context se creó con `createContext(null)`. ¿Qué recibe `useContext(AuthContext)` en un componente que está **fuera** de `AuthProvider`?",
          "choices": [
            "El valor del Provider, porque Context es global",
            "`null`, el valor por defecto, y la aplicación falla al leer sus propiedades",
            "Un error de compilación de Vite",
            "`undefined` solo en el primer renderizado y después el valor correcto"
          ],
          "answer": 1,
          "why": "Solo los componentes que están dentro del Provider reciben su valor. Fuera, `useContext` devuelve el valor por defecto de `createContext`, aquí `null`."
        },
        {
          "id": "ctx-03",
          "type": "tf",
          "q": "Cuando cambia el valor de un Context, se vuelven a renderizar los componentes que lo leen.",
          "choices": [
            "Verdadero",
            "Falso"
          ],
          "answer": 0,
          "why": "Por eso Context sirve para datos que cambian poco, como la sesión, y no para datos que cambian muy a menudo."
        },
        {
          "id": "ctx-04",
          "type": "mc",
          "q": "¿Por qué `AuthProvider` inicializa el token con `useState(localStorage.getItem(\"token\"))`?",
          "choices": [
            "Para que la sesión se mantenga al recargar la página",
            "Porque `useState` no admite `null` como valor inicial",
            "Para enviar el token al servidor en cada renderizado",
            "Para cifrar el token"
          ],
          "answer": 0,
          "why": "El estado de React se pierde al recargar. Guardar el token en `localStorage` al iniciar sesión y leerlo al crear el estado permite recuperar la sesión."
        },
        {
          "id": "ctx-05",
          "type": "mc",
          "q": "En `export const useAuth = () => useContext(AuthContext);`, ¿qué es `useAuth`?",
          "choices": [
            "Un componente que dibuja el formulario de login",
            "Un atajo para leer el valor de `AuthContext` desde cualquier componente de dentro del Provider",
            "Una función que llama a la API de login",
            "Un segundo Context, independiente del primero"
          ],
          "answer": 1,
          "why": "Es un hook propio de una línea: evita importar `useContext` y `AuthContext` en cada componente que necesita la sesión."
        },
        {
          "id": "state-mx609",
          "type": "mc",
          "q": "Dos componentes hermanos, `SearchInput` y `TaskList`, necesitan el mismo término de búsqueda. ¿Qué solución es la recomendada en el curso?",
          "choices": [
            "Que cada uno tenga su propio `useState` y sincronizarlos con `useEffect`",
            "Guardar el término en una variable global de JavaScript",
            "Subir el estado al padre común y pasar el valor y la función para cambiarlo por props",
            "Guardar el término en `localStorage` y leerlo en cada renderizado"
          ],
          "answer": 2,
          "why": "Es *lifting state*: el padre es la única fuente de verdad, pasa el dato a los hijos y les da una función para cambiarlo. Los datos bajan y los eventos suben."
        },
        {
          "id": "ctx-06",
          "type": "mc",
          "q": "Un dato solo lo comparten un componente y su hermano, dentro del mismo padre. ¿Qué solución es la más sencilla?",
          "choices": [
            "Crear un Context para ese dato",
            "Subir el estado al padre y pasarlo por props",
            "Guardarlo en `localStorage`",
            "Duplicar el estado en los dos componentes"
          ],
          "answer": 1,
          "why": "Context es para datos que llegan lejos o que usan muchos componentes. Para componentes cercanos basta con subir el estado al padre común."
        },
        {
          "id": "ctx-07",
          "type": "tf",
          "q": "Lo recomendable es crear un único Context con todo el estado de la aplicación.",
          "choices": [
            "Verdadero",
            "Falso"
          ],
          "answer": 1,
          "why": "Se crea un Context por asunto (la sesión, el tema, el idioma). Meterlo todo en uno hace que cualquier cambio vuelva a renderizar a todos los componentes que lo leen."
        },
        {
          "id": "ctx-08",
          "type": "mc",
          "q": "Un componente `Protected` lee `isLoggedIn` con `useAuth()`. Si es `false`, ¿qué devuelve?",
          "choices": [
            "`null`, y la página se queda en blanco",
            "Un `<Navigate to=\"/login\" />` para redirigir al login",
            "Un error que detiene la aplicación",
            "Los `children` igualmente, sin comprobar nada"
          ],
          "answer": 1,
          "why": "Una ruta protegida muestra su contenido si hay sesión y, si no, redirige al login con el componente `Navigate` de React Router."
        }
      ]
    },
    "arch-api": {
      "name": "Quiz Arquitectura del backend",
      "short": "API",
      "title": "Arquitectura del backend: capas, middleware y códigos HTTP",
      "lab": null,
      "sessions": "13-27",
      "questions": [
        {
          "id": "arch-04",
          "type": "mc",
          "q": "¿Qué capa de la API es la única que ejecuta SQL?",
          "choices": [
            "Las rutas (`routes/`)",
            "Los controladores (`controllers/`)",
            "Los middleware (`middleware/`)",
            "Los modelos (`models/`)"
          ],
          "answer": 3,
          "why": "El modelo es la única capa que habla con los datos y devuelve datos, nunca respuestas HTTP. Por eso cambiar el almacenamiento solo obliga a reescribir `models/`."
        },
        {
          "id": "arch-05",
          "type": "mc",
          "q": "¿Por qué `app.use(express.json())` se registra antes de las rutas?",
          "choices": [
            "Porque Express solo admite un middleware antes de las rutas",
            "Para que `req.body` ya esté analizado cuando lo lean la validación y el controlador",
            "Para que las respuestas se envíen en formato JSON",
            "Para que la base de datos acepte el cuerpo de la petición"
          ],
          "answer": 1,
          "why": "Express ejecuta los middleware en el orden en que se declaran. Si `express.json()` fuera después de las rutas, estas recibirían `req.body` como `undefined`."
        },
        {
          "id": "arch-06",
          "type": "mc",
          "q": "Con `router.post(\"/\", requireAuth, validateItem, controller.create)`, llega una petición **sin token** y con el cuerpo vacío. ¿Qué responde la API?",
          "choices": [
            "`400`, porque el cuerpo no supera la validación",
            "`201`, porque el controlador crea el elemento igualmente",
            "`401`, porque `requireAuth` corta la petición antes de validar",
            "`500`, porque falta `req.user`"
          ],
          "answer": 2,
          "why": "Los middleware se ejecutan en orden. `requireAuth` responde `401` y no llama a `next()`, así que la validación y el controlador no llegan a ejecutarse."
        },
        {
          "id": "arch-07",
          "type": "mc",
          "q": "¿Por qué el manejador de errores `(err, req, res, next)` se registra el último?",
          "choices": [
            "Porque solo recibe los errores de lo que se ha declarado antes que él",
            "Porque Express lo ejecuta siempre al final de cada petición, haya error o no",
            "Porque así se ejecuta antes que `express.json()`",
            "Porque debe estar después de `app.listen`"
          ],
          "answer": 0,
          "why": "Express lo reconoce por sus cuatro parámetros y le pasa los errores de los middleware y las rutas anteriores. Registrado antes de las rutas, no recibiría sus errores."
        },
        {
          "id": "arch-08",
          "type": "mc",
          "q": "El middleware de validación con Zod recibe un cuerpo que no cumple el esquema. ¿Qué código devuelve?",
          "choices": [
            "`401 Unauthorized`",
            "`400 Bad Request`",
            "`404 Not Found`",
            "`500 Internal Server Error`"
          ],
          "answer": 1,
          "why": "Datos de entrada incorrectos son un error del cliente: `400`. El middleware responde y no llama a `next()`, así que el controlador solo recibe datos válidos."
        },
        {
          "id": "arch-09",
          "type": "mc",
          "q": "Un usuario con token válido intenta borrar una tarea que pertenece a otro usuario. ¿Qué capa decide responder `403`?",
          "choices": [
            "El modelo, porque es quien consulta la tabla",
            "El middleware de autenticación",
            "El controlador, comparando `req.user` con el propietario de la tarea",
            "El middleware `cors`"
          ],
          "answer": 2,
          "why": "La autenticación solo dice quién es (`401` si falla). Decidir si puede hacer la operación es autorización, y la toma el controlador con los datos que le devuelve el modelo."
        },
        {
          "id": "arch-10",
          "type": "mc",
          "q": "El modelo no encuentra la fila pedida en `GET /tasks/9`. ¿Qué ocurre?",
          "choices": [
            "El modelo responde `404` directamente",
            "PostgreSQL devuelve un error y la API responde `500`",
            "El modelo devuelve `undefined` (o `null`) y el controlador responde `404`",
            "Express responde `404` porque la ruta no existe"
          ],
          "answer": 2,
          "why": "El modelo devuelve datos, nunca respuestas HTTP. Convertir «no hay fila» en un `404` es trabajo del controlador."
        },
        {
          "id": "arch-11",
          "type": "mc",
          "q": "El modelo falla porque se ha caído la conexión con PostgreSQL. ¿Qué recibe el cliente?",
          "choices": [
            "Un `500` con un mensaje genérico, enviado por el manejador de errores",
            "El texto completo del error de PostgreSQL",
            "Un `401`, porque la sesión deja de ser válida",
            "Un `404`, porque no hay datos"
          ],
          "answer": 0,
          "why": "El error llega al manejador de errores, que lo registra en el servidor y responde `500` sin detalles internos. Enviar trazas o consultas al navegador es un riesgo de seguridad."
        },
        {
          "id": "arch-18",
          "type": "mc",
          "q": "¿Qué ventaja tiene separar la API en rutas, controladores y modelos?",
          "choices": [
            "Que la API ocupa menos memoria",
            "Que se puede prescindir de los middleware",
            "Que cada capa tiene una responsabilidad: cambiar el almacenamiento solo obliga a reescribir los modelos",
            "Que el cliente puede llamar directamente a los modelos"
          ],
          "answer": 2,
          "why": "Las rutas asocian URL y controlador; el controlador decide la respuesta; el modelo habla con los datos. Así se pasó del array en memoria de L5 a PostgreSQL en L6 sin tocar rutas ni controladores."
        }
      ]
    },
    "arch": {
      "name": "Quiz Arquitectura cliente-servidor",
      "short": "ARQ",
      "title": "Arquitectura cliente-servidor: cómo encaja todo",
      "lab": null,
      "sessions": "repaso transversal",
      "questions": [
        {
          "id": "arch-01",
          "type": "mc",
          "q": "En la Práctica 2, ¿qué parte de la aplicación se ejecuta en el navegador del usuario?",
          "choices": [
            "Las rutas y los controladores de Express",
            "El cliente de React: componentes, estado y peticiones con Axios",
            "Las consultas a PostgreSQL con `pg`",
            "La firma del JWT con `jwt.sign`"
          ],
          "answer": 1,
          "why": "El navegador descarga y ejecuta el cliente de React (`client/`). Express, `pg`, `jwt.sign` y `jwt.verify` se ejecutan en el servidor (`api/`), en Node.js."
        },
        {
          "id": "arch-02",
          "type": "mc",
          "q": "¿Dónde se ejecuta `jwt.verify` cuando llega una petición protegida?",
          "choices": [
            "En el interceptor de Axios, antes de enviar la petición",
            "En PostgreSQL, al consultar la tabla `users`",
            "En el servidor, dentro del middleware de autenticación",
            "En `AuthContext`, al leer el token de `localStorage`"
          ],
          "answer": 2,
          "why": "Solo el servidor conoce `JWT_SECRET`, así que solo él puede comprobar la firma. El cliente guarda y envía el token, pero no lo verifica."
        },
        {
          "id": "arch-03",
          "type": "mc",
          "q": "Un usuario escribe el nombre de un elemento y pulsa «Añadir». ¿Cuál es el recorrido correcto?",
          "choices": [
            "Estado de React → Axios (`POST`) → ruta de Express → middleware → controlador → modelo con `pg` → PostgreSQL → respuesta → estado → render",
            "Estado de React → modelo con `pg` → PostgreSQL → render, sin pasar por Express",
            "Ruta de Express → estado de React → Axios → PostgreSQL → controlador",
            "Axios → PostgreSQL → Express → React, porque la base de datos responde primero"
          ],
          "answer": 0,
          "why": "El cliente nunca habla con la base de datos: envía una petición HTTP a la API, la API atraviesa su cadena hasta el modelo, que consulta PostgreSQL, y la respuesta vuelve al cliente, que actualiza el estado y React vuelve a renderizar."
        },
        {
          "id": "arch-12",
          "type": "mc",
          "q": "¿Por qué un formulario se valida en el cliente y también en el servidor?",
          "choices": [
            "Porque Zod solo funciona en el servidor",
            "Porque la validación del cliente sustituye a la del servidor en producción",
            "En el cliente, para avisar al usuario al momento; en el servidor, porque cualquiera puede llamar a la API sin pasar por la interfaz",
            "Para que PostgreSQL no tenga que comprobar los tipos"
          ],
          "answer": 2,
          "why": "La validación del cliente mejora la experiencia, pero no protege nada: una petición con `curl` se la salta. La del servidor es obligatoria."
        },
        {
          "id": "arch-13",
          "type": "mc",
          "q": "Tras el login, ¿cómo llega el token a cada petición protegida en la Práctica 2?",
          "choices": [
            "El servidor lo recuerda en memoria y lo asocia a cada petición",
            "Se envía en la URL como parámetro de consulta",
            "El navegador lo envía solo, en una cookie",
            "El cliente lo guarda en `localStorage` y un interceptor de Axios lo añade en `Authorization: Bearer <token>`"
          ],
          "answer": 3,
          "why": "`signIn` guarda el token que devuelve `/auth/login`. El interceptor de petición de `services/api.js` lo lee y lo añade a la cabecera; el servidor no guarda el JWT."
        },
        {
          "id": "arch-14",
          "type": "mc",
          "q": "En el controlador de una ruta protegida, ¿qué es `req.user` y de dónde sale?",
          "choices": [
            "El cuerpo de la petición, que envía el cliente",
            "Un valor que el interceptor de Axios añade a la petición",
            "Una fila de la tabla `users` que carga Express automáticamente",
            "El contenido del token, que el middleware de autenticación guarda tras verificarlo"
          ],
          "answer": 3,
          "why": "`requireAuth` verifica el token con `jwt.verify` y guarda su *payload* en `req.user`. El controlador se fía de ese dato porque está firmado por el servidor, no de lo que mande el cliente."
        },
        {
          "id": "arch-15",
          "type": "mc",
          "q": "La API responde `401` a una petición autenticada porque el token ha caducado. ¿Qué hace el cliente de la Práctica 2?",
          "choices": [
            "El interceptor de respuesta borra el token y lleva al usuario al login",
            "Axios repite la petición hasta que funciona",
            "React renueva el token sin avisar",
            "La API devuelve un token nuevo en la misma respuesta"
          ],
          "answer": 0,
          "why": "Cuando el token caduca, `jwt.verify` falla y la API responde `401`. El interceptor de respuesta de `services/api.js` elimina el token y redirige a `/login` para iniciar sesión de nuevo."
        },
        {
          "id": "arch-16",
          "type": "mc",
          "q": "¿Por qué la API necesita `cors({ origin: process.env.CLIENT_ORIGIN })`?",
          "choices": [
            "Para cifrar las peticiones entre el cliente y la API",
            "Porque el cliente (`localhost:5173`) y la API (`localhost:3000`) son orígenes distintos y el navegador bloquea la respuesta si la API no lo autoriza",
            "Para que la API pueda conectarse a PostgreSQL",
            "Para que Express acepte cuerpos en formato JSON"
          ],
          "answer": 1,
          "why": "Por la política de mismo origen, el navegador solo entrega a la página las respuestas de otro origen si el servidor lo permite con las cabeceras CORS."
        },
        {
          "id": "arch-17",
          "type": "mc",
          "q": "Falta la configuración de CORS en la API. ¿Dónde se ve el error?",
          "choices": [
            "En la consola del navegador: la petición llega a la API, pero el navegador descarta la respuesta",
            "En la terminal de la API, como un error de Express",
            "En PostgreSQL, como una consulta rechazada",
            "En ningún sitio: la petición funciona igual"
          ],
          "answer": 0,
          "why": "CORS lo aplica el navegador, no el servidor. La API puede haber respondido bien; es el navegador quien impide que el código del cliente lea la respuesta."
        },
        {
          "id": "arch-19",
          "type": "mc",
          "q": "Después de `const response = await api.post(\"/items\", { name })`, ¿qué hace que el elemento nuevo aparezca en la lista?",
          "choices": [
            "Que PostgreSQL actualiza la pantalla al insertar la fila",
            "Que el componente guarda los datos con su *setter* de estado y React vuelve a renderizar",
            "Que Axios modifica el DOM con la respuesta",
            "Que Express envía el HTML de la lista actualizada"
          ],
          "answer": 1,
          "why": "La API solo devuelve datos JSON. El cliente actualiza su estado con un valor nuevo (por ejemplo, un array nuevo con el elemento) y React vuelve a pintar el componente."
        },
        {
          "id": "arch-20",
          "type": "mc",
          "q": "En la Práctica 2, ¿qué fichero crea el cliente de Axios con la dirección base de la API?",
          "choices": [
            "`api/src/app.js`",
            "`api/src/db.js`",
            "`client/src/main.jsx`",
            "`client/src/services/api.js`"
          ],
          "answer": 3,
          "why": "`client/src/services/api.js` crea el cliente con `axios.create({ baseURL: import.meta.env.VITE_API_URL })` y define los interceptores del token y del `401`. `api/src/db.js` crea la conexión de `pg` con PostgreSQL."
        }
      ]
    }
  },
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
  ]
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
