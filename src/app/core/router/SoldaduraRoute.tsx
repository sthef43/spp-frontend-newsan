import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { GestionCaniosPage } from "app/features/soldadura/gestionDeCaños/pages/GestionCaniosPage";
import { CodigoSoldadura } from "app/features/soldadura/cargarImagenReparador/pages/CodigoSoldadura";
export const SoldaduraRoute = (): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/gestion-canios`}>
          <ProtectedRoute authorized={userRoutesContext.includes("soldadura/gestion-canios")}>
            <GestionCaniosPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/codigoSoldadura`}>
          <ProtectedRoute authorized={userRoutesContext.includes("soldadura/codigoSoldadura")}>
            <CodigoSoldadura />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
