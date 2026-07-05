# SPP - Sistema de Piso Planta

## 📋 Descripción General

**SPP (Sistema de Piso Planta)** es una aplicación web empresarial desarrollada para **Newsan**, diseñada para gestionar y analizar información del proceso productivo en múltiples plantas de producción. El sistema permite realizar el seguimiento de reportes de no conformidad, reparaciones, auditorías, control de calidad, trazabilidad y muchas otras funcionalidades críticas para la operación industrial.

**Versión actual:** v.1.4.80

## 🚀 Tecnologías Principales

### Frontend

- **React** v17.0.0 - Librería UI principal
- **TypeScript** v4.1.3 - Tipado estático
- **Redux Toolkit** v1.5.1 - Gestión de estado global
- **React Router DOM** v5.2.0 - Enrutamiento
- **Material-UI** v5.16.7 - Componentes UI
- **Tailwind CSS** v3.0.9 - Framework de estilos utility-first
- **Vite** v5.0.0 - Build tool y dev server
- **Vitest** v4.0.18 - Framework de testing

### Características Adicionales

- **Firebase** v12.4.0 - Autenticación y servicios
- **SignalR** v9.0.6 - Comunicación en tiempo real
- **Chart.js** v4.4.5 / **ApexCharts** v3.54.0 / **Recharts** v2.7.2 - Gráficos y visualizaciones
- **Workbox** v7.4.0 - Service Worker y PWA
- **React Hook Form** v7.52.2 - Gestión de formularios
- **Axios** v0.21.1 - Cliente HTTP
- **Moment.js** v2.30.1 / **Day.js** v1.11.19 - Manipulación de fechas
- **Lottie React** v2.4.1 - Animaciones
- **Kendo React Excel Export** v4.13.0 - Exportación a Excel
- **React PDF** v7.2.0 - Visualización y generación de PDFs

## 📁 Estructura del Proyecto

```
spp-frontend-newsan/
├── src/
│   ├── app/
│   │   ├── Middleware/             # Redux store, reducers y helpers de middleware
│   │   │   ├── reducers/           # Reducers globales
│   │   │   └── HelperMidleware/    # Helpers del middleware
│   │   ├── config/                 # Configuraciones globales (moment, etc.)
│   │   ├── core/                   # Núcleo de la aplicación
│   │   │   ├── router/             # Todos los routers por módulo (AppRouter, lazy loading)
│   │   │   │   └── LazyLoadingRoutes/  # Componentes lazy de rutas
│   │   │   └── store/              # Configuración del Redux store
│   │   ├── features/               # Módulos funcionales de negocio
│   │   │   ├── admin/
│   │   │   ├── audit/
│   │   │   ├── auditorias/         # Ejemplo de estructura de feature
│   │   │   │   ├── composables/    # Lógica reutilizable del módulo
│   │   │   │   ├── models/         # Interfaces y tipos del módulo
│   │   │   │   ├── services/       # Servicios de API del módulo
│   │   │   │   ├── slices/         # Redux slices del módulo
│   │   │   │   └── modules/        # Sub-módulos visuales
│   │   │   │       ├── components/ # Componentes del módulo
│   │   │   │       ├── layouts/    # Layouts del módulo
│   │   │   │       ├── modals/     # Modales del módulo
│   │   │   │       └── pages/      # Páginas del módulo
│   │   │   ├── baterias/
│   │   │   ├── calidad/
│   │   │   ├── camiones/
│   │   │   ├── cli/
│   │   │   ├── contenedor/
│   │   │   ├── cuenta/
│   │   │   ├── dobladora/
│   │   │   ├── ebs/
│   │   │   ├── etiquetas/
│   │   │   ├── gerencia/
│   │   │   ├── informes/
│   │   │   ├── ingenieria/
│   │   │   ├── manejoSistema/
│   │   │   ├── oqcGeneral/
│   │   │   ├── otrasPaginas/
│   │   │   ├── planProdSpp/
│   │   │   ├── produccion/
│   │   │   ├── productionOrdersMes/
│   │   │   ├── programacionIndustrial/
│   │   │   ├── seguridadEHigiene/
│   │   │   ├── sgi/
│   │   │   ├── soldadura/
│   │   │   ├── supermercado/
│   │   │   ├── tableros/
│   │   │   ├── tickets/
│   │   │   └── trazabilidad/
│   │   ├── firebase/               # Configuración de Firebase
│   │   ├── models/                 # Interfaces y tipos TypeScript globales
│   │   ├── services/               # Servicios de API globales (289+ servicios)
│   │   └── shared/                 # Elementos transversales de la app
│   │       ├── components/         # Componentes reutilizables
│   │       │   ├── auth/           # Componentes de autenticación
│   │       │   ├── dashboard/      # Componentes de dashboard
│   │       │   ├── helpComponents/ # Componentes de ayuda
│   │       │   ├── main/           # Layout y componentes principales
│   │       │   ├── material-ui/    # Wrappers de Material-UI
│   │       │   ├── notFoundComponent/
│   │       │   ├── Table/          # Componente de tabla genérica
│   │       │   └── ui/             # Componentes UI genéricos
│   │       ├── helpers/            # Funciones auxiliares
│   │       └── hooks/              # Custom React hooks
│   │           └── hooksServices/  # Hooks que consumen servicios
│   ├── assets/                     # Recursos estáticos (imágenes, animaciones)
│   ├── axiosConfig.ts              # Configuración global de Axios
│   ├── CalendarApp.tsx             # Componente raíz del calendario
│   ├── index.tsx                   # Punto de entrada de la aplicación
│   ├── media.css                   # Estilos de media queries
│   ├── service-worker.ts           # Service Worker para PWA
│   ├── serviceWorkerRegistration.ts# Registro del Service Worker
│   └── styles.css                  # Estilos globales
├── public/                         # Archivos públicos estáticos
├── docs/                           # Documentación adicional
├── index.html                      # HTML principal (raíz de Vite)
├── vite.config.mjs                 # Configuración de Vite
├── tsconfig.json                   # Configuración de TypeScript
├── tsconfig.base.json              # Configuración base de TypeScript
├── tailwind.config.js              # Configuración de Tailwind CSS
├── postcss.config.js               # Configuración de PostCSS
├── pnpm-workspace.yaml             # Configuración del workspace pnpm
├── .eslintrc.json                  # Reglas de ESLint
├── .prettierrc                     # Reglas de Prettier
└── package.json                    # Dependencias y scripts
```

