# Documentación: Graficos

> **Ruta:** `src/app/shared/helpers/Graficos/`  
> **Tipo:** Módulo compartido reutilizable  
> **Fecha de documentación:** 2026-07-14

---

## Resumen

Módulo de gráficos genérico y reutilizable del sistema SPP, construido sobre la librería **Recharts**. Provee un único punto de entrada (`ContainerForGraphics`) que permite renderizar gráficos de **Área**, **Líneas** y **Barras** de forma intercambiable, con soporte para tooltip personalizado, panel de detalle lateral y segmentación visual por umbral (modo "doble gráfico"). Es consumido por múltiples dashboards y módulos de tableros del sistema.

---

## Estructura de Archivos

```
Graficos/
├── IConfigAreaGraficos.ts              # Interfaz genérica de configuración de series
├── containers/
│   └── ContainerForGraphics.tsx        # Punto de entrada principal. Orquesta el gráfico completo
├── layout/
│   └── LayoutSelectorGraphics.tsx      # Switch que renderiza el tipo de gráfico activo
├── components/
│   ├── CustomTooltip.tsx               # Tooltip personalizado para Recharts
│   ├── DetailInformation.tsx           # Panel lateral de información detallada al hacer click
│   ├── GroupButtons.tsx                # Botonera para cambiar el tipo de gráfico
│   └── graficos/
│       ├── AreaChartComponent.tsx      # Gráfico de Área con soporte de doble segmento (normal/warning)
│       ├── BarChartComponents.tsx      # Gráfico de Barras
│       └── LineaChartComponent.tsx     # Gráfico de Líneas
└── helpers/
    └── buildAreaSegments.tsx           # Función pura que transforma datos para gráfico doble segmento
```

---

## ContainerForGraphics

> **Archivo:** `containers/ContainerForGraphics.tsx`  
> **Tipo:** Componente genérico `<T,>` (Generic FC)  
> **Descripción:** Componente raíz del módulo. Orquesta el layout, el selector de tipo de gráfico, el gráfico activo y el panel de detalle lateral.

### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `data` | `T[]` | ✅ | Array de datos a graficar. Tipo genérico definido por el consumidor |
| `xAxisKey` | `Extract<keyof T, string>` | ✅ | Clave del objeto `T` que se usará como eje X |
| `areas` | `IConfigAreaGarficos<T>[]` | ✅ | Configuración de cada serie del gráfico (clave, color de línea, color de área) |
| `classNameStyles` | `string` | ✅ | Clases Tailwind CSS aplicadas al contenedor principal (`<main>`) |
| `activeDoubleChart` | `boolean` | ❌ | Activa el modo de doble segmento (normal/warning). Default: `false` |
| `keyForDoubleChart` | `Extract<keyof T, string>` | ❌ | Clave numérica del objeto `T` usada para calcular si un punto está por debajo del umbral |
| `thresholdForDoubleChart` | `number` | ❌ | Valor umbral. Los puntos por debajo se colorean como `warning` (rojo) |
| `titleTooltip` | `string` | ❌ | Texto que reemplaza al `label` del eje X en el tooltip |
| `activeDetailInformation` | `boolean` | ❌ | Muestra el panel lateral `DetailInformation` al hacer click en el gráfico. Default: `false` |
| `typeGraph` | `"Lineas" \| "Barras" \| "Circular" \| "Area"` | ❌ | Fija el tipo de gráfico. Si se omite, se muestra la botonera `GroupButtons` |
| `extraKeys` | `Array<{ title?: string; objectDate: Extract<keyof T, string>; render?: () => JSX.Element }>` | ❌ | Claves adicionales del objeto `T` a mostrar en el tooltip |
| `extraKeysMoreInformation` | `Array<{ title?: string; objectDate?: string; render?: () => React.ReactNode; renderObjetcDate?: (value: any) => JSX.Element }>` | ❌ | Claves adicionales para el panel lateral `DetailInformation` |

### Estado Local

| Variable | Tipo | Valor Inicial | Uso |
|---|---|---|---|
| `valueLayout` | `"Lineas" \| "Barras" \| "Circular" \| "Area"` | `typeGraph` (prop) | Tipo de gráfico activo. Se actualiza con `GroupButtons` |
| `payloadObject` | `any` | `undefined` | Almacena el payload del punto clickeado para pasarlo a `DetailInformation` |

