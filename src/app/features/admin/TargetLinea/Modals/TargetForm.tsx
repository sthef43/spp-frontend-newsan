/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { TargetsSliceRequests } from "app/Middleware/reducers/TargetsSlice";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

interface initialState {
  idTarget: number;
  target: number;
  targetDesarme: number;
  generico: string;
  idLinea: number;
  dotacion: number;
  standar: number;
}
const initialStateVar = {
  target: 0,
  targetDesarme: 0,
  generico: "",
  idLinea: 0,
  dotacion: 0,
  standar: 0
};
interface props {
  setOpenPopup: (open: boolean) => void;
  editState?: initialState | null;
  refresh?: () => void;
  estaEditando: boolean;
}

export const TargetForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    if (e.target > 0 && e.dotacion > 0) {
      try {
        if (estaEditando) {
          const objectSubmit = {
            ...e,
            targetDesarme: e.target
          };
          const result = unwrapResult(await dispatch(TargetsSliceRequests.putRequest(objectSubmit)));
        } else {
          const objectSubmit = {
            target: e.target,
            targetDesarme: e.target,
            generico: editState.generico,
            idLinea: editState.idLinea,
            dotacion: e.dotacion,
            standar: 0
          };
          const result2 = unwrapResult(await dispatch(TargetsSliceRequests.postRequest(objectSubmit)));
        }
        openNotificationUI("Guardado...", "success");
        refresh();
        setOpenPopup(false);
      } catch (x) {
        openNotificationUI("Error al guardar.", "error");
      }
    } else {
      openNotificationUI("Debe ingresar valores superior a 0", "error");
    }
  };

  return (
    <ContainerForPages optionsLayout="modal" tableForModalOrPageStyle="Modal">
      <form onSubmit={handleSubmit(loginSubmit)}>
        <div>
          <div>
            <div className="p-5">
              <Controller
                name="target"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="standard" error={!!error}>
                    <TextField fullWidth label="Target" variant="standard" type="number" {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div>
            <div className="p-5">
              <Controller
                name="dotacion"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="standard" error={!!error}>
                    <TextField fullWidth label="Dotación" variant="standard" type="number" {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="pt-5 flex justify-around">
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </ContainerForPages>
  );
};
