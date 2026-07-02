import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";

interface props {
  setModalGenerico: any;
}
export const GenericoForm = ({ setModalGenerico }: props) => {
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

  const loginSubmit = async (e) => {
    console.log(e);
    let result;
    try {
      result = await dispatch(GenericoSliceRequests.addRequest(JSON.parse(JSON.stringify(e))));
    } catch (x) {
      result = null;
    }
    if (result) {
      openNotificationUI("Guardado exitosamente ", "success");
      setModalGenerico(false);
    }
  };
  const classes = MaterialButtons();

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="codigo"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Código"
                      variant="standard"
                      type="text"
                      // disabled={true}
                      {...field}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="generico1"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Genérico"
                      variant="standard"
                      type="text"
                      // disabled={true}
                      {...field}
                    />
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
        </div>
      </form>
    </div>
  );
};

{
  /* <Controller
              name="codigo"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Codigo"
                  label="codigo"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            /> */
}

{
  /* <Controller
              name="generico1"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Generico"
                  label="Generico"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            /> */
}
