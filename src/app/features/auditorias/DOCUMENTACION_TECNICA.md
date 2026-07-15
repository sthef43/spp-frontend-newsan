# Documentación Técnica del Módulo de Auditorías

> **Ruta:** `src/app/features/auditorias/`
> **Tipo:** Módulo (Feature)
> **Fecha de documentación:** 2026-07-14

---

## Resumen

Documentación técnica complementaria al `DOCUMENTACION.md` existente. Este archivo se enfoca en el detalle de implementación de cada archivo del módulo: props, hooks, slices, servicios, modelos, interfaces y análisis de código. El módulo de Auditorías gestiona el ciclo de vida completo de auditorías de calidad: creación de plantillas, asignación a operadores, ejecución en tiempo real, carga de evidencias y generación de reportes históricos.

---

## Estructura de Archivos

```
auditorias/
├── composables/                           # Hooks antiguos (patrón legacy)
│   ├── useAuditoriasApi.tsx               # Hook: useGetAllAuditsFatherByRolAndPlantId
│   ├── useAuditoriaGrupoItemsResultApi.tsx # Hook: useGetAllGroupResultsByAuditId / useGetAllGroupResultsByAuditIdExcute
│   └── useAuditoriaListaValoresResultApi.tsx # Hook: useGetAllListValuesByAuditId / useGetAllListValuesByAuditIdExcute
├── hooks/                                 # Hooks nuevos (duplicados de composables/)
│   ├── useAuditoriasApi.tsx               # Idéntico a composables/useAuditoriasApi.tsx
│   ├── useAuditoriaGrupoItemsResultApi.tsx # Idéntico a composables/useAuditoriaGrupoItemsResultApi.tsx
│   └── useAuditoriaListaValoresResultApi.tsx # Idéntico a composables/useAuditoriaListaValoresResultApi.tsx
├── index.ts                               # Punto de entrada (exportaciones)
├── models/                                # Interfaces del módulo
│   ├── DTO/
│   │   ├── AuditoriaEntidadesDTO.ts       # DTO principal creación/edición
│   │   └── ListaValoresRenderizadoDTO.ts  # DTO listas con flag renderizado
│   ├── IAuditoria.ts                      # Interfaz plantilla base
│   ├── IAuditoriaAsignada.ts              # Interfaz auditoría asignada
│   ├── IAuditoriaGrupoItems.ts            # Interfaz grupo/bloque de items
│   ├── IAuditoriaGrupoItemsBloq.ts        # Interfaz relación grupo-item
│   ├── IAuditoriaGrupoItemsHistorico.ts   # Interfaz grupo histórico
│   ├── IAuditoriaGrupoItemsResult.ts      # Interfaz grupo resultado
│   ├── IAuditoriaGrupoMails.ts            # Interfaz grupo de mails
│   ├── IAuditoriaItems.ts                 # Interfaz item de auditoría
│   ├── IAuditoriaItemsHistorico.ts        # Interfaz item histórico
│   ├── IAuditoriaItemsResult.ts           # Interfaz item resultado
│   ├── IAuditoriaListaValores.ts          # Interfaz lista de valores
│   ├── IAuditoriaListaValoresResult.ts    # Interfaz lista valores resultado
│   ├── IAuditoriaNivelItem.ts             # Interfaz nivel de criticidad
│   ├── IAuditoriasHistorico.ts            # Interfaz histórico de auditoría
│   ├── IAuditoriaTipos.ts                 # Interfaz tipos de auditoría
│   ├── IAuditoriaValores.ts               # Interfaz valor de evaluación
│   ├── IAuditoriaValoresListaBloq.ts      # Interfaz relación valor-lista
│   ├── IAuditoriaValoresResult.ts         # Interfaz valor resultado
│   └── utils/
│       ├── IAddInitialStates.ts           # Genérico para estados iniciales
│       ├── IEstadoDeRenderizado.ts        # Estado renderizado UI
│       ├── IListaDatosParaAuditorias.ts   # Estado datos para creación
│       ├── IStatesForActiveFetchs.ts      # Flags de fetch activos
│       └── ValuesDefaultStepper.ts        # Interface paso del stepper
├── modules/                               # Componentes de UI
│   ├── components/
│   │   ├── AuditBloqEditForm.tsx          # Formulario edición de bloque (legacy)
│   │   ├── AuditNameAndInfo.tsx           # Nombre y registro (legacy, duplicado parcial)
│   │   ├── creacionAuditorias/
│   │   │   ├── CreacionAuditoriaPrimerPaso.tsx   # Paso 1: nombre, registro, emails
│   │   │   ├── CreacionAuditoriaSegundoPaso.tsx  # Paso 2: tipo de valores
│   │   │   ├── CreacionAuditoriaTercerPaso.tsx   # Paso 3: bloques e items
│   │   │   ├── NuevosValores.tsx                 # Crear valores nuevos
│   │   │   ├── StepperAuditorias.tsx             # Stepper personalizado
│   │   │   └── ValoresExistentes.tsx             # Seleccionar valores existentes
│   │   ├── realizarAuditorias/
│   │   │   └── StteperForBloqItems.tsx           # Stepper vertical con items
│   │   └── reporteAuditoria/
│   │       ├── AuditComentarios.tsx              # Comentario de tracking (legacy)
│   │       ├── AuditNameInfoAndGroup.tsx         # Nombre info + grupo emails (legacy)
│   │       └── HistoricAuditPerformed.tsx        # Tabla histórica con paginación (legacy)
│   ├── layouts/
│   │   └── LayoutCrudCreacionAuditoria.tsx       # Layout del wizard de creación
│   ├── modals/
│   │   ├── asignarAuditorias/
│   │   │   ├── CrearNuevaAsignacion.tsx          # Asignar auditoría a subrol
│   │   │   └── ExaminarAuditoriasAsignadasModal.tsx # Examinar asignaciones
│   │   ├── creacionAuditorias/
│   │   │   ├── AgregarAsignarValores.tsx         # Tabs valores nuevos/existentes
│   │   │   ├── AgregarNuevoBloque.tsx            # Crear/editar bloque con items
│   │   │   ├── AgregarTipoAgrupacion.tsx         # Crear tipo de agrupación
│   │   │   ├── AgregarTipoAuditoria.tsx          # Crear lista de valores
│   │   │   ├── ExaminarBloquesAuditoria.tsx      # Examinar bloques
│   │   │   ├── ExaminarTareasAuditoria.tsx       # Examinar items/tareas
│   │   │   └── ExaminarValoresAuditoria.tsx      # Examinar valores
│   │   ├── reporteAuditoria/
│   │   │   ├── AsignarSeguimiento.tsx            # Asignar seguimiento
│   │   │   ├── AuditTrackerResol.tsx             # Resolución de tracking (legacy)
│   │   │   ├── AuditTrackingFormModal.tsx        # Formulario tracking (legacy)
│   │   │   └── DarBajaAuditoria.tsx              # Dar de baja auditoría
│   │   └── tiposAuditoria/
│   │       └── AgregarTipoAuditoriaForm.tsx      # CRUD tipos de auditoría
│   └── pages/
│       ├── AsignarAuditoriasMain.tsx             # Página asignación de auditorías
│       ├── CompletarAuditoria.tsx                 # Página completar/examinar auditoría
│       ├── CreacionAuditoriasMain.tsx            # Página listado de plantillas
│       ├── CrudCreacionAuditorias.tsx            # Página wizard creación/edición
│       ├── HistoricPerformedAudit.tsx             # Página histórico legacy
│       ├── RealizarAuditoriasMain.tsx            # Página realizar auditorías
│       ├── ReporteAuditoriaMain.tsx              # Página reportes
│       └── TiposAuditoriaMain.tsx                # Página tipos de auditoría
├── services/                             # Servicios de API
│   ├── Auditoria.service.tsx             # CRUD plantillas + CreateAuditWithResults
│   ├── AuditoriaAsignada.service.tsx     # CRUD asignaciones + métodos especializados
│   ├── AuditoriaGrupoItems.service.tsx   # CRUD grupos de items
│   ├── AuditoriaGrupoItemsBloq.service.tsx # CRUD bloque de items
│   ├── AuditoriaGrupoItemsHistorico.service.tsx # MultiPostWithImages, MultiPostReturnList
│   ├── AuditoriaGrupoItemsResult.service.tsx # CRUD resultados de grupos
│   ├── AuditoriaGrupoMails.service.tsx   # CRUD grupos de mails
│   ├── AuditoriaItems.service.tsx        # CRUD items + MultiPostReturnList
│   ├── AuditoriaItemsHistorico.service.tsx # CRUD items histórico
│   ├── AuditoriaItemsResult.service.tsx  # CRUD items resultado + MultiPutItemsResult
│   ├── AuditoriaListaValores.service.tsx # CRUD listas de valores
│   ├── AuditoriaListaValoresResult.service.tsx # CRUD resultados listas valores
│   ├── AuditoriaNivelItem.service.tsx    # CRUD niveles de item
│   ├── AuditoriasHistorico.service.tsx   # CRUD históricos + GetAllAuditsByPlantId
│   ├── AuditoriaTipos.service.tsx        # CRUD tipos de auditoría
│   ├── AuditoriaValores.service.tsx      # CRUD valores
│   ├── AuditoriaValoresListaBloq.service.tsx # CRUD bloque valores-lista
│   ├── AuditoriaValoresResult.services.tsx # CRUD valores resultado
│   └── registry.service.tsx              # Servicio legacy Registry
└── slices/                               # Redux Slices
    ├── AuditoriaSlice.tsx                # Slice plantillas + thunks especializados
    ├── AuditoriaAsignadaSlice.tsx        # Slice asignaciones + thunks especializados
    ├── AuditoriaGrupoItemsBloqSlice.tsx  # Slice bloque items
    ├── AuditoriaGrupoItemsHistoricoSlice.tsx # Slice grupo histórico
    ├── AuditoriaGrupoItemsResultSlice.tsx # Slice grupo resultado
    ├── AuditoriaGrupoItemsSlice.tsx      # Slice grupo items
    ├── AuditoriaGrupoMailsSlice.tsx      # Slice grupo mails
    ├── AuditoriaItemsHistoricoSlice.tsx  # Slice items histórico
    ├── AuditoriaItemsResultSlice.tsx     # Slice items resultado
    ├── AuditoriaItemsSlice.tsx           # Slice items
    ├── AuditoriaListaValoresResultSlice.tsx # Slice lista valores resultado
    ├── AuditoriaListaValoresSlice.tsx    # Slice lista valores
    ├── AuditoriaNivelItemSlice.tsx       # Slice nivel item
    ├── AuditoriaTiposSlice.tsx           # Slice tipos auditoría
    ├── AuditoriaValoresListaBloqSlice.tsx # Slice bloque valores-lista
    ├── AuditoriaValoresResult.slice.tsx  # Slice valores resultado
    ├── AuditoriaValoresSlice.tsx         # Slice valores
    ├── AuditoriasHistoricoSlice.tsx      # Slice históricos
    ├── EstadoDeRenderizadosSlice.tsx     # Slice estado renderizado (UI)
    ├── ListaDatosParaAuditoriasSlice.tsx # Slice datos para creación (UI)
    ├── RegistrySlice.tsx                 # Slice legacy Registry
    ├── StatesForActiveFetchsSlice.tsx    # Slice flags de fetch (UI)
    └── auditoriasUISlice.tsx            # Slice UI principal del módulo
```

