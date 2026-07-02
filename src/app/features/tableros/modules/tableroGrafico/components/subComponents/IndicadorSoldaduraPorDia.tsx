import { unwrapResult } from "@reduxjs/toolkit";
import { CtrlPlacasSliceRequests } from "app/Middleware/reducers/CtrlPlacasSlice";
import { useAppDispatch } from "app/core/store/store";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getDefaultPeriodo } from "../../utils/periodoHoras";
import { PeriodoLineaSliceRequest } from "app/Middleware/reducers/periodoLineaSlice";
import { SoldaduraDataGrafico } from "../IndicadorSoldadura";
import { TrazaUnit_History2SliceRequests } from "app/Middleware/reducers/TrazaUnit_History2Slice";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import _ from "lodash";

/**
 * Props necesarias del componente
 */
interface IndicadorSoldaduraPorDiaProps {
  /**
   * idLinea de la tabla Produccion4106/Linea
   */
  idLinea: number;

  /**
   * id de la tabla Mantenimiento/LineaProduccion
   */
  lineaProduccionId: number;

  /**
   * Turno seleccionado
   */
  turno: string;
}

const IndicadorSoldaduraPorDia: React.FC<IndicadorSoldaduraPorDiaProps> = ({ idLinea, lineaProduccionId, turno }) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<SoldaduraDataGrafico[]>();
  const [maxDataValue, setmaxDataValue] = useState(0);
  const [perNoGood, setPerNoGood] = useState(0);
  const getPeriodoHoras = async (): Promise<{ desde: number; hasta: number }> => {
    //necesito el turno para saber el desde hasta de las horas
    //necesito idLinea Produccion
    const periodoHoras = unwrapResult(
      await dispatch(PeriodoLineaSliceRequest.getByLineaAndTurno({ lineaId: idLinea, turno }))
    );
    let desde;
    let hasta;
    if (periodoHoras) {
      desde = +periodoHoras.periodo.periodoHora[0].hora.desdeHora.split(":")[0];
      hasta =
        +periodoHoras.periodo.periodoHora[periodoHoras.periodo.periodoHora.length - 1].hora.desdeHora.split(":")[0];
    } else {
      const defaultPeriodo = getDefaultPeriodo(turno);
      desde = defaultPeriodo[0];
      hasta = defaultPeriodo[defaultPeriodo.length - 1];
    }
    return {
      desde,
      hasta
    };
  };

  const getRechazoAmountByDates = async (lineaProduccionId, fechaDesde, fechaHasta, desde, hasta) => {
    const response = unwrapResult(
      await dispatch(
        CtrlPlacasSliceRequests.getAmountByDates({ lineaProduccionId, fechaDesde, fechaHasta, desde, hasta })
      )
    );
    return response;
  };

  const getProduccionAmountByDates = async (fechaDesde, fechaHasta, desde, hasta, lineaProduccionId) => {
    const response = unwrapResult(
      await dispatch(
        TrazaUnit_History2SliceRequests.getProduccionAmountByDates({
          fechaDesde,
          fechaHasta,
          desde,
          hasta,
          lineaProduccionId
        })
      )
    );
    return response;
  };

  const getPeriodoDias = () => {
    const data: SoldaduraDataGrafico[] = [];
    const arrayFechas = [];
    const fechaDesde = moment().weekday(1);
    const fechaHasta = moment().weekday(5);

    while (fechaDesde.isBefore(fechaHasta) || fechaDesde.isSame(fechaHasta, "day")) {
      arrayFechas.push(fechaDesde.startOf("day").format()); // Agregar la fecha al array
      const newData: SoldaduraDataGrafico = {
        fecha: fechaDesde.startOf("day").format(),
        produccion: 0,
        rechazo: 0,
        dia: fechaDesde.format("dddd")
      };
      data.push(newData);
      fechaDesde.add(1, "day"); // Avanzar un día
    }

    return {
      fechaDesde: fechaDesde.weekday(1).format(),
      fechaHasta: fechaHasta.weekday(5).format(),
      periodo: data
    };
  };

  const init = async () => {
    try {
      const { fechaDesde, fechaHasta, periodo } = getPeriodoDias();
      const { desde, hasta } = await getPeriodoHoras();
      const rechazos = await getRechazoAmountByDates(lineaProduccionId, fechaDesde, fechaHasta, desde, hasta);
      const producciones = await getProduccionAmountByDates(fechaDesde, fechaHasta, desde, hasta, lineaProduccionId);
      periodo.map((dia) => {
        const rechazo = rechazos.find((ctrl) => moment(ctrl.fecha).isSame(moment(dia.fecha)));
        const produccion = producciones.find((ctrl) => moment(ctrl.fecha).isSame(moment(dia.fecha)));
        dia.rechazo = !rechazo ? 0 : rechazo.cantidad;
        dia.produccion = !produccion ? 0 : produccion.cantidad;
        return dia;
      });
      const maxDataValue = Math.max(...periodo.map((entry) => entry.rechazo));
      const produccionTotal = _.sumBy(periodo, "produccion");
      const rechazoTotal = _.sumBy(periodo, "rechazo");
      const porcentaje =
        produccionTotal + rechazoTotal == 0 ? 0 : +((rechazoTotal / (rechazoTotal + produccionTotal)) * 100).toFixed(1);
      setPerNoGood(porcentaje);
      setmaxDataValue(maxDataValue);
      setData(periodo);
      console.log(periodo);
    } catch (error) {
      console.log(error);
    }
  };

  const CustomizedDot = (props: any) => {
    const { cx, cy, stroke, payload, value, width } = props;
    const x = cx - 10;
    let porcentaje = 0;
    const cantidades = payload.produccion + payload.rechazo;

    if (cantidades > 0) {
      porcentaje = +((payload.rechazo / (payload.rechazo + payload.produccion)) * 100).toFixed(1);
    }

    return (
      <svg x={x} y={cy - 20} width="35" height="20" xmlns="http://www.w3.org/2000/svg">
        {/* <!-- Cuadrado con bordes redondeados y fondo #E5E5E5 --> */}
        <rect width="100%" height="100%" rx="5" ry="5" fill="#E5E5E5" />

        {/* <!-- Texto centrado con contenido "18%" y color de texto #5F67FF --> */}
        <text
          x="50%"
          y="50%"
          alignmentBaseline="middle"
          textAnchor="middle"
          fill="#5F67FF"
          fontSize="11"
          fontFamily="Arial, sans-serif">
          {porcentaje}%
        </text>
      </svg>
    );
  };

  useEffect(() => {
    init();
  }, [idLinea, lineaProduccionId, turno]);

  return (
    <div className="w-full flex flex-col h-[380px] border border-dashed rounded-lg  justify-center items-center p-4">
      <div className="w-full flex p-3 justify-between items-center">
        <h2 className="text-2xl font-medium">Inspeccion por Dia</h2>
        <h3 className="text-[#5F67FF] text-2xl font-medium">{perNoGood}% No Good</h3>
      </div>

      {!data ? (
        <div>Sin Informacion</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }} width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              tickMargin={10}
              tick={{ stroke: "white", strokeWidth: 1 }}
              dataKey={"dia"}
              allowDuplicatedCategory={false}
            />
            <YAxis
              tickMargin={15}
              scale={"linear"}
              type="number"
              domain={[0, maxDataValue + 5]}
              allowDecimals={false}
              interval={0}
              minTickGap={1}
            />
            {/* <Tooltip />        */}
            <Line activeDot={true} strokeWidth={2} stroke="#5F67FF" dataKey="rechazo" dot={CustomizedDot} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default IndicadorSoldaduraPorDia;
