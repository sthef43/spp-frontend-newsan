# Documentación: ComponentsMUIModify

> **Ruta:** `src/app/shared/helpers/ComponentsMUIModify/`  
> **Tipo:** Módulo de componentes helpers (modificación/encapsulación de MUI)  
> **Fecha de documentación:** 14/07/2026

---

## Resumen

Este módulo agrupa componentes utilitarios que **extienden, modifican o encapsulan** componentes de Material-UI para su uso en el sistema SPP. Su propósito es centralizar personalizaciones visuales y de comportamiento que se repiten en varias partes del proyecto, evitando duplicación de estilos y lógica.

Los componentes aquí definidos son:

- **IconsModified**: Wrapper que agrega un contenedor con color de fondo (adaptable a modo oscuro) a íconos de MUI, proveyendo variantes preconfiguradas (editar, eliminar, restaurar, etc.).
- **MultiSelectModified**: Select múltiple de MUI con chips, genérico y reutilizable.
- **PopperComponent**: Popper con hover, animación Fade y timeout, que muestra un menú de acciones o contenido personalizado.
- **TooltipComponent**: Tooltip con dos modos (`normal` y `HtmlType`) que envuelve un `IconButton`, reenviando todas las props de `TooltipProps`.

> **Nota:** `StepperComponent` tiene su propia documentación por separado en `StepperComponent/DOCUMENTACION.md`.

---

## Estructura de Archivos

```
ComponentsMUIModify/
├── IconsModified.tsx          # Componentes de íconos con contenedor estilizado
├── MultiSelectModified.tsx    # Select múltiple MUI con chips
├── PopperComponent.tsx        # Popper con hover y animación
├── StepperComponent.tsx       # Stepper Qonto genérico (documentado aparte)
├── StepperComponent/
│   └── DOCUMENTACION.md       # Documentación del StepperComponent
└── DOCUMENTACION.md           # Este archivo
```

---

## 1. IconsModified

> **Archivo:** `IconsModified.tsx`  
> **Tipo:** Módulo de componentes (8 componentes exportados + 1 interno)

### Resumen

Provee una serie de componentes de íconos preconfigurados con un contenedor que les da un fondo circular/redondeado con color específico según el tipo de acción (editar, eliminar, restaurar, etc.). Soporta **modo oscuro** automáticamente mediante el `theme` de MUI.

### Componentes Exportados

| Componente              | Tipo de Botón      | Ícono MUI            | Color Aplicado     |
| ----------------------- | ------------------ | -------------------- | ------------------ |
| `EditIconEdited`        | `editButton`       | `EditRounded`        | `primary`          |
| `EditRestoreRounded`    | `restoreButton`    | `RestoreRounded`     | `secondary`        |
| `ImageIconEdited`       | `editButton`       | `ImageRounded`       | `primary`          |
| `EnterpriseIconEdited`  | `editButton`       | `MapsHomeWorkRounded`| `primary`          |
| `ShippingIconEdited`    | `shippingButton`   | `LocalShippingRounded`| `#FFB53F` (fill)  |
| `DeleteIconEdited`      | `deleteButton`     | `DeleteRounded`      | `error`            |
| `ViewListIconEdited`    | `viewListButton`   | `ViewListRounded`    | `primary`          |
| `CheckListIconEdited`   | `checkListButton`  | `ChecklistRounded`   | `primary`          |
| `ChartButtonIconEdited`  | `chartButton`      | `BarChartRounded`    | `primary`          |

### Props

Todos los componentes exportados aceptan las siguientes props:

| Prop         | Tipo     | Requerida | Descripción                                    |
| ------------ | -------- | --------- | ---------------------------------------------- |
| `size`       | `string` | ❌        | Tamaño del ícono (valor CSS para `font-size`). Por defecto `"1.5rem"`. |
| `colorLight` | `string` | ❌        | Color de fondo en **modo claro** (sobrescribe el color por defecto). |

### Componente Interno `IconContainer`

