/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Select, MenuItem, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { IContPlanProduccion } from "app/models/IContPlanProduccion";
import { ContPlantaSliceRequests } from "app/Middleware/reducers/ContPlantaSlice";
import { toUpper } from "lodash";
import { ContPlanProduccionSliceRequests } from "app/Middleware/reducers/ContPlanProduccionSlice";
interface props {
  setOpenPopup: any;
  editState?: IContPlanProduccion | null;
  refresh?: any;
  estaEditando: any;
}

export const PedidosForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  console.log(editState);
  const classes = MaterialButtons();
  interface initialState {
    contPlantaId: number;
    lineaExcel: number;
    linea: string;
    modelo: string;
    lote: string;
    cantidad: string;
    po: string;
    abierto: boolean;
  }
  const initialStateVar = {
    contPlantaId: 0,
    lineaExcel: 0,
    linea: "",
    modelo: "",
    lote: "",
    cantidad: "",
    po: "",
    abierto: true
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
    return () => {
      //
    };
  }, [errors]);

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    console.log(e);
    let result;
    const objectSubmit = {
      ...e,
      contPlanta: null,
      linea: toUpper(e.linea),
      modelo: toUpper(e.modelo),
      lote: toUpper(e.lote),
      cantidad: toUpper(e.cantidad),
      po: toUpper(e.po)
    };
    console.log(objectSubmit);
    try {
      if (editState) {
        result = unwrapResult(await dispatch(ContPlanProduccionSliceRequests.PutRequest(objectSubmit)));
      } else {
        result = unwrapResult(await dispatch(ContPlanProduccionSliceRequests.PostRequest(objectSubmit)));
      }
      openNotificationUI("Guardado...", "success");
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
      result = null;
    }
  };

  //Cargo lista con Plantas
  const [listPlantas, setListPlantas] = useState([]);
  const getListPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(ContPlantaSliceRequests.getAllRequest()));
      setListPlantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer Plantas.", "error");
    }
  };
  useEffect(() => {
    console.log(listPlantas);
  }, [listPlantas]);

  useEffect(() => {
    getListPlantas();
  }, []);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className=" flex-col grid grid-cols-4 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="contPlantaId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select {...field} placeholder="Seleccione un Tipo de Ubicación" variant="standard">
                      {listPlantas &&
                        listPlantas.map((x) => (
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
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="lineaExcel"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Línea de Excel"
                      variant="standard"
                      type="number"
                      inputProps={{ maxLength: 1, style: { textTransform: "uppercase" } }}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e.target.value.toUpperCase());
                      //   concatenarCodigo("vProducto");
                      // }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="linea"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Línea"
                      variant="standard"
                      type="text"
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e.target.value.toUpperCase());
                      //   concatenarCodigo("vProducto");
                      // }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="modelo"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Modelo"
                      variant="standard"
                      type="text"
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e.target.value.toUpperCase());
                      //   concatenarCodigo("vProducto");
                      // }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className=" flex-col grid grid-cols-3 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="lote"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Lote"
                      variant="standard"
                      type="text"
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e.target.value.toUpperCase());
                      //   concatenarCodigo("vProducto");
                      // }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="cantidad"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Cantidad"
                      variant="standard"
                      type="text"
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e.target.value.toUpperCase());
                      //   concatenarCodigo("vProducto");
                      // }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="po"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="PO"
                      variant="standard"
                      type="text"
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e.target.value.toUpperCase());
                      //   concatenarCodigo("vProducto");
                      // }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
