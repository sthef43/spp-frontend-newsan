import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { ZPL_TipoEtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_TipoEtiquetasSlice";
import { ZPL_FamiliasSliceRequests } from "app/Middleware/reducers/ZPL_FamiliasSlice";
import { ZPL_ProductosSliceRequests } from "app/Middleware/reducers/ZPL_ProductosSlice";
import { ZPL_EtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_EtiquetasSlice";
import moment from "moment";
import { ZPL_ImpresionesSliceRequests } from "app/Middleware/reducers/ZPL_ImpresionesSlice";

interface props {
  setUltNumImpreso: any; //Retorna el ultimo numero impreso para los datos seleccionados.
  setEtiquetaSeleccionadaFuncion: any; //Retorna la etiqueta seleccionada
  setProductoSeleccionadoFuncion: any; //Retorna el producto seleccionado
  setFamiliaSeleccionadaFuncion: any; //Retornda la familia seleciconada.
  buscoCorrecto: any; //Si la busqueda fue correcta, pone true, otro caso, falso.
}

export const EncabezadoParametrosImpresion = ({
  setUltNumImpreso,
  setEtiquetaSeleccionadaFuncion,
  setProductoSeleccionadoFuncion,
  setFamiliaSeleccionadaFuncion,
  buscoCorrecto
}: props) => {
  const dispatch = useAppDispatch();
  const [tipoEtiquetas, setTipoEtiquetas] = useState([]);
  const [productos, setProductos] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [etiquetas, setEtiquetas] = useState([]);
  const [familias, setFamilias] = useState([]);

  interface initialState {
    tipoEtiquetaId: number;
    familiaId: number;
    productoId: number;
    etiquetaId: number;
  }
  const initialStateVar = {
    tipoEtiquetaId: 0,
    familiaId: 0,
    productoId: 0,
    etiquetaId: 0
  };
  const { control, getValues, watch, setValue } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  useEffect(() => {
    getListGeneric(ZPL_TipoEtiquetasSliceRequests.getAllRequest(), setTipoEtiquetas);
    getListGeneric(ZPL_FamiliasSliceRequests.getAllRequest(), setFamilias);
  }, []);

  const watchEtiqueta = watch("etiquetaId");
  const watchProductoId = watch("productoId");
  const watchFamiliaId = watch("familiaId");
  const watchTipoEtiquetaId = watch("tipoEtiquetaId");

  const getListGeneric = async (funcionSlice, set) => {
    const responses = unwrapResult(await dispatch(funcionSlice));
    set(JSON.parse(JSON.stringify(responses)));
  };

  useEffect(() => {
    if (watchEtiqueta != 0) {
      const etiquetaSeleccionada = etiquetas.find((x) => x.id == getValues("etiquetaId"));
      setEtiquetaSeleccionadaFuncion(etiquetaSeleccionada);
      console.log(etiquetaSeleccionada);
    }
    buscoCorrecto(false);
  }, [watchEtiqueta]);

  useEffect(() => {
    if (watchProductoId != 0) {
      const productoSeleccionado = productos.find((x) => x.id == getValues("productoId"));
      setProductoSeleccionadoFuncion(productoSeleccionado);
      buscoCorrecto(false);
      console.log(productoSeleccionado);
    }
  }, [watchProductoId]);

  useEffect(() => {
    if (watchFamiliaId != 0) {
      const familiaSeleccionada = familias.find((x) => x.id == getValues("familiaId"));
      setFamiliaSeleccionadaFuncion(familiaSeleccionada);
      buscoCorrecto(false);
    }
  }, [watchFamiliaId]);

  useEffect(() => {
    buscoCorrecto(false);
    setValue("familiaId", 0);
    setValue("productoId", 0);
  }, [watchTipoEtiquetaId]);

  //Lleno el select de familias segun lineaProducicon
  const getProductosByFamilia = async () => {
    const familiaId = getValues("familiaId");
    if (familiaId != 0) {
      let responses = unwrapResult(await dispatch(ZPL_ProductosSliceRequests.getAllRequest()));
      const etiquetaSeleccionada = etiquetas.find((x) => x.id == getValues("etiquetaId"));
      responses = responses.filter((x) => x.idFamilia == familiaId); //Filtro por familia
      console.log(responses.length);

      if (etiquetaSeleccionada && etiquetaSeleccionada.tipoEquipo != null) {
        //Filtro por tipoEquipo segun etiquetaSeleccionada
        console.log(responses.length);
        responses = responses.filter((x) => x.tipoEquipo == etiquetaSeleccionada.tipoEquipo);
      }
      setProductos(JSON.parse(JSON.stringify(responses)));
    }
  };

  const getTipoEtiquetaSeleccionada = () => {
    const etiquetaSeleccionada = etiquetas.find((x) => x.id == getValues("etiquetaId"));
    const tipoEtiquetaSeleccionada = tipoEtiquetas.find((x) => x.id == etiquetaSeleccionada.tipoEtiqueta);
    return tipoEtiquetaSeleccionada;
  };

  const getUltimoNumeroImpreso = async (tipoEtiqueta, familiaId, cambiaMes, prefijo) => {
    console.log(prefijo);

    let result = [];
    const year = moment().year();
    const tipoEtiquetaSeleccionada = getTipoEtiquetaSeleccionada();
    //Si tiene inicioEBS = true, y no existen registros, tiene q empezar de 1000 la impresion.
    if (tipoEtiquetaSeleccionada.inicioEBS) {
      result = unwrapResult(
        await dispatch(
          ZPL_ImpresionesSliceRequests.getAllByTipoEtiquetaAndFamiliaId({
            tipoEtiqueta: tipoEtiqueta,
            productoId: getValues("productoId")
          })
        )
      );
    }
    //Si cambia mes = true, busca las ultimas impresiones por mes y año
    else if (cambiaMes) {
      const month = moment().month() + 1;
      const params = { tipoEtiqueta: tipoEtiqueta, familiaId: familiaId, month: month, year: year };
      result = unwrapResult(await dispatch(ZPL_ImpresionesSliceRequests.getAllByMonthAndYear(params)));
    } else {
      //sino cambia mes, solo busca por año
      const params = { tipoEtiqueta: tipoEtiqueta, familiaId: familiaId, prefijo: prefijo };
      result = unwrapResult(
        await dispatch(ZPL_ImpresionesSliceRequests.GetAllByTipoEtiquetaAndFamiliaAndPrefijo(params))
      );
    }
    if (result) {
      if (result.length > 0) {
        //Si hay impresiones, obtengo el ultimo numero impreso.
        const ultimoRegistroImpreso = result[result.length - 1];
        setUltNumImpreso(ultimoRegistroImpreso.numeradorHasta);
      } else setUltNumImpreso(0);
    } else setUltNumImpreso(0);
  };

  const controlTipoEquipo = () => {
    if (getValues("etiquetaId") && getValues("productoId")) {
      const etiquetaSeleccionada = etiquetas.find((x) => x.id == getValues("etiquetaId"));
      const productoSeleccionado = productos.find((x) => x.id == getValues("productoId"));
      if (etiquetaSeleccionada.tipoEquipo != null && etiquetaSeleccionada.tipoEquipo != productoSeleccionado.tipoEquipo)
        openNotificationUI(
          "Está seleccionando un TIPO DE ETIQUETA que no se corresponde al PRODUCTO seleccionado",
          "warning"
        );
      else {
        getUltimoNumeroImpreso(
          etiquetaSeleccionada.tipoEtiqueta,
          productoSeleccionado.idFamilia,
          etiquetaSeleccionada.cambiaMes,
          etiquetaSeleccionada.prefijo
        );
        buscoCorrecto(true);
      }
    } else openNotificationUI("Seleccione Etiqueta, Familia y Producto.", "warning");
  };

  const getEtiquetas = async () => {
    const tipoEtiquetaId = getValues("tipoEtiquetaId");
    if (tipoEtiquetaId == 0) return;
    const result = unwrapResult(await dispatch(ZPL_EtiquetasSliceRequests.getListByTipoEtiquetaId(tipoEtiquetaId)));
    if (result) {
      setEtiquetas(result);
    }
  };

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
            {etiquetas && (
              <Controller
                name="etiquetaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Etiqueta</InputLabel>
                    <Select {...field} variant="standard">
                      {etiquetas &&
                        etiquetas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.descripcionEtiqueta + " - " + x.prefijo}</div>
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
          {
            <div>
              {familias && (
                <Controller
                  name="familiaId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Familia</InputLabel>
                      <Select {...field} variant="standard" onClick={() => getProductosByFamilia()}>
                        {familias &&
                          familias.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.codigoFamilia}</div>
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
          }
          {
            <div>
              {productos && (
                <Controller
                  name="productoId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Producto</InputLabel>
                      <Select {...field} variant="standard">
                        {productos &&
                          productos.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.codigoEBS}</div>
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
          }
          <div>
            <Button onClick={controlTipoEquipo}>Buscar</Button>
          </div>
        </div>
      </form>
    </div>
  );
};
