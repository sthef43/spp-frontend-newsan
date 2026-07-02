import { IDotaFamilia } from "app/models/IDotaFamilia";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import React, { useState, useEffect } from "react";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import {
  InputLabel,
  MenuItem,
  Select,
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Typography
} from "@mui/material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { IPlant } from "app/models";
import { DotaFamiliaSliceRequests } from "app/Middleware/reducers/DotaFamiliaSlice";

interface props {
  dotaFamiliaSelected: number;
  setRefreshFamilia: any;
}
export const AccionLineasOfFamilia = ({ dotaFamiliaSelected, setRefreshFamilia }: props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [plantas, setPlantas] = useState<IPlant[]>();
  const [lineasCombo, setLineasCombo] = useState<ILineaProduccion[]>([]);
  const [dotaFamilia, setDotaFamilia] = useState<IDotaFamilia>();

  interface initialState {
    plantId: number;
    lineaProduccionId: number;
  }
  const initialStateVar = {
    plantId: 0,
    lineaProduccionId: 0
  };
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const watchPlanta = watch("plantId");
  const watchLinea = watch("lineaProduccionId");

  useEffect(() => {
    if (dotaFamiliaSelected) getDotaFamilia();
    getPlantas();
  }, []);

  useEffect(() => {
    if (watchPlanta != 0) {
      getLineas();
    }
  }, [watchPlanta]);

  const getDotaFamilia = async () => {
    const result = unwrapResult(await dispatch(DotaFamiliaSliceRequests.getByIdRequest(dotaFamiliaSelected)));
    if (!result) console.log("sin dotafamilia");
    setDotaFamilia(result);
  };

  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) setPlantas(result);
    else setPlantas([]);
  };

  const getLineas = async () => {
    const result = unwrapResult(await dispatch(LineaProduccionSliceRequests.getAllRequest()));
    if (!result) {
      // console.log("sin linas de produccion");
      return false;
    }
    setLineasCombo(result.filter((x) => x.plantId == watchPlanta));
  };

  const guardar = async () => {
    if (watchLinea == 0) openNotificationUI("Seleccione una linea", "warning");
    //Le asigno una linea a la familia updeteo.
    const objectFam: IDotaFamilia = { ...dotaFamilia, lineaProduccionId: watchLinea };
    const result = unwrapResult(await dispatch(DotaFamiliaSliceRequests.PutRequest(objectFam)));
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      getDotaFamilia();
      setRefreshFamilia(true);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center">
        <Typography variant="h3">{dotaFamilia && dotaFamilia.nombre}</Typography>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="p-2 w-80">
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
        </div>
        <div className="p-2 w-80">
          {lineasCombo && lineasCombo.length > 0 ? (
            <Controller
              name="lineaProduccionId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione una linea</InputLabel>
                  <Select {...field} variant="standard">
                    {lineasCombo?.map((x) => (
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
        </div>
        <Button className="text-center" onClick={guardar}>
          Guardar
        </Button>
      </div>
      <div className="text-center">
        <Typography variant="h3">
          {dotaFamilia && dotaFamilia.lineaProduccionId != null
            ? dotaFamilia.lineaProduccion.nombre
            : "SIN LINEA ASIGNADA."}
        </Typography>
      </div>
    </div>
  );
};
