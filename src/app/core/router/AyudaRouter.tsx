import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { LazyRouteConfig, LazyRoutes } from "app/shared/helpers/lazyRoutes";

const ayudaRoutes: LazyRouteConfig[] = [
  {
    path: "/ayuda-page",
    importFn: () => import("app/features/ayuda/pages/AyudaPage"),
    exportName: "AyudaPage",
    permission: "ayuda/ayuda-page"
  },
  {
    path: "/editar-rutas",
    importFn: () => import("app/features/ayuda/pages/RutasAyuda"),
    exportName: "RutasAyuda",
    permission: "ayuda/editar-rutas"
  },
  {
    path: "/editar-padres",
    importFn: () => import("app/features/ayuda/pages/PadresRoutes"),
    exportName: "PadresRoutes",
    permission: "ayuda/editar-padres"
  }
];

export const AyudaRouter = () => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <LazyRoutes basePath={path} routes={ayudaRoutes} userRoutesContext={userRoutesContext} />
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
