import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/ProtectedRoute";
import { OQCTargetPage } from "app/features/sgi/targetSgi/pages/OQCTargetPage";
import { SGIReporteOQCpage } from "app/features/sgi/sgiOqc/pages/SGIReporteOQCpage";
import ReporteSGI from "app/features/sgi/reporteSgi/pages/ReporteSGI";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
export const SGIRouter = (): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <>
      <Switch location={location}>
        <Route path={`${path}/reporte-oqc`}>
          <ProtectedRoute authorized={userRoutesContext.includes(`sgi/reporte-oqc`)}>
            <SGIReporteOQCpage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/oqc-target`}>
          <ProtectedRoute authorized={userRoutesContext.includes(`sgi/oqc-target`)}>
            <OQCTargetPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/reporte-sgi`}>
          <ReporteSGI />
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </>
  );
};
