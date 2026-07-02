/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Input } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { IMarca } from "app/models/IMarca";
import { MarcaSliceRequests } from "app/Middleware/reducers/MarcaSlice";
interface props {
  setOpenPopup: any;
  editState?: IMarca | null;
  refresh?: any;
  estaEditando: any;
}

export const MarcaForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    descripcion: string;
  }
  const initialStateVar = {
    descripcion: ""
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
    try {
      if (editState) {
        result = unwrapResult(await dispatch(MarcaSliceRequests.PutRequest(e)));
      } else {
        result = unwrapResult(await dispatch(MarcaSliceRequests.PostRequest(e)));
      }
      openNotificationUI("Guardado...", "success");
      setOpenPopup(false);
      refresh();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
      result = null;
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
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
