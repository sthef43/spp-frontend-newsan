# SPP - Sistema de Piso Planta

## 📋 Descripción General

**SPP (Sistema de Piso Planta)** es una aplicación web empresarial desarrollada para **Newsan**, diseñada para gestionar y analizar información del proceso productivo en múltiples plantas de producción. El sistema permite realizar el seguimiento de reportes de no conformidad, reparaciones, auditorías, control de calidad, trazabilidad y muchas otras funcionalidades críticas para la operación industrial.

**Versión actual:** v.1.4.80

## 🚀 Tecnologías Principales

### Frontend

- **React** v17.0.0 - Librería UI principal
- **TypeScript** v4.1.3 - Tipado estático
- **Redux Toolkit** - Gestión de estado global
- **React Router DOM** v5.2.0 - Enrutamiento
- **Material-UI** v5.16.7 - Componentes UI
- **Tailwind CSS** v3.0.9 - Framework de estilos utility-first
- **Vite** v5.0.0 - Build tool y dev server

### Características Adicionales

- **Firebase** v12.4.0 - Autenticación y servicios
- **SignalR** v9.0.6 - Comunicación en tiempo real
- **Chart.js** v4.4.5 - Gráficos y visualizaciones
- **Workbox** v7.4.0 - Service Worker y PWA
- **React Hook Form** v7.52.2 - Gestión de formularios
- **Axios** v0.21.1 - Cliente HTTP
- **Moment.js** v2.29.1 - Manipulación de fechas
- **Lottie React** v2.4.1 - Animaciones

## 📁 Estructura del Proyecto

```
ClientApp/
├── src/
│   ├── app/
│   │   ├── Middleware/         # Redux store, slices y middlewares
│   │   ├── models/             # Interfaces y tipos TypeScript
│   │   ├── routers/            # Configuración de rutas y lazy loading
│   │   ├── services/           # Servicios de API
│   │   └── shared/             # Componentes, páginas y utilidades compartidas
│   │       ├── components/     # Componentes reutilizables
│   │       ├── Pages/          # Páginas de módulos específicos
│   │       ├── helpers/        # Funciones auxiliares
│   │       └── hooks/          # Custom React hooks
│   ├── assets/                 # Recursos estáticos (imágenes, animations)
│   ├── styles.css             # Estilos globales
│   ├── index.tsx              # Punto de entrada
│   └── service-worker.ts      # Service Worker para PWA
├── public/                     # Archivos públicos estáticos
├── vite.config.mjs            # Configuración de Vite
├── tsconfig.json              # Configuración de TypeScript
├── tailwind.config.js         # Configuración de Tailwind
└── package.json               # Dependencias y scripts
```

## 🏗️ Arquitectura

### Patrón de Diseño

El proyecto sigue una arquitectura modular basada en:

- **Lazy Loading de Rutas:** Los módulos se cargan bajo demanda para optimizar el rendimiento
- **Redux Toolkit:** Gestión centralizada del estado con slices
- **Component-Based Architecture:** Componentes reutilizables y composables
- **Service Layer:** Separación de lógica de negocio en servicios
- **Custom Hooks:** Lógica reutilizable extraída en hooks personalizados

### Módulos Principales

El sistema está dividido en módulos funcionales:

- **Administración** - Gestión de usuarios y configuración
- **Auditoría** - Sistema de auditorías
- **Baterías** - Control de baterías
- **Calidad** - Control de calidad y defectos
- **Contenedor** - Gestión de contenedores
- **Dobladora** - Control de dobladora
- **EBS/MES** - Enterprise Business System / Manufacturing Execution System
- **Etiquetas** - Sistema de etiquetado
- **Informes** - Generación de reportes
- **Ingeniería** - Módulo de ingeniería
- **Materiales** - Gestión de materiales
- **OQC** - Outgoing Quality Control
- **Producción** - Control de producción
- **Seguridad e Higiene** - SGI (Sistema de Gestión Integral)
- **Soldadura** - Control de soldadura
- **Tableros** - Dashboards y visualizaciones
- **Tickets** - Sistema de tickets
- **Trazabilidad** - Trazabilidad de productos

## ⚙️ Configuración y Setup

### Requisitos Previos