- **Props:** `children`, `typeButton` (de tipo `IIconContainerProps`), `size?`, `colorLight?`
- Está memoizado con `React.memo` para evitar re-renderizados innecesarios.
- Usa `useTheme()` para detectar `theme.palette.mode` (light/dark).
- Aplica `backgroundColor`, `borderRadius`, `padding` y tamaño del ícono vía `sx`.
- La paleta `palleteColors` está tipada explícitamente (`PaletteColors`) para evitar keys inválidas en runtime.

### Paleta de Colores (`palleteColors`)

| Tipo            | Light (bg)          | Dark (bg)          | Border Radius |
| --------------- | ------------------- | ------------------ | ------------- |
| `editButton`    | `#EFF6FF`           | `#042657`          | `12px`        |
| `restoreButton` | `#FFF5F5`           | `#320606ff`        | `12px`        |
| `shippingButton`| `#FFEFD7`           | `#5f5200`          | `12px`        |
| `deleteButton`  | `#FFF5F5`           | `#320606ff`        | `12px`        |
| `viewListButton`| `#FFF5F5`           | `#320606ff`        | `12px`        |
| `checkListButton`| `#FFF5F5`          | `#320606ff`        | `12px`        |
| `chartButton`   | `#e3f4fcff`         | `#263340ff`        | `0.5rem`      |

### Dependencias Internas

| Import              | Ruta                                      | Propósito                        |
| ------------------- | ----------------------------------------- | -------------------------------- |
| `BarChartRounded`+  | `@mui/icons-material`                     | Íconos Material Design           |
| `useTheme`, `Box`   | `@mui/material`                           | Tema MUI y contenedor            |

### Estilos Aplicados

- **MUI `sx`:** `display: "inline-flex"`, `backgroundColor` dinámico (light/dark), `borderRadius` por tipo, `padding: "0.3rem"`.
- **Selector interno:** `& .MuiSvgIcon-root` con `fontSize` dinámico.

### Ejemplo de Uso

```tsx
import { EditIconEdited, DeleteIconEdited } from "app/shared/helpers/ComponentsMUIModify/IconsModified";

// Uso básico
<EditIconEdited />

// Con tamaño y color de fondo personalizado (solo para los que aceptan props)
<DeleteIconEdited size="2rem" colorLight="#f0f0f0" />
```

---

## 2. MultiSelectModified

> **Archivo:** `MultiSelectModified.tsx`  
> **Tipo:** Componente React funcional genérico `<T>`

### Resumen

Select múltiple de MUI con representación en chips. Es genérico (`<T>`) y permite pasar cualquier tipo de dato como opciones, extrayendo el valor a mostrar mediante una función `valueSelect`.

### Props

| Prop              | Tipo                     | Requerida | Descripción                                    |
| ----------------- | ------------------------ | --------- | ---------------------------------------------- |
| `labelSelect`     | `string`                 | ✅        | Etiqueta del campo (`InputLabel`).             |
| `listValuesSelected` | `string[]`            | ✅        | Array de valores seleccionados (control externo). |
| `varianteEstilo`  | `"standard" \| "outlined" \| "filled"` | ❌ | Variante del `Select` MUI. Por defecto `"outlined"`. |
| `options`         | `T[]`                    | ✅        | Array de opciones del tipo genérico `T`.       |
| `setValues`       | `(newValue: string[]) => void` | ✅    | Callback para actualizar los valores seleccionados. |
| `valueSelect`     | `(value: T) => string`   | ✅        | Función que extrae el string a mostrar/guardar de cada opción `T`. |

### Estado Local

| Variable | Tipo     | Valor Inicial | Uso                            |
| -------- | -------- | ------------- | ------------------------------ |
| No tiene estado local propio (es controlado externamente vía `listValuesSelected`). |

### Hooks Utilizados

Ninguno. Es un componente puramente controlado.

### Llamadas a API

Ninguna.

### Modelos / Interfaces

```typescript
interface Props<T> {
  labelSelect: string;
  listValuesSelected: string[];
  varianteEstilo?: "standard" | "outlined" | "filled";
  options: T[];
  setValues: (newValue: string[]) => void;
  valueSelect: (value: T) => string;
}
```

### Componentes MUI Utilizados

