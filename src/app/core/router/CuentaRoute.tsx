import { ResetPasswordPage } from "app/features/cuenta/ResetPasswordPage";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";

export const CuentaRoute = (): JSX.Element => {
  const userRoutesContext = React.useContext(RoutesUserContext);
  const location = useLocation();
  const { path } = useRouteMatch();
  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/password-settings`}>
          <ProtectedRoute authorized={userRoutesContext.includes("cuenta/password-settings")}>
            <ResetPasswordPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
