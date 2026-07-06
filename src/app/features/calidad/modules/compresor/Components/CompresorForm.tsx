/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ICompresor } from "app/models/ICompresor";
import { CompresorSliceRequests } from "app/features/calidad/slices/CompresorSlice";
interface props {
  setOpenPopup: any;
  editState?: ICompresor | null;
  refresh?: any;
  estaEditando: any;
}
export const CompresorForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const initialStateVar = {
    compresor: "",
    descripcion: "",
    referencia: ""
  };

  const { control, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;

  interface initialState {
    compresor: string;
    descripcion: string;
    referencia: string;
  }

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const submit = async (e) => {
    let result;
    try {
      if (editState) {
        result = await dispatch(CompresorSliceRequests.Update(JSON.parse(JSON.stringify(e))));
      } else {
        result = await dispatch(CompresorSliceRequests.Create(JSON.parse(JSON.stringify(e))));
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
      <form onSubmit={handleSubmit(submit)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="compresor"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Compresor"
                  label="Compresor"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="descripcion"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Descripcion"
                  label="Descripcion"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="referencia"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Referencia"
                  label="Referencia"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