| Componente    | Paquete         | Uso                                    |
| ------------- | --------------- | -------------------------------------- |
| `Box`         | `@mui/material` | Contenedor flex de los chips           |
| `Chip`        | `@mui/material` | Chip por cada valor seleccionado        |
| `FormControl` | `@mui/material` | Control de formulario contenedor       |
| `InputLabel`  | `@mui/material` | Etiqueta del select                    |
| `MenuItem`    | `@mui/material` | Opción individual                      |
| `Select`      | `@mui/material` | Select múltiple                        |

### Estilos Aplicados

- **Tailwind CSS:** `w-full` en el contenedor `<main>`.
- **MUI `sx`:** `display: "flex", flexWrap: "wrap", gap: 0.5` en Box de chips. `fontWeight: "bold"` en items seleccionados.
- **MenuProps:** Altura máxima del menú desplegable: `ITEMS_HEIGHT * 4.5 + ITEM_PADDING_TOP` (224px).

### Dependencias Internas

Ninguna (solo MUI y React).

### Notas y Consideraciones

- El componente fuerza el uso de `valueSelect` para obtener el `string` de cada opción. Esto significa que el **valor** del select siempre es de tipo `string`, no el objeto genérico `T`.
- La key de cada `MenuItem` y `Chip` usa el valor de `valueSelect`, que debe ser único.
- El `Chip` usa `key={index}` (índice del array) en lugar de un identificador único, lo que puede causar problemas de renderizado si el orden de los seleccionados cambia.

### Ejemplo de Uso

```tsx
import { MultiSelectModified } from "app/shared/helpers/ComponentsMUIModify/MultiSelectModified";

interface IOption { id: number; name: string; }

const [selected, setSelected] = useState<string[]>([]);
const options: IOption[] = [{ id: 1, name: "Opción A" }, { id: 2, name: "Opción B" }];

<MultiSelectModified
  labelSelect="Seleccionar opciones"
  listValuesSelected={selected}
  options={options}
  setValues={(newVal) => setSelected(newVal)}
  valueSelect={(opt) => opt.name}
/>
```

---

## 3. PopperComponent

> **Archivo:** `PopperComponent.tsx`  
> **Tipo:** Componente React funcional genérico `<T>`

### Resumen

Componente que muestra un `Popper` de MUI al hacer hover sobre un `IconButton`. Soporta dos modos de visualización:
1. **Modo por defecto** (`children`): Muestra un panel con título "Acciones" y el contenido.
2. **Modo personalizado** (`customChildren`): Renderiza contenido totalmente personalizado sin el layout por defecto.

Usa un timeout de 50ms en el `onMouseLeave` para evitar cierres bruscos al mover el mouse.

### Props

| Prop              | Tipo                          | Requerida | Descripción                                    |
| ----------------- | ----------------------------- | --------- | ---------------------------------------------- |
| `elemento`        | `T`                           | ✅        | Elemento genérico asociado a este popper.      |
| `elementoIndex`   | `(item: T) => string \| number` | ✅      | Función para generar un identificador único para el popper (usado en el `id` del aria). |
| `children`        | `React.ReactNode`             | ❌        | Contenido del panel por defecto (con header "Acciones"). |
| `showElement`     | `React.ReactNode \| JSX.Element` | ❌     | Ícono/elemento a mostrar en el botón (por defecto `MoreHorizRounded`). |
| `customChildren`  | `React.ReactNode \| JSX.Element` | ❌     | Contenido personalizado que reemplaza el layout por defecto. |

### Estado Local

| Variable       | Tipo                 | Valor Inicial | Uso                                        |
| -------------- | -------------------- | ------------- | ------------------------------------------ |
| `anchorEl`     | `null \| HTMLElement`| `null`        | Elemento ancla para posicionar el Popper.  |
| `timeoutPopperRef` | `NodeJS.Timeout \| null` | `null`   | Referencia al timeout para el cierre con retardo. |

### Hooks Utilizados

| Hook             | Origen    | Descripción                                                |
| ---------------- | --------- | ---------------------------------------------------------- |
| `useState`       | React     | Maneja `anchorEl` para controlar apertura/cierre del popper. |
| `useRef`         | React     | Referencia mutable `timeoutPopperRef` para el timeout.     |
| `useEffect`      | React     | Cleanup del timeout al desmontar el componente.            |

