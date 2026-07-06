import { FormControl, FormHelperText, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { OQCModeloSliceRequests } from "app/features/oqcGeneral/slices/OQCModeloSlice";
import { IOQCModelo } from "app/models/IOQModelo";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface IOQCModeloForm {
  closeModal: (state: boolean) => void;
}

const defaultValues = {
  lineaProduccionId: 0,
  modeloMoto: "",
  modeloNewsan: "",
  compania: "",
  eanCode: "",
  activo: true
};

export const OQCModeloForm = ({ closeModal }: IOQCModeloForm): JSX.Element => {
  const modelo = useAppSelector<IOQCModelo>((state) => state.oqcModelo.object);
  const linea = useAppSelector((state) => state.lineaProduccion.object);

  const { control, handleSubmit, setValue } = useForm({ defaultValues: modelo ? modelo : defaultValues });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const onSubmit = async (e) => {
    try {
      modelo
        ? await dispatch(OQCModeloSliceRequests.PutRequest(e))
        : await dispatch(OQCModeloSliceRequests.PostRequest(e));
      openNotificationUI(`Se ${modelo ? "edito" : "agrego"} correctamente`, "success");
      await dispatch(OQCModeloSliceRequests.getAllByLineaIdRequest(linea.id));
      closeModal(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    linea && setValue("lineaProduccionId", linea.id);
  }, [linea]);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="personalized" classNamePersonalized="w-[35vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-5">
        <Controller
          control={control}
          name="modeloMoto"
          rules={{ required: "El campo es requerido" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField {...field} label="Modelo motorola" />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="modeloNewsan"
          rules={{ required: "El campo es requerido" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField {...field} label="Modelo newsan" />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="compania"
          rules={{ required: "El campo es requerido" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField {...field} label="Compañia" />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="eanCode"
          rules={{ required: "El campo es requerido" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField {...field} label="EanCode" />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <FormButtons onCancel={() => closeModal(false)} />
      </form>
    </ContainerForPages>
  );
};
