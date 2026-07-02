import React from "react";
import { Button, FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { SemielaboradoIASliceRequest } from "app/Middleware/reducers/semielaboradoIaSlice";

export const EditaSemielaboradoIA = (props: any) => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { semiEdit, setModalOpen, InitStates } = props;
  const { control, formState, handleSubmit, reset, getValues, watch } = useForm({
    defaultValues: semiEdit
  });

  const editar = async () => {
    const objectEditar = { ...getValues(), semielaboradoTipo: null, familia: null };
    const result = unwrapResult(await dispatch(SemielaboradoIASliceRequest.PutRequest(objectEditar)));
    if (result) {
      openNotificationUI("Agregado correctamente", "success");
      setModalOpen(false);
      InitStates();
    }
  };

  return (
    <div>
      <form className="py-4" onSubmit={handleSubmit(editar)}>
        <div className="grid sm:grid-row-3 sm:gap-4 w-full">
          <Controller
            name="valor"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Semielaborado Externo</InputLabel>
                <Input {...field} />
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <Button className="w-full my-2" type="submit" variant="outlined">
          Agregar
        </Button>
      </form>
    </div>
  );
};
