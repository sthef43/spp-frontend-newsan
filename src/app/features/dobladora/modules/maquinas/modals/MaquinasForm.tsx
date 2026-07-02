/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Input, Select, MenuItem, Grid } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { IDobHMaquina } from "app/models/IDobHMaquina";
import { DobHTipoMaquinaSliceRequests } from "app/Middleware/reducers/DobHTipoMaquinaSlice";
import { DobHMaquinaSliceRequests } from "app/Middleware/reducers/DobHMaquinaSlice";
interface props {
  setOpenPopup: any;
  editState?: IDobHMaquina | null;
  refresh?: any;
  estaEditando: any;
}

export const MaquinasForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    numero: number;
    descripcion: string;
    dobHTipoMaquinaId: number;
  }
  const initialStateVar = {
    numero: 0,
    descripcion: "",
    dobHTipoMaquinaId: 0
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    let result;
    const objectSubmit = {
      ...e,
      dobHTipoMaquina: null
    };
    try {
      if (editState) {
        result = unwrapResult(await dispatch(DobHMaquinaSliceRequests.PutRequest(objectSubmit)));
      } else {
        result = unwrapResult(await dispatch(DobHMaquinaSliceRequests.PostRequest(objectSubmit)));
      }
      openNotificationUI("Guardado...", "success");
      refresh();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
      result = null;
    }
  };

  //Cargo lista con Tipos de Máquinas
  useEffect(() => {
    getListDobHTipoMaquina();
  }, []);

  const [listDobHTipoMaquina, setlistDobHTipoMaquina] = useState([]);
  const getListDobHTipoMaquina = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHTipoMaquinaSliceRequests.getAllRequest()));
      setlistDobHTipoMaquina(result);
    } catch (error) {
      openNotificationUI("Error al leer Tipo de Máquina.", "error");
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="dobHTipoMaquinaId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo de Máquina</InputLabel>
                    <Select {...field} placeholder="Seleccione un Tipo de Máquina" variant="standard">
                      {listDobHTipoMaquina &&
                        listDobHTipoMaquina.map((x) => (
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
          </div>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                  <Controller
                    name="numero"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Número</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={8}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                  <Controller
                    name="descripcion"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Descripción</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
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
        </div>
      </form>
    </div>
  );
};
