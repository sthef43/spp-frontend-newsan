/* eslint-disable unused-imports/no-unused-vars */
import { CheckBox, CheckBoxOutlineBlank, Edit } from "@mui/icons-material";
import {
  Avatar,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PuestoSliceRequests } from "app/Middleware/reducers";
import { CodigoRechazosSliceRequest } from "app/Middleware/reducers/CodigoRechazosSlice";
import { ControlLotePlacasSliceRequests } from "app/Middleware/reducers/ControlLotePlacasSlice";
import { empq_declarationsSliceRequests } from "app/Middleware/reducers/Empq_declarationsSlice";
import { EstadoLoteSliceRequests } from "app/Middleware/reducers/EstadoLoteSlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { TrazaUnit2SliceRequest } from "app/Middleware/reducers/trazaUnit2Slice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser, IEstadoLote, ILinea, IPlanProd } from "app/models";
import { ICodigoRechazos } from "app/models/ICodigoRechazos";
import { IControlLotePlacas } from "app/models/IControlLotePlacas";
import { IPuesto } from "app/models/IPuesto";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { RowRechazosForm } from "app/features/calidad/modules/noConformePlacas/Modals/RowRechazosForm";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface props {
  plan: IPlanProd;
  refresh?: any;
  linea?: ILinea[] | null;
}

interface initialState {
  causa: number;
  contenidoDefectuoso: string;
  accionCorrectiva: string;
  causaRaiz: string;
  descripcion: string;
  puesto: string;
  descripRechazo: string;
}

const initialStateVar = {
  causa: 0,
  contenidoDefectuoso: "",
  accionCorrectiva: "",
  causaRaiz: "",
  descripcion: "",
  puesto: "",
  descripRechazo: ""
};