## 🏗️ Arquitectura

### Patrón de Diseño

El proyecto sigue una arquitectura **Feature-Based Modular** con separación clara de responsabilidades:

- **Feature Modules:** Cada módulo funcional (ej: `auditorias/`, `calidad/`) encapsula sus propios `models/`, `services/`, `slices/` y `modules/` (components, pages, modals, layouts)
- **Core:** Contiene el `store` de Redux y todos los `routers` de la aplicación
- **Shared:** Componentes, hooks y helpers reutilizables a través de toda la app
- **Lazy Loading de Rutas:** Los módulos se cargan bajo demanda para optimizar el rendimiento
- **Redux Toolkit:** Gestión centralizada del estado con slices por módulo
- **Service Layer:** Separación de lógica de negocio en servicios (global en `app/services/` y por módulo en `features/<module>/services/`)

### Estructura interna de un Feature

Cada módulo dentro de `features/` sigue esta convención:

```
features/<modulo>/
├── composables/    # Lógica reutilizable y composable del módulo
├── models/         # Interfaces y tipos TypeScript locales al módulo
├── services/       # Servicios de API propios del módulo
├── slices/         # Redux slices (estado + reducers + thunks)
└── modules/        # Parte visual del módulo
    ├── components/ # Componentes React del módulo
    ├── layouts/    # Layouts específicos del módulo
    ├── modals/     # Modales del módulo
    └── pages/      # Páginas/vistas del módulo
```

### Módulos Principales

El sistema está dividido en módulos funcionales:

