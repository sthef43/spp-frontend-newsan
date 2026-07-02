import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/ProtectedRoute";
import { LayoutServiceDeskAgente } from "app/features/tickets/layout/LayoutServiceDeskAgente";
import { LayoutServiceDeskMantenimiento } from "app/features/tickets/layout/LayoutServiceDeskMantenimiento";
import { LayoutServiceDeskUsuario } from "app/features/tickets/layout/LayoutServiceDeskUsuario";
import React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const TicketsRouter = () => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/usuario-service-desk`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tickets/usuario-service-desk")}>
            <LayoutServiceDeskUsuario />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/agente-service-desk`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tickets/agente-service-desk")}>
            <LayoutServiceDeskAgente />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/mantenimiento-service-desk`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tickets/mantenimiento-service-desk")}>
            <LayoutServiceDeskMantenimiento />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
