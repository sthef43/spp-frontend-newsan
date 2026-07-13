# Estándares de Estructura y Tipado

## Componentes

- Todos los mainPage deben declararse utilizando `React.FC`.

Ejemplo:

```tsx
export const MiPagina: React.FC = () => {
```

---

## Interfaces

Las interfaces auxiliares (`Params`, `ListaUrls`, etc.) deben declararse fuera del componente y ubicarse en la parte superior del archivo.

---

## Tablas

Los datos y configuración de `TableComponent` deben seguir el patrón definido por el proyecto.

No utilizar `useMemo` para construir la configuración de la tabla, ya que genera incompatibilidades durante la compilación del proyecto SPP.

Los datos utilizados por `TableComponent` deben declararse directamente dentro del JSX.

---

## Hooks

Todos los hooks deben declararse antes del JSX.

Los hooks nunca deben declararse:

- dentro de condiciones
- dentro de ciclos
- después del return

---

## Naming

Las variables, estados y funciones deben tener nombres descriptivos y acordes a la responsabilidad que cumplen.

Evitar nombres ambiguos o abreviaturas innecesarias.

---

## JSX

No realizar llamadas a APIs ni ejecutar lógica de negocio directamente dentro del JSX.

---

## Variables

Eliminar variables, imports y funciones que no sean utilizados.

---

## Fechas

Para el manejo y formateo de fechas utilizar `moment`.

No utilizar `new Date()` para realizar formateos o manipulaciones de fechas cuando exista una implementación equivalente mediante `moment`.