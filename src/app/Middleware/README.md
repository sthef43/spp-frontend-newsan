# Middleware/reducers/ — Slices compartidos

Este directorio contiene los slices de Redux que son **compartidos entre múltiples features** (3+ módulos) o **borderline** (2 módulos). Los slices de un solo feature fueron movidos a `src/app/features/<feature>/slices/`.

---

## Slices globales / multi-feature (3+ módulos)

| Slice                           | Features que lo usan                                                                                                                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AppUserSlice**                | admin, audit, calidad, cuenta, dobladora, etiquetas, informes, manejoSistema, produccion, tickets                                                                                                              |
| **AuthenticationSlice**         | auth global                                                                                                                                                                                                    |
| **BloqSlice**                   | audit, auditorias, cli, contenedor, produccion                                                                                                                                                                 |
| **CodigoRechazosSlice**         | calidad, trazabilidad, tableros                                                                                                                                                                                |
| **ColorAppSlice**               | global (theme)                                                                                                                                                                                                 |
| **ControlLoteSlice**            | produccion, calidad, gerencia                                                                                                                                                                                  |
| **EmailGroupSlice**             | admin, auditorias, calidad, oqcGeneral, produccion, trazabilidad                                                                                                                                               |
| **EmailSlice**                  | admin, audit, auditorias, calidad, contenedor, dobladora, etiquetas, gerencia, ingenieria, oqcGeneral, produccion, seguridadEHigiene, soldadura, tickets                                                       |
| **FamiliaSlice**                | admin, calidad, etiquetas, informes, ingenieria, oqcGeneral, planProdSpp, produccion, soldadura, tableros, trazabilidad                                                                                        |
| **GenericoSlice**               | produccion, calidad, admin, ingenieria                                                                                                                                                                         |
| **GenericImageUploadSlice**     | admin, calidad, contenedor, dobladora, soldadura                                                                                                                                                               |
| **genericSlice**                | audit, auditorias, ayuda, baterias, calidad, cli, informes, ingenieria, manejoSistema, oqcGeneral, planProdSpp, produccion, seguridadEHigiene, tableros, tickets                                               |
| **ImpresionEtiquetaSlice**      | calidad, etiquetas, produccion, cli                                                                                                                                                                            |
| **InicioSlice**                 | admin, audit, calidad, ebs, informes, ingenieria, oqcGeneral, produccion, tableros                                                                                                                             |
| **LineaProduccionFamiliaSlice** | informes, trazabilidad, calidad, admin, oqcGeneral, produccion, ingenieria                                                                                                                                     |
| **LineaProduccionRutasSlice**   | trazabilidad, tableros, calidad                                                                                                                                                                                |
| **lineaProducionSlice**         | admin, audit, auditorias, calidad, informes, ingenieria, oqcGeneral, planProdSpp, produccion, programacionIndustrial, sgi, soldadura, tableros, trazabilidad                                                   |
| **LineaPuestoSlice**            | trazabilidad, calidad, tableros                                                                                                                                                                                |
| **LineaSlice**                  | admin, calidad, ebs, etiquetas, gerencia, informes, ingenieria, oqcGeneral, produccion, soldadura, tableros, trazabilidad                                                                                      |
| **LoadingUISlice**              | ~25 features (global UI)                                                                                                                                                                                       |
| **MapasRutasSlice**             | calidad, trazabilidad, tableros                                                                                                                                                                                |
| **ModeloSlice**                 | admin, calidad, etiquetas, informes, ingenieria, oqcGeneral, planProdSpp, produccion, trazabilidad                                                                                                             |
| **ModelosSlice**                | admin, calidad, etiquetas, produccion, trazabilidad                                                                                                                                                            |
| **OperatorSlice**               | audit, auditorias, calidad, cuenta, informes, ingenieria, manejoSistema, oqcGeneral, produccion, programacionIndustrial, tickets                                                                               |
| **PlanProdSlice**               | admin, calidad, ebs, etiquetas, gerencia, informes, ingenieria, oqcGeneral, planProdSpp, produccion, soldadura, tableros, trazabilidad                                                                         |
| **PlantSlice**                  | admin, audit, auditorias, calidad, contenedor, cuenta, ebs, informes, ingenieria, manejoSistema, oqcGeneral, produccion, programacionIndustrial, seguridadEHigiene, soldadura, tableros, tickets, trazabilidad |
| **ProductoSlice**               | admin, calidad, etiquetas, informes, oqcGeneral, trazabilidad                                                                                                                                                  |
| **PuestoSlice**                 | admin, calidad, ingenieria, tableros, trazabilidad                                                                                                                                                             |
| **SuperCargalineaSlice**        | informes, ingenieria, supermercado, calidad                                                                                                                                                                    |
| **TargetsSlice**                | produccion, tableros, admin, informes, ingenieria                                                                                                                                                              |
| **TrazabilidadLgSlice**         | calidad, etiquetas, produccion                                                                                                                                                                                 |
| **TrazaOperacionesSlice**       | tableros, oqcGeneral, informes, produccion, calidad, trazabilidad                                                                                                                                              |
| **TurnoSlice**                  | admin, audit, auditorias, calidad, cuenta, informes, manejoSistema, oqcGeneral, produccion, programacionIndustrial, tableros                                                                                   |
| **TurnoExtrasSlice**            | calidad, produccion, admin                                                                                                                                                                                     |
| **FirstLoginSlice**             | auth global                                                                                                                                                                                                    |
| **TitleOfAppSlice**             | global                                                                                                                                                                                                         |
| **AlertDialogUISlice**          | global (UI)                                                                                                                                                                                                    |
| **notificationUISlice**         | global (UI)                                                                                                                                                                                                    |

