# Documentación: Contenedores (ContainerForItems & ContainerForPages)

> **Ruta:** `src/app/shared/helpers/Containers/`  
> **Tipo:** Componentes de layout reutilizables  
> **Fecha de documentación:** 14/07/2026

---

## Resumen

Estos dos componentes proporcionan contenedores de layout reutilizables para el sistema SPP.

- **`ContainerForItems`** — Renderiza una lista animada de elementos usando MUI `List` + `TransitionGroup`. Ideal para listados secundarios, selección de ítems o paneles de resultados con animaciones de entrada.
- **`ContainerForPages`** — Contenedor de paginación/layout que aplica estilos predefinidos (`Table`, `page`, `modal`, `Selects`) o clases personalizadas, con la opción de añadir una animación `Grow` al montarse.

Ambos siguen los estándares del proyecto: componentes funcionales, TypeScript estricto, uso de MUI y Tailwind CSS para estilos.

---

## Tabla Comparativa

| Característica              | `ContainerForItems`                          | `ContainerForPages`                           |
| --------------------------- | -------------------------------------------- | --------------------------------------------- |
| **Tipo de componente**      | Genérico `<T>`                               | `React.FC<Props>` (discriminated union)       |
| **Props obligatorias**      | `items`, `textItem`, `keyId`                 | `optionsLayout`, `children`                   |
| **Props opcionales**        | `secondaryAction`, `onClickItem`             | `activeEffectVisible`, `tableForModalOrPageStyle`, `classNamePersonalized` |
| **Animación**               | `Grow` animado por `TransitionGroup`         | `Grow` condicional según `activeEffectVisible` |
| **MUI usado**               | `List`, `ListItem`, `ListItemText`, `Grow`   | `Grow`                                         |
| **Estilos**                 | Tailwind + `sx`                              | Tailwind puro (switch de clases)              |
| **Uso principal**           | Listas animadas de elementos                 | Layout de página, modal, tabla, selects       |

---

## ContainerForItems

### Descripción General

Componente genérico que renderiza una lista de elementos (`items`) dentro de un `List` de MUI con un contenedor `TransitionGroup`. Cada ítem se muestra con un `ListItem` que incluye animación `Grow`, texto principal (`textItem`) y una acción secundaria opcional (`secondaryAction`). Soporta la selección por click (`onClickItem`).

### Props

| Prop             | Tipo                                 | Requerida | Descripción                                                |
| ---------------- | ------------------------------------ | --------- | ---------------------------------------------------------- |
| `items`          | `T[]`                                | ✅        | Arreglo de elementos a renderizar                          |
| `textItem`       | `(item: T) => React.ReactNode \| string` | ✅     | Función que devuelve el contenido textual/JSX del ítem     |
| `keyId`          | `(item: T) => string \| number`      | ✅        | Función que extrae el key único de cada elemento           |
| `secondaryAction`| `(item: T) => React.ReactNode`       | ❌        | Acción secundaria (ej. botón, icono) en el lado derecho    |
| `onClickItem`    | `(item: T) => void`                  | ❌        | Callback al hacer click sobre un ítem                      |

### Dependencias

| Dependencia          | Versión/Origen                     | Uso                                               |
| -------------------- | ---------------------------------- | ------------------------------------------------- |
| `@mui/material`      | `Grow`, `List`, `ListItem`, `ListItemText` | Estructura visual de la lista animada       |
| `react-transition-group` | `TransitionGroup`               | Agrupa y anima las transiciones de los items       |
| `react`              | `React.ReactNode`                  | Tipos y renderización                             |
| Tailwind CSS         | `w-full`, `h-full`, `bg-secondaryNew`, `p-4`, `rounded-md`, `shadow-md` | Contenedor exterior del listado |
| MUI `sx`             |                                    | Estilos del `List` (max-height, overflow) y `ListItem` (fondo, borde) |
| CSS Variables        | `var(--background-color)`          | Fondo de cada `ListItem`                          |

### Ejemplo de Uso

