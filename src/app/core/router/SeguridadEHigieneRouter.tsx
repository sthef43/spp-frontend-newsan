import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { AuditDispositivosPage } from "app/features/seguridadEHigiene/formularioDispositivos/pages/AuditDispositivosPage";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ExtintorPage } from "app/features/seguridadEHigiene/extintores/pages/ExtintorPage";
import { AuditoriasPage } from "app/features/seguridadEHigiene/auditoriasPersonal/pages/auditorias/pages/auditoriaDetallePage/AuditoriasPage";
import { AuditoriasEPPPage } from "app/features/seguridadEHigiene/auditoriasPersonal/pages/AuditoriasEPP/AuditoriasEPPPage";
import { AuditoriaDetallePage } from "app/features/seguridadEHigiene/auditoriasPersonal/pages/auditorias/pages/auditoriaDetallePage/AuditoriaDetallePage";

export const SeguridadEHigieneRouter = (props: any): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/auditorias/detalles/:id`}>
          <AuditoriaDetallePage />
        </Route>
        <Route path={`${path}/auditorias/detalles`}>
          <AuditoriaDetallePage />
        </Route>
        <Route path={`${path}/auditorias/epp`}>
          <AuditoriasEPPPage />
        </Route>
        <Route path={`${path}/auditorias`}>
          <ProtectedRoute authorized={userRoutesContext.includes("segehig/auditorias")}>
            <AuditoriasPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/dispositivos-form`}>
          <ProtectedRoute authorized={userRoutesContext.includes("segehig/dispositivos-form")}>
            <AuditDispositivosPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/extintor`}>
          <ProtectedRoute authorized={userRoutesContext.includes("segehig/extintor")}>
            <ExtintorPage />
          </ProtectedRoute>
        </Route>

        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
