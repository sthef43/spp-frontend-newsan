import React, { useCallback, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  Button,
  FormControl,
  Box,
  TextField,
  FormHelperText
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import * as _ from "lodash";
import { Edit, Delete, Done } from "@mui/icons-material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import classNames from "classnames";
import moment from "moment";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { RechazoModal } from "./RechazoModal";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { IconButtons, MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IRechazo } from "app/models/IRechazo";

import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { ICambiarPiezaDTO } from "app/models/ICambiarPiezaDTO";
interface PropType {
  operacion: TrazaOperaciones;
  refresh: any;
}

export const HistoricoPanel = ({ operacion, refresh }: PropType) => {
  console.log(operacion);
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  let historial = _.chain(operacion.historial)
    .groupBy("lineaPuestoId")
    .map(function (items, id) {
      return {
        lineaPuestoId: +id,
        puesto: items.find((d) => d.lineaPuestoId == +id).lineaPuesto.puesto.nombre,
        historial: items,
        createdDate: _.maxBy(items, "createdDate")?.createdDate
      };
    })
    .value();
  historial = _.orderBy(historial, "createdDate");
  console.log(historial);
  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();

  const [rechazo, setRechazo] = React.useState<IRechazo[]>(null);
  const [isBloqueada, setisBloqueada] = React.useState<boolean>(false);
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [haveRechazo, setHaveRechazo] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [expandedHistorial, setExpandedHistorial] = React.useState<string | false>("");
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const classes = IconButtons();

  interface initialState {
    placaNueva: string;
  }
  const initialStateVar = {
    placaNueva: ""
  };

  const { control, setValue, handleSubmit, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid } = formState;

  useEffect(() => {
    const isBloqueada = operacion.unidades.find((d) => d.rechazado);
    if (isBloqueada) {
      setisBloqueada(true);
    }
    getRechazo(operacion.codigoInit);
  }, []);

  const callbackNewAuditType = useCallback((data: any) => {
    console.log(data);
  }, []);

  const getRechazo = async (codigo: string) => {
    const rechazos = unwrapResult(await dispatch(RechazoSliceRequests.getAllRechazoByCodigo(codigo)));
    if (rechazos && rechazos.length > 0) {
      setRechazo(rechazos);
      setHaveRechazo(true);
    }
  };

  const handleClickRechazo = () => {
    console.log("rechazo");
    setModalOpen(true);
  };

  //Cambio de pieza
  const [editarNuevaPlaca, setEditarNuevaPlaca] = React.useState(false);
  const getEditarPlaca = async (e) => {
    console.log(e);
    setValue("placaNueva", "");
    setEditarNuevaPlaca(!editarNuevaPlaca);
  };

  //Desvincular Caja Eléctrica
  const eliminar = async (e) => {
    const resp = await getConfirmation("Desvincular", "Seguro que desea desvincular caja eléctrica de placa?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.desvincularOperacionByCodigo(e)));
        if (response) {
          openNotificationUI("Se desvinculó la placa", "success");
          refresh();
        }
      } catch (error) {
        openNotificationUI("Error al desvincular.", "error");
      }
    }
  };

  // Modificar Código de Caja Eléctrica
  const loginSubmit = async (e) => {
    const resp = await getConfirmation("Desvincular", "Seguro que desea cambiar la caja eléctrica?");
    if (resp) {
      const objNuevo: ICambiarPiezaDTO = {
        piezaAnterior: operacion.codigoInit,
        piezaNueva: e.placaNueva
      };
      try {
        const result = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.CambioCajaElectrica(objNuevo)));
        console.log(result);
        openNotificationUI("Modificado...", "success");
        getEditarPlaca(null);
        refresh();
      } catch (x) {
        openNotificationUI("Error al modificar.", "error");
      }
    }
  };

  const handleHistorialChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedHistorial(isExpanded ? panel : false);
  };

  const getMarcaciones = (lineaPuestoId) => {
    try {
      if (operacion && !operacion.trazaOperacionesMarcaciones) {
        return "";
      }
      if (operacion.trazaOperacionesMarcaciones.length == 0) return "";
      const marcaciones = operacion.trazaOperacionesMarcaciones;
      const find = marcaciones.find((d) => d.lineaPuestoId == lineaPuestoId);
      return find ? find.operario : "";
    } catch (e) {
      console.error(e);
      return "";
    }
  };
  return (
    <div>
      <ModalCompoment title="Rechazos" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <RechazoModal callbackFunction={callbackNewAuditType} setpopup={setModalOpen} rechazo={rechazo} />
      </ModalCompoment>
      <Accordion expanded={expanded === "root"} onChange={handleChange("root")} sx={{ margin: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{ backgroundColor: isBloqueada ? "#7f292fb0" : "" }}>
          <Typography sx={{ width: "50%", flexShrink: 0 }}>
            #{operacion.id} - {operacion.alias} - {operacion.codigoInit} - {operacion.familia} - {operacion.modelo}
          </Typography>
          {isBloqueada && (
            <>
              <Typography sx={{ width: "50%", flexShrink: 0, color: "red" }} align="right">
                Bloqueada
              </Typography>
            </>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h3" align="center" gutterBottom>
            Recorrido
          </Typography>
          {haveRechazo && (
            <>
              <Button
                fullWidth={true}
                className={buttonClasses.redButton}
                size="medium"
                variant="contained"
                onClick={() => {
                  handleClickRechazo();
                }}>
                Rechazos
              </Button>
            </>
          )}
          {historial.map((h) => {
            return (
              <div className="table-container" key={h.lineaPuestoId}>
                <Accordion
                  sx={{ boxShadow: 3, margin: 1 }}
                  expanded={expandedHistorial === h.puesto}
                  onChange={handleHistorialChange(h.puesto)}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="w-full flex items-center justify-between">
                      <Typography>{h.puesto}</Typography>
                      <Typography>{getMarcaciones(h.lineaPuestoId)}</Typography>
                      {/* <IconButton color="error" aria-label="upload picture" component="label">
                        <DeleteIcon />
                      </IconButton> */}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableComponent
                      Dense={true}
                      Overflow={false}
                      buscar={false}
                      IDcolumn={"id"}
                      columns={[
                        {
                          title: "Campo ",
                          field: "unidad.alias"
                        },
                        {
                          title: "Fecha",
                          field: "createdDate",
                          render: (row) => {
                            return (
                              <div className={classNames("w-full grid grid-cols-3 sm:grid-cols-2 gap-4", "py-0")}>
                                <div className="sm:hidden font-bold">Fecha:</div>
                                <div className={classNames("col-span-2 text-right  sm:text-left", "text-xs")}>
                                  {moment(row.createdDate).format("DD-MM-YYYY")}
                                </div>
                              </div>
                            );
                          }
                        },
                        {
                          title: "Hora",
                          field: "createdDate",
                          render: (row) => {
                            return (
                              <div className={classNames("w-full grid grid-cols-3 sm:grid-cols-2 gap-4", "py-0")}>
                                <div className="sm:hidden font-bold">Hora:</div>
                                <div className={classNames("col-span-2 text-right  sm:text-left", "text-xs")}>
                                  {moment(row.createdDate).format("HH:mm:ss")}
                                </div>
                              </div>
                            );
                          }
                        },
                        {
                          title: "Código",
                          field: "codigo"
                        },
                        {
                          title: "Acciones",
                          field: "",
                          render: (row) => {
                            return (
                              row.isSemiElaborado && (
                                <div className="flex w-full justify-end sm:justify-start gap-4">
                                  <div>
                                    <Tooltip title="Cambiar Caja Eléctrica">
                                      <IconButton
                                        onClick={() => {
                                          getEditarPlaca(row);
                                        }}
                                        // disabled={row.isSemiElaborado}
                                        size="small"
                                        style={{ position: "relative" }}>
                                        <Edit />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                  <div>
                                    <Tooltip title="Desvincular Caja Eléctrica">
                                      <IconButton
                                        onClick={() => {
                                          eliminar(row.codigo);
                                        }}
                                        // disabled={row.isSemiElaborado}
                                        size="small"
                                        style={{ position: "relative" }}>
                                        <Delete color="error" />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </div>
                              )
                            );
                          }
                        }
                      ]}
                      dataInfo={h.historial}
                    />
                  </AccordionDetails>
                </Accordion>
                <Divider />
              </div>
            );
          })}

          {editarNuevaPlaca && (
            <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
              <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
                <Controller
                  name="placaNueva"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl variant="outlined" error={!!error} style={{ width: "100%" }}>
                      <Box display="flex" alignItems="center">
                        <TextField
                          label="Código Nuevo de Caja Eléctrica"
                          variant="outlined"
                          type="text"
                          error={!!error?.types}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                          style={{ width: "60%" }}
                        />
                        <Tooltip title="Cambiar Caja Eléctrica">
                          <span>
                            <IconButton
                              className={classes.greenIcon}
                              disabled={!isDirty && !isValid}
                              size="large"
                              type="submit">
                              <Done />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                      {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </form>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