```tsx
import { ContainerForItems } from "app/shared/helpers/Containers/ContainerForItems";

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Producto A", price: 100 },
  { id: 2, name: "Producto B", price: 200 },
];

<ContainerForItems
  items={products}
  keyId={(p) => p.id}
  textItem={(p) => `${p.name} - $${p.price}`}
  secondaryAction={(p) => <button>Eliminar</button>}
  onClickItem={(p) => console.log("Seleccionado:", p.name)}
/>
```

---

## ContainerForPages

### Descripción General

Componente contenedor de layout que aplica estilos predefinidos según la propiedad `optionsLayout`. Soporta 5 modos de diseño: `"Table"`, `"page"`, `"modal"`, `"Selects"` y `"personalized"`. Cuando se usa el modo `"personalized"`, la prop `classNamePersonalized` pasa a ser **obligatoria** (gracias a una unión discriminada de TypeScript). Opcionalmente puede mostrar una animación `Grow` al montarse mediante `activeEffectVisible`.

### Props

La prop `Props` es una **unión discriminada** controlada por `optionsLayout`:

| Prop                      | Tipo                                        | Requerida | Default  | Descripción                                                |
| ------------------------- | ------------------------------------------- | --------- | -------- | ---------------------------------------------------------- |
| `children`                | `React.ReactNode`                           | ✅        | —        | Contenido a renderizar dentro del contenedor               |
| `optionsLayout`           | `"Table"` \| `"page"` \| `"modal"` \| `"Selects"` \| `"personalized"` | ✅ | —     | Define el conjunto de clases Tailwind a aplicar            |
| `activeEffectVisible`     | `boolean`                                   | ❌        | `undefined` (sin animación) | Si es `true`, envuelve el `<main>` con un `Grow` animado |
| `tableForModalOrPageStyle`| `"Modal"` \| `"page"`                       | ❌        | —        | Solo aplica cuando `optionsLayout="Table"`. Cambia el fondo: `bg-background` si es `"Modal"`, `bg-secondaryNew` si es `"page"` |
| `classNamePersonalized`   | `string`                                    | ⚠️       | —        | **Obligatorio** si `optionsLayout="personalized"`, **opcional** en cualquier otro caso. Clases CSS personalizadas |

### Mapa de estilos por `optionsLayout`

| `optionsLayout`     | Clases Tailwind aplicadas                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `"Table"` + `Modal`   | `w-full h-full bg-background p-2 pb-4 mt-4 rounded-md shadow-md`                                          |
| `"Table"` + `page`    | `w-full h-full bg-secondaryNew p-2 pb-4 mt-4 rounded-md shadow-md`                                          |
| `"page"`              | `w-full h-full p-4`                                                                                        |
| `"modal"`             | `w-[35vw] h-full`                                                                                          |
| `"Selects"`           | `flex flex-row text-center w-full gap-x-4 justify-between items-end bg-secondaryNew p-4 rounded-md shadow-md` |
| `"personalized"`      | Lo que se pase en `classNamePersonalized`                                                                   |
| *default*           | `bg-red-500 w-full h-full p-4` *(fallback de error visual)*                                                |

### Dependencias

| Dependencia       | Versión/Origen       | Uso                                   |
| ----------------- | -------------------- | ------------------------------------- |
| `@mui/material`   | `Grow`               | Animación de entrada del contenedor   |
| `react`           | `React.FC`, `React.ReactNode` | Tipos y renderización         |
| Tailwind CSS      | Varias clases        | Estilos del layout según `optionsLayout` |

### Ejemplo de Uso

```tsx
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

// Modo página simple
<ContainerForPages optionsLayout="page" activeEffectVisible>
  <h1>Contenido de la página</h1>
</ContainerForPages>

// Modo tabla dentro de un modal
<ContainerForPages
  optionsLayout="Table"
  tableForModalOrPageStyle="Modal"
>
  <table>...</table>
</ContainerForPages>

// Modo personalized (classNamePersonalized es obligatorio aquí)
<ContainerForPages
  optionsLayout="personalized"
  classNamePersonalized="flex flex-col gap-4 bg-white p-6 rounded-xl"
>
  <div>Contenido con estilos personalizados</div>
</ContainerForPages>

// Modo selects con formulario
<ContainerForPages optionsLayout="Selects">
  <select>...</select>
  <select>...</select>
</ContainerForPages>
```