---

## Slices borderline (2 módulos)

| Slice                               | Features que lo usan          |
| ----------------------------------- | ----------------------------- |
| **AjusteSlice**                     | admin, tableros               |
| **AreaTrazaSlice**                  | produccion, contenedor        |
| **BinariosIdentificadoresSlice**    | trazabilidad, tableros        |
| **ComunicacionSlice**               | tableros, admin               |
| **ControlLoteMaterialesSlice**      | gerencia, calidad             |
| **CtrlPlacasSlice**                 | calidad, tableros             |
| **DobHDiametroTuboSlice**           | dobladora, contenedor         |
| **DobHEstadoSlice**                 | dobladora, contenedor         |
| **DobHHerramentalSlice**            | dobladora, contenedor         |
| **DobHProveedorSlice**              | dobladora, contenedor         |
| **DobHRadioMedioSlice**             | dobladora, contenedor         |
| **DobHTipoMaquinaSlice**            | dobladora, contenedor         |
| **DobHTipoSlice**                   | dobladora, contenedor         |
| **DobMaestroPiezaSlice**            | dobladora, soldadura, calidad |
| **DotaFamiliaLineaProduccionSlice** | informes, ingenieria          |
| **EtiquetasImagenSlice**            | calidad, etiquetas            |
| **EtiquetasIndicadoresModeloSlice** | trazabilidad, etiquetas       |
| **Hoja0Slice**                      | calidad, ingenieria           |
| **HoraSlice**                       | produccion, ingenieria        |
| **IDU1200ensayosSlice**             | calidad, tableros             |
| **InicioHistorySlice**              | calidad, informes             |
| **LimitesTrazaSlice**               | calidad, informes             |
| **LineaPuestoTableroSlice**         | trazabilidad, tableros        |
| **MapasRutasCamposSlice**           | calidad, trazabilidad         |
| **MarcaSlice**                      | trazabilidad, admin           |
| **MotivoSlice**                     | informes, produccion          |
| **OrganizacionSlice**               | contenedor, admin             |
| **ParadaSlice**                     | informes, produccion          |
| **ParadasDeLineaSlice**             | produccion, informes          |
| **PautaIngenieriaAprobadaSlice**    | calidad, ingenieria           |
| **PedidoCierreLoteSlice**           | gerencia, produccion          |
| **PedidoMaterialesCalidadSlice**    | gerencia, calidad             |
| **PedidoMaterialesProduccionSlice** | gerencia, produccion          |
| **PlanProdMaterialesSlice**         | produccion, gerencia          |
| **ReparadoresSlice**                | trazabilidad, produccion      |
| **ReprocesoLineaSlice**             | calidad, informes             |
| **ResponsableInicioLineaSlice**     | informes, produccion          |
| **SemielaboradoModelosSlice**       | trazabilidad, admin           |
| **SerieLgSlice**                    | calidad, etiquetas            |
| **TipoEtiquetaSlice**               | calidad, etiquetas            |
| **TrazaUnit_History2Slice**         | tableros, calidad             |
| **ValidaSlice**                     | produccion, informes          |
| **ZPL_EtiquetasSlice**              | supermercado, etiquetas       |
| **ZPL_ProductosSlice**              | trazabilidad, etiquetas       |

---

## Cantidad de slices por modulo

Ver `src/app/features/<feature>/slices/` para:

| Feature           | Cantidad de slices |
| ----------------- | ------------------ |
| calidad           | ~29                |
| contenedor        | ~18                |
| dobladora         | ~15                |
| etiquetas         | ~6                 |
| seguridadEHigiene | ~4                 |
| soldadura         | ~2                 |
| informes          | ~9                 |
| trazabilidad      | ~13                |
| admin             | ~7                 |
| ingenieria        | ~4                 |
| produccion        | ~4                 |
| otrasPaginas      | ~2                 |
| audit             | ~1                 |
| sgi               | ~1                 |
| ebs               | ~1                 |
| tableros          | ~1                 |
| supermercado      | ~1                 |

---

## Slices restaurados (son usados fuera de features/)

Estos slices se importan desde `core/` o `shared/`.

| Slice                                | Usado por             |
| ------------------------------------ | --------------------- |
| **RoutesFavoritesOperatorBloqSlice** | core/components/main/ |
| **UbicacionSlice**                   | features (varios)     |
| **CodigosDeRechazosSlice**           | features              |
| **FinalProductSlice**                | features              |
| **FinalProductSamplesSlice**         | features              |
| **HoraExtraTurnoExtrasSlice**        | features              |
| **TurnoExtrasLineaProduccionSlice**  | features              |
| **XXE_WIP_ITF_SERIE_History**        | features              |
| **ZPL_Print**                        | features              |

---

## Código muerto

Los slices sin uso.

| Slice                      |
| -------------------------- |
| CodigosRechazoValoresSlice |
| ExpRegularValoresSlice     |
| FamiliaRutasSlice          |
| IntRechazoSlice            |
| OrdenTrabajoSlice          |
| Stock_UP6Slice             |
| SubLineaScrapSlice         |
| SubTipoSlice               |
| ValidarSemiValorSlice      |
| ValorAuditTypeSlice        |
| ZPL_ImpresoraSlice         |
