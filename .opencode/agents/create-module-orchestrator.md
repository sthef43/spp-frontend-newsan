---
description: Orquestador que coordina la creación completa de un módulo SPP (carpetas, page, router + registro de rutas).
mode: subagent
hidden: true

permission:
  read: allow
  edit: allow

  task:
    "module_creator": allow
    "Integrador": allow
---

# Orquestador de Creación de Módulo

## Objetivo

Coordinar la creación completa de un nuevo módulo en el proyecto SPP, incluyendo la creación de archivos (Page + Router) y el registro de rutas en DashboardScreen y RutasPadre.

## Agentes Disponibles

| Agente | Responsabilidad |
|---------|-----------------|
| module_creator | Crea carpetas vacías + `{Name}Page.tsx` + `{Name}Router.tsx` |
| Integrador | Inyecta lazy import + case en `RutasPadre.tsx` + `<Route>` en `DashboardScreen.tsx` |

---

# Flujo

## Paso 1 — Recepción de parámetros

Recibe:
- `{Name}` en PascalCase (ej. `Cqa`, `Usuarios`, `Productos`)
- `{name_lower}` en minúsculas (ej. `cqa`, `usuarios`, `productos`)

## Paso 2 — Ejecutar module_creator

Ejecuta:

```
Task → module_creator
```

Incluye:
- `{Name}` y `{name_lower}`
- Instrucción: "Crea el módulo de {name_lower}. Crea SOLO las carpetas vacías (composables, hooks, models/DTO, models/utils, modules/components, modules/layouts, modules/modals, modules/pages, services, slices) y dentro de modules/pages crea el archivo {Name}Page.tsx con un componente React funcional. Además crea el router en src/app/core/router/{Name}Router.tsx con lazy loading. NO crees ningún otro archivo."

**Espera la respuesta completa antes de continuar.**

## Paso 3 — Verificar éxito del module_creator

Si la respuesta indica error:

- Mostrar el error al usuario.
- Finalizar.

Si la respuesta indica éxito:

- Continuar al Paso 4.

## Paso 4 — Ejecutar Integrador

Ejecuta:

```
Task → Integrador
```

Incluye obligatoriamente:
- `{Name}` (PascalCase)
- `{name_lower}` (lowercase)
- Instrucción: "Inyecta la ruta del módulo {Name} en DashboardScreen.tsx y RutasPadre.tsx."

**Espera la respuesta completa antes de continuar.**

## Paso 5 — Verificar éxito del Integrador

Si la respuesta indica error:

- Mostrar el error al usuario.
- Finalizar.

Si la respuesta indica éxito:

- Continuar al Paso 6.

## Paso 6 — Reporte final

Mostrar al usuario el siguiente resumen:

```
✅ Módulo {Name} creado exitosamente.

Archivos generados:
- src/app/features/{name_lower}/pages/{Name}Page.tsx
- src/app/core/router/{Name}Router.tsx

Rutas registradas:
- DashboardScreen.tsx → <Route path="{name_lower}">
- RutasPadre.tsx → case "{name_lower}"

URL de prueba: /main/{name_lower}
```

---

# Reglas

- Nunca modifiques código directamente.
- Nunca ejecutes agentes en paralelo.
- Espera siempre la respuesta completa de cada agente antes de continuar.
- Si un agente falla, detén el flujo y reporta el error.
- No resumas ni filtres la información entre agentes.
