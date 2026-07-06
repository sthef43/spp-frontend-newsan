import * as React from "react";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { Pedidos } from "app/features/contenedor/modules/pedidos/pages/Pedidos";
import { ImportarPlanProd } from "app/features/contenedor/modules/importarPlanProd/ImportarPlanProd";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { Indicadores } from "app/features/contenedor/modules/indicadores/Indicadores";
import { PedidosFin } from "app/features/contenedor/modules/pedidosFin/PedidosFin";
import { CLIUbicaciones } from "app/features/contenedor/modules/cliUbicaciones/pages/CLIUbicaciones";
import { IntRemito } from "app/features/contenedor/modules/intRemito/pages/IntRemito";
import { IntDarsenas } from "app/features/contenedor/modules/intDarsenas/IntDarsenas";
import { IntEnvio } from "app/features/contenedor/modules/intEnvio/pages/IntEnvio";
import { Planilla } from "app/features/contenedor/modules/planilla/Planilla";

export const ContenedorRoute = (): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/intRemito`}>
          <ProtectedRoute authorized={userRoutesContext.includes("contenedor/intRemito")}>
            <IntRemito />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/intDarsenas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("contenedor/intDarsenas")}>
            <IntDarsenas />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/intEnvio`}>
          <ProtectedRoute authorized={userRoutesContext.includes("contenedor/intEnvio")}>
            <IntEnvio />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/pedidos`}>
          <ProtectedRoute authorized={userRoutesContext.includes("contenedor/pedidos")}>
            <Pedidos />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/importarPlanProd`}>
          <ProtectedRoute authorized={userRoutesContext.includes("contenedor/importarPlanProd")}>
            <ImportarPlanProd />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/indicadores`}>
          <ProtectedRoute authorized={userRoutesContext.includes("contenedor/indicadores")}>
            <Indicadores />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/planilla`}>
          <ProtectedRoute authorized={userRoutesContext.includes("contenedor/planilla")}>
            <Planilla />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/pedidosFin`}>
          <ProtectedRoute authorized={userRoutesContext.includes("contenedor/pedidosFin")}>
            <PedidosFin />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/cliUbicaciones`}>
          <ProtectedRoute authorized={userRoutesContext.includes("contenedor/cliUbicaciones")}>
            <CLIUbicaciones />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
