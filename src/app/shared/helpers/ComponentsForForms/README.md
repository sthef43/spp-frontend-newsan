# Componentes Genéricos de Formulario

> **Ruta:** `src/app/shared/helpers/ComponentsForForms/`
> **Tipo:** Componentes genéricos reutilizables
> **Propósito:** Proveer campos de formulario (input y select) pre-integrados con React Hook Form y MUI, además de una variante sin dependencia de react-hook-form para uso libre.

---

## Tabla Comparativa

| Componente | Integración React Hook Form | Selección múltiple | Genérico (`<T>`) | Dependencia principal |
|---|---|---|---|---|
| `InputComponentForm` | ✅ (`useController`) | ❌ | ✅ `T extends FieldValues` | `react-hook-form`, `@mui/material` |
| `SelectComponentForm` | ✅ (`useController`) | ✅ (`activeMultiple`) | ✅ `T extends FieldValues, TItem` | `react-hook-form`, `@mui/material` |
| `SelectComponentNormal` | ❌ (control manual) | ✅ (`activeMultiple`) | ✅ `TItem` | `@mui/material` |

---

## 1. InputComponentForm

### Descripción

Campo de texto (`<TextField>` de MUI) integrado con React Hook Form mediante `useController`. Ideal para formularios gobernados por RHF donde se necesita un input de texto, número o contraseña con validación. Expone toda la API de `UseControllerProps` más propiedades de personalización visual.

### Props

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `name` | `string` (heredado de `UseControllerProps`) | ✅ | — | Nombre del campo en el formulario RHF |
| `control` | `Control<T>` (heredado de `UseControllerProps`) | ✅ | — | Controlador de React Hook Form (obtenido de `useForm()`) |
| `rules` | `Omit<RegisterOptions, ...>` (heredado de `UseControllerProps`) | ❌ | — | Reglas de validación de RHF |
| `label` | `string` | ❌ | — | Etiqueta visible del campo |
| `placeholder` | `string` | ❌ | — | Placeholder del input |
| `variant` | `"standard" \| "outlined" \| "filled"` | ❌ | `"outlined"` | Variante visual del TextField |
| `typeDate` | `"number" \| "password" \| "text"` | ❌ | `"text"` | Tipo de input HTML |
| `disabled` | `boolean` | ❌ | `false` | Deshabilita el campo |
| `stylesPersonalizaed` | `SxProps<Theme>` | ❌ | — | Estilos personalizados vía prop `sx` de MUI |
| `iconInput` | `React.ReactNode` | ❌ | — | Adorno inicial (icono) dentro del input |
| `onKeyDown` | `React.KeyboardEventHandler<HTMLDivElement>` | ❌ | — | Handler para evento `onKeyDown` |

### Uso básico

```tsx
import { useForm } from "react-hook-form";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";

interface IForm {
  nombre: string;
  edad: number;
}

const { control, handleSubmit } = useForm<IForm>();

<InputComponentForm
  name="nombre"
  control={control}
  label="Nombre completo"
  placeholder="Ingrese su nombre"
  rules={{ required: "El nombre es obligatorio", minLength: { value: 3, message: "Mínimo 3 caracteres" } }}
  typeDate="text"
  variant="outlined"
  iconInput={<PersonIcon />}
  onKeyDown={(e) => console.log("Tecla presionada:", e.key)}
/>

<InputComponentForm
  name="edad"
  control={control}
  label="Edad"
  typeDate="number"
  disabled={false}
/>
```

### Dependencias

| Dependencia | Versión (referencial) | Propósito |
|---|---|---|
| `react` | ^18 | Base del componente |
| `@mui/material` | ^5 | `FormControl`, `TextField`, `SxProps`, `Theme` |
| `react-hook-form` | ^7 | `useController`, `UseControllerProps`, `FieldValues` |

---

## 2. SelectComponentForm

### Descripción

Select nativo de MUI integrado con React Hook Form mediante `useController`. Soporta selección simple y múltiple (con chips). Es completamente genérico (`<TItem>`) y recibe dos funciones (`valueLabel` y `valueSelect`) para mapear cualquier tipo de objeto a su representación visual y valor interno.

