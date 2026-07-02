import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobSemiSliceRequests } from "app/Middleware/reducers/DobSemiSlice";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { DobEstadoPlanoSliceRequests } from "app/Middleware/reducers/DobEstadoPlanoSlice";
import { Image } from "@mui/icons-material";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { AprobacionPlanosImage } from "./AprobacionPlanosImage";
import { GenericImageUploadSliceRequests } from "app/Middleware/reducers/GenericImageUploadSlice";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
import { DobPlanoSliceRequests } from "app/Middleware/reducers/DobPlanoSlice";
interface props {
  setOpenPopup: any;
  refresh?: any;
}
export const AprobacionPlanosForm = ({ setOpenPopup, refresh }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    dobSemiId: number;
    dobEstadoPlanoId: number;
    appUserId: number;
    rolId: number;
    dibujaId?: number | null;
    verificaId?: number | null;
    apruebaId?: number | null;
    imagen: string;
    descripcion: string;
    tipoHoja?: number;
    verificaDate?: string | null;
    apruebaDate?: string | null;
  }
  const initialStateVar = {
    dobSemiId: 0,
    dobEstadoPlanoId: 0,
    appUserId: 0,
    rolId: 0,
    dibujaId: 0,
    verificaId: 0,
    apruebaId: 0,
    imagen: "",
    descripcion: "",
    tipoHoja: 0,
    verificaDate: "",
    apruebaDate: ""
  };

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid } = formState;

  //GUARDAR
  const submit = async (e) => {
    const semiElaborado = semiElaborados.find((x) => (x.id = getValues("dobSemiId")));
    const obj = {
      ...e,
      imagen: `${semiElaborado.codigo}-${fileProp.name}`,
      dibujaId: e.appUserId,
      verificaId: e.appUserId,
      apruebaId: e.appUserId,
      verificaDate: "",
      apruebaDate: ""
    };
    try {
      unwrapResult(await dispatch(DobPlanoSliceRequests.PostRequest(obj)));
      saveImage();
      openNotificationUI("Guardado exitosamente ", "success");
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al registrar el Plano.", "error");
    }
  };

  //Guarda la imagen, una vez que el Plano se guardo exitosamente.
  const saveImage = async () => {
    try {
      const semiElaborado = semiElaborados.find((x) => (x.id = getValues("dobSemiId")));
      const param = {
        file: fileProp, //archivo imagen a guardar
        nameFile: "Planos", //Nombre de la carpeta a guardar
        stringConcatenation: semiElaborado.codigo
      };
      unwrapResult(await dispatch(GenericImageUploadSliceRequests.upload(param)));
    } catch (error) {
      openNotificationUI("Error al guardar imagen.", "error");
    }
  };

  //Carga lista de semielaborados
  const [semiElaborados, setSemiElaborados] = useState([]);
  const getSemiElaborados = async () => {
    try {
      let responses = unwrapResult(await dispatch(DobSemiSliceRequests.getAllRequest()));
      responses = responses.filter((x) => x.dobPlano?.length == 0); //Filtro los que no esten en un plano asignado.
      setSemiElaborados(responses);
    } catch (error) {
      openNotificationUI("Error al leer semi.", "error");
    }
  };

  //Cargo lista de usuarios
  const [listAppUsers, setListAppUsers] = useState([]);
  const getListAppUsers = async () => {
    try {
      const responses = unwrapResult(await dispatch(AppUserSliceRequests.getAllRequest()));
      setListAppUsers(responses);
    } catch (error) {
      openNotificationUI("Error al leer lista de usuarios.", "error");
    }
  };

  //Cuando se carga la lista con los users, obtengo el que esta logeado y lo seteo en el comboBox del user.
  useEffect(() => {
    if (listAppUsers.length > 0) {
      const dataUser = GetInfoUser();
      const findUser = listAppUsers.find((x) => x.username == dataUser.username);
      setValue("appUserId", findUser.id);
    }
  }, [listAppUsers]);

  //Cuando se carga la lista con los estados, obtengo el 1 de la lista de estados.
  const [estados, setEstados] = useState([]);
  const getEstados = async () => {
    try {
      const responses = unwrapResult(await dispatch(DobEstadoPlanoSliceRequests.getAllRequest()));
      setEstados(responses);
    } catch (error) {
      openNotificationUI("Error al leer estados.", "error");
    }
  };
  useEffect(() => {
    if (estados.length > 0) {
      const findEstado = estados.find((x) => x.id == 1);
      setValue("dobEstadoPlanoId", findEstado.id);
    }
  }, [estados]);

  //Cargo lista de Roles y obtengo el de ingeniería.
  const [roles, setRoles] = useState([]);
  const getRoles = async () => {
    try {
      const responses = unwrapResult(await dispatch(RolSliceRequests.getAllRequest()));
      setRoles(responses);
    } catch (error) {
      openNotificationUI("Error al leer roles.", "error");
    }
  };
  useEffect(() => {
    if (roles.length > 0) {
      const findRol = roles.find((x) => x.name.toUpperCase().includes("ingenier".toUpperCase()));
      setValue("rolId", findRol.id);
    }
  }, [roles]);

  //Seleccionar tipo Hoja
  const [tipoHoja, setTipoHoja] = useState(null);
  const getTipoHoja = () => {
    const nuevoTipoHoja = [
      { id: 0, hoja: "Hoja A0" },
      { id: 1, hoja: "Hoja A1" },
      { id: 2, hoja: "Hoja A2" },
      { id: 3, hoja: "Hoja A3" },
      { id: 4, hoja: "Hoja A4" }
    ];
    setTipoHoja(nuevoTipoHoja);
  };
  useEffect(() => {
    console.log(tipoHoja);
    setValue("tipoHoja", 4);
  }, [tipoHoja]);

  useEffect(() => {
    getTipoHoja();
    getListAppUsers();
    getSemiElaborados();
    getEstados();
    getRoles();
  }, []);

  const [modalImage, setModalImage] = useState(false);

  const [fileProp, setFileProp] = useState(null);

  //Para guardar la imagen cada vez que agrega 1.
  useEffect(() => {
    if (fileProp) setValue("imagen", fileProp.name);
  }, [fileProp]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(submit)} style={{ width: "100%", height: "100%" }}>
        <div>
          <div
            className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew"
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "space-between",
              justifyContent: "space-around",
              alignItems: "stretch",
              padding: "15px"
            }}>
            <div style={{ width: "300px" }}>
              <Controller
                name="dobSemiId"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Pieza</InputLabel>
                    <Select {...field} placeholder="Pieza" variant="standard">
                      {semiElaborados &&
                        semiElaborados.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.codigo}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div style={{ width: "300px" }}>
              <Controller
                name="appUserId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Usuario</InputLabel>
                    <Select {...field} placeholder="Usuario" variant="standard" disabled={true}>
                      {listAppUsers &&
                        listAppUsers.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{`${x.operator.name} ${x.operator.surname} `}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div style={{ width: "300px" }}>
              <Controller
                name="dobEstadoPlanoId"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Estado</InputLabel>
                    <Select {...field} placeholder="Estado" variant="standard" disabled={true}>
                      {estados &&
                        estados.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.descripcion}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
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
                    label="Plano"
                    variant="outlined"
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
            <Tooltip title="Cargar plano">
              <IconButton
                color="secondary"
                onClick={() => {
                  setModalImage(true);
                }}
                size="large">
                <Image />
              </IconButton>
            </Tooltip>
            <Controller
              name="tipoHoja"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Tipo de Hoja</InputLabel>
                  <Select {...field} placeholder="Tipo de Hoja" variant="standard">
                    {tipoHoja &&
                      tipoHoja.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.hoja}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>

          <div
            className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew"
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "space-between",
              justifyContent: "space-around",
              alignItems: "stretch",
              padding: "50px"
            }}>
            <Controller
              name="descripcion"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Observación"
                    variant="outlined"
                    multiline
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className="p-2 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
      <ModalCompoment title="Vista previa del plano" openPopup={modalImage} setOpenPopup={setModalImage}>
        <AprobacionPlanosImage
          fileProp={fileProp}
          setFileProp={setFileProp}
          modalOpen={setModalImage}></AprobacionPlanosImage>
      </ModalCompoment>
    </div>
  );
};
