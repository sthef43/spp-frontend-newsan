import React from "react";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { useContext } from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { ProtectedRoute } from "app/shared/components/ProtectedRoute";
import { PlanProdSppMain } from "app/features/planProdSpp/pages/PlanProdSppMain";

export const PlanProdSppRouter = () => {
  const { path } = useRouteMatch();
  const location = useLocation();
  const userRoutesContext = useContext(RoutesUserContext);

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
            <Route path={`${path}/plan-de-produccion`}>
              <ProtectedRoute authorized={userRoutesContext.includes("plan-produccion-spp/plan-de-produccion")}>
                <PlanProdSppMain />
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