### Hooks Utilizados

| Hook | Origen | Descripción |
|---|---|---|
| `useState` | React | Controla `valueLayout` y `payloadObject` |
| `useEffect` | React | Se dispara cuando `data` cambia; resetea `payloadObject` a `null` |

### Lógica de doble gráfico

Cuando `activeDoubleChart` es `true`, los datos se transforman antes de pasarlos al gráfico:

```typescript
const chartData = activeDoubleChart
  ? buildAreaSegments<T>({ data, valueKey: keyForDoubleChart, threshold: thresholdForDoubleChart })
  : data;
```

### Estilos Aplicados

| Clase | Dónde se aplica |
|---|---|
| `${classNameStyles} flex flex-row justify-between gap-x-4` | `<main>` contenedor general (con datos) |
| `w-full` / `w-[80%]` | Sección del gráfico según si hay panel lateral |
| `bg-secondaryNew p-4 rounded-md shadow-md my-4` | Card del gráfico |
| `w-[50%] bg-secondaryNew p-4 rounded-md shadow-md my-4` | Card del panel `DetailInformation` |
| `bg-secondaryNew border border-[#0d0d0d4f] border-dashed p-4 rounded-md shadow-md my-4 flex flex-col items-center justify-center gap-y-4` | Estado vacío (sin datos) |
| `text-xl font-bold` | Texto "No se encontraron datos" |
| `text-base font-medium text-gray-500` | Subtexto del estado vacío |

---

## LayoutSelectorGraphics

> **Archivo:** `layout/LayoutSelectorGraphics.tsx`  
> **Tipo:** Componente genérico `<T,>`  
> **Descripción:** Switch de presentación que renderiza el componente de gráfico según `activeLayout`.

### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `data` | `T[]` | ✅ | Datos a graficar (ya transformados si `activeDoubleChart` está activo) |
| `xAxisKey` | `Extract<keyof T, string>` | ✅ | Clave del eje X |
| `areas` | `IConfigAreaGarficos<T>[]` | ✅ | Configuración de series |
| `activeDoubleChart` | `boolean` | ✅ | Si el gráfico de área debe renderizar el segmento de warning |
| `activeLayout` | `"Lineas" \| "Barras" \| "Circular" \| "Area"` | ✅ | Tipo de gráfico a renderizar |
| `extraKeys` | `Array<...>` | ❌ | Claves extra para el tooltip |
| `setPayloadObject` | `(newValue: any) => void` | ❌ | Callback para subir el payload al click (solo usado por `AreaChartComponent`) |
| `titleTooltip` | `string` | ❌ | Título del tooltip |

### Lógica de switch

| Valor `activeLayout` | Componente renderizado |
|---|---|
| `"Lineas"` | `<LineaChartComponent>` |
| `"Area"` | `<AreaChartComponent>` |
| `"Circular"` | `<div>` placeholder (⚠️ sin implementar) |
| `"Barras"` | `<BarChartComponent>` |

---

## AreaChartComponent

> **Archivo:** `components/graficos/AreaChartComponent.tsx`  
> **Librería:** `recharts`  
> **Descripción:** Gráfico de área responsivo con múltiples series, gradientes SVG por área y modo de doble segmento (normal/warning).

### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `data` | `T[]` | ✅ | Datos del gráfico |
| `xAxisKey` | `Extract<keyof T, string>` | ✅ | Clave del eje X |
| `areas` | `IConfigAreaGarficos<T>[]` | ✅ | Series del gráfico con sus colores |
| `activeDoubleChart` | `boolean` | ✅ | Si es `true`, agrega el área `warning` (roja) |
| `extraKeys` | `Array<...>` | ❌ | Datos extra del tooltip |
| `setPayloadObject` | `(newValue: any) => void` | ❌ | Callback que sube el payload clickeado al padre |
| `titleTooltip` | `string` | ❌ | Título del tooltip |

### Comportamiento destacado

