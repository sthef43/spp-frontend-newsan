/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Input,
  TextField
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { IExtintor } from "app/models/IExtintor";
import { IAppUser, IPlant } from "app/models";
import { IExtintorAgente } from "app/models/IExtintorAgente";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { ExtintorAgenteSliceRequests } from "app/Middleware/reducers/ExtintorAgenteSlice";
import { IExtintorSitio } from "app/models/IExtintorSitio";
import { ExtintorSitioSliceRequests } from "app/Middleware/reducers/ExtintorSitioSlice";
import { IExtintorProceso } from "app/models/IExtintorProceso";
import { ExtintorProcesoSliceRequests } from "app/Middleware/reducers/ExtintorProcesoSlice";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import moment from "moment";
import { ExtintorSliceRequests } from "app/Middleware/reducers/ExtintorSlice";
interface props {
  setOpenPopup: any;
  editState?: IExtintor | null;
  refresh?: any;
  estaEditando: any;
}

export const ExtintorForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  // console.log(editState);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const classes = MaterialButtons();
  interface initialState {
    plantId: number;
    extintorSitioId: number;
    extintorProcesoId: number;
    extintorAgenteId: number;
    appUserId?: number;
    capacidad: number;
    numeroCilindro: number;
    ubicacion: string;
    fechaVencimiento: string;
    fechaVencimientoPH: string;
    presion: boolean;
    seguro: boolean;
    cilindro: boolean;
    manometro: boolean;
    manguera: boolean;
    señalizacion: boolean;
    observacion: string;
  }
  const initialStateVar = {
    plantId: 0,
    extintorSitioId: 0,
    extintorProcesoId: 0,
    extintorAgenteId: 0,
    appUserId: 0,
    capacidad: 0,
    numeroCilindro: 0,
    ubicacion: "",
    fechaVencimiento: "",
    fechaVencimientoPH: "",
    presion: false,
    seguro: false,
    cilindro: false,
    manometro: false,
    manguera: false,
    señalizacion: false,
    observacion: ""
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;

  //Watch
  const watchPlanta = watch("plantId");

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

  //Leer con filtro Planta
  const [listSitios, setListSitios] = useState<IExtintorSitio[] | null>(null);
  const getSitios = async (planta) => {
    try {
      const responses = unwrapResult(await dispatch(ExtintorSitioSliceRequests.getListByPlantRequest(planta)));
      setListSitios(responses);
    } catch (error) {
      openNotificationUI("Error al leer sitios.", "error");
    }
  };
  const [listProcesos, setListProcesos] = useState<IExtintorProceso[] | null>(null);
  const getProcesos = async (planta) => {
    try {
      const responses = unwrapResult(await dispatch(ExtintorProcesoSliceRequests.getListByPlantRequest(planta)));
      setListProcesos(responses);
    } catch (error) {
      openNotificationUI("Error al leer procesos.", "error");
    }
  };

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    //El extintor no existe en la BD entonces lo doy de alta
    delete e.plant;
    delete e.extintorSitio;
    delete e.extintorProceso;
    delete e.extintorAgente;
    delete e.appUser;
    const objectSubmit = {
      ...e,
      appUserId: infoUser.id,
      presion: checkedItems["presion"],
      seguro: checkedItems["seguro"],
      cilindro: checkedItems["cilindro"],
      manometro: checkedItemsExt["manometro"],
      manguera: checkedItemsExt["manguera"],
      señalizacion: checkedItemsExt["señalizacion"],
      fechaVencimiento: moment(e.fechaVencimiento).format("YYYY-MM-DD"),
      fechaVencimientoPH: moment(e.fechaVencimientoPH).format("YYYY-MM-DD")
    };

    try {
      if (estaEditando) {
        unwrapResult(await dispatch(ExtintorSliceRequests.PutRequest(objectSubmit)));
      } else {
        const unico = unwrapResult(await dispatch(ExtintorSliceRequests.getByNumeroCilindroRequest(e.numeroCilindro)));
        if (unico.length == 0) {
          unwrapResult(await dispatch(ExtintorSliceRequests.PostRequest(objectSubmit)));
        } else {
          openNotificationUI("Extintor existente! en " + unico[0].plant.name, "error");
          return;
        }
      }
      openNotificationUI("Guardado...", "success");
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  //Cargo listas
  useEffect(() => {
    getPlantas();
    getAgentes();
    if (estaEditando) {
      getSitios(editState.plantId);
      getProcesos(editState.plantId);
    }
  }, []);

  useEffect(() => {
    if (listPlantas) {
      getSitios(watchPlanta);
      getProcesos(watchPlanta);
    }
  }, [watchPlanta]);

  //CHECKBOXES
  //Almacenar el valor de los checkboxes
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    presion: editState ? editState.presion : false,
    seguro: editState ? editState.seguro : false,
    cilindro: editState ? editState.cilindro : false
  });
  const [checkedItemsExt, setCheckedItemsExt] = useState<{ [keyExt: string]: boolean }>({
    manometro: editState ? editState.manometro : false,
    manguera: editState ? editState.manguera : false,
    señalizacion: editState ? editState.señalizacion : false
  });

  // Manejo de cambios de cualquier checkbox
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked
    });
  };
  const handleChangeExt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedItemsExt({
      ...checkedItemsExt,
      [event.target.name]: event.target.checked
    });
  };

  //Fechas
  const onChangeFechaVencimiento = (fecha: string) => {
    setValue("fechaVencimiento", fecha);
  };
  const onChangeFechaVencimientoPH = (fecha: string) => {
    setValue("fechaVencimientoPH", fecha);
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="p-2 shadow-elevation-4 bg-secondaryNew rounded-lg m-2" style={{ height: "100%" }}>
          <div className="flex-col grid grid-cols-2 text-center bg-secondaryNew m-2" style={{ height: "100%" }}>
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="plantId"
                control={control}
                rules={{ required: true, min: 1 }}
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
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="extintorSitioId"
                control={control}
                rules={{ required: true, min: 1 }}
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
          </div>
          <div className="flex-col grid grid-cols-2 text-center bg-secondaryNew m-2" style={{ height: "100%" }}>
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="extintorProcesoId"
                control={control}
                rules={{ required: true, min: 1 }}
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
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="extintorAgenteId"
                control={control}
                rules={{ required: true, min: 1 }}
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
        </div>
        <div className="p-2 bg-secondaryNew rounded-lg m-2" style={{ height: "100%" }}>
          <div className="flex-col grid grid-cols-3 text-center bg-secondaryNew m-2" style={{ height: "100%" }}>
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="capacidad"
                control={control}
                rules={{ required: true, min: 0.1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField fullWidth label="Capacidad" variant="standard" type="number" {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="numeroCilindro"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField fullWidth label="Número de Cilindro" variant="standard" type="number" {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="ubicacion"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Ubicación</InputLabel>
                    <Input {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex-col grid grid-cols-2 text-center bg-secondaryNew m-2" style={{ height: "100%" }}>
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <SelectOfDate
                pickFecha
                setFechaProps={onChangeFechaVencimiento}
                fechaEdit={editState?.fechaVencimiento}
              />
              Fecha Vencimiento
            </div>
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <SelectOfDate
                pickFecha
                setFechaProps={onChangeFechaVencimientoPH}
                fechaEdit={editState?.fechaVencimientoPH}
              />
              Fecha Vencimiento PH
            </div>
          </div>
        </div>
        <div
          className="flex-col grid grid-cols-2 gap-30 shadow-elevation-4 text-center bg-secondaryNew rounded-lg m-2"
          style={{ height: "100%" }}>
          <div className="p-5 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
            {Object.keys(checkedItems).map((key) => (
              <FormControlLabel
                key={key}
                control={<Checkbox checked={checkedItems[key]} onChange={handleChange} name={key} />}
                label={key}
              />
            ))}
          </div>
          <div className="p-5 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
            {Object.keys(checkedItemsExt).map((keyExt) => (
              <FormControlLabel
                key={keyExt}
                control={<Checkbox checked={checkedItemsExt[keyExt]} onChange={handleChangeExt} name={keyExt} />}
                label={keyExt}
              />
            ))}
          </div>
        </div>
        <div
          className="flex-col grid grid-cols-1 gap-30 shadow-elevation-4 text-center bg-secondaryNew rounded-lg m-2"
          style={{ height: "100%" }}>
          <div className="p-5 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
            <Controller
              name="observacion"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Observación</InputLabel>
                  <Input {...field} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className="p-5 text-center gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
