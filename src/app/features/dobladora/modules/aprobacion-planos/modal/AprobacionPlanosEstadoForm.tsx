import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Select, MenuItem, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobEstadoPlanoSliceRequests } from "app/Middleware/reducers/DobEstadoPlanoSlice";
import { IDobPlano } from "app/models/IDobPlano";
import { GroupEmailForm } from "app/shared/helpers/GroupEmailForm";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { DobPlanoSliceRequests } from "app/Middleware/reducers/DobPlanoSlice";
import { DobComentarioSliceRequests } from "app/Middleware/reducers/DobComentarioSlice";
import { IAppUser } from "app/models";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
interface props {
  setOpenPopup: any;
  estadoPlano?: IDobPlano | null;
  refresh?: any;
}

export const AprobacionPlanosEstadoForm = ({ setOpenPopup, estadoPlano, refresh }: props) => {
  console.log(estadoPlano);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const classes = MaterialButtons();
  interface initialState {
    id: number;
    dobSemiId?: number | null;
    dobEstadoPlanoId?: number | null;
    appUserId?: number | null;
    rolId?: number | null;
    imagen?: string | null;
    descripcion?: string | null;
    dibujaId?: number | null;
    verificaId?: number | null;
    apruebaId?: number | null;
    tipoHoja?: number | null;
    verificaDate?: string | null;
    apruebaDate?: string | null;
    comentario?: string | null;
  }

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estadoPlano
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const sendEmailPlanosCambioEstado = async (usuario, semielaborado, estadoActual, comentarioActual) => {
    const props = {
      usuario: usuario,
      semi: semielaborado,
      estado: estadoActual,
      comentario: comentarioActual,
      emailsDestiners: emails
    };
    try {
      const enviado = await dispatch(EmailSliceRequest.EmailAprobacionPlanos(props));
    } catch (x) {
      openNotificationUI("Error al enviar mails." + x, "error");
    }
  };

  const loginSubmit = async (e) => {
    let objectSubmit = {
      id: e.id,
      dobSemiId: e.dobSemiId,
      dobEstadoPlanoId: getValues("dobEstadoPlanoId"),
      appUserId: e.appUserId,
      rolId: e.rolId,
      dibujaId: e.dibujaId,
      verificaId: e.verificaId,
      apruebaId: e.apruebaId,
      imagen: e.imagen,
      descripcion: e.descripcion,
      delete: false,
      createdDate: e.createdDate,
      lastModifiedDate: e.lastModifiedDate,
      tipoHoja: e.tipoHoja,
      verificaDate: e.verificaDate,
      apruebaDate: e.apruebaDate
    };

    if (esIngenieria) {
      // console.log("Escribir para ingenieria");
      objectSubmit = { ...objectSubmit, dibujaId: infoUser.id };
    } else {
      if (esDobladora) {
        // console.log("Escribir para dobladora");
        objectSubmit = { ...objectSubmit, verificaId: infoUser.id, verificaDate: e.lastModifiedDate };
      } else {
        if (esCalidad) {
          // console.log("Escribir para calidad");
          objectSubmit = { ...objectSubmit, apruebaId: infoUser.id, apruebaDate: e.lastModifiedDate };
        }
      }
    }
    console.log(objectSubmit);
    const objectSubmit2 = {
      dobPlanoId: e.id,
      appUserId: getValues("appUserId"),
      comentario: getValues("comentario")
    };

    //Comentario a modo de prueba de mail
    try {
      const result = await dispatch(DobPlanoSliceRequests.PutRequest(JSON.parse(JSON.stringify(objectSubmit))));
      const result2 = await dispatch(DobComentarioSliceRequests.PostRequest(JSON.parse(JSON.stringify(objectSubmit2))));
      if (result.payload == "") {
        openNotificationUI("Error al modificar el Estado del Plano.", "error");
      } else {
        openNotificationUI("Modificación correcta.", "success");
      }

      if (result2.payload == "") {
        openNotificationUI("Error al enviar correos.", "error");
      } else {
        const dataUser = GetInfoUser();
        const findUser = listAppUsers.find((x) => x.username == dataUser.username);
        const estadoActual = estados.find((x) => x.id == e.dobEstadoPlanoId)?.descripcion;
        sendEmailPlanosCambioEstado(
          findUser.operator.name + " " + findUser.operator.surname,
          e.dobSemi.codigo,
          estadoActual,
          e.comentario
        );
        openNotificationUI("Envío satisfactorio de correos.", "success");
      }
      refresh();
      setOpenPopup(false);
    } catch (error) {
      openNotificationUI("Error envío de correos.", "error");
    }
  };

  //Cargo los comboBox con las Selecciones de Tablas
  const [estados, setEstados] = useState([]);
  const getEstados = async () => {
    try {
      const responses = unwrapResult(await dispatch(DobEstadoPlanoSliceRequests.getAllRequest()));
      setEstados(responses);
    } catch (error) {
      openNotificationUI("Error al leer estados.", "error");
    }
  };

  //Usuario
  const [listAppUsers, setListAppUsers] = useState([]);
  const getListAppUsers = async () => {
    try {
      const responses = unwrapResult(await dispatch(AppUserSliceRequests.getAllRequest()));
      setListAppUsers(responses);
    } catch (error) {
      openNotificationUI("Error al leer usuarios.", "error");
    }
  };

  useEffect(() => {
    getEstados();
    getListAppUsers();
    getListRol();
  }, []);

  useEffect(() => {
    if (listAppUsers.length > 0) {
      const dataUser = GetInfoUser();
      const findUser = listAppUsers.find((x) => x.username == dataUser.username);
      setValue("appUserId", findUser.id);
    }
  }, [listAppUsers]);

  //Email
  const [emails, setEmails] = useState("");
  const callbackEmails = (emailsDestino: string) => {
    setEmails(emailsDestino);
  };

  //Get Roles para cargar en combobox
  const [listRol, setlistRol] = useState([]);
  const [esIngenieria, setEsIngenieria] = useState(false);
  const [esDobladora, setEsDobladora] = useState(false);
  const [esCalidad, setEsCalidad] = useState(false);
  const getListRol = async () => {
    let result = [];
    try {
      result = unwrapResult(await dispatch(RolSliceRequests.getAllRequest()));
      if (result) {
        console.log(infoUser.permisos.rol.name.toUpperCase().includes("calidad".toUpperCase()));
        if (infoUser.permisos.rol.name.toUpperCase().includes("ingenie".toUpperCase())) {
          // console.log("Es ingenieria");
          setEsIngenieria(true);
          const filterResult = result.filter((x) => x.name.toUpperCase().includes("doblador".toUpperCase()));
          setValue("rolId", filterResult[0].id);
          setlistRol(filterResult);
        } else {
          if (infoUser.permisos.rol.name.toUpperCase().includes("doblador".toUpperCase())) {
            // console.log("Es dobladora");
            setEsDobladora(true);
            const filterResult = result.filter(
              (x) =>
                x.name.toUpperCase().includes("calidad".toUpperCase()) ||
                x.name.toUpperCase().includes("ingenier".toUpperCase())
            );
            setValue("rolId", filterResult[1].id);
            setlistRol(filterResult);
          } else {
            if (infoUser.permisos.rol.name.toUpperCase().includes("calida".toUpperCase())) {
              // console.log("Es calidad");
              setEsCalidad(true);
              const filterResult = result.filter(
                (x) =>
                  x.name.toUpperCase().includes("ingenie".toUpperCase()) ||
                  x.name.toUpperCase().includes("doblador".toUpperCase())
              );
              setValue("rolId", filterResult[0].id);
              setValue("dobEstadoPlanoId", 2);
              setlistRol(filterResult);
            }
          }
        }
      }
    } catch (error) {
      openNotificationUI("Error al leer roles.", "error");
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
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
              name="appUserId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel></InputLabel>
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
                  <Select {...field} placeholder="Estado" variant="standard" disabled={!esCalidad}>
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
          <div style={{ width: "300px" }}>
            <Controller
              name="rolId"
              control={control}
              rules={{ required: true }}
              defaultValue={listRol && listRol.length > 0 ? listRol[0] : ""}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Rol</InputLabel>
                  <Select {...field} placeholder="Rol" variant="standard">
                    {listRol &&
                      listRol.map((x) => (
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
          </div>
        </div>
        <div className="m-1 sm:flex md:flex items-top justify-around w-full font-semibold">
          <div style={{ flex: "1 1 100%" }}>
            <GroupEmailForm callback={callbackEmails}></GroupEmailForm>
          </div>
          <div className="m-2 p-7 rounded-lg shadow-elevation-4 bg-secondaryNew" style={{ flex: "1 1 90%" }}>
            <Controller
              name="comentario"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Observación"
                  variant="standard"
                  multiline
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
        </div>

        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
