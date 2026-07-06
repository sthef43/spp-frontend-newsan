import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotacionSliceRequests } from "app/features/ingenieria/slices/DotacionSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { CrearNuevaDotacionModal } from "../../modals/DotacionModals/CrearNuevaDotacionModal";
import { EditarDotacionModal } from "../../modals/DotacionModals/EditarDotacionModal";
import { ExaminarDatosTareasModal } from "../../modals/DotacionModals/ExaminarDatosTareasModal";
import { RealizarTareasModal } from "../../modals/DotacionModals/RealizarTareasModal";
import { IDotacion } from "../../models/IDotacion";

interface datosDate {
  fechaDesde: string;
  fechaHasta: string;
}

interface propiedadesDotacionTotales {
  piso: string;
  turno: string;
  fieldTotal: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Dotacion = () => {
  const cellSx = {
    minWidth: 100,
    textAlign: "center",
    p: 1,
    verticalAlign: "middle"
  };

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const classes = MaterialButtons();

  //Estados para abrir los modals
  const [openModalAgregarDotacion, setOpenModalAgregarDotacion] = useState(false);
  const [openModalRealizarTarea, setOpenModalRealizarTarea] = useState(false);
  const [openModalExaminarDatos, setOpenModalExaminarDatos] = useState(false);
  const [openModalEditarDotacion, setOpenModalEditarDotacion] = useState(false);

  //Dotacion seleccionada tanto para editar como para realizar tareas
  const [dotacionSeleccionada, setDotacionSeleccionada] = useState<IDotacion>();

  //Seteo las propiedades cuando se hace click en la tabla con la linea el piso y el field que se compone asi(lrUiMañana)
  const [propiedadesDotacion, setPropiedadesDotacion] = useState<propiedadesDotacionTotales>();

  //Seteo los dates para poder hacer un refresh
  const [datesIngresados, setDatesIngresados] = useState<datosDate>();

  //Fecha
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [error, setError] = useState(false);

  //Buscar
  const [dotaciones, setDotaciones] = useState<IDotacion[]>([]);
  const getDotacion = async () => {
    try {
      if (!error) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const result = unwrapResult(
          await dispatch(DotacionSliceRequests.GetAllByDates({ fechaDesde: fechaDesde, fechaHasta: fechaHasta }))
        );
        if (result) {
          setDatesIngresados({ fechaDesde: fechaDesde, fechaHasta: fechaHasta });
          setDotaciones(result);
          dispatch(LoadingUISlice.actions.LoadingUIClose());
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
      console.log(error);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //Eliminar Dotacion
  const borrar = async (row) => {
    try {
      if (
        await getConfirmation(
          "Eliminar Dotacion",
          "Seguro que desea eliminar el registro",
          null,
          "Eliminar",
          "Cancelar"
        )
      ) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(DotacionSliceRequests.deleteRequest(row.id)));
        if (response) {
          const result = unwrapResult(
            await dispatch(DotacionSliceRequests.GetAllByDates({ fechaDesde: fechaDesde, fechaHasta: fechaHasta }))
          );
          setDotaciones(result);
          openNotificationUI("Se elimino el registro correctamente", "success");
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //Formatear fecha para la tabla
  const fechaCreacion = (dateTime) => {
    const fecha = new Date(dateTime);
    if (fecha) {
      return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    } else {
      return "Sin Fecha de creacion";
    }
  };

  //Se le cambia el titulo de la navbar
  useEffect(() => {
    TitleChanger("Mantenimiento de Dotación");
  }, []);

  // const [plantaAltaBaja, setPlantaAltaBaja] = useState("")
  // useEffect(() => {
  //   if (watchLineaId && lineas != null) {
  //     const lineaSeleccionada = lineas.find((elementos) => { return elementos.id == watchLineaId })
  //     if (lineaSeleccionada.nombre.includes("PB")) {
  //       setPlantaAltaBaja("HR")
  //     } else {
  //       setPlantaAltaBaja("LR")
  //     }
  //   }
  // }, [watchLineaId])

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", marginTop: "1rem", padding: "0 1rem" }}>
      <section style={{ width: "100%", height: "100%" }}>
        <div className="sm:flex md:flex items-center justify-around w-full font-semibold rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div className="p-2 overflow-auto m-2" style={{ flex: "1 1 100%" }}>
            <SelectOfDate
              estilosPredeterminados
              fechaDesdeHasta
              setFechaDesdeProps={setFechaDesde}
              setFechaHastaProps={setFechaHasta}
              setErrorProps={setError}
            />
          </div>
          <div className="flex justify-around m-2" style={{ flex: "1 1 10%" }}>
            <Button onClick={getDotacion} className={classes.greenButton} type="submit" variant="contained">
              Buscar
            </Button>
          </div>
          <div className="flex justify-around m-2" style={{ flex: "1 1 10%" }}>
            <Button
              onClick={() => {
                setOpenModalAgregarDotacion(true);
              }}
              className={classes.blueButton}
              type="button"
              variant="contained">
              Agregar
            </Button>
          </div>
        </div>
      </section>
      {dotaciones && dotaciones.length > 0 && (
        <div className="my-2 mx-4 h-full">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={1} sx={cellSx} colSpan={7}></TableCell>
                  <TableCell rowSpan={1} sx={cellSx}></TableCell>
                  <TableCell rowSpan={1} sx={cellSx}></TableCell>
                  <TableCell rowSpan={1} sx={cellSx} colSpan={2}>
                    LR
                  </TableCell>
                  <TableCell rowSpan={1} sx={cellSx} colSpan={2}></TableCell>
                  <TableCell rowSpan={1} sx={cellSx} colSpan={2}>
                    HR
                  </TableCell>
                  <TableCell rowSpan={1} sx={cellSx} colSpan={2}></TableCell>
                  <TableCell rowSpan={1} sx={cellSx} colSpan={2}></TableCell>
                </TableRow>
                {/* Fila 1: grupos */}
                <TableRow>
                  <TableCell rowSpan={3} sx={cellSx}>
                    Fecha
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    SKU
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    T.M
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    EF.Montaje
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    Total Dot.
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    TSTD Pauta
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    TSTD Plan
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    TAK Zest
                  </TableCell>

                  <TableCell colSpan={2} sx={cellSx}>
                    Mañana
                  </TableCell>
                  <TableCell colSpan={2} sx={cellSx}>
                    Tarde
                  </TableCell>
                  <TableCell colSpan={2} sx={cellSx}>
                    Mañana
                  </TableCell>
                  <TableCell colSpan={2} sx={cellSx}>
                    Tarde
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    Ritmo Pauta
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    Ritmo Plan
                  </TableCell>
                  <TableCell rowSpan={3} sx={cellSx}>
                    Acciones
                  </TableCell>
                  {/* Columnas sueltas al final */}
                </TableRow>
                {/* Fila 2: subcolumnas */}
                <TableRow>
                  <TableCell
                    onClick={() => {
                      setOpenModalRealizarTarea(true);
                      setPropiedadesDotacion({ fieldTotal: "lrUiMañana", piso: "HR", turno: "Mañana" });
                    }}
                    sx={cellSx}
                    className="hover:text-primaryNew cursor-pointer">
                    UI
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setOpenModalRealizarTarea(true);
                      setPropiedadesDotacion({ fieldTotal: "lrUeFlexMañana", piso: "HR", turno: "Mañana" });
                    }}
                    sx={cellSx}
                    className="hover:text-primaryNew cursor-pointer">
                    UE/Flex
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setOpenModalRealizarTarea(true);
                      setPropiedadesDotacion({ fieldTotal: "lrUiTarde", piso: "HR", turno: "Tarde" });
                    }}
                    sx={cellSx}
                    className="hover:text-primaryNew cursor-pointer">
                    UI
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setOpenModalRealizarTarea(true);
                      setPropiedadesDotacion({ fieldTotal: "lrUeFlexTarde", piso: "HR", turno: "Tarde" });
                    }}
                    sx={cellSx}
                    className="hover:text-primaryNew cursor-pointer">
                    UE/Flex
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setOpenModalRealizarTarea(true);
                      setPropiedadesDotacion({ fieldTotal: "hrUiMañana", piso: "LR", turno: "Mañana" });
                    }}
                    sx={cellSx}
                    className="hover:text-primaryNew cursor-pointer">
                    UI
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setOpenModalRealizarTarea(true);
                      setPropiedadesDotacion({ fieldTotal: "hrUeMañana", piso: "LR", turno: "Mañana" });
                    }}
                    sx={cellSx}
                    className="hover:text-primaryNew cursor-pointer">
                    UE
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setOpenModalRealizarTarea(true);
                      setPropiedadesDotacion({ fieldTotal: "hrUiTarde", piso: "LR", turno: "Tarde" });
                    }}
                    sx={cellSx}
                    className="hover:text-primaryNew cursor-pointer">
                    UI
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      setOpenModalRealizarTarea(true);
                      setPropiedadesDotacion({ fieldTotal: "hrUeTarde", piso: "LR", turno: "Tarde" });
                    }}
                    sx={cellSx}
                    className="hover:text-primaryNew cursor-pointer">
                    UE
                  </TableCell>
                </TableRow>
              </TableHead>
              {dotaciones.map((elementos, index) => {
                const tsdtPauta = parseFloat(
                  ((elementos.sumatoriaTotal * 9) / elementos.ritmoPauta / elementos.turnoMontaje).toFixed(2)
                );
                const tsdtPlan = parseFloat(
                  ((elementos.sumatoriaTotal * 9) / elementos.ritmoPlan / elementos.turnoMontaje).toFixed(2)
                );
                const tiempoPase = parseFloat((((3600 * 9) / elementos.ritmoPauta) * elementos.eficiencia).toFixed(2));
                return (
                  <TableBody key={index}>
                    <TableRow>
                      <TableCell sx={cellSx}>{fechaCreacion(elementos.createdDate)}</TableCell>
                      <TableCell sx={cellSx}>{elementos.dotacionModelo.nombre}</TableCell>
                      <TableCell sx={cellSx}>{elementos.turnoMontaje}</TableCell>
                      <TableCell sx={cellSx}>{elementos.eficiencia}</TableCell>
                      <TableCell sx={cellSx}>{elementos.sumatoriaTotal}</TableCell>
                      <TableCell sx={cellSx}>{tsdtPauta}</TableCell>
                      <TableCell sx={cellSx}>{tsdtPlan}</TableCell>
                      <TableCell sx={cellSx}>{tiempoPase}</TableCell>
                      <TableCell sx={cellSx}>
                        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
                          <Box>{elementos.dotacionTotales.lrUiMañana}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                          <Box>{elementos.dotacionTotales.lrUeFlexMañana}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
                          <Box>{elementos.dotacionTotales.lrUiTarde}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                          <Box>{elementos.dotacionTotales.lrUiTarde}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                          <Box>{elementos.dotacionTotales.hrUiMañana}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                          <Box>{elementos.dotacionTotales.hrUeMañana}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                          <Box>{elementos.dotacionTotales.hrUiTarde}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                          <Box>{elementos.dotacionTotales.hrUeTarde}</Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellSx}>{elementos.ritmoPauta}</TableCell>
                      <TableCell sx={cellSx}>{elementos.ritmoPlan}</TableCell>
                      <TableCell>
                        <div className="flex">
                          <Tooltip title="Eliminar Dotacion">
                            <span>
                              <IconButton
                                onClick={() => {
                                  borrar(elementos);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Delete color="error" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Editar Dotación">
                            <span>
                              <IconButton
                                onClick={() => {
                                  setOpenModalEditarDotacion(true);
                                  setDotacionSeleccionada(elementos);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Edit color="primary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              })}
            </Table>
          </TableContainer>
        </div>
      )}
      <ModalCompoment
        title="Crear Nueva Dotacion"
        setOpenPopup={setOpenModalAgregarDotacion}
        openPopup={openModalAgregarDotacion}>
        <CrearNuevaDotacionModal
          datosDates={datesIngresados}
          openModal={openModalAgregarDotacion}
          setOpenModal={setOpenModalAgregarDotacion}
          refreshTable={setDotaciones}
        />
      </ModalCompoment>
      <ModalCompoment
        title="Ingresar Dotación"
        setOpenPopup={setOpenModalRealizarTarea}
        openPopup={openModalRealizarTarea}>
        <RealizarTareasModal
          refreshTable={setDotaciones}
          datosDates={datesIngresados}
          objetosDotacionTotales={propiedadesDotacion}
          openModal={openModalRealizarTarea}
          setOpenModal={setOpenModalRealizarTarea}
          dotacionSeleccionada={dotacionSeleccionada}
        />
      </ModalCompoment>
      <ModalCompoment
        title="Examinar Resultados De Tareas"
        setOpenPopup={setOpenModalExaminarDatos}
        openPopup={openModalExaminarDatos}>
        <ExaminarDatosTareasModal
          dotacionSeleccionada={dotacionSeleccionada}
          openModal={openModalExaminarDatos}
          setOpenModal={setOpenModalExaminarDatos}
        />
      </ModalCompoment>
      <ModalCompoment
        title="Editar Dotación"
        openPopup={openModalEditarDotacion}
        setOpenPopup={setOpenModalEditarDotacion}>
        <EditarDotacionModal
          setOpenModal={setOpenModalEditarDotacion}
          openModal={openModalEditarDotacion}
          dotacionSeleccionada={dotacionSeleccionada}
          datosDates={datesIngresados}
          refreshTable={setDotaciones}
        />
      </ModalCompoment>
    </div>
  );
};