### Efectos

| Dependencias | Efecto                                                   |
| ------------ | -------------------------------------------------------- |
| `[]`         | Al desmontar, limpia el timeout pendiente si existe (prevención de memory leaks). |

### Componentes MUI Utilizados

| Componente    | Paquete          | Uso                                    |
| ------------- | ---------------- | -------------------------------------- |
| `IconButton`  | `@mui/material`  | Botón disparador del popper.           |
| `Popper`      | `@mui/material`  | Panel flotante con posicionamiento.    |
| `Fade`        | `@mui/material`  | Animación de entrada/salida.           |
| `MoreHorizRounded` | `@mui/icons-material` | Ícono por defecto del botón.      |
| `Box`         | `@mui/system`    | Contenedor del contenido del popper.   |

### Estilos Aplicados

- **Clases CSS globales:** `relative`, `pointer-events-auto`, `no-hover-zone` en el contenedor.
- **Tailwind CSS:** `p-2`, `px-3 py-2`, `border-b`, `border-gray-200`, `text-xl`, `font-bold`, `px-2 py-2 mt-2`, `flex`, `flex-col`, `gap-y-2`.
- **MUI `sx`:** `border`, `borderColor`, `backgroundColor: "var(--secondary-color)"`, `zIndex`, `minWidth`, `borderRadius`, `boxShadow`.
- **Variables CSS:** `var(--secondary-color)` para fondo del popper.
- **Modifiers de Popper:** `preventOverflow` con boundary `"viewport"`.

### Dependencias Internas

Ninguna (solo MUI y React).

### Notas y Consideraciones

- El popper se oculta automáticamente al hacer `mouseleave` del contenedor, con un retardo de 50ms para mejor UX.
- El `id` del popper se genera dinámicamente usando `elementoIndex(elemento)`, con formato `popper-{id}`.
- El `zIndex` del popper está fijo en `1300` (estilo inline).
- No hay soporte para teclado (solo hover), lo que podría ser un problema de accesibilidad.

### Ejemplo de Uso

```tsx
import { PopperComponent } from "app/shared/helpers/ComponentsMUIModify/PopperComponent";

// Modo por defecto
<PopperComponent
  elemento={row}
  elementoIndex={(item) => item.id}
>
  <button onClick={() => handleEdit(row)}>Editar</button>
  <button onClick={() => handleDelete(row)}>Eliminar</button>
</PopperComponent>

// Modo personalizado
<PopperComponent
  elemento={row}
  elementoIndex={(item) => item.id}
  showElement={<InfoIcon />}
  customChildren={<CustomPanel data={row} />}
/>
```

---

## 4. TooltipComponent

> **Archivo:** `TooltipComponent.tsx`  
> **Tipo:** Componente React funcional `FC<Props>`

### Resumen

Componente que encapsula un `IconButton` de MUI dentro de un `Tooltip`. Ofrece dos modos de operación:

- **`normal`**: Tooltip estándar de MUI.
- **`HtmlType`**: Tooltip personalizado con estilos propios (`styleTooltip`) y contenido complejo (`children`).

Todas las props nativas de `TooltipProps` (como `placement`, `arrow`, `enterDelay`) se reenvían automáticamente mediante `...rest`.

### Props

Usa un **discriminated union** basado en `typeTooltip`:

#### Props comunes (base `props`)

| Prop               | Tipo                          | Requerida | Descripción                                    |
| -------------------| ----------------------------- | --------- | ---------------------------------------------- |
| `titleTooltip`     | `string \| ReactNode`         | ✅        | Contenido título del tooltip.                  |
| `iconComponent`  | `ReactNode`                   | ❌        | Ícono a renderizar dentro del `IconButton`.    |
| `componenteIcono`  | `ReactNode`                   | ❌        | **(deprecated)** Usar `iconComponent`.         |
| `children`         | `ReactNode`                   | ❌        | Contenido extra **solo en modo `HtmlType`**.   |
| `disabled`         | `boolean`                     | ❌        | Deshabilita el `IconButton`.                   |
| `sizeButton`       | `"small" \| "medium" \| "large"` | ❌    | Tamaño del `IconButton`.                       |
| `styleIconButton`  | `React.CSSProperties`         | ❌        | Estilos inline para el `IconButton`.           |

