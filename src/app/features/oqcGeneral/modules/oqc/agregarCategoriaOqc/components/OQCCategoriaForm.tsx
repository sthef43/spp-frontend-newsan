import { FormControl, FormHelperText, TextField } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { OQCCategoriaSliceRequests } from "app/features/oqcGeneral/slices/OQCCategoriaSlice";
import { IOQCCategoria } from "app/models/IOQCCategoria";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { Controller, useForm } from "react-hook-form";
interface IOQCCategoriaForm {
  closeModal: (state: boolean) => void;
}
const defaultValues = {
  nombre: ""
};
export const OQCCategoriaForm = ({ closeModal }: IOQCCategoriaForm): JSX.Element => {
  const categoria = useAppSelector<IOQCCategoria>((state) => state.oqcCategoria.object);
  const { control, handleSubmit } = useForm({ defaultValues: categoria ? categoria : defaultValues });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const onSubmit = async (e) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));

      categoria
        ? await dispatch(OQCCategoriaSliceRequests.PutRequest(e))
        : await dispatch(OQCCategoriaSliceRequests.PostRequest(e));
      openNotificationUI(`Se ${categoria ? "edito" : "agrego"} correctamente`, "success");
      await dispatch(OQCCategoriaSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      closeModal(false);
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center">
      <Controller
        control={control}
        name="nombre"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Nombre" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <FormButtons onCancel={() => closeModal(false)} />
    </form>
  );
};