| Módulo | Carpeta | Descripción |
|---|---|---|
| **Administración** | `admin/` | Gestión de usuarios y configuración del sistema |
| **Auditoría** | `audit/` / `auditorias/` | Sistema de auditorías multi-planta |
| **Ayuda** | `ayuda/` | Módulo de ayuda y documentación interna |
| **Baterías** | `baterias/` | Control y seguimiento de baterías |
| **Calidad** | `calidad/` | Control de calidad y gestión de defectos |
| **Camiones** | `camiones/` | Gestión de camiones y logística |
| **CLI** | `cli/` | Interfaz de línea de comandos interna |
| **Contenedor** | `contenedor/` | Gestión de contenedores y embarques |
| **Cuenta** | `cuenta/` | Gestión de cuenta de usuario |
| **Dobladora** | `dobladora/` | Control de herramentales y maquinaria dobladora |
| **EBS/MES** | `ebs/` / `productionOrdersMes/` | Enterprise Business System / Manufacturing Execution System |
| **Etiquetas** | `etiquetas/` | Sistema de etiquetado ZPL e impresiones |
| **Gerencia** | `gerencia/` | Dashboards y vistas de gerencia |
| **Informes** | `informes/` | Generación de reportes y exportaciones |
| **Ingeniería** | `ingenieria/` | Módulo de ingeniería y pautas técnicas |
| **Manejo del Sistema** | `manejoSistema/` | Administración y configuración avanzada |
| **OQC** | `oqcGeneral/` | Outgoing Quality Control |
| **Plan de Producción** | `planProdSpp/` | Planificación y cálculo de producción |
| **Producción** | `produccion/` | Control y seguimiento de líneas de producción |
| **Prog. Industrial** | `programacionIndustrial/` | Programación industrial y dotaciones |
| **Seguridad e Higiene** | `seguridadEHigiene/` | Gestión de extintores, minutas y SGI |
| **SGI** | `sgi/` | Sistema de Gestión Integral |
| **Soldadura** | `soldadura/` | Control de procesos de soldadura |
| **Supermercado** | `supermercado/` | Gestión del supermercado de materiales |
| **Tableros** | `tableros/` | Dashboards y visualizaciones por línea |
| **Tickets** | `tickets/` | Sistema de tickets multi-planta |
| **Trazabilidad** | `trazabilidad/` | Trazabilidad completa de productos |

## ⚙️ Configuración y Setup

### Requisitos Previos

- Node.js >= 14.x
- **pnpm** >= 8.x (gestor de paquetes del proyecto)
- Git

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Navegar al directorio del proyecto
cd spp-frontend-newsan

# Instalar dependencias con pnpm
pnpm install
```

> ⚠️ **Importante:** Este proyecto usa **pnpm** como gestor de paquetes. Está configurado con `pnpm-workspace.yaml` y `.npmrc`. Se recomienda no usar npm o yarn para evitar conflictos de lockfile.

### Variables de Entorno

El proyecto usa archivos de entorno separados por ambiente:

- `.env.development` - Variables para desarrollo local
- `.env.production` - Variables para producción

```env
# Ejemplo de variables utilizadas
VITE_API_URL=<URL_DE_TU_API>
VITE_SPP_URL=<URL_SPP>
```

### Scripts Disponibles

```bash
# Desarrollo - Inicia el servidor en puerto 3000
pnpm dev
# o
pnpm start

# Build - Compila el proyecto para producción (genera en /build)
pnpm build

# Preview - Vista previa del build de producción
pnpm preview

# Lint - Ejecuta ESLint
pnpm lint

# Testing - Ejecuta tests con Vitest
pnpm test

# Testing con UI interactiva
pnpm test:ui

# Coverage de tests
pnpm coverage
```

### Path Alias

El proyecto tiene configurado el alias `app` en Vite que apunta a `./src/app`:

```typescript
// En lugar de:
import { something } from "../../app/shared/hooks/useFetchApi";

