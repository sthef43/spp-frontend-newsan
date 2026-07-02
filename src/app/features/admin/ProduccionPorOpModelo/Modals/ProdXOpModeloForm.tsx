/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Input, Grid } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IInicio } from "app/models";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";

interface initialState {
  idInicio?: number | null;
  fecha?: string | null;
  turno?: string | null;
  idProduccion?: number | null;
  tipoUnidad?: string | null;
  codigoTrazabilidad?: string | null;
  codigoNewsan?: string | null;
  fechaFin?: string | null;
  nombreInicio?: string | null;
  nombreFin?: string | null;
  turnoFin?: string | null;
  hora?: string | null;
  horaFin?: string | null;
  observaciones?: string | null;
  compresor?: string | null;
  codigoNewsan2?: string | null;
  idModelo?: number | null;
  montado?: number | null;
  fechaMontado?: string | null;
  horaMontado?: Date | null;
  modeloFin?: string | null;
  nroOp?: string | null;
  organizacion?: string | null;
  lote?: string | null;
  target?: number | null;
  nroLpn?: string | null;
  codigoEvaporador?: string | null;
  idProveedor?: number | null;
  desde?: number | null;
  hasta?: number | null;
  producido?: number | null;
  rechazados?: number | null;
}

interface props {
  setOpenPopup?: (newValue: boolean) => void;
  editState?: IInicio | null;
  refresh?: () => void;
}

export const ProdXOPModeloForm = ({ setOpenPopup, editState, refresh }: props) => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: editState
  });

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    try {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const result = unwrapResult(await dispatch(InicioSliceRequests.putRequest(e)));
      openNotificationUI("Guardado...", "success");
      setOpenPopup(false);
      refresh();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  //Guardar el valor de las fechas
  const onChangeFecha = (fecha: string) => {
    setValue("fecha", fecha);
  };
  const onChangeFechaFin = (fecha: string) => {
    setValue("fechaFin", fecha);
  };

  return (
    <div style={{ height: "100%", width: "30vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "60%" }}>
        <Grid container>
          <Grid item xs={6}>
            <div className=" flex-col gap-30 " style={{ height: "100%" }}>
              <div className="p-5 m-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                <Controller
                  name="codigoTrazabilidad"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Código de Trazabilidad</InputLabel>
                      <Input {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className=" flex-col gap-30 " style={{ height: "100%" }}>
              <div className="p-5 m-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                <Controller
                  name="codigoNewsan"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Código de Newsan</InputLabel>
                      <Input {...field} />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <div className="p-5 m-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                  <InputLabel>Fecha</InputLabel>
                  <SelectOfDate pickFecha setFechaProps={onChangeFecha} fechaEdit={editState?.fecha} />
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <div className="p-5 m-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                  <InputLabel>Fecha Fin</InputLabel>
                  <SelectOfDate pickFecha setFechaProps={onChangeFechaFin} fechaEdit={editState?.fechaFin} />
                </div>
              </div>
            </Grid>
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
