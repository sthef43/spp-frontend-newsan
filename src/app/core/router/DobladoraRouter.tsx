import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/ProtectedRoute";
import { VisualizarPlanos } from "app/features/dobladora/modules/visualizar-planos/VisualizarPlanos";
import { Piezas } from "app/features/dobladora/modules/piezas/pages/Piezas";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { Maquinas } from "app/features/dobladora/modules/maquinas/pages/Maquinas";
import { Ubicaciones } from "app/features/dobladora/modules/ubicaciones/pages/Ubicaciones";
import { Jarvis } from "app/features/dobladora/modules/jarvis/Jarvis";
import { MaestroPieza } from "app/features/dobladora/modules/maestroPieza/pages/MaestroPieza";
import { ProduccionDobladora } from "app/features/dobladora/modules/produccion-dobladora/ProduccionDobladora";
import { AprobacionPlanos } from "app/features/dobladora/modules/aprobacion-planos/pages/AprobacionPlanos";
import { VerEstadoPlanoXQRForm } from "app/features/dobladora/modules/borrar-planos/VerEstadoPlanoXQRForm";
import { GestionHerramental } from "app/features/dobladora/modules/gestionHerramental/pages/GestionHerramental";
import { Herramentales } from "app/features/dobladora/modules/herramentales/Herramentales";

export const DobladoraRoute = (): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/aprobacion-planos`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/aprobacion-planos")}>
            <AprobacionPlanos />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/piezas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/piezas")}>
            <Piezas />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/visualizar-planos`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/visualizar-planos")}>
            <VisualizarPlanos />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/borrar-planos`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/borrar-planos")}>
            <VerEstadoPlanoXQRForm />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/herramentales`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/herramentales")}>
            <Herramentales />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/maquinas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/maquinas")}>
            <Maquinas />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/ubicaciones`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/ubicaciones")}>
            <Ubicaciones />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/gestionHerramental`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/gestionHerramental")}>
            <GestionHerramental />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/jarvis`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/jarvis")}>
            <Jarvis />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/maestroPieza`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/maestroPieza")}>
            <MaestroPieza />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/produccionDobladora`}>
          <ProtectedRoute authorized={userRoutesContext.includes("dobladora/produccionDobladora")}>
            <ProduccionDobladora />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