---

## Notas y Consideraciones

- **ContainerForItems** es genérico: el tipo `T` se infiere automáticamente del arreglo `items`. No es necesario tiparlo manualmente.
- **ContainerForPages** usa una **unión discriminada** de TypeScript: si `optionsLayout` es `"personalized"`, TypeScript exige que `classNamePersonalized` sea obligatorio; en cualquier otro caso es opcional. Esto da seguridad de tipos al llamarlo.
- El `eslint-disable unused-imports/no-unused-vars` al inicio de ambos archivos está presente porque se importa `Grow` (y en `ContainerForItems` también `Grow`), aunque la directiva parezca innecesaria; se recomienda no eliminar la importación para mantener la compatibilidad con el equipo.
- El `default` del `switch` en `ContainerForPages` asigna la clase `bg-red-500` como fallback visual, lo que ayuda a detectar rápidamente si se pasa un valor de `optionsLayout` no soportado.
- Ambos componentes usan la propiedad `in={true}` en `Grow`, lo que significa que la animación solo se ejecuta al montar; no vuelve a reproducirse a menos que el componente se desmonte y monte de nuevo.
- Para animaciones de entrada/salida condicionales (mostrar/ocultar), se recomienda controlar el montaje/desmontaje desde el padre en lugar de confiar únicamente en `Grow`.

---

## Archivos

| Archivo                | Descripción                                  |
| ---------------------- | -------------------------------------------- |
| `ContainerForItems.tsx` | Componente genérico de lista animada         |
| `ContainerForPages.tsx` | Componente de layout con estilos predefinidos |
| `README.md`            | Este archivo de documentación                |

---

## Mejoras / Observaciones del Revisor

### ContainerForItems
- **No hay estado vacío:** Si `items` es un array vacío, se renderiza un `List` sin elementos y un `section` con padding, pero no hay mensaje para el usuario ("No hay elementos", "Sin resultados", etc.). Sería buena práctica mostrar un feedback visual cuando la lista está vacía.
- **`keyId` usa `string | number`, pero el `key` de React acepta `string`:** Si `keyId` devuelve un número, React lo convertirá a string internamente, pero el tipado es correcto. Sin embargo, el `labelId` (`list-label-${keyId(item)}`) siempre será string por la template string. Considerar si tiene sentido restringir `keyId` solo a `string` o mantener ambas opciones para flexibilidad.
- **`secondaryAction` se renderiza siempre:** El `secondaryAction` se pasa directo al `ListItem`, pero si no se proporciona la prop, `secondaryAction(item)` retorna `undefined`, lo cual MUI ignora. Está bien, pero se podría evitar el llamado a la función si no está definida: `{secondaryAction && secondaryAction(item)}`.
- **Falta `disableRipple` o personalización de `ListItem`:** Los `ListItem` tienen efecto ripple por defecto de MUI. No hay forma de desactivarlo sin sobrescribir el `sx`. Podría agregarse una prop opcional para controlarlo.
- **`maxHeight: 360px` fijo en `List`:** Podría ser una prop para que el consumidor decida la altura máxima, mejorando la reutilización.

### ContainerForPages
- **Falta un key en el `<main>` para la animación `Grow`:** Si el `optionsLayout` cambia dinámicamente, React podría no detectar el cambio y la animación `Grow` no se reproduciría porque el mismo nodo `<main>` se recicla. Se podría forzar el remontado con un `key` basado en `optionsLayout`.
- **No sanitiza `classNamePersonalized`:** Al usar `"personalized"`, el valor se inyecta directamente como className. Si se pasa un string vacío o clases inválidas, el layout se rompe silenciosamente. Considerar un valor por defecto o validación mínima.
- **`activeEffectVisible` como boolean:** Cuando es `false` o `undefined`, no hay animación. Pero no hay forma de controlar el `timeout` del `Grow` (actualmente hardcodeado en 500ms). Podría exponerse como prop opcional.
- **El caso `default` del switch asigna un fallback visual (`bg-red-500`):** Es útil en desarrollo, pero en producción se vería un rectángulo rojo. Considerar si en producción debería lanzar un error/warning en consola en lugar de (o además de) mostrar el fallback.