---

## Páginas

### 1. `CreacionAuditoriasMain.tsx`

> **Ruta:** `modules/pages/CreacionAuditoriasMain.tsx`
> **Tipo:** React.FC

| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| *(ninguna)* | | | No recibe props |

**Estado Local:**

| Variable | Tipo | Inicial | Uso |
|----------|------|---------|-----|
| `openModalBloques` | `boolean` | `false` | Controla apertura del modal de examinar bloques |
| `openModalValores` | `boolean` | `false` | Controla apertura del modal de examinar valores |
| `auditoriaSeleccionada` | `IAuditoria \| null` | `null` | Auditoría seleccionada para examinar |

**Hooks utilizados:**

| Hook | Origen | Descripción |
|------|--------|-------------|
| `useForm` | `react-hook-form` | Control del select de planta |
| `useAppSelector` | Redux | Obtiene `state.appUser.data`, `state.plant.dataAll` |
| `useAppDispatch` | Redux | Dispara acciones de slices internos |
| `useHistory` | `react-router-dom` | Navegación al CRUD de creación |
| `useTitleOfApp` | `app/shared/hooks` | Establece título de la página |
| `UseUtilHooks` | `app/shared/hooks` | Formateo de fechas |
| `useGetAllPlantsExecute` | `app/shared/hooks/hooksServices` | Obtener plantas |
| `useGetAllAuditsFatherByRolAndPlantId` | `composables/useAuditoriasApi` | Obtener auditorías por rol y planta |
| `useGetAllGroupResultsByAuditIdExcute` | `composables/useAuditoriaGrupoItemsResultApi` | Obtener grupos por auditoría |
| `useGetAllListValuesByAuditIdExcute` | `composables/useAuditoriaListaValoresResultApi` | Obtener valores por auditoría |

**Estado Redux consumido:**
- `state.appUser.data` → `IAppUser`
- `state.plant.dataAll` → `IPlant[]`

**Acciones despachadas:**
- `auditoriaAsignadaSlice.actions.setAuditoria(null)` — limpia auditoría seleccionada
- `auditoriasUISlice.actions.setListaEmails("")` — resetea emails
- `auditoriasUISlice.actions.setBloquesVacio([])` — resetea bloques
- `auditoriasUISlice.actions.setListaValores([])` — resetea valores
- `auditoriasUISlice.actions.setTipoAuditoria(0)` — resetea tipo
- `auditoriasUISlice.actions.setCantidadBloques(0)` — resetea cantidad
- `auditoriasUISlice.actions.setBloqueSeleccionado({})` — resetea selección
- `plantSlice.actions.setSelectPlant(value)` — selecciona planta

**Componentes MUI:** `Button`, `AddCircle`, `MoreHorizRounded`

**Dependencias internas:**
| Import | Ruta | Propósito |
|--------|------|-----------|
| `SelectComponent` | `app/features/cli/Components/SelectComponent` | Select de plantas |
| `TableComponent` | `app/shared/components/Table/TableComponent` | Tabla de auditorías |
| `ContainerForPages` | `app/shared/helpers/Containers/ContainerForPages` | Layout contenedor |
| `ModalCompoment` | `app/shared/components/ui/ModalComponent` | Modales |
| `PopperComponent` | `app/shared/helpers/ComponentsMUIModify/PopperComponent` | Menú de acciones |

---

### 2. `CrudCreacionAuditorias.tsx`

> **Ruta:** `modules/pages/CrudCreacionAuditorias.tsx`
> **Tipo:** React.FC

**Estado Local:**

| Variable | Tipo | Inicial | Uso |
|----------|------|---------|-----|
| `arrayItems` | `valuesDefaultStepper[]` | `initialValues` | Control de pasos del stepper |
| `pasoActivoNumber` | `number` | `1` | Paso actual del wizard |

**Hooks utilizados:**

| Hook | Origen | Descripción |
|------|--------|-------------|
| `useForm` | `react-hook-form` | Maneja formulario completo de 3 pasos |
| `useAppSelector` | Redux | Obtiene `state.appUser.data`, `state.auditoriasUI`, `state.auditoriaAsignada.data` |
| `useAppDispatch` | Redux | Despacha acciones |
| `useHistory` | `react-router-dom` | Navegación post-submit |
| `useNotificationUI` | `app/shared/hooks` | Notificaciones toast |
| `useConfirmationDialog` | `app/shared/hooks` | Diálogo de confirmación |
| `useFetchApiMultiResults` | `app/shared/hooks` | FetchPost y FetchPut |

