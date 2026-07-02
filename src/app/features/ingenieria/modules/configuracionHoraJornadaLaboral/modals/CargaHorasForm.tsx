import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IHora } from "app/models/IHora";
import { HoraSliceRequests } from "app/Middleware/reducers/HoraSlice";
interface props {
  setOpenPopup: any;
  editState?: IHora | null;
  refresh?: any;
  estaEditando: any;
}
export const CargaHorasform = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    idHora: number;
    desdeHora: string;
    hastaHora: string;
    turno: string;
    minutos: number;
  }
  const initialStateVar = {
    idHora: 0,
    desdeHora: "",
    hastaHora: "",
    turno: "",
    minutos: 0
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const { control, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });

  const { isDirty, isValid, errors } = formState;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const loginSubmit = async (e) => {
    let result;
    try {
      if (editState) {
        result = await dispatch(HoraSliceRequests.putRequest(JSON.parse(JSON.stringify(e))));
      } else {
        result = await dispatch(HoraSliceRequests.postRequest(JSON.parse(JSON.stringify(e))));
      }
    } catch (x) {
      result = null;
    }
    if (result) {
      openNotificationUI("Guardado exitosamente ", "success");
      setOpenPopup(false);
      refresh();
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-2 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="desdeHora"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Desde"
                  label="Desde hh:mm:ss"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name="hastaHora"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Hasta"
                  label="Hasta hh:mm:ss"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name="turno"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Turno "
                  label="Turno"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name="minutos"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Minutos "
                  label="Minutos"
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
          <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
