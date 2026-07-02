import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  TextField,
  Tooltip,
  IconButton
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { Image } from "@mui/icons-material";
// import { GenericImageUploadSliceRequests } from "app/Middleware/reducers/GenericImageUploadSlice";
import { ICodigoSoldadura } from "app/models/ICodigoSoldadura";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { IFamilia } from "app/models/IFamilia";
import { ModalCompoment } from "../../../../shared/components/ModalComponent";
import { CDImage } from "./CDImage";
// import { GenericImageUploadSliceRequests } from "app/Middleware/reducers/GenericImageUploadSlice";
import { CodigoSoldaduraSliceRequests } from "app/Middleware/reducers/CodigoSoldaduraSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
interface props {
  setOpenPopup: any;
  editState?: ICodigoSoldadura | null;
  refresh?: any;
  estaEditando: any;
  listCodigosSoldadura?: ICodigoSoldadura[] | null;
}

export const CodigoSoldaduraForm = ({
  setOpenPopup,
  editState,
  refresh,
  estaEditando,
  listCodigosSoldadura
}: props) => {
  const classes = MaterialButtons();
  interface initialState {
    generico: string;
    imagen: string;
    imagenNewsan: string;
    puesto: string;
  }
  const initialStateVar = {
    generico: "",
    imagen: "",
    imagenNewsan: "",
    puesto: ""
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;

  //Agrego o modifico
  const loginSubmit = async (e) => {
    console.log(e);
    const objectSubmit: ICodigoSoldadura = {
      ...e,
      imagen: "\\\\10.0.4.61\\Aplicacion\\Imagen Soldadura\\" + watchGenerico + ".JPG",
      imagenNewsan: "\\\\10.30.10.155\\Aplicacion\\Imagen Soldadura\\" + watchGenerico + ".JPG"
    };
    console.log(objectSubmit);
    try {
      const source = await saveImage();
      objectSubmit.source = source;
      if (editState) {
        unwrapResult(await dispatch(CodigoSoldaduraSliceRequests.PutRequest(objectSubmit)));
      } else {
        unwrapResult(await dispatch(CodigoSoldaduraSliceRequests.PostRequest(objectSubmit)));
      }
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  //Leer
  const [listPuestos, setlistPuestos] = useState([]);
  const getPuesto = async () => {
    try {
      const array1 = [
        { id: 1, name: "P" },
        { id: 2, name: "M" }
      ];
      setlistPuestos(array1);
    } catch (error) {
      openNotificationUI("Error al cargar puestos.", "error");
    }
  };

  const [listFamilias, setlistFamilias] = useState<IFamilia[] | null>([]);
  const getListFamilias = async () => {
    let result = [];
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      result = unwrapResult(await dispatch(FamiliaSliceRequests.getAllRequest()));
      setlistFamilias(result);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Error al leer familias.", "error");
    }
  };

  //Se filtra por familia para que no pueda cargar la misma familia
  const [listFamiliasFiltrado, setlistFamiliasFiltrado] = useState<IFamilia[] | null>([]);
  const filtrarListFamilias = () => {
    console.log("listado familia", listFamilias);
    const filteredArray = listFamilias;

    if (estaEditando) {
      setlistFamiliasFiltrado(listFamilias);
    } else {
      setlistFamiliasFiltrado(filteredArray);
    }
  };
  useEffect(() => {
    filtrarListFamilias();
  }, [listFamilias]);

  //Cargo los comboBox con las Selecciones de Tablas
  useEffect(() => {
    getListFamilias();
    getPuesto();
  }, []);

  //Imagen
  const [modalImage, setModalImage] = useState(false);
  const [fileProp, setFileProp] = useState(null);

  //Guarda la imagen, una vez que guardo codigo de soldadura.
  const saveImage = async () => {
    try {
      const source = unwrapResult(
        await dispatch(
          CodigoSoldaduraSliceRequests.UploadImagenRequest({
            generico: watchGenerico,
            puesto: watchPuesto,
            imageFile: fileProp
          })
        )
      );
      return source;
      // unwrapResult(await dispatch(GenericImageUploadSliceRequests.uploadServer(param)));
    } catch (error) {
      openNotificationUI("Error al guardar imagen.", "error");
    }
  };

  //WATCH
  const watchGenerico = watch("generico");
  const watchPuesto = watch("puesto");

  //Para guardar la imagen cada vez que agrega 1.
  useEffect(() => {
    if (fileProp) {
      setValue("imagen", fileProp.name);
    }
  }, [fileProp]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className=" flex-col grid grid-cols-2 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="generico"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Familia</InputLabel>
                    <Select {...field} placeholder="Seleccione una Familia" variant="standard">
                      {listFamiliasFiltrado &&
                        listFamiliasFiltrado.map((x) => (
                          <MenuItem key={x.id} value={x.nombre}>
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
                name="puesto"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Puesto</InputLabel>
                    <Select {...field} placeholder="Seleccione Puesto" variant="standard">
                      {listPuestos &&
                        listPuestos.map((x) => (
                          <MenuItem key={x.id} value={x.name}>
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
          </div>
          {/* <div className=" flex-col grid grid-cols-2 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="imagen"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField fullWidth label="Imagen" variant="standard" type="text" {...field} disabled={true} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="imagenNewsan"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Imagen Newsan"
                      variant="standard"
                      type="text"
                      {...field}
                      disabled={true}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div> */}
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
          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
      <ModalCompoment title="Imagen" openPopup={modalImage} setOpenPopup={setModalImage}>
        <CDImage fileProp={fileProp} setFileProp={setFileProp} modalOpen={setModalImage}></CDImage>
      </ModalCompoment>
    </div>
  );
};
