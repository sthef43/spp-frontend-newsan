/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Select, MenuItem, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobHHerramentalSliceRequests } from "app/Middleware/reducers/DobHHerramentalSlice";
import { IDobHHistorial } from "app/models/IDobHHistorial";
import { DobHUbicacionSliceRequests } from "app/Middleware/reducers/DobHUbicacionSlice";
import { IAppUser } from "app/models";
import moment from "moment";
import { DobHHistorialSliceRequests } from "app/Middleware/reducers/DobHHistorialSlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { DobHMaquinaSliceRequests } from "app/Middleware/reducers/DobHMaquinaSlice";
interface props {
  setOpenPopup: any;
  editState?: IDobHHistorial | null;
  refresh?: any;
  estaEditando: any;
}

export const GestionHerramentalForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const classes = MaterialButtons();
  interface initialState {
    appUserId: number;
    dobHUbicacionId: number;
    dobHMaquinaId: number;
    dobHHerramentalId: number;
    diasDeUso: number;
  }
  const initialStateVar = {
    appUserId: 0,
    dobHUbicacionId: 0,
    dobHMaquinaId: 0,
    dobHHerramentalId: 0,
    diasDeUso: 0
  };
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Agrego o Modifico
  const loginSubmit = async (e) => {
    if (e.dobHMaquinaId == 0 && e.dobHUbicacionId == 0) {
      openNotificationUI("Debe seleccionar Ubicación o Máquina.", "error");
    } else {
      const resp = await getConfirmation(
        "Ubicación Herramental",
        "Esta seguro de cambiar la ubicación del herramental?"
      );
      if (resp) {
        //Calculo de dias en uso
        let diasDeUsoCalculado = parseInt(e.diasDeUso);
        if (editState && editState.dobHMaquinaId != null) {
          const valor = moment().diff(editState.lastModifiedDate, "days");
          diasDeUsoCalculado = diasDeUsoCalculado + valor;
        }
        const objectSubmit = {
          ...e,
          appUser: null,
          appUserId: infoUser.id,
          dobHUbicacion: null,
          dobHUbicacionId: e.dobHUbicacionId == 0 ? null : e.dobHUbicacionId,
          dobHMaquina: null,
          dobHMaquinaId: e.dobHMaquinaId == 0 ? null : e.dobHMaquinaId,
          dobHHerramental: null,
          diasDeUso: diasDeUsoCalculado
        };
        try {
          if (editState) {
            unwrapResult(await dispatch(DobHHistorialSliceRequests.PutRequest(objectSubmit)));
          } else {
            unwrapResult(await dispatch(DobHHistorialSliceRequests.PostRequest(objectSubmit)));
            setValue("dobHHerramentalId", 0);
          }
          refresh();
          openNotificationUI("Guardado", "success");
        } catch (x) {
          openNotificationUI("Error al guardar.", "error");
        }
      }
    }
  };

  //Genero Listas
  const [listDobHHerramental, setlistDobHHerramental] = useState([]);
  const getListDobHHerramental = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHHerramentalSliceRequests.getAllRequest()));
      if (editState) {
        //Filtro los que no estan en gestion asignada.
        result = result.filter((x) => x.id == editState.dobHHerramentalId);
      } else {
        //Filtro los que no estan en gestion asignada.
        result = result.filter((x) => x.dobHHistorial?.length == 0);
      }
      setlistDobHHerramental(result);
    } catch (error) {
      openNotificationUI("Error al leer herramental.", "error");
    }
  };
  const [listDobHUbicacion, setlistDobHUbicacion] = useState([]);
  const getListDobHUbicacion = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHUbicacionSliceRequests.getAllRequest()));
      setlistDobHUbicacion(result);
    } catch (error) {
      openNotificationUI("Error al leer ubicación.", "error");
    }
  };
  const [listDobHMaquina, setlistDobHMaquina] = useState([]);
  const getListDobHMaquina = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHMaquinaSliceRequests.getAllRequest()));
      setlistDobHMaquina(result);
    } catch (error) {
      openNotificationUI("Error al leer Máquina.", "error");
    }
  };

  //WATCH - Filtro por máquinas segun herramental
  const watchLinea = watch("dobHHerramentalId");
  const [listDobHMaquinaFilter, setListDobHMaquinaFilter] = useState([]);
  const getListDobHMaquinaFilter = () => {
    const found = listDobHHerramental.find((obj) => {
      return obj.id === watchLinea;
    });
    let found2 = null;
    if (found != null) {
      found2 = listDobHMaquina.filter((x) => x.dobHTipoMaquinaId === found.dobHTipoMaquinaId);
    }
    setListDobHMaquinaFilter(found2);
  };
  useEffect(() => {
    getListDobHMaquinaFilter();
  }, [watchLinea]);

  useEffect(() => {
    if (editState != null) {
      getListDobHMaquinaFilter();
    }
  }, [listDobHHerramental]);

  //WATCH - Cuando cambia Ubicacion seteo Maquina
  const watchUbicacion = watch("dobHUbicacionId");
  useEffect(() => {
    if (watchUbicacion != 0) {
      setValue("dobHMaquinaId", 0);
    }
  }, [watchUbicacion]);

  //WATCH - Cuando cambia Maquina seteo Ubicacion
  const watchMaquina = watch("dobHMaquinaId");
  useEffect(() => {
    if (watchMaquina != 0) {
      setValue("dobHUbicacionId", 0);
    }
  }, [watchMaquina]);

  //Refresco luego de un edit
  useEffect(() => {
    getListDobHUbicacion();
    getListDobHMaquina();
    getListDobHHerramental();
  }, [refresh]);

  //Cargo los comboBox con las Selecciones de Tablas
  useEffect(() => {
    getListDobHUbicacion();
    getListDobHMaquina();
    getListDobHHerramental();
  }, []);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="dobHHerramentalId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Herramental</InputLabel>
                    <Select {...field} placeholder="Seleccione Herramental" variant="standard">
                      {listDobHHerramental &&
                        listDobHHerramental.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.codigo}</div>
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
                name="dobHUbicacionId"
                control={control}
                rules={{ required: false }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Ubicación</InputLabel>
                    <Select {...field} placeholder="Seleccione Ubicación" variant="standard">
                      {listDobHUbicacion &&
                        listDobHUbicacion.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.codigo + " - " + x.descripcion}</div>
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
                name="dobHMaquinaId"
                control={control}
                rules={{ required: false }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Máquina</InputLabel>
                    <Select {...field} placeholder="Seleccione Máquina" variant="standard">
                      {listDobHMaquinaFilter &&
                        listDobHMaquinaFilter.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>
                                {x.numero + " - " + x.dobHTipoMaquina.codigo + " - " + x.dobHTipoMaquina.descripcion}
                              </div>
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
                name="diasDeUso"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Días de Uso"
                      variant="standard"
                      type="number"
                      disabled={true}
                      {...field}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
