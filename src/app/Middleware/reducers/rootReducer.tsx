// import { calendarReducer } from './calendarReducer';
// import { uiReducer } from "./uiReducer";

import { AjusteSlice } from "./AjusteSlice";
import { AlterDialogUISlice } from "./AlertDialogUISlice";
import { appUserSlice } from "./AppUserSlice";
import { areaPagedPaginatorSlice } from "./AreaPagedPaginatorSlice";
import { areaSlice } from "./AreaSlice";
import { auditBloqSlice } from "../../features/audit/slices/AuditBloqSlice";
import { AuditComentarioSlice } from "../../features/audit/slices/AuditComentarioSlice";
import { auditCriterioSlice } from "../../features/audit/slices/AuditCriterioSlice";
import { AuditDispositivoSlice } from "../../features/audit/slices/AuditDispositivoSlice";
import { auditMailSlice } from "../../features/audit/slices/AuditMailSlice";
import { auditPagedPaginatorSlice } from "../../features/audit/slices/AuditPagedPaginatorSlice";
import { AuditRegistryResultSlice } from "../../features/audit/slices/AuditRegistryResultSlice";
import { AuditRegistrySlice } from "../../features/audit/slices/AuditRegistrySlice";
import { auditSlice } from "../../features/audit/slices/AuditSlice";
import { AuditTrackingSlice } from "../../features/audit/slices/AuditTrackingSlice";
import { auditTypeSlice } from "../../features/audit/slices/AuditTypeSlice";
import { authenticationSlice } from "../../features/cuenta/slices/AuthenticationSlice";
import { baseEntitySlice } from "./BaseEntitySlice";
import { bateriasCodigoSlice } from "../../features/baterias/middleware/BateriasCodigoSlice";
import { BinariosIdentificadoresSlice } from "./BinariosIdentificadoresSlice";
import { bloqSlice } from "../../features/audit/slices/BloqSlice";
import { calendarSlice } from "./calendarSlice";
import { colorAppSlice } from "./ColorAppSlice";
import { dobCaniosSubSlice } from "./DobCaniosSubSlice";
import { DobMaestroPiezaSlice } from "./DobMaestroPiezaSlice";
import { emailGroupSlice } from "./EmailGroupSlice";
import { engineeringSectorLineGenericSlice } from "./EngineeringSectorLineGenericSlice";
import { engineeringSectorPositionSlice } from "./EngineeringSectorPositionSlice";
import { engineeringSectorSlice } from "./EngineeringSectorSlice";
import { entrySlice } from "./EntrySlice";
import { estacionesBateriaSlice } from "../../features/baterias/slices/EstacionesBateriaSlice copy";
import { estacionesCodigoSlice } from "../../features/baterias/slices/EstacionesCodigoSlice";
import { estadoBateriasSlice } from "./EstadoBateriaSlice";
import { etiquetasIndicadoresCajaSlice } from "./EtiquetasIndicadoresCajaSlice";
import { etiquetasIndicadoresEESlice } from "./EtiquetasIndicadoresEESlice";
import { etiquetasIndicadoresModeloSlice } from "./EtiquetasIndicadoresModeloSlice";
import { exitSlice } from "./ExitSlice";
import { familiaSlice } from "./FamiliaSlice";
import { finalProductSamplesSlice } from "./FinalProductSamplesSlice";
import { finalProductSlice } from "./FinalProductSlice";
import { FirstLoginSlice } from "../../features/cuenta/slices/FirstLoginSlice";
import { GenericoSlice } from "./GenericoSlice";
import { HoraExtraSlice } from "./HoraExtraSlice";
import { HoraSlice } from "./HoraSlice";
import { ImpresionEtiquetaSlice } from "./ImpresionEtiquetaSlice";
import { InformesPISlice } from "../../features/programacionIndustrial/slices/InformesPISlice";
import { InicioHistorySlice } from "./InicioHistorySlice";
import { InicioSlice } from "./InicioSlice";
import { itemBloqSlice } from "./ItemBloqSlice";
import { itemSlice } from "./ItemSlice";
import { LimitesTrazaSlice } from "./LimitesTrazaSlice";
import { lineaProduccionSlice } from "./lineaProducionSlice";
import { LineaSlice } from "./LineaSlice";
import { lineGenericSlice } from "./LineGenericSlice";
import { lineSlice } from "../../features/audit/slices/LineSlice";
import { listaSlice } from "../../features/audit/slices/ListaSlice";
import { listaValoresSlice } from "./ListaValoresSlice";
import { LoadingUISlice } from "./LoadingUISlice";
import { locationSlice } from "./LocationSlice";
import { mapasRutasCamposSlice } from "./MapasRutasCamposSlice";
import { mapasRutasCompararSlice } from "./MapasRutasCompararSlice";
import { mapasRutasSlice } from "./MapasRutasSlice";
import { materialesImagenSlice } from "./MaterialesImagenSlice";
import { factoriesSlice } from "./mes/factoriesSlice";
import { familiesSlice } from "./mes/familiesSlice";
import { productionOrdersSlice } from "./mes/productionOrdersSlice";
import { productLinesSlice } from "./mes/productLinesSlice";
import { productsSlice } from "./mes/productsSlice";
import { modeloSlice } from "./ModeloSlice";
import { ModelosSlice } from "./ModelosSlice";
import { modelSlice } from "./ModelSlice";
import { nivelItemSlice } from "./NivelItemSlice";
import { NotificationSlice } from "./notificationUISlice";
import { operatorSlice } from "./OperatorSlice";
import { PaniolSlice } from "../../features/programacionIndustrial/slices/PaniolPISlice";
import { permisosRoutesSlice } from "../../features/manejoSistema/slices/PermisosRoutesSlice";
import { permisosSlice } from "../../features/manejoSistema/slices/PermisosSlice";
import { PlanProdSlice } from "./PlanProdSlice";
import { plantSlice } from "./PlantSlice";
import { positionSlice } from "./PositionSlice";
import { ProduccionInicioSlice } from "./ProduccionInicioSlice";
import { ProduccionModelosSlice } from "./ProduccionModelosSlice";
import { productoSlice } from "../../features/trazabilidad/slices/ProductoSlice";
import { productSlice } from "./ProductSlice";
import { PuestoSlice } from "../../features/trazabilidad/slices/PuestoSlice";
import { RechazoImagenSlice } from "../../features/admin/slices/RechazoImagenSlice";
import { RechazoPuestoFilasSlice } from "./RechazoPuestoFilas";
import { RechazoPuestoSlice } from "./RechazoPuestoSlice";
import { RechazoSlice } from "./RechazoSlice";
import { RechazosSlice } from "../../features/calidad/slices/RechazosSlice";
import { registrySlice } from "../../features/auditorias/slices/RegistrySlice";
import { resultSlice } from "./ResultSlice";
import { resultsTimesSlice } from "./ResultsTimesSlice";
import { rolSlice } from "../../features/manejoSistema/slices/RolSlice";
import { routesSlice } from "../../features/manejoSistema/slices/RoutesSlice";
import { sectorSlice } from "../../features/programacionIndustrial/slices/SectorSlice";
import { semielaboradoModelosSlice } from "./SemielaboradoModelosSlice";
import { semielaboradoSlice } from "./SemielaboradoSlice";
import { semielaboradoTipoSlice } from "./SemielaboradoTipoSlice";
import { serviceOfEstationSlice } from "./ServiceOfEstationSlice";
import { storeroomSlice } from "./StoreroomSlice";
import { subRolSlice } from "../../features/manejoSistema/slices/SubRolSlice";
import { SuperCargalineaSlice } from "./SuperCargalineaSlice";
import { SupermaestroSlice } from "./SupermaestroSlice";
import { superMercadoEtiquetasSlice } from "./SuperMercadoEtiquetasSlice";
import { TargetsSlice } from "./TargetsSlice";
import { TipoEtiquetaSlice } from "./TipoEtiquetaSlice";
import { tipoMaterialSlice } from "../../features/trazabilidad/slices/TipoMaterialSlice";
import { TitleOfAppSlice } from "./TitleOfAppSlice";
import { todoSlice } from "../../features/audit/slices/TodoSlice";
import { trazaProductoPuestoSlice } from "../../features/trazabilidad/slices/TrazaProductoPuestoSlice";
import { turnoSlice } from "./TurnoSlice";
import { unitMeasurementSlice } from "./UnitMeasurementSlice";
import { validarMaterialSlice } from "./ValidarMaterialSlice";
import { valorSlice } from "./ValorSlice";
import { ZPL_ProductosSlice } from "./ZPL_ProductosSlice";
import { TurnoExtrasSlice } from "./TurnoExtrasSlice";
import { HoraExtraTurnoExtrasSlice } from "./HoraExtraTurnoExtrasSlice";
import { turnoExtrasLineaProduccionSlice } from "./TurnoExtrasLineaProduccionSlice";
import { LineaPuestoSlice } from "./LineaPuestoSlice";
import { ZPL_EtiquetasSlice } from "./ZPL_EtiquetasSlice";
import { ReprocesoLineaSlice } from "./ReprocesoLineaSlice";
import { XXE_WIP_ITF_SERIESlice } from "./XXE_WIP_ITF_SERIESlice";
import { LineaPuestoTableroSlice } from "./LineaPuestoTableroSlice";
import { lineaProduccionFamiliaSlice } from "./LineaProduccionFamiliaSlice";
import { RechazoMainSlice } from "./RechazoMainSlice";
import { routesAyudaSlice } from "../../features/ayuda/middleware/RoutesAyudaSlice";
import { ticketsCategoriaSlice } from "app/features/tickets/reducers/TicketsCategoriaSlice";
import { ticketsEstadoSlice } from "app/features/tickets/reducers/TicketsEstado.service";
import { OptionFormSlice } from "app/features/planProdSpp/reducers/OptionFormReducers";
import { PlanProdSppEmbarqueSlice } from "app/features/planProdSpp/reducers/PlanProdSppEmbarqueSlice";
import { PlanProdSppSlice } from "app/features/planProdSpp/reducers/PlanProdSppSlice";
import { WhatsappMsgOpcionAsignacionSlice } from "../../features/admin/slices/WhatsappMsgOpcionAsignacionSlice";
import { empq_declarationsSliceContext } from "./Empq_declarationsSlice";
import { OptionalStatesSlice } from "app/features/produccion/modules/puestoTransferencia/Reducers/optionSelectSlice";
import { tipoUnidadSlice } from "./TipoUnidadSlice";
import { TrazaOperacionSlice } from "./TrazaOperacionesSlice";

