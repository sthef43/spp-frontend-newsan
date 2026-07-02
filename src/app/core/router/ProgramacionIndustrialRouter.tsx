import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/ProtectedRoute";
import { InformesPIPage } from "app/features/programacionIndustrial/informesProgramacionIndustrial/pages/InformesPIPage";
import { PaniolPage } from "app/features/programacionIndustrial/controlPañolPI/pages/PaniolPage";
export const ProgramacionIndustrialRouter = (props: any): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
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
            <Route path={`${path}/informespi`}>
              <ProtectedRoute authorized={userRoutesContext.includes("piroute/informespi")}>
                <InformesPIPage />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/PaniolControl`}>
              <ProtectedRoute authorized={userRoutesContext.includes("piroute/paniolcontrol")}>
                <PaniolPage />
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
