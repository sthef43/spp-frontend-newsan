import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IControlLote } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import { ReprocesoLineaSliceRequests } from "app/Middleware/reducers/ReprocesoLineaSlice";
import { ReprocesoLoteSliceRequests } from "app/Middleware/reducers/ReprocesoLoteSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { GroupEmailForm } from "app/shared/helpers/GroupEmailForm";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";

interface props {
  idControlLote: number;
  cantidadTotal: number; //La cantidad total a generar de ReprocesosLineas
  getListByControlLoteId: any; //Una funcion q devuelve un listado de ReprocesosLineas segun contorlLoteId
  reprocesosLineasDesdeHasta: any; //Es el listado q muestra desde hasta y cantidad.
  refreshList: any; //Refresca el listado principal de los reprocesos
  setOpenPopup: any; //Para cerrar el emergente de Equipos Reprpocesados.
  lineaModeloProp: any; //Nombre de la linea seleccionada y el modelo .
}

export const AprobacionReprocesosForm = ({
  idControlLote,
  cantidadTotal,
  getListByControlLoteId,
  reprocesosLineasDesdeHasta,
  refreshList,
  setOpenPopup,
  lineaModeloProp
}: props) => {
  const classes = MaterialButtons();
  const { handleSubmit, formState, control, getValues } = useForm({ defaultValues: { descripcion: "" } });
  const { isDirty, isValid } = formState;
  const { openNotificationUI } = useNotificationUI();

  const submit = async (e) => {
    if (emails == "") {
      //control para que los emails sean obligatorios
      openNotificationUI("Los correos electronicos son obligatorios!", "warning");
      return false;
    }
    const actualizoControlLote = await actualizarControlLote();
    const actualizoReprocesosLines = await actualizarReprocesosLineas();
    const creoReprocesosLotes = crearReprocesosLotes();
    if (actualizoControlLote && actualizoReprocesosLines && creoReprocesosLotes) {
      openNotificationUI("Datos guardados exitosamente :)", "success");
      sendEmail();
      refreshList();
      setOpenPopup();
    }
  };

  const sendEmail = async () => {
    const props = {
      linea: lineaModeloProp.linea,
      modelo: lineaModeloProp.modelo,
      array: reprocesosLineasDesdeHasta,
      supervisor: lineaModeloProp.nombreSupervisor,
      emailsDestiners: emails
    };
    try {
      unwrapResult(await dispatch(EmailSliceRequest.CalidadAprobacionReprocesoEmail(props)));
    } catch (error) {
      console.log(error);
    }
  };

  const armarObjetoReprocesoLote = (element, user, date, controlLote) => {
    const reprocesoLote = {
      IdControlLote: idControlLote,
      numeroOP: controlLote.numeroOp,
      serieDesde: element.desde,
      serieHasta: element.hasta,
      idEstadoLote: controlLote.idEstadoLote,
      observaciones: getValues("descripcion"),
      cantidadReprocesada: element.cantidad,
      fecha: date,
      auditor: `${user.name} ${user.surname}`
    };
    return reprocesoLote;
  };

  const crearReprocesosLotes = async () => {
    const reprocesosLotes = [];
    let reprocesoLote;
    const controlLote = await getControlLote();
    const date = new Date();
    const user = await getInfoUser();
    reprocesosLineasDesdeHasta.forEach((element) => {
      reprocesoLote = armarObjetoReprocesoLote(element, user, date, controlLote);
      reprocesosLotes.push(reprocesoLote);
    });
    let result;
    try {
      result = unwrapResult(await dispatch(ReprocesoLoteSliceRequests.multiPostRequest(reprocesosLotes)));
    } catch (e) {
      console.log(e);
    }
    if (result) return true;
    else return false;
  };

  const actualizarReprocesosLineas = async () => {
    //Obtengo el listado de ReprocesosLineas donde el estadoReproceso = null
    const listadoReprocesoLineaByControlLote: Array<IReprocesoLinea> = unwrapResult(
      await dispatch(ReprocesoLineaSliceRequests.getListByControlLoteId(idControlLote))
    );
    listadoReprocesoLineaByControlLote.filter((x) => x.estadoReproceso == null);
    //Actualizo estadoReproceso con "S"
    let newObject: IReprocesoLinea = null;
    const resultMap = listadoReprocesoLineaByControlLote.map((x) => {
      newObject = { ...x, estadoReproceso: "S" };
      return newObject;
    });
    let result;
    try {
      result = unwrapResult(await dispatch(ReprocesoLineaSliceRequests.multiPutRequest(resultMap)));
    } catch (e) {
      console.log(e);
    }
    if (result) return true;
    else return false;
  };

  const getInfoUser = async () => {
    const user = GetInfoUser();
    let result;
    try {
      result = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(user.dni || 0)));
    } catch (e) {
      console.log(e);
    }
    if (result) return result;
  };

  const actualizarControlLote = async () => {
    const controlLote: IControlLote = await getControlLote();
    const { cantidadReprocesos, cantidadRechazos } = controlLote;
    controlLote.cantidadReprocesos = cantidadReprocesos != null ? cantidadReprocesos + cantidadTotal : cantidadTotal;
    if (cantidadRechazos != null) {
      if (controlLote.cantidadReprocesos == cantidadRechazos) controlLote.estadoReproceso = "S";
    }
    let result;
    try {
      result = unwrapResult(await dispatch(ControlLoteSliceRequests.putRequest(controlLote)));
    } catch (e) {
      console.log(e);
    }
    if (result) return true;
    else return false;
  };

  const dispatch = useAppDispatch();

  const getControlLote = async () => {
    let result: IControlLote;
    try {
      result = unwrapResult(await dispatch(ControlLoteSliceRequests.getControlLoteByIdRequest(idControlLote)));
    } catch (e) {
      console.log(e);
    }
    if (result) return result;
  };

  const [emails, setEmails] = useState("");

  const callbackEmails = (emailsDestino: string) => {
    setEmails(emailsDestino);
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <form onSubmit={handleSubmit(submit)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "98%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="descripcion"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="descripcion"
                  label="descripcion"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <GroupEmailForm callback={callbackEmails}></GroupEmailForm>

            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
