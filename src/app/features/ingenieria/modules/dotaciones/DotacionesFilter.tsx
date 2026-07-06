import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller, useForm } from "react-hook-form";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { IPlant } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { IDotaFamilia } from "app/models/IDotaFamilia";
import { DotaFamiliaSliceRequests } from "app/features/ingenieria/slices/DotaFamiliaSlice";

interface props {
  setDatosFiltro: any;
  datosFiltro: any;
  refreshFamilia: any;
}

export const DotacionesFilter = ({ setDatosFiltro, datosFiltro, refreshFamilia }: props) => {
  const dispatch = useAppDispatch();
  const [lineas, setLineas] = useState<ILineaProduccion[]>();
  const [plantas, setPlantas] = useState<IPlant[]>();
  const [dotaFamilias, setDotaFamilias] = useState<IDotaFamilia[]>();

  interface initialState {
    plantId: number;
    lineaProduccionId: number;
    dotaFamiliaId: number;
  }
  const initialStateVar = {
    plantId: 0,
    lineaProduccionId: 0,
    dotaFamiliaId: 0
  };
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const watchPlanta = watch("plantId");
  const watchLinea = watch("lineaProduccionId");
  const watchDotaFamilia = watch("dotaFamiliaId");

  useEffect(() => {
    if (watchPlanta != 0) {
      getLineas();
      setDatosFiltro({ ...datosFiltro, plantId: getValues("plantId") });
    }
  }, [watchPlanta]);

  useEffect(() => {
    if (watchLinea != 0) {
      setDatosFiltro({ ...datosFiltro, lineaProduccionId: watchLinea });
      getDotaFamiliasByLineaProduccion();
    }
  }, [watchLinea]);

  useEffect(() => {
    if (watchDotaFamilia != 0) {
      setDatosFiltro({ ...datosFiltro, dotaFamiliaId: watchDotaFamilia });
    }
  }, [watchDotaFamilia]);

  useEffect(() => {
    getPlantas();
  }, []);

  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) setPlantas(result);
    else setPlantas([]);
  };

  const getLineas = async () => {
    const result = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(watchPlanta)));
    if (result) setLineas(result);
    else setLineas([]);
  };

  const getDotaFamiliasByLineaProduccion = async () => {
    const result = unwrapResult(await dispatch(DotaFamiliaSliceRequests.getAllRequest()));
    if (result) setDotaFamilias(result.filter((x) => x.lineaProduccionId == watchLinea));
    else setDotaFamilias([]);
  };

  //Refresca el listado de familia, cada vez que se agrega una nueva.
  useEffect(() => {
    if (refreshFamilia) getDotaFamiliasByLineaProduccion();
  }, [refreshFamilia]);

  return (
    <div className="w-full">
      <Accordion sx={{ marginBottom: "10px" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content">
          <Typography sx={{ textAlign: "center", justifyContent: "center", width: "100%" }}>FILTROS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="m-4 p-2">
            <div className="container m-auto bg-secondaryNew text-center  rounded-lg shadow-elevation-4">
              <div className={`py-4 gap-6 mx-2 h-full flex flex-col minnotebook:flex-row`}>
                {plantas && (
                  <Controller
                    name="plantId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Seleccione una planta</InputLabel>
                        <Select {...field} variant="standard">
                          {plantas?.map((x) => (
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
                {lineas && lineas.length > 0 ? (
                  <Controller
                    name="lineaProduccionId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Seleccione una linea</InputLabel>
                        <Select {...field} variant="standard">
                          {lineas?.map((x) => (
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
                ) : (
                  <TextField value="Sin lineas asignadas" disabled />
                )}
                {dotaFamilias && (
                  <Controller
                    name="dotaFamiliaId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Seleccione una familia</InputLabel>
                        <Select {...field} variant="standard">
                          {dotaFamilias?.map((x) => (
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
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
