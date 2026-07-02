/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  Grid,
  Input,
  Tooltip,
  IconButton
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { ICalidadDocument } from "app/models/ICalidadDocument";
import { IPlant, IProducto, ISemielaboradoIA } from "app/models";
import { PlantSliceRequests, ProductoSliceRequests } from "app/Middleware/reducers";
import { IFamilia } from "app/models/IFamilia";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { IModelo } from "app/models/IModelo";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { SemielaboradoIASliceRequest } from "app/Middleware/reducers/semielaboradoIaSlice";
import { CalidadDocumentSliceRequests } from "app/Middleware/reducers/CalidadDocumentSlice";
import { Image } from "@mui/icons-material";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { HerramentalImage } from "../../../../dobladora/modals/HerramentalImage";
import { GenericImageUploadSliceRequests } from "app/Middleware/reducers/GenericImageUploadSlice";
import moment from "moment";
interface props {
  setOpenPopup: any;
  editState?: ICalidadDocument | null;
  refresh?: any;
  estaEditando: any;
}

export const CalidadDocumentForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();

  interface initialState {
    plantId: number;
    productoId: number;
    familiaId: number;
    modeloId: number;
    semielaboradoIAId: number;
    nombre: string;
    descripcion: string;
  }
  const initialStateVar = {
    plantId: 0,
    productoId: 0,
    familiaId: 0,
    modeloId: 0,
    semielaboradoIAId: 0,
    nombre: "",
    descripcion: ""
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    getPlantas();
    getProducto();
  }, []);

  //Leer Plantas
  const [listPlantas, setListPantas] = useState<IPlant[] | null>(null);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //Leer Producto
  const [listProducto, setListProducto] = useState<IProducto[] | null>(null);
  const getProducto = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      setListProducto(responses);
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };

  //Leer Familia por producto
  const [listFamilias, setListFamilias] = useState<IFamilia[] | null>(null);
  const getFamilias = async () => {
    try {
      const responses = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(watchProductoId)));
      setListFamilias(responses);
    } catch (error) {
      openNotificationUI("Error al leer familias.", "error");
    }
  };

  //Leer Modelos por familia
  const [listModelos, setListModelos] = useState<IModelo[] | null>(null);
  const getModelos = async () => {
    try {
      const responses = unwrapResult(await dispatch(ModeloSliceRequest.getAllByFamiliaId(watchFamiliaId)));
      setListModelos(responses);
    } catch (error) {
      openNotificationUI("Error al leer modelos.", "error");
    }
  };

  //Leer SemielaboradoIA por familia
  const [listSemielaboradoIA, setListSemielaboradoIA] = useState<ISemielaboradoIA[] | null>(null);
  const getSemielaboradoIA = async () => {
    try {
      const responses = unwrapResult(await dispatch(SemielaboradoIASliceRequest.getByFamiliaIdRequest(watchFamiliaId)));
      setListSemielaboradoIA(responses);
    } catch (error) {
      openNotificationUI("Error al leer semielaboradoIA.", "error");
    }
  };

  //Watch
  const watchProductoId = watch("productoId");
  useEffect(() => {
    if (watchProductoId) {
      getFamilias();
    }
  }, [watchProductoId]);

  const watchFamiliaId = watch("familiaId");
  useEffect(() => {
    if (watchFamiliaId) {
      getModelos();
      getSemielaboradoIA();
    }
  }, [watchFamiliaId]);

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    delete e.familia;
    delete e.modelo;
    delete e.plant;
    delete e.producto;
    delete e.semielaboradoIA;
    try {
      //Guardar Imagen
      if (!estaEditando || editState?.descripcion != getValues("descripcion")) {
        saveImage();
      }
      //Guadar Dato
      if (estaEditando) {
        unwrapResult(await dispatch(CalidadDocumentSliceRequests.PutRequest(e)));
      } else {
        unwrapResult(await dispatch(CalidadDocumentSliceRequests.PostRequest(e)));
      }
      openNotificationUI("Guardado...", "success");
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  //Imagen
  const [modalImage, setModalImage] = useState(false);
  const [fileProp, setFileProp] = useState(null);
  const [encabezado, setEncabezado] = useState("");
  const saveImage = async () => {
    try {
      const param = {
        file: fileProp, //archivo imagen a guardar
        nameFile: "CalidadDocument", //Nombre de la carpeta a guardar
        stringConcatenation: encabezado //Concatena al inicio del archivo
      };
      unwrapResult(await dispatch(GenericImageUploadSliceRequests.upload(param)));
    } catch (error) {
      openNotificationUI("Error al guardar imagen.", "error");
    }
  };
  useEffect(() => {
    if (fileProp) {
      const add = moment().format("HHmmss");
      setValue("descripcion", add + "-" + fileProp.name);
      setEncabezado(add);
    }
  }, [fileProp]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <Grid container spacing={6}>
            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="plantId"
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
              </div>
            </Grid>

            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
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
              </div>
            </Grid>

            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="familiaId"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Familia</InputLabel>
                      <Select {...field} placeholder="Seleccione Familia" variant="standard">
                        {listFamilias &&
                          listFamilias.map((x) => (
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
            </Grid>

            <Grid item xs={3}>
              <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                <Controller
                  name="modeloId"
                  control={control}
                  rules={{ required: true, min: 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Modelo</InputLabel>
                      <Select {...field} placeholder="Seleccione Modelo" variant="standard">
                        {listModelos &&
                          listModelos.map((x) => (
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
            </Grid>
          </Grid>

          <div className="m-4">
            <Grid container spacing={6}>
              <Grid item xs={4}>
                <div className="m-4" style={{ width: "90%" }}>
                  <Controller
                    name="semielaboradoIAId"
                    control={control}
                    rules={{ required: true, min: 1 }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>SemielaboradoIA</InputLabel>
                        <Select {...field} placeholder="Seleccione SemielaboradoIA" variant="standard">
                          {listSemielaboradoIA &&
                            listSemielaboradoIA.map((x) => (
                              <MenuItem key={x.id} value={x.id}>
                                <div className="w-full">
                                  <div>{x.valor}</div>
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
              </Grid>

              <Grid item xs={4}>
                <div className="m-4" style={{ width: "90%" }}>
                  <Controller
                    name="nombre"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Nombre</InputLabel>
                        <Input {...field} />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="m-4" style={{ width: "100%", display: "flex" }}>
                  <Controller
                    name="descripcion"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error} disabled>
                        <InputLabel>Archivo de Imagen</InputLabel>
                        <Input {...field} />
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
              </Grid>
            </Grid>
          </div>
          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button
              className={buttonClasses.greenButton}
              type="submit"
              variant="contained"
              disabled={!isDirty && !isValid}>
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