// Se puede usar:
import { something } from "app/shared/hooks/useFetchApi";
```

## 🎨 Características del Sistema

### Temas

- Modo claro/oscuro con persistencia en `localStorage`
- Estilos personalizados con Material-UI y Tailwind CSS
- Hook `useDarkMode` para gestión de tema

### Responsive Design

- Diseño adaptativo para móviles, tablets y desktop
- Breakpoints personalizados con Tailwind (configurados en `tailwind.config.js`)
- Media queries centralizadas en `src/media.css`

### PWA (Progressive Web App)

- Service Worker implementado en `src/service-worker.ts`
- Registro automático vía `src/serviceWorkerRegistration.ts`
- Cacheo estratégico con Workbox
- Instalable en dispositivos

### Seguridad

- Autenticación con Firebase (`src/app/firebase/config.js`)
- Tokens JWT para autorización (`jwt-decode`)
- Encriptación con `crypto-ts`
- Rutas protegidas con `PrivateRoute.tsx` y `ProtectedRoute.tsx`

## 🔄 Flujo de Datos

### Redux Store

El estado global se maneja con Redux Toolkit (`src/app/core/store/store.tsx`):

- **Slices:** Cada módulo tiene su propio slice en `features/<modulo>/slices/`
- **Reducers globales:** En `app/Middleware/reducers/`
- **Thunks:** Acciones asíncronas para llamadas API

### API Integration

- Cliente Axios configurado globalmente en `src/axiosConfig.ts` con interceptores
- Servicios globales en `app/services/` (289+ servicios)
- Servicios por módulo en `features/<modulo>/services/`
- Tipos TypeScript para requests/responses en `models/`

## 📊 Diagramas de Flujo

### Estructura para Configuración e Implementación en Plantas

Este es el diagrama donde se ve el flujo de datos de una parte del sistema rey/reina:

- [TrazaSPP](https://dbdiagram.io/d/62cc2e4bcc1bc14cc5958a7c)

### Envío de Producción de WhatsApp

- [Diagrama WhatsApp](https://dbdiagram.io/d/Whatsapp-MSG-64e622cb02bd1c4a5e47e884)

### Dotaciones

- [Diagrama Dotaciones](https://dbdiagram.io/d/Dotaciones-65282d00ffbf5169f094f938)

### ZPL (Etiquetas)

- [Diagrama ZPL](https://dbdiagram.io/d/ZPL-Etiquetas-Diagram-6332d1b97b3d2034ffc7afff)

### OQC (Outgoing Quality Control)

Diagrama para ver el flujo de datos para el OQC. Pensado para todas las plantas pero con particularidades para celulares (paletización y validación en xxx_wip_serie):

- [OQC](https://dbdiagram.io/d/OQC-64f7511102bd1c4a5e0348b3)

### Hora Extra

Diagrama para ver el flujo de datos para horas extras:

- [HoraExtra](https://dbdiagram.io/d/HoraExtra-64abee0e02bd1c4a5ecc901d)

### Dotación 2025 para Planta 6

Pensado para las opciones de planta 6, pero adaptable a otras plantas (tareas configurables):

- [Dotación](https://dbdiagram.io/d/Dotacion-Diagram-688cc65bcca18e685cd89f3e)

### Tickets para Todas las Plantas

Principalmente para planta 3, con soporte multi-planta mediante `plantId`:

- [Tickets](https://lucid.app/lucidchart/7796e3dc-77d2-4957-8d0f-b398cba3f2d8/edit?beaconFlowId=3E61D65637C19BD6&invitationId=inv_81b6e507-5234-4681-9441-f8a137743af2&page=0_0#)

### PlanProd (Plan de Producción)

Sistema automatizado para calcular producciones del día y esperadas:

- [PlanProd](https://dbdiagram.io/d/PlanProd-Diagram-68a4603cec93249d1e414078)

### Auditorias

Sistema de auditorias disponible para todas las plantas.

- [Auditorias](https://dbdiagram.io/d/AuditoriasV2-69585c6039fa3db27bfdf2f6)

## 🛠️ Guía de Desarrollo

### Convenciones de Código

#### TypeScript

- Usar tipos explícitos en interfaces y modelos
- Evitar `any`, preferir `unknown` cuando sea necesario
- Definir Props interfaces para componentes

#### Componentes React

```typescript
// ✅ Buena práctica
interface Props {
  title: string;
  onClose: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onClose }) => {
  // ...
};
```

#### Redux Slices

```typescript
// ✅ Estructura de slice (en features/<modulo>/slices/)
import { createSlice } from "@reduxjs/toolkit";

const mySlice = createSlice({
  name: "myFeature",
  initialState,
  reducers: {
    // reducers síncronos
  },
  extraReducers: (builder) => {
    // thunks asíncronos
  }
});
```

### Estilo de Código

- **ESLint:** Configurado en `.eslintrc.json` con reglas de Google y Prettier
- **Prettier:** Formateo automático en `.prettierrc`
- **Tailwind:** Preferir utility classes sobre CSS personalizado
- **CSS Modules:** Para estilos específicos de componentes cuando sea necesario

### Lazy Loading de Rutas

Para optimizar el rendimiento, las rutas se cargan de forma perezosa desde `src/app/core/router/LazyLoadingRoutes/`:

```typescript
// ✅ Definir componentes lazy FUERA del componente de rutas
const MyLazyComponent = React.lazy(() =>
  import("./MyComponent").then(m => ({ default: m.MyComponent }))
);

