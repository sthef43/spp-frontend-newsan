/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IContContenedor } from "app/models/IContContenedor";
import { toUpper } from "lodash";
import { ContContenedorSliceRequests } from "app/Middleware/reducers/ContContenedorSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ContPlantaDetalleSliceRequests } from "app/Middleware/reducers/ContPlantaDetalleSlice";
import { ContDetalleContenedorSliceRequests } from "app/Middleware/reducers/ContDetalleContenedorSlice";
import { ContEstadoSliceRequests } from "app/Middleware/reducers/ContEstadoSlice";
import { ContUbicacionSliceRequests } from "app/Middleware/reducers/ContUbicacionSlice";
import { ContObservacionSliceRequests } from "app/Middleware/reducers/ContObservacionSlice";
import moment from "moment";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { ContPedidoSliceRequests } from "app/Middleware/reducers/ContPedidoSlice";
interface props {
  setOpenPopup: any;
  editStateContenedor?: IContContenedor | null;
  // getPrioridad?: any;
  refresh?: any;
  refresh2?: any;
  // estaEditandoContenedor: any;
}

export const PlanificacionForm = ({
  setOpenPopup,
  editStateContenedor,
  // getPrioridad,
  refresh,
  refresh2
}: props) => {
  console.log(editStateContenedor);
  // console.log(getPrioridad);

  const classes = MaterialButtons();
  interface initialState {
    contEmbarqueId: number;
    lpn: string;
    tipo: string;
    codigo: string;
    descripcion: string;
    cantidad: string;
    prioridad: number;
    contPlantaDetalleId: number;
    contDetalleContenedorId: number;
    contEstadoId: number;
    contUbicacionId: number;
    contObservacionId: number;
    fechaProgramado: string;
    fechaEntregado: string;
  }
  // const initialStateVar = {
  //   contEmbarqueId: 0,
  //   lpn: "",
  //   tipo: "",
  //   codigo: "",
  //   descripcion: "",
  //   cantidad: "",
  //   prioridad: getPrioridad + 1,
  //   contPlantaDetalleId: 0,
  //   contDetalleContenedorId: 0,
  //   contEstadoId: 0,
  //   contUbicacionId: 0,
  //   contObservacionId: 0,
  //   fechaProgramado: "",
  //   fechaEntregado: ""
  // };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: editStateContenedor
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
    return () => {
      //
    };
  }, [errors]);

  //Cargo los combobox con detales del Pedido
  useEffect(() => {
    getListContPlantaDetalle();
    getListContDetalleContenedor();
    getListContEstado();
    getListContUbicacion();
    getListContObservacion();
  }, []);

  const [listContPlantaDetalle, setListContPlantaDetalle] = useState([]);
  const getListContPlantaDetalle = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(ContPlantaDetalleSliceRequests.getAllRequest()));
      // if (!estaEditandoProgramar) { setValue("contPlantaDetalleId", result[0].id); }
      setListContPlantaDetalle(result);
    } catch (error) {
      openNotificationUI("Error al leer ContPlantaDetalle.", "error");
    }
  };

  const [listContDetalleContenedor, setListContDetalleContenedor] = useState([]);
  const getListContDetalleContenedor = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(ContDetalleContenedorSliceRequests.getAllRequest()));
      // if (!estaEditandoProgramar) { setValue("contDetalleContenedorId", result[0].id); }
      setListContDetalleContenedor(result);
    } catch (error) {
      openNotificationUI("Error al leer ContDetalleContenedor.", "error");
    }
  };

  const [listContEstado, setListContEstado] = useState([]);
  const getListContEstado = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(ContEstadoSliceRequests.getAllRequest()));
      // if (!estaEditandoProgramar) { setValue("contEstadoId", result[0].id); }
      setListContEstado(result);
    } catch (error) {
      openNotificationUI("Error al leer ContEstado.", "error");
    }
  };

  const [listContUbicacion, setListContUbicacion] = useState([]);
  const getListContUbicacion = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(ContUbicacionSliceRequests.getAllRequest()));
      // if (!estaEditandoProgramar) { setValue("contUbicacionId", result[0].id);}
      setListContUbicacion(result);
    } catch (error) {
      openNotificationUI("Error al leer ContUbicacion.", "error");
    }
  };
  const [listContObservacion, setListContObservacion] = useState([]);
  const getListContObservacion = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(ContObservacionSliceRequests.getAllRequest()));
      // if (!estaEditandoProgramar) { setValue("contObservacionId", result[0].id); }
      setListContObservacion(result);
    } catch (error) {
      openNotificationUI("Error al leer ContObservacion.", "error");
    }
  };
  const onChangeFechaE = (fecha: string) => {
    // console.log(moment(objectSubmit.fechaProgramado).format("YYYY-MM-DD"));
    setValue("fechaEntregado", fecha);
  };
  const onChangeFechaP = (fecha: string) => {
    setValue("fechaProgramado", fecha);
  };

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    console.log(e);
    //ContContenedor
    const objectSubmit = {
      ...e,
      contEmbarque: null,
      contEmbarqueId: editStateContenedor.contEmbarqueId ?? editStateContenedor.id,
      lpn: toUpper(e.lpn),
      tipo: toUpper(e.tipo),
      codigo: toUpper(e.codigo),
      descripcion: e.descripcion,
      cantidad: e.cantidad,
      prioridad: e.prioridad,
      contPlantaDetalle: null,
      contPlantaDetalleId: e.contPlantaDetalleId,
      contDetalleContenedor: null,
      contDetalleContenedorId: e.contDetalleContenedorId,
      contEstado: null,
      contEstadoId: e.contEstadoId,
      contUbicacion: null,
      contUbicacionId: e.contUbicacionId,
      contObservacion: null,
      contObservacionId: e.contObservacionId,
      fechaProgramado: moment(e.fechaProgramado).format("YYYY-MM-DD"),
      fechaEntregado:
        e.fechaProgramado > e.fechaEntregado
          ? moment(e.fechaProgramado).format("YYYY-MM-DD")
          : moment(e.fechaEntregado).format("YYYY-MM-DD")
    };
    console.log(objectSubmit);

    //ContPedido
    const objectSubmit2 = {
      contContenedor: null,
      contContenedorId: editStateContenedor.id,
      contPlantaDetalle: null,
      contPlantaDetalleId: editStateContenedor.contPlantaDetalleId,
      contDetalleContenedor: null,
      contDetalleContenedorId: editStateContenedor.contDetalleContenedorId,
      contEstado: null,
      contEstadoId: editStateContenedor.contEstadoId,
      contUbicacion: null,
      contUbicacionId: editStateContenedor.contUbicacionId,
      contObservacion: null,
      contObservacionId: editStateContenedor.contObservacionId,
      fechaProgramado: moment(editStateContenedor.fechaProgramado).format("YYYY-MM-DD"),
      fechaEntregado: moment(editStateContenedor.fechaEntregado).format("YYYY-MM-DD")
    };
    console.log(objectSubmit2);

    try {
      //Actualiza contenedor
      const result = unwrapResult(await dispatch(ContContenedorSliceRequests.PutRequest(objectSubmit)));
      //GuardaHistorial
      const result2 = unwrapResult(await dispatch(ContPedidoSliceRequests.PostRequest(objectSubmit2)));
      openNotificationUI("Guardado...", "success");
      refresh();
      refresh2();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="h-full mt-7 p-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div className=" flex-col grid grid-cols-2 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="contPlantaDetalleId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Detalle de Planta</InputLabel>
                    <Select
                      {...field}
                      placeholder="Detalle de Planta"
                      variant="standard"
                      // onClick={(e) => concatenarCodigo("maquina")}
                    >
                      {listContPlantaDetalle &&
                        listContPlantaDetalle.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.detalle}</div>
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
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="contDetalleContenedorId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Detalle de Contenedor</InputLabel>
                    <Select
                      {...field}
                      placeholder="Detalle de Contenedor"
                      variant="standard"
                      // onClick={(e) => concatenarCodigo("maquina")}
                    >
                      {listContDetalleContenedor &&
                        listContDetalleContenedor.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.detalle}</div>
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
          <div className=" flex-col grid grid-cols-3 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="contEstadoId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      {...field}
                      placeholder="Estado"
                      variant="standard"
                      // onClick={(e) => concatenarCodigo("maquina")}
                    >
                      {listContEstado &&
                        listContEstado.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.detalle}</div>
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
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="contUbicacionId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Ubicación</InputLabel>
                    <Select
                      {...field}
                      placeholder="Ubicación"
                      variant="standard"
                      // onClick={(e) => concatenarCodigo("maquina")}
                    >
                      {listContUbicacion &&
                        listContUbicacion.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.detalle}</div>
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
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="contObservacionId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Observación</InputLabel>
                    <Select
                      {...field}
                      placeholder="Observación"
                      variant="standard"
                      // onClick={(e) => concatenarCodigo("maquina")}
                    >
                      {listContObservacion &&
                        listContObservacion.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.observacion}</div>
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
          <div className=" flex-col grid grid-cols-2 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2 text-center" style={{ flex: "1 1 90%" }}>
              <h1>Fecha Programado</h1>
              <SelectOfDate pickFecha setFechaProps={onChangeFechaP} fechaEdit={editStateContenedor?.fechaProgramado} />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2 text-center" style={{ flex: "1 1 90%" }}>
              <h1>Fecha Entregado</h1>
              <SelectOfDate pickFecha setFechaProps={onChangeFechaE} fechaEdit={editStateContenedor?.fechaEntregado} />
            </div>
          </div>
        </div>

        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

// import React, { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
// import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
// import { useAppDispatch } from "app/Middleware/store/store";
// import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
// import { unwrapResult } from "@reduxjs/toolkit";
// import { ContPlantaDetalleSliceRequests } from "app/Middleware/reducers/ContPlantaDetalleSlice";
// import { ContDetalleContenedorSliceRequests } from "app/Middleware/reducers/ContDetalleContenedorSlice";
// import { ContEstadoSliceRequests } from "app/Middleware/reducers/ContEstadoSlice";
// import { ContUbicacionSliceRequests } from "app/Middleware/reducers/ContUbicacionSlice";
// import { ContObservacionSliceRequests } from "app/Middleware/reducers/ContObservacionSlice";
// import { IContPedido } from "app/models/IContPedido";
// import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
// import moment from "moment";
// import { ContPedidoSliceRequests } from "app/Middleware/reducers/ContPedidoSlice";
// interface props {
//   setOpenPopup: any;
//   editStateProgramar?: IContPedido | null;
//   refresh?: any;
//   refresh2?: any;
//   estaEditandoProgramar: any;
// }

// export const PlanificacionForm = ({setOpenPopup, editStateProgramar, refresh, refresh2, estaEditandoProgramar}: props) => {
//   console.log(editStateProgramar);
//   const classes = MaterialButtons();
//   interface initialState {
//     contContenedorId: number;
//     contPlantaDetalleId: number;
//     contDetalleContenedorId: number;
//     contEstadoId: number;
//     contUbicacionId: number;
//     contObservacionId: number;
//     fechaProgramado: string;
//     fechaEntregado: string;
//     // prioridad: number;
//   }
//   const initialStateVar = {
//     contContenedorId: editStateProgramar.contContenedorId,
//     contPlantaDetalleId: 0,
//     contDetalleContenedorId: 0,
//     contEstadoId: 0,
//     contUbicacionId: 0,
//     contObservacionId: 0,
//     fechaProgramado: "",
//     fechaEntregado: "",
//     // prioridad: 0
//   };
//   const dispatch = useAppDispatch();
//   const { openNotificationUI } = useNotificationUI();
//   const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
//     defaultValues: estaEditandoProgramar ? editStateProgramar : initialStateVar
//   });
//   // const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({ defaultValues: editStateProgramar });
//   const { isDirty, isValid, errors } = formState;
//   useEffect(() => {
//     console.log(errors);
//     return () => {
//       //
//     };
//   }, [errors]);

//   //Actualizo o Guardo
//   const loginSubmit = async (e) => {
//     console.log(e);
//     let result;
//     const objectSubmit = {
//       contContenedor: null,
//       contContenedorId: e.contContenedorId,
//       contPlantaDetalle: null,
//       contPlantaDetalleId: e.contPlantaDetalleId,
//       contDetalleContenedor: null,
//       contDetalleContenedorId: e.contDetalleContenedorId,
//       contEstado: null,
//       contEstadoId: e.contEstadoId,
//       contUbicacion: null,
//       contUbicacionId: e.contUbicacionId,
//       contObservacion: null,
//       contObservacionId: e.contObservacionId,
//       fechaProgramado: moment(e.fechaProgramado).format("YYYY-MM-DD"),
//       fechaEntregado: moment(e.fechaEntregado).format("YYYY-MM-DD"),
//       // prioridad: e.prioridad,
//     };
//     console.log(objectSubmit);

//     try {
//       result = unwrapResult(await dispatch(ContPedidoSliceRequests.PostRequest(objectSubmit)));
//       openNotificationUI("Guardado...", "success");
//       refresh();
//       refresh2();
//       setOpenPopup(false);
//     } catch (x) {
//       openNotificationUI("Error al guardar.", "error");
//       result = null;
//     }
//   };

//   //Cargo los combobox con detales del Pedido
//   useEffect(() => {
//     getListContPlantaDetalle();
//     getListContDetalleContenedor();
//     getListContEstado();
//     getListContUbicacion();
//     getListContObservacion();
//   }, []);

//   const [listContPlantaDetalle, setListContPlantaDetalle] = useState([]);
//   const getListContPlantaDetalle = async () => {
//     let result = [];
//     try {
//       result = unwrapResult(await dispatch(ContPlantaDetalleSliceRequests.getAllRequest()));
//       // if (!estaEditandoProgramar) { setValue("contPlantaDetalleId", result[0].id); }
//       setListContPlantaDetalle(result);
//     } catch (error) {
//       openNotificationUI("Error al leer ContPlantaDetalle.", "error");
//     }
//   };

//   const [listContDetalleContenedor, setListContDetalleContenedor] = useState([]);
//   const getListContDetalleContenedor = async () => {
//     let result = [];
//     try {
//       result = unwrapResult(await dispatch(ContDetalleContenedorSliceRequests.getAllRequest()));
//       // if (!estaEditandoProgramar) { setValue("contDetalleContenedorId", result[0].id); }
//       setListContDetalleContenedor(result);
//     } catch (error) {
//       openNotificationUI("Error al leer ContDetalleContenedor.", "error");
//     }
//   };

//   const [listContEstado, setListContEstado] = useState([]);
//   const getListContEstado = async () => {
//     let result = [];
//     try {
//       result = unwrapResult(await dispatch(ContEstadoSliceRequests.getAllRequest()));
//       // if (!estaEditandoProgramar) { setValue("contEstadoId", result[0].id); }
//       setListContEstado(result);
//     } catch (error) {
//       openNotificationUI("Error al leer ContEstado.", "error");
//     }
//   };

//   const [listContUbicacion, setListContUbicacion] = useState([]);
//   const getListContUbicacion = async () => {
//     let result = [];
//     try {
//       result = unwrapResult(await dispatch(ContUbicacionSliceRequests.getAllRequest()));
//       // if (!estaEditandoProgramar) { setValue("contUbicacionId", result[0].id);}
//       setListContUbicacion(result);
//     } catch (error) {
//       openNotificationUI("Error al leer ContUbicacion.", "error");
//     }
//   };
//   const [listContObservacion, setListContObservacion] = useState([]);
//   const getListContObservacion = async () => {
//     let result = [];
//     try {
//       result = unwrapResult(await dispatch(ContObservacionSliceRequests.getAllRequest()));
//       // if (!estaEditandoProgramar) { setValue("contObservacionId", result[0].id); }
//       setListContObservacion(result);
//     } catch (error) {
//       openNotificationUI("Error al leer ContObservacion.", "error");
//     }
//   };
//   const onChangeFechaE = (fecha:string) =>{
//     // console.log(moment(objectSubmit.fechaProgramado).format("YYYY-MM-DD"));
//     setValue("fechaEntregado", fecha);
//   }
//   const onChangeFechaP = (fecha:string) =>{
//     setValue("fechaProgramado", fecha);
//   }

//   return (
//     <div style={{ height: "100%", width: "60vw", position: "relative" }}>
//       <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
//       {/* <form onSubmit={handleSubmit((data) => loginSubmit(data, fechaProgramado, fechaEntregado))} style={{ width: "100%", height: "100%" }}> */}

//         <div className="h-full mt-7 p-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
//           <div className=" flex-col grid grid-cols-3 gap-30 " style={{ height: "100%" }}>
//             <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
//               <Controller
//                 name="contContenedorId"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormControl fullWidth variant="outlined" error={!!error}>
//                     <TextField fullWidth label="Id Contenedor" variant="standard" type="text" {...field} disabled={true}/>
//                     {!!error && <FormHelperText>{error.type}</FormHelperText>}
//                   </FormControl>
//                 )}
//               />
//             </div>
//             <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
//               <Controller
//                 name="contPlantaDetalleId"
//                 control={control}
//                 rules={{ required: true, min: 1 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormControl fullWidth variant="outlined" error={!!error}>
//                     <InputLabel>Detalle de Planta</InputLabel>
//                     <Select
//                       {...field}
//                       placeholder="Detalle de Planta"
//                       variant="standard"
//                       // onClick={(e) => concatenarCodigo("maquina")}
//                     >
//                       {listContPlantaDetalle &&
//                         listContPlantaDetalle.map((x) => (
//                           <MenuItem key={x.id} value={x.id}>
//                             <div className="w-full">
//                               <div>{x.detalle}</div>
//                             </div>
//                           </MenuItem>
//                         ))}
//                     </Select>
//                     {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
//                     {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
//                   </FormControl>
//                 )}
//               />
//             </div>
//             <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
//               <Controller
//                 name="contDetalleContenedorId"
//                 control={control}
//                 rules={{ required: true, min: 1 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormControl fullWidth variant="outlined" error={!!error}>
//                     <InputLabel>Detalle de Contenedor</InputLabel>
//                     <Select
//                       {...field}
//                       placeholder="Detalle de Contenedor"
//                       variant="standard"
//                       // onClick={(e) => concatenarCodigo("maquina")}
//                     >
//                       {listContDetalleContenedor &&
//                         listContDetalleContenedor.map((x) => (
//                           <MenuItem key={x.id} value={x.id}>
//                             <div className="w-full">
//                               <div>{x.detalle}</div>
//                             </div>
//                           </MenuItem>
//                         ))}
//                     </Select>
//                     {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
//                     {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
//                   </FormControl>
//                 )}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="h-full mt-7 p-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
//           <div className=" flex-col grid grid-cols-3 gap-30 " style={{ height: "100%" }}>
//             <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
//               <Controller
//                 name="contEstadoId"
//                 control={control}
//                 rules={{ required: true, min: 1 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormControl fullWidth variant="outlined" error={!!error}>
//                     <InputLabel>Estado</InputLabel>
//                     <Select
//                       {...field}
//                       placeholder="Estado"
//                       variant="standard"
//                       // onClick={(e) => concatenarCodigo("maquina")}
//                     >
//                       {listContEstado &&
//                         listContEstado.map((x) => (
//                           <MenuItem key={x.id} value={x.id}>
//                             <div className="w-full">
//                               <div>{x.detalle}</div>
//                             </div>
//                           </MenuItem>
//                         ))}
//                     </Select>
//                     {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
//                     {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
//                   </FormControl>
//                 )}
//               />
//             </div>
//             <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
//               <Controller
//                 name="contUbicacionId"
//                 control={control}
//                 rules={{ required: true, min: 1 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormControl fullWidth variant="outlined" error={!!error}>
//                     <InputLabel>Ubicación</InputLabel>
//                     <Select
//                       {...field}
//                       placeholder="Ubicación"
//                       variant="standard"
//                       // onClick={(e) => concatenarCodigo("maquina")}
//                     >
//                       {listContUbicacion &&
//                         listContUbicacion.map((x) => (
//                           <MenuItem key={x.id} value={x.id}>
//                             <div className="w-full">
//                               <div>{x.detalle}</div>
//                             </div>
//                           </MenuItem>
//                         ))}
//                     </Select>
//                     {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
//                     {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
//                   </FormControl>
//                 )}
//               />
//             </div>
//             <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
//               <Controller
//                 name="contObservacionId"
//                 control={control}
//                 rules={{ required: true, min: 1 }}
//                 render={({ field, fieldState: { error } }) => (
//                   <FormControl fullWidth variant="outlined" error={!!error}>
//                     <InputLabel>Observación</InputLabel>
//                     <Select
//                       {...field}
//                       placeholder="Observación"
//                       variant="standard"
//                       // onClick={(e) => concatenarCodigo("maquina")}
//                     >
//                       {listContObservacion &&
//                         listContObservacion.map((x) => (
//                           <MenuItem key={x.id} value={x.id}>
//                             <div className="w-full">
//                               <div>{x.observacion}</div>
//                             </div>
//                           </MenuItem>
//                         ))}
//                     </Select>
//                     {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
//                     {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
//                   </FormControl>
//                 )}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="h-full p-3 mt-7 rounded-lg shadow-elevation-4 bg-secondaryNew">
//           <div className=" flex-col grid grid-cols-2 gap-30 " style={{ height: "100%" }}>
//             <div className="py-2 gap-10 overflow-auto m-2 text-center" style={{ flex: "1 1 90%" }}>
//               <h1>Fecha Programado</h1>
//               <SelectOfDate pickFecha setFechaProps={onChangeFechaP} fechaEdit={editStateProgramar?.fechaProgramado}  />
//             </div>
//             <div className="py-2 gap-10 overflow-auto m-2 text-center" style={{ flex: "1 1 90%" }}>
//             <h1>Fecha Entregado</h1>
//             <SelectOfDate pickFecha setFechaProps={onChangeFechaE} fechaEdit={editStateProgramar?.fechaEntregado}  />
//             </div>
//           </div>
//         </div>
//         <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
//           <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
//             Guardar
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };
