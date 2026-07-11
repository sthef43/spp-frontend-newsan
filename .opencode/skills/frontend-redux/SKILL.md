---
name: frontend-redux
description: Estado global Redux Toolkit
---

# Redux

Reglas:

- Utilizar slices existentes.
- Crear nuevos slices solo si es necesario.
- Utilizar thunks.
- No realizar llamadas HTTP dentro de componentes.
- En caso de tener que modificar algun slice verificar si tiene el generico `src/app/Middleware/reducers/genericSlice.tsx`, en caso de no tenerlo no agregarlo
- Al crear un slice nuevo, este DEBE ser registrado en el `rootReducer` (ubicado en `src/app/Middleware/reducers/rootReducer.tsx`).

Buscar primero:

app/features/*/slices/
app/Middleware/reducers/