// ❌ NO definir dentro del componente (causa re-renders)
export const Routes = () => {
  const MyLazyComponent = React.lazy(...); // ❌ Mal
  // ...
};
```

### Custom Hooks Disponibles

Los hooks se ubican en `src/app/shared/hooks/`:

| Hook | Descripción |
|---|---|
| `UseTitleOfApp` | Cambiar el título de la pestaña del navegador |
| `useNotificationUI` | Mostrar notificaciones (SweetAlert2) |
| `useConfirmationDialog` | Diálogos de confirmación |
| `UseFetchApiMultiResults` | Fetching de datos con múltiples resultados |
| `useFetchApi` | Fetching de datos simple |
| `useFetchApiCallback` | Fetching de datos con callback |
| `useDarkMode` | Gestión del tema claro/oscuro |
| `usePrefersDarkMode` | Detección de preferencia del sistema |
| `useInputValidations` | Validaciones de inputs de formularios |
| `useFileChange` | Gestión de carga de archivos |
| `useGeneratorCodesForLabels` | Generación de códigos para etiquetas |
| `useUtilsHooks` | Utilidades varias |
| `useSafeLocalStorage` | Acceso seguro al localStorage |
| `useAwaitFetchApi` | Fetching con await |
| `useObjectHook` | Gestión de objetos de estado |
| `useCounterHook` | Contador de estado simple |

## 🐛 Debugging

### React DevTools

Instalar la extensión de React Developer Tools para Chrome/Firefox

### Redux DevTools

El proyecto está configurado con Redux DevTools (`@redux-devtools/core`) para inspeccionar el estado global

### Source Maps

Los source maps están habilitados en desarrollo para debugging

### Proxy de Desarrollo

El servidor de desarrollo tiene un proxy configurado en `vite.config.mjs`:

```
/robott → http://192.168.19.72
```

## 📦 Build y Deployment

### Build de Producción

```bash
pnpm build
```

Los archivos se generan en la carpeta `build/` (configurado en `vite.config.mjs`).

### Optimizaciones

- Code splitting automático por rutas (lazy loading)
- Minificación de JS/CSS con Vite/esbuild
- Tree shaking de código no utilizado
- Compresión de assets

## 🧪 Testing

El proyecto usa **Vitest** (compatible con la API de Jest):

```bash
# Ejecutar tests
pnpm test

# Ejecutar con interfaz visual de Vitest
pnpm test:ui

# Generar reporte de coverage
pnpm coverage
```

Los tests se ubican en `src/app/shared/hooks/Test/` y junto a los archivos de cada módulo.

## 📝 Notas Importantes

### Migración de Webpack a Vite

El proyecto fue migrado de Create React App (Webpack) a Vite para mejor rendimiento:

- Variables de entorno: `process.env.REACT_APP_*` → `import.meta.env.VITE_*`
- Build output: `build/` configurado en `vite.config.mjs`

### Service Worker

El service worker (`src/service-worker.ts`) está implementado para funcionalidad PWA y se registra automáticamente en producción mediante `serviceWorkerRegistration.ts`.

### Gestor de Paquetes

El proyecto usa **pnpm** con `pnpm-workspace.yaml`. El lockfile es `pnpm-lock.yaml`. No mezclar con `npm` o `yarn`.

## 👥 Equipo de Desarrollo

- Pablo Ali - Jefe de Proyecto y Jefe de Desarrollo

- Matias Garin - Desarrollador y Analista

- Ezequiel Obreque - Desarrollador

- Elias Olguin - Desarrollador

- Vanina Guevara - Desarrollador

- Sthefano Zurita - Desarrollador

- Ezequiel Moya - Desarrollador

- Luis Orescovich - Desarrollador

- Marcos Cerezo - Desarrollador

- Mathias Perez - Desarrollador

- Cristian Garcia - Desarrollador

### Flujo de Trabajo

1. Crear una rama feature desde `main`
2. Desarrollar la funcionalidad
3. Hacer commit con mensajes descriptivos
4. Crear Pull Request
5. Code Review
6. Merge a `main`

### Commits

Usar mensajes descriptivos en español o inglés:

```
feat: Agregar módulo de tickets
fix: Corregir recarga de MainView al cambiar tema
refactor: Mover lazy components fuera del render
```

## 📞 Soporte

Para desperfectos técnicos o preguntas sobre el sistema, contactar al equipo de desarrollo de Planta 6.

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

**Desarrollado por el equipo de Planta 6** 🏭