**Estado Redux consumido:**
- `state.auditoriasUI` → `{ listaValores, listaValoresResult, bloques, listaValoresPadre, listaEmails, tipoAuditoriaId }`
- `state.auditoriaAsignada.data` → `IAuditoriaAsignada`

**Acciones despachadas (indirectas via FetchPost/FetchPut):**
- `AuditoriaSliceRequest.createAuditWithResults` — Crear auditoría completa
- `AuditoriaAsignadaSliceRequest.updateAuditWithResults` — Actualizar auditoría asignada
- `AuditoriaValoresResultSliceRequest.multiPutRequest` — Actualizar valores resultado

**Estructura del DTO de creación:**
```typescript
AuditoriaEntidadesDTO {
  auditoria: IAuditoria,
  auditoriaValores: IAuditoriaValores[],
  auditoriaListaValores: IAuditoriaListaValores,
  auditoriaGrupoItems: IAuditoriaGrupoItemsResult[]
}
```

**Componentes hijos:** `StepperAuditorias`, `LayoutCrudCreacionAuditoria`

---

### 3. `AsignarAuditoriasMain.tsx`

> **Ruta:** `modules/pages/AsignarAuditoriasMain.tsx`

**Estado Local:**

| Variable | Tipo | Inicial | Uso |
|----------|------|---------|-----|
| `openModal` | `boolean` | `false` | Modal crear asignación |
| `openModalExaminar` | `boolean` | `false` | Modal examinar asignaciones |
| `activeRefresh` | `boolean` | `false` | Trigger de refresco |
| `auditoriaId` | `number` | `0` | ID de auditoría seleccionada |

**Llamadas a API (FetchApi directas):**
- `PlantSliceRequests.getAllRequest` — Obtener plantas
- `AuditoriaSliceRequest.GetAllAuditsByRolAndPlantId` — Obtener auditorías por rol y planta

**Acciones despachadas:**
- `auditoriaSlice.actions.setListaAuditorias([])` — Limpia lista al montar
- `plantSlice.actions.setSelectPlant(value)` — Selecciona planta

---

### 4. `RealizarAuditoriasMain.tsx`

> **Ruta:** `modules/pages/RealizarAuditoriasMain.tsx`
> **Tipo:** React.FC

**Estado Local:**

| Variable | Tipo | Inicial | Uso |
|----------|------|---------|-----|
| `listaAuditorias` | `IAuditoriaAsignada[]` | `[]` | Auditorías del día |
| `listaPlantas` | `IPlant[]` | `[]` | Lista de plantas |
| `listaSubRoles` | `ISubRol[]` | `[]` | Subroles (solo admin) |
| `plantaSeleccionada` | `string \| number` | `0` | Filtro planta |
| `subRolSeleccionado` | `string \| number` | `0` | Filtro subrol (admin) |

**Llamadas a API (FetchApi directas):**
- `PlantSliceRequests.getAllRequest` — Plantas
- `AuditoriaAsignadaSliceRequest.getAllAuditsOfTheDay` — Auditorías del día (con filtros)
- `PermisosSliceRequests.getByRolId` — Permisos para obtener subroles

**Acciones despachadas:**
- `auditoriasUISlice.actions.setBloquesVacio([])` — Al editar auditoría
- `auditoriaAsignadaSlice.actions.setAuditoria(response)` — Al editar
- `auditoriasUISlice.actions.setListaValores(...)` — Al editar
- `auditoriasUISlice.actions.setBloques(...)` — Al editar
- `auditoriasUISlice.actions.setTipoAuditoria(...)` — Al editar

---

### 5. `CompletarAuditoria.tsx`

> **Ruta:** `modules/pages/CompletarAuditoria.tsx`
> **Tipo:** React.FC

**Props (vía useParams):**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `string` | ID de la auditoría asignada o histórico |
| `estado` | `string` | `"realizar"` o `"examinar"` |

**Estado Local:**

| Variable | Tipo | Inicial | Uso |
|----------|------|---------|-----|
| `auditResult` | `IAuditoriaAsignada \| IAuditoriasHistorico` | `undefined` | Datos de la auditoría |
| `listaValores` | `IAuditoriaListaValoresResult` | `undefined` | Lista de valores de evaluación |
| `valores` | `IAuditoriaValoresResult[]` | `[]` | Opciones de valor (OK, NO OK, etc.) |
| `listaItems` | `IAuditoriaGrupoItemsResult[] \| IAuditoriaGrupoItemsHistorico[]` | `[]` | Grupos con items a evaluar |
| `valuesStepper` | `valuesDefaultStepper[]` | `undefined` | Estado del stepper |
| `listaUrls` | `ListaUrls[]` | `[]` | URLs de imágenes cargadas |
| `valoresSeleccionados` | `string \| number` | `0` | Valor seleccionado |
| `selectedPlantId` | `number` | `0` | Planta para dispositivos |

**Interfaces locales:**
```typescript
interface ListaUrls {
  indexBloq: number;
  url: string | ArrayBuffer;
  file: File;
}
interface NuevasImagenes {
  auditoriaHistoricoId: number;
  idsGrupos: number[];
  listaArchivos: File[];
}
```

**Llamadas a API (FetchApi):**
- `AuditoriaAsignadaSliceRequest.getAuditResultWithAllDatesById` — Carga auditoría asignada
- `AuditoriasHistoricoSliceRequest.GetAuditById` — Carga histórico (modo examinar)
- `PlantSliceRequests.getAllRequest` — Plantas para selector de dispositivos

**Acciones despachadas:**
- `AuditDispositivoSliceRequests.GetAllByPlant(selectedPlantId)` — Dispositivos por planta
- `EmailSliceRequest.SendMailAuditoriaNew(...)` — Envío de email al completar
- `AuditoriasHistoricoSliceRequest.PostRequest` — Crear histórico
- `AuditoriaGrupoItemsHistoricoSliceRequest.MultiPostReturnList` — Crear grupos históricos
- `AuditoriaGrupoItemsHistoricoSliceRequest.MultiPostWithImages` — Subir imágenes

**Componentes MUI:** `TextFieldComponent`, `SelectComponent`, `DesktopDatePicker` (no usado aquí pero en Reporte)

---

### 6. `ReporteAuditoriaMain.tsx`

> **Ruta:** `modules/pages/ReporteAuditoriaMain.tsx`
> **Tipo:** React.FC

**Estado Local:**

| Variable | Tipo | Inicial | Uso |
|----------|------|---------|-----|
| `openModalSeguimiento` | `boolean` | `false` | Modal asignar seguimiento |
| `openModalDarBaja` | `boolean` | `false` | Modal dar de baja |
| `listaPlantas` | `IPlant[]` | `[]` | Plantas |
| `listaAuditorias` | `IAuditHistorico[]` | `[]` | Históricos filtrados |
| `auditoriaSeleccionada` | `IAuditoriasHistorico` | `undefined` | Auditoría seleccionada |
| `fechaSeleccionadaSelect` | `string` | `""` | Fecha inicio filtro |
| `fechaFinSeleccionadaSelect` | `string` | `""` | Fecha fin filtro |

**Llamadas a API (FetchApi):**
- `PlantSliceRequests.getAllRequest` — Plantas
- `AuditoriasHistoricoSliceRequest.GetAllAuditsByPlantId` — Históricos por planta y rango de fechas
- `AuditoriasHistoricoSliceRequest.GetAuditById` — Detalle de histórico

**Componentes MUI:** `TextField`, `DesktopDatePicker`, `PersonAddAlt1Rounded`, `ThumbDownAltRounded`, `Visibility`

---

### 7. `TiposAuditoriaMain.tsx`

> **Ruta:** `modules/pages/TiposAuditoriaMain.tsx`

**Estado Local:**

| Variable | Tipo | Inicial | Uso |
|----------|------|---------|-----|
| `openModal` | `boolean` | `false` | Modal crear/editar tipo |
| `activeRefresh` | `boolean` | `false` | Refrescar tabla |
| `edicionActiva` | `boolean` | `false` | Modo edición |
| `tipoSeleccionado` | `IAuditoriaTipos \| undefined` | `undefined` | Tipo a editar |

