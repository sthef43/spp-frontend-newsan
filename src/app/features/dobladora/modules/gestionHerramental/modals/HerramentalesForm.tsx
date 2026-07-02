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
  Grid,
  Tooltip,
  IconButton
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { IDobHHerramental } from "app/models/IDobHHerramental";
import { DobHHerramentalSliceRequests } from "app/Middleware/reducers/DobHHerramentalSlice";
import { DobHTipoMaquinaSliceRequests } from "app/Middleware/reducers/DobHTipoMaquinaSlice";
import { DobHTipoSliceRequests } from "app/Middleware/reducers/DobHTipoSlice";
import { DobHDiametroTuboSliceRequests } from "app/Middleware/reducers/DobHDiametroTuboSlice";
import { DobHProveedorSliceRequests } from "app/Middleware/reducers/DobHProveedorSlice";
import { DobHRadioMedioSliceRequests } from "app/Middleware/reducers/DobHRadioMedioSlice";
import { DobHEstadoSliceRequests } from "app/Middleware/reducers/DobHEstadoSlice";
import { Image } from "@mui/icons-material";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { HerramentalImage } from "../../../modals/HerramentalImage";
import { GenericImageUploadSliceRequests } from "app/Middleware/reducers/GenericImageUploadSlice";
interface props {
  setOpenPopup: any;
  editState?: IDobHHerramental | null;
  refresh?: any;
  estaEditando: any;
}

