# Estándares de Consumo de APIs

## Lecturas

- Todas las consultas (GET) deben realizarse utilizando `FetchApi`.
- `FetchApi` debe declararse directamente dentro del cuerpo del componente.
- No utilizar llamadas HTTP directas dentro de `useEffect`.
- La ejecución condicional debe realizarse utilizando los parámetros de activación de `FetchApi`.

---

## Escrituras

Todas las operaciones de escritura deben utilizar `useFetchApiMultiResults`.

Dependiendo del tipo de operación utilizar:

- `FetchPost`
- `FetchPut`
- `FetchDelete`

Las llamadas deben realizarse desde la función correspondiente (por ejemplo `onSubmit`).

---

## DELETE y PUT

Las operaciones `FetchDelete` y `FetchPut` deben incluir:

- `activeConfirmation`
- `titleUser`
- `messageUser`

Los mensajes deben ser genéricos y acordes a la operación realizada.

---

## Implementaciones Legacy

Se consideran implementaciones legacy, entre otras:

- `dispatch` + `unwrapResult`
- llamadas HTTP mediante `fetch`
- llamadas HTTP mediante `axios`
- llamadas HTTP dentro de `useEffect`
- llamadas encapsuladas en funciones `async` o bloques `try/catch` que no utilicen `FetchApi` o `useFetchApiMultiResults`
- cualquier implementación que no siga el estándar definido para el proyecto

---

## Confirmaciones

Si la operación utiliza `useFetchApiMultiResults`, la confirmación debe gestionarse mediante ese hook.

No debe mantenerse una llamada adicional a `getConfirmation` para la misma operación.