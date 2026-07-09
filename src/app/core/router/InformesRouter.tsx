//import { ReportesPage } from "app/shared/Pages/reportes/ReportesPage";
import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { LazyRouteConfig, LazyRoutes } from "app/shared/helpers/lazyRoutes";

const InformesRoutes: LazyRouteConfig[] = [
  {
    path: "/prod-historica",
    importFn: () => import("app/features/informes/components/ReportesPagePlacas"),
    exportName: "ReportesPagePlacas",
    permission: "informes/prod-historica"
  },
  {
    path: "/prod-por-linea",
    importFn: () => import("app/features/informes/Modules/reporteProduccionPorLinea/pages/ReportePorLinea"),
    exportName: "ReportePorLinea",
    permission: "informes/prod-por-linea"
  },
  {
    path: "/prod-por-modelo",
    importFn: () => import("app/features/informes/Modules/reporteProduccionPorModelo/pages/ReportePorModelo"),
    exportName: "ReportePorModelo",
    permission: "informes/prod-por-modelo"
  },
  {
    path: "/torques-por-linea",
    importFn: () => import("app/features/informes/Modules/reporteTorquesInstrumentales/pages/ReportesDeTorques"),
    exportName: "ReportesDeTorques",
    permission: "informes/torques-por-linea"
  },
  {
    path: "/reparaciones",
    importFn: () => import("app/features/informes/Modules/reporteReparaciones/pages/ReparacionesAdmin"),
    exportName: "ReparacionesAdmin",
    permission: "informes/reparaciones"
  },
  {
    path: "/rechazos",
    importFn: () => import("app/features/informes/Modules/reporteRechazosPareto/pages/RechazosInformes"),
    exportName: "RechazosInformes",
    permission: "informes/rechazos"
  },
  {
    path: "/paradas-lineas",
    importFn: () => import("app/features/informes/Modules/reporteParadasPorLinea/pages/ParadasLineasInforme"),
    exportName: "ParadasLineasInforme",
    permission: "informes/paradas-lineas"
  },
  {
    path: "/reporte-paradas",
    importFn: () => import("app/features/informes/Modules/cargaEficienciaPlanta/pages/ReporteParadas"),
    exportName: "ReporteParadas",
    permission: "informes/reporte-paradas"
  },
  {
    path: "/rechazo-mensual",
    importFn: () => import("app/features/informes/Modules/informeRechazoMensual/pages/RechazoMensual"),
    exportName: "RechazoMensual",
    permission: "informes/rechazo-mensual"
  },
  {
    path: "/inf-reasig-num",
    importFn: () => import("app/features/informes/Modules/informeDeReasignacionDeNumSerie/ReasigNumSeriePage"),
    exportName: "ReasigNumSeriePage",
    permission: "informes/inf-reasig-num"
  },
  {
    path: "/historico",
    importFn: () => import("app/features/informes/Modules/historicoTrazaNuevo/pages/Historico"),
    exportName: "Historico",
    permission: "informes/historico"
  },
  {
    path: "/gestion-canios",
    importFn: () => import("app/features/soldadura/gestionDeCaños/pages/GestionCaniosPage"),
    exportName: "GestionCaniosPage",
    permission: "informes/gestion-canios"
  },
  {
    path: "/reproceso",
    importFn: () => import("app/features/informes/Modules/informeReprocesos/ReporteReprocesoPage"),
    exportName: "ReporteReprocesoPage",
    permission: "informes/reproceso"
  },
  {
    path: "/dotaciones",
    importFn: () => import("app/features/informes/Modules/dotaciones/InformeDotaciones"),
    exportName: "InformeDotaciones",
    permission: "informes/dotaciones"
  },
  {
    path: "/defecto-imagen",
    importFn: () => import("app/features/informes/Modules/informeDeRechazoPorImagenIm/pages/DefectoImagenInformePage"),
    exportName: "DefectoImagenInformePage",
    permission: "informes/defecto-imagen"
  },
  {
    path: "/rechazo-calidad",
    importFn: () => import("app/features/informes/Modules/informeRechazoCalidad/RechazoCalidad"),
    exportName: "RechazoCalidad",
    permission: "informes/rechazo-calidad"
  },
  {
    path: "/listademateriales",
    importFn: () => import("app/features/informes/Modules/listaDeMateriales/pages/ListaDeMateriales"),
    exportName: "ListaDeMateriales",
    permission: "informes/listademateriales"
  },
  {
    path: "/reportesplacas",
    importFn: () => import("app/features/informes/components/ReportesPagePlacas"),
    exportName: "ReportesPagePlacas",
    permission: "informes/prod-historica"
  },
  {
    path: "/rechazomensual",
    importFn: () => import("app/features/informes/Modules/informeRechazoMensual/pages/RechazoMensual"),
    exportName: "RechazoMensual",
    permission: "informes/rechazomensual"
  },
  {
    path: "/rechazo-multiple-mensual",
    importFn: () => import("app/features/informes/Modules/informeRechazoMultipleMensual/InformeRechazoMultiple"),
    exportName: "InformeRechazoMultiple",
    permission: "informes/rechazo-multiple-mensual"
  },
  {
    path: "/informe-renacer",
    importFn: () => import("app/features/informes/Modules/reporteRenacer/pages/InformeRenacer"),
    exportName: "InformeRenacer",
    permission: "informes/informe-renacer"
  },
  {
    path: "/informe-automotriz-traza",
    importFn: () => import("app/features/informes/Modules/reportePlacasAutomotriz/Pages/InformePlacasAutomotriz"),
    exportName: "InformePlacasAutomotriz",
    permission: "informes/informe-automotriz-traza"
  },
  {
    path: "/informe-automotriz-jig",
    importFn: () => import("app/features/informes/Modules/reporteJigAutomotriz/pages/ReporteAutomotriz"),
    exportName: "ReporteAutomotriz",
    permission: "informes/informe-automotriz-jig"
  }
];

