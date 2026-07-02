import { Box, Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaPuestoTableroSlice } from "app/Middleware/reducers/LineaPuestoTableroSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { TrazaUnit_History2SliceRequests } from "app/Middleware/reducers/TrazaUnit_History2Slice";
import { TurnoSliceRequests, turnoSlice } from "app/Middleware/reducers/TurnoSlice";
import { PeriodoLineaSliceRequest } from "app/Middleware/reducers/periodoLineaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IHora } from "app/models/IHora";
import { IRechazo } from "app/models/IRechazo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";

export const TableroPuestoHead = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const lineaPuesto = useAppSelector((state) => state.lineaPuesto.object);
  const rechazos: IRechazo[] = useAppSelector((state) => state.rechazo.dataAll);
  const linea = useAppSelector((state) => state.linea.object);
  const lineaOld = useAppSelector((state) => state.linea.object);
  const lineaPuestoTablero = useAppSelector((state) => state.lineaPuestoTablero.object);
  const turnoSelect = useAppSelector((state) => state.turno.object);

  const [producido, setProducido] = useState(0);
  const [diferencia, setDiferencia] = useState(0);
  const [hora, setHora] = useState<IHora>({} as IHora);

  function Item(props: any) {
    const { sx, bgcolor, bordercolor, ...other } = props;
    return (
      <Box
        sx={{
          p: 1,
          m: 1,
          borderRadius: 2,
          fontSize: "8rem",
          fontWeight: "700",
          height: "100%",
          width: "90%",
          justifyItems: "center",
          alignItems: "center",
          backgroundColor: bgcolor
            ? bgcolor
            : lineaPuestoTablero.color == "verde"
            ? "#9AD2C7"
            : lineaPuestoTablero.color == "amarillo"
            ? "#F8E378"
            : "#EF787A",
          border: bordercolor ? bordercolor : "",
          margin: "5px",
          ...sx
        }}
        {...other}
      />
    );
  }

  const getAcum = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const produccido = unwrapResult(
        await dispatch(TrazaUnit_History2SliceRequests.getProduccidoTodayByLineaPuesto(lineaPuesto.id))
      );
      setProducido(produccido);
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
  const handleSearch = async (listHoras: IHora[]) => {
    let objeto: {
      id: number;
      desde: string;
      hasta: string;
      diferencia: number;
    };
    let diferenciaTotal = 0; //contabiliza la diferencia en total.
    const minutosTotalesTrabajo = calcularMinutosTotales(listHoras);
    //Recorro las horas y armo la lista de cada registro con la produccion, target, diferencia, etc...
    for (const element of listHoras) {
      const parametros = {
        fecha: moment().format("YYYY-MM-DD"),
        idHora: element.idHora,
        puestoLineaId: lineaPuestoTablero.lineaPuestoId
      };

      objeto = await getData(parametros, element, minutosTotalesTrabajo);
      diferenciaTotal += objeto.diferencia;
    }
    setDiferencia(diferenciaTotal);
  };
  const getDiferencia = async () => {
    try {
      const periodoLinea = unwrapResult(
        await dispatch(
          PeriodoLineaSliceRequest.getByLineaAndTurno({
            lineaId: lineaOld.idLinea,
            turno: turnoSelect.abreviatura
          })
        )
      );
      if (periodoLinea) {
        if (periodoLinea.periodo) {
          const listHoras = periodoLinea.periodo.periodoHora.map((x) => x.hora); //Me obtengo el array de Horas.
          handleSearch(listHoras);
          setHora(listHoras[0]);
        }
      } else {
        openNotificationUI(
          "No se encuentra un periodo asignado para esa linea. Asegurese de asignar un Periodo a la Linea.",
          "error"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async (parametros, element, minutosTotalesTrabajo) => {
    let result = [];
    result = unwrapResult(await dispatch(TrazaUnit_History2SliceRequests.getAllByFechaAndTurnoAndOthers(parametros)));
    if (result) {
      const target = await calcularTarget(element.desdeHora, element.hastaHora, minutosTotalesTrabajo, element.minutos);
      const produccion = result;
      const objeto = {
        id: element.idHora,
        desde: element.desdeHora,
        hasta: element.hastaHora,
        diferencia: produccion.length - target
      };

      //calcularColorAndon(objeto);
      return objeto;
    }
  };
  const calcularTarget = async (desdeHora: string, hastaHora: string, minutosTotalesTrabajo, minutosActuales) => {
    const horaActual = moment().format("HH:mm");
    const horaActualDesde = moment(desdeHora, "HH:mm").format("HH:mm");
    const horaActualHasta = moment(hastaHora, "HH:mm").format("HH:mm");
    let minutosPorHora = minutosActuales; //Normalmente es 60 o 55 si es el ultimo registro.

    //Si la hora actual esta dentro del rango del horario del registro Desde Hasta, obtengo los minutos. normalmente ronda entre 1 min y 60 min.
    if (horaActual >= horaActualDesde && horaActual <= horaActualHasta) {
      const diferencia = moment().diff(moment(desdeHora, "HH:mm"), "minutes"); //Obtengo los minutos
      console.log(" Diferencia " + diferencia);
      minutosPorHora = diferencia;
    }
    //Si son las 10 y estoy consultando el registro de las 11 o >. Entonces no calculo nada.
    if (horaActual < horaActualDesde) {
      minutosPorHora = 0;
    }
    const total = (minutosPorHora * lineaPuestoTablero.objetivo) / minutosTotalesTrabajo; //Regla de 3 simples
    return Math.trunc(total); //Devuelve solo la parte entera.
  };
  const calcularMinutosTotales = (listHoras: IHora[]) => {
    let sumaTotal = 0;
    for (let index = 0; index < listHoras.length; index++) {
      sumaTotal += listHoras[index].minutos;
    }

    return sumaTotal;
  };

  const calcularColorAndon = async () => {
    //calculo los minutos que pasaron desde que arranco la jornada hasta ahora.
    const horaActual = moment();
    if (!hora) return false;
    const horaActualDesde = moment(hora.desdeHora, "HH:mm"); //obtengo la primer hora del periodo
    const minutosPasados = horaActual.diff(horaActualDesde, "minutes"); //Obtengo la diferencia en minutos desde la hora actual hasta la primer hora del periodo
    const deberiaHaberProducido = (minutosPasados * lineaPuestoTablero.objetivo) / 535; //Calculo los equipos que se deberian haber producido hasta el momento segun la hora actual.
    const quincePorciento = 0.15 * deberiaHaberProducido * -1; //Obtengo el 15% de lo que tendria que estar producido y lo multiplico por -1 para que quede en negativo.
    if (diferencia > 0) {
      dispatch(LineaPuestoTableroSlice.actions.setColor("verde"));
    } else if (diferencia - producido > quincePorciento && diferencia < 0) {
      dispatch(LineaPuestoTableroSlice.actions.setColor("amarillo"));
    } else if (diferencia - producido < quincePorciento) {
      dispatch(LineaPuestoTableroSlice.actions.setColor("rojo"));
    }
  };

  useEffect(() => {
    lineaPuesto && getAcum();
  }, [lineaPuesto]);
  useEffect(() => {
    producido && linea && getRechazos();
    producido > 0 && getDiferencia();
    producido > 0 && getDiferencia();
    producido > 0 && calcularColorAndon();
  }, [producido]);
  // Consulta cada produccidos cada 30 seg
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

  return (
    <div className="w-full mt-5 grid items-center justify-items-center grid-cols-4 px-10">
      <Item bgcolor="#151144" bordercolor="white solid 1px">
        <Typography align="center" variant="h1" color="white" fontWeight={900} fontSize={"6rem"}>
          <Typography
            align="center"
            variant="h3"
            fontWeight="900"
            fontSize={"4rem"}
            color="white"
            style={{ lineHeight: "2.167" }}>
            OBJETIVO
          </Typography>
          {lineaPuestoTablero.objetivo}
        </Typography>
      </Item>
      <Item>
        <Typography align="center" variant="h1" color="black" fontWeight={900} fontSize={"6rem"}>
          <Typography
            align="center"
            variant="h3"
            fontWeight="900"
            fontSize={"4rem"}
            color="black"
            style={{ lineHeight: "2.167" }}>
            PRODUCCIÓN
          </Typography>
          {producido}
        </Typography>
      </Item>
      <Item>
        <Typography variant="h1" color="black" fontWeight={900} fontSize={"6rem"} align="center">
          <Typography
            align="center"
            variant="h3"
            fontWeight="900"
            fontSize={"4rem"}
            color="black"
            style={{ lineHeight: "2.167" }}>
            DIFERENCIA
          </Typography>
          {diferencia}
        </Typography>
      </Item>
      <Item bgcolor="#EF787A">
        <Typography align="center" variant="h1" color="black" fontWeight={900} fontSize={"6rem"}>
          <Typography
            align="center"
            variant="h3"
            fontWeight="900"
            fontSize={"4rem"}
            color="black"
            style={{ lineHeight: "2.167" }}>
            RECHAZOS
          </Typography>
          {rechazos?.length || 0}
        </Typography>
      </Item>
    </div>
  );
};
