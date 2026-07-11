---
name: frontend-services
description: Consumo de APIs y servicios
---

# Servicios

Antes de crear un servicio revisar:

app/services/
app/features/*/services/

Reglas:

- Nunca usar axios directamente en componentes.
- Utilizar axiosConfig.ts.
- Mantener tipado request/response.
- En caso de tener que modificar algun servicio verificar si tiene el generico `src/app/services/generic.service.tsx`, en caso de no tenerlo no agregarlo
