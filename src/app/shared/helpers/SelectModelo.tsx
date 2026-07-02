import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNotificationUI } from "../hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { IModelos } from "../../models/IModelos";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { ILinea } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";

interface ISelectModelo {
  codigoNewsan?: string;
  notShadow?: boolean;
  onGetProps?: (modelo: string) => void;
  setModeloId?: (id: number) => void;
}
interface initialState {
  modeloId: number;
}
const initialStateVar = {
  modeloId: 0
};
export const SelectModelo = (props: ISelectModelo): JSX.Element => {
  const { codigoNewsan = 100, notShadow, onGetProps, setModeloId } = props;

  const lineas: ILineaProduccion[] = useAppSelector<ILineaProduccion[]>((state) => state.lineaProduccion.dataAll);
  const lineasP6: ILinea[] = useAppSelector<ILinea[]>((state) => state.linea.dataAll);
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const modeloWatch = watch("modeloId");

  const [modelos, setModelos] = useState<IModelos[]>([]);

  const onGetLineasP6 = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(LineaSliceRequests.getAllSinFiltroRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onGetModelos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const linea = lineasP6.find((line) => line.codigoReparacion == codigoNewsan);
      if (linea) {
        const newModelos = unwrapResult(
          await dispatch(PlanProdSliceRequests.getAllModelosByLineaIdRequest(linea.idLinea))
        );
        setModelos(newModelos);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    if (lineasP6?.length > 0) {
      onGetModelos();
    }
  }, [lineasP6]);
  useEffect(() => {
    if (codigoNewsan != "") {
      onGetLineasP6();
    }
  }, [codigoNewsan]);
  useEffect(() => {
    if (getValues("modeloId") != 0) {
      onGetProps && onGetProps(modelos.find((model) => model.idModelo == getValues("modeloId")).nombre);
    }
  }, [modeloWatch]);
  return (
    <div className={`container m-auto bg-secondaryNew text-center  rounded-lg ${!notShadow && "shadow-elevation-4"}`}>
      <div className={`py-4 grid gap-10 mx-2 h-full `}>
        <Controller
          name="modeloId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Seleccione un modelo</InputLabel>
              <Select {...field} variant="standard">
                {modelos?.map((modelo) => (
                  <MenuItem key={modelo.idModelo} value={modelo.idModelo}>
                    <div className="w-full">
                      <div>{modelo.nombre}</div>
                    </div>
                  </MenuItem>
                ))}
              </Select>
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />
      </div>
    </div>
  );
};
