/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@mui/material";
import { AjusteSliceRequests } from "app/Middleware/reducers/AjusteSlice";
import { useAppDispatch } from "app/core/store/store";
import { IAjuste } from "app/models/IAjuste";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface Props {
  ajuste: IAjuste;
  setOpenModal: any;
  refresh: any;
}

export const AjusteForm = ({ ajuste, setOpenModal, refresh }: Props) => {
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const schema = yup
    .object()
    .shape({
      ajuste1: yup
        .number()
        .positive("El numero tiene que ser mayor a 0")
        .integer("El numero tiene que ser entero")
        .required()
    })
    .required();

  const handleGuardar = async () => {
    try {
      const objecto = { ...ajuste, ajuste1: getValues("ajuste1") };
      const response = await dispatch(AjusteSliceRequests.putRequest(objecto));
      response && openNotificationUI("Se edito el ajuste correctamente", "success");
      refresh();
      setOpenModal(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const defaultFormValues = {
    ajuste1: ajuste?.ajuste1 || 0
  };

  const defaultPuestoLabels = {
    ajuste1: "Ajuste"
  };

  const { control, getValues, formState } = useForm({
    defaultValues: defaultFormValues,
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const handleCancelar = async () => {
    setOpenModal(false);
  };

  return (
    <>
      <GenericFieldsGenerator
        values={defaultFormValues}
        control={control}
        styleDiv={"text-center mb-5"}
        styleFieldSX={{ width: "100%" }}
        labels={defaultPuestoLabels}
        variant="standard"
      />
      <div className="pt-1 flex justify-around gap-3 mt-3">
        <Button
          className={buttonClasses.blueButton}
          disabled={!formState.isValid}
          variant="contained"
          onClick={handleGuardar}>
          Guardar
        </Button>
        <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
          Cancelar
        </Button>
      </div>
    </>
  );
};
