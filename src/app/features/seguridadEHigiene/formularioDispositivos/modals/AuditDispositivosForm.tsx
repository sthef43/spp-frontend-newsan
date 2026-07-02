import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { IAuditDispositivo } from "app/models";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { AuditDispositivoSliceRequests } from "app/features/audit/slices/AuditDispositivoSlice";
interface Props {
  plantId: number;
  setOpenModal: any;
  refresh: any;
  editState: IAuditDispositivo;
}
export const AuditDispositivosForm = ({ plantId, setOpenModal, editState, refresh }: Props) => {
  const buttonClasses = MaterialButtons();
  const dispacth = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const schema = yup
    .object()
    .shape({
      nombre: yup.string().min(2).required(),
      marca: yup.string().min(2).required(),
      modelo: yup.string().min(2).required(),
      ano: yup.string().min(2).required(),
      interno: yup.string().min(1).required(),
      codigo: yup.string().min(2).required()
    })
    .required();
  const defaultFormValuesLabels = {
    nombre: "Nombre",
    marca: "Marca",
    modelo: "Modelo",
    ano: "Año",
    interno: "Interno",
    codigo: "Código"
  };
  const defaultFormValues = {
    nombre: "",
    marca: "",
    modelo: "",
    ano: "",
    interno: "",
    codigo: ""
  };
  const handleGuardar = async (e) => {
    try {
      const valuesForm = getValues();
      const dispositivo = editState
        ? { ...valuesForm, plantaId: plantId, auditTableId: 2, id: editState.id }
        : { ...valuesForm, plantaId: plantId, auditTableId: 2 };
      const response = editState
        ? await dispacth(AuditDispositivoSliceRequests.PutRequest(dispositivo))
        : await dispacth(AuditDispositivoSliceRequests.PostRequest(dispositivo));
      editState
        ? openNotificationUI("Se edito con éxito", "success")
        : openNotificationUI("Se agrego con éxito", "success");
      refresh();
      setOpenModal(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const { control, getValues, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editState || defaultFormValues,
    mode: "onChange"
  });
  return (
    <div>
      <div style={{ width: "80vw" }}>
        <div className="grid sm:grid-cols-2 sm:gap-4 w-full">
          <GenericFieldsGenerator
            values={defaultFormValues}
            control={control}
            styleDiv={"text-center mb-5"}
            styleFieldSX={{ width: "100%" }}
            labels={defaultFormValuesLabels}
            variant="standard"
          />
        </div>
        <div className="pt-1 flex justify-around border-t-2">
          <Button
            className={buttonClasses.blueButton}
            disabled={!formState.isValid}
            variant="contained"
            onClick={handleGuardar}>
            Guardar
          </Button>
          <Button className={buttonClasses.redButton} variant="contained" onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
