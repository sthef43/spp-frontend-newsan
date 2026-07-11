---
name: frontend-components
description: Desarrollo de componentes React del proyecto SPP
---

# Reglas

- Utilizar componentes funcionales.
- Definir interfaces Props.
- Evitar any.
- Utilizar TypeScript estricto.
- Utilizar el IBaseEnity en forma de extends.
- Las interfaces y tipos de entidades del negocio deben ubicarse en `app/models/` y seguir la nomenclatura de prefijar con 'I' tanto el archivo como la interfaz (ej. `app/models/IArea.ts` definiendo `export interface IArea`).

# Buscar primero

Antes de crear componentes nuevos revisar:

app/shared/components/
app/features/**/components/ (o app/features/**/Components/)

# Prioridad

1. Reutilizar componente existente.
2. Extender componente existente.
3. Crear nuevo componente.
