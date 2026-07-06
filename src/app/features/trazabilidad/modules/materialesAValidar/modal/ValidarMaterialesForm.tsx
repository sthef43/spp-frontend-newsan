import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Button, TextField } from "@mui/material";
import { TipoMaterialSliceRequests } from "app/features/trazabilidad/slices/TipoMaterialSlice";
import { ValidarMaterialSliceRequests } from "app/Middleware/reducers/ValidarMaterialSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IValidarMaterial } from "app/models/IValidarMaterial";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
interface props {
  setOpenPopup: any;
  editState?: IValidarMaterial | null;
  refresh?: any;
  familiaId: number;
  productId: number;
}
export const ValidarMaterialesForm = ({ productId, setOpenPopup, editState, refresh, familiaId }: props) => {
  const buttonClasses = MaterialButtons();
  const dispacth = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const tiposMateriales = useAppSelector((d) => d.TipoMaterial.dataAll);
  const schema = yup
    .object()
    .shape({
      prefijo: yup.string().min(2).required()
    })
    .required();
  const defaultLabels = {
    prefijo: "Prefijo"
  };
  const defaultFormValues = {
    prefijo: editState?.prefijo || "",
    tipoMaterialId: editState?.tipoMaterialId || 0,
    familiaId: familiaId
  };
  const { control, getValues, formState, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultFormValues,
    mode: "onChange"
  });
  const handleGuardar = async () => {
    try {
      const objectForm = getValues();
      if (!editState) {
        const response = await dispacth(ValidarMaterialSliceRequests.PostRequest(objectForm));
      } else {
        const edit = await dispacth(
          ValidarMaterialSliceRequests.PutRequest({
            ...objectForm,
            id: editState.id,
            createdDate: editState.createdDate
          })
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
  const CustomAutocomplete = (options, onChange, defaultValue) => {
    return (
      <Autocomplete
        options={options}
        onChange={onChange}
        defaultValue={defaultValue}
        getOptionLabel={(option) => `${option.nombre}`}
        renderInput={(props) => <TextField {...props} fullWidth label="Tipo de material" variant="standard" />}
      />
    );
  };

  const [valor, setValor] = React.useState(editState?.tipoMaterial || null);
  const [tipoMaterialId, setTipoMaterialId] = React.useState();

  const handleChange = (e, value) => {
    if (value) setTipoMaterialId(value.id);
  };
  useEffect(() => {
    dispacth(TipoMaterialSliceRequests.getAllByProductId(productId));
  }, []);
  useEffect(() => {
    if (tipoMaterialId) setValue("tipoMaterialId", tipoMaterialId);
  }, [tipoMaterialId]);

  return (
    <div>
      <div style={{ width: "80vw" }}>
        <div className="grid sm:grid-cols-2 sm:gap-4 w-full">
          {tiposMateriales && CustomAutocomplete(tiposMateriales, handleChange, valor)}
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
