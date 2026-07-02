/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SEH_EPP } from "../interfaces/SEH_EPP";
import { useAppDispatch } from "app/core/store/store";
import { SEHEPPSliceRequest } from "../reducers/SEH_EPPSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface Props {
  submit: (value: boolean) => void;
  editMode?: boolean;
  model?: SEH_EPP;
}

export const EPPForm = ({ submit, editMode = false, model }: Props) => {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid }
  } = useForm<SEH_EPP>({
    mode: "onTouched",
    defaultValues: editMode
      ? model
      : {
          nombre: "",
          descripcion: ""
        }
  });

  const { openNotificationUI } = useNotificationUI();
  const buttonClases = MaterialButtons();

  const dispatch = useAppDispatch();

  const checkItemExists = async (nombre) => {
    const response = unwrapResult(
      await dispatch(
        SEHEPPSliceRequest.SearchRequest({
          key: "nombre",
          value: nombre
        })
      )
    );

    return response;
  };

  const onSubmit = async (data: SEH_EPP) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      let response = null;
      if (editMode) {
        response = unwrapResult(await dispatch(SEHEPPSliceRequest.PutRequest(data)));
      } else {
        response = unwrapResult(await dispatch(SEHEPPSliceRequest.PostRequest(data)));
      }
      if (!response) throw new Error("No se puedo completar la operacion");
      openNotificationUI("Carga Exitosa", "success");
      submit(true);
    } catch (e) {
      submit(false);
      openNotificationUI(e?.message || "Ha Ocurrido un Error", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-sm text-textColor font-light mb-3">Elemento de Seguridad</p>

        <Controller
          name="nombre"
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: true,
              message: "Debe ingresar un nombre para el elemento"
            },
            minLength: {
              value: 2,
              message: "Por Favor ingrese un Nombre Conciso"
            }
          }}
          render={({ field, fieldState: { error, invalid } }) => {
            return (
              <TextField
                fullWidth
                error={invalid}
                helperText={error?.message}
                {...field}
                onBlur={async (e) => {
                  field.onBlur();
                  const value = e.target.value;
                  if (value) {
                    if (editMode && model.nombre == value) return true;
                    const exists = await checkItemExists(value);
                    if (exists) {
                      setError("nombre", {
                        type: "manual",
                        message: "El nombre ya existe. Por favor, elija otro."
                      });
                    } else {
                      clearErrors("nombre");
                    }
                  }
                }}
              />
            );
          }}
        />
      </div>
      <div className="w-full">
        <p className="text-sm text-textColor font-light mb-3">Descripción</p>
        <Controller
          name="descripcion"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full bg-transparent border border-gray-300 rounded-md p-2 focus:outline-blue-500 transition-colors"
              rows={3}
              placeholder="Describe tu problema o solicitud en detalle"></textarea>
          )}
        />
      </div>
      <div className="w-full mt-2">
        <Button type="submit" sx={{ width: "100%" }} disabled={!isValid} className={buttonClases.blueButton}>
          {editMode ? "Editar" : "Guardar"} EPP
        </Button>
      </div>
    </form>
  );
};
