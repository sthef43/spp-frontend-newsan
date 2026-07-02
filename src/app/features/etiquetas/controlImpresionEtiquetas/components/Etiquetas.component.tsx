import React, { useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import moment from "moment";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { ImpresionEtiquetaSlice, ImpresionEtiquetaSliceRequests } from "app/Middleware/reducers/ImpresionEtiquetaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";

const defaultLabels = {
  fechaImpresion: "Fecha",
  cantidadImpresa: "Cantidad a imprimir"
  // codigoInterno lo manejamos manual para blur check
};

export const EtiquetasComponent = ({ setOpenPopup, impresionEtiqueta, informacion }: any) => {
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const operator = useAppSelector((state) => state.appUser.data as IAppUser).operator;

  const isRFID = (informacion?.tipoEtiquetaDescripcion ?? "").toLowerCase().includes("rfid");

  // flags para blur checks
  const [codIntChecking, setCodIntChecking] = useState(false);
  const [codIntInUse, setCodIntInUse] = useState(false);

  const [serialInvalid, setSerialInvalid] = useState(false);

  const schema = useMemo(
    () =>
      yup
        .object()
        .shape({
          cantidadImpresa: yup.number().min(0).typeError("Debe ser un numero").required(),
          fechaImpresion: yup.date().required(),
          codigoInterno: yup.string().required("Codigo Interno requerido"),
          rfidDesde: isRFID
            ? yup
                .string()
                .required("Serial requerido")
                .matches(/^\d+$/, "Serial debe ser numérico")
                .max(10, "Máximo 10 dígitos")
            : yup.string().nullable().notRequired()
        })
        .required(),
    [isRFID]
  );

  const defaultState = {
    cantidadImpresa: 0,
    codigoInterno: "",
    codigoModelo: informacion.codigoModelo,
    estadoEtiqueta: "0",
    fechaAprobacion: "",
    fechaImpresion: moment().toISOString(),
    horaAprobacion: "",
    idLinea: informacion.idLinea,
    idTipoEtiqueta: informacion.idTipoEtiqueta,
    lote: informacion.lote,
    nombreUsuario: operator.name + " " + operator.surname,
    numeroOp: informacion.numeroOp,
    usuarioAprobacion: "",
    createdDate: "",
    LastModifiedDate: ""
  };

  const { control, getValues, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...(impresionEtiqueta ?? defaultState),
      rfidDesde: ""
    },
    mode: "onChange"
  });

  const { codigoModelo, lote, numeroOp, nombreUsuario, cantidadImpresa, codigoInterno, rfidDesde } = watch() as any;

  // Prefijo y cálculo
  const prefijo = (informacion?.prefijoNewsan ?? "").trim();
  const pad10 = (n: number) => String(n).padStart(10, "0");
  const qty = Number(cantidadImpresa ?? 0);

  const serialStr = String(rfidDesde ?? "").trim();
  const serial = serialStr === "" ? NaN : Number(serialStr);

  const rfidDesdeFull = useMemo(() => {
    if (!isRFID) return "";
    if (prefijo.length !== 5) return "";
    if (!Number.isFinite(serial)) return "";
    return `${prefijo}${pad10(serial)}`;
  }, [isRFID, prefijo, serial]);

  const rfidHastaFull = useMemo(() => {
    if (!isRFID) return "";
    if (prefijo.length !== 5) return "";
    if (!Number.isFinite(serial)) return "";
    if (!qty || qty <= 0) return "";
    return `${prefijo}${pad10(serial + qty - 1)}`;
  }, [isRFID, prefijo, serial, qty]);

  //_______BLUR CHECK CodigoInterno duplicado_____//
  const checkCodigoInterno = async () => {
    const cod = String(getValues("codigoInterno") ?? "")
      .trim()
      .toUpperCase();

    setValue("codigoInterno", cod);

    if (!cod) {
      setCodIntInUse(false);
      return;
    }

    const original = String(impresionEtiqueta?.codigoInterno ?? "")
      .trim()
      .toUpperCase();
    if (original && cod === original) {
      setCodIntInUse(false);
      return;
    }

    try {
      setCodIntChecking(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/ImpresionEtiqueta/GetByCodInt/${cod}`);

      if (res?.data) {
        setCodIntInUse(true);
        openNotificationUI("Ese Código Interno ya está en uso.", "warning");
      } else {
        setCodIntInUse(false);
      }
    } catch (e: any) {
      // si el backend devuelve 404 cuando no existe, está OK
      if (e?.response?.status === 404) {
        setCodIntInUse(false);
      } else {
        setCodIntInUse(false);
      }
    } finally {
      setCodIntChecking(false);
    }
  };

  const Guardar = async () => {
    try {
      const codIntUpper = String(codigoInterno ?? "")
        .trim()
        .toUpperCase();

      if (!codIntUpper) {
        openNotificationUI("Codigo Interno es obligatorio.", "error");
        return;
      }

      if (codIntInUse) {
        openNotificationUI("Ese Código Interno ya está en uso.", "warning");
        return;
      }

      if (isRFID) {
        if (serialInvalid) {
          openNotificationUI("Serial inválido. Revisá el campo Serie N/S.", "warning");
          return;
        }

        if (!prefijo || prefijo.length !== 5) {
          openNotificationUI("No se pudo obtener el prefijo RFID para este modelo.", "error");
          return;
        }

        if (!rfidDesdeFull || rfidDesdeFull.length !== 15) {
          openNotificationUI("RFID Desde inválido.", "error");
          return;
        }

        if (!rfidHastaFull || rfidHastaFull.length !== 15) {
          openNotificationUI("RFID Hasta inválido.", "error");
          return;
        }
      }

      const values: any = getValues();
      values.codigoInterno = codIntUpper;

      let saved: any;
      if (impresionEtiqueta) {
        saved = unwrapResult(await dispatch(ImpresionEtiquetaSliceRequests.putRequest(values)));
      } else {
        saved = unwrapResult(await dispatch(ImpresionEtiquetaSliceRequests.postRequest(values)));
      }

      if (isRFID) {
        const payloadRFID = {
          idImpresionEtiqueta: saved.idImpresionEtiqueta,
          codigoInterno: codIntUpper,
          cantidad: qty,
          rfidDesde: rfidDesdeFull,
          rfidHasta: rfidHastaFull,
          largo: 15,
          estado: 0,
          idLinea: informacion.idLinea,
          idTipoEtiqueta: informacion.idTipoEtiqueta,
          nombreUsuario: nombreUsuario
        };

        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/ImpresionEtiquetaRFID/post`, payloadRFID);
        } catch (e: any) {
          const raw = String(e?.response?.data ?? e?.message ?? "");
          const msg = raw.toLowerCase();

          try {
            await axios.delete(
              `${process.env.REACT_APP_API_URL}/ImpresionEtiqueta/DeleteWithRFID/${saved.idImpresionEtiqueta}`
            );
          } catch {
            // rollback
          }

          if (msg.includes("rango_solapado")) {
            openNotificationUI("Ese rango RFID ya está cargado.", "warning");
            return;
          }
          if (msg.includes("rfid_invalido_largo_15")) {
            openNotificationUI("RFID debe tener exactamente 15 dígitos.", "error");
            return;
          }
          if (msg.includes("codigo_interno_duplicado")) {
            openNotificationUI("Ese Código Interno ya está en uso.", "warning");
            return;
          }
          if (msg.includes("ya_existe_rfid_para_impresion")) {
            openNotificationUI("Ya existe RFID para esta impresión.", "warning");
            return;
          }

          openNotificationUI(raw || "Error guardando RFID.", "error");
          return;
        }
      }

      openNotificationUI("Guardado", "success");
      await dispatch(ImpresionEtiquetaSliceRequests.getByOP(informacion.numeroOp));
      await dispatch(ImpresionEtiquetaSlice.actions.filtrar(informacion.idTipoEtiqueta));
      setOpenPopup(false);
    } catch (error: any) {
      const raw = String(error ?? "");
      const msg = raw.toLowerCase();

      if (msg.includes("409") || msg.includes("conflict") || msg.includes("duplic")) {
        openNotificationUI("Ese Código Interno ya está en uso.", "warning");
        return;
      }

      openNotificationUI("Error guardando.", "error");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 my-4 gap-6">
        <div className="font-bold">Codigo Modelo</div>
        <div className="col-span-1">{codigoModelo}</div>
        <div className="font-bold">Lote</div>
        <div className="col-span-1">{lote}</div>
        <div className="font-bold">Numero OP</div>
        <div className="col-span-1">{numeroOp}</div>
        <div className="font-bold">Nombre de Usuario</div>
        <div className="col-span-1">{nombreUsuario}</div>
      </div>
      <GenericFieldsGenerator
        values={defaultState}
        control={control}
        styleDiv={"text-center mb-5"}
        styleFieldSX={{}}
        labels={defaultLabels}
      />
      {/* Codigo Interno con blur check */}
      <Controller
        name="codigoInterno"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            label="Codigo Interno"
            {...field}
            value={(field.value || "").toUpperCase()}
            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
            onBlur={checkCodigoInterno}
            error={!!fieldState.error || codIntInUse}
            helperText={codIntInUse ? "Ya está en uso" : fieldState.error?.message}
            fullWidth
            sx={{ maxWidth: "63%", margin: "0 auto", display: "block", marginBottom: "16px" }}
          />
        )}
      />
      {isRFID && (
        <div className="grid grid-cols-1 gap-4 mb-5 justify-items-center">
          <Controller
            name="rfidDesde"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Serie N/S:"
                {...field}
                value={field.value || ""}
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d{0,10}$/.test(v)) field.onChange(v);
                }}
                error={!!fieldState.error || serialInvalid}
                helperText={serialInvalid ? "Serial inválido" : fieldState.error?.message}
                fullWidth
                sx={{ maxWidth: "63%" }}
              />
            )}
          />

          <TextField label="RFID Desde" value={rfidDesdeFull} fullWidth disabled sx={{ maxWidth: "63%" }} />
          <TextField label="RFID Hasta" value={rfidHastaFull} fullWidth disabled sx={{ maxWidth: "63%" }} />
        </div>
      )}

      <div className="text-center">
        <Button
          variant="contained"
          className={classes.greenButton}
          onClick={Guardar}
          disabled={codIntChecking || codIntInUse || (isRFID && serialInvalid)}>
          Guardar
        </Button>
      </div>
    </div>
  );
};