**Estado Redux consumido:** `state.auditoriaTipo.dataAll` → `IAuditoriaTipos[]`

**Llamadas a API (FetchApi):**
- `PlantSliceRequests.getAllRequest` — Plantas
- `AuditoriaTiposSliceRequest.GetAllAuditTypesByRolId` — Tipos por rol

**useMemo:** `columns` — Columnas de la tabla memoizadas

---

### 8. `HistoricPerformedAudit.tsx`

> **Ruta:** `modules/pages/HistoricPerformedAudit.tsx`
> **Tipo:** `export default function HistoricPerformedAudit`

**Props (vía useParams):** `params.id` — ID del registry

**Estado Local:**

| Variable | Tipo | Inicial | Uso |
|----------|------|---------|-----|
| `activeStep` | `number` | `0` | Paso activo del stepper vertical |
| `expanded` | `number \| false` | `0` | Panel expandido |
| `registry` | `IRegistry` | (FetchApi) | Datos del registry |
| `isProduct` | `boolean` | `false` | Si tiene finalProduct |

**Hooks:** `useFetchApi`, `useAppSelector`, `useParams`, `useHistory`

**Componentes MUI:** `Stepper`, `Step`, `StepLabel`, `StepContent`, `StepConnector`, `TextField`, `CircularProgress`, `Button`, `Paper`, `Typography`

---

## Componentes Compartidos

### `AuditBloqEditForm.tsx`
> **Ruta:** `modules/components/AuditBloqEditForm.tsx`
> **Tipo:** Componente funcional sin tipado de props explícito como interface nombrada

**Props:** `callbackFunction: any`, `setOpenPopup: any`, `auditBloqSelect: any`

| Hook | Uso |
|------|-----|
| `useForm` + `useFieldArray` | Formulario con items dinámicos |
| `useFetchApi` | Items y niveles de item |
| `useAppSelector` | Permisos del usuario |

**Estado:** Uso de `produce` (immer) para manejo de arrays

**Nota:** Componente con `any` generalizado y código comentado. Poco mantenido.

---

### `AuditNameAndInfo.tsx`
> **Ruta:** `modules/components/AuditNameAndInfo.tsx`
> **Tipo:** `JSX.Element`

**Props:**
| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `callback` | `(data: { name: string; numberRegistry: string }) => void` | ✅ | Callback al cambiar nombre/registro |
| `showButton` | `boolean` | ✅ | Mostrar botón |
| `info` | `{ name: string; numberRegistry: string }` | ✅ | Valores iniciales |

**Estado Local:** `state` — nombre y número de registro

---

### `StepperAuditorias.tsx` (Creación)
> **Ruta:** `modules/components/creacionAuditorias/StepperAuditorias.tsx`

**Props:**
| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `arrayItems` | `valuesDefaultStepper[]` | ✅ | Pasos del stepper |
| `disabledButtonNext` | `boolean` | ✅ | Deshabilitar botón next |
| `pasoActivo` | `number` | ✅ | Paso actual |
| `nextStepActive` | `(valuesDefaultStepper[]) => void` | ✅ | Avanzar paso |
| `backStepActive` | `() => void` | ✅ | Retroceder paso |
| `submitForm` | `() => void` | ✅ | Submit del formulario |

**Estado Redux:** `state.auditoriasUI` → `{ listaEmails, tipoAuditoriaId, listaValores, bloques }`

---

### `StteperForBloqItems.tsx` (Realizar)
> **Ruta:** `modules/components/realizarAuditorias/StteperForBloqItems.tsx`

**Props:**
| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `listaBloqueItems` | `any` | ✅ | Grupos de items |
| `listaValores` | `IAuditoriaValoresResult[]` | ✅ | Opciones de valor |
| `controlPadre` | `Control` | ✅ | Control del formulario padre |
| `errorsPadre` | `FieldErrors` | ✅ | Errores del formulario padre |
| `setValores` | `(valor: string \| number) => void` | ✅ | Setear valor seleccionado |
| `valuesStepper` | `valuesDefaultStepper[]` | ✅ | Estado del stepper |
| `nextStepActive` | `(valuesDefaultStepper[]) => void` | ✅ | Avanzar |
| `backStepActive` | `() => void` | ✅ | Retroceder |
| `functionSubmit` | `(data: any) => void` | ✅ | Función submit |
| `setListaUrlsProp` | `(listaUrls: ListaUrls[]) => void` | ✅ | Propagar URLs de imágenes |
| `tipoAuditoria` | `string` | ✅ | `"realizar"` o `"examinar"` |
| `idAuditoriaAsignada` | `number` | ✅ | ID de la auditoría |

**Estado Local:**

| Variable | Tipo | Inicial | Uso |
|----------|------|---------|-----|
| `archivos` | `File` | `undefined` | Archivo seleccionado |
| `listaUrls` | `ListaUrls[]` | `[]` | URLs de imágenes |
| `urlImage` | `string \| ArrayBuffer` | `undefined` | URL de imagen a mostrar |
| `comentariosObligatorios` | `object` | `{}` | Items que requieren comentario |
| `indexBloq` | `number` | `0` | Índice de bloque actual |
| `openModalExaminarImagen` | `boolean` | `false` | Modal de imagen |

**Lógica clave:**
- `bloqueCompleto(indexBloque)` — Valida si todos los items del bloque tienen valor
- `handleVerificarObligatoriedad(...)` — Marca comentario como obligatorio si valor tiene `flagCriterio: true`
- `handleSetUrlImage(...)` — Sube imagen al bloque correspondiente

**Componentes MUI:** Stepper vertical personalizado, `ButtonForFiles`, `ModalCompoment`, `ExaminarImagenGenericModal`

---

### Componentes de Creación de Auditorías

#### `CreacionAuditoriaPrimerPaso.tsx`
| Prop | Tipo | Requerida |
|------|------|-----------|
| `controlFather` | `Control` | ✅ |
| `setValuesFather` | `UseFormSetValue<FieldValues>` | ✅ |
| `resetFather` | `UseFormReset<FieldValues>` | ✅ |
| `errosFather` | `FieldErrors<FieldValues>` | ✅ |
| `triggerFather` | `UseFormTrigger<FieldValues>` | ✅ |

**Estado Redux:** `state.auditoriaAsignada.data`, `state.auditoriasUI.listaEmails`, `state.plant.object`

**FetchApi:** `EmailGroupSliceRequests.getAllByPlantIdRequest`

**Acciones:** `auditoriasUISlice.actions.setListaEmails(...)`

#### `CreacionAuditoriaSegundoPaso.tsx`
Mismas props que el primer paso.

**Estado Redux:** `state.auditoriasUI.listaValores`, `state.auditoriasUI.activeFetchTipoAuditoria`, `state.auditoriaAsignada.data`

**FetchApi:** `AuditoriaListaValoresSliceRequest.GetAuditListWithRolId`

**Acciones:** `setActiveFetchTipoAuditoria`, `setTipoAuditoria`, `setListaValores`, `setListaValoresPadre`

#### `CreacionAuditoriaTercerPaso.tsx`
Mismas props.

**Estado Redux:** `state.auditoriasUI.bloques`, `state.auditoriasUI.activeBloqItems`, `state.auditoriasUI.cantidadBloques`, `state.auditoriasUI.bloqueSeleccionado`, `state.auditoriaGrupoItems.dataAll`

**FetchApi:** `AuditoriaGrupoItemsSliceRequest.GetAllGroupsByItems`

**Lógica clave:** Manejo de bloques con selección, edición, eliminación con reindexado

---

## Layouts

### `LayoutCrudCreacionAuditoria.tsx`

