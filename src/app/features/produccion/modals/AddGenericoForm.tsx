import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { Button, FormControl, FormHelperText, Grid, Input, InputLabel } from "@mui/material";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { toUpper } from "lodash";

interface props {
  setOpenPopup: any;
  refresh?: any;
}

export const AddGenericoForm = ({ setOpenPopup, refresh }: props): JSX.Element => {
  const classes = MaterialButtons();
  interface initialState {
    codigo: string;
    generico1: string;
  }
  const initialStateVar = {
    codigo: "",
    generico1: ""
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    const mayuse = {
      codigo: toUpper(e.codigo),
      generico1: toUpper(e.generico1)
    };
    try {
      const result = await dispatch(GenericoSliceRequests.addRequest(JSON.parse(JSON.stringify(mayuse))));
      openNotificationUI("Guardado...", "success");
      setOpenPopup(false);
      refresh();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  return (
    <div style={{ height: "100%", width: "40vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 h-full">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                  <Controller
                    name="codigo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Código</InputLabel>
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
                <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                  <Controller
                    name="generico1"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Genérico</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
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
