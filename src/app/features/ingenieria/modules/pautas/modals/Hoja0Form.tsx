import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { PautaIngenieriaSliceRequest } from "app/Middleware/reducers/PautaIngenieriaSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { PautaIngenieriaAprobadaSliceRequest } from "app/Middleware/reducers/PautaIngenieriaAprobadaSlice";
import { Hoja0SliceRequest } from "app/Middleware/reducers/Hoja0Slice";
import { GroupEmailForm } from "app/shared/helpers/GroupEmailForm";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
interface props {
  setOpenPoup: any;
  pautaIngenieriaAprobadaId: number;
  pautaIngenieriaId: number;
  familia: string;
  refresh: any;
}
export const Hoja0Form = ({ setOpenPoup, pautaIngenieriaAprobadaId, pautaIngenieriaId, familia, refresh }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    codigo: string;
    descripcion: string;
  }
  const initialStateVar = {
    codigo: "",
    descripcion: "",
    pautaIngenieriaAprobadaId: pautaIngenieriaAprobadaId
  };

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  const [emails, setEmails] = useState("");

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const callbackEmails = (emailsDestino: string) => {
    setEmails(emailsDestino);
  };

  const getSubString = (inicio, fin) => {
    const codigo = getValues("codigo");
    return codigo.substring(inicio, fin);
  };

  //Verifica que el formato del codigo sea correcto, con respecto a las cantidades que tiene que cumplir cada porcion que lo compone.
  const verificarCodigo = async (codigo: string, pauta) => {
    const { cantVersionProceso, cantGenerico, cantPlataforma, cantLinea, cantPuesto } = pauta;
    let finCorte = cantVersionProceso;
    const versionProceso = getSubString(0, finCorte);
    const generico = getSubString(finCorte, finCorte + cantGenerico);
    finCorte += cantGenerico;
    const plataforma = getSubString(finCorte, finCorte + cantPlataforma);
    finCorte += cantPlataforma;
    const linea = getSubString(finCorte, finCorte + cantLinea);
    finCorte += cantLinea;
    const puesto = codigo.substring(finCorte, codigo.length);
    //Verifico que los datos obtenidos tengan todos la longitud que deben tener.
    if (
      generico != familia ||
      versionProceso.length != cantVersionProceso ||
      generico.length != cantGenerico ||
      plataforma.length != cantPlataforma ||
      linea.length != cantLinea ||
      puesto.length != cantPuesto
    ) {
      openNotificationUI("El codigo no corresponde.", "error");
      return null;
    }
    //si los datos coinciden, entonces retorno la Hoja0.
    const hoja0 = {
      pautaIngenieriaAprobadaId: pautaIngenieriaAprobadaId,
      codigo: getValues("codigo"),
      descripcion: getValues("descripcion")
    };
    return hoja0;
  };

  const sendEmailCambioVersion = async (pautaIngenieriaAprobadaId, pauta, puesto) => {
    const infoUser = GetInfoUser();
    const id = infoUser.id;
    let versionProceso = getValues("codigo");
    const { cantVersionProceso } = pauta;
    versionProceso = getSubString(0, cantVersionProceso);
    const props = {
      pautaIngenieriaAprobadaId: pautaIngenieriaAprobadaId,
      appUserId: id,
      emailsDestino: emails,
      versionProceso: versionProceso,
      puesto: puesto
    };
    try {
      const enviado = await dispatch(EmailSliceRequest.PautaIngenieriaAprobadaCambioVersionEmail(props));
    } catch (x) {
      console.log(x);
    }
  };

  const loginSubmit = async (e) => {
    const pauta = unwrapResult(await dispatch(PautaIngenieriaSliceRequest.getByIdRequest(pautaIngenieriaId))); //Obtengo la pauta para verificar que el codigo ingresado cumpla
    const inputCodigo = getValues("codigo");
    const objetoHoja0 = await verificarCodigo(inputCodigo, pauta);
    let result;
    let result2;
    let puesto;
    if (objetoHoja0) {
      try {
        //Creo la PautaAprobada con el nuevo codigo que tiene que ir, tiene Descripcion ya que se debe mostrar en la pantalla de CALIDAD este campo si es != null
        result = await dispatch(Hoja0SliceRequest.PostRequest(JSON.parse(JSON.stringify(objetoHoja0))));
        const objetoPautaIngenieriaAprobadaAUpdetear = unwrapResult(
          await dispatch(PautaIngenieriaAprobadaSliceRequest.getByIdRequest(pautaIngenieriaAprobadaId))
        );
        //Updeteo la PautaIngenieriaAprobada con el activo en false, ya que se dio de baja y se creo una nueva pauta con el codigo correcto.
        objetoPautaIngenieriaAprobadaAUpdetear.activo = false;
        puesto = objetoPautaIngenieriaAprobadaAUpdetear.puesto;
        result2 = await dispatch(
          PautaIngenieriaAprobadaSliceRequest.PutRequest(
            JSON.parse(JSON.stringify(objetoPautaIngenieriaAprobadaAUpdetear))
          )
        );
      } catch (x) {
        result = null;
      }
      if (result) {
        openNotificationUI("Guardado exitosamente :)", "success");
        setOpenPoup(false);
        refresh();
        sendEmailCambioVersion(pautaIngenieriaAprobadaId, pauta, puesto);
      }
    }
  };

  return (
    <div style={{ height: "%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className=" flex-col grid grid-cols-1 gap-30 " style={{ height: "80%" }}>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="codigo"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Codigo"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="descripcion"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Descripcion"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <GroupEmailForm callback={callbackEmails}></GroupEmailForm>
          <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
