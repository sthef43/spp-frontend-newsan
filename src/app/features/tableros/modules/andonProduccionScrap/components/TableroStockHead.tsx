import { Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaPuestoTableroSlice } from "app/Middleware/reducers/LineaPuestoTableroSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { TrazaUnit_History2SliceRequests } from "app/Middleware/reducers/TrazaUnit_History2Slice";
import { TurnoSliceRequests, turnoSlice } from "app/Middleware/reducers/TurnoSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IRechazo } from "app/models/IRechazo";
import { ItemTablero } from "app/features/tableros/modules/andonStockPlacasAutomatica/ItemTablero";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect } from "react";

export const TableroStockHead = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const lineaPuesto = useAppSelector((state) => state.lineaPuesto.object);
  const rechazos: IRechazo[] = useAppSelector((state) => state.rechazo.dataAll);
  const linea = useAppSelector((state) => state.linea.object);
  const lineaPuestoTablero = useAppSelector((state) => state.lineaPuestoTablero.object);

  const getAcum = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const produccido = unwrapResult(
        await dispatch(TrazaUnit_History2SliceRequests.getProduccidoTodayByLineaPuesto(lineaPuesto.id))
      );
      dispatch(LineaPuestoTableroSlice.actions.setProducido(produccido));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const getRechazos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const hora = moment().format("HH:mm:ss");
      const fecha = moment().format("YYYY-MM-DD");
      const turnos = unwrapResult(await dispatch(TurnoSliceRequests.getAllRequest()));
      const turno = turnos.find((t) => t.desdeHora <= hora && t.hastaHora >= hora);
      turno && dispatch(turnoSlice.actions.setObject(turno));
      const { desdeHora, hastaHora } = turno;
      await dispatch(
        RechazoSliceRequests.GetAllByLineaIdFechaAndPuesto({
          fecha,
          horaDesde: desdeHora,
          horaHasta: hastaHora,
          idLinea: linea.idLinea,
          puestoNombre: lineaPuesto.puesto.nombre
        })
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  // Consulta cada 10 mins los rechazos
  useEffect(() => {
    console.log("se inicio el intervalo");
    const intervalId = setInterval(() => {
      void getAcum();
      // }, 10 * 60 * 1000); // 5 minutos en milisegundos
    }, 30000); // 1/2 minutos en milisegundos
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    void getAcum();
  }, []);
  useEffect(() => {
    lineaPuestoTablero.producido && linea && getRechazos();
  }, [lineaPuestoTablero.producido]);
  return (
    <div className="w-full mt-5 grid items-center justify-items-center grid-cols-3 px-10">
      <ItemTablero bgcolor="#9AD2C7">
        <Typography align="center" variant="h1" color="#141639" fontWeight={900} fontSize={"6rem"}>
          <Typography
            align="center"
            variant="h3"
            fontWeight="900"
            color="#141639"
            style={{ lineHeight: "2.167" }}
            fontSize={"4rem"}>
            PRODUCCIÓN
          </Typography>
          {lineaPuestoTablero.producido}
        </Typography>
      </ItemTablero>
      <ItemTablero bgcolor="#FAA7A8">
        <Typography align="center" variant="h1" color="#141639" fontWeight={900} fontSize={"6rem"}>
          <Typography
            align="center"
            variant="h3"
            fontWeight="900"
            color="#141639"
            style={{ lineHeight: "2.167" }}
            fontSize={"4rem"}>
            NO GOOD
          </Typography>
          {rechazos?.length || 0}
        </Typography>
      </ItemTablero>
      <ItemTablero bgcolor="#9CA2C6">
        <Typography variant="h1" color="#141639" fontWeight={900} align="center" fontSize={"6rem"}>
          <Typography
            align="center"
            variant="h3"
            fontWeight="900"
            color="#141639"
            style={{ lineHeight: "2.167" }}
            fontSize={"4rem"}>
            SCRAP
          </Typography>
          {parseInt(lineaPuestoTablero.scrap) / lineaPuestoTablero.producido || 0}%
        </Typography>
      </ItemTablero>
    </div>
  );
};
