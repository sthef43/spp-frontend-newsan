import React, { useEffect } from "react";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobMaestroPiezaliceRequests } from "app/Middleware/reducers/DobMaestroPiezaSlice";
import { Button, FormControl, FormHelperText, Grid, Input, InputLabel } from "@mui/material";

interface props {
  setOpenPopup: any;
  editState?: any | null;
  refresh?: any;
  estaEditando: any;
}

export const MaestroPiezaForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  //   console.log(editState);
  const classes = MaterialButtons();
  interface initialState {
    articulo: string;
    generico: string;
    descripcion: string;
    tipo: string;
    codigoMP: string;
    dimension: string;
    consumo: string;
    proveedor: string;
  }
  const initialStateVar = {
    articulo: "",
    generico: "",
    descripcion: "",
    tipo: "",
    codigoMP: "",
    dimension: "Ø 0,0 x 0,0",
    consumo: "0,0",
    proveedor: ""
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
    try {
      if (editState) {
        unwrapResult(await dispatch(DobMaestroPiezaliceRequests.PutRequest(e)));
      } else {
        unwrapResult(await dispatch(DobMaestroPiezaliceRequests.PostRequest(e)));
      }
      openNotificationUI("Guardado...", "success");
      setOpenPopup(false);
      refresh();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="p-5">
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="articulo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Artículo</InputLabel>
                      <Input {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="generico"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Genérico</InputLabel>
                      <Input {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
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
            </Grid>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="tipo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Tipo</InputLabel>
                      <Input {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
          </Grid>
        </div>
        <div className="p-5">
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="codigoMP"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Materia Prima</InputLabel>
                      <Input {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="dimension"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Dimensión</InputLabel>
                      <Input {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="consumo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Consumo</InputLabel>
                      <Input {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="proveedor"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Proveedor</InputLabel>
                      <Input {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
          </Grid>
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
