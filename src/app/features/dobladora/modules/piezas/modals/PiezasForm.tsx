/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Select,
  MenuItem,
  TextField,
  Grid
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { IDobSemi } from "app/models/IDobSemi";
import { DobTipoAASliceRequests } from "app/Middleware/reducers/DobTipoAASlice";
import { DobCapacidadSliceRequests } from "app/Middleware/reducers/DobCapacidadSlice";
import { DobTipoFrigoriaSliceRequests } from "app/Middleware/reducers/DobTipoFrigoriaSlice";
import { DobProveedorSliceRequests } from "app/Middleware/reducers/DobProveedorSlice";
import { DobSubEnsambleSliceRequests } from "app/Middleware/reducers/DobSubEnsambleSlice";
import { DobSemiSliceRequests } from "app/Middleware/reducers/DobSemiSlice";
interface props {
  setOpenPopup: any;
  editState?: IDobSemi | null;
  refresh?: any;
  estaEditando: any;
}

export const PiezasForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    codigo: string;
    descripcion: string;
    dobTipoAAId: number;
    dobCapacidadId: number;
    dobTipoFrigoriaId: number;
    dobProveedorId: number;
    versionProducto: string;
    versionPieza: string;
    dobSubEnsambleId: number;
    n1SubEnsamble: number;
    n2SubEnsamble: number;
  }
  const initialStateVar = {
    codigo: "",
    descripcion: "",
    dobTipoAAId: 0,
    dobCapacidadId: 0,
    dobTipoFrigoriaId: 0,
    dobProveedorId: 0,
    dobSubEnsambleId: 0,
    versionProducto: "",
    versionPieza: "",
    n1SubEnsamble: null,
    n2SubEnsamble: null
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

  const loginSubmit = async (e) => {
    let result;
    console.log(e);
    const objectSubmit = {
      ...e,
      dobCapacidad: null,
      dobProvedor: null,
      dobSubEnsamble: null,
      dobTipoAA: null,
      dobTipoFrigoria: null
    };
    try {
      if (editState) {
        result = await dispatch(DobSemiSliceRequests.PutRequest(JSON.parse(JSON.stringify(objectSubmit))));
      } else {
        result = await dispatch(DobSemiSliceRequests.PostRequest(JSON.parse(JSON.stringify(objectSubmit))));
      }
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
      result = null;
    }
    console.log(result);
    if (result.payload == "") {
      openNotificationUI("Código duplicado de pieza", "error");
      // setOpenPopup(false);
      // refresh();
    } else {
      openNotificationUI("Guardado...", "success");
      // setOpenPopup(false);
      refresh();
    }
  };

  //Cargo los comboBox con las Selecciones de Tablas
  useEffect(() => {
    getListDobTipoAA();
    getListDobCapacidad();
    getListDobTipoFrigoria();
    getListDobProveedor();
    getListDobSubEnsamble();
  }, []);

  const [listDobTipoAA, setlistDobTipoAA] = useState([]);
  const getListDobTipoAA = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobTipoAASliceRequests.getAllRequest()));
      setlistDobTipoAA(result);
    } catch (error) {
      openNotificationUI("Error al leer tipo de AA.", "error");
    }
  };

  const [listDobCapacidad, setlistDobCapacidad] = useState([]);
  const getListDobCapacidad = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobCapacidadSliceRequests.getAllRequest()));
    } catch (error) {
      console.log(error);
    }
    if (result) {
      setlistDobCapacidad(result);
      console.log(result);
    }
  };

  const [listDobTipoFrigoria, setlistDobTipoFrigoria] = useState([]);
  const getListDobTipoFrigoria = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobTipoFrigoriaSliceRequests.getAllRequest()));
      setlistDobTipoFrigoria(result);
    } catch (error) {
      openNotificationUI("Error al leer tipo de frigoría.", "error");
    }
  };

  const [listDobProveedor, setlistDobProveedor] = useState([]);
  const getListDobProveedor = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobProveedorSliceRequests.getAllRequest()));
      setlistDobProveedor(result);
    } catch (error) {
      openNotificationUI("Error al leer proveedor.", "error");
    }
  };

  const [listDobSubEnsamble, setlistDobSubEnsamble] = useState([]);
  const getListDobSubEnsamble = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobSubEnsambleSliceRequests.getAllRequest()));
      setlistDobSubEnsamble(result);
    } catch (error) {
      openNotificationUI("Error al leer subEnsamble.", "error");
    }
  };

  const [codigoAux, setCodigoAux] = useState({
    tipoAA: editState?.dobTipoAA.codigo || "",
    capacidad: editState?.dobCapacidad.codigo || "",
    tipoFrigoria: editState?.dobTipoFrigoria.codigo || "",
    proveedor: editState?.dobProveedor.codigo || "",
    versionProducto: editState?.versionProducto || "",
    versionPieza: editState?.versionPieza || "",
    subEnsamble: editState?.dobSubEnsamble.codigo || "",
    n1SubEnsamble: editState?.n1SubEnsamble || "",
    n2SubEnsamble: editState?.n2SubEnsamble || ""
  });

  //Error al modificar
  useEffect(() => {
    setValue(
      "codigo",
      codigoAux.tipoAA +
        codigoAux.capacidad +
        codigoAux.tipoFrigoria +
        codigoAux.proveedor +
        codigoAux.versionProducto +
        codigoAux.versionPieza +
        codigoAux.subEnsamble +
        codigoAux.n1SubEnsamble +
        codigoAux.n2SubEnsamble
    );
  }, [codigoAux]);
  useEffect(() => {
    editState && setValue("codigo", editState.codigo);
    return () => {
      setValue("codigo", "");
    };
  }, [editState]);

  const concatenarCodigo = (valor) => {
    if (valor == "aire") {
      const id = getValues("dobTipoAAId");
      const objeto = listDobTipoAA.find((x) => x.id == id);
      const cod = { ...codigoAux, tipoAA: objeto.codigo };
      setCodigoAux(cod);
    }
    if (valor == "capacidad") {
      const id = getValues("dobCapacidadId");
      const objeto = listDobCapacidad.find((x) => x.id == id);
      const cod = { ...codigoAux, capacidad: objeto.codigo };
      setCodigoAux(cod);
    }
    if (valor == "tipoFrigoria") {
      const id = getValues("dobTipoFrigoriaId");
      const objeto = listDobTipoFrigoria.find((x) => x.id == id);
      const cod = { ...codigoAux, tipoFrigoria: objeto.codigo };
      setCodigoAux(cod);
    }
    if (valor == "proveedor") {
      const id = getValues("dobProveedorId");
      const objeto = listDobProveedor.find((x) => x.id == id);
      const cod = { ...codigoAux, proveedor: objeto.codigo };
      setCodigoAux(cod);
    }
    if (valor == "subEnsamble") {
      const id = getValues("dobSubEnsambleId");
      const objeto = listDobSubEnsamble.find((x) => x.id == id);
      const cod = { ...codigoAux, subEnsamble: objeto.codigo };
      // console.log(cod);
      setCodigoAux(cod);
    }
    if (valor == "vProducto") {
      const valorVProducto = getValues("versionProducto").toUpperCase();
      const cod = { ...codigoAux, versionProducto: valorVProducto };
      setCodigoAux(cod);
    }
    if (valor == "vPieza") {
      const valorVPieza = getValues("versionPieza").toUpperCase();
      const cod = { ...codigoAux, versionPieza: valorVPieza };
      setCodigoAux(cod);
    }
    if (valor == "n1SubEnsamble") {
      console.log(getValues("n1SubEnsamble"));
      const valorN1SubEnsamble = getValues("n1SubEnsamble");
      const cod = { ...codigoAux, n1SubEnsamble: valorN1SubEnsamble };
      setCodigoAux(cod);
    }
    if (valor == "n2SubEnsamble") {
      console.log(getValues("n2SubEnsamble"));
      const valorN2SubEnsamble = getValues("n2SubEnsamble");
      const cod = { ...codigoAux, n2SubEnsamble: valorN2SubEnsamble };
      setCodigoAux(cod);
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className="p-5 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <Controller
              name="codigo"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Código</InputLabel>
                  <Input {...field} disabled />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="dobTipoAAId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo de AA</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione un Tipo de Aire"
                      variant="standard"
                      onClick={(e) => concatenarCodigo("aire")}>
                      {listDobTipoAA &&
                        listDobTipoAA.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.codigo + " - " + x.descripcion}</div>
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
                name="dobCapacidadId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Capacidad</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione Capacidad"
                      variant="standard"
                      onClick={(e) => concatenarCodigo("capacidad")}>
                      {listDobCapacidad &&
                        listDobCapacidad.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.descripcion}</div>
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
                name="dobTipoFrigoriaId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo de Frigoría</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione un Tipo de Frigoría"
                      variant="standard"
                      onClick={(e) => concatenarCodigo("tipoFrigoria")}>
                      {listDobTipoFrigoria &&
                        listDobTipoFrigoria.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.codigo + " - " + x.descripcion}</div>
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
                name="dobProveedorId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Proveedor</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione Proveedor"
                      variant="standard"
                      onClick={(e) => concatenarCodigo("proveedor")}>
                      {listDobProveedor &&
                        listDobProveedor.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.codigo + " - " + x.descripcion}</div>
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
          </div>
          <div className=" flex-col grid grid-cols-5 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="versionProducto"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Versión de Producto"
                      variant="standard"
                      type="text"
                      inputProps={{ maxLength: 1, style: { textTransform: "uppercase" } }}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.toUpperCase());
                        concatenarCodigo("vProducto");
                      }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="versionPieza"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Versión de Pieza"
                      variant="standard"
                      type="text"
                      inputProps={{ maxLength: 1, style: { textTransform: "uppercase" } }}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.toUpperCase());
                        concatenarCodigo("vPieza");
                      }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="dobSubEnsambleId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>SubEnsamble</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione SubEnsamble"
                      variant="standard"
                      onClick={(e) => concatenarCodigo("subEnsamble")}>
                      {listDobSubEnsamble &&
                        listDobSubEnsamble.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.codigo + " - " + x.descripcion}</div>
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
                name="n1SubEnsamble"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Nivel 1 de SubEnsamble"
                      variant="standard"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        concatenarCodigo("n1SubEnsamble");
                      }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="n2SubEnsamble"
                control={control}
                // rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Nivel 2 de SubEnsamble"
                      variant="standard"
                      type="number"
                      inputProps={{ maxLength: 2 }}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        concatenarCodigo("n2SubEnsamble");
                      }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                  <Controller
                    name="descripcion"
                    control={control}
                    // rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Descripción</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
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
