import { unwrapResult } from "@reduxjs/toolkit";
import { PeriodoLineaSliceRequest } from "app/Middleware/reducers/periodoLineaSlice";
import { useAppDispatch } from "app/core/store/store";
import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getDefaultPeriodo } from "../utils/periodoHoras";
import { CtrlPlacasSliceRequests } from "app/Middleware/reducers/CtrlPlacasSlice";
import moment from "moment";
import _ from "lodash";
import IndicadorSoldaduraPorDia from "./subComponents/IndicadorSoldaduraPorDia";

export interface SoldaduraDataGrafico {
  hora?: number;
  produccion: number;
  rechazo: number;
  fecha?: string;
  dia?: string;
}

interface Props {
  idLinea: number;
  lineaProduccionId: number;
  turno: string;
  produccion: any;
}

const IndicadorSoldadura = ({ idLinea, turno, lineaProduccionId, produccion }: Props) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any[]>();
  const [perNoGood, setPerNoGood] = useState(0);
  const [maxDataValue, setmaxDataValue] = useState(0);

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

  const init = async () => {
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

    let horas;
    if (periodoHoras) {
      horas = periodoHoras.periodo.periodoHora.flatMap((d, i) => {
        return [+d.hora.desdeHora.split(":")[0]];
      });
    }
    const soldaduraByHour = unwrapResult(
      await dispatch(
        CtrlPlacasSliceRequests.getAmountByHour({ lineaProduccionId, fecha: moment().format(), desde: 6, hasta: 15 })
      )
    );
    if (produccion && horas) {
      const data = [];
      horas.forEach((hora) => {
        const pro = produccion.filter((d) => d.hora == hora);
        let cantidad = 0;
        if (pro.length > 0) {
          cantidad = _.sumBy(pro, "cantidad");
        }
        const newData: SoldaduraDataGrafico = {
          hora,
          rechazo: soldaduraByHour.find((d) => d.hora == hora)?.cantidad || 0,
          produccion: cantidad
        };
        data.push(newData);
      });
      const produccionTotal = _.sumBy(data, "produccion");
      const rechazoTotal = _.sumBy(data, "rechazo");
      const porcentaje =
        produccionTotal + rechazoTotal == 0 ? 0 : +((rechazoTotal / (rechazoTotal + produccionTotal)) * 100).toFixed(1);
      setPerNoGood(porcentaje);
      const maxDataValue = Math.max(...data.map((entry) => entry.rechazo));
      setmaxDataValue(maxDataValue);
      setData(data);
    }
  };

  useEffect(() => {
    init();
  }, [produccion]);

  return (
    <>
      {data && (
        <div className="flex flex-col xl:flex-row gap-2">
          <div className="w-full flex flex-col h-[380px] border border-dashed rounded-lg  justify-center items-center p-4">
            <div className="w-full flex p-3 justify-between items-center">
              <h2 className="text-2xl font-medium">Inspeccion por Hora</h2>
              <h3 className="text-[#5F67FF] text-2xl font-medium">{perNoGood}% No Good</h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }} width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  tickMargin={10}
                  tick={{ stroke: "white", strokeWidth: 1 }}
                  dataKey={"hora"}
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
          </div>
          <IndicadorSoldaduraPorDia idLinea={idLinea} lineaProduccionId={lineaProduccionId} turno={turno} />
        </div>
      )}
    </>
  );
};

export default IndicadorSoldadura;
