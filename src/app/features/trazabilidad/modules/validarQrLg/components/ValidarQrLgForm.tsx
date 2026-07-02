/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Select, MenuItem, Grid, Input } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { IValidarQrLg } from "app/models/IValidarQrLg";
import { PlantSliceRequests, ProductoSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { ValidarQrLgSliceRequests } from "app/Middleware/reducers/ValidarQrLgSlice";
interface props {
  setOpenPopup: any;
  editState?: IValidarQrLg | null;
  refresh?: any;
  estaEditando: any;
}

export const ValidarQrLgForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    plantaId: number;
    lineaId: number;
    modeloId: number;
    familiaId: number;
    productoId: number;
    codigo: string;
  }
  const initialStateVar = {
    plantaId: editState.plantaId,
    lineaId: editState.lineaId,
    productoId: editState.productoId,
    modeloId: 0,
    familiaId: 0,
    codigo: ""
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    let result;
    const objectSubmit = {
      ...e,
      planta: null,
      linea: null,
      modelo: null,
      familia: null,
      producto: null
    };
    // console.log(objectSubmit);
    try {
      if (estaEditando) {
        result = unwrapResult(await dispatch(ValidarQrLgSliceRequests.PutRequest(objectSubmit)));
      } else {
        result = unwrapResult(await dispatch(ValidarQrLgSliceRequests.PostRequest(objectSubmit)));
      }
      if (result) {
        openNotificationUI("Guardado...", "success");
        refresh();
        setOpenPopup(false);
      } else {
        openNotificationUI("Código Duplicado.", "error");
      }
    } catch (x) {
      console.log(result);
      openNotificationUI("Error al guardar.", "error");
      result = null;
    }
  };

  //Leer Plantas
  const [listPlantas, setListPantas] = useState([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //Leer Líneas por planta
  const [listLineas, setListLineas] = useState([]);
  const getLineas = async () => {
    try {
      const responses = unwrapResult(
        await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(watchPlanta))
      );
      setListLineas(responses);
    } catch (error) {
      openNotificationUI("Error al leer lineas.", "error");
    }
  };

  //Leer Producto
  const [listProducto, setListProducto] = useState([]);
  const getProducto = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      setListProducto(responses);
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };

  //Leer Familia
  const [listFamilia, setListFamilia] = useState([]);
  const getFamilia = async () => {
    try {
      const responses = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(watchProducto)));
      setListFamilia(responses);
    } catch (error) {
      openNotificationUI("Error al leer familia.", "error");
    }
  };

  //Leer Modelo
  const [listModelo, setListModelo] = useState([]);
  const getModelo = async () => {
    try {
      const responses = unwrapResult(await dispatch(ModeloSliceRequest.getAllByFamiliaId(watchFamilia)));
      setListModelo(responses);
    } catch (error) {
      openNotificationUI("Error al leer modelo.", "error");
    }
  };

  //Watch
  const watchPlanta = watch("plantaId");
  useEffect(() => {
    if (watchPlanta) {
      getLineas();
    }
  }, [watchPlanta]);

  const watchLinea = watch("lineaId");
  useEffect(() => {
    if (watchLinea) {
      getProducto();
    }
  }, [watchLinea]);

  const watchProducto = watch("productoId");
  useEffect(() => {
    if (watchProducto) {
      getFamilia();
    }
  }, [watchProducto]);

  const watchFamilia = watch("familiaId");
  useEffect(() => {
    if (watchFamilia) {
      getModelo();
    }
  }, [watchFamilia]);

  //Cargo lista inicial
  useEffect(() => {
    getPlantas();
  }, []);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Controller
                name="plantaId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select {...field} placeholder="Seleccione Planta" variant="standard">
                      {listPlantas &&
                        listPlantas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.name}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="lineaId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Línea</InputLabel>
                    <Select {...field} placeholder="Seleccione Línea" variant="standard">
                      {listLineas &&
                        listLineas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="productoId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Producto</InputLabel>
                    <Select {...field} placeholder="Seleccione Producto" variant="standard">
                      {listProducto &&
                        listProducto.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: "3%" }}>
            <Grid item xs={4}>
              <Controller
                name="familiaId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Familia</InputLabel>
                    <Select {...field} placeholder="Seleccione Familia" variant="standard">
                      {listFamilia &&
                        listFamilia.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="modeloId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Modelo</InputLabel>
                    <Select {...field} placeholder="Seleccione Modelo" variant="standard">
                      {listModelo &&
                        listModelo.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="codigo"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Código</InputLabel>
                    <Input {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%", marginTop: "3%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
