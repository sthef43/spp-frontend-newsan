import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { BateriasCRUDPage } from "app/features/baterias/pages/BateriasCRUDPage";
import { BateriasViewPage } from "app/features/baterias/pages/BateriasViewPage";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
export const BateriasRoute = (props: any): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/view`}>
          <ProtectedRoute authorized={userRoutesContext.includes("baterias/view")}>
            <BateriasViewPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/CRUD`}>
          <ProtectedRoute authorized={userRoutesContext.includes("baterias/CRUD")}>
            <BateriasCRUDPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