**Props:**
| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `pasoActivo` | `number` | ✅ | Paso actual (1, 2, o 3) |
| `controlFather` | `Control` | ✅ | Control del formulario padre |
| `setValuesFather` | `UseFormSetValue<FieldValues>` | ✅ | Setter de valores |
| `resetFather` | `UseFormReset<FieldValues>` | ✅ | Reset del formulario |
| `errosFather` | `FieldErrors<FieldValues>` | ✅ | Errores del formulario |
| `triggerFather` | `UseFormTrigger<FieldValues>` | ✅ | Trigger de validación |

Renderiza condicionalmente: `CreacionAuditoriaPrimerPaso`, `CreacionAuditoriaSegundoPaso`, `CreacionAuditoriaTercerPaso`

---

## Modales

### Creación de Auditorías

| Modal | Props | Props descripción |
|-------|-------|-------------------|
| `AgregarNuevoBloque` | `setOpenModal`, `openModal`, `grupoItemsSeleccionado?` | Crea/edita bloque con items nuevos o existentes |
| `AgregarTipoAuditoria` | `setOpenModal`, `openModal` | Crea lista de valores asociada a tipo de auditoría |
| `AgregarAsignarValores` | `setOpenModal`, `openModal` | Tabs para elegir entre valores nuevos (NuevosValores) o existentes (ValoresExistentes) |
| `AgregarTipoAgrupacion` | `setOpenModal` | Crea nuevo tipo de agrupación en BD |
| `ExaminarBloquesAuditoria` | `auditoriaSeleccionada`, `gruposAuditoria`, `setOpenModal` | Vista de solo lectura de bloques |
| `ExaminarTareasAuditoria` | `auditoriaSeleccionada: IAuditoriaItemsResult[]`, `setOpenModal` | Items de un bloque en solo lectura |
| `ExaminarValoresAuditoria` | `listaValores`, `setOpenModal` | Valores en solo lectura |

### Asignación de Auditorías

| Modal | Props | Descripción |
|-------|-------|-------------|
| `CrearNuevaAsignacion` | `openModal`, `edicionActiva`, `auditoriaSeleccionadaEditar?`, `setOpenModal`, `setActiveRefresh?`, `setListaAuditoriasAsignadas?` | Asigna plantilla a subrol/línea/turno |
| `ExaminarAuditoriasAsignadasModal` | `setOpenModal`, `openModal`, `auditoriaId` | Lista asignaciones y permite editar |

### Reporte de Auditorías

| Modal | Props | Descripción |
|-------|-------|-------------|
| `AsignarSeguimiento` | `setOpenModal`, `openModal`, `auditoriaSeleccionada` | Tabla de items para seguimiento |
| `DarBajaAuditoria` | `setOpenModal`, `auditoriaSeleccionada`, `setActiveFetch` | Formulario para dar de baja con comentario |
| `AuditTrackerResol` | `auditTracker`, `setOpenModal`, `rolId?` | Sistema de comentarios de tracking (legacy) |
| `AuditTrackingFormModal` | `setOpenModal`, `auditRegistryResult`, `auditRegistryId` | Formulario de tracking con emails (legacy) |

### Tipos de Auditoría

| Modal | Props | Descripción |
|-------|-------|-------------|
| `AgregarTipoAuditoriaForm` | `setOpenModal`, `setActiveRefresh`, `edicionActiva?`, `tipoSeleccionado?` | CRUD de tipos de auditoría con react-hook-form |

---

## Hooks y Composables

### `composables/useAuditoriasApi.tsx`
```typescript
function useGetAllAuditsFatherByRolAndPlantId<T>(idPlant: number, idRol: number)
```
- **Retorna:** `{ response: T | undefined }`
- **Uso:** Obtiene auditorías padre por rol y planta mediante FetchApi automática

### `composables/useAuditoriaGrupoItemsResultApi.tsx`
```typescript
function useGetAllGroupResultsByAuditId(auditoriaId: number)
// Retorna: { response: IAuditoriaGrupoItemsResult[] }

function useGetAllGroupResultsByAuditIdExcute<T>()
// Retorna: { response: T | undefined, execute: (params?) => void }
```

### `composables/useAuditoriaListaValoresResultApi.tsx`
```typescript
function useGetAllListValuesByAuditId(auditoriaId: number)
// Retorna: { response: IAuditoriaListaValoresResult | undefined }

function useGetAllListValuesByAuditIdExcute<T>()
// Retorna: { response: T | undefined, execute: (params?) => void }
```

> ⚠️ **Nota:** Los archivos en `hooks/` son IDÉNTICOS a los de `composables/`. Existe duplicación de código. Se recomienda eliminar un directorio.

---

## Slices Redux

### Patrón común
Cada slice sigue el patrón `GenericSlice<Entity>` + `createSlice` con `extraReducers` que usa `builderAll(builder)` para generar los casos estándar (getAll, getById, post, put, delete).

### `AuditoriaSlice` (`state.auditoria`)
| Thunk | Parámetros | Descripción |
|-------|-----------|-------------|
| `createAuditWithResults` | `AuditoriaEntidadesDTO` | Crea plantilla completa con items/valores |
| `GetAllAuditsFatherByRolAndPlantId` | `{ idPlant, idRol }` | Auditorías padre por rol y planta |
| `GetAllAuditsByRolAndPlantId` | `{ idPlant, idRol }` | Auditorías asignadas por rol y planta |

**Reducer sincrónico:** `setListaAuditorias`

### `AuditoriaAsignadaSlice` (`state.auditoriaAsignada`)
| Thunk | Parámetros | Descripción |
|-------|-----------|-------------|
| `createAuditWithResults` | `AuditoriaEntidadesDTO` | Crear auditoría asignada |
| `updateAuditWithResults` | `AuditoriaEditDTO` | Actualizar auditoría asignada |
| `getAllAuditsOfTheDay` | `{ rolId, subRolId, turnoId, plantId }` | Auditorías del día |
| `getAuditResultWithAllDatesById` | `number` | Auditoría con relaciones |
| `getAllAuditAsignedByAuditId` | `number` | Asignaciones por ID de auditoría |

**Reducer sincrónico:** `setAuditoria`

### `auditoriasUISlice` (`state.auditoriasUI`)
Slice de UI con estado local:

| Reducer | Payload | Descripción |
|---------|---------|-------------|
| `setCantidadBloques` | `number` | Cantidad de bloques en wizard |
| `setBloqueSeleccionado` | `Record<number, string \| number>` | Mapa de bloques seleccionados |
| `setEdicionActiva` | `boolean` | Modo edición |
| `setEstadoModalNuevoTipo` | `boolean` | Estado modal nuevo tipo |
| `setMostrarListaValores` | `boolean` | Mostrar/ocultar lista valores preview |
| `setListaEmails` | `string` | Lista de emails (separados por `;`) |
| `setTipoAuditoria` | `number` | Tipo de auditoría seleccionado |
| `setListaValoresPadre` | `IAuditoriaListaValores` | Lista valores padre |
| `setListaValores` | `IAuditoriaValores[] \| IAuditoriaValoresResult[]` | Lista de valores (actual y result) |
| `setListaValoresPreview` | `IAuditoriaValores[]` | Preview antes de guardar |
| `setBloques` | `IAuditoriaGrupoItems \| IAuditoriaGrupoItemsResult` | Agrega un bloque |
| `setBloquesVacio` | `[]` | Limpia bloques |
| `deleteBloques` | `number` | Elimina bloque por ID |
| `setActiveFetchListaValores` | `boolean` | Flag de fetch activo |

**Estado inicial completo:**
```typescript
{
  cantidadBloques: 0,
  bloqueSeleccionado: {},
  edicionActiva: false,
  estadoModalNuevoTipo: false,
  mostrarListaValores: false,
  bloques: [],
  listaEmails: "",
  listaValores: [],
  listaValoresPreview: [],
  listaValoresPadre: null,
  tipoProductoId: 0,
  tipoAuditoriaId: null,
  listaValoresResult: [],
  activeFetchListaValores: true,
  activeFetchTipoAuditoria: true,
  activeBloqItems: true,
  activeFetchTipoAgrupacion: true
}
```

