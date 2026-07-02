/* eslint-disable unused-imports/no-unused-vars */
import React, { FC, useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import {
  KeyboardDoubleArrowRight,
  Add,
  Remove,
  Edit,
  NextPlanRounded,
  CancelRounded,
  EditRounded
} from "@mui/icons-material";
import {
  TableCell,
  tableCellClasses,
  TableRow,
  TableContainer,
  Paper,
  Table,
  TableHead,
  IconButton,
  TableBody,
  TableFooter,
  TablePagination,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Button,
  Box,
  styled
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IPlanProdSpp } from "../../models/IPlanProdSpp";
import { OptionFormSlice } from "../../reducers/OptionFormReducers";
import { PlanProdSppEmbarqueSliceRequest, PlanProdSppEmbarqueSlice } from "../../reducers/PlanProdSppEmbarqueSlice";
import { PlanProdSppSliceRequest, PlanProdSppSlice } from "../../reducers/PlanProdSppSlice";
import { IObjectFormPlan } from "../../models/IObjectFormPlan";
import { StatesFormModalsSlice } from "../../reducers/StatesForModalsSlice";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AgregarEditarPlanProdModal } from "../../modals/AgregarEditarPlanProdModal";
import { IGeneratePlanProd } from "../../models/DTOS/IGeneratePlanProd";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { EmbarquesPlanProdIdDTO } from "../../models/DTOS/EmbarquesPlanProdIdDTO";
import { PlanProdSppEmbarqueBloqueSliceRequest } from "../../reducers/PlanProdSppEmbarqueBloqueSlice";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { PopperComponent } from "app/shared/helpers/ComponentsMUIModify/PopperComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { AgregarObservacionEmbarqueModal } from "../../modals/AgregarObservacionEmbarqueModal";
import { NumeroEmbarqueDTO } from "../../models/DTOS/NumeroEmbarqueDTO";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "var(--background-color-tableHeader-planProdSpp)",
    color: "var(--text-color)",
    padding: 6,
    minWidth: 120
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 10
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const cellSx = {
  minWidth: 100,
  textAlign: "center",
  p: 1,
  verticalAlign: "middle",
  backgroundColor: "var(--background-color)",
  border: "none"
};

const cellSxMes = {
  minWidth: 100,
  textAlign: "center",
  p: 1,
  verticalAlign: "middle",
  backgroundColor: "var(--background-color-tableHeader-planProdSpp)",
  fontSize: "2rem",
  fontWeight: 600,
  border: "none"
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "var(--background-color-tableHeader-planProdSpp)",
    color: "var(--text-color)",
    fontSize: 14,
    border: "none"
  }
}));

interface ListaEmbarques {
  nombreEmbarque: string;
  numerosEmbarques: NumeroEmbarqueDTO[];
}

interface Props {
  refreshListPlanProd: () => void;
}

type GrupoEmbarques = Record<string, NumeroEmbarqueDTO[]>;

