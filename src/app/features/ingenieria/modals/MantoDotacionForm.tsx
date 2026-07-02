import React from "react";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotacionSliceRequests } from "app/Middleware/reducers/DotacionSlice";
import { Button, FormControl, FormHelperText, Grid, Input, InputLabel, TextField } from "@mui/material";

interface props {
  setOpenPopup: any;
  editState?: any | null; //Viene el editado o propiedades del nuevo
  refresh?: any;
  estaEditando: any;
}

export const MantoDotacionForm: React.FC<props> = ({ setOpenPopup, editState, refresh, estaEditando }) => {
  const classes = MaterialButtons();
  interface initialState {
    dotacionModeloId: number;
    proveedoresId: number;
    lineaProduccionId: number;
    potencia: number;
    mañana: number;
    tarde: number;
    noche: number;
    turnoMontaje: number;
    ritmoPauta: number;
    ritmoPlan: number;
    eficiencia: number;
  }
  const initialStateVar = {
    dotacionModeloId: 0,
    proveedoresId: 0,
    lineaProduccionId: 0,
    potencia: 0,
    mañana: 0,
    tarde: 0,
    noche: 0,
    turnoMontaje: 0,
    ritmoPauta: 0,
    ritmoPlan: 0,
    eficiencia: 0
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    // defaultValues: estaEditando ? editState : initialStateVar
    defaultValues: editState
  });
  const { isDirty, isValid, errors } = formState;
  // useEffect(() => {
  //   console.log(errors);
  // }, [errors]);

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    const object = {
      dotacionModeloId: editState.dotacionModeloId,
      proveedoresId: editState.proveedoresId,
      lineaProduccionId: editState.lineaProduccionId,
      potencia: editState.potencia,
      mañana: parseInt(e.mañana),
      tarde: parseInt(e.tarde),
      noche: parseInt(e.noche),
      turnoMontaje: parseInt(e.turnoMontaje),
      ritmoPauta: parseInt(e.ritmoPauta),
      ritmoPlan: parseInt(e.ritmoPlan),
      eficiencia: parseInt(e.eficiencia)
    };
    try {
      if (estaEditando) {
        const objectEdit = {
          ...object,
          id: editState.id,
          deleted: false,
          createdDate: editState.createdDate,
          lastModifiedDate: editState.lastModifiedDate
        };
        unwrapResult(await dispatch(DotacionSliceRequests.PutRequest(objectEdit)));
      } else {
        unwrapResult(await dispatch(DotacionSliceRequests.PostRequest(object)));
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
            <Grid item xs={4}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="mañana"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField fullWidth label="Cantidad Turno Mañana" variant="standard" type="number" {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="tarde"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField fullWidth label="Cantidad Turno Tarde" variant="standard" type="number" {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="noche"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField fullWidth label="Cantidad Turno Noche" variant="standard" type="number" {...field} />
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
                  name="turnoMontaje"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField fullWidth label="Turnos de Montaje" variant="standard" type="number" {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="ritmoPauta"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField fullWidth label="Ritmo de Pauta" variant="standard" type="number" {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="ritmoPlan"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField fullWidth label="Ritmo de Plan" variant="standard" type="number" {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="eficiencia"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Eficiencia</InputLabel>
                      <Input type="number" {...field} />
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
