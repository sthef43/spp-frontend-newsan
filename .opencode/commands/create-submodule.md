---
description: Create a new SPP submodule under an existing parent module (with structure, pages, routing, forms, and API integration)
---

Create a new submodule inside an existing feature module in the SPP project.

Extract the submodule name and parent module from `$ARGUMENTS`. If `$ARGUMENTS` is empty, prompt the user.

**Syntax examples:**
- `Products` — creates a submodule (prompts for parent module)
- `Reports under Dashboard` — creates Reports under the Dashboard module
- `Clients with selects for country and branch` — creates Clients with form filters
- `Analytics with a bar chart and selects` — creates Analytics with a chart component and form filters

**Rules:**
- Extract submodule name (PascalCase) and optional parent module name from `$ARGUMENTS`
- If no parent module is specified, ask: "Which parent module should it belong to?"
- Detect if the user mentions "select", "filter", "dropdown", "form" → pass as `{Selects}` argument
- Detect if the user mentions "chart", "graph", "bar", "line", "pie" → pass as `{Grafico}` argument
- If no selects, graph, or table are specified in `$ARGUMENTS`, ask the user interactively:
  - "How many selects/filters does the submodule need?" (if > 0, pass as `{Selects}` with count)
  - "Do you want a table component? (yes/no)" (if yes, the page template will include `TableComponent`)
  - "Do you need a chart or graph? (yes/no)" (if yes, ask which type and pass as `{Grafico}`)

**Flow:**
1. Parse `$ARGUMENTS` to extract submodule name, parent module, selects, and graph requirements
2. If missing parent module, ask the user
3. If no features were specified (selects, table, chart), ask interactively to determine what the submodule needs
4. Call the task tool with `subagent_type: "submodules_creator/orchestrators/orchestrators_creator"` and a detailed prompt including all arguments
5. Wait for the result
6. Show the result summary to the user
