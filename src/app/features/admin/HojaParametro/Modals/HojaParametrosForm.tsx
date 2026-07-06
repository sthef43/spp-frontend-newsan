/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { MarcaSliceRequests } from "app/Middleware/reducers/MarcaSlice";
import { ProveedoresSliceRequests } from "app/Middleware/reducers/ProveedoresSlice";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { HojaParametrosImage } from "./HojaParametrosImage";
import { Image } from "@mui/icons-material";
import { HojaParametroSliceRequests } from "app/Middleware/reducers/HojaParametroSlice";
import { GenericImageUploadSliceRequests } from "app/Middleware/reducers/GenericImageUploadSlice";
import { GroupEmailForm } from "app/shared/helpers/GroupEmailForm";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { IAppUser } from "app/models";
import { ProductoSliceRequests } from "app/Middleware/reducers";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";

interface initialState {
  productoId?: number | null;
  familiaId?: number | null;
  modeloId?: number | null;
  marcaId?: number;
  proveedoresId?: number;
  userCalidadId?: number | null;
  userSectorId?: number | null;
  version?: number | null;
  imagen?: string | null;
  fechaCalidad?: string | null;
  fechaSector?: string | null;
  estado?: string | null;
}

const initialStateVar = {
  modeloId: 0,
  marcaId: 0,
  proveedoresId: 0,
  userCalidadId: 0,
  userSectorId: 0,
  version: 0,
  imagen: "",
  fechaCalidad: "",
  fechaSector: "",
  estado: ""
};

interface props {
  setOpenPopup: (newValue: boolean) => void;
  getFamiliaId?: number;
  getProductoId?: number;
  getFamiliaNombre?: string;
  getProductoNombre?: string;
  refresh?: () => void;
}