import { TransferenciaUsuariosPermitidosSlice } from "app/features/produccion/modules/procesosTransferenciaUsuarios/slices/TransferenciaUsuariosPermitidosSlice";
import { TransferenciaUsuariosProcesosSlice } from "app/features/produccion/modules/procesosTransferenciaUsuarios/slices/TransferenciaUsuariosProcesosSlice";
import { TransferenciaUsuariosBloqSlice } from "app/features/produccion/modules/procesosTransferenciaUsuarios/slices/TransferenciaUsuariosBloqSlice";
import { StatesFormModalsSlice } from "app/features/planProdSpp/reducers/StatesForModalsSlice";

import { PlanProdSppEstadoEmbarquesSlice } from "app/features/planProdSpp/reducers/PlanProdSppEstadoEmbarquesSlice";

import { TrazaUnit_History2Slice } from "./TrazaUnit_History2Slice";

import { AndonPlacasSlice } from "app/features/tableros/modules/andonStockPlacasAutomatica/reducers/AndonPlacasSlice";
import {
  auditoriasUISlice,
  auditoriaValoresSlice,
  auditoriaListaValoresSlice,
  auditoriaGrupoItemsSlice,
  auditoriaAsignadaSlice,
  auditoriaSlice
} from "app/features/auditorias";
import { CLIContenedorItemsRecepcionBloqSlice } from "app/features/cli/Middlewares/CLIContenedorItemsRecepcionBloqSlice";
import { CLIContenedorItemsSlice } from "app/features/cli/Middlewares/CLIContenedorItemsSlice";
import { cliUbicacionSectoresSlice } from "app/features/cli/Middlewares/CLIUbiacacionSectorSlice";
import { cliSectoresSlice } from "app/features/cli/Middlewares/CliSectoresSlice";
import { oqcBloqueGroupSlice } from "app/features/oqcGeneral/slices/OQCBloqueGroupSlice";
import { oqcBloqueHallazgoSlice } from "app/features/oqcGeneral/slices/OQCBloqueHallazgoSlice";
import { oqcBloqueSlice } from "app/features/oqcGeneral/slices/OQCBloqueSlice";
import { oqcCategoriaSlice } from "app/features/oqcGeneral/slices/OQCCategoriaSlice";
import { oqcDesignadaResultadoImagenSlice } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoImagenSlice";
import { oqcDesignadaResultadoSlice } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { oqcDesignadaSlice } from "app/features/oqcGeneral/slices/OQCDesignadaSlice";
import { oqcHallazgoResultSlice } from "app/features/oqcGeneral/slices/OQCHallazgoResultSlice";
import { oqcHallazgoSlice } from "app/features/oqcGeneral/slices/OQCHallazgoSlice";
import { oqcModeloSlice } from "app/features/oqcGeneral/slices/OQCModeloSlice";
import { oqcNuevoPalletSlice } from "app/features/oqcGeneral/slices/OQCNuevoPalletSlice";
import { oqcPaletPrintSlice } from "app/features/oqcGeneral/slices/OQCPaletPrintSlice";
import { oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";
import { oqcPonderacionSlice } from "app/features/oqcGeneral/slices/OQCPonderacionSlice";
import { oqcReprocesoCelularesSlice } from "app/features/oqcGeneral/slices/OQCReprocesoCelularesSlice";
import { oqcSeguimientoSlice } from "app/features/oqcGeneral/slices/OQCSeguimientoSlice";
import { oqcSlice } from "app/features/oqcGeneral/slices/OQCSlice";
import { oqcTargetSlice } from "app/features/oqcGeneral/slices/OQCTargetSlice";
import { oqcSupervisoresMotorolaSlice } from "app/features/oqcGeneral/slices/OqcSupervisoresMotorola";
import { ticketsItemsProcesosResultadosSlice } from "app/features/tickets/reducers/TicketsItemsProcesosResultadosSlice";
import { auditoriaTiposSlice } from "app/features/auditorias/slices/AuditoriaTiposSlice";
import { CajaElectricaLGSlice } from "app/features/calidad/slices/CajaElectricaLGSlice";
import { CalidadInspeccionTareaSlice } from "app/features/calidad/slices/CalidadInspeccionTareaSlice";
import { CalidadInspectorTareasSlice } from "app/features/calidad/slices/CalidadInspeccionesSlice";
import { CalidadInspectorSlice } from "app/features/calidad/slices/CalidadInspectorSlice";
import { ctrlPlacasHallazgosSlice } from "app/features/calidad/slices/CtrlPlacasHallazgosSlice";
import { CtrlPlacasTipoMuestraSlice } from "app/features/calidad/slices/CtrlPlacasTipoMuestraSlice";
import { DefectoImagenSlice } from "app/features/calidad/slices/DefectoImagenSlice";
import { DefectoSlice } from "app/features/calidad/slices/DefectoSlice";
import { InstpuestoSlice } from "app/features/calidad/slices/InstpuestoSlice";
import { LimitesSlice } from "app/features/calidad/slices/LimitesSlice";
import { MainRegSlice } from "app/features/calidad/slices/MainRegSlice";
import { OrigenesSlice } from "app/features/calidad/slices/OrigenSlice";
import { TrazaManualSlice } from "app/features/calidad/slices/TrazaManualHistorySlice";

// import { authenticationSlice } from "./AuthenticationSlice";

export const rootReducer = {
  //------Color Reducer----
  colorApp: colorAppSlice.reducer,

  //-----APP REDUCERS----
  alertDialogUI: AlterDialogUISlice.reducer,
  titleOfApp: TitleOfAppSlice.reducer,
  appUser: appUserSlice.reducer,
  //-----AREA REDUCERS----
  areaPagedPaginator: areaPagedPaginatorSlice.reducer,
  area: areaSlice.reducer,
  authentification: authenticationSlice.reducer,
  //-----MES REDUCERS-----
  products: productsSlice.reducer,
  families: familiesSlice.reducer,
  factories: factoriesSlice.reducer,
  productionOrders: productionOrdersSlice.reducer,
  productLines: productLinesSlice.reducer,
  //-----AUDIT REDUCERS-----
  audit: auditSlice.reducer,
  auditBloq: auditBloqSlice.reducer,
  auditDispositivo: AuditDispositivoSlice.reducer,
  auditCriterio: auditCriterioSlice.reducer,
  auditMail: auditMailSlice.reducer,
  auditPagedPaginator: auditPagedPaginatorSlice.reducer,
  auditType: auditTypeSlice.reducer,
  auditRegistryResult: AuditRegistryResultSlice.reducer,
  auditRegistry: AuditRegistrySlice.reducer,
  auditTracking: AuditTrackingSlice.reducer,
  auditComentario: AuditComentarioSlice.reducer,

  //AUDITORIAS V2.0 REDUCERS
  auditoriasUI: auditoriasUISlice.reducer,
  auditoriaValores: auditoriaValoresSlice.reducer,
  auditoriaListaValores: auditoriaListaValoresSlice.reducer,
  auditoriaTipo: auditoriaTiposSlice.reducer,
  auditoriaGrupoItems: auditoriaGrupoItemsSlice.reducer,
  auditoria: auditoriaSlice.reducer,
  auditoriaAsignada: auditoriaAsignadaSlice.reducer,

  //-----AUTH REDUCER -----
  firstLogin: FirstLoginSlice.reducer,
  //-----BASE REDUCER-----
  baseEntity: baseEntitySlice.reducer,
  //-----RECHAZOS REDUCER-----
  rechazados: RechazosSlice.reducer,
  //-----PLANPROD REDUCER-----
  planprod: PlanProdSlice.reducer,
  //-----BLOQ REDUCER-----
  bloq: bloqSlice.reducer,

  //-----EMAIL GROUP REDUCER-----
  emailGroup: emailGroupSlice.reducer,

  //-----ENGINEERING REDUCERS------
  engineeringSector: engineeringSectorSlice.reducer,
  engineeringSectorLineGeneric: engineeringSectorLineGenericSlice.reducer,
  engineeringSectorPosition: engineeringSectorPositionSlice.reducer,

  //-----ENTRY/EXIT REDUCERS-----
  entry: entrySlice.reducer,
  exit: exitSlice.reducer,
  //-----Bateria  REDUCERS-----
  estacionesCodigo: estacionesCodigoSlice.reducer,
  estadoBateria: estadoBateriasSlice.reducer,
  estacionesBateria: estacionesBateriaSlice.reducer,
  bateriasCodigo: bateriasCodigoSlice.reducer,
  //-----FINAL PRODUCT REDUCERS-----
  finalProduct: finalProductSlice.reducer,
  produccionModelos: ProduccionModelosSlice.reducer,
  produccionInicio: ProduccionInicioSlice.reducer,
  finalProductSamples: finalProductSamplesSlice.reducer,

  //-----ITEM REDUCERS-----
  item: itemSlice.reducer,
  itemBloq: itemBloqSlice.reducer,
  nivelItem: nivelItemSlice.reducer,
  //-----LINE REDUCERS------
  linea: LineaSlice.reducer,
  line: lineSlice.reducer,
  lineGeneric: lineGenericSlice.reducer,

  //-----LISTA REDUCERS-----
  lista: listaSlice.reducer,
  listaValores: listaValoresSlice.reducer,

  //-----LOCATION REDUCERS-----
  location: locationSlice.reducer,
  //-----MODEL REDUCERS-----
  model: modelSlice.reducer,
  //-----OPERATOR REDUCERS-----
  operator: operatorSlice.reducer,
  //-----PERMISOS REDUCERS-----
  permisos: permisosSlice.reducer,
  //-----PLANT REDUCERS-----
  plant: plantSlice.reducer,
  //-----POSITION REDUCERS-----
  position: positionSlice.reducer,
  //-----PRODUCT REDUCERS-----
  product: productSlice.reducer,
  //-----REGISTRY REDUCERS-----
  registry: registrySlice.reducer,
  //-----RESULT REDUCERS-----
  result: resultSlice.reducer,
  resultsTimes: resultsTimesSlice.reducer,
  //-----ROL REDUCERS-----
  rol: rolSlice.reducer,
  //-----SECTOR REDUCERS-----
  sector: sectorSlice.reducer,
  //-----STOREROOM REDUCERS-----
  storeroom: storeroomSlice.reducer,
  //-----SUBROL REDUCERS-----
  subrol: subRolSlice.reducer,
  //-----TODO REDUCERS-----
  todo: todoSlice.reducer,
  //-----TURNO REDUCERS-----
  turno: turnoSlice.reducer,
  //-----UBICACION REDUCERS-----
  //-----UI REDUCERS-----
  notificationUI: NotificationSlice.reducer,
  loadingUI: LoadingUISlice.reducer,
  //-----UNIT MEASUREMENT REDUCERS-----
  unitMeasurement: unitMeasurementSlice.reducer,
  //-----VALOR REDUCERS-----
  valor: valorSlice.reducer,

  //-----ServiceReducer----
  serviceOfEstation: serviceOfEstationSlice.reducer,
  routes: routesSlice.reducer,
  routesAyuda: routesAyudaSlice.reducer,
  permisosRoutes: permisosRoutesSlice.reducer,
  impresionEtiquetas: ImpresionEtiquetaSlice.reducer,
  tipoEtiquetas: TipoEtiquetaSlice.reducer,

  //-----Supermercado Reducer----
  superMercadoEtiquetas: superMercadoEtiquetasSlice.reducer,
  materialesImagen: materialesImagenSlice.reducer,
  calendar: calendarSlice.reducer,
  supercargaLinea: SuperCargalineaSlice.reducer,

  //-----Trazabilidad reducers
  puesto: PuestoSlice.reducer,
  producto: productoSlice.reducer,
  modelo: modeloSlice.reducer,
  tipoUnidad: tipoUnidadSlice.reducer,
  familia: familiaSlice.reducer,
  lineaProduccion: lineaProduccionSlice.reducer,
  lineaProduccionFamilia: lineaProduccionFamiliaSlice.reducer,
  productoPuesto: trazaProductoPuestoSlice.reducer,
  trazaOperacion: TrazaOperacionSlice.reducer,
  trazaUnitHistory: TrazaUnit_History2Slice.reducer,

  //Control de Placas
  ctrlPlacasTipoMuestra: CtrlPlacasTipoMuestraSlice.reducer,
  ctrlPlacasHallazgo: ctrlPlacasHallazgosSlice.reducer,

  //ZPL
  ZPL_Productos: ZPL_ProductosSlice.reducer,
  ZPL_etiquetasIndicadoresCaja: etiquetasIndicadoresCajaSlice.reducer,
  ZPL_etiquetasIndicadoresEE: etiquetasIndicadoresEESlice.reducer,
  ZPL_etiquetasIndicadoresModelo: etiquetasIndicadoresModeloSlice.reducer,

  // Varios de produccion
  TrazaManual: TrazaManualSlice.reducer,
  CajaElectricaLG: CajaElectricaLGSlice.reducer,
  MainReg: MainRegSlice.reducer,

  // Materiales
  TipoMaterial: tipoMaterialSlice.reducer,
  ValidarMaterial: validarMaterialSlice.reducer,

  // Ajuste
  ajuste: AjusteSlice.reducer,

  // Target
  target: TargetsSlice.reducer,

  //Generico
  generico: GenericoSlice.reducer,
  rechazo: RechazoSlice.reducer,

  //Mapas rutas
  mapasRutasCampos: mapasRutasCamposSlice.reducer,
  mapasRutasComparar: mapasRutasCompararSlice.reducer,
  mapasRutas: mapasRutasSlice.reducer,

  // Informes Programacion industrial
  informesPI: InformesPISlice.reducer,
  hora: HoraSlice.reducer,

  // BinariosIndentificadores
  binariosIdentificadores: BinariosIdentificadoresSlice.reducer,

  // Pañol Programacion Industrial
  paniolPI: PaniolSlice.reducer,
  // Supermaetro
  supermaestro: SupermaestroSlice.reducer,

  // Semielaborado
  semielaborado: semielaboradoSlice.reducer,
  semielaboradoTipo: semielaboradoTipoSlice.reducer,
  semielaboradoModelos: semielaboradoModelosSlice.reducer,

  // Modelos producccion
  modelos: ModelosSlice.reducer,

  // Rechazo
  rechazoImagen: RechazoImagenSlice.reducer,
  rechazoPuesto: RechazoPuestoSlice.reducer,
  rechazoPuestoFilas: RechazoPuestoFilasSlice.reducer,
  inicioHistory: InicioHistorySlice.reducer,
  inicio: InicioSlice.reducer,

  // limites
  limites: LimitesSlice.reducer,
  limitesTraza: LimitesTrazaSlice.reducer,
  instpuesto: InstpuestoSlice.reducer,

  // DobCaniosSub
  dobCaniosSub: dobCaniosSubSlice.reducer,
  dobMaestroPieza: DobMaestroPiezaSlice.reducer,

  // Horas extras
  horaExtra: HoraExtraSlice.reducer,
  horaExtraTurnoExtras: HoraExtraTurnoExtrasSlice.reducer,
  turnoExtras: TurnoExtrasSlice.reducer,
  turnoExtrasLineaProduccion: turnoExtrasLineaProduccionSlice.reducer,

  // Linea puesto
  lineaPuesto: LineaPuestoSlice.reducer,
  lineaPuestoTablero: LineaPuestoTableroSlice.reducer,
  zpl_Etiquetas: ZPL_EtiquetasSlice.reducer,
  reprocesoLinea: ReprocesoLineaSlice.reducer,

  // OQC
  oqc: oqcSlice.reducer,
  oqcCategoria: oqcCategoriaSlice.reducer,
  oqcHallazgo: oqcHallazgoSlice.reducer,
  oqcPonderacion: oqcPonderacionSlice.reducer,
  oqcBloque: oqcBloqueSlice.reducer,
  oqcBloqueGroup: oqcBloqueGroupSlice.reducer,
  oqcBloqueHallazgo: oqcBloqueHallazgoSlice.reducer,
  oqcDesignada: oqcDesignadaSlice.reducer,
  oqcDesignadaResultado: oqcDesignadaResultadoSlice.reducer,
  oqcDesignadaResultadoImagen: oqcDesignadaResultadoImagenSlice.reducer,
  oqcSupervisoresMotorola: oqcSupervisoresMotorolaSlice.reducer,
  oqcHallazgoResult: oqcHallazgoResultSlice.reducer,
  oqcSeguimiento: oqcSeguimientoSlice.reducer,
  oqcModelo: oqcModeloSlice.reducer,
  oqcPalet: oqcPaletSlice.reducer,
  oqcNuevoPalet: oqcNuevoPalletSlice.reducer,
  oqcPaletPrint: oqcPaletPrintSlice.reducer,
  oqcTarget: oqcTargetSlice.reducer,
  oqcReprocesoCelulares: oqcReprocesoCelularesSlice.reducer,
  xxx_wip_itf_series: XXE_WIP_ITF_SERIESlice.reducer,
  defectoImagen: DefectoImagenSlice.reducer,
  defecto: DefectoSlice.reducer,
  origenes: OrigenesSlice.reducer,
  rechazoMain: RechazoMainSlice.reducer,

  //WhatsApp
  whatsAppAsignaciones: WhatsappMsgOpcionAsignacionSlice.reducer,

  //Plan Produccion SPP
  optionForm: OptionFormSlice.reducer,
  planProdSppEmbarques: PlanProdSppEmbarqueSlice.reducer,
  planProdSpp: PlanProdSppSlice.reducer,
  planProdSppEstadoEmbarques: PlanProdSppEstadoEmbarquesSlice.reducer,
  statesFormModals: StatesFormModalsSlice.reducer,

  //EMPQ_Declaration
  empq_declaration: empq_declarationsSliceContext.reducer,

  //CalidadInspeccion

  calidadInspector: CalidadInspectorSlice.reducer,
  calidadInspeccionTarea: CalidadInspeccionTareaSlice.reducer,
  calidadInspectorTareas: CalidadInspectorTareasSlice.reducer,

  //CLI
  cliUbicacionSectores: cliUbicacionSectoresSlice.reducer,
  cliSectores: cliSectoresSlice.reducer,
  cliContenedorItems: CLIContenedorItemsSlice.reducer,
  cliContenedorItemsRecepcionBloq: CLIContenedorItemsRecepcionBloqSlice.reducer,
  optionalStates: OptionalStatesSlice.reducer,
  transferenciaUsuariosPermitidos: TransferenciaUsuariosPermitidosSlice.reducer,
  transferenciaUsuariosProcesos: TransferenciaUsuariosProcesosSlice.reducer,
  transferenciaUsuariosBloq: TransferenciaUsuariosBloqSlice.reducer,

  //Tickets
  ticketsCategoria: ticketsCategoriaSlice.reducer,
  ticketsEstados: ticketsEstadoSlice.reducer,
  ticketsItemsResultados: ticketsItemsProcesosResultadosSlice.reducer,

  //Tableros
  andonPlacas: AndonPlacasSlice.reducer
};