- Genera `<linearGradient>` SVG dinámico por cada área usando `area.fill` (de `opacity: 0.8` a `opacity: 0`)
- Si `activeDoubleChart` es `true`, agrega el área `warning` con color `#F44336` (rojo)
- Al hacer click en el gráfico llama a `setPayloadObject` con el payload del punto activo
- Usa `connectNulls` para conectar puntos cuando los datos de un segmento son `null`
- Animación: `animationBegin: 200ms`, `animationDuration: 1300ms`

---

## BarChartComponent

> **Archivo:** `components/graficos/BarChartComponents.tsx`  
> **Librería:** `recharts`  

### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `data` | `T[]` | ✅ | Datos del gráfico |
| `xAxisKey` | `Extract<keyof T, string>` | ✅ | Clave del eje X |
| `areas` | `IConfigAreaGarficos<T>[]` | ✅ | Series del gráfico |
| `extraKeys` | `Array<...>` | ❌ | Datos extra para el tooltip |

### Comportamiento destacado

- `radius={[10, 10, 0, 0]}`: bordes superiores redondeados
- Al hacer hover: `fill: "green"`, `stroke: "blue"`
- Incluye `<Legend>` de recharts

---

## LineaChartComponent

> **Archivo:** `components/graficos/LineaChartComponent.tsx`  
> **Librería:** `recharts`  

### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `data` | `T[]` | ✅ | Datos del gráfico |
| `xAxisKey` | `Extract<keyof T, string>` | ✅ | Clave del eje X |
| `areas` | `IConfigAreaGarficos<T>[]` | ✅ | Series: define el color de cada línea vía `stroke` |
| `extraKeys` | `Array<...>` | ❌ | Datos extra para el tooltip |
| `titleTooltip` | `string` | ❌ | Título del tooltip |

### Comportamiento destacado

- Animación: `animationBegin: 200ms`, `animationDuration: 1300ms`
- El `onClick` de `<Line>` solo ejecuta un `console.log` (pendiente de implementar)
- Incluye `<Legend>` de recharts

---

## CustomTooltip

> **Archivo:** `components/CustomTooltip.tsx`  
> **Descripción:** Tooltip personalizado inyectado en todos los gráficos recharts. Muestra datos adicionales del objeto al hacer hover.

### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `payload` | `Payload[]` (recharts) | ❌ | Payload del punto activo |
| `label` | `string` (recharts) | ❌ | Valor del eje X del punto activo |
| `active` | `boolean` (recharts) | ❌ | Si el tooltip está activo |
| `extraKeys` | `Array<{ title?: string; objectDate: string; render?: () => React.ReactNode }>` | ❌ | Claves adicionales a extraer del objeto de datos |
| `titleTooltip` | `string` | ❌ | Si se provee, reemplaza al `label` como título |

### Hooks Utilizados

| Hook | Origen | Descripción |
|---|---|---|
| `UseUtilHooks` | `app/shared/hooks/useUtilsHooks` | Provee `getNestedValue` para acceso a propiedades anidadas |

### Estilos

| Clase | Descripción |
|---|---|
| `w-[500px]` / `w-fit` | Ancho según si tiene `extraKeys` |
| `p-4 border border-gray-200 rounded-lg bg-white shadow-xl overflow-auto` | Contenedor |
| `text-sm font-bold mb-2` | Título |
| `mt-2 text-black w-full bg-background p-2 border border-gray-200 rounded-md flex flex-col` | Cada item de key extra |

---

## DetailInformation

> **Archivo:** `components/DetailInformation.tsx`  
> **Tipo:** `React.FC<Props>`  
> **Descripción:** Panel lateral que se muestra al hacer click en el gráfico. Presenta información detallada del punto seleccionado.

### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `rawData` | `any` | ✅ | Objeto de datos del punto clickeado |
| `extraKeys` | `Array<{ title?: string; objectDate?: string; render?: () => React.ReactNode; renderObjetcDate?: (value: any) => JSX.Element }>` | ❌ | Configuración de los campos a mostrar |

### Hooks Utilizados

| Hook | Origen | Descripción |
|---|---|---|
| `UseUtilHooks` | `app/shared/hooks/useUtilsHooks` | Provee `getNestedValue` |

---

## GroupButtons

> **Archivo:** `components/GroupButtons.tsx`  
> **Descripción:** Barra de botones que permite cambiar el tipo de gráfico. Solo se renderiza si `ContainerForGraphics` no recibe `typeGraph`.

### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `setActiveLayout` | `(activeLayout: "Lineas" \| "Barras" \| "Circular" \| "Area") => void` | ✅ | Actualiza el tipo de gráfico en `ContainerForGraphics` |

### Botones definidos

| Label | Valor |
|---|---|
| Grafico Linea | `"Lineas"` |
| Grafico Area | `"Area"` |
| Grafico Circular | `"Circular"` |
| Grafico de Barras | `"Barras"` |

### Estilos

| Clase | Descripción |
|---|---|
| `flex flex-row w-fit gap-x-4 border border-gray-300 p-3 shadow-md rounded-md bg-secondaryNew justify-start items-center` | Contenedor |
| `buttonSelectorGraphics` | Clase CSS global del proyecto (definida en `styles.css` `@layer components`) |

---

## buildAreaSegments (Helper)

> **Archivo:** `helpers/buildAreaSegments.tsx`  
> **Tipo:** Función pura genérica

### Parámetros

```typescript
interface ChartData<T> {
  data: T[];         // Array de datos original
  valueKey: string;  // Clave numérica a evaluar contra el umbral
  threshold: number; // Valor umbral
}
```

### Retorna

Agrega dos campos a cada elemento del array:

| Campo | Valor | Descripción |
|---|---|---|
| `normal` | Valor numérico o `null` | Valor del punto si está sobre el umbral. `null` si es warning |
| `warning` | Valor numérico o `null` | Valor del punto si está bajo el umbral. `null` si es normal |

### Lógica de transición

Un punto pertenece al segmento `warning` si:
- Su valor es menor al umbral, **O**
- El punto anterior estaba bajo el umbral y el actual lo supera (para conectar visualmente el cruce)

---

## Modelos / Interfaces

### `IConfigAreaGarficos<T>`

> **Archivo:** `IConfigAreaGraficos.ts`

```typescript
export interface IConfigAreaGarficos<T> {
  key: Extract<keyof T, string>; // Clave del objeto T que representa la serie de datos
  stroke: string;                // Color de la línea/borde (ej. "#8884d8")
  fill: string;                  // Color del área de relleno (ej. "#8884d8")
}
```

---

## Componentes MUI Utilizados

| Componente | Paquete | Uso |
|---|---|---|
| `Grow` | `@mui/material` | Animación de entrada del gráfico y del panel `DetailInformation` |
| `Box` | `@mui/system` | Contenedor del ícono en el estado vacío |
| `ChartButtonIconEdited` | `app/shared/helpers/ComponentsMUIModify/IconsModified` | Ícono SVG de gráfico en el estado vacío |

---

## Dependencias Internas

| Import | Ruta | Propósito |
|---|---|---|
| `GroupButtons` | `components/GroupButtons` | Selector de tipo de gráfico |
| `IConfigAreaGarficos` | `IConfigAreaGraficos` | Interfaz de configuración de series |
| `LayoutSelectorGraphics` | `layout/LayoutSelectorGraphics` | Switch de tipo de gráfico |
| `DetailInformation` | `components/DetailInformation` | Panel lateral de detalle |
| `ChartButtonIconEdited` | `app/shared/helpers/ComponentsMUIModify/IconsModified` | Ícono del estado vacío |
| `buildAreaSegments` | `helpers/buildAreaSegments` | Transformación de datos para doble segmento |
| `UseUtilHooks` | `app/shared/hooks/useUtilsHooks` | Acceso a propiedades anidadas (`getNestedValue`) |
| `CustomTooltip` | `components/CustomTooltip` | Tooltip personalizado de Recharts |

---

## Dependencias Externas

| Librería | Componentes usados |
|---|---|
| `recharts ^2.7.2` | `AreaChart`, `BarChart`, `LineChart`, `Area`, `Bar`, `Line`, `CartesianGrid`, `XAxis`, `YAxis`, `Tooltip`, `Legend`, `ResponsiveContainer` |
| `@mui/material 5.16.7` | `Grow` |
| `@mui/system 5.16.7` | `Box` |

---

## Notas y Consideraciones

