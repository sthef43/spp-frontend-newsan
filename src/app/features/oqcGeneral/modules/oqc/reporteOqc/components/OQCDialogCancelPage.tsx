/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Input} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
interface props {
  setOpenPopup: any;
  mensaje: any;
}

export const OQCDialogCancelPage = ({ setOpenPopup, mensaje }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    descripcion: string;
  }
  const initialStateVar = {
    descripcion: "",
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Actualizo
  const loginSubmit = async (e) => {
    console.log(e);
    mensaje(e);
    setOpenPopup(false);
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="descripcion"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Motivo de la baja</InputLabel>
                    <Input {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Aceptar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
