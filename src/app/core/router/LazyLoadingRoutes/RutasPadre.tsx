import React from "react";
import { AyudaRouter } from "../AyudaRouter";

interface Props {
  routeSelected: string;
}

//------- Rutas padre pasadas a LazyLoading para mejorar el rendimiento en el modo desarrollo -------
// IMPORTANTE: Estos componentes lazy están definidos FUERA del componente RutasPadre
// para evitar que se recreen en cada render (lo cual causaba que se recargara MainView al cambiar el tema)

const MainViewComponent = React.lazy(() =>
  import("../../../shared/components/main/MainView.component").then((m) => ({ default: m.MainViewComponent }))
);

const AccesoDenegado = React.lazy(() =>
  import("../../../shared/components/AccesoDenegado").then((m) => ({ default: m.AccesoDenegado }))
);

const TablerosRouter = React.lazy(() => import("../TablerosRouter").then((m) => ({ default: m.TablerosRouter })));

const AdministracionRoute = React.lazy(() =>
  import("../AdministracionRouter").then((m) => ({ default: m.AdministracionRoute }))
);

const AuditRoute = React.lazy(() => import("../AuditRoute").then((m) => ({ default: m.AuditRoute })));

const AuditoriasRoute = React.lazy(() => import("../AuditoriasRouter").then((m) => ({ default: m.AuditoriasRoute })));

const BateriasRoute = React.lazy(() => import("../BateriasRoute").then((m) => ({ default: m.BateriasRoute })));

const CalidadRoute = React.lazy(() => import("../CalidadRoute").then((m) => ({ default: m.CalidadRoute })));

const DobladoraRoute = React.lazy(() => import("../DobladoraRouter").then((m) => ({ default: m.DobladoraRoute })));

const EtiquetasRoute = React.lazy(() => import("../EtiquetasRoute").then((m) => ({ default: m.EtiquetasRoute })));

const InformesRoute = React.lazy(() => import("../InformesRouter").then((m) => ({ default: m.InformesRoute })));

const IngenieriaRoute = React.lazy(() => import("../IngenieriaRouter").then((m) => ({ default: m.IngenieriaRoute })));

const ManejoSistemaRouter = React.lazy(() =>
  import("../ManejoSistemaRouter").then((m) => ({ default: m.ManejoSistemaRouter }))
);

const MaterialesRoute = React.lazy(() => import("../MaterialesRouter").then((m) => ({ default: m.MaterialesRoute })));

const ProduccionRoute = React.lazy(() => import("../ProduccionRoute").then((m) => ({ default: m.ProduccionRoute })));

const ProgramacionIndustrialRouter = React.lazy(() =>
  import("../ProgramacionIndustrialRouter").then((m) => ({ default: m.ProgramacionIndustrialRouter }))
);

const SeguridadEHigieneRouter = React.lazy(() =>
  import("../SeguridadEHigieneRouter").then((m) => ({ default: m.SeguridadEHigieneRouter }))
);

const TrazabilidadRoute = React.lazy(() =>
  import("../TrazabilidadRoute").then((m) => ({ default: m.TrazabilidadRoute }))
);

const ContenedorRoute = React.lazy(() => import("../ContenedorRouter").then((m) => ({ default: m.ContenedorRoute })));

const EBSRoute = React.lazy(() => import("../EbsRoute").then((m) => ({ default: m.EBSRoute })));

const MESRoute = React.lazy(() => import("../MesRoute").then((m) => ({ default: m.MESRoute })));

const OtrasFuncionesRoute = React.lazy(() =>
  import("../OtrasFuncionesRoute").then((m) => ({ default: m.OtrasFuncionesRoute }))
);

const AdminRoute = React.lazy(() => import("../AdminRoute").then((m) => ({ default: m.AdminRoute })));

const SoldaduraRoute = React.lazy(() => import("../SoldaduraRoute").then((m) => ({ default: m.SoldaduraRoute })));

const CuentaRoute = React.lazy(() => import("../CuentaRoute").then((m) => ({ default: m.CuentaRoute })));

const OQCRouter = React.lazy(() => import("../OQCRouter").then((m) => ({ default: m.OQCRouter })));

const SGIRouter = React.lazy(() => import("../SGIRouter").then((m) => ({ default: m.SGIRouter })));

const OqcCelularesRouter = React.lazy(() =>
  import("../OqcCelularesRouter").then((m) => ({ default: m.OqcCelularesRouter }))
);

const CliRouter = React.lazy(() => import("../CliRouter").then((m) => ({ default: m.CliRouter })));

const InformacionRouter = React.lazy(() => import("../AyudaRouter").then((m) => ({ default: m.AyudaRouter })));

const TicketsRouter = React.lazy(() => import("../TicketsRouter").then((m) => ({ default: m.TicketsRouter })));

const PlanProdSppRouter = React.lazy(() =>
  import("../PlanProdSppRouter").then((m) => ({ default: m.PlanProdSppRouter }))
);

const CamionesRouter = React.lazy(() => import("../CamionesRoutes").then((m) => ({ default: m.CamionesRouter })));

//------- Rutas padre pasadas a LazyLoading para mejorar el rendimiento en el modo desarrollo -------

export const RutasPadre = ({ routeSelected }: Props) => {
  //------- Estos serian los swtich para poder usar segun la ruta que usamos el lazy loading ----------
  //------- Cuando se tenga que añadir una ruta padre se debe agregar aqui con el mismo nombre que lo declaramos en "DashboardScreen" --------------------------
  const selectRoute = (routeFather: string) => {
    switch (routeFather) {
      case "main":
        return <MainViewComponent />;
      default:
        return <MainViewComponent />;
      case "trazabilidad":
        return <TrazabilidadRoute />;
      case "auditorias-v2":
        return <AuditoriasRoute />;
      case "ayuda":
        return <AyudaRouter />;
      case "contenedor":
        return <ContenedorRoute />;
      case "ebs":
        return <EBSRoute />;
      case "mes":
        return <MESRoute />;
      case "otras-funciones":
        return <OtrasFuncionesRoute />;
      case "admin":
        return <AdminRoute />;
      case "soldadura":
        return <SoldaduraRoute />;
      case "cuenta":
        return <CuentaRoute />;
      case "oqc":
        return <OQCRouter />;
      case "sgi":
        return <SGIRouter />;
      case "oqc-celulares":
        return <OqcCelularesRouter />;
      case "cli":
        return <CliRouter />;
      case "informacion":
        return <InformacionRouter />;
      case "tickets":
        return <TicketsRouter />;
      case "plan-produccion-spp":
        return <PlanProdSppRouter />;
      case "tableros":
        return <TablerosRouter />;
      case "administracion":
        return <AdministracionRoute />;
      case "auditoria":
        return <AuditRoute />;
      case "baterias":
        return <BateriasRoute />;
      case "calidad":
        return <CalidadRoute />;
      case "dobladora":
        return <DobladoraRoute />;
      case "etiquetas":
        return <EtiquetasRoute />;
      case "informes":
        return <InformesRoute />;
      case "ingenieria":
        return <IngenieriaRoute />;
      case "manejo-sistema":
        return <ManejoSistemaRouter />;
      case "materiales":
        return <MaterialesRoute />;
      case "produccion":
        return <ProduccionRoute />;
      case "piroute":
        return <ProgramacionIndustrialRouter />;
      case "seguridad-e-higiene":
        return <SeguridadEHigieneRouter />;
      case "acceso-denegado":
        return <AccesoDenegado />;
      case "camiones":
        return <CamionesRouter />;
    }
  };

  return <>{selectRoute(routeSelected)}</>;
};