### Props

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `name` | `string` (heredado de `UseControllerProps`) | ✅ | — | Nombre del campo en el formulario RHF |
| `control` | `Control<T>` (heredado de `UseControllerProps`) | ✅ | — | Controlador de React Hook Form |
| `rules` | `Omit<RegisterOptions, ...>` (heredado de `UseControllerProps`) | ❌ | — | Reglas de validación de RHF |
| `listItems` | `TItem[]` | ✅ | `[]` | Array de items a mostrar en el Select |
| `valueLabel` | `(item: TItem) => string` | ✅ | — | Función que extrae el texto visible de cada item |
| `valueSelect` | `(item: TItem) => string \| number` | ✅ | — | Función que extrae el valor interno de cada item |
| `label` | `string` | ✅ | — | Etiqueta visible del campo |
| `activeMultiple` | `boolean` | ❌ | `false` | Habilita selección múltiple |
| `onMultipleChange` | `(item: Array<string \| number>) => void` | ❌ | — | Callback adicional que se ejecuta al cambiar valores en modo múltiple |
| `variant` | `"standard" \| "outlined" \| "filled"` | ❌ | `"outlined"` | Variante visual del Select |
| `disabled` | `boolean` | ❌ | — | Deshabilita el campo |

### Uso básico

```tsx
import { useForm } from "react-hook-form";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";

interface IOption {
  id: number;
  descripcion: string;
}

const opciones: IOption[] = [
  { id: 1, descripcion: "Opción A" },
  { id: 2, descripcion: "Opción B" },
  { id: 3, descripcion: "Opción C" },
];

const { control } = useForm<{ categoria: number }>();

{/* Selección simple */}
<SelectComponentForm
  name="categoria"
  control={control}
  label="Categoría"
  listItems={opciones}
  valueLabel={(item) => item.descripcion}
  valueSelect={(item) => item.id}
  rules={{ required: "Seleccione una categoría" }}
/>

{/* Selección múltiple con chips */}
<SelectComponentForm
  name="categorias"
  control={control}
  label="Categorías"
  listItems={opciones}
  valueLabel={(item) => item.descripcion}
  valueSelect={(item) => item.id}
  activeMultiple
  onMultipleChange={(vals) => console.log("Valores seleccionados:", vals)}
/>
```

### Dependencias

| Dependencia | Versión (referencial) | Propósito |
|---|---|---|
| `react` | ^18 | Base del componente |
| `@mui/material` | ^5 | `Box`, `Chip`, `FormControl`, `FormHelperText`, `InputLabel`, `MenuItem`, `Select`, `SelectChangeEvent` |
| `react-hook-form` | ^7 | `useController`, `UseControllerProps`, `FieldValues` |

---

## 3. SelectComponentNormal

### Descripción

Variante del Select sin dependencia de `react-hook-form`. Útil cuando se necesita un componente de selección fuera del contexto de RHF, o cuando el control del estado es manual (con `useState` propio del padre). Soporta selección simple y múltiple con chips. Es genérico (`<TItem>`) y recibe las funciones `valueLabel`/`valueSelect` para mapear cualquier tipo de objeto.

### Props

| Prop | Tipo | Requerida | Default | Descripción |
|---|---|---|---|---|
| `listItems` | `TItem[]` | ✅ | `[]` | Array de items a mostrar en el Select |
| `valueLabel` | `(item: TItem) => string` | ✅ | — | Función que extrae el texto visible de cada item |
| `valueSelect` | `(item: TItem) => string \| number` | ✅ | — | Función que extrae el valor interno de cada item |
| `value` | `string \| number \| Array<string \| number>` | ✅ | — | Valor controlado (desde el padre) |
| `onChange` | `(newValue: string \| number \| Array<string \| number> \| TItem) => void` | ✅ | — | Callback al cambiar la selección |
| `label` | `string` | ✅ | — | Etiqueta visible del campo |
| `activeMultiple` | `boolean` | ❌ | `false` | Habilita selección múltiple |
| `variant` | `"standard" \| "outlined" \| "filled"` | ❌ | `"outlined"` | Variante visual del Select |
| `disabled` | `boolean` | ❌ | `false` | Deshabilita el campo |
| `error` | `boolean` | ❌ | `false` | Muestra estado de error visual |
| `helperText` | `string` | ❌ | `" "` | Texto de ayuda (se muestra si `error` es `true`) |

### Uso básico

```tsx
import { useState } from "react";
import { SelectComponentNormal } from "app/shared/helpers/ComponentsForForms/SelectComponentNormal";

interface IOption {
  id: number;
  descripcion: string;
}

const opciones: IOption[] = [
  { id: 1, descripcion: "Opción A" },
  { id: 2, descripcion: "Opción B" },
  { id: 3, descripcion: "Opción C" },
];

const [selectedValue, setSelectedValue] = useState<number | string>("");
const [multiValues, setMultiValues] = useState<Array<string | number>>([]);

{/* Selección simple */}
<SelectComponentNormal
  label="Categoría"
  listItems={opciones}
  valueLabel={(item) => item.descripcion}
  valueSelect={(item) => item.id}
  value={selectedValue}
  onChange={(newVal) => setSelectedValue(newVal as number | string)}
/>

{/* Selección múltiple */}
<SelectComponentNormal
  label="Categorías"
  listItems={opciones}
  valueLabel={(item) => item.descripcion}
  valueSelect={(item) => item.id}
  value={multiValues}
  onChange={(newVal) => setMultiValues(newVal as Array<string | number>)}
  activeMultiple
  error={multiValues.length === 0}
  helperText={multiValues.length === 0 ? "Seleccione al menos una opción" : " "}
/>
```

