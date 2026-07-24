import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { LazyRoutes } from "app/shared/helpers/lazyRoutes";
import { LazyRouteConfig } from "app/shared/helpers/lazyRoutes";
import React from "react";
import { useRouteMatch, useLocation, Switch, Redirect, Route } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

const CqaRoutes: LazyRouteConfig[] = [
  {
    path: "/cqa",
    importFn: () => import("app/features/cqa/modules/pages/CqaPage"),
    exportName: "CqaPage",
    permission: "cqa/cqa"
  }
];

export const CqaRouter = (): JSX.Element => {
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
            <LazyRoutes basePath={path} routes={CqaRoutes} userRoutesContext={userRoutesContext} />
            <Route path={`${path}/*`}>
              <Redirect to={"/main"} />
            </Route>
          </Switch>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};
