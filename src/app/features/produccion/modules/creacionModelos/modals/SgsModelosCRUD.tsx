import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { MQfunc } from "../../../../../shared/components/material-ui/breakpoints";
import { SgsmodeloSliceRequests } from "app/Middleware/reducers/SgsmodeloSlice";
import { ISgsmodelo } from "app/models/ISgsmodelo";
const requiredField = "Este campo es requerido";
const schema = yup
  .object()
  .shape({
    codigo: yup.string().required(requiredField),
    modelo: yup.string().required(requiredField),
    descripcion: yup.string().required(requiredField),
    numero: yup.number().required(requiredField)
  })
  .required();
const defaultValues: ISgsmodelo = {
  codigo: "",
  numero: "",
  modelo: "",
  descripcion: ""
};
const defaultLabels = {
  codigo: "Codigo",
  numero: "Numero",
  modelo: "Modelo",
  descripcion: "Descripcion"
};
// const selectFields = {
//   Target: {
//     array: [
//       { id: 1, nombre: "560" },
//       { id: 2, nombre: "250" },
//       { id: 3, nombre: "400" },
//       { id: 4, nombre: "1650" }
//     ],
//     id: "id",
//     column: "nombre"
//   },
//   "Tipo de unidad": {
//     array: [
//       { id: "W", nombre: "Windows" },
//       { id: "P", nombre: "Portable" },
//       { id: "S", nombre: "Split" },
//       { id: "H", nombre: "Haisen" }
//     ],
//     id: "id",
//     column: "nombre"
//   }
// };
export const SgsModelosCRUD = (props: any) => {
  const { setOpenPopup, modelo } = props;
  const dispatch = useAppDispatch();
  const materialButtons = MaterialButtons();
  const { control, trigger, setValue, register, getValues, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: "all"
  });
  React.useEffect(() => {
    if (modelo) {
      setValue("modelo", modelo);
    }
  }, [modelo]);

  const guardar = async () => {
    let info;
    try {
      info = unwrapResult(await dispatch(SgsmodeloSliceRequests.create(getValues())));
    } catch {
      info = null;
    }
    if (info) {
      setOpenPopup(false);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <GenericFieldsGenerator
        values={defaultValues}
        control={control}
        labels={defaultLabels}
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
