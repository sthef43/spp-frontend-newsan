---
description: Create a full SPP feature module
---

Create a new feature module in the SPP project.

The module name comes from `$ARGUMENTS`. If `$ARGUMENTS` is empty or blank, ask: "¿Qué nombre quieres para el módulo?"

Rules:

- Extract the module name from `$ARGUMENTS` (for example: "usuarios", "productos", "clientes")
- If the input is empty or blank, stop and ask the user for the module name
- Convert the name to PascalCase as `{Name}` and to lowercase as `{name_lower}`
- Delegate the full creation to the orchestrator; do not create the module directly from this command
- The orchestrator must create the full structure: base folders, page, router, and route registration

Flow:

1. Get the module name from `$ARGUMENTS` or ask the user
2. Normalize the name into `{Name}` and `{name_lower}`
3. Call the task tool with `subagent_type: "create-module-orchestrator"` and a prompt like:
   "Crea el módulo {Name} ({name_lower}). Ejecuta el flujo completo: crear la estructura base con module_creator, crear page/router, y registrar rutas con Integrador. Verifica que todas las carpetas base y las rutas existan antes de reportar éxito."
4. Wait for the orchestrator result
5. Show the result to the user, including the module name, generated files, and whether the route registration succeeded
6. If the orchestrator reports an error, report the error to the user and do not claim success
