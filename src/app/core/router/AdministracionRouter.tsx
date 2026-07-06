import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { LotesPendientes } from "app/features/gerencia/lotesPendientes/LotesPendientes";
import { PedidoMaterialesPage } from "app/features/gerencia/pedidoMateriales/pages/PedidoMaterialesPage";
import { DashboardMain } from "app/features/gerencia/dashboard/DashboardPage";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

export const AdministracionRoute = (): JSX.Element => {
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
            <Route path={`${path}/pedido-materiales`}>
              <ProtectedRoute authorized={userRoutesContext.includes("gerencia/pedido-materiales")}>
                <PedidoMaterialesPage />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/lotes-pendientes`}>
              <ProtectedRoute authorized={userRoutesContext.includes("gerencia/lotes-pendientes")}>
                <LotesPendientes />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/dashboard`}>
              <ProtectedRoute authorized={userRoutesContext.includes("gerencia/dashboard")}>
                <DashboardMain />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/*`}>
              <Redirect to={"/main"} />
            </Route>
          </Switch>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};