### Slices adicionales (21 total)
Cada uno sigue el mismo patrón `GenericSlice` + `createSlice`:

| Slice | Entidad | Thunks adicionales |
|-------|---------|-------------------|
| `AuditoriaGrupoItemsHistoricoSlice` | `IAuditoriaGrupoItemsHistorico` | `MultiPostWithImages`, `MultiPostReturnList` |
| `AuditoriaItemsResultSlice` | `IAuditoriaItemsResult` | `MultiPutItemsResult` |
| `AuditoriaItemsSlice` | `IAuditoriaItems` | `MultiPostReturnList` |
| `AuditoriaGrupoItemsBloqSlice` | `IAuditoriaGrupoItemsBloq` | `multiPostRequest` |
| `AuditoriaValoresSlice` | `IAuditoriaValores` | `MultiPostReturnList` |
| `AuditoriaListaValoresSlice` | `IAuditoriaListaValores` | `GetAuditListWithRolId`, `GetAllAuditsByTypeAuditId` |
| `AuditoriaTiposSlice` | `IAuditoriaTipos` | `GetAllAuditTypesByRolId` |
| `AuditoriaValoresListaBloqSlice` | `IAuditoriaValoresListaBloq` | `multiPostRequest` |
| `AuditoriaValoresResultSlice` | `IAuditoriaValoresResult` | `multiPutRequest` |
| `AuditoriasHistoricoSlice` | `IAuditoriasHistorico` | `GetAllAuditsByPlantId`, `GetAuditById` |
| `AuditoriaGrupoItemsResultSlice` | `IAuditoriaGrupoItemsResult` | `GetAllGroupResultsByAuditId` |
| `AuditoriaListaValoresResultSlice` | `IAuditoriaListaValoresResult` | `GetAllListValuesByAuditId` |
| `AuditoriaGrupoItemsSlice` | `IAuditoriaGrupoItems` | `GetAllGroupsByItems` |
| `AuditoriaNivelItemSlice` | `IAuditoriaNivelItem` | *(solo genéricos)* |
| `AuditoriaGrupoMailsSlice` | `IAuditoriaGrupoMails` | *(solo genéricos)* |
| `AuditoriaItemsHistoricoSlice` | `IAuditoriaItemsHistorico` | *(solo genéricos)* |
| `AuditoriaValoresSlice` | `IAuditoriaValores` | *(solo genéricos)* |
| `RegistrySlice` | `IRegistry` | `getPaginationbyRolId` (legacy) |
| `EstadoDeRenderizadosSlice` | UI | Estado renderizado (no se usa activamente) |
| `ListaDatosParaAuditoriasSlice` | UI | Reemplazado por `auditoriasUISlice` |
| `StatesForActiveFetchsSlice` | UI | Reemplazado parcialmente por `auditoriasUISlice` |

---

## Servicios

### Patrón común
Todos extienden `GenericService<T>` y usan `axios` directo con `import.meta.env.VITE_API_URL`.

### `Auditoria.service.tsx`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `CreateAuditWithResults` | `POST /Auditoria/CreateAuditWithResults/` | Crear plantilla completa |
| `GetAllAuditsFatherByRolAndPlantId` | `GET /Auditoria/GetAllAuditsFatherByRolAndPlantId/{idPlant}/{idRol}` | Plantillas padre |
| `GetAuditoriasByPlant` | `GET /Auditoria/GetAuditoriasByPlant/{idPlant}` | Plantillas por planta |
| `GetAllAuditsByRolAndPlantId` | `GET /Auditoria/GetAllAuditsByRolAndPlantId/{idPlant}/{idRol}` | Plantillas asignadas |

### `AuditoriaAsignada.service.tsx`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `CreateAuditWithResults` | `POST /AuditoriaAsignada/CreateAuditWithResults/` | Crear asignación |
| `UpdateAuditWithResults` | `PUT /AuditoriaAsignada/UpdateAuditWithResults/` | Actualizar asignación |
| `GetAllAuditsOfTheDay` | `GET /AuditoriaAsignada/GetAllAuditsOfTheDay/{rolId}/{subRolId}/{turnoId}/{plantId}` | Auditorías del día |
| `GetAuditResultWithAllDatesById` | `GET /AuditoriaAsignada/GetAuditResultWithAllDatesById/{id}` | Detalle completo |
| `GetAllAuditAsignedByAuditId` | `GET /AuditoriaAsignada/GetAllAuditAsignedByAuditId/{id}` | Asignaciones por plantilla |

### `AuditoriaGrupoItemsHistorico.service.tsx`
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `MultiPostWithImages` | `POST /AuditoriaGrupoItemsHistorico/MultiPostWithImages` | Subir imágenes (multipart) |
| `MultiPostReturnList` | `POST /AuditoriaGrupoItemsHistorico/MultiPostReturnList` | Crear múltiples grupos |

### Servicios adicionales (15 servicios)
Cada uno sigue el patrón `GenericService<Entity>` y expone CRUD estándar:

| Servicio | URL Base | Métodos adicionales |
|----------|----------|---------------------|
| `AuditoriaGrupoItems.service.tsx` | `AuditoriaGrupoItems` | `GetAllGroupsByItems` |
| `AuditoriaItems.service.tsx` | `AuditoriaItems` | `MultiPostReturnList` |
| `AuditoriaGrupoItemsBloq.service.tsx` | `AuditoriaGrupoItemsBloq` | `multiPostRequest` |
| `AuditoriaItemsResult.service.tsx` | `AuditoriaItemsResult` | `MultiPutItemsResult` |
| `AuditoriaValores.service.tsx` | `AuditoriaValores` | `MultiPostReturnList` |
| `AuditoriaValoresResult.services.tsx` | `AuditoriaValoresResult` | `multiPutRequest` |
| `AuditoriaValoresListaBloq.service.tsx` | `AuditoriaValoresListaBloq` | `multiPostRequest` |
| `AuditoriaListaValores.service.tsx` | `AuditoriaListaValores` | `GetAuditListWithRolId`, `GetAllAuditsByTypeAuditId` |
| `AuditoriaListaValoresResult.service.tsx` | `AuditoriaListaValoresResult` | `GetAllListValuesByAuditId` |
| `AuditoriaGrupoItemsResult.service.tsx` | `AuditoriaGrupoItemsResult` | `GetAllGroupResultsByAuditId` |
| `AuditoriasHistorico.service.tsx` | `AuditoriasHistorico` | `GetAllAuditsByPlantId`, `GetAuditById` |
| `AuditoriaTipos.service.tsx` | `AuditoriaTipos` | `GetAllAuditTypesByRolId` |
| `AuditoriaNivelItem.service.tsx` | `AuditoriaNivelItem` | *(solo CRUD)* |
| `AuditoriaGrupoMails.service.tsx` | `AuditoriaGrupoMails` | *(solo CRUD)* |
| `AuditoriaItemsHistorico.service.tsx` | `AuditoriaItemsHistorico` | *(solo CRUD)* |

---

## Modelos / Interfaces

### `IAuditoria` (Plantilla Base)
```typescript
interface IAuditoria extends IBaseEntity {
  nombre: string;
  numeroRegistro: string;
  auditoriaMailGroup: string;
  auditoriaTiposId: number;
  auditoriaTipos?: IAuditoriaTipos;
  rolId: number;
  rol?: IRol;
  plantId?: number;
  plant?: IPlant;
  lineaProduccionId?: number;
  lineaProduccion?: ILineaProduccion;
  auditoriaGrupoItemsResult?: IAuditoriaGrupoItemsResult[];
  auditoriaListaValoresResult?: IAuditoriaListaValoresResult;
}
```

### `IAuditoriaAsignada`
```typescript
interface IAuditoriaAsignada extends IBaseEntity {
  nombre: string;
  numeroRegistro: string;
  auditoriaMailGroup: string;
  cantidadMuestrasOriginal?: number;
  cantidadMuestras: number;
  rolId: number; subRolId: number; turnoId: number;
  lineaProduccionId: number; auditoriaId: number; plantId: number;
  auditoria?: IAuditoria;
  auditoriaListaValoresResult?: IAuditoriaListaValoresResult;
  auditoriaGrupoItemsResult?: IAuditoriaGrupoItemsResult[];
}
```

