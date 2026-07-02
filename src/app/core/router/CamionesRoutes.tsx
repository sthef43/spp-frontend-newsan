import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { LazyRouteConfig, LazyRoutes } from "app/shared/helpers/lazyRoutes";
import React from "react";
import { useRouteMatch, useLocation, Switch, Route, Redirect } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const CamionesRoutes: LazyRouteConfig[] = [
  {
    path: "/panel-gestion-logistica",
    importFn: () => import("app/features/camiones/Pages/PanelAdministrador/PanelGestionLogistica"),
    exportName: "PanelGestionLogistica",
    permission: "camiones/panel-gestion-logistica"
  }
];

export const CamionesRouter = () => {
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
            <LazyRoutes basePath={path} routes={CamionesRoutes} userRoutesContext={userRoutesContext} />
            <Route path={`${path}/*`}>
              <Redirect to={"/main"} />
            </Route>
          </Switch>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};