#### Props específicas por tipo

**Modo `normal`:**

| Prop           | Tipo                | Requerida | Descripción                              |
| -------------- | ------------------- | --------- | ---------------------------------------- |
| `typeTooltip`  | `"normal"`          | ✅        | Modo tooltip estándar.                   |
| `styleTooltip` | `React.CSSProperties` | ❌      | Estilos opcionales (no se usan internamente en modo normal). |

**Modo `HtmlType`:**

| Prop           | Tipo                | Requerida | Descripción                              |
| -------------- | ------------------- | --------- | ---------------------------------------- |
| `typeTooltip`  | `"HtmlType"`        | ✅        | Modo tooltip con estilo personalizado.   |
| `styleTooltip` | `React.CSSProperties` | ✅      | Estilos CSS para el popper del tooltip.  |

**Props reenviadas:** Todas las demás props de `TooltipProps` (como `placement`, `arrow`, `enterDelay`, `enterNextDelay`, etc.) se pasan automáticamente al `Tooltip`.

### Estado Local

Ninguno.

### Hooks Utilizados

Ninguno hook de React. El componente es puramente funcional.

### Componentes MUI Utilizados

| Componente    | Paquete          | Uso                                    |
| ------------- | ---------------- | -------------------------------------- |
| `IconButton`  | `@mui/material`  | Botón que contiene el ícono.           |
| `Tooltip`     | `@mui/material`  | Tooltip contenedor.                    |
| `Typography`  | `@mui/material`  | Título dentro del tooltip en modo `HtmlType`. |
| `styled`      | `@mui/material/styles` | Creación del `HtmlTooltip` personalizado. |

### Estilos Aplicados

- **MUI `styled`:** `HtmlTooltip` personalizado con:
  - `backgroundColor: "var(--secondary-color)"`
  - `border: "1px solid var(--background-color)"`
  - `padding: 0`
  - `color: "var(--text-color)"`
- **Modo normal:** `PopperProps={{ sx: { zIndex: 99999 } }}` para z-index alto.
- **Modo `HtmlType`:** Estilos del tooltip definidos por `styleTooltip` prop.
- **Contenedor:** `className="flex flex-row items-center"` (Tailwind).

### Variables CSS Utilizadas

| Variable                    | Uso                                          |
| --------------------------- | -------------------------------------------- |
| `var(--secondary-color)`    | Fondo del tooltip (modo `HtmlType`).         |
| `var(--background-color)`   | Borde del tooltip (modo `HtmlType`).         |
| `var(--text-color)`         | Color del texto del tooltip.                 |

### Dependencias Internas

Ninguna (solo MUI y React).

### Notas y Consideraciones

- El componente envuelve el `IconButton` en un `<span>` para que el tooltip funcione correctamente cuando el botón está deshabilitado (los elementos deshabilitados no disparan eventos hover).
- Si no se pasa `iconComponent` (ni el deprecado `componenteIcono`), el `IconButton` no se renderiza.
- El `zIndex` del tooltip se ha establecido en `1500` para evitar conflictos con otros elementos superpuestos.
- El componente fuerza el uso de `typeTooltip` mediante el discriminated union, lo que permite TypeScript validar las props requeridas según el modo.
- `HtmlTooltip` se define fuera del componente (memoizado) para evitar redefiniciones en cada render.

### Ejemplo de Uso

```tsx
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import DeleteIcon from "@mui/icons-material/Delete";

// Modo normal
<TooltipComponent
  typeTooltip="normal"
  titleTooltip="Eliminar registro"
  iconComponent={<DeleteIcon />}
  placement="top"
/>

// Modo HtmlType con contenido adicional
<TooltipComponent
  typeTooltip="HtmlType"
  titleTooltip="Información"
  iconComponent={<InfoIcon />}
  styleTooltip={{ backgroundColor: '#333', color: '#fff', fontSize: '14px' }}
  arrow
  enterDelay={500}
>
  <Typography variant="caption">Detalle adicional aquí</Typography>
</TooltipComponent>
```

