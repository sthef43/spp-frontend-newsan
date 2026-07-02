# Documentación del Módulo de Tickets

Este módulo implementa el sistema de Service Desk para planta 3 (inicialmente orientado al área de celulares), permitiendo la gestión integral de tickets de soporte.

## 1. Propósito y Alcance

El objetivo es centralizar y gestionar las solicitudes de asistencia y mantenimiento. Aunque actualmente se enfoca en Planta 3, está diseñado para ser escalable a otras plantas.

**Diagrama de Base de Datos:**
[Ver Diagrama en Lucidchart](https://lucid.app/lucidchart/7796e3dc-77d2-4957-8d0f-b398cba3f2d8/edit?viewport_loc=1364%2C-102%2C2330%2C1006%2C0_0&invitationId=inv_81b6e507-5234-4681-9441-f8a137743af2)

## 2. Arquitectura del Módulo

El módulo se encuentra en `@app/shared/Pages/tickets` y sigue una estructura modular:

- **`components/`**: Componentes reutilizables de UI (Selectores, Listas, Steppers).
- **`layout/`**: Layouts principales que definen la estructura visual para cada rol (Usuario, Agente, Mantenimiento).
- **`modals/`**: Ventanas modales para creación, edición y visualización de detalles de tickets.
- **`models/`**: Definiciones de tipos TypeScript (Interfaces) que mapean las entidades del backend.
- **`pages/`**: Vistas principales accesibles por ruteo.
- **`reducers/`**: Lógica de gestión de estado (Redux) para manipular la data de los tickets.
- **`services/`**: Capa de comunicación HTTP con la API.

## 3. Roles y Ruteo

El módulo maneja tres perfiles de usuario distintos, definidos en `TicketsRouter.tsx`. Cada uno tiene su propio layout y conjunto de permisos.

### 3.1. Usuario (`/usuario-service-desk`)

- **Objetivo**: Crear tickets y ver el estado de los tickets reportados por él mismo.
- **Layout**: `LayoutServiceDeskUsuario`
- **Funcionalidad Principal**: Reporte de incidentes.

### 3.2. Agente (`/agente-service-desk`)

- **Objetivo**: Gestionar la cola de tickets, asignar prioridades y derivar a especialistas.
- **Layout**: `LayoutServiceDeskAgente`
- **Funcionalidad Principal**: Service Desk, clasificación y seguimiento.

### 3.3. Mantenimiento (`/mantenimiento-service-desk`)

- **Objetivo**: Resolver tickets asignados de tipo técnico/mantenimiento.
- **Layout**: `LayoutServiceDeskMantenimiento`
- **Funcionalidad Principal**: Resolución técnica de incidentes.

## 4. Componentes Clave

### `ListaTicketsComponent`

Es el componente central para visualizar listados de tickets. Soporta filtrado, paginación y acciones según el estado del ticket.

- **Ubicación**: `components/ListaTicketsComponent.tsx`

### `StepperTrazaTicket`

Visualiza el progreso o ciclo de vida de un ticket mediante pasos (Ej: Creado -> En Proceso -> Resuelto).

- **Ubicación**: `components/StepperTrazaTicket.tsx`

### Selectores Reutilizables

Se han creado componentes específicos para la selección de datos maestros:

- `SelectCategoriaComponent`: Selección de categorías de incidente.
- `SelectEstadoComponent`: Filtrado por estado del ticket.
- `SelectRolComponent`: Asignación de roles.
- `SelectGrupoProcesosComponent`: Grupos de resolución.

## 5. Modelos de Datos (Interfaces)

Las interfaces principales se encuentran en la carpeta `models/DTOS`.

- **`ITickets`**: Estructura principal de un ticket.
- **`ITicketsTrazabilidad`**: Historial de cambios y estados de un ticket.
- **`ITicketsCategorias`**: Categorización de los problemas.
- **`ITicketsArchivos`**: Adjuntos relacionados a un ticket.

## 6. Servicios (API)

La comunicación con el backend se realiza a través de servicios dedicados en `services/`.

- `Tickets.service.tsx`: CRUD principal de tickets.
- `TicketsTrazabilidad.service.tsx`: Gestión del historial y cambios de estado.
- `TicketsArchivos.service.tsx`: Subida y descarga de adjuntos.
- `TicketsComentarios.service.tsx`: Gestión de comentarios e interacciones.

## 7. Flujo Típico de Uso

1. **Creación**: Un usuario accede a su panel y crea un ticket especificando categoría y descripción.
2. **Asignación**: Un agente recibe el ticket en su bandeja de entrada (`TicketsPendientes`), lo revisa y lo asigna a un grupo o usuario de mantenimiento.
3. **Resolución**: El usuario de mantenimiento recibe la tarea, trabaja en ella y actualiza el estado (p.ej. a "Resuelto" o "En Espera").
4. **Cierre**: El agente o el sistema valida la resolución y cierra el ticket.
5. **Trazabilidad**: Todo el proceso queda registrado y es consultable mediante el modal de trazabilidad.

## 8. Autores

- Sthefano Zurita - Desarrolador

## 🐛 9. Recomendaciones de Mejora Futura

Basado en la arquitectura actual, se proponen las siguientes mejoras para evolucionar el módulo:

### A. Calidad de Código y Pruebas

- **Pruebas Unitarias**: Implementar tests para los componentes críticos (`ListaTicketsComponent`) y servicios usando _Jest_ y _React Testing Library_.
- **Pruebas de Integración**: Verificar el flujo completo de creación y resolución de tickets.
- **Validación Estricta**: Reforzar el tipado en TypeScript evitando el uso de `any` para asegurar mayor robustez.

### B. Gestión de Estado y Datos

- **React Query / TanStack Query**: Evaluar la migración de las peticiones `GET` de servicios a Hooks de React Query. Esto simplificaría la gestión de caché, estados de carga (loading) y revalidación de datos, reduciendo la dependencia de Redux para datos del servidor.
- **Optimizacion de Contexto**: Revisar el uso de Context API para evitar renderizados innecesarios en componentes hijos.

### C. UX/UI y Rendimiento

- **Lazy Loading de Modales**: Implementar la carga perezosa (`React.lazy`) para los modales pesados, cargando su código solo cuando el usuario los abre.
- **Internacionalización (i18n)**: Si se planea expandir el uso a otras plantas o regiones, extraer los textos "hardcoded" a archivos de recursos.
- **Feedback Visual**: Mejorar las notificaciones de éxito/error al realizar acciones críticas como cerrar un ticket.

### D. Escalabilidad

- **Backend For Frontend (BFF)**: Si la lógica de agregación de datos se vuelve compleja en el cliente, considerar un patrón BFF.
- **Componentes Atómicos**: Refactorizar componentes grandes en sub-componentes más pequeños y testeables.
