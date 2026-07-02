import { CheckCircle, Delete, Edit, ViewAgenda } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ContEmbarqueSliceRequests } from "app/Middleware/reducers/ContEmbarqueSlice";
import { ContPlanProduccionSliceRequests } from "app/Middleware/reducers/ContPlanProduccionSlice";
import { ContPlantaSliceRequests } from "app/Middleware/reducers/ContPlantaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IContEmbarque } from "app/models/IContEmbarque";
import { IContPlanProduccion } from "app/models/IContPlanProduccion";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { PedidosForm } from "app/features/contenedor/modules/pedidos/modals/PedidosForm";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { isObject } from "lodash";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import * as XLSX from "xlsx";
import moment from "moment";
import { EmbarqueForm } from "../modals/EmbarqueForm";
import { VerContenedores } from "../modals/VerContenedores";

export const Pedidos = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  interface initialState {
    plantas: string;
    lineas: string;
  }
  const initialStateVar = {
    plantas: "",
    lineas: ""
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Leer Líneas de las Plantas
  const [listLineas, setListLineas] = useState([]);
  const getListLineas = async () => {
    if (watchPlantaId) {
      try {
        const responses = unwrapResult(
          await dispatch(ContPlanProduccionSliceRequests.getListByPlantaIdRequest(parseInt(watchPlantaId)))
        );
        const lineasSinRepetir = Array.from(new Set(responses.map((objeto) => objeto.linea))).map((linea) => ({
          linea
        }));
        // console.log(lineasSinRepetir);
        setListLineas(lineasSinRepetir);
      } catch (error) {
        openNotificationUI("Error al leer Líneas de Plantas.", "error");
      }
    }
  };

  //Leer ContPlanProduccion por Planta y Línea
  const [listContPlanProduccion, setContPlanProduccion] = useState([]);
  const getContPlanProduccion = async () => {
    if (watchLineaId) {
      try {
        const params = { contPlantaId: parseInt(watchPlantaId), linea: watchLineaId };
        const responses = unwrapResult(
          await dispatch(ContPlanProduccionSliceRequests.getListByPlantaLineaIdRequest(params))
        );
        setContPlanProduccion(responses);
      } catch (error) {
        openNotificationUI("Error al leer Cont Plan Produccion.", "error");
      }
    }
  };

  //Leer Plantas
  const [listPlantas, setListPlantas] = useState([]);
  const getListPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(ContPlantaSliceRequests.getAllRequest()));
      setListPlantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };

  const watchPlantaId = watch("plantas");
  useEffect(() => {
    setContPlanProduccion([]);
    getListLineas();
  }, [watchPlantaId]);

  const watchLineaId = watch("lineas");
  useEffect(() => {
    getContPlanProduccion();
  }, [watchLineaId]);

  // Eliminar Plan Producción
  const deleteContPlanProduccion = async (row) => {
    const resp = await getConfirmation("Borrar Línea de Plan de Producción", "Esta seguro que quiere eliminar?");
    if (!isObject(resp)) {
      if (resp) {
        try {
          unwrapResult(await dispatch(ContPlanProduccionSliceRequests.deleteRequest(row.id)));
          openNotificationUI("Eliminado...", "success");
          getContPlanProduccion();
        } catch (error) {
          openNotificationUI("Error al eliminar.", "error");
        }
      }
    }
  };

  // Eliminar Embarque
  const deleteContEmbarque = async (row) => {
    const resp = await getConfirmation(
      "Borrar Embarque de Línea de Plan de Producción",
      "Esta seguro que quiere eliminar?"
    );
    if (resp) {
      try {
        unwrapResult(await dispatch(ContEmbarqueSliceRequests.deleteRequest(row.id)));
        openNotificationUI("Eliminado...", "success");
        getContPlanProduccion();
      } catch (error) {
        openNotificationUI("Error al eliminar.", "error");
      }
    }
  };

  //Finalizado
  const endContPlanProduccion = async (row) => {
    const resp = await getConfirmation("FINALIZAR", "Esta seguro que quiere finalizar Línea de Plan de Producción?");
    const modiFin = {
      ...row,
      abierto: false,
      contPlanta: null,
      contEmbarque: null
    };
    if (!isObject(resp)) {
      if (resp) {
        try {
          const response = unwrapResult(await dispatch(ContPlanProduccionSliceRequests.PutRequest(modiFin)));
          if (response) {
            openNotificationUI("Actualización Finalizada...", "success");
            getContPlanProduccion();
          }
        } catch (error) {
          openNotificationUI("Error al actualizar.", "error");
        }
      }
    }
  };

  // Editar linea Plan Produccion
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState<IContPlanProduccion | null>(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  //Exportar a Excel
  const exportToExcel = (): void => {
    if (!listContPlanProduccion) {
      console.error("listContPlanProduccion is undefined");
      return;
    }

    const flattenedData: any[] = [];
    listContPlanProduccion.forEach((plan) => {
      let flattenedItem = {
        //ContPlanProduccion
        Planta: plan.contPlanta.nombre,
        LineaExcel: plan.lineaExcel,
        Linea: plan.linea,
        Modelo: plan.modelo,
        Lote: plan.lote,
        Cantidad: plan.cantidad,
        PO: plan.po,
        //ContEmbarque
        Embarque: null,
        Número: null,
        //ContContenedor
        Lpn: null,
        Tipo: null,
        Código: null,
        Descripción: null,
        CantidadLPN: null,
        Prioridad: null,

        DetallePlanta: null,
        DetalleContenedor: null,
        Estado: null,
        Ubicacion: null,
        Observacion: null,
        Programado: null,
        Entregado: null
      };
      if (plan.contEmbarque.length == 0) {
        console.error("contEmbarque is undefined");
        flattenedData.push(flattenedItem);
      } else {
        plan.contEmbarque.forEach((embarque) => {
          flattenedItem = {
            ...flattenedItem,
            Embarque: embarque.detalle,
            Número: embarque.numero,
            Lpn: null,
            Tipo: null,
            Código: null,
            Descripción: null,
            CantidadLPN: null,
            Prioridad: null,
            DetallePlanta: null,
            DetalleContenedor: null,
            Estado: null,
            Ubicacion: null,
            Observacion: null,
            Programado: null,
            Entregado: null
          };
          if (embarque.contContenedor.length == 0) {
            console.error("contContenedor is undefined");
            flattenedData.push(flattenedItem);
          } else {
            embarque.contContenedor.forEach((contenedor) => {
              flattenedItem = {
                ...flattenedItem,
                Lpn: contenedor.lpn,
                Tipo: contenedor.tipo,
                Código: contenedor.codigo,
                Descripción: contenedor.descripcion,
                CantidadLPN: contenedor.cantidad,
                Prioridad: contenedor.prioridad,
                DetallePlanta: contenedor.contPlantaDetalle.detalle,
                DetalleContenedor: contenedor.contDetalleContenedor.detalle,
                Estado: contenedor.contEstado.detalle,
                Ubicacion: contenedor.contUbicacion.detalle,
                Observacion: contenedor.contObservacion.observacion,
                Programado: moment(contenedor.fechaProgramado).format("L"),
                Entregado: moment(contenedor.fechaEntregado).format("L")
              };
              flattenedData.push(flattenedItem);
            });
          }
        });
      }
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = "SPP-PedidosContenedores.xlsx";

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  // Editar y Agregar Embarques
  const [estaEditandoEmbarque, setEstaEditandoEmbarque] = useState(false);
  const [editStateEmbarque, setEditStateEmbarque] = useState<IContEmbarque | null>(null);
  const [ModalOpenEmbarque, setModalOpenEmbarque] = useState(false);
  const editarEmbarque = (rowData) => {
    setEditStateEmbarque({ ...rowData });
    setEstaEditandoEmbarque(true);
    setModalOpenEmbarque(true);
  };
  const agregarEmbarque = (rowData) => {
    setEditStateEmbarque({ ...rowData });
    setEstaEditandoEmbarque(false);
    setModalOpenEmbarque(true);
  };

  const [openContenedores, setOpenContenedores] = useState(false);
  const [Embarque, setEmbarque] = useState<IContEmbarque>({} as IContEmbarque);

  useEffect(() => {
    TitleChanger("PEDIDOS");
    getListPlantas();
    getContPlanProduccion();
  }, []);

  //Muestra lista de Embarques por renglón
  const ExtraModulesCollapseEmbarque = ({ row }: any) => {
    return (
      <>
        <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew w-full">
          {/* {row.contEmbarque.length > 0 ? ( */}
          <div>
            <TableComponent
              Dense={true}
              // Overflow={true}
              buscar={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Id",
                  field: "id"
                },
                {
                  title: "Embarque",
                  field: "detalle"
                },
                {
                  title: "Número",
                  field: "numero"
                },
                {
                  title: "Acciones",
                  field: "",
                  render: (row) => {
                    return (
                      <div className="flex w-full justify-end sm:justify-start gap-4">
                        <div>
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() => {
                                editarEmbarque(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => {
                                deleteContEmbarque(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Delete color="error" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Contenedores">
                            <IconButton
                              onClick={() => {
                                setOpenContenedores(true);
                                setEmbarque(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <ViewAgenda color="info" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className="flex items-center justify-center">{row.contContenedor.length} </div>
                      </div>
                    );
                  }
                }
              ]}
              agregar={() => {
                agregarEmbarque(row);
              }}
              dataInfo={row.contEmbarque}
            />
            <ModalCompoment title="Nuevo Embarque" openPopup={ModalOpenEmbarque} setOpenPopup={setModalOpenEmbarque}>
              <EmbarqueForm
                setOpenPopup={setModalOpenEmbarque}
                editStateEmbarque={editStateEmbarque}
                refresh={getContPlanProduccion}
                estaEditandoEmbarque={estaEditandoEmbarque}
              />
            </ModalCompoment>
            <ModalCompoment title="Ver Contenedores" openPopup={openContenedores} setOpenPopup={setOpenContenedores}>
              <VerContenedores setOpenPopup={setOpenContenedores} row={Embarque} refresh={getContPlanProduccion} />
            </ModalCompoment>
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={{ height: "100%", width: "100vw", position: "relative" }}>
      {/* <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}> */}
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <div className="mt-2" style={{ width: "60%" }}>
              <Controller
                name="plantas"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select {...field} placeholder="Seleccione Planta" variant="standard">
                      {listPlantas &&
                        listPlantas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </Grid>
          <Grid item xs={3}>
            {listLineas && listLineas.length > 0 && (
              <div className="mt-2" style={{ textAlign: "center" }}>
                <Controller
                  name="lineas"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Línea</InputLabel>
                      <Select {...field} placeholder="Seleccione Línea" variant="standard">
                        {listLineas.map((x) => (
                          <MenuItem key={x.linea} value={x.linea}>
                            <div className="w-full">
                              <div>{x.linea}</div>
                            </div>
                          </MenuItem>
                        ))}
                      </Select>
                      {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            )}
          </Grid>
          <Grid item xs={3} justifyContent="center" alignItems="center">
            {listContPlanProduccion.length > 0 && (
              <Button className={classes.blueButton} variant="contained" onClick={exportToExcel}>
                Exportar a excel
              </Button>
            )}
          </Grid>
        </Grid>
      </div>

      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        {listContPlanProduccion && (
          <div className="my-2 mx-4 h-full">
            <TableComponent
              Dense={true}
              // Overflow={true}
              buscar={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Id",
                  field: "id"
                },
                {
                  title: "Id Excel",
                  field: "lineaExcel"
                },
                {
                  title: "Línea",
                  field: "linea"
                },
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Lote",
                  field: "lote"
                },
                {
                  title: "Cantidad",
                  field: "cantidad"
                },
                {
                  title: "PO",
                  field: "po"
                },
                {
                  title: "Acciones",
                  field: "",
                  render: (row) => {
                    return (
                      <div className="flex w-full justify-end sm:justify-start gap-4">
                        <div>
                          <Tooltip title="Finalizar">
                            <IconButton
                              onClick={() => {
                                endContPlanProduccion(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <CheckCircle color="success" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() => {
                                editar(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => {
                                deleteContPlanProduccion(row);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Delete color="error" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  }
                }
              ]}
              agregar={() => {
                setEstaEditando(false);
                setEditState(null);
                setModalOpen(true);
              }}
              dataInfo={listContPlanProduccion}
              Collapse
              CollapseExtraModulesBefore={ExtraModulesCollapseEmbarque}
            />
            <ModalCompoment title="Nueva Línea de Plan de Producción" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
              <PedidosForm
                setOpenPopup={setModalOpen}
                editState={editState}
                refresh={getContPlanProduccion}
                estaEditando={estaEditando}
              />
            </ModalCompoment>
          </div>
        )}
      </div>
    </div>
  );
};