export const HerramentalesForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    dobHTipoMaquinaId: number;
    dobHTipoId: number;
    dobHDiametroTuboId: number;
    dobHRadioMedioId: number;
    dobHEstadoId: number;
    dobHProveedorId: number;
    correlativo: number;
    codigo: string;
    costoUSS: number;
    descripcion: string;
    imagen: string;
  }
  const initialStateVar = {
    dobHTipoMaquinaId: 0,
    dobHTipoId: 0,
    dobHDiametroTuboId: 0,
    dobHRadioMedioId: 0,
    dobHEstadoId: 0,
    dobHProveedorId: 0,
    correlativo: 0,
    codigo: "",
    costoUSS: 0,
    descripcion: "",
    imagen: ""
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

  //Agrego o modifico
  const loginSubmit = async (e) => {
    let result;
    console.log(e);
    let objectSubmit = {
      ...e,
      imagen: e.imagen,
      dobHTipoMaquina: null,
      dobHTipo: null,
      dobHDiametroTubo: null,
      dobHRadioMedio: null,
      dobHEstado: null,
      dobHProveedor: null
    };
    console.log(objectSubmit);
    try {
      if (editState) {
        result = unwrapResult(await dispatch(DobHHerramentalSliceRequests.PutRequest(objectSubmit)));
        saveImage();
      } else {
        objectSubmit = {
          ...objectSubmit,
          imagen: `${getValues("codigo")}-${fileProp.name}`
        };
        result = unwrapResult(await dispatch(DobHHerramentalSliceRequests.PostRequest(objectSubmit)));
        saveImage();
      }
    } catch (x) {
      result = null;
      openNotificationUI("Error al guardar herramental.", "error");
    }

    console.log(result);
    if (result.payload == "") {
      openNotificationUI("Código duplicado de herramental", "error");
      // setOpenPopup(false);
    } else {
      openNotificationUI("Guardado...", "success");
      // setOpenPopup(false);
      refresh();
    }
  };

  //Cargo los comboBox con las Selecciones de Tablas
  useEffect(() => {
    getListDobHTipoMaquina();
    getListDobHTipo();
    getListDobHDiametroTubo();
    getListDobHRadioMedio();
    getListDobHEstado();
    getListDobHProveedor();
  }, []);

  const [listDobHTipoMaquina, setlistDobHTipoMaquina] = useState([]);
  const getListDobHTipoMaquina = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHTipoMaquinaSliceRequests.getAllRequest()));
      setlistDobHTipoMaquina(result);
    } catch (error) {
      openNotificationUI("Error al leer tipo de Máquina.", "error");
    }
  };

  const [listDobHTipo, setlistDobHTipo] = useState([]);
  const getListDobHTipo = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHTipoSliceRequests.getAllRequest()));
      setlistDobHTipo(result);
    } catch (error) {
      openNotificationUI("Error al leer tipo de Herramental.", "error");
    }
  };

  const [listDobHDiametroTubo, setlistDobHDiametroTubo] = useState([]);
  const getListDobHDiametroTubo = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHDiametroTuboSliceRequests.getAllRequest()));
      setlistDobHDiametroTubo(result);
    } catch (error) {
      openNotificationUI("Error al leer Diámetro de Tubo.", "error");
    }
  };

  const [listDobHRadioMedio, setlistDobHRadioMedio] = useState([]);
  const getListDobHRadioMedio = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHRadioMedioSliceRequests.getAllRequest()));
      setlistDobHRadioMedio(result);
    } catch (error) {
      openNotificationUI("Error al leer Radio Medio.", "error");
    }
  };

  const [listDobHEstado, setlistDobHEstado] = useState([]);
  const getListDobHEstado = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHEstadoSliceRequests.getAllRequest()));
      setlistDobHEstado(result);
    } catch (error) {
      openNotificationUI("Error al leer Estado.", "error");
    }
  };

  const [listDobHProveedor, setlistDobHProveedor] = useState([]);
  const getListDobHProveedor = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobHProveedorSliceRequests.getAllRequest()));
      setlistDobHProveedor(result);
    } catch (error) {
      openNotificationUI("Error al leer Proveedor.", "error");
    }
  };

  const [codigoAux, setCodigoAux] = useState({
    tipoMaquina: editState?.dobHTipoMaquina.codigo || "",
    tipo: editState?.dobHTipo.codigo || "",
    diametroTubo: editState?.dobHDiametroTubo.codigo || "",
    radioMedio: editState?.dobHRadioMedio.codigo || "",
    correlativo: editState?.correlativo || "000"
  });

  //Error al modificar
  useEffect(() => {
    setValue(
      "codigo",
      codigoAux.tipoMaquina + codigoAux.tipo + codigoAux.diametroTubo + codigoAux.radioMedio + codigoAux.correlativo
    );
  }, [codigoAux]);

  useEffect(() => {
    editState && setValue("codigo", editState.codigo);
    return () => {
      setValue("codigo", "");
    };
  }, [editState]);

  const concatenarCodigo = (valor) => {
    if (valor == "maquina") {
      const id = getValues("dobHTipoMaquinaId");
      const objeto = listDobHTipoMaquina.find((x) => x.id == id);
      const cod = { ...codigoAux, tipoMaquina: objeto.codigo };
      setCodigoAux(cod);
    }
    if (valor == "tipo") {
      const id = getValues("dobHTipoId");
      const objeto = listDobHTipo.find((x) => x.id == id);
      const cod = { ...codigoAux, tipo: objeto.codigo };
      setCodigoAux(cod);
    }
    if (valor == "diametroTubo") {
      const id = getValues("dobHDiametroTuboId");
      const objeto = listDobHDiametroTubo.find((x) => x.id == id);
      const cod = { ...codigoAux, diametroTubo: objeto.codigo };
      setCodigoAux(cod);
    }
    if (valor == "radioMedio") {
      const id = getValues("dobHRadioMedioId");
      const objeto = listDobHRadioMedio.find((x) => x.id == id);
      const cod = { ...codigoAux, radioMedio: objeto.codigo };
      setCodigoAux(cod);
    }
    if (valor == "correlativo") {
      const prepe = String(getValues("correlativo")).padStart(3, "000");
      const cod = { ...codigoAux, correlativo: prepe };
      setCodigoAux(cod);
    }
  };

  //Imagen del herramental
  const [modalImage, setModalImage] = useState(false);
  const [fileProp, setFileProp] = useState(null);
  //Guarda la imagen, una vez que el Herramental se guardo exitosamente.
  const saveImage = async () => {
    try {
      // const semiElaborado = semiElaborados.find((x) => (x.id = getValues("dobSemiId")));
      const param = {
        file: fileProp, //archivo imagen a guardar
        nameFile: "Herramentales", //Nombre de la carpeta a guardar
        // stringConcatenation: semiElaborado.codigo
        stringConcatenation: getValues("codigo")
      };
      const result = unwrapResult(await dispatch(GenericImageUploadSliceRequests.upload(param)));
      console.log(result);
    } catch (error) {
      openNotificationUI("Error al guardar imagen.", "error");
    }
  };
  //Para guardar la imagen cada vez que agrega 1.
  useEffect(() => {
    if (fileProp) setValue("imagen", fileProp.name);
  }, [fileProp]);

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
                name="dobHTipoMaquinaId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo de Máquina</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione un Tipo de Máquina"
                      variant="standard"
                      onClick={(e) => concatenarCodigo("maquina")}>
                      {listDobHTipoMaquina &&
                        listDobHTipoMaquina.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.id + " - " + x.codigo + " - " + x.descripcion}</div>
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
                name="dobHTipoId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo de Herramental</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione Tipo de Herramental"
                      variant="standard"
                      onClick={(e) => concatenarCodigo("tipo")}>
                      {listDobHTipo &&
                        listDobHTipo.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.id + " - " + x.codigo + " - " + x.descripcion}</div>
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
                name="dobHDiametroTuboId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Diámetro Tubo</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione Diámetro del Tubo"
                      variant="standard"
                      onClick={(e) => concatenarCodigo("diametroTubo")}>
                      {listDobHDiametroTubo &&
                        listDobHDiametroTubo.map((x) => (
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
                name="dobHRadioMedioId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Radio Medio</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione Radio Medio"
                      variant="standard"
                      onClick={(e) => concatenarCodigo("radioMedio")}>
                      {listDobHRadioMedio &&
                        listDobHRadioMedio.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.codigo}</div>
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
                name="correlativo"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Correlativo"
                      variant="standard"
                      type="number"
                      inputProps={{ maxLength: 3 }}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        concatenarCodigo("correlativo");
                      }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className=" flex-col grid grid-cols-5 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="dobHEstadoId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione Estado"
                      variant="standard"
                      // onClick={(e) => concatenarCodigo("subEnsamble")}
                    >
                      {listDobHEstado &&
                        listDobHEstado.map((x) => (
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
                name="dobHProveedorId"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Proveedor</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione Proveedor"
                      variant="standard"
                      // onClick={(e) => concatenarCodigo("subEnsamble")}
                    >
                      {listDobHProveedor &&
                        listDobHProveedor.map((x) => (
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
                name="costoUSS"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Costo U$S"
                      variant="standard"
                      type="number"
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e.target.value);
                      //   concatenarCodigo("n1SubEnsamble");
                      // }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "space-between",
              justifyContent: "space-around",
              alignItems: "stretch",
              padding: "100px"
            }}>
            <Controller
              name="imagen"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Imagen"
                    variant="outlined"
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
            <Tooltip title="Cargar imagen">
              <IconButton
                color="secondary"
                onClick={() => {
                  setModalImage(true);
                }}
                size="large">
                <Image />
              </IconButton>
            </Tooltip>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                  <Controller
                    name="descripcion"
                    control={control}
                    rules={{ required: true }}
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
      <ModalCompoment title="Imagen" openPopup={modalImage} setOpenPopup={setModalImage}>
        <HerramentalImage fileProp={fileProp} setFileProp={setFileProp} modalOpen={setModalImage}></HerramentalImage>
      </ModalCompoment>
    </div>
  );
};
