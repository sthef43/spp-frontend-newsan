import * as React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import { RoutesUserContext } from "app/shared/components/dashboard/DashboardScreen";
import { LazyRoutes, LazyRouteConfig } from "app/shared/helpers/lazyRoutes";

// Configuración de todas las rutas de Calidad
const calidadRoutes: LazyRouteConfig[] = [
  {
    path: "/calidad",
    importFn: () => import("../../features/calidad/modules/cargaNoConforme/Pages/CalidadPage"),
    exportName: "CalidadPage",
    permission: "calidad/calidad"
  },
  {
    path: "/noConformePlacas",
    importFn: () => import("app/features/calidad/modules/noConformePlacas/Pages/NoConformePlacas"),
    exportName: "NoConformePlacas",
    permission: "calidad/noConformePlacas"
  },
  {
    path: "/no-conformes",
    importFn: () => import("app/features/calidad/modules/noConformes/Pages/NoConformesPage"),
    exportName: "NoConformesPage",
    permission: "calidad/no-conformes"
  },
  {
    path: "/puestos",
    importFn: () => import("app/features/calidad/modules/puestoDeTorqueInstrumental/PuestosCrud"),
    exportName: "PuestosCrud",
    permission: "calidad/puestos"
  },
  {
    path: "/limites",
    importFn: () => import("app/features/calidad/modules/limitesDeTorqueInstrumental/LimitesCrud"),
    exportName: "LimitesCrud",
    permission: "calidad/limites"
  },
  {
    path: "/control-torques",
    importFn: () => import("app/features/calidad/modules/limitesDeTorqueInstrumental/Components/ControlDeTorques"),
    exportName: "ControlDeTorques",
    permission: "calidad/control-torques"
  },
  {
    path: "/pautas-aprobadas",
    importFn: () => import("app/features/calidad/modules/pautas/Pages/PautaIngenieriaAprobada"),
    exportName: "PautaIgenieriaAprobada",
    permission: "calidad/pautas-aprobadas"
  },
  {
    path: "/codigos-de-rechazos",
    importFn: () => import("app/features/calidad/modules/cargaCodigosDefectoCausaOrigen/modules/CodigosDeRechazo"),
    exportName: "CodigosDeRechazo",
    permission: "calidad/codigos-de-rechazos"
  },
  {
    path: "/aprobacion-reprocesos",
    importFn: () => import("app/features/calidad/modules/aprobacionReprocesos/Pages/AprobacionReprocesos"),
    exportName: "AprobacionReprocesos",
    permission: "calidad/aprobacion-reprocesos"
  },
  {
    path: "/compresor",
    importFn: () => import("app/features/calidad/modules/compresor/Pages/Compresor"),
    exportName: "Compresor",
    permission: "calidad/compresor"
  },
  {
    path: "/calidadDocument",
    importFn: () => import("app/features/calidad/modules/calidadDocument/Pages/CalidadDocument"),
    exportName: "CalidadDocument",
    permission: "calidad/calidadDocument"
  },
  {
    path: "/reasignacion-numero-serie",
    importFn: () => import("app/features/calidad/modules/renumeracionNumeroSerie/Pages/ReasignacionNumeroSerie"),
    exportName: "ReasignacionNumeroSerie",
    permission: "calidad/reasignacion-numero-serie"
  },
  {
    path: "/reasignacion-nro-serie-traza-manual",
    importFn: () => import("app/features/calidad/modules/trazaManual/ReasignacionNroSeriePage"),
    exportName: "ReasignacionNroSeriePage",
    permission: "calidad/reasignacion-numero-serie"
  },
  {
    path: "/etiquetas-aprobacion",
    importFn: () => import("app/features/calidad/modules/aprobacionEtiquetas/Pages/AprobacionDeEtiquetasPage"),
    exportName: "AprobacionDeEtiquetasPage",
    permission: "calidad/etiquetas-aprobacion"
  },
  {
    path: "/verificacion-equipos",
    importFn: () => import("app/features/calidad/modules/verificarEquipos/Pages/VerificarEquipoPage"),
    exportName: "VerificarEquipoPage",
    permission: "calidad/verificacion-equipos"
  },
  {
    path: "/traza",
    importFn: () => import("app/features/admin/AdministarTrazabilidad/Pages/AdministrarTraza"),
    exportName: "AdministrarTraza",
    permission: "calidad/traza",
    componentProps: { type: "R" }
  },
  {
    path: "/reemplazar-codigo-placa",
    importFn: () => import("app/features/calidad/modules/reemplazarCodigoPlacas/Pages/ReemplazarCodigoPlacasPage"),
    exportName: "ReemplazarCodigoPlacasPage",
    permission: "calidad/reemplazar-codigo-placa"
  },
  {
    path: "/carga-rechazos",
    importFn: () => import("app/features/trazabilidad/modals/CargaRechazosPage"),
    exportName: "CargaRechazosPage",
    permission: "calidad/carga-rechazos"
  },
  {
    path: "/registroMuestrasPlacas",
    importFn: () => import("app/features/calidad/modules/registroMuestrasPlacas/RegistroMuestrasPlacas"),
    exportName: "RegistroMuestrasPlacas",
    permission: "calidad/registroMuestrasPlacas"
  },
  {
    path: "/trazabilidadPlacas",
    importFn: () => import("app/features/calidad/modules/trazabilidadPlacas/AdministrarTrazaPlacas"),
    exportName: "AdministrarTrazaPlacas",
    permission: "calidad/trazabilidadPlacas"
  },
  {
    path: "/desvincularServiceLg",
    importFn: () => import("app/features/calidad/modules/desvincularServiceLg/pages/DesvincularServiceLg"),
    exportName: "DesvincularServiceLg",
    permission: "calidad/desvincularServiceLg"
  },
  {
    path: "/defecto-imagen",
    importFn: () => import("app/features/calidad/modules/defectoImagen/Pages/DefectoImagenPage"),
    exportName: "DefectoImagenPage",
    permission: "calidad/defecto-imagen"
  },
  {
    path: "/reporte-scrap",
    importFn: () => import("app/features/calidad/modules/reporteScrap/pages/ScrapMain"),
    exportName: "ScrapMain",
    permission: "calidad/reporte-scrap"
  },
  {
    path: "/bloqueo-de-placas",
    importFn: () => import("app/features/calidad/modules/bloqueoDePlacas/Pages/BloqueoDePlacas"),
    exportName: "BloqueoDePlacas",
    permission: "calidad/bloqueo-de-placas"
  },
  {
    path: "/carga-imagenes-etiquetas",
    importFn: () => import("app/features/calidad/modules/cargaImagenesEtiquetas/Pages/CargarImagenesEtiquetas"),
    exportName: "CargarImagenesEtiquetas",
    permission: "calidad/carga-imagenes-etiquetas"
  },
  {
    path: "/carga-no-conformes-canios",
    importFn: () => import("app/features/calidad/modules/cargaNoConformeCanios/Pages/CargaNoConformeCanios"),
    exportName: "CargaNoConformeCanios",
    permission: "calidad/carga-no-conformes-canios"
  },
  {
    path: "/alta-automotriz",
    importFn: () => import("app/features/calidad/modules/altaPlacasAutomotriz/Pages/AltaAutomotriz"),
    exportName: "AltaAutomotriz",
    permission: "calidad/alta-automotriz"
  },
  {
    path: "/reporte-calidad",
    importFn: () => import("app/features/calidad/modules/reporteCalidad/ReporteCalidad"),
    exportName: "ReporteCalidad",
    permission: "calidad/reporte-calidad"
  },
  // Rutas públicas (sin permiso)
  {
    path: "/reasignacion-nro-serie-traza-manual/:codNewsan",
    importFn: () => import("app/features/calidad/modules/trazaManual/ReasignacionNroSeriePage"),
    exportName: "ReasignacionNroSeriePage",
    isPublic: true
  },
  {
    path: "/scrap-placas",
    importFn: () => import("app/features/calidad/modules/scrapPlacas/ScrapPlacasPage"),
    isPublic: true
  },
  {
    path: "/inspeccion",
    importFn: () => import("app/features/calidad/modules/inspecciones/pages/Main/InspeccionesPage"),
    isPublic: true
  },
  {
    path: "/detail/:codigo",
    importFn: () => import("app/features/calidad/modules/inspecciones/pages/Main/InspeccionesDetailPage"),
    isPublic: true
  },
  {
    path: "/tareas",
    importFn: () => import("app/features/calidad/modules/inspecciones/pages/Tareas/CalidadInspeccionTareasPage"),
    isPublic: true
  },
  {
    path: "/inspectores",
    importFn: () => import("app/features/calidad/modules/inspecciones/pages/Inspectores/CalidadInspectorPage"),
    isPublic: true
  }
];

export const CalidadRoute = (): JSX.Element => {
  const location = useLocation();
  const { path } = useRouteMatch();
  const userRoutesContext = React.useContext(RoutesUserContext);

  return (
    <Switch location={location}>
      {/* Todas las rutas lazy-loaded */}
      <LazyRoutes basePath={path} routes={calidadRoutes} userRoutesContext={userRoutesContext} />

      {/* Ruta por defecto */}
      <Route path={`${path}/*`}>
        <Redirect to={"/main"} />
      </Route>
    </Switch>
  );
};
