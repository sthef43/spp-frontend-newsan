import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/ProtectedRoute";
import { ControlRfidPage } from "app/features/etiquetas/controlImpresionRfid/ControlRfidPage";
import { ControlEtiquetas } from "app/features/etiquetas/impresionEtiquetas/modules/ControlEtiquetas";
import { CreacionSerieLg } from "app/features/etiquetas/creacionSerieLg/pages/CreacionSerieLg";
import { CrudEtiquetas } from "app/features/etiquetas/configuracionEtiquetasImprimir/pages/CrudEtiquetas";
import { EnergiaEstaticas } from "app/features/etiquetas/impresionEtiquetas/pages/EnergiaEstaticas";
import { Familia } from "app/features/etiquetas/zplFamilia/pages/Familia";
import { Hibridas } from "app/features/etiquetas/impresionEtiquetas/pages/Hibridas";
import { MenuEtiquetas } from "app/features/etiquetas/impresionEtiquetas/pages/MenuEtiquetas";
import { ControlImpresionEtiquetas } from "app/features/etiquetas/controlImpresionEtiquetas/pages/ControlImpresionEtiquetas";
import { PrinterPage } from "app/features/produccion/modules/puestoTransferencia/PrinterPage";
import { IngresarImagenesEtiquetas } from "app/features/etiquetas/cargarImagenesEtiquetas/IngresarImagenesEtiquetas";
import { VerificarNumerosLGPage } from "app/features/etiquetas/verificarNumerosLG/pages/VerificarNumerosLGPage";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
export const EtiquetasRoute = (props: any): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/printer`}>
          <ProtectedRoute authorized={userRoutesContext.includes("etiquetas/printer")}>
            <PrinterPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/menu-etiquetas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("etiquetas/menu-etiquetas")}>
            <MenuEtiquetas />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/control-etiquetas`}>
          <ControlEtiquetas />
        </Route>
        <Route path={`${path}/ingresar-img-etiquetas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("etiquetas/ingresar-img-etiquetas")}>
            <IngresarImagenesEtiquetas />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/etiquetas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("etiquetas/etiquetas")}>
            <ControlImpresionEtiquetas />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/energia-estaticas`}>
          <EnergiaEstaticas />
        </Route>
        <Route path={`${path}/hibridas`}>
          <Hibridas />
        </Route>
        <Route path={`${path}/crud-etiquetas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("etiquetas/crud-etiquetas")}>
            <CrudEtiquetas />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/control-rfid`}>
          <ProtectedRoute authorized={userRoutesContext.includes("etiquetas/control-rfid")}>
            <ControlRfidPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/verificar-lg`}>
          <ProtectedRoute authorized={userRoutesContext.includes("etiquetas/verificar-lg")}>
            <VerificarNumerosLGPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/familia`}>
          <ProtectedRoute authorized={userRoutesContext.includes("etiquetas/familia")}>
            <Familia />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/creacionSerieLg`}>
          <ProtectedRoute authorized={userRoutesContext.includes("etiquetas/creacionSerieLg")}>
            <CreacionSerieLg />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
