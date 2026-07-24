---
description: Create a full SPP feature module
---

Create a new feature module in the SPP project.

The module name comes from `$ARGUMENTS`. If `$ARGUMENTS` is empty, ask: "¿Qué nombre quieres para el módulo?"

Rules:

- Extract the module name from `$ARGUMENTS` (e.g., "usuarios", "productos", "clientes")
- If `$ARGUMENTS` is empty or blank, ask: "¿Qué nombre quieres para el módulo?"
- Convert the name to PascalCase (e.g., "usuarios" → "Usuarios", "cqa" → "Cqa")
- Keep a lowercase version (e.g., "usuarios", "cqa")

Flow:

1. Get the module name from `$ARGUMENTS` or by asking the user
2. Convert to PascalCase (`{Name}`) and lowercase (`{name_lower}`)
3. Call the task tool with `subagent_type: "create-module-orchestrator"` and a prompt like: "Crea el módulo {Name}. Ejecuta el flujo completo: crear archivos (module_creator) y registrar rutas (Integrador)."
4. Wait for the result from the orchestrator
5. Show the result to the user