export const HojaParametrosForm = ({
  setOpenPopup,
  getFamiliaId,
  getProductoId,
  getFamiliaNombre,
  getProductoNombre,
  refresh
}: props) => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: { ...initialStateVar, ...{ productoId: getProductoId, familiaId: getFamiliaId } }
  });

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  //Estado de los modales
  const [modalImage, setModalImage] = useState(false);

  //
  const [modelo, setModelo] = useState(null);
  const [marca, setMarca] = useState(null);
  const [proveedores, setProveedores] = useState(null);
  const [familiaNombre, setFamiliaNombre] = useState(null);
  const [productoNombre, setProductoNombre] = useState(null);
  const [modeloId, setModeloId] = useState(null);
  const [fileProp, setFileProp] = useState(null);

  const [emails, setEmails] = useState("");

  const [listProducto, setListProducto] = useState([]);
  const [listFamilia, setListFamilia] = useState([]);
  const [listModelos, setListModelos] = useState([]);
  const [listModelosDes, setListModelosDes] = useState([]);
  const [listMarcas, setListMarcas] = useState([]);
  const [listMarcasDes, setListMarcasDes] = useState([]);
  const [listProveedores, setListProveedores] = useState([]);
  const [listProveedoresDes, setListProveedoresDes] = useState([]);

  //Watch para tomar los valores de los inputs
  const watchMarcaId = watch("marcaId");
  const watchProveedoresId = watch("proveedoresId");
  const watchFamiliaId = watch("familiaId");
  const watchProductoId = watch("productoId");
  const watchVersion = watch("version");
  const watchModeloId = watch("modeloId");
  const watchProducto = watch("productoId");
  const watchFamilia = watch("familiaId");

  //Email
  const callbackEmails = (emailsDestino: string) => {
    setEmails(emailsDestino);
  };

  //Guardar
  const loginSubmit = async (e) => {
    let result;
    const objectSubmit = {
      ...e,
      producto: null,
      familia: null,
      modelo: null,
      marca: null,
      proveedores: null,
      userCalidad: null,
      userCalidadId: null,
      fechaCalidad: null,
      userSector: null,
      userSectorId: null,
      fechaSector: null,
      version: parseInt(e.version),
      estado: "Pendiente",
      imagen: `${modelo}-V${watchVersion}-${fileProp.name}`
    };
    try {
      result = unwrapResult(await dispatch(HojaParametroSliceRequests.PostRequest(objectSubmit)));
      saveImage();
      sendEmailHojaParam(e);
      refresh();
      setOpenPopup(false);
    } catch (x) {
      result = null;
      openNotificationUI("Error al guardar.", "error");
    }
  };

  //Guarda la imagen
  const saveImage = async () => {
    try {
      const param = {
        file: fileProp, //archivo imagen a guardar
        nameFile: "HojaParametros", //Nombre de la carpeta a guardar
        stringConcatenation: modelo + "-V" + watchVersion
      };
      const result = unwrapResult(await dispatch(GenericImageUploadSliceRequests.upload(param)));
    } catch (error) {
      openNotificationUI("Error al guardar imagen.", "error");
    }
  };

  //Enviar correos
  const sendEmailHojaParam = async (e) => {
    const props = {
      usuario: infoUser.operator.name + " " + infoUser.operator.surname,
      producto: productoNombre ?? getProductoNombre,
      familia: familiaNombre ?? getFamiliaNombre,
      modelo: modelo,
      marca: marca,
      proveedor: proveedores,
      version: watchVersion,
      estado: "Pendiente",
      emailsDestiners: emails
    };
    try {
      const enviado = unwrapResult(await dispatch(EmailSliceRequest.EmailHojaDeParametros(props)));
      openNotificationUI("Mail enviado.", "success");
    } catch (x) {
      openNotificationUI("Error al enviar mails." + x, "error");
    }
  };

  //Cargo los comboBox con las Selecciones de Tablas
  //Leer Producto
  const getProducto = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      setListProducto(responses);
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };

  //Leer Familia
  const getFamilia = async () => {
    try {
      const responses = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(watchProducto)));
      setListFamilia(responses);
    } catch (error) {
      openNotificationUI("Error al leer familia.", "error");
    }
  };

  //Leer Modelo
  // const [listModelo, setListModelo] = useState([]);
  const getListModelos = async () => {
    try {
      const responses = unwrapResult(await dispatch(ModeloSliceRequest.getAllByFamiliaId(watchFamilia)));
      setListModelosDes(responses);
    } catch (error) {
      openNotificationUI("Error al leer modelo.", "error");
    }
  };

  // const getListModelos = async () => {
  //   try {
  //     const responses = unwrapResult(await dispatch(ModeloSliceRequest.getAllRequest()));
  //     setListModelosDes(responses);
  //   } catch (error) {
  //     openNotificationUI("Error al leer modelos.", "error");
  //   }
  // };

  //Leer de BD
  const getModeloId = async () => {
    try {
      const responses = unwrapResult(
        await dispatch(HojaParametroSliceRequests.getListByModeloIdRequest(watchModeloId))
      );
      setModeloId(responses);
    } catch (error) {
      openNotificationUI("Error al leer modelos.", "error");
    }
  };

  const getListMarcas = async () => {
    try {
      const responses = unwrapResult(await dispatch(MarcaSliceRequests.getAllRequest()));
      setListMarcasDes(responses);
    } catch (error) {
      openNotificationUI("Error al leer marcas.", "error");
    }
  };

  const getListProveedores = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProveedoresSliceRequests.getAllRequest()));
      setListProveedoresDes(responses);
    } catch (error) {
      openNotificationUI("Error al leer proveedores.", "error");
    }
  };

  // useEffect(() => {
  //   //Deja unicamente descripcion y tipo
  //   const uniqueData = listProveedoresDes.reduce((acc, obj) => {
  //     if (!acc[obj.descripcion]) {
  //       acc[obj.descripcion] = obj.tipo;
  //     }
  //     return acc;
  //   }, {});
  //   //Borra duplicados
  //   const uniqueArray = Object.entries(uniqueData).map(([descripcion, tipo], index) => ({
  //     id: index + 1,
  //     descripcion,
  //     tipo
  //   }));
  //   //Ordenar los datos por descripcion
  //   const sortedData = [...uniqueArray].sort((a, b) => a.descripcion.localeCompare(b.descripcion));
  //   setListProveedores(sortedData);
  // }, [listProveedoresDes]);

  useEffect(() => {
    if (modeloId && modeloId.length > 0) {
      setValue("version", modeloId.length);
    } else {
      setValue("version", 0);
    }
  }, [modeloId]);

  useEffect(() => {
    const sortedData = [...listMarcasDes].sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    setListMarcas(sortedData);
  }, [listMarcasDes]);

  useEffect(() => {
    const sortedData = [...listProveedoresDes].sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    setListProveedores(sortedData);
  }, [listProveedoresDes]);

  useEffect(() => {
    const sortedData = [...listModelosDes].sort((a, b) => a.nombre.localeCompare(b.nombre));
    setListModelos(sortedData);
  }, [listModelosDes]);

  useEffect(() => {
    if (listModelos && listModelos.length > 0) {
      const modelo = listModelos.find((x) => x.id === getValues("modeloId"));
      setModelo(modelo.nombre);
      getModeloId();
    }
  }, [watchModeloId]);

  useEffect(() => {
    if (listMarcas && listMarcas.length > 0) {
      const marca = listMarcas.find((x) => x.id === getValues("marcaId"));
      setMarca(marca.descripcion);
    }
  }, [watchMarcaId]);

  useEffect(() => {
    if (listProveedores && listProveedores.length > 0) {
      const Proveedores = listProveedores.find((x) => x.id === getValues("proveedoresId"));
      setProveedores(Proveedores.descripcion + " - " + Proveedores.tipo);
    }
  }, [watchProveedoresId]);

  useEffect(() => {
    if (listFamilia && listFamilia.length > 0) {
      const resp = listFamilia.find((x) => x.id === watchFamiliaId);
      setFamiliaNombre(resp.nombre);
    }
  }, [watchFamiliaId || listFamilia]);

  useEffect(() => {
    if (listProducto && listProducto.length > 0) {
      const resp = listProducto.find((x) => x.id === watchProductoId);
      setProductoNombre(resp.nombre);
    }
  }, [watchProductoId]);

  //Watch
  useEffect(() => {
    if (watchProducto) {
      getFamilia();
    }
  }, [watchProducto]);

  useEffect(() => {
    if (watchFamilia) {
      getListModelos();
    }
  }, [watchFamilia]);

  //Para guardar la imagen cada vez que agrega 1.
  useEffect(() => {
    if (fileProp) setValue("imagen", fileProp.name);
  }, [fileProp]);

  useEffect(() => {
    // getListModelos();
    getListMarcas();
    getListProveedores();
    // getPlantas();
    getProducto();
  }, []);

  return (
    <div className="h-full w-[55vw]">
      <form onSubmit={handleSubmit(loginSubmit)} className="h-full w-full">
        <div className=" flex-col grid grid-cols-2 h-full">
          <div className="py-2 gap-10 overflow-auto m-2 h-full">
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
          <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
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
          </div>
        </div>
        <div className=" flex-col grid grid-cols-4 gap-30 " style={{ height: "100%" }}>
          <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
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
          <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
            <Controller
              name="marcaId"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Marca</InputLabel>
                  <Select {...field} placeholder="Seleccione Marca" variant="standard">
                    {listMarcas &&
                      listMarcas.map((x) => (
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
              name="proveedoresId"
              control={control}
              rules={{ required: true, min: 1 }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Proveedor</InputLabel>
                  <Select {...field} placeholder="Seleccione Proveedor" variant="standard">
                    {listProveedores &&
                      listProveedores.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.descripcion + " - " + x.tipo + " - " + x.tipoUnidad}</div>
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
              name="version"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField fullWidth label="Versión de Producto" variant="standard" type="number" {...field} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row justify-around my-4">
          <Controller
            name="imagen"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <TextField
                  fullWidth
                  label="Hoja de Parámetros"
                  variant="outlined"
                  type="text"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          <Tooltip title="Cargar Hoja de Parámetros">
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
        <div className="mt-1 sm:flex md:flex items-top justify-around w-full font-semibold">
          <div className="flex-1">
            <GroupEmailForm callback={callbackEmails}></GroupEmailForm>
          </div>
        </div>
        <div className="p-2 flex justify-around">
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
      <ModalCompoment title="Vista previa de la Hoja de Parámetros" openPopup={modalImage} setOpenPopup={setModalImage}>
        <HojaParametrosImage
          fileProp={fileProp}
          setFileProp={setFileProp}
          modalOpen={setModalImage}></HojaParametrosImage>
      </ModalCompoment>
    </div>
  );
};