- ⚠️ **`console.log(data)` en `AreaChartComponent.tsx` (línea 32):** Log de depuración activo en producción. Debe eliminarse.
- ⚠️ **`console.log(dataBar, index)` en `LineaChartComponent.tsx` (línea 28):** Handler `onClick` de `<Line>` sin implementar. Limpiar o desarrollar.
- ⚠️ **Tipo `Circular` sin implementar:** El case `"Circular"` en `LayoutSelectorGraphics` retorna un `<div>holaa 3</div>` placeholder. El botón existe pero el gráfico no está desarrollado.
- ⚠️ **Tipo `any` para `payloadObject`:** La variable de estado `payloadObject` no está tipada. Debería tipificarse con el tipo genérico `T`.
- ⚠️ **Typo en nombre de interfaz:** `IConfigAreaGarficos` (debería ser `IConfigAreaGraficos`). El archivo se llama `IConfigAreaGraficos.ts` pero la interfaz tiene el typo internamente.
- ⚠️ **Typo en UI:** `DetailInformation` dice `"Informacion Detalla"` en lugar de `"Información Detallada"`.
- ⚠️ **`BarChartComponent` no pasa `titleTooltip`:** A diferencia de los otros gráficos, el de Barras no pasa `titleTooltip` al `CustomTooltip`.
- ℹ️ **Estandarizado con `recharts`:** Este módulo usa exclusivamente `recharts`. Mantener esta consistencia al extenderlo.
- ℹ️ **Generics TypeScript:** Todos los componentes son genéricos (`<T,>`), lo que permite reutilizarlos con cualquier modelo de datos sin perder tipado.

---

## Posibles Mejoras

- Implementar el gráfico `Circular` (pie/donut chart con recharts `PieChart`)
- Tipar `payloadObject` con el genérico `T` en `ContainerForGraphics`
- Eliminar todos los `console.log` de producción
- Corregir el typo de la interfaz `IConfigAreaGarficos` → `IConfigAreaGraficos`
- Corregir el texto de la UI en `DetailInformation`
- Agregar `titleTooltip` a `BarChartComponent`
- Agregar soporte de `setPayloadObject` en `LineaChartComponent` para habilitar el panel `DetailInformation` en modo líneas
- Considerar tipar `extraKeys` con una interfaz nombrada exportada para facilitar el uso desde los consumidores

---

## Ejemplo de Uso

```tsx
import { ContainerForGraphics } from "app/shared/helpers/Graficos/containers/ContainerForGraphics";
import { IConfigAreaGarficos } from "app/shared/helpers/Graficos/IConfigAreaGraficos";

// 1. Tipo de datos
interface IProduccionData {
  fecha: string;
  producidas: number;
  rechazadas: number;
}

// 2. Configuración de series
const areas: IConfigAreaGarficos<IProduccionData>[] = [
  { key: "producidas", stroke: "#8884d8", fill: "#8884d8" },
  { key: "rechazadas", stroke: "#FF5252", fill: "#FF5252" }
];

// --- Uso básico (con botonera de tipo) ---
<ContainerForGraphics<IProduccionData>
  data={listaProduccion}
  xAxisKey="fecha"
  areas={areas}
  classNameStyles="w-full"
  titleTooltip="Producción del día"
  extraKeys={[
    { title: "Fecha completa", objectDate: "fecha" },
    { title: "Total producidas", objectDate: "producidas" }
  ]}
/>

// --- Tipo de gráfico fijo (sin botonera) ---
<ContainerForGraphics<IProduccionData>
  data={listaProduccion}
  xAxisKey="fecha"
  areas={areas}
  classNameStyles="w-full"
  typeGraph="Area"
/>

// --- Con doble segmento normal/warning y panel de detalle ---
<ContainerForGraphics<IProduccionData>
  data={listaProduccion}
  xAxisKey="fecha"
  areas={areas}
  classNameStyles="w-full"
  typeGraph="Area"
  activeDoubleChart
  keyForDoubleChart="producidas"
  thresholdForDoubleChart={50}
  activeDetailInformation
  extraKeysMoreInformation={[
    { title: "Observación", objectDate: "observacion" },
    { title: "Detalle", renderObjetcDate: (value) => <span className="text-red-500">{value}</span> }
  ]}
/>
```