### `IAuditoriasHistorico`
```typescript
interface IAuditoriasHistorico extends IBaseEntity {
  nombre: string; numeroRegistro: string; codigoProducto: string;
  operatorId: number; estadoAuditoria: boolean; ponderacion: number;
  fechaBaja?: string; comentarioBaja?: string;
  rolId: number; subRolId: number; turnoId: number;
  lineaProduccionId: number; auditoriaAsignadaId: number; plantId: number;
  auditoriaAsignada?: IAuditoriaAsignada;
  auditoriaGrupoItemsHistorico?: IAuditoriaGrupoItemsHistorico[];
  responsableBajaId?: number;
}
```

### `IAuditoriaGrupoItems` / `IAuditoriaGrupoItemsResult`
```typescript
interface IAuditoriaGrupoItems extends IBaseEntity {
  nombre: string; descripcion?: string; urlArchivo?: string;
  auditoriaGrupoItemsBloq?: IAuditoriaGrupoItemsBloq[];
}
interface IAuditoriaGrupoItemsResult extends IBaseEntity {
  nombre: string; descripcion?: string; urlArchivo?: string;
  auditoriaItemsResult?: IAuditoriaItemsResult[];
  auditoriaId?: number;
}
```

### `IAuditoriaItems` / `IAuditoriaItemsResult` / `IAuditoriaItemsHistorico`
```typescript
interface IAuditoriaItems extends IBaseEntity {
  nombre: string; descripcion?: string;
  itemExistente?: boolean; auditoriaNivelItemId: number;
}
interface IAuditoriaItemsResult extends IBaseEntity {
  nombre: string; descripcion?: string;
  auditoriaNivelItemId: number; auditoriaNivelItem?: IAuditoriaNivelItem;
  auditoriaGrupoItemsResultId?: number;
}
interface IAuditoriaItemsHistorico extends IBaseEntity {
  nombre: string; descripcion: string;
  valorAsignado: string; comentario: string;
  idAgrupadorPorGrupos: number; auditoriaNivelItemId: number;
}
```

### `IAuditoriaListaValores` / `IAuditoriaListaValoresResult`
```typescript
interface IAuditoriaListaValores extends IBaseEntity {
  nombre: string; descripcion?: string;
  auditoriaTiposId?: number; auditoriaValoresListaBloq?: IAuditoriaValoresListaBloq[];
}
interface IAuditoriaListaValoresResult extends IBaseEntity {
  nombre: string; auditoriaTiposId: number; auditoriaId: number;
  auditoriaValoresResult?: IAuditoriaValoresResult[];
}
```

### `IAuditoriaValores` / `IAuditoriaValoresResult`
```typescript
interface IAuditoriaValores extends IBaseEntity {
  nombre: string; descripcion: string;
  flagCriterio: boolean; flagMail: boolean;
}
interface IAuditoriaValoresResult extends IBaseEntity {
  nombre: string; descripcion: string;
  flagCriterio: boolean; flagMail: boolean;
  auditoriaListaValoresResultId: number;
}
```

### Otras interfaces
| Interfaz | Campos clave |
|----------|-------------|
| `IAuditoriaGrupoItemsBloq` | `auditoriaGrupoItemsId`, `auditoriaItemsId` |
| `IAuditoriaGrupoItemsHistorico` | `nombre`, `urlArchivo: string \| File`, `auditoriasHistoricoId` |
| `IAuditoriaNivelItem` | `nombre`, `codigo` |
| `IAuditoriaTipos` | `nombre`, `descripcion`, `rolId` |
| `IAuditoriaValoresListaBloq` | `auditoriaListaValoresId`, `auditoriaValoresId` |
| `IAuditoriaGrupoMails` | `nombre`, `descripcion`, `plantId` |

### DTOs
```typescript
interface AuditoriaEntidadesDTO {
  auditoriaListaValores: IAuditoriaListaValores;
  auditoriaValores: IAuditoriaValores[];
  auditoriaGrupoItems?: IAuditoriaGrupoItemsResult[];
  auditoriaItems?: IAuditoriaItems[];
  auditoria?: IAuditoria;
  auditoriaAsignada?: IAuditoriaAsignada;
}
interface AuditoriaEditDTO {
  auditoriaValores: IAuditoriaValoresResult[];
  auditoriaGrupoItems: IAuditoriaGrupoItemsResult[];
  auditoriaAsignada: IAuditoriaAsignada;
}
```

### Utils
```typescript
interface valuesDefaultStepper { pasoActivo: number; activo: boolean; }
interface IEstadoDeRenderizado { cantidadBloques: number; bloqueSeleccionado: Record<number, string | number>; ... }
interface IStatesForActiveFetchs { activeFetchListaValores: boolean; ... }
interface IListaDatosParaAuditorias { listaEmails: string; listaValores: IAuditoriaValores[]; ... }
```

---

## Uso de FetchApi

El módulo utiliza dos patrones para llamadas a API:

1. **FetchApi directo** (en componentes/páginas): `FetchApi(sliceRequest, params, ...)` — Hook que se ejecuta automáticamente cuando cambian las dependencias.
2. **useFetchApiMultiResults** (en formularios): `FetchPost`, `FetchPut`, `FetchDelete` — Para operaciones con respuesta controlada por callback.

---

## Estilos Aplicados

### Tailwind CSS
- **Clases frecuentes:** `flex flex-row`, `w-full`, `gap-x-4`, `p-4`, `bg-secondaryNew`, `rounded-md`, `shadow-md`, `text-xl font-semibold`
- **Clases personalizadas:** `bg-primaryNewOpacity`, `bg-backgroundModalAudit`, `bg-background`, `text-textColor`
- **Efectos:** `hover:bg-primaryNewOpacity`, `group-hover:text-white`, `transition-colors duration-150`

### MUI `sx` prop
```tsx
sx={{ backgroundColor: "var(--background-color)", borderRadius: "10px", margin: "0rem 0 1rem" }}
sx={{ fill: "var(--primary-color)" }}
sx={{ "& .MuiInput-underline": { "&::before": { borderBottom: "none" } } }}
```

### Variables CSS
- `var(--background-color)` — Fondo de contenedores
- `var(--primary-color)` — Color primario (íconos, bordes)
- `var(--secondary-color)` — Color secundario
- `var(--text-color)` — Color de texto

---

## Index (Punto de entrada)

```typescript
export { default as HistoricPerformedAudit } from "./modules/pages/HistoricPerformedAudit";
export { AuditTrackerResol } from "./modules/modals/reporteAuditoria/AuditTrackerResol";
export { AuditNameAndInfo } from "./modules/components/reporteAuditoria/AuditNameInfoAndGroup";
export { HistoricAuditPerformed } from "./modules/components/reporteAuditoria/HistoricAuditPerformed";
export { auditoriaSlice } from "./slices/AuditoriaSlice";
export { auditoriaAsignadaSlice } from "./slices/AuditoriaAsignadaSlice";
export { auditoriaGrupoItemsSlice } from "./slices/AuditoriaGrupoItemsSlice";
export { auditoriaListaValoresSlice } from "./slices/AuditoriaListaValoresSlice";
export { auditoriaValoresSlice } from "./slices/AuditoriaValoresSlice";
export { auditoriasUISlice } from "./slices/auditoriasUISlice";
```

---

## Notas y Consideraciones

