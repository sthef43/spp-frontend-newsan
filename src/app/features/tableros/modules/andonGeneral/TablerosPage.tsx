import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";

import { TableroModalForm } from "../../components/TableroModalForm";
import classNames from "classnames";
import Box from "@mui/material/Box";
import { IHora } from "app/models/IHora";
import { IAjuste } from "app/models/IAjuste";
import { unwrapResult } from "@reduxjs/toolkit";
import { PeriodoLineaSliceRequest } from "app/Middleware/reducers/periodoLineaSlice";
import moment from "moment";
import { IInicio, ILinea, IPlanProd } from "app/models";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { ITargets } from "app/models/ITargets";
import { TargetsSliceRequests } from "app/Middleware/reducers/TargetsSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import { AjusteSliceRequests } from "app/Middleware/reducers/AjusteSlice";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { BinariosIdentificadoresSlice } from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { ComunicadoSliceRequest } from "app/Middleware/reducers/ComunicacionSlice";
import { IComunicado } from "app/models/IComunicado";

//TODO:
/**
 * Datos a obtener
 * 1° Target de la linea
 * 2° Periodo de hora de la linea
 * 3° Produccion Real
 * 4° Ajuste
 */

interface props {
  turno: string;
}

export const TablerosPage = ({ turno }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const navBarState = useAppSelector((state) => state.binariosIdentificadores.ocultar);
  const { openNotificationUI } = useNotificationUI();
  const [target, setTarget] = useState(0);
  const [fpy, setFpy] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [totalEmbalados, setTotalEmbalados] = useState(0);
  const [comunicado, setComunicado] = useState<IComunicado[]>([]);
  const [diferencia, setDiferencia] = useState(0);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<ILinea>(null);
  const [colorAndon, setColorAndon] = useState("verde");
  const [ajuste, setAjuste] = useState(0);
  const [horas, setHoras] = useState(null);
  const targetRef = useRef(0);
  const ajusteRef = useRef(0);

  //
  const produccionEstimada = useRef(0);
  const produccionReal = useRef(0);
  //

  const { TitleChanger } = useTitleOfApp();

  useEffect(() => {
    TitleChanger("TRAZABILIDAD");
  }, []);

  function Item(props: any) {
    const { sx, bgcolor, bordercolor, ...other } = props;
    return (
      <Box
        sx={{
          boxShadow: "0px 7px 10px -11px #D2D2D2",
          p: 1,
          m: 1,
          borderRadius: 2,
          fontSize: "4rem",
          fontWeight: "700",
          height: "100%",
          width: "90%",
          justifyItems: "center",
          alignItems: "center",
          backgroundColor: bgcolor
            ? bgcolor
            : colorAndon == "verde"
            ? "#9AD2C7"
            : colorAndon == "amarillo"
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

  const colores = {
    verde: "#0F2415",
    amarillo: "#FFBE16",
    rojo: "#96322c"
  };

  const getTableRow = (element, index): JSX.Element => {
    //totalNoConformes += element.rechazados;
    return (
      <TableRow
        key={index}
        sx={{
          "&:last-child th, &:last-child td": {
            borderBottom: 1,
            breakInside: "avoid",
            color: "#fff"
          },
          "&:nth-of-type(odd)": {
            backgroundColor: colorAndon == "verde" ? "" : colorAndon == "amarillo" ? "#F8E378" : "#EF787A",
            color: "#000"
          }
        }}>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: colorAndon == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.modelo}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: colorAndon == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.op}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: colorAndon == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.lote}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: colorAndon == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.cantidad}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: colorAndon == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.embalados}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: colorAndon == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.rechazos || 0}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: colorAndon == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.restaLote}
        </TableCell>
      </TableRow>
    );
  };

  //--------------------LOGICA PARA CALCULAR DATOS ---------------------------------------

  const calcularMinutosTotales = (listHoras: IHora[]) => {
    let sumaTotal = 0;
    for (let index = 0; index < listHoras.length; index++) {
      sumaTotal += listHoras[index].minutos;
    }
    return sumaTotal;
  };

  //Obtengo el target total de la linea, segun la familia.
  const getTarget = async (registroInicio: IInicio) => {
    let result: ITargets;

    if (registroInicio.nroOp == null) {
      return 0;
    }

    //Ahora la familia/generico, la obtengo del plan de producicon.
    const planProd = await getPlanProdByNroOp(registroInicio.nroOp);
    const generico = planProd.capacidad != null ? planProd.capacidad : "";

    try {
      result = unwrapResult(
        await dispatch(
          TargetsSliceRequests.getTargetByIdLineaGenericoRequest({
            idLinea: lineaSeleccionada?.idLinea,
            generico: generico
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
    if (result) {
      setTarget(result.target);
      targetRef.current = result.target;
      return result.target;
    } else {
      console.log("no traje nada con ", generico, lineaSeleccionada.idLinea);

      return 0;
    }
  };

  //Calcula el target de cada registro
  const calcularTarget = async (
    desdeHora: string,
    hastaHora: string,
    minutosTotalesTrabajo,
    minutosActuales,
    registroInicio: IInicio | any
  ) => {
    let targetTotal = 0;

    if (!isNaN(registroInicio)) {
      targetTotal = registroInicio;
    } else {
      if (registroInicio) targetTotal = await getTarget(registroInicio);
    }

    const horaActual = moment().format("HH:mm");
    const horaActualDesde = moment(desdeHora, "HH:mm").format("HH:mm");
    const horaActualHasta = moment(hastaHora, "HH:mm").format("HH:mm");
    let minutosPorHora = minutosActuales; //Normalmente es 60 o 55 si es el ultimo registro.

    //Si la hora actual esta dentro del rango del horario del registro Desde Hasta, obtengo los minutos. normalmente ronda entre 1 min y 60 min.
    if (horaActual >= horaActualDesde && horaActual <= horaActualHasta) {
      const diferencia = moment().diff(moment(desdeHora, "HH:mm"), "minutes"); //Obtengo los minutos
      minutosPorHora = diferencia;
    }

    //Si son las 10 y estoy consultando el registro de las 11 o >. Entonces no calculo nada.
    if (horaActual < horaActualDesde) {
      minutosPorHora = 0;
    }
    const total = (minutosPorHora * targetTotal) / minutosTotalesTrabajo; //Regla de 3 simples
    return total; //Redondeo .
  };

  const getRechazados = async (horaId: number) => {
    let result = [];
    try {
      result = unwrapResult(
        await dispatch(
          RechazoSliceRequests.getAllByLineaAndFechaAndaDesdeHasta({
            lineaId: lineaSeleccionada?.idLinea,
            fecha: moment().format("YYYY-MM-DD"),
            horaId: horaId
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
    if (result) {
      return result.length;
    }
  };

  const getMensajesAndon = async () => {
    try {
      const response = unwrapResult(await dispatch(ComunicadoSliceRequest.getList()));
      if (response) {
        const filtrado = response.filter((elementos) => elementos.descripcion !== "" && elementos.descripcion !== null);
        console.log(filtrado);
        setComunicado(filtrado);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calcularFpy = (produccionHora, produccionTotal: number, rechazosTotal: number) => {
    let fpyAux = 0;
    if (produccionHora.length > 0) {
      if (produccionTotal + rechazosTotal == 0) fpyAux = 0;
      else fpyAux = (produccionTotal / (produccionTotal + rechazosTotal)) * 100;
    }
    fpyAux = parseFloat(fpyAux.toFixed(1));
    setFpy(fpyAux);
  };

  //HH devuelve a las 21, 22, etc...
  //hh devuelve en 09, 10, en vez de 21, 22.
  //Calculo el color del andon, segund los datos
  const calcularColorAndon = async () => {
    //calculo los minutos que pasaron desde que arranco la jornada hasta ahora.
    const horaActual = moment();
    if (!horas) return false;
    // const ajust = await getAjuste();
    console.log("CalcularColorAndon Target", target);
    const horaActualDesde = moment(horas[0].desdeHora, "HH:mm"); //obtengo la primer hora del periodo
    const minutosPasados = horaActual.diff(horaActualDesde, "minutes"); //Obtengo la diferencia en minutos desde la hora actual hasta la primer hora del periodo
    const deberiaHaberProducido = (minutosPasados * target) / 535; //Calculo los equipos que se deberian haber producido hasta el momento segun la hora actual.
    const quincePorciento = 0.15 * deberiaHaberProducido * -1; //Obtengo el 15% de lo que tendria que estar producido y lo multiplico por -1 para que quede en negativo.
    const diferenciaAux = diferencia + ajusteRef.current;
    console.log("Diferencia Aux", diferenciaAux);
    if (diferenciaAux > 0) {
      setColorAndon("verde");
    } else if (diferenciaAux > quincePorciento && diferenciaAux < 0) {
      setColorAndon("amarillo");
    } else if (diferenciaAux < quincePorciento) {
      setColorAndon("rojo");
    }
  };

  //Cuando ambas variables cambian, calculo el color del andon.
  useEffect(() => {
    calcularColorAndon();
  }, [diferencia, target, horas]);

  //Obtiene un array de registros Inicio. La cantidad todal es equivalente a la cantidad producida.
  const getData = async (parametros, element, minutosTotalesTrabajo, registroInicio) => {
    let result = [];

    result = unwrapResult(await dispatch(InicioSliceRequests.getAllByFechaAndTurnoAndOthers(parametros)));
    if (result) {
      const target = await calcularTarget(
        element.desdeHora,
        element.hastaHora,
        minutosTotalesTrabajo,
        element.minutos,
        registroInicio != null ? registroInicio : result[0]
      );

      const produccion = result;
      produccionEstimada.current += target;
      produccionReal.current += produccion.length;

      const rechazados = await getRechazados(element.idHora);
      const objeto = {
        id: element.idHora,
        desde: element.desdeHora,
        hasta: element.hastaHora,
        produccion,
        target,
        // diferencia: produccion.length - target,
        diferencia: produccionReal.current - produccionEstimada.current,
        rechazados: rechazados
      };

      // calcularColorAndon(objeto);
      return objeto;
    }
  };

  const handleSearch = async (listHoras: IHora[], line) => {
    let objeto: {
      id: number;
      desde: string;
      hasta: string;
      produccion: IInicio[];
      rechazados: number;
      diferencia: number;
    };
    const produccionHora = [];
    let produccionTotal = 0; //contabiliza el total de los producidos
    let rechazosTotal = 0; //Contabiliza los rechazos totales
    let diferenciaTotal = 0; //contabiliza la diferencia en total.
    const minutosTotalesTrabajo = calcularMinutosTotales(listHoras);

    const paramAux = {
      fecha: moment().format("YYYY-MM-DD"),
      turno: turno,
      codigoInicio: line.codigoInicio,
      idHora: listHoras[0].idHora
    };

    const horaActual = moment();
    const horaActualDesde = moment(listHoras[0].desdeHora, "HH:mm"); //obtengo la primer hora del periodo
    const minutosPasados = horaActual.diff(horaActualDesde, "minutes"); //Obtengo la diferencia en minutos desde la hora actual hasta la primer hora del periodo
    //Obtengo el primer registro de inicio y lo paso siempre, para que traiga el target con ese, ya que siempre le pasaba
    //El primer registro para cada périodo de hora, y cuando no existian registros en inicio, no podia calcular el target y la diferencia.
    const result = unwrapResult(await dispatch(InicioSliceRequests.getAllByFechaAndTurnoAndOthers(paramAux)));
    let registroInicio;
    if (result) registroInicio = result[0];
    else registroInicio = null;

    //Recorro las horas y armo la lista de cada registro con la produccion, target, diferencia, etc...
    for (const element of listHoras) {
      const parametros = {
        fecha: moment().format("YYYY-MM-DD"),
        turno: turno,
        codigoInicio: line.codigoInicio,
        idHora: element.idHora
      };
      objeto = await getData(parametros, element, minutosTotalesTrabajo, registroInicio);

      produccionHora.push(objeto);
      produccionTotal += objeto.produccion.length;
      rechazosTotal += objeto.rechazados;
      diferenciaTotal += Math.round(objeto.diferencia);
    }
    produccionEstimada.current = 0;
    calcularFpy(produccionHora, produccionTotal, rechazosTotal);
    const prodTotalajuste = produccionTotal + ajusteRef.current;

    const deberiaHaberProducido = (minutosPasados * targetRef.current) / 535; //Calculo los equipos que se deberian haber producido hasta el momento segun la hora actual.

    setDiferencia(prodTotalajuste - Math.floor(deberiaHaberProducido));
    generarListadoFront(produccionHora);
    produccionEstimada.current = 0;
    produccionReal.current = 0;
  };

  //Traigo la cantidad total del lote segun la op. cantidadTotalLote
  const getPlanProdByNroOp = async (numeroOp: string) => {
    let result: IPlanProd;
    try {
      result = unwrapResult(await dispatch(PlanProdSliceRequests.getPlanprodByNumeroOpRequest(numeroOp)));
    } catch (error) {
      throw new Error(error);
    }
    if (result) {
      return result;
    } else return null;
  };
  const getRechazos = async (numeroOp: string) => {
    let result: number;
    try {
      result = unwrapResult(await dispatch(RechazoSliceRequests.GetRechazosByNroOP(numeroOp)));
    } catch (error) {
      throw new Error(error);
    }
    if (result) {
      return result;
    } else return null;
  };

  const generarListadoFront = async (produccionHora) => {
    const arrayInicio = [];

    const arrayOfInicio = produccionHora.map((x) => x.produccion);
    for (let index = 0; index < arrayOfInicio.length; index++) {
      const element = arrayOfInicio[index];
      for (let indexAux = 0; indexAux < element.length; indexAux++) {
        const elementAux = element[indexAux];
        arrayInicio.push(elementAux);
      }
    }

    //Agrupo por
    const arrayInicioGroup = _.groupBy(arrayInicio, function (inicio) {
      return inicio.modeloFin;
    });

    const listadoVista = [];
    let totalEmbalados = 0;
    let cantTotalLote;
    let embalados = 0;
    let planprod: IPlanProd;
    for (const property in arrayInicioGroup) {
      planprod = await getPlanProdByNroOp(arrayInicioGroup[property][0].nroOp);
      const rechazos = await getRechazos(arrayInicioGroup[property][0].nroOp);
      const inicios = unwrapResult(await dispatch(InicioSliceRequests.getPendienteByOPRequest(planprod.numeroOp)));
      cantTotalLote = planprod != null ? planprod.cantidad : 0;
      embalados = arrayInicioGroup[property].length;
      const obj = {
        modelo: property,
        op: arrayInicioGroup[property][0].nroOp,
        lote: arrayInicioGroup[property][0].lote,
        cantidad: cantTotalLote,
        embalados: inicios,
        rechazos,
        restaLote: cantTotalLote - inicios
      };

      listadoVista.push(obj);
      totalEmbalados += embalados;
    }

    const a = {
      modelo: " - ",
      op: " - ",
      lote: " - ",
      cantidad: " - ",
      embalados: " - ",
      rechazos: " - ",
      restaLote: " - "
    };
    while (listadoVista.length <= 1) listadoVista.push(a);

    setDataSource(listadoVista);
    setTotalEmbalados(totalEmbalados);
  };

  //Obtiene el listado de hora de la linea.
  const getHoras = async (line) => {
    let periodoLinea;
    try {
      periodoLinea = unwrapResult(
        await dispatch(
          PeriodoLineaSliceRequest.getByLineaAndTurno({
            lineaId: line.idLinea,
            turno: turno
          })
        )
      );
    } catch (error) {
      throw new Error(error);
    }

    if (periodoLinea) {
      if (periodoLinea.periodo) {
        const listHoras = periodoLinea.periodo.periodoHora.map((x) => x.hora); //Me obtengo el array de Horas.
        setHoras(listHoras);
        handleSearch(listHoras, line);
      }
    } else {
      openNotificationUI(
        "No se encuentra un periodo asignado para esa linea. Asegurese de asignar un Periodo a la Linea.",
        "error"
      );
    }
  };

  const getAjuste = async () => {
    let result: IAjuste;
    try {
      result = unwrapResult(await dispatch(AjusteSliceRequests.getByLineaId(lineaSeleccionada.idLinea)));
    } catch (error) {
      console.log(error);
    }
    if (result) {
      setAjuste(result.ajuste1);
      ajusteRef.current = result.ajuste1;
      return result.ajuste1;
    }
  };
  const onLeave = () => {
    dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(!navBarState));
  };
  // State para sacar el navbar
  useEffect(() => {
    dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(true));
    return () => {
      dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(false));
    };
  }, []);

  //Se dispara cuando se seleccionada la linea
  // Se inicia el tablero

  const init = async () => {
    await getAjuste();
    await getHoras(lineaSeleccionada);
    await getMensajesAndon();
    repetirCadaSegundo(lineaSeleccionada);
  };

  useEffect(() => {
    if (lineaSeleccionada) {
      setLineaSeleccionada(lineaSeleccionada);
      init();
    }

    return () => {
      clearInterval(identificadorIntervaloDeTiempo);
    };
  }, [lineaSeleccionada]);

  let identificadorIntervaloDeTiempo;

  //Funcion para que cada 5 segundos refresque el andon.
  function repetirCadaSegundo(lineaSeleccionada) {
    identificadorIntervaloDeTiempo = setInterval(async () => {
      // getAjuste();
      await getMensajesAndon();
      getHoras(lineaSeleccionada);
    }, 50000);
    // }, 5000);
  }

  return (
    <>
      <TableroModalForm setLineaSeleccionada={setLineaSeleccionada}></TableroModalForm>
      {/* Parte superior donde muestra la linea mas dos info  */}
      <Box
        sx={{
          width: "100%",
          padding: "28px",
          height: "100vh",
          backgroundColor:
            colorAndon == "verde" ? colores.verde : colorAndon == "amarillo" ? colores.amarillo : colores.rojo,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            alignContent: "center",
            justifyItems: "center",
            textAlign: "center",
            alignItems: "center"
          }}>
          <Grid item textAlign="center" alignItems="center" className="items-center">
            <Typography
              className="cursor-pointer"
              variant="h2"
              fontWeight="bold"
              color={"white"}
              onClick={onLeave}
              fontSize={
                lineaSeleccionada != null ? (lineaSeleccionada.alias.length > 7 ? "7.75rem" : "8.75rem") : "8.75rem"
              }>
              {lineaSeleccionada && lineaSeleccionada.alias}
            </Typography>
          </Grid>
          <Item bgcolor="#151144">
            <Typography variant="h1" color="white" fontWeight={900} fontSize={"9rem"}>
              <Typography variant="h3" fontWeight="900" color="white" style={{ lineHeight: "2.167" }} fontSize={"5rem"}>
                OBJETIVO
              </Typography>
              {target}
            </Typography>
          </Item>
          <Item bgcolor="white">
            <Typography variant="h1" color="#050505" fontWeight={900} fontSize={"9rem"}>
              <Typography
                variant="h3"
                fontWeight="900"
                color="#050505"
                style={{ lineHeight: "2.167" }}
                fontSize={"5rem"}>
                AJUSTE
              </Typography>
              {ajuste}
            </Typography>
          </Item>
        </Box>
        {/* segunda parte del andon */}
        {comunicado && comunicado.length > 0 ? (
          <div className="w-full">
            <div className="w-full flex justify-center bg-white p-16 my-4 rounded-sm">
              <Typography className="uppercase text-5xl font-bold">{comunicado[0].descripcion}</Typography>
            </div>
          </div>
        ) : (
          <Box
            sx={{
              margin: "1rem 0",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              alignContent: "center",
              justifyItems: "center",
              textAlign: "center"
            }}>
            <Item>
              <Typography variant="h1" color="#050505" fontWeight={900} fontSize={"9rem"}>
                <Typography
                  variant="h3"
                  fontWeight="900"
                  color="#050505"
                  style={{ lineHeight: "2.167" }}
                  fontSize={"5rem"}>
                  EMBALADOS
                </Typography>
                {totalEmbalados}
              </Typography>
            </Item>
            <Item>
              <Typography variant="h1" color="#050505" fontWeight={900} fontSize={"9rem"}>
                <Typography
                  variant="h3"
                  fontWeight="900"
                  color="#050505"
                  style={{ lineHeight: "2.167" }}
                  fontSize={"5rem"}>
                  DIFERENCIA
                </Typography>
                {Math.round(diferencia)}
              </Typography>
            </Item>
            <Item bgcolor={fpy >= 93 ? colores.verde : fpy >= 90 ? colores.amarillo : colores.rojo}>
              <Typography variant="h1" color="white" fontWeight={900} fontSize={"9rem"}>
                <Typography
                  variant="h3"
                  fontWeight="900"
                  color="white"
                  style={{ lineHeight: "2.167" }}
                  fontSize={"5rem"}>
                  FPY
                </Typography>
                {fpy + "%"}
              </Typography>
            </Item>
          </Box>
        )}
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="w-full py-1 text-lg text-white mt-4">
              <TableContainer
                sx={{
                  boxShadow: "none",
                  background:
                    colorAndon == "verde" ? colores.verde : colorAndon == "amarillo" ? colores.amarillo : colores.rojo,
                  font: "black"
                }}>
                <Table size="small">
                  <TableHead style={{ backgroundColor: "#151144" }}>
                    <TableRow style={{ height: "75px" }}>
                      <TableCell
                        sx={{
                          color: "white",
                          border: "0px",
                          textAlign: "center",
                          fontSize: "40px",
                          fontWeight: "bold"
                        }}>
                        MODELO
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          border: "0px",
                          textAlign: "center",
                          fontSize: "40px",
                          fontWeight: "bold"
                        }}>
                        OP
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          border: "0px",
                          textAlign: "center",
                          fontSize: "40px",
                          fontWeight: "bold"
                        }}>
                        LOTE
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          border: "0px",
                          textAlign: "center",
                          fontSize: "40px",
                          fontWeight: "bold"
                        }}>
                        CANTIDAD
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          border: "0px",
                          textAlign: "center",
                          fontSize: "40px",
                          fontWeight: "bold"
                        }}>
                        TOTAL PRODUCIDO
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          border: "0px",
                          textAlign: "center",
                          fontSize: "40px",
                          fontWeight: "bold"
                        }}>
                        RECHAZOS
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          border: "0px",
                          textAlign: "center",
                          fontSize: "40px",
                          fontWeight: "bold"
                        }}>
                        RESTA LOTE
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{dataSource.map((element, index) => getTableRow(element, index))}</TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
