import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { ZPL_TipoEtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_TipoEtiquetasSlice";
import { ZPL_EtiquetaFijaSliceRequests } from "app/Middleware/reducers/ZPL_EtiquetaFijaSlice";
import { ZPL_ImpresionesEtiquetaFijaSliceRequests } from "app/Middleware/reducers/ZPL_ImpresionesEtiquetaFijaSlice";

interface props {
  setUltimoNumImpreso: any; //Retorna el ultimo numero impreso para los datos seleccionados.
  setEtiquetaFijaSeleccionadaFuncion: any;
  setTipoEtiquetaSeleccionadaFuncion: any;
  buscoCorrecto: any; //Si la busqueda fue correcta, pone true, otro caso, falso.
  setListEtiquetasFijas: any; //El set de listado de las etiquetasFijas, que me trae el listado de etiquetas para ese modelo
  refreshModelos: any; //Para saber si tiene que refrescar el select2 de Modelos
}

export const EncabezadoParametrosImpresionEstaticaHibrida = ({
  setUltimoNumImpreso,
  setEtiquetaFijaSeleccionadaFuncion,
  setTipoEtiquetaSeleccionadaFuncion,
  buscoCorrecto,
  setListEtiquetasFijas,
  refreshModelos
}: props) => {
  const dispatch = useAppDispatch();
  const [tipoEtiquetas, setTipoEtiquetas] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [etiquetasFijas, setEtiquetasFijas] = useState([]);
  const [familias, setFamilias] = useState([]);

  interface initialState {
    tipoEtiquetaId: number;
    etiquetaFijaId: number;
  }
  const initialStateVar = {
    tipoEtiquetaId: 0,
    etiquetaFijaId: 0
  };
  const { control, getValues, watch, setValue } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  useEffect(() => {
    getListGeneric(ZPL_TipoEtiquetasSliceRequests.getListByEstadoRequest("hibrido"), setTipoEtiquetas);
  }, []);

  const watchEtiquetaFija = watch("etiquetaFijaId");
  const watchTipoEtiquetaId = watch("tipoEtiquetaId");

  const getListGeneric = async (funcionSlice, set) => {
    const responses = unwrapResult(await dispatch(funcionSlice));
    set(JSON.parse(JSON.stringify(responses)));
  };

  useEffect(() => {
    buscoCorrecto(false);
    if (watchTipoEtiquetaId > 0) {
      const tipoEtiquetaFijaSeleccionada = tipoEtiquetas.find((x) => x.id == watchTipoEtiquetaId);
      setTipoEtiquetaSeleccionadaFuncion(tipoEtiquetaFijaSeleccionada);
    }
  }, [watchTipoEtiquetaId]);

  const getUltimoNumeroImpreso = async () => {
    let result = [];
    result = unwrapResult(
      await dispatch(ZPL_ImpresionesEtiquetaFijaSliceRequests.getListByEtiquetaFijaId(watchEtiquetaFija))
    );
    if (result) {
      if (result.length > 0) {
        //Si hay impresiones, obtengo el ultimo numero impreso.
        const ultimoRegistroImpreso = result[0].zpL_Impresiones?.numeradorHasta;
        setUltimoNumImpreso(ultimoRegistroImpreso);
        setListEtiquetasFijas(result);
      } else setUltimoNumImpreso(0);
    } else setUltimoNumImpreso(0);
  };

  const handleBuscar = () => {
    if (getValues("etiquetaFijaId") && getValues("tipoEtiquetaId")) {
      getUltimoNumeroImpreso();
      buscoCorrecto(true);
    } else openNotificationUI("Seleccione Tipo Etiqueta y Modelo", "warning");
  };

  const getEtiquetas = async () => {
    const tipoEtiquetaId = getValues("tipoEtiquetaId");
    if (tipoEtiquetaId == 0) return;
    const result = unwrapResult(await dispatch(ZPL_EtiquetaFijaSliceRequests.getListByTipoEtiquetaId(tipoEtiquetaId)));
    if (result) {
      setEtiquetasFijas(result);
    }
  };

  useEffect(() => {
    if (watchEtiquetaFija > 0) {
      const etiquetaFijaSeleccionada = etiquetasFijas.find((x) => x.id == watchEtiquetaFija);
      setEtiquetaFijaSeleccionadaFuncion(etiquetaFijaSeleccionada);
    }
  }, [watchEtiquetaFija]);

  useEffect(() => {
    if (refreshModelos == true) {
      getEtiquetas();
      setValue("etiquetaFijaId", 0);
    }
  }, [refreshModelos]);

  return (
    <div className="p-2">
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-5 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          <div>
            {tipoEtiquetas && (
              <Controller
                name="tipoEtiquetaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo Etiqueta</InputLabel>
                    <Select
                      {...field}
                      variant="standard"
                      onClick={() => {
                        getEtiquetas();
                      }}>
                      {tipoEtiquetas &&
                        tipoEtiquetas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.descripcionTipoEtiqueta}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            )}
          </div>
          <div>
            {etiquetasFijas && (
              <Controller
                name="etiquetaFijaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Modelo</InputLabel>
                    <Select {...field} variant="standard">
                      {etiquetasFijas &&
                        etiquetasFijas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.modelo}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            )}
          </div>
          <div>
            <Button onClick={handleBuscar}>Buscar</Button>
          </div>
        </div>
      </form>
    </div>
  );
};
