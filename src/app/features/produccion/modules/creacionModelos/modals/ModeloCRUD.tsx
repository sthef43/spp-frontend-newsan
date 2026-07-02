import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { useAppDispatch } from "app/core/store/store";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { MQfunc } from "../../../../../shared/components/material-ui/breakpoints";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
const requiredField = "Este campo es requerido";
const schema = yup
  .object()
  .shape({
    codigoModelo: yup.string().required(requiredField),
    descripcion: yup.string().required(requiredField),
    tipoUnidad: yup.string().required(requiredField),
    temporada: yup.string().min(4).max(4).required(requiredField)
  })
  .required();
const defaultValues = {
  codigoModelo: "",
  descripcion: "",
  tipoUnidad: "",
  codigoSgs: null,
  modeloTps: 0,
  temporada: moment().get("year")
};
const defaultLabels = {
  codigoModelo: "CodigoModelo",
  descripcion: "Descripcion",
  tipoUnidad: "Tipo de unidad",
  temporada: "Temporada"
};
const selectFields = {
  Target: {
    array: [
      { id: 1, nombre: "560" },
      { id: 2, nombre: "250" },
      { id: 3, nombre: "400" },
      { id: 4, nombre: "1650" }
    ],
    id: "id",
    column: "nombre"
  },
  "Tipo de unidad": {
    array: [
      { id: "W", nombre: "Windows" },
      { id: "P", nombre: "Portable" },
      { id: "I", nombre: "Interior" },
      { id: "E", nombre: "Exterior" }
    ],
    id: "id",
    column: "nombre"
  }
};
export const ModeloCRUD = (props: any) => {
  const { setOpenPopup, modelo, getModelos } = props;
  const dispatch = useAppDispatch();
  const materialButtons = MaterialButtons();
  const { control, trigger, setValue, reset, getValues, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: "all"
  });
  const { openNotificationUI } = useNotificationUI();
  React.useEffect(() => {
    if (modelo) {
      reset(modelo);
    }
  }, [modelo]);

  const guardar = async () => {
    let info;
    try {
      if (modelo) {
        info = unwrapResult(await dispatch(ModelosSliceRequests.UpdateModelo(getValues())));
      } else {
        info = unwrapResult(await dispatch(ModelosSliceRequests.CreateModelo(getValues())));
      }
    } catch {
      info = null;
    }
    if (info) {
      openNotificationUI("Operacion realizada con exito", "success");
      setOpenPopup(false);
      getModelos();
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <GenericFieldsGenerator
        values={defaultValues}
        control={control}
        labels={defaultLabels}
        selectFields={selectFields}
        styleFieldSX={{ width: "100%", [MQfunc[1]]: { minWidth: "25rem" } }}
        variant="outlined"
      />
      <div className="flex md:col-span-2 justify-around mt-4 w-full">
        <Button
          variant="contained"
          className={materialButtons.greenButton}
          onClick={() => {
            guardar();
          }}
          disabled={!formState.isValid || !formState.isDirty}>
          Guardar
        </Button>
        <Button variant="contained" className={materialButtons.redButton} onClick={() => setOpenPopup(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
