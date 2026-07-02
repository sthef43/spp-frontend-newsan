import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { MQfunc } from "app/shared/components/material-ui/breakpoints";
import { useAppDispatch } from "app/core/store/store";
import { ZPL_TipoEtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_TipoEtiquetasSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ZPL_EtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_EtiquetasSlice";

interface props {
  refresh: any;
  setOpenPopup: any;
  editState;
}

export const EtiquetasForm = ({ refresh, setOpenPopup, editState }: props) => {
  const [tipoEtiquetas, setTipoEtiquetas] = useState(null);

  const dispatch = useAppDispatch();

  const getTipoEtiquetas = async () => {
    const result = unwrapResult(await dispatch(ZPL_TipoEtiquetasSliceRequests.getAllRequest()));
    setTipoEtiquetas(result);
  };

  useEffect(() => {
    getTipoEtiquetas();
  }, []);

  const requiredField = "Este campo es requerido";
  const schema = yup
    .object()
    .shape({
      descripcionEtiqueta: yup.string().required(requiredField),
      cantidadPosiciones: yup.number().required(requiredField),
      prefijo: yup.string(),
      tipoEquipo: yup.string().max(2),
      activa: yup.boolean().required(requiredField),
      cambiaMes: yup.boolean().required(requiredField),
      anchoEtiqueta: yup.number().required(requiredField),
      altoEtiqueta: yup.number().required(requiredField),
      DPmm: yup.number().required(requiredField),
      ZPL: yup.string().required(requiredField),
      tipoEtiqueta: yup.number().required(requiredField)
    })
    .required();
  const defaultValues = {
    descripcionEtiqueta: "",
    cantidadPosiciones: 0,
    prefijo: "",
    tipoEquipo: "",
    activa: true,
    cambiaMes: false,
    anchoEtiqueta: 0,
    altoEtiqueta: 0,
    DPmm: 0,
    ZPL: "",
    tipoEtiqueta: 0
  };
  const defaultLabels = {
    descripcionEtiqueta: "Nombre",
    cantidadPosiciones: "Posiciones",
    prefijo: "Prefijo",
    tipoEquipo: "Equipo",
    activa: "Activa",
    cambiaMes: "Mensual",
    anchoEtiqueta: "Ancho",
    altoEtiqueta: "Alto",
    DPmm: "PPmm",
    ZPL: "ZPL",
    tipoEtiqueta: "Tipo Etiqueta"
  };

  const selectFields = {
    "Tipo Etiqueta": {
      array: tipoEtiquetas,
      id: "id",
      column: "descripcionTipoEtiqueta"
    }
  };

  const { control, getValues, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editState != null ? editState : defaultValues,
    mode: "all"
  });

  const { openNotificationUI } = useNotificationUI();

  const materialButtons = MaterialButtons();

  const guardar = async () => {
    let info;
    try {
      if (editState) info = unwrapResult(await dispatch(ZPL_EtiquetasSliceRequests.putRequest(getValues())));
      else info = unwrapResult(await dispatch(ZPL_EtiquetasSliceRequests.postRequest(getValues())));
    } catch {
      info = null;
    }
    if (info) {
      openNotificationUI("Operacion realizada con exito", "success");
      refresh();
      setOpenPopup(false);
    }
  };

  return (
    <div>
      {tipoEtiquetas && (
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
      )}
      <div className="flex md:col-span-3 justify-around mt-4 w-full">
        <div>
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
    </div>
  );
};
