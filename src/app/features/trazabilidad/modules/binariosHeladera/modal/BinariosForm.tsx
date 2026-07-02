import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { BinariosIdentificadoresSliceRequest } from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { useAppDispatch } from "app/core/store/store";
import { IBinariosIdentificadores } from "app/models/IBinariosIdentificadores";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";

interface Props {
  setOpenPopup: any;
  editState: IBinariosIdentificadores;
}
export const BinariosForm = ({ setOpenPopup, editState }: Props) => {
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const initialStateVar = {
    nombre: ""
  };
  const { control, handleSubmit, formState } = useForm<IBinariosIdentificadores>({
    defaultValues: editState ? editState : initialStateVar
  });
  const handleSubmitForm = async (e) => {
    try {
      const response = editState
        ? await dispatch(BinariosIdentificadoresSliceRequest.PutRequest(e))
        : await dispatch(BinariosIdentificadoresSliceRequest.PostRequest(e));
      openNotificationUI("Se agrego correctamente", "success");
      await dispatch(BinariosIdentificadoresSliceRequest.getAllRequest());
      setOpenPopup(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(handleSubmitForm)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <Controller
            name="nombre"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <TextField {...field} label="Nombre" />
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="flex justify-center mt-4">
          <Button
            className={buttonClasses.greenButton}
            type="submit"
            disabled={!formState.dirtyFields && !formState.isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
