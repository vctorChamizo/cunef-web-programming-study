'use strict';
// Modo «Explicar el código» de los ejercicios prácticos. Escrito a mano; canónico en este repositorio.
// Por cada ejercicio de código: enunciado, preguntas (texto inicial del recuadro), respuesta de referencia,
// pistas y criterios de corrección sobre 10. El código mostrado sale de exercises.js: en los de corrección
// de errores, solo el código con el fallo; en el resto, también la versión completada (solution.code).
window.EXPLAIN = {
  "A1": {
    "statement": "Una aplicación guarda los usuarios en un array de objetos. La función `getActiveNames` debe devolver **solo los nombres** de los usuarios activos, pero al ejecutarla aparece `[ undefined, undefined ]`.\n\nNo hay que modificar el código: se pide **explicar el error** respondiendo a las cuatro preguntas del recuadro. La corrección se describe con palabras, sin escribir código.",
    "questions": "1. ¿En qué expresión está el error? ¿Funciona bien el filter?\n\n2. ¿Por qué el resultado es [ undefined, undefined ] y no los nombres?\n\n3. ¿Qué cambio corrige el error y por qué funciona?\n\n4. ¿Qué diferencia hay entre una función flecha con el cuerpo entre llaves y una sin llaves?\n",
    "answer": "1. El error está en el callback de map: (user) => { user.name; }. El filter funciona bien y deja pasar a Ana y a Marta.\n\n2. map construye un array nuevo con lo que devuelve el callback para cada elemento. El callback tiene el cuerpo entre llaves y no tiene return, así que devuelve undefined; como llegan dos usuarios activos, el resultado tiene dos undefined.\n\n3. Hacer que el callback devuelva user.name: quitar las llaves para que la función flecha devuelva la expresión, o mantenerlas y añadir return. Así map recoge los nombres y devuelve [ \"Ana\", \"Marta\" ] sin modificar users.\n\n4. Sin llaves, la función flecha devuelve directamente el valor de la expresión. Con llaves, el cuerpo es un bloque y solo devuelve algo si se escribe return; si no, devuelve undefined.",
    "hints": [
      "Revisar qué hace cada uno de los dos métodos encadenados y cuál de ellos produce el array final.",
      "Comparar cómo está escrito el callback de `filter` y cómo el de `map`: ¿qué diferencia hay en su forma?"
    ],
    "rubric": [
      {
        "text": "Pregunta 1: el error está en el callback de `map`, no en `filter`",
        "points": 2
      },
      {
        "text": "Pregunta 2: el callback no devuelve nada (`undefined`) y `map` guarda un valor por cada usuario activo",
        "points": 3
      },
      {
        "text": "Pregunta 3: devolver `user.name`, quitando las llaves o añadiendo `return`",
        "points": 3
      },
      {
        "text": "Pregunta 4: retorno directo sin llaves frente a bloque que necesita `return`",
        "points": 2
      }
    ],
    "penalties": [
      "Situar el error en `filter`: -1.",
      "Proponer como corrección un bucle que modifica el array `users`: -1."
    ],
    "partial": "En la pregunta 2, si se indica que el callback no devuelve nada pero no se explica por qué aparecen exactamente dos `undefined`, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 son igual de válidas las dos correcciones: quitar las llaves o mantenerlas y añadir `return`."
  },
  "A2": {
    "statement": "Una API de tareas tiene el endpoint `GET /tasks/:id`. Cuando la tarea existe funciona bien, pero cuando no existe responde `200` con el cuerpo `null`. Un cliente no puede distinguir así entre «la tarea existe» y «no existe». Lo esperado es que, si la tarea no existe, responda `404` con el cuerpo `{ \"error\": \"Task not found\" }`.\n\nNo hay que modificar el código: se pide **explicar el error** respondiendo a las cuatro preguntas del recuadro. La corrección se describe con palabras, sin escribir código.",
    "questions": "1. ¿Qué devuelve findById cuando no existe ninguna tarea con ese id, y qué línea del controlador no lo tiene en cuenta?\n\n2. ¿Por qué el cliente recibe 200 con el cuerpo null en lugar de un error?\n\n3. ¿Qué cambio corrige el endpoint? ¿Dónde debe hacerse, en el modelo o en el controlador?\n\n4. ¿Por qué hace falta un return (o un else) en la respuesta 404? ¿Qué ocurriría sin él?\n",
    "answer": "1. findById devuelve null: rows[0] es undefined porque la consulta no encuentra filas, y el operador ?? lo sustituye por null. La línea res.status(200).json(task) responde siempre igual, exista o no la tarea.\n\n2. El controlador no comprueba el resultado y null es un JSON válido, así que Express envía 200 con null como cuerpo. Nada en el código traduce «no hay resultado» a un código de error.\n\n3. En el controlador, antes de responder: comprobar si task es null y, en ese caso, responder 404 con { error: \"Task not found\" }; si existe, mantener la respuesta 200 con la tarea. El modelo es correcto y no conoce res, así que no puede elegir el código HTTP.\n\n4. Sin return, la ejecución continúa después de enviar el 404 y llega a la respuesta 200, de modo que Express intenta enviar una segunda respuesta y se produce el error Cannot set headers after they are sent. El return (o un else) garantiza una sola respuesta por petición.",
    "hints": [
      "Seguir el caso `GET /tasks/999`: qué devuelve la consulta, qué devuelve `findById` y qué llega a `res.json`.",
      "Pensar qué ocurre en Express si un controlador intenta responder dos veces a la misma petición."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: `findById` devuelve `null` y el controlador responde sin comprobarlo",
        "points": 2
      },
      {
        "text": "Pregunta 2: `null` es un JSON válido y nadie traduce la ausencia de resultado a un código HTTP",
        "points": 2.5
      },
      {
        "text": "Pregunta 3: comprobar `task` en el controlador y responder `404` con `{ error: \"Task not found\" }`, manteniendo el `200` cuando existe",
        "points": 3
      },
      {
        "text": "Pregunta 4: sin `return` se intentaría una segunda respuesta (*Cannot set headers after they are sent*)",
        "points": 2.5
      }
    ],
    "penalties": [
      "Proponer que el modelo responda o elija el código HTTP: -1, porque el modelo no conoce `res`.",
      "Proponer 400 o 500 en lugar de 404: -1."
    ],
    "partial": "En la pregunta 3, si se propone responder 404 pero no se indica el cuerpo `{ error: \"Task not found\" }`, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 vale comprobar `!task` o `task === null`; en la pregunta 4, usar `return` o poner la respuesta correcta en un `else`."
  },
  "A3": {
    "statement": "En una API de tareas, `POST /tasks` inserta la tarea en PostgreSQL y debe devolver la fila creada. La tarea se guarda bien en la base de datos, pero el cliente recibe `201` con el cuerpo `{}` en lugar de la tarea. El modelo es correcto.\n\nNo hay que modificar el código: se pide **explicar el error** respondiendo a las cuatro preguntas del recuadro. La corrección se describe con palabras, sin escribir código.",
    "questions": "1. ¿En qué línea del controlador está el error?\n\n2. ¿Qué valor tiene task en esa línea y por qué el cliente recibe {}?\n\n3. Si el controlador está mal, ¿por qué la tarea sí aparece guardada en la base de datos?\n\n4. ¿Qué cambio corrige el error y por qué createTask puede usarlo sin más cambios?\n",
    "answer": "1. En const task = tasksModel.create(title);: se llama a create sin await.\n\n2. create es una función async, así que al llamarla devuelve inmediatamente una promesa pendiente, no la fila. El controlador envía esa promesa con res.json, y una promesa se convierte en {} al pasarla a JSON.\n\n3. Llamar a create pone en marcha la consulta INSERT aunque el controlador no espere su resultado. La inserción se completa en la base de datos, pero la respuesta ya se ha enviado sin la fila.\n\n4. Añadir await delante de tasksModel.create(title): el controlador espera a que la consulta termine y recibe la fila que devuelve RETURNING. createTask ya está declarada como async, que es lo que permite usar await dentro de ella.",
    "hints": [
      "Revisar qué devuelve una función declarada con `async` en el momento en que se la llama.",
      "Comparar cómo se llama a `db.query` dentro del modelo y cómo se llama a `create` dentro del controlador."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: la llamada a `tasksModel.create(title)` sin `await`",
        "points": 2
      },
      {
        "text": "Pregunta 2: `task` es una promesa pendiente y una promesa se convierte en `{}` en JSON",
        "points": 3
      },
      {
        "text": "Pregunta 3: la consulta se lanza igualmente y la inserción se completa, aunque nadie espere el resultado",
        "points": 2
      },
      {
        "text": "Pregunta 4: añadir `await`, que espera la fila de `RETURNING`, y `createTask` ya es `async`",
        "points": 3
      }
    ],
    "penalties": [
      "Situar el error en el modelo o en la consulta SQL: -1.",
      "Afirmar que `task` vale `undefined` en lugar de una promesa: -1."
    ],
    "partial": "En la pregunta 4, si se indica añadir `await` pero no se explica qué se obtiene ni por qué `createTask` puede usarlo, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 2 vale decir que la promesa «no está resuelta» o «todavía no tiene el valor»."
  },
  "A4": {
    "statement": "Un componente muestra una lista de tareas. Al pulsar una tarea debería tacharse o destacharse, pero no ocurre nada en pantalla. Si se inspecciona el array con `console.log`, el valor de `done` sí ha cambiado.\n\nNo hay que modificar el código: se pide **explicar el error** respondiendo a las cuatro preguntas del recuadro. La corrección se describe con palabras, sin escribir código.",
    "questions": "1. ¿Qué líneas de toggle provocan el error?\n\n2. Si done cambia en el array, ¿por qué no se actualiza la pantalla?\n\n3. ¿Qué cambio corrige toggle y por qué hace que React vuelva a renderizar?\n\n4. ¿Qué significa tratar el estado como inmutable? ¿Por qué no basta con crear un array nuevo si se sigue modificando el objeto de la tarea?\n",
    "answer": "1. task.done = !task.done; modifica directamente el objeto que está en el estado, y setTasks(tasks); vuelve a pasar el mismo array.\n\n2. React compara el estado nuevo con el anterior por referencia. tasks es el mismo array que ya tenía, así que React considera que nada ha cambiado y no renderiza. El cambio existe en memoria, por eso lo muestra console.log, pero no llega a la pantalla.\n\n3. Pasar a setTasks un array nuevo creado con map, en el que la tarea pulsada se sustituye por un objeto nuevo con done invertido (copiando sus propiedades con spread) y las demás se conservan. Al recibir una referencia distinta, React detecta el cambio y renderiza de nuevo.\n\n4. Significa no modificar los valores del estado, sino crear copias con los cambios. Si el array es nuevo pero el objeto se modifica, se altera también el estado anterior, porque los dos arrays comparten los mismos objetos; el elemento que cambia debe ser también un objeto nuevo.",
    "hints": [
      "Revisar cómo decide React si el nuevo valor de un estado es distinto del anterior.",
      "Fijarse en qué array recibe `setTasks` y si es el mismo que ya estaba guardado en el estado."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: la mutación de `task.done` y `setTasks(tasks)` con el mismo array",
        "points": 2
      },
      {
        "text": "Pregunta 2: React compara por referencia, ve el mismo array y no renderiza",
        "points": 3
      },
      {
        "text": "Pregunta 3: array nuevo con `map` y objeto nuevo con `done` invertido para la tarea pulsada",
        "points": 3
      },
      {
        "text": "Pregunta 4: inmutabilidad: crear copias en lugar de modificar, también del objeto que cambia",
        "points": 2
      }
    ],
    "penalties": [
      "Atribuir el problema al `onClick` o a la función `() => toggle(task.id)`: -1.",
      "Afirmar que `setTasks` no llega a ejecutarse: -0,5."
    ],
    "partial": "En la pregunta 3, si se propone crear un array nuevo pero se sigue modificando el objeto original, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 también vale copiar el array y los objetos antes de cambiar `done` y llamar a `setTasks` con la copia, o usar la forma funcional `setTasks((prev) => prev.map(...))`."
  },
  "A5": {
    "statement": "La función `getInitials` debe devolver un array con las iniciales de cada nombre completo, en mayúsculas y separadas por un punto. Al ejecutarla aparece `undefined`.\n\nNo hay que modificar el código: se pide **explicar el error** respondiendo a las cuatro preguntas del recuadro. La corrección se describe con palabras, sin escribir código.",
    "questions": "1. ¿Qué expresión provoca el error? ¿Es correcto el código dentro del callback?\n\n2. ¿Por qué se muestra undefined si el callback sí devuelve las iniciales?\n\n3. ¿Qué cambio corrige la función y qué devuelve después?\n\n4. ¿Cuándo es adecuado usar forEach y cuándo map?\n",
    "answer": "1. names.forEach(...). El callback es correcto: separa nombre y apellido con split(\" \") y devuelve, por ejemplo, \"A.G\" para \"ana garcía\".\n\n2. forEach ejecuta el callback para cada elemento pero siempre devuelve undefined: los valores que devuelve el callback se pierden. getInitials devuelve directamente el resultado de forEach, es decir, undefined.\n\n3. Sustituir forEach por map, que recoge lo que devuelve el callback en un array nuevo de la misma longitud. La función devuelve [ \"A.G\", \"L.P\", \"M.R\" ].\n\n4. forEach sirve para ejecutar una acción por cada elemento cuando no se necesita un resultado, por ejemplo mostrarlo por consola. map se usa cuando se quiere obtener un array nuevo transformando cada elemento.",
    "hints": [
      "Revisar qué devuelve cada método de array, no solo qué hace con cada elemento.",
      "Probar mentalmente el callback con `\"ana garcía\"`: ¿qué devuelve? ¿Adónde va ese valor?"
    ],
    "rubric": [
      {
        "text": "Pregunta 1: el error está en `forEach`, no en el callback",
        "points": 2
      },
      {
        "text": "Pregunta 2: `forEach` siempre devuelve `undefined` y descarta lo que devuelve el callback",
        "points": 3
      },
      {
        "text": "Pregunta 3: sustituir `forEach` por `map` y el resultado `[ \"A.G\", \"L.P\", \"M.R\" ]`",
        "points": 3
      },
      {
        "text": "Pregunta 4: `forEach` para efectos sin resultado, `map` para obtener un array transformado",
        "points": 2
      }
    ],
    "penalties": [
      "Situar el error en `split` o en `toUpperCase`: -1.",
      "Afirmar que el `return` del callback hace salir de `getInitials`: -1."
    ],
    "partial": "En la pregunta 2, si se indica que `forEach` devuelve `undefined` pero no se explica qué ocurre con los valores que devuelve el callback, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 también vale crear un array vacío, hacer `push` dentro del `forEach` y devolver ese array al final."
  },
  "A6": {
    "statement": "El componente `ProductList` carga los productos de la API y los muestra. Funciona, pero la pestaña *Network* del navegador muestra que se envía `GET /products` una y otra vez, sin parar.\n\nNo hay que modificar el código: se pide **explicar el error** respondiendo a las cuatro preguntas del recuadro. La corrección se describe con palabras, sin escribir código.",
    "questions": "1. ¿Qué parte de la llamada a useEffect provoca las peticiones repetidas?\n\n2. ¿Qué ciclo se produce a partir del primer renderizado y por qué no se detiene?\n\n3. ¿Qué cambio corrige el error y por qué?\n\n4. ¿Qué diferencia hay entre no pasar segundo argumento a useEffect, pasar [] y pasar [id]?\n",
    "answer": "1. A useEffect solo se le pasa la función del efecto: falta el segundo argumento, el array de dependencias.\n\n2. Sin array de dependencias, el efecto se ejecuta después de cada renderizado. El efecto pide los productos y llama a setProducts con un array nuevo (response.data), lo que provoca otro renderizado, que vuelve a ejecutar el efecto: un bucle de peticiones.\n\n3. Añadir el array de dependencias vacío [] como segundo argumento de useEffect. Así el efecto solo se ejecuta al montar el componente: se envía una única petición y el renderizado que provoca setProducts ya no lanza otra.\n\n4. Sin segundo argumento, el efecto se ejecuta tras cada renderizado; con [], solo al montar el componente; con [id], al montar y cada vez que cambia id.",
    "hints": [
      "Revisar cuántos argumentos recibe `useEffect` y qué controla el segundo.",
      "Seguir el orden de los pasos: renderizado, efecto, `setProducts`... ¿qué ocurre a continuación?"
    ],
    "rubric": [
      {
        "text": "Pregunta 1: falta el array de dependencias de `useEffect`",
        "points": 2
      },
      {
        "text": "Pregunta 2: efecto tras cada renderizado, `setProducts` provoca otro renderizado y se repite",
        "points": 3
      },
      {
        "text": "Pregunta 3: añadir `[]` para que el efecto solo se ejecute al montar",
        "points": 3
      },
      {
        "text": "Pregunta 4: sin argumento, `[]` y `[id]`, con cuándo se ejecuta el efecto en cada caso",
        "points": 2
      }
    ],
    "penalties": [
      "Atribuir el bucle a `load` o a `async/await`: -1.",
      "Afirmar que con `[]` el efecto no se ejecuta nunca: -1."
    ],
    "partial": "En la pregunta 2, si se indica que el efecto se ejecuta tras cada renderizado pero no se relaciona con `setProducts`, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 4 vale cualquier variable como ejemplo de dependencia."
  },
  "A7": {
    "statement": "El endpoint `GET /users?email=...` busca un usuario por email. Funciona con emails normales, pero una auditoría ha detectado que es vulnerable a **inyección SQL**: con `?email=' OR '1'='1` devuelve el primer usuario de la tabla.\n\nNo hay que modificar el código: se pide **explicar el error** respondiendo a las cuatro preguntas del recuadro. La corrección se describe con palabras, sin escribir código.",
    "questions": "1. ¿Qué línea hace que el endpoint sea vulnerable?\n\n2. Con ?email=' OR '1'='1, ¿cómo queda el texto SQL y por qué el endpoint devuelve el primer usuario?\n\n3. ¿Qué cambio corrige la vulnerabilidad y por qué impide la inyección?\n\n4. Una vez corregido, ¿qué devuelve el endpoint con esa misma petición maliciosa y por qué?\n",
    "answer": "1. La consulta construida con una template literal que inserta ${email} dentro de las comillas del SQL: el texto que envía el cliente pasa a formar parte de la consulta.\n\n2. Queda SELECT id, email FROM users WHERE email = '' OR '1'='1'. La comilla del atacante cierra la cadena y OR '1'='1' es una condición siempre verdadera, así que la consulta devuelve todas las filas y el endpoint responde con rows[0], el primer usuario.\n\n3. Usar una consulta parametrizada: escribir el marcador $1 en el texto SQL y pasar [email] como segundo argumento de pool.query. pg envía el valor aparte del texto y PostgreSQL lo trata siempre como un dato, nunca como parte de la consulta.\n\n4. Devuelve null: el texto ' OR '1'='1 se compara entero como email, ningún usuario lo tiene, rows queda vacío y rows[0] ?? null da null. Con un email normal el comportamiento no cambia.",
    "hints": [
      "Escribir el texto SQL que resulta al sustituir `email` por el valor malicioso, carácter a carácter.",
      "Recordar la diferencia entre construir el SQL con el valor dentro y enviar el valor por separado."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: la interpolación de `email` en el texto SQL con la template literal",
        "points": 2
      },
      {
        "text": "Pregunta 2: el SQL resultante con `OR '1'='1'`, condición siempre verdadera, y por qué sale el primer usuario",
        "points": 3
      },
      {
        "text": "Pregunta 3: consulta parametrizada con `$1` y `[email]`; el valor se trata como dato",
        "points": 3
      },
      {
        "text": "Pregunta 4: devuelve `null` porque ningún email coincide con ese texto",
        "points": 2
      }
    ],
    "penalties": [
      "Proponer como corrección escapar las comillas a mano o validar el formato del email: -1.",
      "Confundir el marcador `$1` con la interpolación `${...}`: -1."
    ],
    "partial": "En la pregunta 2, si se explica que la condición es siempre verdadera pero no se muestra cómo queda el texto SQL, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 2 vale escribir el SQL resultante aproximado siempre que se vea la condición `OR '1'='1'`."
  },
  "B1": {
    "statement": "Una página tiene un formulario para añadir tareas a una lista. El script selecciona los elementos y registra el evento `submit`; se muestra el manejador original y, a continuación, la **versión completada**.\n\nNo hay que modificar el código: se pide **explicar la versión completada** respondiendo a las cuatro preguntas del recuadro.",
    "questions": "1. ¿Qué haría el navegador al enviar el formulario si no se llamara a event.preventDefault()? ¿Por qué es necesario en este manejador?\n\n2. Si el campo contiene solo espacios, ¿qué valor toma text? ¿Qué se ve en pantalla y por qué no se añade ningún elemento a la lista?\n\n3. Con el texto Comprar pan, ¿qué hacen, en orden, las tres líneas que crean y añaden el <li>? ¿Dónde aparece el nuevo elemento?\n\n4. ¿Por qué se asigna el texto con textContent y no con innerHTML?\n",
    "answer": "1. Por defecto, enviar un formulario hace que el navegador recargue la página (o navegue a la URL de action). Sin `preventDefault` la página se recargaría y se perdería la tarea añadida; con él, el envío se gestiona solo con JavaScript.\n\n2. `trim()` elimina los espacios, así que text es la cadena vacía \"\". Se cumple la condición del if: se muestra Escribe una tarea en #message y el return termina el manejador, de modo que no se llega a crear ni añadir el <li> (ni se limpian el mensaje y el campo).\n\n3. `document.createElement(\"li\")` crea un <li> vacío que aún no está en la página; `li.textContent = text` le pone el texto Comprar pan; `list.appendChild(li)` lo inserta como último hijo de #task-list. Después se vacía #message y el campo.\n\n4. `textContent` inserta el texto tal cual, sin interpretarlo como HTML. Con `innerHTML`, un texto que contuviera etiquetas se convertiría en HTML, lo que puede romper la página o permitir inyectar código.",
    "hints": [
      "Para la pregunta 1, repasar cuál es el comportamiento por defecto del navegador al enviar un formulario.",
      "Para la pregunta 2, aplicar `trim()` a una cadena de espacios y seguir la ejecución línea a línea hasta el `return`."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: el envío recarga la página y `preventDefault` lo cancela",
        "points": 2.5
      },
      {
        "text": "Pregunta 2: `text` es la cadena vacía, se muestra el mensaje y el `return` impide añadir el `<li>`",
        "points": 3
      },
      {
        "text": "Pregunta 3: papel de `createElement`, `textContent` y `appendChild`, y que el elemento queda al final de la lista",
        "points": 3
      },
      {
        "text": "Pregunta 4: `textContent` no interpreta el texto como HTML",
        "points": 1.5
      }
    ],
    "penalties": [
      "Afirmar en la pregunta 2 que se añade un `<li>` vacío: -1.",
      "Afirmar que `createElement` ya muestra el elemento en la página: -0,5."
    ],
    "partial": "En la pregunta 2, si se explica el mensaje pero no el papel del `return`, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 es válido mencionar que `list.append(li)` haría lo mismo. En la pregunta 4 basta con indicar que `innerHTML` interpretaría etiquetas o que supone un riesgo de seguridad."
  },
  "B2": {
    "statement": "Las rutas de tareas solo deben atender a usuarios autenticados. El cliente envía el token en la cabecera `Authorization: Bearer <token>`. Se muestra el middleware `auth` original, a medio escribir, y su **versión completada**.\n\nNo hay que modificar el código: se pide **explicar la versión completada** respondiendo a las cuatro preguntas del recuadro.",
    "questions": "1. ¿Qué comprueba el primer if? ¿Por qué debe ejecutarse antes de header.slice(7) y por qué lleva return?\n\n2. ¿Qué hace jwt.verify cuando el token es válido y qué hace cuando es falso o ha caducado? ¿Por qué está dentro de try/catch?\n\n3. ¿Para qué se guarda el resultado en req.user? ¿Qué pasaría si next() se llamara sin haberlo guardado?\n\n4. Para la petición con Authorization: Bearer abc (token falso), ¿qué responde el middleware y se ejecuta el controlador? ¿Por qué es 401 y no 403?\n",
    "answer": "1. Comprueba que existe la cabecera Authorization y que empieza por `Bearer `; si no, responde 401 con Missing token. Tiene que ir antes de `header.slice(7)` porque, si header es undefined, esa línea lanzaría un error, y el return termina el middleware para no seguir ejecutándolo después de responder.\n\n2. Si el token es válido, `jwt.verify` comprueba la firma con `process.env.JWT_SECRET` y la caducidad, y devuelve el payload. Si es falso o ha caducado, lanza un error; por eso va en un try/catch, para capturarlo y responder 401 en lugar de que la petición falle.\n\n3. req.user lleva el payload (por ejemplo, sub: 4 y role) a los siguientes middlewares y al controlador, que así saben quién hace la petición sin fiarse de datos del cliente. Sin guardarlo, el controlador se ejecutaría pero req.user sería undefined y no podría identificar al usuario.\n\n4. Hay cabecera con `Bearer `, así que se pasa el primer if, pero `jwt.verify` lanza un error y el catch responde 401 con Invalid or expired token; next() no llega a llamarse y el controlador no se ejecuta. Es 401 porque falla la identidad; el 403 se reserva para un usuario identificado que no tiene permiso.",
    "hints": [
      "Para la pregunta 1, pensar qué valor tiene `req.headers.authorization` cuando la petición no trae esa cabecera.",
      "Para la pregunta 4, seguir la ejecución con el token `abc`: qué condición se cumple, qué línea lanza un error y a qué bloque salta la ejecución."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: comprueba cabecera y prefijo, evita el fallo de `slice` sobre `undefined` y el `return` corta el middleware",
        "points": 2.5
      },
      {
        "text": "Pregunta 2: `verify` comprueba firma y caducidad, devuelve el payload o lanza un error que captura el `catch`",
        "points": 3
      },
      {
        "text": "Pregunta 3: `req.user` pasa la identidad al controlador; sin él, el controlador no sabe quién es el usuario",
        "points": 2
      },
      {
        "text": "Pregunta 4: 401 con Invalid or expired token, el controlador no se ejecuta, y diferencia entre 401 y 403",
        "points": 2.5
      }
    ],
    "penalties": [
      "Afirmar que `jwt.verify` devuelve `null` o `false` con un token no válido: -1.",
      "Responder 403 en la pregunta 4: -1."
    ],
    "partial": "En la pregunta 2, si se explica que se devuelve el payload pero no que se lanza un error, se conceden 1,5 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 2 se acepta «decodifica y valida el token» siempre que se mencione la firma. En la pregunta 3 se acepta cualquier ejemplo correcto del uso de `req.user.sub` en un controlador."
  },
  "B3": {
    "statement": "El componente `TaskList` pide las tareas a la API al montarse y muestra una de tres ramas: cargando, error o lista. Se muestra el componente original, sin el cuerpo de `load`, y la **versión completada** de esa función.\n\nNo hay que modificar el código: se pide **explicar la versión completada** respondiendo a las cuatro preguntas del recuadro.",
    "questions": "1. Describir lo que se ve en pantalla desde que el componente se monta hasta que la API responde con [{ \"id\": 1, \"title\": \"Leer la guía\" }]. ¿Qué estados cambian y en qué orden?\n\n2. ¿Por qué se guarda response.data y no response? ¿En qué casos salta la ejecución al catch?\n\n3. ¿Por qué setLoading(false) está en finally? ¿Qué pasaría si solo estuviera al final del try?\n\n4. ¿Por qué load se declara como función async dentro del efecto en lugar de hacer async el callback de useEffect? ¿Para qué sirve el array de dependencias vacío?\n",
    "answer": "1. Al montarse, loading es true y se ve Cargando…; el efecto llama a load, que espera la respuesta de `api.get(\"/tasks\")`. Cuando llega, setTasks guarda el array y, en finally, setLoading(false); el nuevo renderizado ya no entra en la rama de carga ni en la de error y muestra la lista con Leer la guía.\n\n2. Axios devuelve un objeto respuesta (con status, headers, etc.) y el JSON ya convertido está en response.data, que es el array de tareas que necesita tasks.map. Se salta al catch si no hay conexión o si la API devuelve un código 4xx o 5xx, porque en esos casos el await lanza un error.\n\n3. finally se ejecuta tanto si la petición sale bien como si falla. Si setLoading(false) solo estuviera en el try, ante un error no se ejecutaría y la pantalla se quedaría en Cargando… para siempre, aunque error tuviera el mensaje.\n\n4. Una función async devuelve siempre una promesa, y React espera que el callback del efecto no devuelva nada o devuelva una función de limpieza; por eso se declara load dentro y se llama. El array vacío hace que el efecto se ejecute una sola vez, al montarse el componente.",
    "hints": [
      "Para la pregunta 1, recordar que cada llamada a una función set provoca un nuevo renderizado y revisar las tres ramas del `return` en orden.",
      "Para la pregunta 3, seguir la ejecución suponiendo que `api.get` lanza un error: qué líneas del `try` se saltan y qué bloques se ejecutan."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: primero Cargando…, después `setTasks` y `setLoading(false)` y se ve la lista",
        "points": 2.5
      },
      {
        "text": "Pregunta 2: los datos están en `response.data`; el `catch` salta con 4xx, 5xx o sin conexión",
        "points": 2.5
      },
      {
        "text": "Pregunta 3: `finally` se ejecuta siempre; sin él un error deja la pantalla cargando",
        "points": 2.5
      },
      {
        "text": "Pregunta 4: el callback del efecto no puede devolver una promesa, y `[]` ejecuta el efecto solo al montar",
        "points": 2.5
      }
    ],
    "penalties": [
      "Afirmar que Axios no lanza un error con respuestas 4xx o 5xx: -1.",
      "Afirmar que el array vacío hace que el efecto se ejecute en cada renderizado: -1."
    ],
    "partial": "En la pregunta 4, si solo se explica una de las dos partes (la función `async` o el array vacío), se conceden 1,5 de los 2,5 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 2 se acepta mencionar la desestructuración `const { data } = ...` como forma equivalente. En la pregunta 3 se acepta indicar que repetir `setLoading(false)` en el `try` y en el `catch` sería equivalente."
  },
  "B4": {
    "statement": "Una tienda guarda sus productos en un array. La función `stockValue` devuelve el valor total del inventario: la suma de `price * units` de los productos con `units` mayor que 0, sin modificar el array recibido. Se muestra el código original y la **versión completada** de la función.\n\nNo hay que modificar el código: se pide **explicar la versión completada** respondiendo a las tres preguntas del recuadro.",
    "questions": "1. ¿Para qué sirve la variable total y por qué empieza en 0? ¿Qué devuelve la función con un array vacío?\n\n2. Seguir la ejecución con el array products: ¿qué valor tiene total después de procesar cada producto y qué devuelve la función?\n\n3. ¿Qué papel cumple la condición product.units > 0? ¿Cambiaría el resultado con este array si se quitara? ¿Por qué se puede afirmar que la función no modifica list?\n",
    "answer": "1. total es un acumulador: guarda la suma parcial y en cada vuelta se le añade el valor de un producto. Empieza en 0 porque es el valor neutro de la suma; con un array vacío el bucle no se ejecuta y la función devuelve 0.\n\n2. Teclado: 30 · 4 = 120, total = 120. Ratón: units es 0, no se cumple la condición y total sigue en 120. Monitor: 120 · 2 = 240, total = 360. La función devuelve 360.\n\n3. La condición deja fuera los productos sin unidades, como pide el enunciado. Con este array el resultado sería el mismo, porque el Ratón aportaría 15 · 0 = 0. La función no modifica list porque solo lee product.price y product.units y únicamente asigna valores a total; no cambia ningún producto ni el array.",
    "hints": [
      "Para la pregunta 2, escribir una tabla con el producto, si cumple la condición y el valor de `total` al final de cada vuelta.",
      "Para la pregunta 3, calcular qué aportaría el Ratón si se sumara sin comprobar la condición."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: `total` como acumulador que empieza en 0, y resultado 0 con array vacío",
        "points": 3
      },
      {
        "text": "Pregunta 2: valores intermedios 120, 120 y 360, y que la función devuelve 360",
        "points": 4
      },
      {
        "text": "Pregunta 3: la condición filtra los productos sin unidades, el resultado no cambiaría aquí y `list` solo se lee",
        "points": 3
      }
    ],
    "penalties": [
      "Sumar el Ratón como 15 en la pregunta 2: -1.",
      "Afirmar que sin la condición el resultado sería distinto con este array: -1."
    ],
    "partial": "En la pregunta 2, si el resultado final 360 es correcto pero faltan los valores intermedios, se conceden 2,5 de los 4 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 2 es válida una tabla o una lista con los valores de `total`. En la pregunta 3 se acepta mencionar que `filter` también devolvería un array nuevo sin modificar el original."
  },
  "B5": {
    "statement": "El componente `Counter` muestra el valor actual en un párrafo y tiene dos botones: **+1** suma uno y **-1** resta uno sin que el valor baje nunca de 0. Se muestra el componente original y su **versión completada**.\n\nNo hay que modificar el código: se pide **explicar la versión completada** respondiendo a las cuatro preguntas del recuadro.",
    "questions": "1. ¿Qué devuelve useState(0) y para qué se usa cada uno de los dos valores? ¿Por qué count debe ser estado y no una variable normal declarada con let?\n\n2. Al pulsar +1 tres veces desde 0, ¿qué ocurre en cada pulsación y qué se ve al final?\n\n3. Con el valor en 0, ¿qué calcula Math.max(0, count - 1) al pulsar -1? ¿Y con el valor en 3?\n\n4. ¿Por qué el onClick recibe una función flecha, () => setCount(count + 1), y no directamente setCount(count + 1)?\n",
    "answer": "1. Devuelve un array con el valor actual (count, que empieza en 0) y la función para cambiarlo (setCount). Debe ser estado porque cada llamada a setCount con un valor distinto provoca un nuevo renderizado con el valor actualizado; una variable normal se reiniciaría en cada renderizado y su cambio no se vería en pantalla.\n\n2. En cada pulsación se ejecuta setCount(count + 1): el valor pasa a 1, 2 y 3, y cada cambio vuelve a renderizar el componente, que muestra el nuevo valor en el párrafo. Al final se ve 3.\n\n3. Con 0 calcula Math.max(0, -1), que es 0, así que el valor se queda en 0. Con 3 calcula Math.max(0, 2), que es 2, y el valor baja a 2.\n\n4. onClick necesita una función que React ejecute al hacer clic. Escribir setCount(count + 1) directamente lo ejecutaría durante el renderizado, lo que cambiaría el estado en cada renderizado (y provocaría renderizados sin fin) en lugar de esperar al clic.",
    "hints": [
      "Para la pregunta 1, repasar qué provoca una llamada a la función set de `useState` y qué le ocurre a una variable local cuando el componente se vuelve a ejecutar.",
      "Para la pregunta 4, distinguir entre pasar una función y pasar el resultado de llamarla."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: `useState` devuelve el valor y la función set; el cambio de estado provoca un nuevo renderizado",
        "points": 3
      },
      {
        "text": "Pregunta 2: valores 1, 2 y 3, nuevo renderizado en cada pulsación y se ve 3",
        "points": 2
      },
      {
        "text": "Pregunta 3: `Math.max` da 0 con el valor en 0 y 2 con el valor en 3",
        "points": 2.5
      },
      {
        "text": "Pregunta 4: se pasa una función para que se ejecute al hacer clic, no al renderizar",
        "points": 2.5
      }
    ],
    "penalties": [
      "Afirmar que con el valor en 0 `Math.max(0, count - 1)` devuelve -1: -1.",
      "Afirmar que una variable normal también actualizaría la pantalla: -1."
    ],
    "partial": "En la pregunta 4, si se indica que la función se ejecutaría al renderizar pero no la consecuencia, se conceden 1,5 de los 2,5 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 se acepta comparar con alternativas como `if (count > 0)` o deshabilitar el botón con `disabled`. En la pregunta 2 se acepta mencionar la forma funcional `setCount((c) => c + 1)`."
  },
  "B6": {
    "statement": "El endpoint `DELETE /products/:id` borra un producto de la tabla `products`. Si existía, responde `204` sin cuerpo; si no existía, responde `404` con `{ \"error\": \"Product not found\" }`.\n\nSe muestran los ficheros originales y la **versión completada**. No hay que modificar el código: se pide **explicar su funcionamiento** respondiendo a las tres preguntas del recuadro.\n\nUn cliente envía `DELETE /products/3`, con el producto 3 existente, y después repite la misma petición.",
    "questions": "1. ¿Qué hace la consulta y por qué el id se pasa como $1 junto con [req.params.id] en lugar de concatenarlo en el texto SQL?\n\n2. ¿Qué indica result.rowCount? ¿Qué valor toma en la primera petición y en la segunda, y qué responde el endpoint en cada caso?\n\n3. ¿Por qué la respuesta 404 lleva return? ¿Por qué la respuesta 204 se envía con end() y no con json()?\n",
    "answer": "1. Borra de products la fila cuyo id coincide con el recibido en la URL. Es una consulta parametrizada: pg envía el valor aparte del texto SQL, así que no puede alterar la consulta; concatenarlo permitiría una inyección SQL.\n\n2. rowCount es el número de filas afectadas por la consulta. En la primera petición vale 1 y se responde 204; en la segunda vale 0, porque el producto ya no existe, y se responde 404 con { error: \"Product not found\" }. Un DELETE que no encuentra filas no es un error para PostgreSQL: simplemente afecta a 0 filas.\n\n3. return termina la función tras enviar el 404, para que no siga hasta la línea del 204 e intente enviar una segunda respuesta. 204 significa éxito sin contenido, así que no se envía cuerpo: end() cierra la respuesta sin cuerpo, mientras que json() enviaría uno.",
    "hints": [
      "Para la pregunta 2, leer la nota del fichero original sobre lo que incluye el resultado de `pool.query` y pensar qué ocurre al borrar dos veces la misma fila.",
      "Para la pregunta 3, seguir la ejecución de la función línea a línea en el caso del 404 suponiendo que no existiera el `return`."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: qué borra la consulta y consulta parametrizada frente a inyección SQL",
        "points": 3
      },
      {
        "text": "Pregunta 2: significado de `rowCount`, valores 1 y 0, y respuestas 204 y 404",
        "points": 4
      },
      {
        "text": "Pregunta 3: `return` detiene la función y 204 no lleva cuerpo",
        "points": 3
      }
    ],
    "penalties": [
      "Afirmar que el `DELETE` de un producto inexistente lanza un error de la base de datos: -1.",
      "Confundir 404 con 400 o 204 con 200: -0,5."
    ],
    "partial": "En la pregunta 2, si se explica `rowCount` pero no se indican los valores de las dos peticiones, se conceden 2 de los 4 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 es válido indicar que sin `return` se intentaría responder dos veces a la misma petición."
  },
  "B7": {
    "statement": "El componente `NewTaskForm` recibe la prop `onAdd`, una función del componente padre. Su campo de texto es un *input* controlado por el estado `title`; al enviar el formulario no se recarga la página, se llama a `onAdd` con el título sin espacios sobrantes y el campo se vacía; y el botón está deshabilitado mientras el campo está vacío.\n\nSe muestran los ficheros originales y la **versión completada**. No hay que modificar el código: se pide **explicar su funcionamiento** respondiendo a las cuatro preguntas del recuadro.",
    "questions": "1. ¿Qué hacen value={title} y onChange en el input? ¿Por qué basta con setTitle(\"\") para vaciar el campo?\n\n2. ¿Qué hace cada una de las tres líneas de handleSubmit? ¿Qué ocurriría sin event.preventDefault()?\n\n3. Si se escribe «  Repasar SQL  » y se pulsa Añadir, ¿con qué valor se llama a onAdd? ¿Por qué el componente llama a onAdd en lugar de añadir la tarea él mismo?\n\n4. ¿Cuándo está deshabilitado el botón? ¿Lo está si el campo solo contiene espacios?\n",
    "answer": "1. value hace que el texto visible salga del estado title, y onChange actualiza el estado en cada pulsación con e.target.value. Como React es la fuente de verdad, al poner el estado a \"\" el campo se vuelve a renderizar vacío.\n\n2. preventDefault evita el comportamiento por defecto del formulario, que es enviarlo recargando la página; onAdd(title.trim()) avisa al padre con el título recortado; setTitle(\"\") vacía el campo. Sin preventDefault el navegador recargaría la página y se perdería el estado de la aplicación.\n\n3. Se llama a onAdd(\"Repasar SQL\"), porque trim() quita los espacios del principio y del final. La lista de tareas es del padre: el hijo no puede modificarla, así que le avisa mediante la función que recibe por props.\n\n4. Está deshabilitado cuando title.trim() === \"\", es decir, cuando el campo está vacío. Como se compara el texto recortado, también lo está si solo contiene espacios.",
    "hints": [
      "Para la pregunta 1, pensar de dónde sale el texto que se ve en el campo en cada renderizado.",
      "Para la pregunta 4, fijarse en que la condición de `disabled` no compara `title` directamente."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: `value` muestra el estado, `onChange` lo actualiza y React es la fuente de verdad",
        "points": 3
      },
      {
        "text": "Pregunta 2: papel de las tres líneas y recarga de la página sin `preventDefault`",
        "points": 2.5
      },
      {
        "text": "Pregunta 3: valor `\"Repasar SQL\"` y comunicación hijo-padre mediante props",
        "points": 2.5
      },
      {
        "text": "Pregunta 4: condición del botón, incluido el caso de solo espacios",
        "points": 2
      }
    ],
    "penalties": [
      "Afirmar que `setTitle(\"\")` vacía el campo modificando directamente el DOM: -1."
    ],
    "partial": "En la pregunta 3, si el valor es correcto pero no se explica por qué se llama al padre, se concede 1,5 de los 2,5 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 es válido decir que el estado de la lista vive en el padre y que el hijo solo lo notifica."
  },
  "B8": {
    "statement": "El endpoint `POST /products` valida el cuerpo: si `name` no es un texto con contenido o `price` no es un número mayor o igual que 0, responde `400` con `{ \"error\": \"Invalid product\" }`. Si los datos son válidos, inserta el producto en `products` y responde `201` con la fila creada. La tabla tiene las columnas `id` (generado), `name` y `price`, y la app ya usa `express.json()`.\n\nSe muestran los ficheros originales y la **versión completada**. No hay que modificar el código: se pide **explicar su funcionamiento** respondiendo a las cuatro preguntas del recuadro.",
    "questions": "1. ¿Qué comprueba cada parte de la condición del if? ¿Qué responde el endpoint con { \"name\": \"\", \"price\": 25 }, con { \"name\": \"Silla\", \"price\": -3 } y con { \"name\": \"Lámpara\", \"price\": \"25\" }?\n\n2. ¿Por qué la validación se hace antes de la consulta y por qué termina con return?\n\n3. ¿Por qué los valores se pasan como $1 y $2? ¿Qué hace RETURNING id, name, price y qué contiene rows[0]?\n\n4. ¿Qué responde el endpoint con { \"name\": \"Lámpara\", \"price\": 25 } y por qué con el código 201?\n",
    "answer": "1. Comprueba que name sea un string, que no quede vacío tras trim(), que price sea de tipo number y que no sea negativo. Los tres cuerpos responden 400 con { error: \"Invalid product\" }: el primero por el nombre vacío, el segundo por el precio negativo y el tercero porque \"25\" es un string, no un número.\n\n2. Los datos de req.body los decide el cliente, así que se validan antes de tocar la base de datos. return termina la función tras enviar el 400, de modo que no se ejecuta el INSERT ni se intenta enviar una segunda respuesta.\n\n3. Es una consulta parametrizada: pg envía los valores aparte del texto SQL y evita la inyección SQL. RETURNING hace que el INSERT devuelva la fila creada, con el id generado, sin una segunda consulta; rows[0] es esa fila.\n\n4. Responde 201 con la fila creada, por ejemplo { \"id\": 9, \"name\": \"Lámpara\", \"price\": 25 }. 201 indica que se ha creado un recurso nuevo, no solo que la petición ha ido bien.",
    "hints": [
      "Para la pregunta 1, recordar qué devuelve `typeof` para `\"25\"` y para `25`.",
      "Para la pregunta 3, pensar cómo conocería el cliente el `id` generado por la base de datos si el `INSERT` no devolviera nada."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: las cuatro comprobaciones y 400 en los tres casos, con el motivo de cada uno",
        "points": 3
      },
      {
        "text": "Pregunta 2: validar antes de la base de datos y `return` que detiene la función",
        "points": 2
      },
      {
        "text": "Pregunta 3: consulta parametrizada, `RETURNING` y contenido de `rows[0]`",
        "points": 3
      },
      {
        "text": "Pregunta 4: 201 con la fila creada, incluido el `id`",
        "points": 2
      }
    ],
    "penalties": [
      "Afirmar que `{ \"name\": \"Lámpara\", \"price\": \"25\" }` se acepta porque el texto se convierte a número: -1."
    ],
    "partial": "En la pregunta 1, si se explican las comprobaciones pero no se indica el motivo del 400 en el tercer cuerpo, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 4, el `id` concreto puede ser cualquiera: basta con indicar que lo genera la base de datos."
  },
  "B9": {
    "statement": "La función `findByEmail` devuelve el usuario cuyo email coincide con el recibido **sin distinguir mayúsculas de minúsculas**, o `null` si no hay ninguno.\n\nSe muestran los ficheros originales y la **versión completada**. No hay que modificar el código: se pide **explicar su funcionamiento** respondiendo a las tres preguntas del recuadro.",
    "questions": "1. Para la llamada findByEmail(users, \"LUIS@cunef.edu\"), ¿qué valor toma target y qué compara find en cada elemento? ¿Por qué se pasan a minúsculas los dos emails y no solo el recibido?\n\n2. Para findByEmail(users, \"eva@cunef.edu\"), ¿qué devuelve find y qué hace user ?? null?\n\n3. ¿Se modifican los emails del array users al ejecutar la función? ¿Por qué?\n",
    "answer": "1. target vale \"luis@cunef.edu\". find compara la versión en minúsculas de cada email con target: \"ana@cunef.edu\" no coincide y \"luis@cunef.edu\" sí, así que devuelve { id: 2, email: \"Luis@cunef.edu\" }. Si solo se pasara a minúsculas el recibido, \"Luis@cunef.edu\" no coincidiría porque en el array tiene mayúscula.\n\n2. find no encuentra ninguna coincidencia y devuelve undefined. ?? devuelve el valor de la derecha cuando el de la izquierda es null o undefined, así que la función devuelve null, que es lo que pide el enunciado.\n\n3. No. toLowerCase() devuelve un string nuevo y no cambia el original, y find solo recorre el array sin modificarlo.",
    "hints": [
      "Para la pregunta 1, recorrer el array elemento a elemento escribiendo el resultado de `u.email.toLowerCase()`.",
      "Para la pregunta 2, recordar qué devuelve `find` cuando ningún elemento cumple la condición."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: valor de `target`, comparación en cada elemento y necesidad de convertir los dos lados",
        "points": 4
      },
      {
        "text": "Pregunta 2: `find` devuelve `undefined` y `??` lo convierte en `null`",
        "points": 4
      },
      {
        "text": "Pregunta 3: los strings no se modifican: `toLowerCase` devuelve uno nuevo",
        "points": 2
      }
    ],
    "penalties": [
      "Afirmar que `find` devuelve `null` cuando no encuentra nada: -1."
    ],
    "partial": "En la pregunta 1, si el resultado es correcto pero no se explica por qué hacen falta los dos lados en minúsculas, se conceden 2 de los 4 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 2 es válido explicar `??` comparándolo con `||` o con un `if`."
  },
  "C1": {
    "statement": "Una aplicación React tiene `BrowserRouter` en `main.jsx`, una lista de tareas y un componente `TaskDetail`. En la versión completada están conectados: al pulsar una tarea de la lista se navega a `/tasks/:id` y se muestra su detalle.\n\nSe muestran los ficheros originales y la **versión completada**. No hay que modificar el código: se pide **explicar su funcionamiento** respondiendo a las cuatro preguntas del recuadro.",
    "questions": "1. ¿Qué significa :id en el path de la nueva Route? ¿Qué componente se renderiza en /tasks/2 y en /tasks/99, y qué se ve en cada caso?\n\n2. ¿Qué URL genera el Link de «Hacer el quiz»? ¿Por qué se usa Link y no un <a href>?\n\n3. En /tasks/2, ¿qué valor devuelve useParams para id y de qué tipo es? ¿Qué se vería si TaskDetail comparara t.id === id sin Number?\n\n4. Describir el recorrido completo desde el clic en «Hacer el quiz» hasta que aparece el h1: qué hace cada fichero y por dónde viaja el id entre TaskList y TaskDetail.\n",
    "answer": "1. :id declara un segmento variable: la ruta coincide con /tasks/ seguido de cualquier valor, y ese valor queda disponible como parámetro id. En los dos casos se renderiza TaskDetail: en /tasks/2 muestra «Hacer el quiz» en un h1 y en /tasks/99 muestra «Tarea no encontrada», porque ninguna tarea tiene ese id.\n\n2. Genera /tasks/2, construido con el id de la tarea. Link cambia la URL sin recargar la página, como corresponde a una SPA; un <a href> también navegaría, pero recargando toda la aplicación.\n\n3. Devuelve \"2\", un string: los parámetros de la URL llegan siempre como texto. Sin Number, 2 === \"2\" es false, find no encontraría la tarea y se vería «Tarea no encontrada».\n\n4. TaskList recorre TASKS de data.js y pinta un Link por tarea; al pulsar, la URL pasa a /tasks/2 sin recargar. Routes, en App.jsx, compara la URL con sus rutas y renderiza TaskDetail, que lee el id con useParams, busca la tarea en el mismo TASKS y muestra su título. El id no viaja por props: viaja en la URL.",
    "hints": [
      "Para la pregunta 3, recordar de dónde sale el valor del parámetro y qué tipo de dato tiene todo lo que forma parte de una URL.",
      "Para la pregunta 4, fijarse en que `TaskList` y `TaskDetail` no se renderizan uno dentro del otro: pensar qué tienen en común."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: segmento variable y resultado en `/tasks/2` y `/tasks/99`",
        "points": 2.5
      },
      {
        "text": "Pregunta 2: URL `/tasks/2` y navegación sin recarga con `Link`",
        "points": 2.5
      },
      {
        "text": "Pregunta 3: `\"2\"` como texto y fallo de la comparación sin `Number`",
        "points": 2.5
      },
      {
        "text": "Pregunta 4: recorrido entre ficheros y el `id` viaja en la URL, no por props",
        "points": 2.5
      }
    ],
    "penalties": [
      "Afirmar que `/tasks/99` no coincide con ninguna ruta y no se renderiza nada: -1.",
      "Afirmar que `useParams` devuelve el `id` como número: -1."
    ],
    "partial": "En la pregunta 4, si se describe el flujo pero no se indica que el `id` viaja en la URL, se conceden 1,5 de los 2,5 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 es válido explicar la comparación estricta con cualquier ejemplo de número frente a texto."
  },
  "C2": {
    "statement": "Una lista de tareas tiene un botón «Eliminar» en cada fila. El cliente de la API incluye la función `deleteTask(id)`, que envía `DELETE /tasks/:id`. En la versión completada, cada botón llama a `handleDelete` con el `id` de su tarea; `handleDelete` borra la tarea en la API y, si va bien, la quita de la lista en pantalla; si la petición falla, guarda `No se ha podido borrar la tarea` en `error` y deja la lista como estaba.\n\nSe muestran los ficheros originales y la **versión completada**. No hay que modificar el código: se pide **explicar su funcionamiento** respondiendo a las cuatro preguntas del recuadro.",
    "questions": "1. ¿Por qué el botón usa onClick={() => handleDelete(task.id)} y no onClick={handleDelete(task.id)}? ¿Qué ocurriría con la segunda forma?\n\n2. Al pulsar «Eliminar» en la tarea 3, ¿qué se ejecuta y en qué orden, desde el clic hasta la petición? Indicar qué hace cada fichero y qué petición se envía.\n\n3. Si la API responde bien, ¿por qué setTasks va después del await y por qué se usa filter en lugar de modificar tasks directamente?\n\n4. Si la API responde con un error, ¿qué parte del código se ejecuta y qué se ve en pantalla? ¿Cambia la lista?\n",
    "answer": "1. onClick necesita una función. La función flecha retrasa la llamada hasta el clic; con handleDelete(task.id) la función se ejecutaría en cada renderizado y se borrarían todas las tareas al cargar la página.\n\n2. Se ejecuta la función flecha, que llama a handleDelete(3). En TaskItems.jsx, handleDelete llama a deleteTask(3); en api.js, deleteTask usa la instancia de Axios con baseURL VITE_API_URL para enviar DELETE /tasks/3. handleDelete espera la respuesta con await antes de seguir.\n\n3. Así la lista solo cambia cuando la API ha confirmado el borrado; si se hiciera antes, un error dejaría la pantalla mostrando algo que no coincide con el servidor. filter devuelve un array nuevo con todas las tareas menos la 3, y React detecta el cambio y vuelve a renderizar.\n\n4. Axios rechaza la promesa, el await lanza el error y se ejecuta el catch: setError guarda «No se ha podido borrar la tarea» y aparece en el <p> gracias a error && <p>{error}</p>. setTasks no llega a ejecutarse, así que la lista no cambia.",
    "hints": [
      "Para la pregunta 1, distinguir entre pasar una función y pasar el resultado de llamarla.",
      "Para la pregunta 4, seguir el `try`: en qué línea se interrumpe si `deleteTask` falla y qué líneas quedan sin ejecutar."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: `onClick` recibe una función y la segunda forma borraría al renderizar",
        "points": 3
      },
      {
        "text": "Pregunta 2: orden función flecha → `handleDelete` → `deleteTask` → `DELETE /tasks/3`",
        "points": 2.5
      },
      {
        "text": "Pregunta 3: actualizar tras la confirmación y `filter` crea un array nuevo",
        "points": 2.5
      },
      {
        "text": "Pregunta 4: `catch`, mensaje de error visible y lista sin cambios",
        "points": 2
      }
    ],
    "penalties": [
      "Afirmar que la segunda forma de `onClick` funciona igual pero es menos legible: -1.",
      "Afirmar que la tarea desaparece de la lista aunque falle la petición: -1."
    ],
    "partial": "En la pregunta 3, si se explica `filter` pero no el motivo de actualizar después del `await`, se conceden 1,5 de los 2,5 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 3 es válido mencionar la forma funcional `setTasks((prev) => ...)` como alternativa equivalente."
  },
  "C3": {
    "statement": "Una aplicación tiene un `AuthContext` con el hook `useAuth`, igual que el visto en clase. En la versión completada, el Provider envuelve a la aplicación y la barra de navegación lee la sesión del Context, sin recibirla por props.\n\nSe muestran los ficheros originales y la **versión completada**. No hay que modificar el código: se pide **explicar su funcionamiento** respondiendo a las cuatro preguntas del recuadro.",
    "questions": "1. ¿Qué consigue AuthProvider al envolver a App en main.jsx, y por qué va dentro de BrowserRouter? ¿Qué ocurriría si NavBar se renderizara fuera del Provider?\n\n2. ¿Cómo llegan isLoggedIn y signOut hasta NavBar? Indicar qué pieza de AuthContext.jsx crea el valor y cuál lo lee. ¿Qué problema evita esto frente a pasarlos por props?\n\n3. Un usuario sin sesión inicia sesión en la pantalla de login, que usa signIn. ¿Qué se ejecuta y por qué la barra pasa de Entrar a Salir sin recargar la página?\n\n4. Tras iniciar sesión, se recarga la página. ¿Qué muestra la barra y por qué? ¿Y después de pulsar Salir?\n",
    "answer": "1. Hace que todos los componentes dentro de App puedan leer el valor del Context. Va dentro de BrowserRouter para que sus componentes puedan usar la navegación. Fuera del Provider, useContext devolvería el valor por defecto, null, y la desestructuración de useAuth() fallaría.\n\n2. AuthProvider construye value con isLoggedIn, signIn y signOut y lo pasa a AuthContext.Provider; NavBar llama a useAuth, que usa useContext(AuthContext) y devuelve ese objeto. Así se evita el prop drilling: App y los componentes intermedios no tienen que pasar la sesión por props.\n\n3. signIn envía POST /auth/login con api, guarda data.token en localStorage y llama a setToken. Al cambiar el estado, AuthProvider se vuelve a renderizar con isLoggedIn: Boolean(token) a true, y los componentes que leen el Context, entre ellos NavBar, se vuelven a renderizar y muestran Salir.\n\n4. Muestra Salir: el estado token se inicializa con localStorage.getItem(\"token\"), que sigue guardado, así que isLoggedIn es true. Al pulsar Salir, signOut borra el token de localStorage y pone el estado a null, isLoggedIn pasa a false y vuelve a aparecer Entrar.",
    "hints": [
      "Para la pregunta 2, localizar en `AuthContext.jsx` las tres piezas de Context: dónde se crea, qué componente guarda el valor y con qué hook se lee.",
      "Para la pregunta 4, fijarse en el valor inicial que se pasa a `useState` en `AuthProvider`."
    ],
    "rubric": [
      {
        "text": "Pregunta 1: el Provider da acceso a toda la app, va dentro del router y fuera de él se recibe `null`",
        "points": 3
      },
      {
        "text": "Pregunta 2: `value` en el Provider, lectura con `useAuth`/`useContext` y *prop drilling*",
        "points": 2.5
      },
      {
        "text": "Pregunta 3: `signIn` guarda el token, cambia el estado y se vuelven a renderizar los consumidores",
        "points": 2.5
      },
      {
        "text": "Pregunta 4: el token se recupera de `localStorage` y `signOut` lo borra",
        "points": 2
      }
    ],
    "penalties": [
      "Afirmar que `NavBar` recibe la sesión por props desde `App`: -1.",
      "Afirmar que hay que recargar la página para que la barra muestre **Salir**: -1."
    ],
    "partial": "En la pregunta 1, si se explica para qué sirve el Provider pero no qué ocurre fuera de él, se conceden 2 de los 3 puntos.",
    "alternatives": "Cualquier explicación equivalente con otras palabras. En la pregunta 2 es válido describir `useAuth` como un atajo de `useContext(AuthContext)`."
  }
};
