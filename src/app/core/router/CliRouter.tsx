import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { LazyRouteConfig, LazyRoutes } from "app/shared/helpers/lazyRoutes";

const CliRoutes: LazyRouteConfig[] = [
  {
    path: "/creacion-sectores",
    importFn: () => import("app/features/cli/Pages/CreacionSectores"),
    exportName: "CreacionSectores",
    permission: "cli/creacion-sectores"
  },
  {
    path: "/creacion-ubicaciones",
    importFn: () => import("app/features/cli/Pages/CreacionUbicaciones"),
    exportName: "CreacionUbicaciones",
    permission: "cli/creacion-ubicaciones"
  },
  {
    path: "/asignacion-ubicaciones",
    importFn: () => import("app/features/cli/Pages/AsignacionUbicaciones"),
    exportName: "AsignacionUbicaciones",
    permission: "cli/asignacion-ubicaciones"
  },
  {
    path: "/creacion-items",
    importFn: () => import("app/features/cli/Pages/CreacionItems"),
    exportName: "CreacionItems",
    permission: "cli/creacion-items"
  },
  {
    path: "/creacion-contenedores",
    importFn: () => import("app/features/cli/Pages/CreacionContenedoresItems"),
    exportName: "CreacionContenedoresItems",
    permission: "cli/creacion-contenedores"
  },
  {
    path: "/prueba",
    importFn: () => import("app/features/cli/Pages/Pruebas"),
    exportName: "Pruebas",
    permission: "cli/prueba"
  }
];

export const CliRouter = () => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <Switch location={location}>
      {/* Todas las rutas lazy-loaded */}
      <LazyRoutes basePath={path} routes={CliRoutes} userRoutesContext={userRoutesContext} />

      {/* Ruta por defecto */}
      <Route path={`${path}/*`}>
        <Redirect to={"/main"} />
      </Route>
    </Switch>
  );
};
