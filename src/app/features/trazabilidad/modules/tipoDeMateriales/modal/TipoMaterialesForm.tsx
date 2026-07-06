import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { TipoMaterialSliceRequests } from "app/features/trazabilidad/slices/TipoMaterialSlice";
import { useAppDispatch } from "app/core/store/store";
import { ITipoMaterial } from "app/models/ITipoMaterial";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
interface props {
  setOpenPopup: any;
  editState?: ITipoMaterial | null;
  refresh?: any;
  productoId: number;
}
export const TipoMaterialesForm = ({ setOpenPopup, editState, refresh, productoId }: props) => {
  const buttonClasses = MaterialButtons();
  const dispacth = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const schema = yup
    .object()
    .shape({
      nombre: yup.string().min(2).required()
    })
    .required();
  const defaultLabels = {
    nombre: "Nombre"
  };
  const defaultFormValues = {
    nombre: editState?.nombre || "",
    productoId: productoId
  };
  const { control, getValues, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultFormValues,
    mode: "onChange"
  });
  const handleGuardar = async () => {
    try {
      const objectForm = getValues();
      if (!editState) {
        const response = await dispacth(TipoMaterialSliceRequests.PostRequest(objectForm));
      } else {
        const edit = await dispacth(
          TipoMaterialSliceRequests.PutRequest({ ...objectForm, id: editState.id, createdDate: editState.createdDate })
        );
      }
      editState
        ? openNotificationUI("Se edito correctamente", "success")
        : openNotificationUI("Se agrego correctamente", "success");
      refresh();
      setOpenPopup(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handleCancelar = () => {
    setOpenPopup(false);
  };
  return (
    <div>
      <div style={{ width: "80vw" }}>
        <div className="grid sm:grid-cols-2 sm:gap-4 w-full">
          <GenericFieldsGenerator
            values={defaultFormValues}
            control={control}
            styleDiv={"text-center mb-5"}
            styleFieldSX={{ width: "100%" }}
            labels={defaultLabels}
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
          <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
