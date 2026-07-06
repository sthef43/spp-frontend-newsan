import { Rutas } from "app/features/trazabilidad/modules/rutas/pages/Rutas";
import { TrazabilidadPuesto } from "app/features/trazabilidad";
import { TrazabilidadFamilia } from "app/features/trazabilidad/modules/familia/pages/TrazabilidadFamilia";
import { TrazabilidadLineaProduccion } from "app/features/trazabilidad/modules/lineaDeProduccion/pages/TrazabilidadLineaProduccion";
import { TrazabilidadModelo } from "app/features/trazabilidad/modules/familia/modals/TrazablidadModelo";
import { TrazabilidadPlanta } from "app/features/trazabilidad/modules/plantas/pages/TrazabilidadPlanta";
import { TrazabilidadProducto } from "app/features/trazabilidad/modules/productos/pages/TrazabilidadProducto";
import { TrazabilidadProductoPuesto } from "app/features/trazabilidad/modules/puestosDeProductos/pages/TrazabilidadProductoPuesto";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { TrazabilidadConfiguracionPuestos } from "app/features/trazabilidad/modules/trazabilidadConfiguracionPuesto/pages/TrazabilidadConfiguracionPuestos";
import { IndicadoresImpresionPage } from "app/features/trazabilidad/modules/indicadoresImpresion/pages/IndicadoresImpresionPage";
import { TipoMaterialPage } from "app/features/trazabilidad/modules/tipoDeMateriales/pages/TipoMaterialPage";
import { ValidarMaterialesPage } from "app/features/trazabilidad/modules/materialesAValidar/pages/ValidarMaterialesPage";
import { BinariosPage } from "app/features/trazabilidad/modules/binariosHeladera/pages/BinariosPage";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { ProtectedRoute } from "app/shared/components/guards/ProtectedRoute";

import { SemielaboradoPage } from "app/features/trazabilidad/modules/agregarSemielaboradImParaDeclarar/pages/SemielaboradoPage";
import { ValidarQrLg } from "app/features/trazabilidad/modules/validarQrLg/pages/ValidarQrLg";
import { Marca } from "app/features/trazabilidad/modules/marca/pages/Marca";
import { ValidacionDeQrLg } from "app/features/trazabilidad/modules/escanearQrLg/pages/ValidacionDeQrLg";
import { Reparadores } from "app/features/trazabilidad/modules/cargarReparadores/pages/Reparadores";
import { RenacerPage } from "app/features/trazabilidad/modules/cargaProduccionRenacer/RenacerPage";

export const TrazabilidadRoute = (props: any): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();

  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <React.Fragment>
      <Switch location={location}>
        <Route path={`${path}/plantas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/plantas")}>
            <TrazabilidadPlanta />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/producto`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/producto")}>
            <TrazabilidadProducto />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/familia`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/familia")}>
            <TrazabilidadFamilia />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/modelo`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/modelo")}>
            <TrazabilidadModelo />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/lineaProduccion`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/lineaProduccion")}>
            <TrazabilidadLineaProduccion />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/rutas`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/rutas")}>
            <Rutas />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/puestos`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/puestos")}>
            <TrazabilidadPuesto />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/productos-puestos`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/productos-puestos")}>
            <TrazabilidadProductoPuesto />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/configuracion-puestos/:lineaId`}>
          <TrazabilidadConfiguracionPuestos />
        </Route>
        <Route path={`${path}/marca`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/marca")}>
            <Marca />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/indicadores-impresion`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/indicadores-impresion")}>
            <IndicadoresImpresionPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/tipo-material`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/tipo-material")}>
            <TipoMaterialPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/validar-materiales`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/validar-materiales")}>
            <ValidarMaterialesPage />
          </ProtectedRoute>
        </Route>

        <Route path={`${path}/binarios-page`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/binarios-page")}>
            <BinariosPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/semielaborado-page`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/semielaborado-page")}>
            <SemielaboradoPage />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/validarQrLg`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/validarQrLg")}>
            <ValidarQrLg />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/reparadores`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/reparadores")}>
            <Reparadores />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/validacionDeQrLg`}>
          <ProtectedRoute authorized={userRoutesContext.includes("trazabilidad/validacionDeQrLg")}>
            <ValidacionDeQrLg />
          </ProtectedRoute>
        </Route>
        <Route path={`${path}/renacer`}>
          <RenacerPage />
        </Route>
        <Route path={`${path}/*`}>
          <Redirect to={"/main"} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
