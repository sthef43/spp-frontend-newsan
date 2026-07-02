import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { OQCPonderacionSliceRequests } from "app/features/oqcGeneral/slices/OQCPonderacionSlice";
import { IOQCPonderacion } from "app/models/IOQCPonderacion";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { Controller, useForm } from "react-hook-form";

interface IOQCPonderacionForm {
  closeModal: (state: boolean) => void;
}
const defaultValues = {
  nombre: "",
  criticidad: "",
  ponderacion: 0,
  color: "",
  tipoDefecto: ""
};
export const OQCPonderacionForm = ({ closeModal }: IOQCPonderacionForm): JSX.Element => {
  const ponderacion = useAppSelector<IOQCPonderacion>((state) => state.oqcPonderacion.object);
  const { control, handleSubmit } = useForm({ defaultValues: ponderacion ? ponderacion : defaultValues });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const onSubmit = async (e) => {
    try {
      ponderacion
        ? await dispatch(OQCPonderacionSliceRequests.PutRequest(e))
        : await dispatch(OQCPonderacionSliceRequests.PostRequest(e));
      openNotificationUI(`Se ${ponderacion ? "edito" : "agrego"} correctamente`, "success");
      await dispatch(OQCPonderacionSliceRequests.getAllRequest());
      closeModal(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-5">
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
      <Controller
        control={control}
        name="criticidad"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Criticidad" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="ponderacion"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Ponderación en %" type="number" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="color"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Seleccione un color</InputLabel>
            <Select {...field}>
              <MenuItem value="Verde">Verde</MenuItem>
              <MenuItem value="Amarillo">Amarillo</MenuItem>
              <MenuItem value="Rojo">Rojo</MenuItem>
            </Select>
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="tipoDefecto"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Tipo de defecto" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <FormButtons onCancel={() => closeModal(false)} />
    </form>
  );
};
