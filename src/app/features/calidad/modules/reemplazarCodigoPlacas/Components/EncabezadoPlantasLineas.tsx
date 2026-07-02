/* eslint-disable unused-imports/no-unused-vars */
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { SemielaboradoTipoSliceRequests } from "app/Middleware/reducers/SemielaboradoTipoSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILineaProduccionFamilia } from "app/models";
import { IModelo } from "app/models/IModelo";
import { ISemielaboradoTipo } from "app/models/ISemielaboradoTipo";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface initialState {
  plantaId: number;
  lineaProduccionId: number;
  lineaProduccionFamiliaId: number;
  modeloId: number;
  semielaboradoTipoId: number;
}
const initialStateVar = {
  plantaId: 0,
  lineaProduccionId: 0,
  lineaProduccionFamiliaId: 0,
  modeloId: 0,
  semielaboradoTipoId: 0
};

export const EncabezadoPlantasLineas = ({
  setLineaProduccionSelected,
  setFamiliaSelected,
  setSemielaboradoTipoSelected,
  setModeloSelected
}: any) => {
  const { control, getValues, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const [lineaProduccionFamilias, setLineaProduccionFamilias] = useState<ILineaProduccionFamilia[]>(null);

  const [plantas, setPlantas] = useState(null);
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const [lineasProduccion, setLineasProduccion] = useState(null);

  const watchLineaProduccion = watch("lineaProduccionId");
  const watchFamilia = watch("lineaProduccionFamiliaId");
  const watchSemielaboradoTipo = watch("semielaboradoTipoId");
  const watchModelo = watch("modeloId");

  const getPlantas = async () => {
    let responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    responses = JSON.parse(JSON.stringify(responses));
    setPlantas(responses);
  };

  const getLineasProduccionByPlanta = async () => {
    const plantaId = getValues("plantaId");
    if (plantaId != 0) {
      let responses = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantaId)));
      responses = JSON.parse(JSON.stringify(responses));
      setLineasProduccion(responses);
    }
  };

  //Lleno el select de familias segun lineaProducicon
  const getFamiliasByLineaProduccion = async () => {
    const lineaProduccionId = getValues("lineaProduccionId");
    if (lineaProduccionId != 0) {
      let responses = unwrapResult(await dispatch(LineaProduccionFamiliaSliceRequests.getAllRequest()));
      responses = responses.filter((x) => x.lineaProduccionId == lineaProduccionId);
      setLineaProduccionFamilias(JSON.parse(JSON.stringify(responses)));
    }
  };

  const [modelos, setModelos] = useState<IModelo[]>();
  const getModelos = async (familiaId: number) => {
    let responses = unwrapResult(await dispatch(ModeloSliceRequest.getAllByFamiliaId(familiaId)));
    responses = JSON.parse(JSON.stringify(responses));
    setModelos(responses);
  };

  const [semielaboradoTipos, setSemielaboradoTipos] = useState<ISemielaboradoTipo[]>();
  const getSemielaboradoTipos = async () => {
    let responses = unwrapResult(await dispatch(SemielaboradoTipoSliceRequests.getAllRequest()));
    responses = JSON.parse(JSON.stringify(responses));
    setSemielaboradoTipos(responses);
  };

  useEffect(() => {
    if (watchLineaProduccion > 0) {
      const obj = lineasProduccion.find((x) => x.id == watchLineaProduccion);
      setLineaProduccionSelected(obj);
    }
  }, [watchLineaProduccion]);

  useEffect(() => {
    if (watchFamilia) {
      const lineaProduccionFam = lineaProduccionFamilias.find((x) => x.id == watchFamilia);
      setFamiliaSelected(lineaProduccionFam.familia);
      console.log("guarde esta familia");
      console.log(lineaProduccionFam);

      getModelos(lineaProduccionFam.familiaId);
    }
  }, [watchFamilia]);

  useEffect(() => {
    if (watchSemielaboradoTipo > 0) {
      const semiTipo = semielaboradoTipos.find((x) => x.id == watchSemielaboradoTipo);
      setSemielaboradoTipoSelected(semiTipo);
    }
  }, [watchSemielaboradoTipo]);

  useEffect(() => {
    if (watchModelo) {
      const mod = modelos.find((x) => x.id == watchModelo);
      setModeloSelected(mod);
    }
  }, [watchModelo]);

  React.useEffect(() => {
    TitleChanger("");
    getPlantas();
    getSemielaboradoTipos();
  }, []);

  return (
    <div>
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-5 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          <div>
            {plantas && (
              <Controller
                name="plantaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione una Planta"
                      variant="standard"
                      onClick={() => getLineasProduccionByPlanta()}>
                      {plantas &&
                        plantas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.name}</div>
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
            {lineasProduccion && (
              <Controller
                name="lineaProduccionId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Linea Produccion</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione una Linea de Produccion"
                      variant="standard"
                      onClick={() => getFamiliasByLineaProduccion()}>
                      {lineasProduccion &&
                        lineasProduccion.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
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
            {lineaProduccionFamilias && (
              <Controller
                name="lineaProduccionFamiliaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Familia</InputLabel>
                    <Select {...field} placeholder="Seleccione una Familia" variant="standard">
                      {lineaProduccionFamilias &&
                        lineaProduccionFamilias.map((x) => (
                          <MenuItem key={x.familia.nombre} value={x.id}>
                            <div className="w-full">
                              <div>{x.familia.nombre}</div>
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
            {modelos && (
              <Controller
                name="modeloId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Modelo</InputLabel>
                    <Select {...field} placeholder="Seleccione un modelo" variant="standard">
                      {modelos &&
                        modelos.map((x) => (
                          <MenuItem key={x.nombre} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
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
            {semielaboradoTipos && (
              <Controller
                name="semielaboradoTipoId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo Semi</InputLabel>
                    <Select {...field} placeholder="Seleccione un tipo de semielaborado" variant="standard">
                      {semielaboradoTipos &&
                        semielaboradoTipos.map((x) => (
                          <MenuItem key={x.nombre} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
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
        </div>
      </form>
    </div>
  );
};