- Node.js >= 14.x
- Yarn >= 1.22.22 (recomendado) o npm
- Git

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Navegar al directorio del proyecto
cd Spp-Vite/SPP.Api/ClientApp

# Instalar dependencias
yarn install
# o
npm install
```

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=<URL_DE_TU_API>
VITE_SPP_URL=<URL_SPP>
```

### Scripts Disponibles

```bash
# Desarrollo - Inicia el servidor de desarrollo en puerto 3000
yarn dev
# o
npm run dev

# Build - Compila el proyecto para producción
yarn build
# o
npm run build

# Preview - Vista previa del build de producción
yarn preview
# o
npm preview

# Lint - Ejecuta el linter
yarn lint
# o
npm run lint
```

## 🎨 Características del Sistema

### Temas

- Modo claro/oscuro con persistencia en `localStorage`
- Estilos personalizados con Material-UI y Tailwind CSS

### Responsive Design

- Diseño adaptativo para móviles, tablets y desktop
- Breakpoints personalizados con Tailwind

### PWA (Progressive Web App)

- Service Worker para funcionamiento offline
- Cacheo estratégico con Workbox
- Instalable en dispositivos

### Internacionalización

- Soporte para múltiples idiomas (configurable)
- Formateo de fechas con Moment.js

### Seguridad

- Autenticación con Firebase
- Tokens JWT para autorización
- Encriptación con crypto-ts

## 🔄 Flujo de Datos

### Redux Store

El estado global se maneja con Redux Toolkit:

- **Slices:** Cada módulo tiene su propio slice
- **Thunks:** Acciones asíncronas para llamadas API
- **Middleware:** Redux Thunk para side effects

### API Integration

- Cliente Axios configurado con interceptores
- Manejo centralizado de errores
- Tipos TypeScript para requests/responses

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
// ✅ Estructura de slice
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

- **ESLint:** Configurado con reglas de Google y Prettier
- **Prettier:** Formateo automático de código
- **Tailwind:** Preferir utility classes sobre CSS personalizado
- **CSS Modules:** Para estilos específicos de componentes cuando sea necesario

### Lazy Loading de Rutas

Para optimizar el rendimiento, las rutas se cargan de forma perezosa:

```typescript
// ✅ Definir componentes lazy FUERA del componente
const MyLazyComponent = React.lazy(() =>
  import("./MyComponent").then(m => ({ default: m.MyComponent }))
);

// ❌ NO definir dentro del componente (causa re-renders)
export const Routes = () => {
  const MyLazyComponent = React.lazy(...); // ❌ Mal
  // ...
};
```

### Hooks Personalizados

El proyecto incluye varios hooks útiles:

- `useTitleOfApp` - Cambiar título de la aplicación
- `useNotificationUI` - Mostrar notificaciones
- `useConfirmationDialog` - Diálogos de confirmación
- `useFetchApiMultiResults` - Fetching de datos
- `useDarkModeClass` - Gestión de tema

## 🐛 Debugging

### React DevTools

Instalar la extensión de React Developer Tools para Chrome/Firefox

### Redux DevTools

El proyecto está configurado con Redux DevTools para inspeccionar el estado

### Source Maps

Los source maps están habilitados en desarrollo para debugging

## 📦 Build y Deployment

### Build de Producción

```bash
yarn build
```

Los archivos se generan en la carpeta `build/`

### Optimizaciones

- Code splitting automático por rutas
- Minificación de JS/CSS
- Tree shaking de código no utilizado
- Compresión de assets

## 🧪 Testing

El proyecto está configurado con:

- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes

```bash
# Ejecutar tests (cuando estén implementados)
yarn test
```

## 📝 Notas Importantes

### Migración de Webpack a Vite

El proyecto fue migrado de Create React App (Webpack) a Vite para mejor rendimiento:

- Variables de entorno: `process.env.REACT_APP_*` → `import.meta.env.VITE_*`
- Build output: `build/` configurado en `vite.config.mjs`

### Service Worker

El service worker está implementado para funcionalidad PWA. Se registra automáticamente en producción.

### Proxy de Desarrollo

El servidor de desarrollo tiene un proxy configurado para `/robott` que apunta a `http://192.168.19.72`

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
