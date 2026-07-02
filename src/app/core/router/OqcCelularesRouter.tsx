/* eslint-disable unused-imports/no-unused-vars */
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { LazyRouteConfig, LazyRoutes } from "app/shared/helpers/lazyRoutes";

const OQCCelularesRoutes: LazyRouteConfig[] = [
  {
    path: "/oqc-mantenimiento",
    importFn: () =>
      import("app/features/oqcGeneral/modules/oqcCelulares/modules/oqcMantenimientoLinea/MantenimientoLineaComponent"),
    exportName: "MantenimientoLineaComponent",
    permission: "oqc-celulares/oqc-mantenimiento"
  },
  {
    path: "/oqc-realizar",
    importFn: () => import("app/features/oqcGeneral/modules/oqcCelulares/modules/oqcMotorola/Layout/LayoutOQCRealizar"),
    exportName: "LayoutOQCRealizar",
    permission: "oqc-celulares/oqc-realizar"
  },
  {
    path: "/oqc-modelos",
    importFn: () => import("app/features/oqcGeneral/modules/oqcCelulares/modules/oqcModelos/pages/OQCModelosPage"),
    exportName: "OQCModelosPage",
    permission: "oqc-celulares/oqc-modelos"
  },
  {
    path: "/oqc-palet",
    importFn: () => import("app/features/oqcGeneral/modules/oqcCelulares/modules/oqcPalet/Pages/OQCPaletPage"),
    exportName: "OQCPaletPage",
    permission: "oqc-celulares/oqc-palet"
  }
];

export const OqcCelularesRouter = (): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <>
      <Switch location={location}>
        {/* Todas las rutas lazy-loaded */}
        <LazyRoutes basePath={path} routes={OQCCelularesRoutes} userRoutesContext={userRoutesContext} />

        {/* Ruta por defecto */}
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </>
  );
};
