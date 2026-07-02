import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { LazyRouteConfig, LazyRoutes } from "app/shared/helpers/lazyRoutes";

const adminRoutes: LazyRouteConfig[] = [
  {
    path: "/traza",
    importFn: () => import("app/features/admin/AdministarTrazabilidad/Pages/AdministrarTraza"),
    exportName: "AdministrarTraza",
    permission: "admin/traza"
  },
  {
    path: "/plan-prod",
    importFn: () => import("app/features/admin/AdministrarPlanDeProduccion/Pages/PlanProdPage"),
    exportName: "PlanProdPage",
    permission: "admin/plan-prod"
  },
  {
    path: "/ajuste-linea",
    importFn: () => import("app/features/admin/AjusteDeLinea/Pages/AjusteLineaPage"),
    exportName: "AjusteLineaPage",
    permission: "admin/ajuste-linea"
  },
  {
    path: "/target-linea",
    importFn: () => import("app/features/admin/TargetLinea/Pages/TargetLineaPage"),
    exportName: "TargetLineaPage",
    permission: "admin/target-linea"
  },
  {
    path: "/analisis-producto-terminado",
    importFn: () => import("app/features/admin/AnalisisProductoTerminado/AnalisisProductoTerminado"),
    exportName: "AnalisisProductoTerminado",
    permission: "admin/analisis-producto-terminado"
  },
  {
    path: "/admin-lineas",
    importFn: () => import("app/features/admin/AdministrarLineas/Pages/AdministrarLineasPage"),
    exportName: "AdministrarLineasPage",
    permission: "admin/admin-lineas"
  },
  {
    path: "/rechazos-page",
    importFn: () => import("app/features/admin/RechazosConfiguracion/Pages/RechazoImagenPage"),
    exportName: "RechazoImagenPage",
    permission: "admin/rechazos-page"
  },
  {
    path: "/rechazo-puesto",
    importFn: () => import("app/features/admin/PuestoRechazoPorLinea/Pages/RechazoPuestoPage"),
    exportName: "RechazoPuestoPage",
    permission: "admin/rechazo-puesto"
  },
  {
    path: "/mensajes-andon",
    importFn: () => import("app/features/admin/MensajeAndon/Pages/MensajesAndonPage"),
    exportName: "MensajesAndonPage",
    permission: "admin/mensajes-andon"
  },
  {
    path: "/emailCrud",
    importFn: () => import("app/features/admin/CargaMailPorGrupo/Pages/EmailCrud"),
    exportName: "EmailCrud",
    permission: "admin/emailCrud"
  },
  {
    path: "/prodXOpModelo",
    importFn: () => import("app/features/admin/ProduccionPorOpModelo/Pages/ProdXOpModelo"),
    exportName: "ProdXOpModelo",
    permission: "admin/prodXOpModelo"
  },
  {
    path: "/whatsapp-produccion",
    importFn: () => import("app/features/admin/ConfiguracionEnvioDeWhatsApp/Pages/WhatsappProduccionPage"),
    exportName: "WhatsappProduccionPage",
    permission: "admin/whatsapp-produccion"
  },
  {
    path: "/hojaParametro",
    importFn: () => import("app/features/admin/HojaParametro/Pages/HojaParametro"),
    exportName: "HojaParametro",
    permission: "admin/hojaParametro"
  },
  {
    path: "/control-ebs",
    importFn: () => import("app/features/admin/ActivarDesactivarDeclaracionEBS/Pages/ControlEBSPage"),
    exportName: "ControlEBSPage",
    permission: "admin/control-ebs"
  },
  {
    path: "/lineas-rechazo",
    importFn: () => import("app/features/admin/lineasRechazoHabilitadas/lineasRechazoHabilidadesPage"),
    exportName: "LineasRechazoHabilitadasPage",
    permission: "admin/lineas-rechazo"
  },
  {
    path: "/reporte-calidad",
    importFn: () => import("app/features/calidad/modules/reporteCalidad/ReporteCalidad"),
    exportName: "ReporteCalidad",
    permission: "admin/reporte-calidad"
  }
];

export const AdminRoute = (): JSX.Element => {
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
            <LazyRoutes basePath={path} routes={adminRoutes} userRoutesContext={userRoutesContext} />
            <Route path={`${path}/*`}>
              <Redirect to={"/main"} />
            </Route>
          </Switch>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};
