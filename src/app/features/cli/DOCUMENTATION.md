# Documentación del Módulo CLI

## Introducción

Este documento describe la estructura y maquetación del módulo `cli` ubicado en `src/app/shared/Pages/cli`. El módulo está diseñado para la gestión de ubicaciones, contenedores, items y sectores, utilizando una arquitectura basada en React, Redux Toolkit y Material UI.

## Estructura de Directorios

El módulo se organiza en las siguientes carpetas:

- **Components**: Componentes reutilizables específicos para este módulo.
- **Middlewares**: Logic de estado y comunicación con APIs (Redux Slices).
- **Modals**: Componentes de tipo Modal/Dialog utilizados en las páginas.
- **Models**: Definiciones de interfaces y tipos TypeScript (ej. `ICLIUbicacionSector`).
- **Pages**: Vistas principales del módulo (ej. `AsignacionUbicaciones.tsx`).
- **Services**: Servicios para la comunicación HTTP.

---

## Maquetación y Diseño (Layout)

Las páginas del módulo siguen un patrón de diseño consistente para mantener la coherencia visual y funcional. A continuación se detalla la estructura típica observada (basada en `AsignacionUbicaciones.tsx`):

### 1. Contenedor Principal

Cada página envuelve su contenido en una etiqueta `<main>` con padding estándar.

```tsx
<main className="p-6">{/* Contenido de la página */}</main>
```

### 2. Barra de Acciones (Action Bar)

En la parte superior se ubica una sección para botones de acción y herramientas secundarias (como exportar a Excel).

- **Estilo**: Flexbox centrado con separación horizontal.
- **Clases**: `flex flex-row justify-center gap-x-4`.
- **Componentes**: Botones derivados de `MaterialButtons` (estilos personalizados de Material UI).

```tsx
<section className="flex flex-row justify-center gap-x-4">
  <div>
    <Button className={buttonClases.blueButton}>Acción 1</Button>
  </div>
  {/* Otros botones o herramientas */}
</section>
```

### 3. Área de Contenido / Tabla

Debajo de la barra de acciones se presenta la información principal, generalmente en forma de tabla.

- **Separación**: Se utiliza `mt-4` (margin-top) para separar del bloque de acciones.
- **Componente**: `TableComponent` (componente compartido de tabla).

```tsx
<section className="mt-4">
  <TableComponent
    buscar
    dataInfo={...}
    columns={...}
  />
</section>
```

### 4. Modales

Los modales se gestionan mediante estados locales (`useState`) y se renderizan condicionalmente o se mantienen en el DOM controlados por su prop `open`.

- **Componente Wrapper**: `ModalCompoment`.
- **Contenido**: Componentes importados desde la carpeta `Modals`.

---

## Componentes Reutilizables (Folder: `Components`)

El módulo cuenta con componentes propios que encapsulan lógica de librerías externas como `react-hook-form` y `@mui/material`.

### `TextFieldComponente.tsx`

Un wrapper para el `TextField` de Material UI integrado con `Controller` de React Hook Form.

- **Propósito**: Centralizar validaciones, manejo de errores y estilos.
- **Props Clave**: `control`, `nameInput`, `requiredBool`, `validacionAdicionales`.
- **Características**: Soporta validación personalizada y eventos de teclado (`onKeyUp`).

### `SelectComponent.tsx`

Similar al componente de texto, pero para elementos de selección (`Select`).

- **Propósito**: Facilitar la creación de dropdowns controlados.
- **Props Clave**: `listaObjetos`, `valueSelect` (fn para obtener valor), `valueLabel` (fn para obtener etiqueta).
- **Tipado Genérico**: Utiliza genéricos `<T>` para adaptarse a cualquier tipo de objeto en la lista.

### `ModalDeExaminarGenerico.tsx`

_Nota: Marcado como "NO USAR" en el código funte._
Un intento de componente genérico para examinar detalles de objetos en un modal. Filtra propiedades automáticas como `id` o `deleted`.

---

## Gestión de Estado (Redux)

El módulo interactúa intensamente con el store global mediante Slices definidos en `Middlewares`.

- **Patrón**: `useAppDispatch` para disparar acciones asíncronas (Thunks).
- **Manejo de Carga**: Se integra con `LoadingUISlice` para mostrar/ocultar spinners de carga durante las peticiones.
- **Flujo Típico**:
  1.  `dispatch(LoadingUIOpen...)`
  2.  Llamada a slice (ej. `CLIUbicacionSectoresSliceRequest.getAllRequest()`)
  3.  `unwrapResult` para manejar la promesa.
  4.  Actualización de estado local o global.
  5.  `dispatch(LoadingUIClose())`

---

## Estilos

El proyecto utiliza una combinación de:

- **Tailwind CSS**: Para layout y espaciado rápido (ej. `p-6`, `flex`, `gap-x-4`).
- **Material UI (MUI)**: Para componentes interactivos y sistema de diseño base.
- **Estilos Personalizados**: Definidos en `MaterialButtons` u objetos `sx` pasados a componentes MUI.