### Dependencias

| Dependencia | Versión (referencial) | Propósito |
|---|---|---|
| `react` | ^18 | Base del componente |
| `@mui/material` | ^5 | `Box`, `Chip`, `FormControl`, `FormHelperText`, `InputLabel`, `MenuItem`, `Select`, `SelectChangeEvent` |

A diferencia de los otros dos componentes, `SelectComponentNormal` **no** depende de `react-hook-form`, lo que lo hace ideal para formularios simples, filtros de búsqueda, o cualquier escenario donde no se necesite el ecosistema RHF.

---

## Consideraciones Técnicas

1. **Tipado Genérico:** Los tres componentes son genéricos. `InputComponentForm` usa `T extends FieldValues` (restringido al tipo de formulario RHF). Los selects usan `TItem` para aceptar cualquier tipo de objeto en `listItems`.

2. **Selección Múltiple:** En ambos Select, al activar `activeMultiple`:
   - El menú desplegable limita su altura a `4.5 items` (48px cada uno + padding).
   - Los valores seleccionados se renderizan como `Chip` dentro de un `Box` con `flexWrap`.
   - El `MenuProps` deshabilita `Portal` para evitar problemas de z-index en contenedores con overflow oculto.

3. **Manejo de valor vacío:** Si `value` es `undefined` o `null`, se normaliza a `""` (o `[]` en modo múltiple) para evitar errores de control en MUI.

4. **Validación de formulario:** Tanto `InputComponentForm` como `SelectComponentForm` heredan las reglas de validación vía `rules` de `UseControllerProps`. El error se muestra automáticamente mediante `errors[name]?.message`.

5. **Callback adicional en SelectComponentForm:** La prop `onMultipleChange` es exclusiva de `SelectComponentForm` y permite ejecutar lógica extra (por ejemplo, limpiar otros campos) cuando cambia la selección múltiple.

---

## Notas y Advertencias

- Los componentes **no** deben modificarse directamente para casos de uso específicos. Si se necesita una variante, se recomienda extenderlos o componerlos desde el módulo consumidor.
- `SelectComponentForm` tiene un bloque comentado con `console.log` útil para depurar problemas de tipado entre `value` y los items de `listItems`. Puede descomentarse temporalmente durante el desarrollo.
- En `SelectComponentForm`, el `name` se usa como sufijo en `labelId` (`select-label-${name}`), por lo que debe ser único dentro del formulario.
- En `SelectComponentNormal`, el `label` se usa como sufijo en `labelId` (`select-label-${label}`), así que se recomienda que la etiqueta sea única si hay múltiples selects en la misma vista.

---

## Historial de Correcciones

### ✅ InputComponentForm (Corregido)
| Observación | Cambio aplicado |
|---|---|
| `InputProps` podría colisionar con `field` | Se agregó prop `InputProps` externa que se fusiona (`...spread`) con `startAdornment`. Si `iconInput` no está definido, usa `startAdornment` de `InputProps`. |
| `functionOnchange` renombrado | Se renombró a `onKeyDown` para reflejar su verdadero propósito. |
| Falta `autoFocus` / `inputRef` | Se agregó la prop `autoFocus` opcional. |

### ✅ SelectComponentForm (Corregido)
| Observación | Cambio aplicado |
|---|---|
| `setMultiplesValues` renombrado | Se renombró a `onMultipleChange` para claridad semántica. |
| `handleChange` con `split(",")` | Se eliminó el `split(",")` que causaba errores con valores con coma. MUI Select en modo múltiple ya devuelve un array. |
| `MenuItem` con `index` como `key` | Se cambió a `key={itemVal}` usando `valueSelect(elements)` como key única. Misma corrección aplicada a `Chip` key. |

### ✅ SelectComponentNormal (Corregido)
| Observación | Cambio aplicado |
|---|---|
| `MenuItem` con `index` como `key` | Se cambió a `key={itemVal}`. Misma corrección aplicada a `Chip` key. |
| Tipo `value` demasiado permisivo | Se eliminó `TItem` del tipo de `value` y `onChange`. Ahora acepta solo `string \| number \| Array<string \| number>`. |
| Sin `MenuProps` personalizable | Se agregó prop `MenuProps` opcional que se fusiona con los valores por defecto tanto en modo simple como múltiple. |