export const RechazosPlacas = ({ linea, plan, refresh }: props): JSX.Element => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();

  //Guardar Fila Seleccionada
  const [rowRechazado, setRowRechazado] = useState<IControlLotePlacas | null>(null);
  const [modalOpenRechazado, setModalOpenRechazado] = useState(false);

  // Funcion Seleccionar la Linea
  const [lineaSeleccionada, setlineaSeleccionada] = useState<ILinea[]>(null);
  const getLineaSeleccionada = () => {
    const lineaDescrip = linea.filter((x) => x.idLinea == plan.idLinea);
    setlineaSeleccionada(lineaDescrip);
  };

  //Cargar Lista Empaque. Series de Placas Declaradas.
  const [listEmpaque, setListEmpaque] = useState(null);
  const [listEmpaqueGeneral, setListEmpaqueGeneral] = useState(null);
  const getListEmpaqueGeneral = async () => {
    try {
      const modelo = {
        org: plan.organizacion,
        op: plan.numeroOp
      };
      const result = unwrapResult(await dispatch(empq_declarationsSliceRequests.getListByOrgOpRequest(modelo)));
      setListEmpaqueGeneral(result);
    } catch (error) {
      console.log(error);
    }
  };

  //Cargar Lista rechazados
  const [listRechazados, setlistRechazados] = useState<IControlLotePlacas | []>([]);
  const getListRechazados = () => {
    if (listEmpaqueGeneral != null) {
      const filtrado = listEmpaqueGeneral
        .filter((item) => item.controlLotePlacas.length > 0)
        .flatMap((item) => item.controlLotePlacas);
      setlistRechazados(filtrado);
      const filtradoGeneral = listEmpaqueGeneral.filter((item) => item.controlLotePlacas.length == 0);
      setListEmpaque(filtradoGeneral);
    }
  };

  //Cargar Causas
  const [listCausa, setListCausa] = useState<IEstadoLote[]>([]);
  const getListCausa = async () => {
    try {
      const result = unwrapResult(await dispatch(EstadoLoteSliceRequests.getAllRequest()));
      setListCausa(result);
    } catch (error) {
      console.log(error);
    }
  };

  //Cargar Puestos
  const [listPuestos, setListPuestos] = useState<IPuesto[]>([]);
  const getListPuestos = async () => {
    try {
      const result = unwrapResult(await dispatch(PuestoSliceRequests.getListByTipoRequest("IM")));
      setListPuestos(result);
    } catch (error) {
      console.log(error);
    }
  };

  //Cargar Descripcion Rechazo
  const [listDesRechazo, setListDesRechazo] = useState<ICodigoRechazos[]>([]);
  const getListDesRechazo = async () => {
    try {
      const result = unwrapResult(
        await dispatch(CodigoRechazosSliceRequest.GetListByLineaIdRequest(lineaSeleccionada[0].idLinea))
      );
      setListDesRechazo(result);
    } catch (error) {
      console.log(error);
    }
  };

  //Guardar en tablas
  const loginSubmit = async (e) => {
    if (contador == 0) {
      openNotificationUI("Seleccionar Series a rechazar", "error");
      return;
    }
    const listFiltrado = listEmpaque.filter((item) => item.cantidad == 99);
    //*** Objeto para Tabla ControlLotePlacas
    const objectCLP = listFiltrado.map((item) => {
      return {
        empQ_DeclarationsId: item.id,
        estadoLoteId: e.causa,
        nombreSupervisor: infoUser.operator.name + " " + infoUser.operator.surname,
        contenidoDefectuoso: e.contenidoDefectuoso,
        accionCorrectiva: e.accionCorrectiva,
        causaRaiz: e.causaRaiz,
        descripcionRechazo: e.descripcion,
        rechazado: true
      };
    });

    //*** Objeto para Rechazo
    //Desestructura Descripción Rechazo
    const { idCodigoRechazo, codigoRechazo, descripcionRechazo } = JSON.parse(e.descripRechazo);
    //Seleccionar Turno
    const horaActual = parseInt(moment().format("HH"));
    let turnoSelect = "N";
    if (horaActual >= 6 && horaActual < 15) {
      turnoSelect = "M";
    } else {
      if (horaActual >= 15 && horaActual < 12) {
        turnoSelect = "T";
      }
    }
    //Armo el Objeto Rechazo
    const objectRechazo = listFiltrado.map((item) => {
      return {
        fecha: moment().format("YYYY-MM-DD"),
        hora: moment().format("HH:mm:ss"),
        linea: lineaSeleccionada[0].descripcion,
        barcode: item.id, //Código de la placa
        puesto: e.puesto,
        estado: "R",
        horaDesde: moment().format("HH:mm:ss"),
        horaHasta: moment().format("HH:mm:ss"), //sumar en uno la hora
        idLinea: lineaSeleccionada[0].idLinea,
        codigoRechazo: codigoRechazo,
        cantidad: 1,
        total: 1,
        turno: turnoSelect,
        idCodigoRechazo: idCodigoRechazo,
        descripcionRechazo: descripcionRechazo
      };
    });

    //*** Objeto para TrazaUnit2
    const objectTrazaUnit = listFiltrado.map((item) => ({ ...item, referencia_1: "si" }));

    try {
      //  * Control Lote Placas
      unwrapResult(await dispatch(ControlLotePlacasSliceRequests.multiPost(objectCLP)));
      //  * Rechazo
      unwrapResult(await dispatch(RechazoSliceRequests.multiPost(objectRechazo)));
      //  * TrazaUnit
      unwrapResult(await dispatch(TrazaUnit2SliceRequest.getAllByCodigo(objectTrazaUnit)));
      openNotificationUI("Datos actualizados.", "success");
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  //Eliminar
  // const deleteRow = async (row) => {
  //   const resp = await getConfirmation(
  //     "Eliminar el Registro",
  //     "Ésto imputará la placa como NO rechazada. ¿Eliminar el registro? "
  //   );
  //   if (resp) {
  //     try {
  //       const response = unwrapResult(await dispatch(ControlLotePlacasSliceRequests.deleteRequest(row.id)));
  //       if (response) {
  //         openNotificationUI("Se eliminó el registro correctamente", "success");
  //         refresh();
  //       }
  //     } catch (error) {
  //       openNotificationUI("Error al eliminar hoja de parámetros.", "error");
  //     }
  //   }
  // };

  //Series Seleccionados
  const [contador, setContador] = useState(0);
  const agregarCodigo = (row) => {
    const nuevosItems = listEmpaque.map((item) => {
      if (item.id === row.id) {
        if (item.cantidad === 1) {
          setContador((prevContador) => prevContador + 1);
          return { ...item, cantidad: 99 };
        } else {
          setContador((prevContador) => prevContador - 1);
          return { ...item, cantidad: 1 };
        }
      }
      return item;
    });
    setListEmpaque(nuevosItems);
  };
  const quitarSelecciones = () => {
    const nuevosItems = listEmpaque.map((item) => {
      return { ...item, cantidad: 1 };
    });
    setContador(0);
    setListEmpaque(nuevosItems);
  };

  useEffect(() => {
    if (lineaSeleccionada) {
      getListDesRechazo();
    }
  }, [lineaSeleccionada]);

  useEffect(() => {
    if (listEmpaqueGeneral) {
      getListRechazados();
    }
  }, [listEmpaqueGeneral]);

  useEffect(() => {
    getListEmpaqueGeneral();
    getListCausa();
    getListPuestos();
    getLineaSeleccionada();
  }, []);

  //RETURN
  return (
    <div>
      {listEmpaque && (
        <div className="animate__animated animate__fadeInUp">
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
            <div className="col-span-1">
              <div className="text-center ">
                <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
                  <div className="w-full flex justify-center ">
                    <TitleUIComponent title="Números de serie rechazados" classNameDiv="w-full whitespace-wrap mx-0" />
                  </div>
                  {listEmpaque && (
                    <TableComponent
                      buscar={true}
                      IDcolumn={"id"}
                      columns={[
                        {
                          title: "Serie",
                          field: "empQ_DeclarationsId"
                        },
                        {
                          title: "Rechazado",
                          field: "rechazado",
                          render: (row) => {
                            return row.rechazado ? "Si" : "No";
                          }
                        },
                        {
                          title: "",
                          field: "",
                          render: (row) => (
                            <div>
                              <IconButton
                                onClick={() => {
                                  setRowRechazado(row);
                                  setModalOpenRechazado(true);
                                }}
                                size="small">
                                <Edit color="warning" />
                              </IconButton>
                              {/* <IconButton
                                onClick={() => {
                                  deleteRow(row);
                                }}
                                size="small">
                                <Delete color="error" />
                              </IconButton> */}
                            </div>
                          )
                        }
                      ]}
                      dataInfo={listRechazados}
                    />
                  )}
                  <ModalCompoment title="Rechazado" openPopup={modalOpenRechazado} setOpenPopup={setModalOpenRechazado}>
                    <RowRechazosForm rowRechazado={rowRechazado} refresh={refresh} />
                  </ModalCompoment>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2 animate__animated animate__fadeInUpp">
              <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
                <form onSubmit={handleSubmit(loginSubmit)}>
                  <div className="w-full flex justify-center ">
                    <TitleUIComponent
                      title="Seleccionar Motivo y Rango de números a rechazar"
                      classNameDiv="w-full whitespace-wrap mx-0"
                    />
                  </div>
                  <div
                    className="text-center sm:text-left pl-10 pr-10 m-3"
                    style={{ display: "flex", alignItems: "center" }}>
                    <Controller
                      name="causa"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl variant="standard" style={{ flex: 1 }}>
                          <InputLabel>Causa</InputLabel>
                          <Select {...field} placeholder="Ingrese Causa" style={{ width: "400px" }}>
                            {listCausa &&
                              listCausa.map((lote) => (
                                <MenuItem key={lote.idEstadoLote} value={lote.idEstadoLote}>
                                  {lote.descripcion}
                                </MenuItem>
                              ))}
                          </Select>
                          {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                          {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                        </FormControl>
                      )}
                    />
                    <Controller
                      name="puesto"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl variant="standard" style={{ flex: 1 }}>
                          <InputLabel>Puesto</InputLabel>
                          <Select {...field} placeholder="Ingrese Puesto" style={{ width: "400px" }}>
                            {listPuestos &&
                              listPuestos.map((lote) => (
                                <MenuItem key={lote.id} value={lote.nombre}>
                                  {lote.nombre}
                                </MenuItem>
                              ))}
                          </Select>
                          {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                          {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                        </FormControl>
                      )}
                    />
                    <Controller
                      name="descripRechazo"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl variant="standard" style={{ flex: 1 }}>
                          <InputLabel>Rechazo</InputLabel>
                          <Select {...field} placeholder="Ingrese Rechazo" style={{ width: "400px" }}>
                            {listDesRechazo &&
                              listDesRechazo.map((lote) => (
                                <MenuItem
                                  key={lote.idCodigoRechazo}
                                  value={JSON.stringify({
                                    idCodigoRechazo: lote.idCodigoRechazo,
                                    codigoRechazo: lote.codigoRechazo,
                                    descripcionRechazo: lote.descripcionRechazo
                                  })}>
                                  {lote.descripcionRechazo}
                                </MenuItem>
                              ))}
                          </Select>
                          {!!error && error.type !== "min" && <FormHelperText>{error.type}</FormHelperText>}
                          {!!error && error.type === "min" && <FormHelperText>required</FormHelperText>}
                        </FormControl>
                      )}
                    />
                    <Avatar title="Seleccionados" sx={{ bgcolor: "yellowgreen" }}>
                      {contador}
                    </Avatar>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start pl-10 pr-10 m-3">
                    <div className="text-center sm:text-left m-1 flex-1">
                      <Controller
                        name="contenidoDefectuoso"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth variant="outlined" error={!!error}>
                            <InputLabel>Contenido Defectuoso</InputLabel>
                            <Input {...field} />
                            {!!error && <FormHelperText>{error.type}</FormHelperText>}
                          </FormControl>
                        )}
                      />
                    </div>
                    <div className="text-center sm:text-left m-1 flex-1">
                      <Controller
                        name="accionCorrectiva"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth variant="outlined" error={!!error}>
                            <InputLabel>Acción Correctiva</InputLabel>
                            <Input {...field} />
                            {!!error && <FormHelperText>{error.type}</FormHelperText>}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start pl-10 pr-10 m-3">
                    <div className="text-center sm:text-left m-1 flex-1">
                      <Controller
                        name="causaRaiz"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth variant="outlined" error={!!error}>
                            <InputLabel>Causa Raíz</InputLabel>
                            <Input {...field} />
                            {!!error && <FormHelperText>{error.type}</FormHelperText>}
                          </FormControl>
                        )}
                      />
                    </div>
                    <div className="text-center sm:text-left m-1 flex-1">
                      <Controller
                        name="descripcion"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth variant="outlined" error={!!error}>
                            <InputLabel>Rechazo</InputLabel>
                            <Input {...field} />
                            {!!error && <FormHelperText>{error.type}</FormHelperText>}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-center p-2">
                    <div className="mr-10">
                      <Button
                        className={buttonClasses.greenButton}
                        type="submit"
                        variant="contained"
                        disabled={!isDirty && !isValid}>
                        Guardar Rechazo
                      </Button>
                    </div>
                    <div className="ml-10">
                      <Button
                        className={buttonClasses.yellowButton}
                        variant="contained"
                        onClick={quitarSelecciones}
                        disabled={contador ? false : true}>
                        Quitar Seleccionados
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="my-2 mx-4 h-full">
                  <TableComponent
                    Dense={true}
                    Overflow={false}
                    buscar={true}
                    IDcolumn={"id"}
                    columns={[
                      {
                        title: "Serie",
                        field: "id"
                      },
                      {
                        title: "Producto",
                        field: "codigo_Producto"
                      },
                      {
                        title: "Fecha Inserción",
                        field: "",
                        render: (row) => {
                          return moment(row.fecha_Insercion).format("L");
                        }
                      },
                      {
                        title: "Hora Inserción",
                        field: "",
                        render: (row) => {
                          return moment(row.fecha_Insercion).format("LT");
                        }
                      },
                      {
                        title: "Acciones",
                        field: "",
                        render: (row) => {
                          return (
                            <div className="flex w-full justify-end sm:justify-start gap-4">
                              <div>
                                {/* <Tooltip title="Editar Rechazo"> */}
                                <IconButton
                                  color="warning"
                                  onClick={() => {
                                    agregarCodigo(row);
                                  }}
                                  size="small"
                                  style={{ position: "relative" }}>
                                  {row.cantidad == 1 ? <CheckBoxOutlineBlank /> : <CheckBox />}
                                </IconButton>
                                {/* </Tooltip> */}
                              </div>
                            </div>
                          );
                        }
                      }
                    ]}
                    dataInfo={listEmpaque}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
