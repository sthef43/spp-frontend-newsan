/* eslint-disable unused-imports/no-unused-vars */
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { AuditCRUDPage } from "app/features/audit/modules/creacionEdicionAuditorias/submodules/AuditCRUDPage";
import AuditPerform from "app/features/audit/modules/global/realizarAuditoria/AuditPerform";
import { AuditTableOfAudits } from "app/features/audit/modules/creacionEdicionAuditorias/pages/AuditTableOfAudits";
import { AuditTableOfPerformed } from "app/features/audit/modules/reporteDeAuditorias/pages/AuditTableOfPerformed";
import { AuditTodo } from "app/features/audit/modules/asignacionAuditorias/pages/AuditTodo";
import { AuditTodoRegistry } from "app/features/audit/modules/realizarAuditoriasDelDia/pages/AuditTodoRegistry";
import { AuditTrackerPage } from "app/features/audit/modules/seguimientoDeAuditorias/pages/AuditTrackerPage";
import { HistoricPerformedAudit } from "app/features/auditorias";
import { GraficosAuditoriasPage } from "app/features/audit/modules/graficosAuditorias/pages/GraficosAuditoriasPage";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
export const AuditRoute = (props: any): JSX.Element => {
  const userRoutesContext = React.useContext(RoutesUserContext);
  console.log(userRoutesContext);
  const auditoria = "auditoria";
  const location = useLocation();
  const { path } = useRouteMatch();

  return (
    <React.Fragment>
      <Switch location={location}>
        {/* No lleva control de ruta por que no aparece en la BD como una ruta. */}
        <Route path={`${path}/crud/:id`}>
          <AuditCRUDPage />
        </Route>
        <Route path={`${path}/todo`}>
          <ProtectedRoute authorized={userRoutesContext.includes("auditoria/todo")}>
            <AuditTodo />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/perform/:id/:registryId/:todoId`}>
          <AuditPerform />
        </Route>
        <Route path={`${path}/history-perform/:id`}>
          <HistoricPerformedAudit />
        </Route>
        <Route path={`${path}/table-of-audits`}>
          <ProtectedRoute authorized={userRoutesContext.includes("auditoria/table-of-audits")}>
            <AuditTableOfAudits />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/tabla-de-auditorias-terminadas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("auditoria/tabla-de-auditorias-terminadas")}>
            <AuditTableOfPerformed />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/auditorias-para-realizar`}>
          <ProtectedRoute authorized={userRoutesContext.includes("auditoria/auditorias-para-realizar")}>
            <AuditTodoRegistry />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/auditorias-tracker`}>
          <ProtectedRoute authorized={userRoutesContext.includes("auditoria/auditorias-tracker")}>
            <AuditTrackerPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/graficos-auditorias`}>
          <ProtectedRoute authorized={userRoutesContext.includes("auditoria/graficos-auditorias")}>
            <GraficosAuditoriasPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
