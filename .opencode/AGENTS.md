# AGENTS.md — Frontend SPP

Punto de entrada central. Este archivo es referenciado por `FRONTEND_AGENT.md` y `skills/frontend-architect/SKILL.md`.

---

## Stack del proyecto

| Tecnología | Versión |
|---|---|
| React | 17 |
| TypeScript | 4 |
| Redux Toolkit | 1.5 |
| React Router DOM | v5 |
| Material UI (MUI) | — |
| Tailwind CSS | — |
| Vite | — |

---

## Reglas globales (desde `FRONTEND_AGENT.md`)

1. Revisar **`.opencode/`** completo antes de cada tarea
2. Revisar **este archivo (`AGENTS.md`)**
3. Revisar las **skills frontend** en `.opencode/skills/`
4. Buscar implementaciones existentes antes de crear código nuevo

**Principio rector**: `REUTILIZAR > EXTENDER > CREAR`

**Prohibido**:
- Actualizar dependencias
- Cambiar arquitectura
- Migrar React, Redux o React Router

---

## Skills del proyecto (`.opencode/skills/`)

### Frontend SPP

| Skill | Propósito | Buscar primero en |
|---|---|---|
| [frontend-architect](skills/frontend-architect/SKILL.md) | Arquitectura general y stack | — |
| [frontend-components](skills/frontend-components/SKILL.md) | Componentes React | `app/shared/components/`, `app/features/**/components/` |
| [frontend-hooks](skills/frontend-hooks/SKILL.md) | Hooks y lógica reutilizable | `app/shared/hooks/`, `app/shared/hooks/hooksServices/` |
| [frontend-redux](skills/frontend-redux/SKILL.md) | Estado global Redux Toolkit | `app/features/*/slices/`, `app/Middleware/reducers/` |
| [frontend-routing](skills/frontend-routing/SKILL.md) | Sistema de rutas | `app/core/router/` |
| [frontend-services](skills/frontend-services/SKILL.md) | Consumo de APIs | `app/services/`, `app/features/*/services/` |
| [frontend-ui](skills/frontend-ui/SKILL.md) | UI y estilos | `app/shared/components/` > MUI > Tailwind |

### Generales / Terceros

| Skill | Propósito |
|---|---|
| [accessibility](skills/accessibility/SKILL.md) | Auditoría y mejora de accesibilidad WCAG |
| [composition-patterns](skills/composition-patterns/SKILL.md) | Patrones de composición React |
| [frontend-design](skills/frontend-design/SKILL.md) | Diseño de interfaces de alta calidad |
| [nodejs-backend-patterns](skills/nodejs-backend-patterns/SKILL.md) | Patrones backend Node.js |
| [nodejs-best-practices](skills/nodejs-best-practices/SKILL.md) | Buenas prácticas Node.js |
| [react-best-practices](skills/react-best-practices/SKILL.md) | Optimización de rendimiento React |
| [react-hook-form](skills/react-hook-form/SKILL.md) | Formularios con React Hook Form |
| [seo](skills/seo/SKILL.md) | Optimización para buscadores |
| [tailwind-css-patterns](skills/tailwind-css-patterns/SKILL.md) | Patrones de estilo Tailwind CSS |
| [typescript-advanced-types](skills/typescript-advanced-types/SKILL.md) | Tipos avanzados de TypeScript |
| [vite](skills/vite/SKILL.md) | Configuración y plugins de Vite |
| [vitest](skills/vitest/SKILL.md) | Testing unitario con Vitest |

---

## Agentes de Corrección por README

| Agente | Propósito | Archivo |
|--------|-----------|---------|
| [readme-fixer-agent](agents/readme-fixer-agent.md) | Agente principal que lee README.md, extrae "Mejoras / Observaciones del Revisor" y coordina corrección automática |
| [readme-orchestrator](agents/orchestrators/readme-orchestrator.md) | Orquestador puente entre README.md y componentes. Categoriza issues, consulta estándares y delega al fixer |
| [readme-fixer](agents/fixers/readme-fixer.md) | Aplica correcciones al código según observaciones del README, organizado por área (estructura, formularios, API, estado/UI) |

---

## Referencias útiles

| Archivo | Contenido |
|---|---|
| `SHARED-REFERENCE.md` | Documentación detallada de `app/shared/helpers/`, `app/shared/hooks/` y `ModalComponent` |
| `app/shared/components/` | Componentes reutilizables (`ModalComponent`, `ProtectedRoute`, `themeToggle`, etc.) |
| `app/shared/helpers/` | Utilidades, selectores, contenedores, formularios genéricos |
| `app/shared/hooks/` | Hooks de API, UI, validación, utilidades |

---

## Flujo de trabajo antes de cualquier tarea

```
1. Leer AGENTS.md (este archivo)
2. Leer FRONTEND_AGENT.md
3. Leer skill relevante según la tarea
4. Leer SHARED-REFERENCE.md (si aplica)
5. Buscar implementaciones existentes en el código
6. REUTILIZAR > EXTENDER > CREAR
```
