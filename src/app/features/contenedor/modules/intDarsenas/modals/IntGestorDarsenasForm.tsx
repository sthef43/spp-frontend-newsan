import { IIntDarsena } from "app/models/IIntDarsena";
import React, { useEffect } from "react";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { IntDarsenaSliceRequests } from "app/Middleware/reducers/IntDarsenaSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";

interface props {
  setOpenPopup: any;
  editState?: IIntDarsena | null;
  refresh?: any;
  estaEditando: any;
  plantaId: any;
}

export const IntGestorDarsenasForm = ({ setOpenPopup, editState, refresh, estaEditando, plantaId }: props) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  interface initialState {
    plantId: number;
    intRemitoPadreId: number;
    detalle: string;
    estado: boolean; //Libre o Ocupada
  }
  const initialStateVar = {
    plantId: plantaId,
    intRemitoPadreId: 1,
    detalle: "",
    estado: false
  };
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
      if (estaEditando) {
        delete e.plant;
        delete e.intRemitoPadre;
        unwrapResult(await dispatch(IntDarsenaSliceRequests.PutRequest(e)));
      } else {
        unwrapResult(await dispatch(IntDarsenaSliceRequests.PostRequest(e)));
      }
      openNotificationUI("Guardado...", "success");
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  return (
    <div className="my-2 mx-4 h-full">
      <form onSubmit={handleSubmit(loginSubmit)}>
        <Controller
          name="detalle"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <TextField
                fullWidth
                variant="standard"
                type="text"
                inputProps={{ style: { textTransform: "uppercase" } }}
                {...field}
              />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
