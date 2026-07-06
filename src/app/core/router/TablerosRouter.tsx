/* eslint-disable unused-imports/no-unused-vars */
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { TablerosPage } from "app/features/tableros/modules/andonGeneral/TablerosPage";
import { useAppDispatch } from "app/core/store/store";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { BinarioPage } from "app/features/tableros/modules/tableroControlBinario/pages/BinarioPage";
import { Termoformado } from "app/features/tableros/modules/termoformado/pages/Termoformado";
import { SemielaboradoProduccionxhs } from "app/features/tableros/modules/tableroIM/pages/SemielaboradoProduccionxhs";
import { ProduccionPorHoraPage } from "app/features/tableros/modules/produccionCajaElectrica/ProduccionPorHoraPage";
import { AndonIMPage } from "app/features/tableros/modules/andonIM/pages/AndonIMPage";
import { TableroPuestoPage } from "app/features/tableros/modules/tableroPuestoConObjetivo/pages/TableroPuestoPage";
import { TableroStockPage } from "app/features/tableros/modules/andonProduccionScrap/pages/TableroStockPage";
import TableroIM from "app/features/tableros/modules/tableroGrafico/pages/TableroIM";
import { MonitoreoSemi } from "app/features/tableros/modules/monitoreoSemielaborado/pages/MonitoreoSemi";
import { TestingIDU } from "app/features/tableros/modules/testingIdu/pages/TestingIDU";
import AndonTransferenciaPlacasPage from "app/features/tableros/modules/andonStockPlacasAutomatica/pages/AndonPlacasPage";
import { StockPlacasAutomaticas } from "app/features/tableros/modules/stockPlacasAutomatica/StockPlacasAutomatica";
export const TablerosRouter = (props: any): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();

  const dispatch = useAppDispatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/tableros`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/tableros")}>
            <TablerosPage turno={"M"} />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/tableros-binario`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/tableros")}>
            <BinarioPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/termoformado`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/termoformado")}>
            <Termoformado />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/produccion-phs`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/produccion-phs")}>
            <SemielaboradoProduccionxhs />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/produccion-por-hora`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/produccion-por-hora")}>
            <ProduccionPorHoraPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/andon-im`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/andon-im")}>
            <AndonIMPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/im/tablero`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/im/tablero")}>
            <TableroIM />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/tablero-stock`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/tablero-stock")}>
            <TableroStockPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/puesto`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/puesto")}>
            <TableroPuestoPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/monitoreoSemi`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/monitoreoSemi")}>
            <MonitoreoSemi />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/transferencia-placas-andon`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/transferencia-placas-andon")}>
            <AndonTransferenciaPlacasPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/testingIDU`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/testingIDU")}>
            <TestingIDU />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/stockPlacasAutomaticas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("tableros/stockPlacasAutomaticas")}>
            <StockPlacasAutomaticas />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
