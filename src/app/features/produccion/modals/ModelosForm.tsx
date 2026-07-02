import { IModelos } from "app/models";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import React, { useEffect, useState } from "react";
import { MQfunc } from "../../../shared/components/material-ui/breakpoints";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { TipoUnidadSliceRequests } from "app/Middleware/reducers/TipoUnidadSlice";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { Button } from "@mui/material";

interface props {
  setOpenPopup: any;
  refresh: any;
  modeloSelected: IModelos;
}
export const ModelosForm = ({ setOpenPopup, refresh, modeloSelected }: props) => {
  const [listTipoUnidad, setListTipoUnidad] = useState([]);
  const [familias, setFamilias] = useState([]);
  const dispatch = useAppDispatch();
  const materialButtons = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const getListTipoUnidad = async () => {
    const result = unwrapResult(await dispatch(TipoUnidadSliceRequests.getAllRequest()));
    if (result) {
      const newArray = result.map((x) => {
        const obj = { ...x, id: x.nombre };
        return obj;
      });
      console.log(newArray);

      setListTipoUnidad(newArray);
    }
  };

  const getFamilias = async () => {
    const result = unwrapResult(await dispatch(FamiliaSliceRequests.getAllRequest()));
    setFamilias(result);
  };

  useEffect(() => {
    getListTipoUnidad();
    getFamilias();
  }, []);

  const requiredField = "Este campo es requerido";
  const schema = yup
    .object()
    .shape({
      codigoModelo: yup.string().required(requiredField),
      descripcion: yup.string().required(requiredField),
      tipoUnidad: yup.string().required(requiredField),
      temporada: yup.string().min(4).max(4).required(requiredField),
      capacidadTipo: yup.string().required(requiredField)
    })
    .required();

  const defaultValues = {
    codigoModelo: "",
    descripcion: "",
    tipoUnidad: "",
    codigoSgs: null,
    modeloTps: 0,
    temporada: moment().get("year"),
    capacidadTipo: ""
  };

  const defaultLabels = {
    codigoModelo: "CodigoModelo",
    descripcion: "Descripcion",
    tipoUnidad: "Tipo de unidad",
    temporada: "Temporada",
    capacidadTipo: "Familia"
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
      array: listTipoUnidad,
      id: "id",
      column: "descripcion"
    },
    Familia: {
      array: familias,
      id: "nombre",
      column: "nombre"
    }
  };

  const { control, trigger, setValue, reset, getValues, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: modeloSelected,
    mode: "all"
  });

  useEffect(() => {
    console.log(modeloSelected);
  }, []);

  const guardar = async () => {
    console.log(getValues());
    const objetoGuardar = { ...getValues(), planprod: null };
    console.log(objetoGuardar);

    let info;
    try {
      info = unwrapResult(await dispatch(ModelosSliceRequests.UpdateModelo(objetoGuardar)));
    } catch {
      info = null;
    }
    if (info) {
      openNotificationUI("Operacion realizada con exito", "success");
      setOpenPopup(false);
      refresh();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
        <GenericFieldsGenerator
          values={defaultValues}
          control={control}
          labels={defaultLabels}
          selectFields={selectFields}
          styleFieldSX={{ width: "100%", [MQfunc[1]]: { minWidth: "25rem" } }}
          variant="outlined"
        />
      </div>
      <div className="flex md:col-span-3 justify-around mt-4 w-full">
        <Button
          variant="contained"
          className={materialButtons.greenButton}
          onClick={() => {
            guardar();
          }}
          disabled={!formState.isValid || !formState.isDirty}>
          Guardar
        </Button>
      </div>
    </div>
  );
};