export const TableActualComponent: FC<Props> = ({ refreshListPlanProd }) => {
  const planesProduccion = useAppSelector((state) => state.planProdSpp.dataAll as any[]);
  const planesProduccionExcel = useAppSelector((state) => state.planProdSpp.planProdNew as IPlanProdSpp[]);
  const { cargaDTO } = useAppSelector((state) => state.planProdSppEmbarques);

  const { mesSeleccionado, mesFinSeleccionado, listaMesAndPosicionMasAlta, dataFormatExcelEmbarque } = useAppSelector(
    (state) => state.statesFormModals
  );
  const lineaProduccion = useAppSelector((state) => state.lineaProduccion);
  const { dataFormatExcel } = useAppSelector((state) => state.statesFormModals);
  const { estadoEdicion } = useAppSelector((state) => state.optionForm);
  const { mostrarContenedores, mostrarInformacionModelo, openModalEditar } = useAppSelector(
    (state) => state.statesFormModals
  );

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();

  const { openNotificationUI } = useNotificationUI();
  const { FetchPut } = useFetchApiMultiResults();
  const { getConfirmation } = useConfirmationDialog();

  const [embarqueSeleccionado, setEmbarqueSeleccionado] = useState<NumeroEmbarqueDTO | null>(null);

  const [openModalAgregar, setOpenModalAgregar] = useState<boolean>(false);
  const [openModalAgregarObservacion, setOpenModalAgregarObservacion] = useState<boolean>(false);

  //STATES PARA MOSTRAR LAS ROWS DE LA TABLA
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenModalEdit = async (planProd: IPlanProdSpp, event) => {
    event.stopPropagation();
    const nuevoPlan = nuevoFormPlan();
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(PlanProdSppSliceRequest.GetPlanByShipmentIncludes(planProd.id)));
      if (response) {
        const responseEmbarques = unwrapResult(
          await dispatch(PlanProdSppEmbarqueSliceRequest.GetAllShipmentsByPlanProdId(planProd.id))
        );
        dispatch(PlanProdSppEmbarqueSlice.actions.setDataEmbarquesList(responseEmbarques));
        dispatch(OptionFormSlice.actions.setNewPlanAll(nuevoPlan));
        dispatch(PlanProdSppSlice.actions.setPlanProd(response));
        dispatch(OptionFormSlice.actions.setModeEdition(true));
        dispatch(StatesFormModalsSlice.actions.setMostrarContenedores(false));
        dispatch(StatesFormModalsSlice.actions.setShowMostrarInformacionModelo(false));
        setOpenModalAgregar(true);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Ocurrio un error queriendo editar el plan de produccion: ${error}`, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const buscarEmbarques = async () => {
    const idPlanes = planesProduccion.map((elementos) => {
      return elementos.id;
    });
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(PlanProdSppEmbarqueSliceRequest.GetAllShipmentByMultisIds(idPlanes))
      );
      if (response && response.length == 0) {
        openNotificationUI("No se encontraron datos de embarques", "info");
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getPlanGenerate = async () => {
    const nuevaConsulta: IGeneratePlanProd = {
      IDataExcelFormat: dataFormatExcel,
      lineaProduccionId: lineaProduccion.object.id
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (lineaProduccion.object.nombre.toLowerCase().includes("window")) {
        const listaFormateada = dataFormatExcel.filter((elementos) =>
          elementos.comentarios.toLowerCase().includes("window")
        );
        nuevaConsulta.IDataExcelFormat = listaFormateada;
      } else {
        const listaFormateada = dataFormatExcel.filter(
          (elementos) => !elementos.comentarios.toLowerCase().includes("window")
        );
        nuevaConsulta.IDataExcelFormat = listaFormateada;
      }
      const response = unwrapResult(await dispatch(PlanProdSppSliceRequest.GenerateNewPlanProd(nuevaConsulta)));
      const planActualizado: any[] = [...planesProduccion];
      if (response) {
        const nuevaLista = limpiarYsincronizar(planActualizado, response);
        if (nuevaLista && nuevaLista.length > 0) {
          dispatch(StatesFormModalsSlice.actions.setNuevosResgistrosPlanProd(true));
        } else {
          dispatch(StatesFormModalsSlice.actions.setNuevosResgistrosPlanProd(false));
        }
        dispatch(PlanProdSppSlice.actions.setPlanProdActualizado(nuevaLista));
        dispatch(PlanProdSppSlice.actions.setNewPlanProd(response));
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error intentando generar el nuevo plan de produccion", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getEmbarqueGenerate = async () => {
    const planesId = planesProduccion.map((elementos) => elementos.id);
    const embarquesId = cargaDTO.flatMap((elementos) => elementos.embarques).map((elementos) => elementos.id);
    const dataFormatExcelEmbarqueClon: any = [...dataFormatExcelEmbarque];
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const objetoEmbarques: EmbarquesPlanProdIdDTO = { embarquesId: embarquesId, planProdSppId: planesId };
      const response = unwrapResult(
        await dispatch(PlanProdSppEmbarqueBloqueSliceRequest.GenerateShipments(objetoEmbarques))
      );
      if (response) {
        const nuevaLista = limipiarYsincronizarEmbarques(dataFormatExcelEmbarqueClon, response);
        console.log(nuevaLista);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error intentando generar los embarques", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const cambiarPlanEnProduccion = async (e, planProd: any) => {
    e.stopPropagation();
    const clonPlanProd = { ...planProd, produciendo: true };
    delete clonPlanProd.modelo;
    FetchPut({
      consoleLog: false,
      sliceRequest: PlanProdSppSliceRequest.ChangePlanInProducing,
      modelPut: clonPlanProd,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "Cambiar Plan en Produccion",
      messageUser: "El plan seleccionado pasara a ser el nuevo plan en produccion, desea continuar?",
      functionAdd: async () => {
        openNotificationUI("Se cambio el plan seleccionado a produccion con exito!", "success");
        refreshListPlanProd();
      }
    });
  };

  const cancelarPlanEnProduccion = async (e, planProd: any) => {
    e.stopPropagation();
    const clonPlanProd = { ...planProd, produciendo: false };
    delete clonPlanProd.modelo;
    FetchPut({
      consoleLog: false,
      sliceRequest: PlanProdSppSliceRequest.CancelPlanInProducing,
      modelPut: clonPlanProd,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "Cancelar Plan en Produccion",
      messageUser: "Se cancelara el plan seleccionado de produccion, desea continuar?",
      functionAdd: async () => {
        openNotificationUI("Se cancelo el plan seleccionado en produccion con exito!", "success");
        refreshListPlanProd();
      }
    });
  };

  const deletePlanProduccion = async (idPlan: number, event) => {
    event.stopPropagation();
    try {
      if (
        await getConfirmation("Eliminar Plan", "Se eliminara el plan seleccionado, ¿Desea continuar?", null, "Eliminar")
      ) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(PlanProdSppSliceRequest.deleteRequest(idPlan)));
        if (response) {
          openNotificationUI("Se elimino con exito el plan", "success");
          await dispatch(
            PlanProdSppSliceRequest.GetAllPlanByMonthAndLineProduccionId({
              lineaProduccionId: lineaProduccion,
              mesInicio: mesSeleccionado,
              mesFin: mesFinSeleccionado
            })
          );
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error intentando eliminar el plan", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const nuevoFormPlan = () => {
    try {
      const nuevoPlan: IObjectFormPlan[] = [
        {
          idForm: 1,
          estadoForm: 1,
          aprobeForm: false
        },
        {
          idForm: 2,
          estadoForm: 0,
          aprobeForm: false
        },
        {
          idForm: 3,
          estadoForm: 0,
          aprobeForm: false
        }
      ];

      if (nuevoPlan.length > 0) {
        return nuevoPlan;
      }
    } catch (error) {
      openNotificationUI(`Ocurrio un error: ${error}`, "error");
    }
  };

  const limpiarYsincronizar = (planActualDB: any[], datosNuevosUsuario: any[]) => {
    let cambiosEncontrado: boolean;
    const actualDbId = datosNuevosUsuario.map((elementos) => {
      const existe = planActualDB.find(
        (usuario) =>
          elementos.observaciones === usuario.observaciones &&
          elementos.po == usuario.po &&
          elementos.ritmo == usuario.ritmo &&
          elementos.cantidad === usuario.cantidad &&
          elementos.modeloId === usuario.modeloId &&
          elementos.mes === usuario.mes &&
          elementos.anio === usuario.anio
      );
      return {
        ...elementos,
        id: existe ? existe.id : 0
      };
    });

    const listaActualizada = actualDbId.map((elementos, index) => {
      const existe = planActualDB.find((usuario) => elementos.id === usuario.id);
      if (existe) {
        planActualDB[existe] = { ...existe, añadido: true };
        cambiosEncontrado = false;
        dispatch(StatesFormModalsSlice.actions.setNuevosResgistrosPlanProd(false));
      } else {
        planActualDB[elementos] = { ...elementos, añadido: false };
        dispatch(StatesFormModalsSlice.actions.setNuevosResgistrosPlanProd(true));
      }
      return {
        ...planActualDB[elementos]
      };
    });
    if (!cambiosEncontrado) {
      openNotificationUI("No se encontraro cambios en el DXD", "info");
    }
    return listaActualizada;
  };

  const limipiarYsincronizarEmbarques = (embarquesActuales: any[], datosNuevosExcel: any[]) => {
    let cambiosEncontrado: boolean;
    const embarquesEnDB = embarquesActuales.map((elementos) => {
      const embarqueExistente = datosNuevosExcel.find(
        (embarques) =>
          embarques.bajada === elementos.bajada &&
          embarques.nombreEmbarque === elementos.nombreEmbarque &&
          embarques.numeroEmbarque &&
          elementos.numeroEmbarque &&
          embarques.po === elementos.po
      );
      return {
        ...elementos,
        id: embarqueExistente ? embarqueExistente.id : 0
      };
    });

    const listaEmbarquesNueva = embarquesEnDB
      .filter((embarques) => embarques.id !== 0)
      .map((elementos, index) => {
        const existe = datosNuevosExcel.find((embarques) => elementos.id == embarques.id);
        if (existe) {
          embarquesActuales[existe] = { ...existe, añadido: true };
          cambiosEncontrado = false;
        } else {
          embarquesActuales[elementos] = { ...elementos, añadido: false };
        }
        return {
          ...embarquesActuales[elementos]
        };
      });
    if (!cambiosEncontrado) {
      openNotificationUI("No se encontraro cambios en el excel de embarques", "info");
    }
    return listaEmbarquesNueva;
  };

  const cambiarPositionPlanes = (idPlan: number) => {
    const arraySeleccionados: number[] = [];
    const listaMeses: string[] = [];
    const modificarEstadoPlan = planesProduccion.map((elementos) => {
      const elementoSeleccionado = elementos.seleccionado ? elementos.seleccionado : false;
      if (idPlan === elementos.id) {
        const clonPlan = {
          ...elementos,
          seleccionado: !elementoSeleccionado
        };
        return clonPlan;
      }
      return elementos;
    });
    modificarEstadoPlan.map((elementos) => {
      if (elementos.seleccionado === true) {
        arraySeleccionados.push(elementos.position);
        listaMeses.push(elementos.mes);
      }
    });
    const mesesSinDuplicados = [...new Set(listaMeses)];
    dispatch(StatesFormModalsSlice.actions.setListaMeses(mesesSinDuplicados));
    dispatch(StatesFormModalsSlice.actions.setListaPosicionesOriginal(arraySeleccionados));
    dispatch(StatesFormModalsSlice.actions.setListaPosiciones(arraySeleccionados));
    dispatch(PlanProdSppSlice.actions.setPlanProdActualizado(modificarEstadoPlan));
  };

  const generarEstado = (rowEstado: string) => {
    switch (rowEstado) {
      case "Liberado":
        return <span className="bg-[#4FB251] px-4 py-0.5 rounded-sm"></span>;
      case "En Aduana":
        return <span className="bg-orange-500 px-4 py-0.5 rounded-sm"></span>;
      case "Sin Liberar":
        return <span className="bg-red-500 px-4 py-0.5 rounded-sm"></span>;
    }
  };

  const generarCategoria = (elementoTabla: IPlanProdSpp) => {
    if (elementoTabla.observaciones.toLowerCase().includes("inverter")) {
      return `ON/OFF INVERTER`;
    }
    if (elementoTabla.observaciones.toLowerCase().includes("split")) {
      return `ON/OFF SPLIT`;
    }
    if (
      !elementoTabla.observaciones.toLowerCase().includes("split") ||
      !elementoTabla.observaciones.toLowerCase().includes("inverter")
    ) {
      return `ON/OFF`;
    }
  };

  //FUNCIONES PARA LAS OP
  //Se cambia el color segun el estado de la op
  const colorEstadoOp = (op: string) => {
    let estilosOp = "";
    const tipoOp = op.includes("MD") ? "MD" : op.includes("L") ? "L" : op.includes("R") ? "R" : "";
    switch (tipoOp) {
      case "MD":
        estilosOp = "text-red-600 font-semibold cursor-pointer";
        break;
      case "L":
        estilosOp = "text-green-600 font-semibold cursor-pointer";
        break;
      case "R":
        estilosOp = "text-yellow-600 font-semibold cursor-pointer";
        break;
      default:
        estilosOp = "text-textColor font-semibold cursor-pointer";
    }
    return estilosOp;
  };

  //Segun el estado de la op se muestra un mensaje distinto en la op
  const ayudaEstadoOp = (op: string) => {
    const tipoOp = op.includes("MD") ? "MD" : op.includes("L") ? "L" : op.includes("R") ? "R" : "";
    let estadoOp = "";
    switch (tipoOp) {
      case "MD":
        estadoOp = "Sin Liberacion";
        break;
      case "L":
        estadoOp = "Liberada";
        break;
      case "R":
        estadoOp = "Retenida";
        break;
      default:
        estadoOp = "Sin Informacion";
    }
    return (
      <Tooltip title={estadoOp}>
        <span>{op}</span>
      </Tooltip>
    );
  };
  //FUNCIONES PARA LAS OP

  const agruparEmbarques = (): GrupoEmbarques => {
    const listaEmbarques = cargaDTO.flatMap((e) => e.embarques);
    const embarquesAgrupados = listaEmbarques.reduce((acc, embarque) => {
      const nombre = embarque.nombreEmbarque;
      const datosEmbarque = {
        estadoEmbarque: embarque.estadoEmbarque,
        planProdId: embarque.planProdSppId,
        bajada: embarque.bajada,
        nombreEmbarque: embarque.nombreEmbarque,
        po: embarque.po,
        id: embarque.id,
        observacion: embarque.observacion,
        numeroEmbarque: embarque.numeroEmbarque,
        estadoEmbarqueId: embarque.estadoEmbarqueId
      };
      if (!acc[nombre]) {
        acc[nombre] = [];
      }
      acc[nombre].push(datosEmbarque);
      return acc;
    }, {});
    return embarquesAgrupados;
  };

  const formatEmbarques = () => {
    const listaArray: ListaEmbarques[] = [];
    const embarquesAgrupados = agruparEmbarques();
    for (const [key, value] of Object.entries(embarquesAgrupados)) {
      const aux = {
        nombreEmbarque: key,
        numerosEmbarques: value
      };
      listaArray.push(aux);
    }
    return listaArray;
  };

  const filtrarKbtuPorFamilia = (familia: string) => {
    if (!familia) {
      return "";
    }
    const pkbu = familia.match(/\d+/g).join("");
    return pkbu;
  };

  const generarFondoEmbarques = (estadoEmbarqueId: number) => {
    let coloresFondo = "";
    switch (estadoEmbarqueId) {
      case 1:
        coloresFondo = "text-green-500";
        break;
      case 3:
        coloresFondo = "text-red-500";
        break;
      case 6:
        coloresFondo = "text-yellow-500";
        break;
      case 7:
        coloresFondo = "text-orange-500";
        break;
      case 8:
        coloresFondo = "text-red-500";
        break;
      case 11:
        coloresFondo = "text-red-500";
        break;
      default:
        coloresFondo = "text-gray-500";
        break;
    }
    return coloresFondo;
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - planesProduccion.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (dataFormatExcel && dataFormatExcel.length > 0) {
      getPlanGenerate();
    }
  }, [dataFormatExcel]);

  useEffect(() => {
    if (dataFormatExcelEmbarque && dataFormatExcelEmbarque.length > 0) {
      getEmbarqueGenerate();
    }
  }, [dataFormatExcelEmbarque]);

  return (
    <main>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} size="medium" aria-label="customized table">
          <TableHead>
            {mostrarContenedores && (
              <TableRow>
                <TableCell rowSpan={1} sx={cellSx} colSpan={mostrarContenedores ? 3 : 9}></TableCell>
                <TableCell rowSpan={1} sx={cellSx} colSpan={21}>
                  {mostrarContenedores && (
                    <>
                      Emb
                      <Tooltip title="Desplegar embarques">
                        <IconButton
                          onClick={() => {
                            !mostrarContenedores ? buscarEmbarques() : null;
                            dispatch(StatesFormModalsSlice.actions.setMostrarContenedores(!mostrarContenedores));
                          }}
                          style={{ position: "relative" }}
                          size="small">
                          <KeyboardDoubleArrowRight color="primary" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <StyledTableCell align="center">Accion</StyledTableCell>
              <StyledTableCell align="center">Posicion</StyledTableCell>
              <StyledTableCell align="center">SKU</StyledTableCell>
              <StyledTableCell align="center">Pw(W)</StyledTableCell>
              <StyledTableCell align="center">
                Categoria
                <Tooltip title="Desplegar Datos">
                  <IconButton
                    onClick={() => {
                      dispatch(
                        StatesFormModalsSlice.actions.setShowMostrarInformacionModelo(!mostrarInformacionModelo)
                      );
                    }}
                    style={{ position: "relative" }}
                    size="small">
                    {!mostrarInformacionModelo ? <Add color="primary" /> : <Remove color="primary" />}
                  </IconButton>
                </Tooltip>
              </StyledTableCell>
              {/* DATOS DESGLOZADOS */}
              {mostrarInformacionModelo && (
                <>
                  <TableCell
                    align="center"
                    sx={{ backgroundColor: "var(--background-color-tableHeader-planProdSpp)", minWidth: 120 }}>
                    Proveedor
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ backgroundColor: "var(--background-color-tableHeader-planProdSpp)", minWidth: 120 }}>
                    Marca
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ backgroundColor: "var(--background-color-tableHeader-planProdSpp)", minWidth: 120 }}>
                    Pw(KBTU)
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ backgroundColor: "var(--background-color-tableHeader-planProdSpp)", minWidth: 120 }}>
                    Familia
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ backgroundColor: "var(--background-color-tableHeader-planProdSpp)", minWidth: 120 }}>
                    Remanente
                  </TableCell>
                </>
              )}
              {/* DATOS DESGLOZADOS */}
              <StyledTableCell align="center">PO</StyledTableCell>
              <StyledTableCell align="center">Lote</StyledTableCell>
              <StyledTableCell align="center">Cantidad</StyledTableCell>
              <StyledTableCell align="center">Ritmo</StyledTableCell>
              <StyledTableCell align="center">OP Mont.</StyledTableCell>
              <StyledTableCell align="center">OP IM Main</StyledTableCell>
              <StyledTableCell align="center">OP IM Dis.</StyledTableCell>
              <StyledTableCell align="center">OP SUB</StyledTableCell>
              {!mostrarContenedores && (
                <>
                  <StyledTableCell align="center">
                    Emb
                    <Tooltip title="Desplegar embarques">
                      <IconButton
                        onClick={() => {
                          buscarEmbarques();
                          dispatch(StatesFormModalsSlice.actions.setMostrarContenedores(!mostrarContenedores));
                        }}
                        style={{ position: "relative" }}
                        size="small">
                        <KeyboardDoubleArrowRight color="primary" />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </>
              )}
              {mostrarContenedores && cargaDTO && (
                <>
                  {formatEmbarques().map((elementos, index) => (
                    <StyledTableCell key={index} align="center">
                      {elementos.nombreEmbarque}
                    </StyledTableCell>
                  ))}
                </>
              )}
              <StyledTableCell align="center">Estado</StyledTableCell>
              <StyledTableCell align="center">Observaciones</StyledTableCell>
              <StyledTableCell align="center">Ritmo</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? planesProduccion.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : planesProduccion
            ).map((elementos) => {
              // const planAñadido = planesProduccion.some((excel) => (elementos.observaciones.trim().toLowerCase() === excel.observaciones.trim().toLowerCase()))
              const infoEmbarquesPlan = cargaDTO.find((datosEmbarques) => datosEmbarques.planProdId === elementos.id);
              const embarquesDeLaFila = infoEmbarquesPlan ? infoEmbarquesPlan.embarques : [];
              return (
                <>
                  {listaMesAndPosicionMasAlta &&
                    listaMesAndPosicionMasAlta.map((mes) => (
                      <>
                        {elementos.mes === mes.mes && elementos.position === mes.position && (
                          <TableCell rowSpan={1} sx={cellSxMes} colSpan={40}>
                            {elementos.mes}
                          </TableCell>
                        )}
                      </>
                    ))}
                  <StyledTableRow
                    className={`${elementos.position !== 1 ? "cursor-pointer" : ""}`}
                    onClick={() => {
                      elementos.position !== 1 ? cambiarPositionPlanes(elementos.id) : null;
                    }}
                    sx={
                      elementos.id === 0
                        ? { backgroundColor: "var(--danger-color)" }
                        : elementos.seleccionado
                        ? { backgroundColor: "var(--background-color-tableSelected-planProdSpp)" }
                        : elementos.produciendo
                        ? { backgroundColor: "#61D864" }
                        : {
                            "&:nth-of-type(even)": { backgroundColor: "var(--background-color-table-planProdSpp)" }
                          }
                    }
                    key={elementos.id}>
                    <StyledTableCell align="center" component="th" scope="row">
                      <Tooltip
                        onClick={(e) => {
                          handleOpenModalEdit(elementos, e);
                        }}
                        title="Editar plan de produccion">
                        <IconButton style={{ position: "relative" }} size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      {!elementos.produciendo && (
                        <Tooltip
                          onClick={(e) => {
                            cambiarPlanEnProduccion(e, elementos);
                          }}
                          title="Marcar como en produccion">
                          <IconButton style={{ position: "relative" }} size="small">
                            <NextPlanRounded color="success" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {elementos.produciendo && (
                        <Tooltip
                          onClick={(e) => {
                            cancelarPlanEnProduccion(e, elementos);
                          }}
                          title="Cancelar plan en produccion">
                          <IconButton style={{ position: "relative" }} size="small">
                            <CancelRounded color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {/* <Tooltip onClick={(e) => { deletePlanProduccion(elementos.id, e) }}
                                            title="Eliminar plan de produccion">
                                            <IconButton
                                                style={{ position: "relative" }} size="small">
                                                <Delete color="error" />
                                            </IconButton>
                                        </Tooltip> */}
                    </StyledTableCell>
                    <StyledTableCell align="center">{elementos.position}</StyledTableCell>
                    <StyledTableCell align="center">{elementos.modelo.nombre}</StyledTableCell>
                    <StyledTableCell align="center">{elementos.modelo.familia.pw}</StyledTableCell>
                    <StyledTableCell align="center">{generarCategoria(elementos)}</StyledTableCell>
                    {/* DATOS DESGLOZADOS */}
                    {mostrarInformacionModelo && (
                      <>
                        <StyledTableCell
                          sx={
                            elementos.seleccionado
                              ? { backgroundColor: "var(--background-color-tableSelected-planProdSpp)" }
                              : { backgroundColor: "var(--background-color-tableHeader-planProdSpp)" }
                          }
                          align="center">
                          {elementos.modelo.familia.proveedores.descripcion}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={
                            elementos.seleccionado
                              ? { backgroundColor: "var(--background-color-tableSelected-planProdSpp)" }
                              : { backgroundColor: "var(--background-color-tableHeader-planProdSpp)" }
                          }
                          align="center">
                          {elementos.modelo.descripcion}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={
                            elementos.seleccionado
                              ? { backgroundColor: "var(--background-color-tableSelected-planProdSpp)" }
                              : { backgroundColor: "var(--background-color-tableHeader-planProdSpp)" }
                          }
                          align="center">
                          {filtrarKbtuPorFamilia(elementos.modelo.familia.nombre)}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={
                            elementos.seleccionado
                              ? { backgroundColor: "var(--background-color-tableSelected-planProdSpp)" }
                              : { backgroundColor: "var(--background-color-tableHeader-planProdSpp)" }
                          }
                          align="center">
                          {elementos.modelo.familia.nombre}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={
                            elementos.seleccionado
                              ? { backgroundColor: "var(--background-color-tableSelected-planProdSpp)" }
                              : { backgroundColor: "var(--background-color-tableHeader-planProdSpp)" }
                          }
                          align="center">
                          {elementos.remanente}
                        </StyledTableCell>
                      </>
                    )}
                    {/* DATOS DESGLOZADOS */}
                    <StyledTableCell align="center">{elementos.po}</StyledTableCell>
                    <StyledTableCell align="center">{elementos.lote}</StyledTableCell>
                    <StyledTableCell align="center">{elementos.cantidad}</StyledTableCell>
                    <StyledTableCell align="center">{elementos.ritmo}</StyledTableCell>
                    <StyledTableCell className={colorEstadoOp(elementos.opMontaje)} align="center">
                      {ayudaEstadoOp(elementos.opMontaje)}
                    </StyledTableCell>
                    <StyledTableCell className={colorEstadoOp(elementos.opImMain)} align="center">
                      {ayudaEstadoOp(elementos.opImMain)}
                    </StyledTableCell>
                    <StyledTableCell className={colorEstadoOp(elementos.opImDisplay)} align="center">
                      {ayudaEstadoOp(elementos.opImDisplay)}
                    </StyledTableCell>
                    <StyledTableCell className={colorEstadoOp(elementos.opSub)} align="center">
                      {ayudaEstadoOp(elementos.opSub)}
                    </StyledTableCell>
                    {!mostrarContenedores && <StyledTableCell></StyledTableCell>}
                    {mostrarContenedores && cargaDTO && (
                      <>
                        {formatEmbarques().map((grupo, index12) => {
                          const embarqueCoincidente = grupo.numerosEmbarques.find(
                            (emb) => emb.planProdId === elementos.id
                          );
                          return (
                            <>
                              {embarqueCoincidente?.numeroEmbarque != null &&
                              embarqueCoincidente?.numeroEmbarque != "" ? (
                                <StyledTableCell>
                                  <PopperComponent
                                    showElement={
                                      <p
                                        className={`${generarFondoEmbarques(
                                          embarqueCoincidente?.estadoEmbarqueId
                                        )} text-sm font-semibold`}>
                                        {embarqueCoincidente?.numeroEmbarque || "-----"}
                                      </p>
                                    }
                                    elemento={embarqueCoincidente}
                                    elementoIndex={(index) => index12}
                                    customChildren={
                                      <div className="flex flex-col gap-y-2 p-4">
                                        <div className="flex flex-row items-center gap-x-4">
                                          <p className="text-white bg-blue-500 border border-gray-400 rounded-lg p-2 flex-1 text-center shadow-md">
                                            Informacion Detallada
                                          </p>
                                          <div className="shrink-0 flex items-center justify-center">
                                            <Tooltip title="Agregar Observacion" PopperProps={{ sx: { zIndex: 9999 } }}>
                                              <Box component="span" sx={{ display: "inline-block" }}>
                                                <Button
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    setEmbarqueSeleccionado(embarqueCoincidente);
                                                    setOpenModalAgregarObservacion(true);
                                                  }}
                                                  className={`${buttonClases.purpleButton} rounded-full min-w-[32px]`}>
                                                  <EditRounded />
                                                </Button>
                                              </Box>
                                            </Tooltip>
                                          </div>
                                        </div>
                                        <p className="">
                                          <span className="font-bold">Bajada: </span> {embarqueCoincidente.bajada}
                                        </p>
                                        <p className="">
                                          <span className="font-bold">Estado: </span>{" "}
                                          {embarqueCoincidente.estadoEmbarque.nombre}
                                        </p>
                                        <p className="">
                                          <span className="font-bold">Nombre Embarque: </span>{" "}
                                          {embarqueCoincidente.nombreEmbarque}
                                        </p>
                                        <p className="">
                                          <span className="font-bold">Numero Embarque: </span>{" "}
                                          {embarqueCoincidente.numeroEmbarque}
                                        </p>
                                        <p className="">
                                          <span className="font-bold">PO: </span>
                                          {embarqueCoincidente.po}
                                        </p>
                                        <p>
                                          <span className="font-bold">Observacion: </span>
                                          {embarqueCoincidente?.observacion || "Sin Observacion"}
                                        </p>
                                      </div>
                                    }></PopperComponent>
                                </StyledTableCell>
                              ) : (
                                <StyledTableCell>
                                  <p
                                    className={`${generarFondoEmbarques(
                                      embarqueCoincidente?.estadoEmbarqueId
                                    )} text-sm font-semibold`}>
                                    {embarqueCoincidente?.numeroEmbarque || "-----"}
                                  </p>
                                </StyledTableCell>
                              )}
                            </>
                          );
                        })}
                      </>
                    )}
                    <StyledTableCell align="center">{generarEstado(elementos.estado)}</StyledTableCell>
                    <StyledTableCell align="center">{elementos.observaciones}</StyledTableCell>
                    <StyledTableCell align="center">{elementos.ritmo}</StyledTableCell>
                  </StyledTableRow>
                </>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[1, 5, 10, 25, { label: "All", value: -1 }]}
                colSpan={100}
                count={planesProduccion.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "Columnas Por Pagina"
                    },
                    native: true
                  }
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <ModalCompoment
        openPopup={openModalAgregar}
        setOpenPopup={setOpenModalAgregar}
        title={estadoEdicion ? "Editar Lote" : "Crear Nuevo Lote"}>
        <AgregarEditarPlanProdModal openModal={openModalAgregar} setOpenModal={setOpenModalAgregar} />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalAgregarObservacion}
        openPopup={openModalAgregarObservacion}
        title="Agregar Observacion"
        titleModalStyle="Audit"
        subTitleClassName="text-blue-500 text-xs"
        showModalCenterPage
        subTitle={`Se agregara una nueva observacion para el embarque ${embarqueSeleccionado?.numeroEmbarque}`}>
        <AgregarObservacionEmbarqueModal
          refreshList={buscarEmbarques}
          setOpenMoal={setOpenModalAgregarObservacion}
          embarqueSeleccionado={embarqueSeleccionado}
        />
      </ModalCompoment>
    </main>
  );
};
