import React, { useEffect } from "react";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { ExtintorSitioSliceRequests } from "app/Middleware/reducers/ExtintorSitioSlice";
import { Button, FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import { ExtintorProcesoSliceRequests } from "app/Middleware/reducers/ExtintorProcesoSlice";
import { ExtintorAgenteSliceRequests } from "app/Middleware/reducers/ExtintorAgenteSlice";
interface props {
  setOpenPopup: any;
  editState?: any | null;
  refresh?: any;
  estaEditando: any;
  tabla: string;
  planta: number;
}

export const SPAEditForm = ({ setOpenPopup, editState, refresh, estaEditando, tabla, planta }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    nombre: string;
  }
  const initialStateVar = {
    nombre: ""
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
    console.log(e);
    const objetoNuevo = {
      nombre: e.nombre,
      plantId: planta
    };

    try {
      if (estaEditando) {
        switch (tabla) {
          case "Sitio":
            unwrapResult(await dispatch(ExtintorSitioSliceRequests.PutRequest(e)));
            break;
          case "Proceso":
            unwrapResult(await dispatch(ExtintorProcesoSliceRequests.PutRequest(e)));
            break;
          default:
            unwrapResult(await dispatch(ExtintorAgenteSliceRequests.PutRequest(e)));
        }
      } else {
        switch (tabla) {
          case "Sitio":
            unwrapResult(await dispatch(ExtintorSitioSliceRequests.PostRequest(objetoNuevo)));
            break;
          case "Proceso":
            unwrapResult(await dispatch(ExtintorProcesoSliceRequests.PostRequest(objetoNuevo)));
            break;
          default:
            delete objetoNuevo.plantId;
            unwrapResult(await dispatch(ExtintorAgenteSliceRequests.PostRequest(objetoNuevo)));
        }
      }
      openNotificationUI("Guardado...", "success");
      setOpenPopup(false);
      refresh();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  return (
    <>
      <div style={{ height: "100%", width: "20vw", position: "relative" }}>
        <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
          <div className="p-5">
            <div className=" flex-col gap-30 " style={{ height: "100%" }}>
              <Controller
                name="nombre"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Nombre</InputLabel>
                    <Input {...field} />
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
        </form>
      </div>
    </>
  );
};
