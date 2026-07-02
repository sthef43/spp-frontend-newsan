import { Button, FormControl, FormControlLabel, FormHelperText, Switch, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { CalidadInspeccionTareaSliceRequest } from "app/Middleware/reducers/CalidadInspeccionTareaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ICalidadInspeccionTarea } from "app/models/ICalidadInspeccionTarea";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface CalidadInspeccionTareaFormProps {
  refresh: () => void;
  existingtasks?: string[];
  setModal: (state: boolean) => void;
  editState?: ICalidadInspeccionTarea | null;
  edit: boolean;
}

const defaultValues = {
  tarea: "",
  nivel: 1,
  porcentajeMuestras: 100,
  sumaRanking: false
};

const CalidadInspeccionTareaForm = ({
  setModal,
  existingtasks,
  refresh,
  editState,
  edit
}: CalidadInspeccionTareaFormProps) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const {
    handleSubmit,
    control,
    register,
    watch,
    getValues,
    setValue,
    setError,
    formState: { errors, isValid, isDirty }
  } = useForm<ICalidadInspeccionTarea>({
    mode: "onChange",
    defaultValues: edit ? editState : defaultValues
  });

  const checkTareaRepetida = (data: string) => {
    if (existingtasks.length == 0) return true;
    if (edit && editState) {
      existingtasks = existingtasks.filter((d) => d.toLowerCase() != editState.tarea.toLowerCase());
    }
    const existe = data && existingtasks.find((d) => d.toLowerCase() == data.toLowerCase());
    if (!existe) return true;
    return false;
  };

  useEffect(() => {
    const nivel = getValues("nivel");
    if (nivel == 0) {
      setValue("sumaRanking", false);
    }
  }, [watch("nivel")]);

  const onSubmit = async (data) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = edit
        ? unwrapResult(await dispatch(CalidadInspeccionTareaSliceRequest.PutRequest(data)))
        : unwrapResult(await dispatch(CalidadInspeccionTareaSliceRequest.PostRequest(data)));
      if (!response) {
        throw new Error("Ocurrio un error al intentar guardar/editar la tarea");
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      refresh();
      setModal(false);
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  return (
    <form className="w-full flex flex-col gap-4 justify-center align-middle" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="tarea"
        control={control}
        rules={{
          required: "Campo Requerido",
          validate: {
            repeated: (v) => checkTareaRepetida(v) || "Nombre de Tarea Repetida"
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <FormControl error={!!error}>
            <TextField {...field} label="Tarea" />
            {!!error && <FormHelperText>{error?.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="nivel"
        control={control}
        rules={{
          min: { value: 1, message: "No puede ser menor a 1" },
          required: "Campo Requerido"
        }}
        render={({ field, fieldState: { error } }) => (
          <FormControl error={!!error}>
            <TextField {...field} label="Nivel" type="number" />
            {!!error && <FormHelperText>{error?.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        name="porcentajeMuestras"
        control={control}
        rules={{
          min: { value: 0, message: "No puede ser menor a 0" },
          max: { value: 100, message: "No puede ser mayor a 100" },
          required: "Campo Requerido"
        }}
        render={({ field, fieldState: { error } }) => (
          <FormControl error={!!error}>
            <TextField {...field} label="% Muestra" type="number" />
            {!!error && <FormHelperText>{error?.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        name="sumaRanking"
        control={control}
        render={({ field: { value, ...field } }) => (
          <FormControl className="w-full flex justify-center items-center" disabled={getValues("nivel") == 0}>
            <FormControlLabel control={<Switch checked={value} {...field} />} label="Suma Ranking" />
            <FormHelperText>Suma al ranking del inspector inspeccionado</FormHelperText>
          </FormControl>
        )}
      />
      <div className="pt-1 flex justify-around border-t-2 mb-1" style={{ flex: "1 1 10%" }}>
        <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty || !isValid}>
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default CalidadInspeccionTareaForm;
