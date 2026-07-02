import { useAppSelector } from "app/core/store/store";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { CustomToolTip } from "./CustomToolTip";
import moment from "moment";
import produce from "immer";

interface IDataGraf {
  mes: string;
  oqc: number;
  diferencia: number;
  sobreExp: number;
  total: number;
  A: number;
  B: number;
  C: number;
  OK: number;
}
const defaultValues: IDataGraf[] = [
  {
    mes: "Enero",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Febrero",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Marzo",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Abril",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Mayo",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Junio",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Julio",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Agosto",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Septiembre",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Octubre",
    oqc: 0,
    diferencia: 0,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Noviembre",
    oqc: 0,
    diferencia: 1,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  },
  {
    mes: "Diciembre",
    oqc: 0,
    diferencia: 8,
    sobreExp: 0,
    total: 0,
    A: 0,
    B: 0,
    C: 0,
    OK: 0
  }
];
export const GraficoReporteOQC = (): JSX.Element => {
  const target = useAppSelector((state) => state.oqcTarget.object);
  const oqcDRs = useAppSelector((state) => state.oqcDesignadaResultado.dataAll);
  const { darkMode } = useAppSelector((state) => state.colorApp);

  const [dataGraf, setDataGraf] = useState<IDataGraf[]>(defaultValues);
  const encontroPonderacion = (nombre: string, oqc: IOQCHallazgoResult[]): boolean => {
    return oqc?.find((oqcHR) => oqcHR.oqcBloqueHallazgo.oqcHallazgo.oqcPonderacion.nombre == nombre) ? true : false;
  };
  const getPonderacion = (oqc: IOQCDesignadaResultado) => {
    const oqcResultNG = oqc.oqcHallazgoResult.filter((oqcHR) => oqcHR.state == false);
    if (encontroPonderacion("A", oqcResultNG)) {
      return "A";
    } else if (encontroPonderacion("B", oqcResultNG)) {
      return "B";
    } else if (encontroPonderacion("C", oqcResultNG)) {
      return "C";
    } else {
      return "OK";
    }
  };
  const setData = () => {
    oqcDRs.forEach((oqcDR) => {
      const numberMonth = parseInt(moment(oqcDR.createdDate).format("MM"));
      const pond = getPonderacion(oqcDR);
      setDataGraf(
        produce((draft) => {
          draft[numberMonth - 1] = {
            ...draft[numberMonth - 1],
            [pond]: draft[numberMonth - 1][pond] + 1,
            total: draft[numberMonth - 1].total + 1
          };
          const { total, A, B, C } = draft[numberMonth - 1];
          const indice = (1 - (A + B * 0.5 + C * 0.1) / total) * 100;
          draft[numberMonth - 1] = {
            ...draft[numberMonth - 1],
            oqc: indice
          };
        })
      );
    });
  };
  const customTick = (values) => {
    const { x, y, stroke, payload } = values;
    const text = payload.value;
    const data = dataGraf.find((dg) => dg.mes == text);
    return (
      <text x={x} y={y} dy={16} fontSize={15} textAnchor="end" fill={darkMode ? "white" : "black"}>
        {text + " " + data.oqc.toFixed(0)}
      </text>
    );
  };
  useEffect(() => {
    if (oqcDRs?.length > 0) {
      setDataGraf(defaultValues);
      setData();
    }
  }, [oqcDRs]);
  useEffect(() => {
    console.log(dataGraf);
  }, [dataGraf]);

  return (
    <div className={`bg-secondaryNew shadow-elevation-4 w-full p-5 ${!darkMode ? "text-black" : "text-white"}`}>
      <div className="m-5 font-bold text-2xl">
        <h1>Objetivo OQC: {target?.target | 0}%</h1>
      </div>
      <ResponsiveContainer width="100%" height={380} className={!darkMode ? "text-black" : "text-white"}>
        <BarChart data={dataGraf} margin={{ top: 5, right: 30, left: 55, bottom: 20 }}>
          {/** Colores Gradientes */}
          <defs>
            <linearGradient id="oqc" x1="1" y1="1" x2="0" y2="0">
              <stop offset="30%" stopColor="#5F67FF" />
              <stop offset="70%" stopColor="#5F67FF" />
            </linearGradient>
          </defs>
          {/** Fin */}
          <CartesianGrid strokeDasharray="3 3" />
          <ReferenceLine
            y={target.target}
            label="Target"
            stroke="#45ff00"
            alwaysShow={true}
            className="z-10 text-lg text-white"
          />
          <XAxis
            dataKey="mes"
            width={300}
            tick={{ fontSize: 15 }}
            // tick={customTick}
            tickMargin={10}
            stroke={darkMode ? "white" : "black"}
          />

          <YAxis stroke={darkMode ? "white" : "black"} type="number" domain={[80, 100]} />
          <Tooltip content={(value) => <CustomToolTip dataGraf={dataGraf} value={value} target={target} />} />

          <Legend
            iconType="circle"
            formatter={(value, entry, index) => <span style={{ color: darkMode ? "white" : "black" }}>{value}</span>}
          />
          <Bar dataKey="oqc" stackId="a" fill="url(#oqc)" />
        </BarChart>
      </ResponsiveContainer>
      <div className={`w-full flex gap-5 justify-evenly border-b-2 ${darkMode ? " border-white" : "border-black"}`}>
        <h1>Indice</h1>
        {dataGraf.map((data, ind) => (
          <span key={ind} style={{ color: darkMode ? "#73EEFF" : "#FF6A16" }}>
            {data.oqc.toFixed(2)}%
          </span>
        ))}
      </div>
    </div>
  );
};
