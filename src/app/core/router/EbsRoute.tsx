import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { ConsultaNumerosSerie } from "app/features/ebs/pages/ConsultaNumerosSerie";
import { ConsultaEBSPage } from "app/features/ebs/pages/ConsultaEBSPage";
import { ConsultaPorOPPage } from "app/features/ebs/pages/ConsultaPorOPPage";
import { IngresarNumerosFaltantesEBS } from "app/features/ebs/pages/IngresarNumerosFaltantesEBS";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
export const EBSRoute = (props: any): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/numeros-serie`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ebs/numeros-serie")}>
            <ConsultaNumerosSerie />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/consulta-ebs-bsas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ebs/consulta-ebs-bsas")}>
            <ConsultaEBSPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/consulta-op-ebs`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ebs/consulta-op-ebs")}>
            <ConsultaPorOPPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/faltantes-ebs`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ebs/faltantes-ebs")}>
            <IngresarNumerosFaltantesEBS />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
