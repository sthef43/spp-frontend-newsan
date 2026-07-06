import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { Dotacion } from "app/features/ingenieria/modules/dotacionMantenimiento/pages/Dotacion/Dotacion";
import { LayoutDotacionMantenimiento } from "app/features/ingenieria/modules/dotacionMantenimiento/layout/LayoutDotacionMantenimiento";
import { MaestroPage } from "app/features/ingenieria/modules/maestro/pages/MaestroPage";
import { PautaIngenieria } from "app/features/ingenieria/modules/pautas/pages/PautaIngenieria";
import { ProduccionPorHora } from "app/features/ingenieria/modules/ProduccionPorHora/ProduccionPorHora";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { ComercialPage } from "app/features/ingenieria/modules/comercial/pages/ComercialPage";
import { ConfiguracionHoraJornadaLaboral } from "app/features/ingenieria/modules/configuracionHoraJornadaLaboral/pages/ConfiguracionHoraJornadaLaboral";
import ConvertidorBlocNotasPage from "app/features/ingenieria/modules/convertidorBlocNotas/convertidorBlocNotasPage";
import { DotacionesPage } from "app/features/ingenieria/modules/dotaciones/DotacionesPage";

export const IngenieriaRoute = (): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/pautas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ingenieria/pautas")}>
            <PautaIngenieria />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/produccion-por-hora`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ingenieria/produccion-por-hora")}>
            <ProduccionPorHora />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/configuracion-horas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ingenieria/configuracion-horas")}>
            <ConfiguracionHoraJornadaLaboral />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/maestro-page`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ingenieria/maestro-page")}>
            <MaestroPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/comercial`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ingenieria/comercial")}>
            <ComercialPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/convertidor-bloc-notas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ingenieria/convertidor-bloc-notas")}>
            <ConvertidorBlocNotasPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/dotaciones`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ingenieria/dotaciones")}>
            <DotacionesPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/dotacionMantenimiento`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ingenieria/dotacionMantenimiento")}>
            <Dotacion />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/dotacionMantenimientoItems`}>
          <ProtectedRoute authorized={userRoutesContext.includes("ingenieria/dotacionMantenimientoItems")}>
            <LayoutDotacionMantenimiento />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