---

## Mejoras / Observaciones del Revisor

> **Estado:** Las observaciones documentadas a continuación han sido corregidas. Esta sección se mantiene como registro histórico de la revisión. Los cambios aplicados se detallan en el resumen de correcciones.

### IconsModified ✅

- ✅ **Tipado:** `palleteColors` ahora está tipada explícitamente como `PaletteColors` (Record con todas las keys de botón).
- ✅ **Tipado:** `colorLigth` renombrado a `colorLight` en toda la base de código (componente + consumidores).
- ✅ **Tipado:** Las interfaces se renombraron a `IIconContainerProps` e `IIconProps` (prefijo `I`).
- ✅ **Rendimiento:** `IconContainer` envuelto con `React.memo` y `displayName`.
- ⚠️ **Mantenibilidad:** Los colores de `palleteColors` siguen hardcodeados; centralizar en tema CSS queda como mejora futura.
- ✅ **Mantenibilidad:** Todos los componentes (`EditIconEdited`, `EditRestoreRounded`, etc.) ahora aceptan `size` y `colorLight`, con interfaz unificada.
- ⚠️ **UX:** El padding no uniforme al cambiar tamaño del ícono se mantiene como limitación conocida del diseño actual.

### MultiSelectModified ✅

- ✅ **Rendimiento:** Wrapper `<main>` reemplazado por `<Box>`.
- ✅ **Rendimiento:** `Chip` usa `key={value}` en lugar de `key={index}`.
- ✅ **Tipado:** `T` ahora tiene constraint `extends Record<string, unknown>`.
- ⚠️ **Tipado:** El tipado de `handleChangeValues` con `SelectChangeEvent<string[]>` se mantiene por compatibilidad con la firma de MUI.
- ✅ **Estándares SPP:** Interfaz renombrada de `Props` a `IProps`.
- ✅ **UX:** Se agregó placeholder con `displayEmpty` y mensaje "Seleccionar opciones..." cuando no hay valores seleccionados.
- ✅ **Deuda técnica:** Se eliminó el comentario `eslint-disable`.

### PopperComponent ✅

- ✅ **Accesibilidad:** Se agregó soporte de teclado: `onClick` (Enter/Space) para abrir/cerrar, `onFocus` para apertura, tecla `Escape` para cierre.
- ✅ **Accesibilidad:** Se agregaron atributos `aria-haspopup="menu"` y `aria-expanded`.
- ✅ **Accesibilidad:** Manejo de cierre con tecla `Escape`.
- ✅ **Bug potencial:** `NodeJS.Timeout` reemplazado por `ReturnType<typeof setTimeout>`.
- ✅ **Mantenibilidad:** Lógica de timeout simplificada con `clearCurrentTimeout` memoizado.
- ✅ **Mantenibilidad:** `zIndex` extraído a constante `POPPER_Z_INDEX`.
- ✅ **UX:** Timeout de hover incrementado de 50ms a 200ms.
- ✅ **Estándares SPP:** `var(--secondary-color)` reemplazado por `theme.palette.secondary.main`.

### TooltipComponent ✅

- ✅ **Rendimiento:** `HtmlTooltip` movido fuera del componente (definición global, memoizado).
- ✅ **Rendimiento:** `switch` reemplazado por objeto de lookup `tooltipRenderers`.
- ✅ **Tipado:** Se agregó `default` en el lookup con `console.warn` si el tipo no es válido.
- ✅ **Tipado:** Eliminada variable redundante `typeTooltipPredetermined`; se usa `typeTooltip ?? "normal"`.
- ✅ **Mantenibilidad:** Lógica del `IconButton` unificada en el lookup; solo varía el tooltip según el modo.
- ✅ **Mantenibilidad:** Se agregó `iconComponent` como nombre en inglés; `componenteIcono` se mantiene como deprecated con backward compatibility.
- ✅ **Seguridad:** `IconButton` no se renderiza si no hay `iconComponent` (ni `componenteIcono` deprecated).
- ✅ **UX:** `zIndex` reducido de `99999` a `1500`.
- ✅ **Estándares SPP:** Interfaz `props` renombrada a `IProps`.