export const InformesRoute = (): JSX.Element => {
  const { path } = useRouteMatch();
  const location = useLocation();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <>
      <Switch location={location}>
        <LazyRoutes basePath={path} routes={InformesRoutes} userRoutesContext={userRoutesContext} />

        <Route path={`${path}/*`}>
          <Redirect to={`/main`} />
        </Route>
      </Switch>
      {/* <SwitchTransition>
        <Switch location={location}>
          <Route path={`${path}/prod-historica`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/prod-historica")}>
              <ReportesPagePlacas />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/prod-por-linea`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/prod-por-linea")}>
              <ReportePorLinea />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/prod-por-modelo`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/prod-por-modelo")}>
              <ReportePorModelo />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/torques-por-linea`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/torques-por-linea")}>
              <ReportesDeTorques />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/reparaciones`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/reparaciones")}>
              <ReparacionesAdmin />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/rechazos`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/rechazos")}>
              <RechazosInformes />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/paradas-lineas`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/paradas-lineas")}>
              <ParadasLineasInforme />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/reporte-paradas`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/reporte-paradas")}>
              <ReporteParadas />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/rechazo-mensual`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/rechazo-mensual")}>
              <RechazoMensual />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/inf-reasig-num`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/inf-reasig-num")}>
              <ReasigNumSeriePage />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/historico-traza-nuevo`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/historico-traza-nuevo")}>
              <HistoricoPage />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/gestion-canios`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/gestion-canios")}>
              <GestionCaniosPage informe />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/reproceso`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/reproceso")}>
              <ReporteReprocesoPage />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/dotaciones`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/dotaciones")}>
              <InformeDotaciones />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/rechazoCalidad`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/rechazoCalidad")}>
              <RechazoCalidad />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/defecto-imagen`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/defecto-imagen")}>
              <DefectoImagenInformePage />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/listaDeMateriales`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/listaDeMateriales")}>
              <ListaDeMateriales />
            </ProtectedRoute>
          </Route>
          /<Route path={`${path}/rechazo-multiple-mensual`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/rechazo-multiple-mensual")}>
              <InformeRechazoMultiple />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/informe-renacer`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/informe-renacer")}>
              <InformeRenacer />
            </ProtectedRoute>
          </Route> 
          <Route path={`${path}/informe-placas-automotriz`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/informe-placas-automotriz")}>
              <InformePlacasAutomotriz />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/informe-automotriz-traza`}>
              <ProtectedRoute authorized={userRoutesContext.includes("informes/informe-automotriz-traza")}>
                  <AutomotrizVerificacion />
              </ProtectedRoute>
          </Route>
          <Route path={`${path}/informe-automotriz-jig`}>
              <ProtectedRoute authorized={userRoutesContext.includes("informes/informe-automotriz-jig")}>
                  <ReporteAutomotriz/>
              </ProtectedRoute>
          </Route>
          <Route path={`${path}/informe-paradas-lineas`}>
            <ProtectedRoute authorized={userRoutesContext.includes("informes/informe-paradas-lineas")}>
                <ReporteParadasLinea />
            </ProtectedRoute>
          </Route>
          <Route path={`${path}/*`}>
            <Redirect to={"/main"} />
          </Route>
        </Switch>
      </SwitchTransition> */}
    </>
  );
};
