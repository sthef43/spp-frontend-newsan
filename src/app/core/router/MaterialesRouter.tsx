import { ArmadoMaterialesPage } from "app/features/supermercado/ingresoMaterialEtiqueta/ArmadoMateriales.Page";
import { ImagenesMaterialesPage } from "app/features/supermercado/imagenesMateriales/pages/ImagenesMateriales.page";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { IngresoEgresoMaterialesPage } from "../../features/supermercado/egresoMateriales/pages/IngresoEgresoMateriales.Page";

import { SupermercadoMaterialesPage } from "app/features/supermercado/supermercado/supermercadoMateriales";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { GeneradorEtiquetasPage } from "app/features/supermercado/generaradorEtiquetas/pages/GeneradorEtiquetasPage";
export const MaterialesRoute = (props: any): JSX.Element => {
  const auditoria = "materiales";
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);
  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/ingreso-materiales`}>
          <ProtectedRoute authorized={userRoutesContext.includes("materiales/ingreso-materiales")}>
            <IngresoEgresoMaterialesPage title="Ingreso" />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/egreso-materiales`}>
          <ProtectedRoute authorized={userRoutesContext.includes("materiales/egreso-materiales")}>
            <IngresoEgresoMaterialesPage title="Egreso" />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/armado-de-materiales`}>
          <ProtectedRoute authorized={userRoutesContext.includes("materiales/armado-de-materiales")}>
            <ArmadoMaterialesPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/imagenes-materiales`}>
          <ProtectedRoute authorized={userRoutesContext.includes("materiales/imagenes-materiales")}>
            <ImagenesMaterialesPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/super-mercado-materiales`}>
          <ProtectedRoute authorized={userRoutesContext.includes("materiales/super-mercado-materiales")}>
            <SupermercadoMaterialesPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/generador-etiquetas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("materiales/generador-etiquetas")}>
            <GeneradorEtiquetasPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
