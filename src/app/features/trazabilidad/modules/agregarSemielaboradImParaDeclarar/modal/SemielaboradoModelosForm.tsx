import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { SemielaboradoModelosSliceRequests } from "app/Middleware/reducers/SemielaboradoModelosSlice";
import { TipoUnidadSliceRequests } from "app/Middleware/reducers/TipoUnidadSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IModelos } from "app/models";
import { ISemielaboradoModelos } from "app/models/ISemielaboradoModelos";
import { ITipoUnidad } from "app/models/ITipoUnidad";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
interface Props {
  semielaboradoId: number;
  refresh: () => void;
  lineaId: number;
}
export const SemielaboradoModelosForm = ({ semielaboradoId, refresh, lineaId }: Props) => {
  const semielaboradosModelos = useAppSelector((state) => state.semielaboradoModelos.dataAll);
  const [modelos, setModelos] = useState<IModelos[]>([]);
  const [modelosFiltrados, setModelosFiltrados] = useState<IModelos[]>([]);
  const [semielaboradoModelos, setSemielaboradoModelos] = useState<ISemielaboradoModelos[]>(null);
  const buttonClasses = MaterialButtons();
  const defaultValuesForm = {
    semielaboradoId,
    modelosId: 0,
    tipoUnidadId: 0
  };
  const { control, reset, handleSubmit, formState, watch, getValues } = useForm({ defaultValues: defaultValuesForm });
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const onSubmit = async (e) => {
    const obj = {
      semielaboradoId: semielaboradoId,
      modelosId: getValues("modelosId")
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(SemielaboradoModelosSliceRequests.PostRequest(obj));
      openNotificationUI("Se agrego correctamente", "success");
      getSemielaboradoModelos();
      refresh();
      reset();
      //getAllModelosByTipoUnidad(tipoUnidadList.find((x) => x.id == watchTipoUnidad)?.nombre);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      //sustituirModelosAgregados();
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const getAllModelosByTipoUnidad = async (tipoUnidad: string) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(ModelosSliceRequests.getModelosByTipoUnidad(tipoUnidad)));
      //const response = unwrapResult(await dispatch(PlanProdSliceRequests.getAllModelosByLineaIdRequest(lineaId)));
      setModelos(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const checkModelo = (idModelo: number) => {
    return semielaboradosModelos.find((semiM) => semiM.modelosId == idModelo) ? false : true;
  };

  const getSemielaboradoModelos = async () => {
    const result = unwrapResult(
      await dispatch(SemielaboradoModelosSliceRequests.getAllBySemiIdRequest(semielaboradoId))
    );
    setSemielaboradoModelos(result);
  };

  //QUITO DE EL SELECT2 DE MODELOS, LOS QUE YA ESTAN CARGADOS.
  const sustituirModelosAgregados = () => {
    const modelosFiltrados = [];

    for (let index = 0; index < modelos.length; index++) {
      const modelo = modelos[index];
      let result = null;
      result = semielaboradoModelos.find((x) => x.modelosId == modelo.idModelo);

      if (!result) modelosFiltrados.push(modelo);
      result = null;
    }
    setModelosFiltrados(modelosFiltrados);
  };

  useEffect(() => {
    getSemielaboradoModelos();
    getListTipoUnidad();
  }, []);

  useEffect(() => {
    //Si hay modelos cargados, los saco del select2 para que no se repita la carga.
    if (semielaboradoModelos && semielaboradoModelos.length > 0) {
      sustituirModelosAgregados();
    } else {
      //Si no hay modelos cargados, inserto los modelos en los filtrados
      setModelosFiltrados(modelos);
    }
  }, [modelos]);

  const [tipoUnidadList, setTipoUnidadList] = useState<ITipoUnidad[]>(null);

  const getListTipoUnidad = async () => {
    const result = unwrapResult(await dispatch(TipoUnidadSliceRequests.getAllRequest()));
    setTipoUnidadList(result);
  };

  const watchTipoUnidad = watch("tipoUnidadId");

  useEffect(() => {
    if (watchTipoUnidad > 0) {
      const tipoUnidad = tipoUnidadList.find((x) => x.id == watchTipoUnidad);
      getAllModelosByTipoUnidad(tipoUnidad.nombre);
    }
  }, [watchTipoUnidad]);

  return (
    <div>
      <form className="m-4 py-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid sm:grid-row-2 sm:gap-4 w-full">
          <Controller
            name="tipoUnidadId"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un Tipo de Unidad</InputLabel>
                <Select {...field} variant="standard">
                  {tipoUnidadList &&
                    tipoUnidadList.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <div>{x.nombre}</div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && <FormHelperText>{error.type == "validate" && <h1>El modelo ya existe</h1>}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="modelosId"
            control={control}
            rules={{ required: true, min: 1, validate: checkModelo }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un modelo</InputLabel>
                <Select {...field} variant="standard">
                  {modelosFiltrados &&
                    modelosFiltrados.map((x) => (
                      <MenuItem key={x.idModelo} value={x.idModelo}>
                        <div>{x.codigoModelo}</div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && <FormHelperText>{error.type == "validate" && <h1>El modelo ya existe</h1>}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="pt-1 flex justify-around border-t-2">
          <Button
            className={buttonClasses.blueButton}
            disabled={!formState.isDirty && !formState.isValid}
            variant="contained"
            type="submit">
            Agregar
          </Button>
        </div>
      </form>
    </div>
  );
};
