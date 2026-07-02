import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import { LineaPuestoTableroSliceRequest } from "app/Middleware/reducers/LineaPuestoTableroSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
interface IPuestoTableroCRUDPage {
  closeModal: (state: boolean) => void;
  refresh: () => void;
}
const defaultValues = {
  lineaPuestoId: 0,
  objetivo: 0
};
export const PuestoTableroCRUDPage = ({ closeModal, refresh }: IPuestoTableroCRUDPage): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const lineaPuesto = useAppSelector((state) => state.lineaPuesto.object);
  const lineaPuestoTablero = useAppSelector((state) => state.lineaPuestoTablero.object);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: lineaPuestoTablero ? lineaPuestoTablero : defaultValues
  });

  const onSubmit = async (e) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(
        lineaPuestoTablero
          ? LineaPuestoTableroSliceRequest.PutRequest(e)
          : LineaPuestoTableroSliceRequest.PostRequest(e)
      );
      refresh();
      closeModal(false);
      openNotificationUI("Se configuro con éxito", "success");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    lineaPuesto && setValue("lineaPuestoId", lineaPuesto.id);
  }, [lineaPuesto]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 flex-col justify-center">
      <Controller
        control={control}
        name="objetivo"
        rules={{ required: "El campo es requerido", min: { message: "El valor minimo es 1", value: 1 } }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Objetivo</InputLabel>
            <Input {...field} type="number" inputProps={{ inputMode: "numeric" }} />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <FormButtons onCancel={() => closeModal(false)} />
    </form>
  );
};
