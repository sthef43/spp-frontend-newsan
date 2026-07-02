/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Button, TextField } from "@mui/material";
import { GroupEmailForm } from "app/shared/helpers/GroupEmailForm";
import { IHojaParametro } from "app/models/IHojaParametro";
import { HojaParametroSliceRequests } from "app/Middleware/reducers/HojaParametroSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { EmailSliceRequest, propsHojaDeParametros } from "app/Middleware/reducers/EmailSlice";
import { Controller, useForm } from "react-hook-form";
import { HojaPComentarioSliceRequests } from "app/Middleware/reducers/HojaPComentarioSlice";
import { IAppUser } from "app/models";

interface props {
  setOpenPopup: (newValue: boolean) => void;
  refresh?: () => void;
  editState?: IHojaParametro | null;
  emailState: propsHojaDeParametros;
}

interface initialState {
  comentario?: string | null;
}

const initialStateVar = {
  comentario: ""
};

export const HojaParametrosAprobacionForm = ({ setOpenPopup, refresh, editState, emailState }: props) => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [emails, setEmails] = useState("");

  const watchComentario = watch("comentario");

  //Guardar y Enviar Mail
  const loginSubmit = async (e) => {
    if (e.comentario == "") {
      editState = {
        ...editState,
        estado: editState.userCalidadId != null && editState.userSectorId != null ? "Aprobado" : editState.estado
      };
    } else {
      GuardarComentario(e);
      editState = {
        ...editState,
        estado: "Desaprobado"
      };
    }
    GuardarAprobacion();
    sendEmailHojaParam();
    setOpenPopup(false);
  };

  //Guardar Comentario
  const GuardarComentario = async (e) => {
    const objectComent = {
      hojaParametro: null,
      hojaParametroId: editState.id,
      appUser: null,
      appUserId: infoUser.id,
      comentario: e.comentario
    };
    try {
      const result = unwrapResult(await dispatch(HojaPComentarioSliceRequests.PostRequest(objectComent)));
      refresh();
    } catch (x) {
      openNotificationUI("Error al guardar y enviar mail.", "error");
    }
  };

  //Guardar Aprobacion
  const GuardarAprobacion = async () => {
    try {
      const result = unwrapResult(await dispatch(HojaParametroSliceRequests.PutRequest(editState)));
      refresh();
    } catch (x) {
      openNotificationUI("Error al guardar y enviar mail.", "error");
    }
  };

  //Enviar correos
  const sendEmailHojaParam = async () => {
    let estadoActual;
    if (editState.estado == "Pendiente") {
      editState.userCalidadId != null ? (estadoActual = "Aprobado x Calidad") : (estadoActual = "Aprobado x Sector");
    } else {
      estadoActual = editState.estado;
    }
    const emailStateModif = {
      ...emailState,
      estado: estadoActual,
      emailsDestiners: emails
    };
    try {
      const enviado = unwrapResult(await dispatch(EmailSliceRequest.EmailHojaDeParametros(emailStateModif)));
      openNotificationUI("Mail enviado.", "success");
    } catch (x) {
      openNotificationUI("Error al enviar mails." + x, "error");
    }
  };

  const callbackEmails = (emailsDestino: string) => {
    setEmails(emailsDestino);
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:flex md:flex items-top justify-around w-full font-semibold">
          <div style={{ flex: "1 1 100%" }}>
            <GroupEmailForm callback={callbackEmails}></GroupEmailForm>
          </div>
          <div className="m-2 p-7 rounded-lg shadow-elevation-4 bg-secondaryNew" style={{ flex: "1 1 90%" }}>
            <Controller
              name="comentario"
              control={control}
              rules={{ required: false }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Completar motivo en caso de Desaprobación."
                  variant="standard"
                  multiline
                  type="text"
                  inputProps={{ maxLength: 200 }}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
        </div>
        <div className="p-2 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
          <Button
            className={watchComentario ? classes.redButton : classes.greenButton}
            type="submit"
            variant="contained"
            disabled={!isDirty && !isValid}>
            {watchComentario ? "Desaprobar" : "Aprobar"} y Enviar Correo
          </Button>
        </div>
      </form>
    </div>
  );
};
