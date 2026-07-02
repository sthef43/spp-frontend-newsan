import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { LazyRoutes } from "app/shared/helpers/lazyRoutes";
import React from "react";
import { useRouteMatch, useLocation, Switch, Redirect, Route } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { LazyRouteConfig } from "app/shared/helpers/lazyRoutes";

const AuditoriasRoutes: LazyRouteConfig[] = [
  {
    path: "/creacion-auditorias",
    importFn: () => import("app/features/auditorias/modules/pages/creacionAuditorias/CreacionAuditoriasMain"),
    exportName: "CreacionAuditoriasMain",
    permission: "auditorias-v2/creacion-auditorias"
  },
  {
    path: "/asignar-auditorias",
    importFn: () => import("app/features/auditorias/modules/pages/asignarAuditorias/AsignarAuditoriasMain"),
    exportName: "AsignarAuditoriasMain",
    permission: "auditorias-v2/asignar-auditorias"
  },
  {
    path: "/realizar-auditorias",
    importFn: () => import("app/features/auditorias/modules/pages/realizarAuditorias/RealizarAuditoriasMain"),
    exportName: "RealizarAuditoriasMain",
    permission: "auditorias-v2/realizar-auditorias"
  },
  {
    path: "/reporte-auditorias",
    importFn: () => import("app/features/auditorias/modules/pages/reporteAuditoria/ReporteAuditoriaMain"),
    exportName: "ReporteAuditoriaMain",
    permission: "auditorias-v2/reporte-auditorias"
  },

  //Rutas que son accesibles sin permisos
  {
    path: "/crud-creacion-auditorias",
    importFn: () => import("app/features/auditorias/modules/pages/global/CrudCreacionAuditorias"),
    exportName: "CrudCreacionAuditorias"
  },
  {
    path: "/crud-editar-auditoria/:id",
    importFn: () => import("app/features/auditorias/modules/pages/global/CrudCreacionAuditorias"),
    exportName: "CrudCreacionAuditorias"
  },
  //Se usa el mismo componente tanto para poder examinar como para realizar las auditorias
  //Se diferencia por el estado que se le pasa por parametro
  {
    path: "/completar-auditoria/:id/:estado",
    importFn: () => import("app/features/auditorias/modules/pages/global/CompletarAuditoria"),
    exportName: "CompletarAuditoria"
  },
  {
    path: "/examinar-auditoria/:id/:estado",
    importFn: () => import("app/features/auditorias/modules/pages/global/CompletarAuditoria"),
    exportName: "CompletarAuditoria"
  }
];

export const AuditoriasRoute = (): JSX.Element => {
  const { path } = useRouteMatch();
  const location = useLocation();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <>
      <SwitchTransition>
        <CSSTransition
          timeout={{ enter: 600, exit: 600 }}
          classNames={{
            enter: "animate__animated animate__fadeIn animate__faster",
            exit: "animate__animated animate__fadeOut animate__faster"
          }}
          key={location.key}>
          <Switch location={location}>
            <LazyRoutes basePath={path} routes={AuditoriasRoutes} userRoutesContext={userRoutesContext} />
            <Route path={`${path}/*`}>
              <Redirect to={"/main"} />
            </Route>
          </Switch>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};
