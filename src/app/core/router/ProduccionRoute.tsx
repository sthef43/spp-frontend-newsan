import * as React from "react";
import { ProduccionPage } from "app/features/produccion/modules/gestionProduccion/pages/ProduccionPage";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { ModelosCrudPage } from "app/features/produccion/modules/creacionModelos/pages/ModelosCrudPage";
import { ParadasDeLineaPage } from "app/features/produccion/modules/paradasLinea/pages/ParadasDeLineaPage";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";
import { GraficoProduccionPorHora } from "app/features/produccion/modules/graficoProduccion/pages/GraficoProduccionPorHora";
import { HistorialEquipos } from "app/features/produccion/modules/reporteHistorialEquipo/pages/HistorialEquipos";
import { HorasExtrasPage } from "app/features/produccion/modules/horasExtras/pages/HorasExtrasPage";
import { ControlParadas } from "app/features/produccion/modules/controlParadas/pages/ControlParadas";
import { ActivarSemielaborado } from "app/features/produccion/modules/activarSemielaboradoIAValidacion/ActivarSemielaborado";
import { Minutas } from "app/features/produccion/modules/cargaMinutas/pages/Minutas";
import { TransferirPlacasMain } from "app/features/produccion/modules/puestoTransferencia/Pages/TransferirPlacasMainPage";
import { LayoutProcesosAndUsuarios } from "app/features/produccion/modules/procesosTransferenciaUsuarios/layouts/LayoutProcesosAndUsuarios";
import { PuestoTransferenciaSupervisor } from "app/features/produccion/modules/puestoTransferencia/Pages/PuestoTrasnferenciaSupervisor";

export const ProduccionRoute = (): JSX.Element => {
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
            <Route path={`${path}/prod`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/prod")}>
                <ProduccionPage />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/modelos-crud`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/modelos-crud")}>
                <ModelosCrudPage />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/paradas-de-linea`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/paradas-de-linea")}>
                <ParadasDeLineaPage />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/minutas`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/minutas")}>
                <Minutas />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/activar-semielaborado`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/activar-semielaborado")}>
                <ActivarSemielaborado />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/graficos`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/graficos")}>
                <GraficoProduccionPorHora />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/historial-equipos`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/historial-equipos")}>
                <HistorialEquipos />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/control-paradas`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/control-paradas")}>
                <ControlParadas />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/horas-extras`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/horas-extras")}>
                <HorasExtrasPage />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/transferir-placas`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/transferir-placas")}>
                <TransferirPlacasMain />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/puesto-transferencia`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/puesto-transferencia")}>
                <PuestoTransferenciaSupervisor />
              </ProtectedRoute>
            </Route>
            <Route path={`${path}/procesos-transferencia-usuarios`}>
              <ProtectedRoute authorized={userRoutesContext.includes("produccion/procesos-transferencia-usuarios")}>
                <LayoutProcesosAndUsuarios />
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