1. **Duplicación hooks/composables:** Los directorios `hooks/` y `composables/` contienen archivos IDÉNTICOS. Se debe eliminar uno de los dos para evitar confusión.
2. **Código legacy:** Componentes como `AuditBloqEditForm`, `HistoricPerformedAudit`, `AuditTrackerResol`, `AuditTrackingFormModal`, `HistoricAuditPerformed`, `AuditNameInfoAndGroup` (en reporteAuditoria) pertenecen al sistema anterior y usan patrones diferentes (menos tipado, `any`, `produce` con immer, `useFetchApi` antiguo).
3. **Slices no utilizados:** `EstadoDeRenderizadosSlice`, `ListaDatosParaAuditoriasSlice` y `StatesForActiveFetchsSlice` parecen haber sido reemplazados por `auditoriasUISlice`. Verificar si aún se usan en otros módulos.
4. **useFetchApiCallback:** Los composables usan `useFetchApiCallback` que no está importado directamente en los hooks (está en `composables/` pero los de `hooks/` lo importan igual).
5. **MultiPostWithImages:** Usa FormData con `Content-Type: multipart/form-data` para subir archivos.
6. **El módulo completo tiene 23 slices Redux, 19 servicios, ~30 componentes/páginas/modales y 20+ interfaces** — es el módulo más grande del proyecto SPP.

---

## Mejoras / Observaciones del Revisor

### Tipado
- **CrudCreacionAuditorias.tsx (líneas 85, 115, 160, 198):** Uso extensivo de `any` en `onSubmit`, `data`, `generarAuditoriaConResults`, `generarAuditoria`. Debe tiparse con los tipos adecuados (`FieldValues` o interfaces específicas).
- **AuditBloqEditForm.tsx (línea 15-19):** Props sin interfaz nombrada, todo `any`. **Recomendación:** Crear interfaz `Props` tipada.
- **StteperForBloqItems.tsx (línea 33):** `listaBloqueItems: any`. Debe ser `IAuditoriaGrupoItemsResult[] | IAuditoriaGrupoItemsHistorico[]`.
- **CompletarAuditoria.tsx (línea 128):** `data: any` en `onSubmit`. Debe tiparse.
- **CrearNuevaAsignacion.tsx (líneas 109, 146, 162, 181):** Múltiples `any` en parámetros de funciones.
- **AgregarNuevoBloque.tsx (línea 103):** `data: any`.

### Duplicación
- **`composables/` y `hooks/`** contienen archivos idénticos (3 pares). **Recomendación:** Eliminar un directorio y unificar imports.

### Rendimiento
- **CreacionAuditoriasMain.tsx (línea 49):** `useGetAllAuditsFatherByRolAndPlantId` se ejecuta en cada render (está fuera de useEffect). **Recomendación:** Usar versión `execute` o mover a un efecto.
- **TiposAuditoriaMain.tsx (línea 69):** `useMemo` bien usado para `columns`.
- **CompletarAuditoria.tsx (líneas 86-118):** FetchApi ejecutándose en el cuerpo del componente sin control de dependencias fino.

### Mantenibilidad
- **Código comentado:** `AgregarTipoAuditoria.tsx` (líneas 281-306, bloque de tabla comentado), `HistoricPerformedAudit.tsx` (líneas 140-150, 275-290, checkCorrectForm comentado), `AuditBloqEditForm.tsx` (líneas 111-122, fetch comentado), `AuditTrackerResol.tsx` (líneas 19-48, versión anterior comentada).
- **`eslint-disable`:** Múltiples archivos tienen `/* eslint-disable @typescript-eslint/no-unused-vars */`, `/* eslint-disable unused-imports/no-unused-vars */` y `/* eslint-disable @typescript-eslint/no-explicit-any */` — señal de código que necesita limpieza.
- **AuditNameAndInfo.tsx y AuditNameInfoAndGroup.tsx:** Dos componentes con propósito similar (nombre+registro+emails). Uno legacy, otro actual.

### Bugs potenciales
- **CreacionAuditoriaTercerPaso.tsx (líneas 72-91):** `renderListaItems` usa `item.auditoriaNivelItem.nombre` pero `IAuditoriaItems` no tiene `auditoriaNivelItem` como requerido — puede romper si no se hidrata la relación.
- **CompletarAuditoria.tsx (línea 188):** `listaValores.find(valor => valor.nombre == items.valorAsignado)` — comparación por nombre, frágil si cambian nombres en BD.
- **auditoriasUISlice.ts (línea 91-93):** `setListaValores` recibe `IAuditoriaValores[] | IAuditoriaValoresResult[]` y hace cast directo a `IAuditoriaValoresResult[]` — puede ocultar errores de tipo.
- **CreacionAuditoriaSegundoPaso.tsx (línea 123):** `listaPadre.auditoriaValoresListaBloq` puede ser undefined y causar error.

### Estándares SPP
- **`IBaseEntity` como prefijo:** Los modelos del módulo usan correctamente `extends IBaseEntity` siguiendo el estándar. ✅
- **Slices usan `GenericSlice`:** Todos los slices del módulo extienden `GenericSlice`. ✅
- **Servicios usan `GenericService`:** Todos extienden `GenericService`. ✅
- **Nombres de interfaces:** Siguen el prefijo `I`. ✅
- **Patrón Redux:** Los slices registran thunks personalizados y usan `builderAll`. ✅

### Deuda técnica
- **Slices no registrados en rootReducer:** Todos los slices del módulo deben estar registrados en `src/app/Middleware/reducers/rootReducer.tsx`. Verificar.
- **Uso de `console.log`:** Múltiples `console.log` en producción: `RealizarAuditoriasMain.tsx` (línea 99), `AuditBloqEditForm.tsx` (63, 73, 77, 81, 109), `AuditNameAndInfo.tsx` (11, 17), `AgregarNuevoBloque.tsx` (109, 275).
- **Slices redundantes:** `EstadoDeRenderizadosSlice`, `ListaDatosParaAuditoriasSlice` y `StatesForActiveFetchsSlice` parecen haber sido reemplazados por `auditoriasUISlice`.

### Accesibilidad
- **StepperAuditorias.tsx y StteperForBloqItems.tsx:** Los steppers personalizados no tienen `aria-label` en los botones de navegación.
- **Falta de `aria-label` en varios IconButton.**
- **Contraste:** Algunos colores (ej. fondo verde con texto blanco en Stepper sin contraste suficiente).

---

**Generador de Documentación — Completado**

✅ Archivo generado: `src/app/features/auditorias/DOCUMENTACION_TECNICA.md`

🔍 **Mejoras / Observaciones identificadas:**
- Duplicación completa entre `composables/` y `hooks/` (3 pares de archivos idénticos)
- Uso extensivo de `any` en props y parámetros de funciones (más de 10 archivos afectados)
- Código comentado en 5+ archivos que debería limpiarse
- `console.log` de producción en 5+ archivos
- Posible bug: comparación por nombre en lugar de ID en ponderación final
- 3 slices parecen no utilizarse (EstadoDeRenderizadosSlice, ListaDatosParaAuditoriasSlice, StatesForActiveFetchsSlice)

📋 **Secciones documentadas:**
- [x] Estructura de archivos completa
- [x] 8 páginas con props, estado local, hooks, Redux, API, MUI, dependencias
- [x] 12+ componentes con props detalladas
- [x] Layout con props
- [x] 14 modales con props
- [x] 3 composables + 3 hooks (con observación de duplicación)
- [x] 23 slices Redux con thunks y reducers
- [x] 19 servicios con endpoints y métodos
- [x] 20+ interfaces y DTOs con campos completos
- [x] Estilos aplicados (Tailwind, sx, variables CSS)
- [x] Index/Punto de entrada
- [x] Notas y consideraciones
- [x] Mejoras/Observaciones del revisor (tipado, duplicación, rendimiento, bugs, estándares, deuda técnica, accesibilidad)

⚠️ **Notas importantes:**
- Este documento es COMPLEMENTARIO al `DOCUMENTACION.md` existente (841 líneas) que cubre flujos de usuario y arquitectura de alto nivel. No reemplaza ni duplica ese contenido.
- Se recomienda leer ambos documentos en conjunto para tener una visión completa del módulo.
- Algunos componentes marcados como "legacy" pertenecen al sistema anterior de auditorías y pueden coexistir temporalmente.
- No se modificó ningún archivo fuente del proyecto.
