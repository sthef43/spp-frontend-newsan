import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobHHistorialSliceRequests } from "app/Middleware/reducers/DobHHistorialSlice";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Switch,
  TextField,
  Tooltip
} from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { DobHMaquinaSliceRequests } from "app/Middleware/reducers/DobHMaquinaSlice";
import { DobHUbicacionSliceRequests } from "app/Middleware/reducers/DobHUbicacionSlice";
import { isEmpty, isObject } from "lodash";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import moment from "moment";
interface props {
  setOpenPopup: any;
  refresh?: any;
}

export const MovimientosMasivosForm = ({ setOpenPopup, refresh }: props): JSX.Element => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const classes = MaterialButtons();
  interface initialState {
    id: number;
    appUserId: number;
    dobHUbicacionId: number;
    dobHUbicacionIdDestino: number;
    dobHMaquinaId: number;
    dobHMaquinaIdDestino: number;
    dobHHerramentalId: number;
    diasDeUso: number;
    origen: number;
    destino: number;
  }
  const initialStateVar = {
    id: 0,
    appUserId: 0,
    dobHUbicacionId: 0,
    dobHUbicacionIdDestino: 0,
    dobHMaquinaId: 0,
    dobHMaquinaIdDestino: 0,
    dobHHerramentalId: 0,
    diasDeUso: 0,
    origen: 0,
    destino: 0
  };
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid } = formState;

  //Genero Listas por ID Origen
  const watchOrigenId = watch("origen");
  const [listOrigenId, setListOrigenId] = useState([]);
  const getListOrigenId = async () => {
    if (checkedOrigenNombre == "Maquina") {
      console.log("Ingreso Maquina");
      console.log("Id Maquina a buscar: " + watchOrigenId);
      try {
        const responses = unwrapResult(
          await dispatch(DobHHistorialSliceRequests.getListByDobHMaquinaIdRequest(watchOrigenId))
        );
        console.log(responses);
        setListOrigenId(responses);
      } catch (error) {
        openNotificationUI("Error al leer maquinaId en Historial.", "error");
      }
    } else {
      console.log("Ingreso Ubicacion");
      console.log("Id Ubicacion a buscar: " + watchOrigenId);

      try {
        const responses = unwrapResult(
          await dispatch(DobHHistorialSliceRequests.getListByDobHUbicacionIdRequest(watchOrigenId))
        );
        setListOrigenId(responses);
      } catch (error) {
        openNotificationUI("Error al leer ubicacionesId en Historial.", "error");
      }
    }
  };
  useEffect(() => {
    getListOrigenId();
  }, [watchOrigenId]);
  useEffect(() => {
    console.log(listOrigenId);
  }, [listOrigenId]);

  //Quitar de la lista
  const quitarOrigen = async (id) => {
    console.log("Quitar de la lista ID: " + id);
    let found = null;
    found = listOrigenId.filter((x) => x.id != id);
    console.log(found);
    setListOrigenId(found);
  };

  //Genero Listas por ID Destino
  const watchDestinoId = watch("destino");
  const [listDestinoId, setListDestinoId] = useState([]);
  const getListDestinoId = async () => {
    if (checkedDestinoNombre == "Maquina") {
      try {
        const responses = unwrapResult(await dispatch(DobHMaquinaSliceRequests.getByIdRequest(watchDestinoId)));
        const arreglo = [];
        if (!isEmpty(responses)) {
          arreglo.push(responses);
        }
        setListDestinoId(arreglo);
      } catch (error) {
        openNotificationUI("Error al leer Máquina Id.", "error");
      }
    } else {
      try {
        const responses = unwrapResult(await dispatch(DobHUbicacionSliceRequests.getByIdRequest(watchDestinoId)));
        const arreglo = [];
        if (!isEmpty(responses)) {
          arreglo.push(responses);
        }
        setListDestinoId(arreglo);
      } catch (error) {
        openNotificationUI("Error al leer ubicacionesId.", "error");
      }
    }
  };
  useEffect(() => {
    getListDestinoId();
  }, [watchDestinoId]);
  useEffect(() => {
    console.log(listDestinoId);
  }, [listDestinoId]);

  //Agrego o Modifico
  const loginSubmit = async (e) => {
    let result;
    if (isEmpty(listOrigenId) || isEmpty(listDestinoId)) {
      openNotificationUI("Fata ingresar origen/destino.", "error");
    } else {
      //No estan vacias las cajas
      const resp = await getConfirmation(
        "Ubicación Herramental",
        "Esta seguro de cambiar la ubicación del/los herramental/es?"
      );
      if (!isObject(resp)) {
        if (resp) {
          let objectSubmit = [];
          let actualizo = true;
          if (checkedDestino) {
            //Es destino maquina comparo TM
            if (listOrigenId[0].dobHHerramental.dobHTipoMaquinaId == listDestinoId[0].dobHTipoMaquinaId) {
              // openNotificationUI("Va a una Máquina", "success");
              const idMaquina = listDestinoId[0].id;
              if (checkedOrigen) {
                console.log("Viene de una máquina, calculo dias de uso");
                objectSubmit = listOrigenId.map((elem) => {
                  const valor = moment().diff(elem.lastModifiedDate, "days");
                  const diasDeUsoCalculado = valor + elem.diasDeUso;
                  return {
                    ...elem,
                    appUserId: infoUser.id,
                    appUser: null,
                    dobHUbicacion: null,
                    dobHUbicacionId: null,
                    dobHMaquina: null,
                    dobHMaquinaId: idMaquina,
                    dobHHerramental: null,
                    diasDeUso: diasDeUsoCalculado
                  };
                });
              } else {
                objectSubmit = listOrigenId.map((elem) => {
                  return {
                    ...elem,
                    appUserId: infoUser.id,
                    appUser: null,
                    dobHUbicacion: null,
                    dobHUbicacionId: null,
                    dobHMaquina: null,
                    dobHMaquinaId: idMaquina,
                    dobHHerramental: null
                  };
                });
              }
              console.log(objectSubmit);
            } else {
              openNotificationUI("El herramental no corresponde a la máquina", "error");
              actualizo = false;
            }
          } else {
            //Es destino ubicación
            const idUbicacion = listDestinoId[0].id;
            if (checkedOrigen) {
              // console.log("Viene de una máquina, calculo dias de uso");
              objectSubmit = listOrigenId.map((elem) => {
                const valor = moment().diff(elem.lastModifiedDate, "days");
                const diasDeUsoCalculado = valor + elem.diasDeUso;
                return {
                  ...elem,
                  appUserId: infoUser.id,
                  appUser: null,
                  dobHUbicacion: null,
                  dobHUbicacionId: idUbicacion,
                  dobHMaquina: null,
                  dobHMaquinaId: null,
                  dobHHerramental: null,
                  diasDeUso: diasDeUsoCalculado
                };
              });
            } else {
              objectSubmit = listOrigenId.map((elem) => {
                return {
                  ...elem,
                  appUserId: infoUser.id,
                  appUser: null,
                  dobHUbicacion: null,
                  dobHUbicacionId: idUbicacion,
                  dobHMaquina: null,
                  dobHMaquinaId: null,
                  dobHHerramental: null
                };
              });
            }
            console.log(objectSubmit);
          }

          if (actualizo) {
            console.log("actualizo");
            try {
              result = unwrapResult(await dispatch(DobHHistorialSliceRequests.multiPutRequest(objectSubmit)));
              refresh();
              setValue("origen", 0);
              setValue("destino", 0);
              openNotificationUI("Actualización finalizada.", "success");
            } catch (x) {
              openNotificationUI("Error al guardar.", "error");
              result = null;
            }
          }
        }
      }
    }
  };

  //SWITCH Origen
  const [checkedOrigen, setCheckedOrigen] = useState(true);
  const [checkedOrigenNombre, setCheckedOrigenNombre] = useState("Maquina");
  const handleChangeOrigen = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedOrigen(event.target.checked);
    event.target.checked ? setCheckedOrigenNombre("Maquina") : setCheckedOrigenNombre("Ubicación");
    setValue("origen", 0);
  };

  //SWITCH Destino
  const [checkedDestino, setCheckedDestino] = useState(true);
  const [checkedDestinoNombre, setCheckedDestinoNombre] = useState("Maquina");
  const handleChangeDestino = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedDestino(event.target.checked);
    event.target.checked ? setCheckedDestinoNombre("Maquina") : setCheckedDestinoNombre("Ubicación");
    setValue("destino", 0);
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <div className="p-5 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
              <div className="mt-2">
                <FormControlLabel
                  control={
                    <Switch
                      checked={checkedOrigen}
                      onChange={handleChangeOrigen}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label={checkedOrigenNombre}
                />
              </div>
              {/* <div className="sm:flex md:flex items-center justify-around w-full font-semibold"> */}
              {/* <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 50%" }}> */}
              <div className="mt-2">
                <Controller
                  name="origen"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField
                        fullWidth
                        label="Origen"
                        variant="standard"
                        type="number"
                        {...field}
                        // onChange={(e) => {
                        //   field.onChange(e.target.value);
                        //   concatenarCodigo("n1SubEnsamble");
                        // }}
                      />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
              {/* </div> */}

              <div className="mt-2">
                <TableComponent
                  Dense={true}
                  Overflow={false}
                  // buscar={true}
                  IDcolumn={"id"}
                  columns={[
                    {
                      title: "Id",
                      // field: "dobHHerramental.id"
                      field: "id"
                    },
                    {
                      title: "Código",
                      field: "dobHHerramental.codigo"
                    },
                    {
                      title: "TM",
                      field: "dobHHerramental.dobHTipoMaquinaId"
                    },
                    {
                      title: "Acciones",
                      field: "",
                      render: (row) => {
                        return (
                          <div className="flex w-full justify-end sm:justify-start gap-4">
                            <div>
                              <Tooltip title="Quitar">
                                <IconButton
                                  onClick={() => {
                                    quitarOrigen(row.id);
                                  }}
                                  size="small"
                                  style={{ position: "relative" }}>
                                  <RemoveCircle color="warning" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        );
                      }
                    }
                  ]}
                  dataInfo={listOrigenId}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="p-5 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
              <div className="mt-2">
                <FormControlLabel
                  control={
                    <Switch
                      checked={checkedDestino}
                      onChange={handleChangeDestino}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label={checkedDestinoNombre}
                />
              </div>

              <div className="mt-2">
                <Controller
                  name="destino"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField
                        fullWidth
                        label="Destino"
                        variant="standard"
                        type="number"
                        inputProps={{ maxLength: 2 }}
                        {...field}
                        // onChange={(e) => {
                        //   field.onChange(e.target.value);
                        //   concatenarCodigo("n2SubEnsamble");
                        // }}
                      />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>

              <div className="mt-2">
                <TableComponent
                  Dense={true}
                  Overflow={false}
                  // buscar={true}
                  IDcolumn={"id"}
                  columns={[
                    {
                      title: "Id",
                      // field: "dobHHerramental.id"
                      field: "id"
                    },
                    {
                      title: "Ubicación",
                      field: "codigo"
                    },
                    {
                      title: "Número Máquina",
                      field: "numero"
                    },
                    {
                      title: "TM",
                      field: "dobHTipoMaquinaId"
                    }
                  ]}
                  dataInfo={listDestinoId}
                />
              </div>
            </div>
          </Grid>
        </Grid>

        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

// useEffect(() => {
//   console.log(listDobHMaquina);
// }, [listDobHMaquina]);

// useEffect(() => {
//   console.log(listDobHUbicacion);
// }, [listDobHUbicacion]);

{
  /* <div className="p-5 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
              <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
                <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
                  <Controller
                    name="dobHUbicacionIdDestino"
                    control={control}
                    rules={{ required: false }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <TextField
                          fullWidth
                          label="Ubicación Destino"
                          variant="standard"
                          type="number"
                          {...field}
                          // onChange={(e) => {
                          //   field.onChange(e.target.value);
                          //   concatenarCodigo("n1SubEnsamble");
                          // }}
                        />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>

                <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
                  <Controller
                    name="dobHMaquinaIdDestino"
                    control={control}
                    rules={{ required: false }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <TextField
                          fullWidth
                          label="Máquina Destino"
                          variant="standard"
                          type="number"
                          {...field}
                          // onChange={(e) => {
                          //   field.onChange(e.target.value);
                          //   concatenarCodigo("n1SubEnsamble");
                          // }}
                        />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div> */
}

// {/* <Box sx={{ flexGrow: 1 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={3}></Grid>
//             <Grid item xs={6}>
//               <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew align-middle">
//                 <div className="m-2">
//                   <Controller
//                     name="seleccion"
//                     control={control}
//                     rules={{ required: false }}
//                     render={({ field, fieldState: { error } }) => (
//                       <Button
//                         disabled={!esVisible}
//                         variant="outlined"
//                         color="success"
//                         size="large"
//                         style={{ position: "static", width: "100%" }}
//                         onClick={() => {
//                           getEsVisible();
//                         }}>
//                         <OutputRounded />
//                         <SyncAltTwoTone />
//                         <Settings />
//                         {!!error && <FormHelperText>{error.type}</FormHelperText>}
//                       </Button>
//                     )}
//                   />
//                 </div>
//                 {/* </div> */}
//                 {/* <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew align-middle"> */}
//                 <div className="m-2">
//                   <Controller
//                     name="seleccion2"
//                     control={control}
//                     rules={{ required: false }}
//                     render={({ field, fieldState: { error } }) => (
//                       <Button
//                         disabled={esVisible}
//                         variant="outlined"
//                         color="success"
//                         size="large"
//                         style={{ position: "static", width: "100%" }}
//                         onClick={() => {
//                           getEsVisible();
//                         }}>
//                         <Settings />
//                         <SyncAltTwoTone />
//                         <OutputRounded />
//                         {!!error && <FormHelperText>{error.type}</FormHelperText>}
//                       </Button>
//                     )}
//                   />
//                 </div>
//               </div>
//             </Grid>
//             <Grid item xs={3}></Grid>
//           </Grid>
//         </Box> */}

//           <Grid container spacing={1}>
//             <Grid item xs={6}></Grid>
//             <Grid item xs={6}></Grid>
//           </Grid>
//         </Box> */}
// const watchUbicacion = watch("dobHUbicacionId");

//Genero Listas para movimiento
// const watchUbicacion = watch("dobHUbicacionId");
// const [listDobHUbicacion, setlistDobHUbicacion] = useState([]);
// const getListDobHUbicacion = async () => {
//   console.log(watchUbicacion);
//   let result = [];
//   try {
//     result = unwrapResult(await dispatch(DobHUbicacionSliceRequests.getAllRequest()));
//     setlistDobHUbicacion(result);
//   } catch (error) {
//     openNotificationUI("Error al leer ubicación.", "error");
//   }
// };
// useEffect(() => {
//   getListDobHUbicacion();
// }, [watchUbicacion]);

// const [listDobHMaquina, setlistDobHMaquina] = useState([]);
// const getListDobHMaquina = async () => {
//   let result = [];
//   try {
//     result = unwrapResult(await dispatch(DobHMaquinaSliceRequests.getAllRequest()));
//     setlistDobHMaquina(result);
//   } catch (error) {
//     openNotificationUI("Error al leer Máquina.", "error");
//   }
// };
//Fin Listas
