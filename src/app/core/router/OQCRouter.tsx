import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { LazyRouteConfig, LazyRoutes } from "app/shared/helpers/lazyRoutes";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";

const OQCRoutes: LazyRouteConfig[] = [
  {
    path: "/oqc-page",
    importFn: () => import("app/features/oqcGeneral/modules/oqc/administrarOqc/pages/OQCPage"),
    exportName: "OQCPage",
    permission: "oqc/oqc-page"
  },
  {
    path: "/oqc-categorias",
    importFn: () => import("app/features/oqcGeneral/modules/oqc/agregarCategoriaOqc/pages/OQCCategoriaPage"),
    exportName: "OQCCategoriaPage",
    permission: "oqc/oqc-categorias"
  },
  {
    path: "/oqc-ponderacion",
    importFn: () => import("app/features/oqcGeneral/modules/oqc/agregarPonderacionOqc/pages/OQCPonderacionPage"),
    exportName: "OQCPonderacionPage",
    permission: "oqc/oqc-ponderacion"
  },
  {
    path: "/oqc-hallazgos",
    importFn: () => import("app/features/oqcGeneral/modules/oqc/agregarHallazgoOqc/pages/OQCHallazgoPage"),
    exportName: "OQCHallazgoPage",
    permission: "oqc/oqc-hallazgos"
  },
  {
    path: "/oqc-designadas",
    importFn: () => import("app/features/oqcGeneral/modules/oqc/realizarOqc/pages/OQCDesignadasPage"),
    exportName: "OQCDesignadasPage",
    permission: "oqc/oqc-designadas"
  },
  {
    path: "/reporte-oqc",
    importFn: () => import("app/features/oqcGeneral/modules/oqc/reporteOqc/pages/OQCReportePage"),
    exportName: "OQCReportePage",
    permission: "oqc/reporte-oqc"
  },
  {
    path: "/oqc-realizar-designada/:numSerie",
    importFn: () => import("app/features/oqcGeneral/modules/oqc/realizarOqc/pages/OQCRealizarDesignadaPage"),
    exportName: "OQCRealizarDesignadaPage"
  },
  {
    path: "/oqc-realizar-designada",
    importFn: () => import("app/features/oqcGeneral/modules/oqc/realizarOqc/pages/OQCRealizarDesignadaPage"),
    exportName: "OQCRealizarDesignadaPage"
  }
];

export const OQCRouter = (): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <>
      <Switch location={location}>
        <LazyRoutes basePath={path} routes={OQCRoutes} userRoutesContext={userRoutesContext} />
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </>
  );
};
