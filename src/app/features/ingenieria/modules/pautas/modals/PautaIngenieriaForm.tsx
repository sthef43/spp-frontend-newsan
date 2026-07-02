import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { IPautaIngenieria } from "app/models/IPautaIngenieria";
import { PautaIngenieriaSliceRequest } from "app/Middleware/reducers/PautaIngenieriaSlice";
interface props {
  setOpenPopup: any;
  editState?: IPautaIngenieria | null;
  refresh?: any;
  estaEditando: any;
  lineaProduccionFamiliaId: any;
  esPrimerRegistro: boolean;
}
export const PautaIngenieriaForm = ({
  setOpenPopup,
  editState,
  refresh,
  estaEditando,
  lineaProduccionFamiliaId,
  esPrimerRegistro
}: props) => {
  const classes = MaterialButtons();
  interface initialState {
    referencia: string;
    cantidad?: number;
    fecha?: Date;
    activado?: boolean;
    cantVersionProceso: number;
    cantGenerico: number;
    cantPlataforma: number;
    cantLinea: number;
    cantPuesto: number;
    lineaProduccionFamiliaId: number;
  }
  const initialStateVar = {
    referencia: "",
    cantidad: 0,
    fecha: moment().toDate(),
    activado: esPrimerRegistro,
    cantVersionProceso: 0,
    cantGenerico: 0,
    cantPlataforma: 0,
    cantLinea: 0,
    cantPuesto: 0,
    lineaProduccionFamiliaId: lineaProduccionFamiliaId
  };

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const fecha = watch("fecha");
  const { isDirty, isValid, errors } = formState;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const loginSubmit = async (e) => {
    let result;
    try {
      console.log("Datos a insertar " + JSON.stringify(e));
      if (editState) {
        result = await dispatch(PautaIngenieriaSliceRequest.PutRequest(JSON.parse(JSON.stringify(e))));
      } else {
        result = await dispatch(PautaIngenieriaSliceRequest.PostRequest(JSON.parse(JSON.stringify(e))));
      }
    } catch (x) {
      result = null;
    }
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      setOpenPopup(false);
      refresh();
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className=" flex-col grid grid-cols-2 gap-30 " style={{ height: "80%" }}>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="cantidad"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Cantidad"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="referencia"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Referencia"
                  variant="outlined"
                  multiline
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <div className="text-center sm:text-left p-2">
              <Controller
                name="fecha"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DesktopDatePicker
                    label="Fecha"
                    value={fecha}
                    inputFormat="DD/MM/yyyy"
                    onChange={(e: any) => {
                      setValue("fecha", e);
                    }}
                    renderInput={(field) => <TextField {...field} variant="standard" />}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className=" flex-col grid grid-cols-3 " style={{ height: "100%" }}>
          <div className="py-2 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="cantVersionProceso"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Version Proceso"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="py-2 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="cantGenerico"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Generico"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="py-2 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="cantPlataforma"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="PlataForma"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
        </div>
        <div className=" flex-col grid grid-cols-2 " style={{ height: "100%" }}>
          <div className="py-2 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="cantLinea"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Linea"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="py-2 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="cantPuesto"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Puesto"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
        </div>
        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
