import { AddRounded, Delete, Edit } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { ExtintorAgenteSliceRequests } from "app/Middleware/reducers/ExtintorAgenteSlice";
import { ExtintorProcesoSliceRequests } from "app/Middleware/reducers/ExtintorProcesoSlice";
import { ExtintorSitioSliceRequests } from "app/Middleware/reducers/ExtintorSitioSlice";
import { ExtintorSliceRequests } from "app/Middleware/reducers/ExtintorSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant } from "app/models";
import { IExtintor } from "app/models/IExtintor";
import { IExtintorAgente } from "app/models/IExtintorAgente";
import { IExtintorProceso } from "app/models/IExtintorProceso";
import { IExtintorSitio } from "app/models/IExtintorSitio";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ExtintorForm } from "app/features/seguridadEHigiene/extintores/modals/ExtintorForm";
import { SPAForm } from "app/features/seguridadEHigiene/extintores/modals/SPAForm";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ExtintorPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const classes = MaterialButtons();

  interface initialState {
    plantId: number;
    extintorSitioId: number;
    extintorProcesoId: number;
    extintorAgenteId: number;
  }
  const initialStateVar = {
    plantId: 0,
    extintorSitioId: 0,
    extintorProcesoId: 0,
    extintorAgenteId: 0
  };
  const { control, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Watch
  const watchPlanta = watch("plantId");
  const watchSitio = watch("extintorSitioId");
  const watchProceso = watch("extintorProcesoId");
  const watchAgente = watch("extintorAgenteId");

  //Leer
  const [listPlantas, setListPlantas] = useState<IPlant[] | null>(null);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPlantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };
  const [listAgentes, setListAgentes] = useState<IExtintorAgente[] | null>(null);
  const getAgentes = async () => {
    try {
      const responses = unwrapResult(await dispatch(ExtintorAgenteSliceRequests.getListRequest()));
      setListAgentes(responses);
    } catch (error) {
      openNotificationUI("Error al leer agentes.", "error");
    }
  };
  const [listSitios, setListSitios] = useState<IExtintorSitio[] | null>(null);
  const getSitios = async () => {
    try {
      const responses = unwrapResult(await dispatch(ExtintorSitioSliceRequests.getListByPlantRequest(watchPlanta)));
      setListSitios(responses);
    } catch (error) {
      openNotificationUI("Error al leer sitios.", "error");
    }
  };
  const [listProcesos, setListProcesos] = useState<IExtintorProceso[] | null>(null);
  const getProcesos = async () => {
    try {
      const responses = unwrapResult(await dispatch(ExtintorProcesoSliceRequests.getListByPlantRequest(watchPlanta)));
      setListProcesos(responses);
    } catch (error) {
      openNotificationUI("Error al leer procesos.", "error");
    }
  };

  //Leer Extintores
  function seleccionoPlanta(): boolean {
    if (watchPlanta == 0) {
      openNotificationUI("Seleccione una planta.", "error");
      return false;
    } else {
      return true;
    }
  }

  const [listExtintores, setListExtintores] = useState<IExtintor[] | null>(null);
  const getExtintores = async () => {
    if (seleccionoPlanta()) {
      const parametros = {
        planta: watchPlanta,
        sitio: watchSitio,
        proceso: watchProceso,
        agente: watchAgente
      };
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen());
        const responses = unwrapResult(await dispatch(ExtintorSliceRequests.getListByPSPARequest(parametros)));
        setListExtintores(responses);
      } catch (error) {
        openNotificationUI("Error al leer extintores.", "error");
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  //Leer Extintores Vencidos
  const getExtintoresVencidos = async () => {
    if (seleccionoPlanta()) {
      try {
        const responses = unwrapResult(
          await dispatch(ExtintorSliceRequests.getListVencidosByPlantRequest(watchPlanta))
        );
        if (responses.length < 1) {
          openNotificationUI("No hay extintores próximos a vencer.", "success");
        }
        setListExtintores(responses);
      } catch (error) {
        openNotificationUI("Error al leer extintores vencidos.", "error");
      }
    }
  };

  useEffect(() => {
    if (listPlantas) {
      getSitios();
      getProcesos();
    }
  }, [watchPlanta]);

  // Eliminar
  const borrar = async (row) => {
    const resp = await getConfirmation("Eliminar", "Esta seguro de eliminar el registro?");
    if (resp) {
      try {
        unwrapResult(await dispatch(ExtintorSliceRequests.deleteRequest(row)));
        openNotificationUI("Eliminado...", "success");
        getExtintores();
      } catch (error) {
        openNotificationUI("Error al eliminar.", "error");
      }
    }
  };

  //Editar
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState<IExtintor | null>(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  //Editar Item
  const [ModalOpenItem, setModalOpenItem] = useState(false);
  const editarItems = () => {
    if (seleccionoPlanta()) {
      setModalOpenItem(true);
    }
  };

  const getOpciones = () => {
    getSitios();
    getProcesos();
    getAgentes();
  };

  useEffect(() => {
    TitleChanger("Extintores");
    getPlantas();
    getAgentes();
  }, []);

  return (
    <>
      <div className="flex flex-row items-center shadow-elevation-4 text-center bg-secondaryNew rounded-lg m-2 p-3">
        <div className="flex flex-row gap-x-6 items-center w-full justify-between">
          <div className="m-2 w-full">
            <Controller
              name="plantId"
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
                            <div>{x.name}</div>
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
          <div className="m-2 w-full flex flex-row items-center gap-x-4">
            <div className="w-full">
              <Controller
                name="extintorSitioId"
                control={control}
                rules={{ required: false }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Sitio</InputLabel>
                    <Select {...field} placeholder="Seleccione Sitio" variant="standard">
                      {listSitios &&
                        listSitios.map((x) => (
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
            <div>
              <Button className={`${classes.purpleButton} size-7 rounded-full min-w-[30px]`}>
                <Tooltip title="Agregar nueva muestra">
                  <IconButton
                    onClick={() => {
                      editarItems();
                    }}
                    size="small"
                    style={{ position: "relative" }}>
                    <AddRounded sx={{ fill: "white", fontSize: "1.25rem" }} />
                  </IconButton>
                </Tooltip>
              </Button>
            </div>
          </div>
          <div className="m-2 w-full">
            <Controller
              name="extintorProcesoId"
              control={control}
              rules={{ required: false }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Proceso</InputLabel>
                  <Select {...field} placeholder="Seleccione Proceso" variant="standard">
                    {listProcesos &&
                      listProcesos.map((x) => (
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
          <div className="m-2 w-full">
            <Controller
              name="extintorAgenteId"
              control={control}
              rules={{ required: false }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Agente</InputLabel>
                  <Select {...field} placeholder="Seleccione Agente" variant="standard">
                    {listAgentes &&
                      listAgentes.map((x) => (
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
        </div>
        <div className="flex flex-row items-center justify-end w-1/3 mr-10">
          <div className="overflow-auto m-2">
            <Button className={classes.blueButton} variant="contained" onClick={getExtintores}>
              Buscar
            </Button>
          </div>
          <div className="m-2">
            <div>
              <Tooltip title="Mostrar Extintores Proximos a Vencer">
                <Button
                  onClick={getExtintoresVencidos}
                  className={`${classes.greenButton} rounded-full size-12 p-0 min-w-0 shadow-shadowBox`}>
                  <img
                    className="w-4/5"
                    src={`${import.meta.env.BASE_URL}icons/logos_spp_nuevos/iconoExtintores.svg`}
                    alt=""
                  />
                </Button>
              </Tooltip>
            </div>
            {/* <Button
              className={classes.greenButton}
              variant="contained"
              startIcon={<Alarm />}
              onClick={getExtintoresVencidos}>
              Extintores a Vencer
            </Button> */}
          </div>
          {/* <div className="p-5 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
          <Button
            className={classes.greenButton}
            variant="contained"
            startIcon={<Add />}
            onClick={editarItems}>
            Items
          </Button>
        </div> */}
        </div>
      </div>
      <div className="my-2 mx-4 h-full">
        <TableComponent
          Dense={true}
          buscar={true}
          excel
          IDcolumn={"id"}
          columns={[
            {
              title: "Sitio",
              field: "extintorSitio.nombre"
            },
            {
              title: "Proceso",
              field: "extintorProceso.nombre"
            },
            {
              title: "Agente",
              field: "extintorAgente.nombre"
            },
            {
              title: "Capacidad",
              field: "capacidad"
            },
            {
              title: "Número de Cilindro",
              field: "numeroCilindro"
            },
            {
              title: "Ubicación",
              field: "ubicacion"
            },
            {
              title: "Fecha de Vencimiento",
              field: "fechaVencimiento",
              render: (row) => {
                const fechaVencimiento = moment(row.fechaVencimiento);
                const diferenciaDias = fechaVencimiento.diff(moment(), "days"); // Calcula la diferencia en días
                if (diferenciaDias <= 25) {
                  return (
                    <span style={{ color: "#FF625B", fontWeight: "bold" }}>
                      {fechaVencimiento.format("L")} (Ver Vencimiento)
                    </span>
                  );
                }
                return fechaVencimiento.format("L"); // Retorna solo la fecha formateada si no está próxima a vencer
              }
            },
            {
              title: "Fecha de Vencimiento de PH",
              field: "fechaVencimientoPH",
              render: (row) => {
                const fechaVencimiento = moment(row.fechaVencimientoPH);
                const diferenciaDias = fechaVencimiento.diff(moment(), "days"); // Calcula la diferencia en días
                if (diferenciaDias <= 25) {
                  return (
                    <span style={{ color: "#FF625B", fontWeight: "bold" }}>
                      {fechaVencimiento.format("L")} (Ver Vencimiento)
                    </span>
                  );
                }
                return fechaVencimiento.format("L"); // Retorna solo la fecha formateada si no está próxima a vencer
              }
            },
            {
              title: "Presión",
              field: "presion",
              render: (row) => {
                return row.presion ? (
                  <div style={{ color: "green", fontWeight: "bold" }}>OK</div>
                ) : (
                  <div style={{ color: "red", fontWeight: "bold" }}>NG</div>
                );
              }
            },
            {
              title: "Seguro",
              field: "seguro",
              render: (row) => {
                return row.seguro ? (
                  <div style={{ color: "green", fontWeight: "bold" }}>OK</div>
                ) : (
                  <div style={{ color: "red", fontWeight: "bold" }}>NG</div>
                );
              }
            },
            {
              title: "Cilindro",
              field: "cilindro",
              render: (row) => {
                return row.cilindro ? (
                  <div style={{ color: "green", fontWeight: "bold" }}>OK</div>
                ) : (
                  <div style={{ color: "red", fontWeight: "bold" }}>NG</div>
                );
              }
            },
            {
              title: "Manómetro",
              field: "manometro",
              render: (row) => {
                return row.manometro ? (
                  <div style={{ color: "green", fontWeight: "bold" }}>OK</div>
                ) : (
                  <div style={{ color: "red", fontWeight: "bold" }}>NG</div>
                );
              }
            },
            {
              title: "Manguera",
              field: "manguera",
              render: (row) => {
                return row.manguera ? (
                  <div style={{ color: "green", fontWeight: "bold" }}>OK</div>
                ) : (
                  <div style={{ color: "red", fontWeight: "bold" }}>NG</div>
                );
              }
            },
            {
              title: "Señalización",
              field: "señalizacion",
              render: (row) => {
                return row.señalizacion ? (
                  <div style={{ color: "green", fontWeight: "bold" }}>OK</div>
                ) : (
                  <div style={{ color: "red", fontWeight: "bold" }}>NG</div>
                );
              }
            },
            {
              title: "Fecha de Actualización",
              field: "lastModifiedDate",
              render: (row) => {
                return moment(row.lastModifiedDate).format("L");
              }
            },
            {
              title: "Usuario",
              field: "appUser.operator.surname",
              render: (row) => {
                return row.appUser.operator.surname + " " + row.appUser.operator.name;
              }
            },
            {
              title: "Observación",
              field: "observacion"
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
                            borrar(row.id);
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
          dataInfo={listExtintores}
        />
        <ModalCompoment title={editState ? "Agregar" : "Nuevo"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
          <ExtintorForm
            setOpenPopup={setModalOpen}
            editState={editState}
            refresh={getExtintores}
            estaEditando={estaEditando}
          />
        </ModalCompoment>
        <ModalCompoment title={"Items"} openPopup={ModalOpenItem} setOpenPopup={setModalOpenItem}>
          <SPAForm setOpenPopup={setModalOpenItem} refresh={getOpciones} planta={watchPlanta} />
        </ModalCompoment>
      </div>
    </>
  );
};
