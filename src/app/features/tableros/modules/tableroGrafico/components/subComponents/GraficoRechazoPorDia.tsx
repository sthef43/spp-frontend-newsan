/* eslint-disable unused-imports/no-unused-vars */
import { Circle } from "@mui/icons-material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getRandomColor } from "../../utils/colors";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import moment from "moment";
import { PeriodoLineaSliceRequest } from "app/Middleware/reducers/periodoLineaSlice";
import { RechazoData, Series, formatPeridoHora, getDefaultPeriodo } from "../../utils/periodoHoras";
import { CircularProgress } from "@mui/material";

interface IGraficoRechazoPorDia {
  Hora: number;
  Cantidad: number;
  Fecha: string;
}

interface Props {
  idLinea: number;
  turno: string;
}

export const GraficoRechazoPorDia = ({ idLinea, turno }: Props) => {
  const dispatch = useAppDispatch();
  const [newData, setnewData] = useState<Series<RechazoData>[]>();

  const CustomXTick = (value) => {
    return `${value}:00 a ${value == 24 ? "01" : value + 1}:00`;
  };

  const init = async () => {
    try {
      const fechaDesde = moment().weekday(1).format();
      const fechaHasta = moment().format();
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
      const response = unwrapResult(
        await dispatch(RechazoSliceRequests.GetRechazoByHour({ fechaDesde, fechaHasta, idLinea, desde, hasta }))
      );
      let horas;
      if (periodoHoras) {
        horas = periodoHoras.periodo.periodoHora.flatMap((d, i) => {
          return [+d.hora.desdeHora.split(":")[0]];
        });
      }

      const groupedData = _.chain(response)
        .groupBy("fecha")
        .map((value, key) => ({ fecha: key, data: value, color: getRandomColor() }))
        .value();

      const formatedData =
        groupedData.length == 0
          ? [formatPeridoHora(horas, null, turno)]
          : groupedData.map((m) => formatPeridoHora(horas, m, turno));
      setnewData(formatedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    init();
  }, [idLinea, turno]);

  return (
    <>
      {!newData ? (
        <div className="w-full flex">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="w-full flex h-[399px] bg-secondaryNew rounded-md p-3 border border-gray-400/30">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 5,
                    bottom: 5
                  }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    tickMargin={10}
                    tick={{ stroke: "white", strokeWidth: 1 }}
                    dataKey={"hora"}
                    tickFormatter={CustomXTick}
                    allowDuplicatedCategory={false}
                  />
                  <YAxis dataKey={"cantidad"} allowDecimals={false} />
                  {/* <Tooltip />        */}
                  {newData.map((s) => (
                    <Line
                      activeDot={false}
                      strokeWidth={2}
                      stroke={s.color}
                      dataKey="cantidad"
                      data={s.data}
                      name={s.name}
                      key={s.name}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3 items-center justify-center w-1/6 ">
              {newData.map((data) => (
                <div key={data.name} className="flex gap-2">
                  <Circle style={{ fill: data.color }} />
                  <h1>{moment(data.name).format("DD/MM/YYYYY")}</h1>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
