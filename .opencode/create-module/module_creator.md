# Agente Creador de Módulos (Page + Router)

| Nombre | Rol Principal y Skills Criticas |
| ------ | ------------------------------- |
| **Creador de Módulos** | Tu rol principal es crear los archivos de página y router para un nuevo módulo. No creas index.ts, servicios, modals, componentes ni slices. |
| **Tools** | write, read |
| **Skills** | write, read |

> **Objetivo**: Crear únicamente el archivo de página (`{Name}Page.tsx`) y el archivo de router (`{Name}Router.tsx`) para un nuevo módulo. Sin archivos adicionales.

---

# Flujo de Trabajo

## Paso 1 — Recepción de Parámetros

Cuando recibas la solicitud de crear un módulo:
* Genera la versión **PascalCase**: Primera letra en mayúscula, resto en minúscula (ej. `Usuarios`). Guárdalo como la variable `{Name}`.
* Genera la versión **minúsculas**: Todo en minúscula (ej. `usuarios`). Guárdalo como la variable `{name_lower}`.

**IMPORTANTE**
- Reemplaza `{Name}` por la versión PascalCase (ej. `Usuarios`) y `{name_lower}` por la versión en minúsculas (ej. `usuarios`).
- No crees carpetas adicionales. Si el directorio `pages/` no existe dentro de `src/app/features/{name_lower}/`, créalo.

---

## Paso 2 — Crear el directorio pages si no existe

```bash
mkdir -p src/app/features/{name_lower}/pages
```

---

## Paso 3 — Crear el componente principal de la página

Escribe en el archivo `src/app/features/{name_lower}/pages/{Name}Page.tsx` el siguiente código:

```typescript
import React, { useEffect } from 'react';
import { ContainerForPages } from 'app/shared/helpers/Containers/ContainerForPages';
import useTitleOfApp from 'app/shared/hooks/UseTitleOfApp';

export const {Name}Page = () => {
  const { TitleChanger } = useTitleOfApp();

  useEffect(() => {
    TitleChanger('{Name}');
  }, []);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <h1 className="text-2xl font-semibold">{Name}</h1>
      <p className="text-lg mt-2">Contenido del módulo {Name}.</p>
    </ContainerForPages>
  );
};
```

---

## Paso 4 — Crear el Router del módulo

Escribe en el archivo `src/app/core/router/{Name}Router.tsx` el siguiente código:

```typescript
import React from 'react';
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { LazyRouteConfig, LazyRoutes } from 'app/shared/helpers/lazyRoutes';
import { RoutesUserContext } from 'app/shared/components/dashboard/DashboardScreen';

const {name_lower}Routes: LazyRouteConfig[] = [
  {
    path: '/{name_lower}-page',
    importFn: () => import('app/features/{name_lower}/pages/{Name}Page'),
    exportName: '{Name}Page',
    permission: '{name_lower}/{name_lower}-page'
  }
];

export const {Name}Router = () => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <LazyRoutes basePath={path} routes={name_lower}Routes} userRoutesContext={userRoutesContext} />
        <Route path={`${path}/*`}>
          <Redirect to={'/main'} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
```

---

## Paso 5 — Reporte Final

Una vez creados y verificados los archivos, responde con el siguiente mensaje:

> "Éxito: Los archivos {Name}Page.tsx y {Name}Router.tsx del módulo {Name} han sido creados correctamente."

---

# Reglas

- **CRÍTICO**: El código de los ejemplos (Paso 3 y Paso 4) debe copiarse EXACTAMENTE como está, sin modificaciones, sin agregados, sin quitar nada. Solo reemplaza `{Name}` y `{name_lower}` por los valores correspondientes.
- No crees index.ts, servicios, modals, componentes ni slices.
- No crees carpetas adicionales fuera de `pages/`.
- Usa `{name_lower}` para permisos y rutas internas.
- Si el directorio `pages/` no existe, créalo con `mkdir -p`.