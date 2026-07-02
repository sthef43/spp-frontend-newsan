import React, { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { InformePlacasAutomotrizSP } from "../Interfaces/InformePlacasAutomotrizSP";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  placaSeleccionada: InformePlacasAutomotrizSP | null;
  openModal: boolean;
}

export const GraficoPruebasPlacaModal: React.FC<Props> = ({ setOpenModal, placaSeleccionada, openModal }) => {
  const [nuevoObjeto, setNuevoObjeto] = useState([]);
  const convertirArrayFm = () => {
    try {
      const frecuenciasOriginal = placaSeleccionada.dataParseada.fm.Frequency_MHz;
      const frecuenciasReferencia = placaSeleccionada.dataParseadaReferencia.fm.Frequency_MHz;
      const frecuenciasMargenErrorMas3 = placaSeleccionada.dataParsedMargenError.fm.Frequency_MHz;
      const frecuenciasMargenErrorMmenos3 = placaSeleccionada.dataParsedMargenError.fm.Frequency_MHz;

      const dataOriginal = placaSeleccionada.dataParseada.fm.Data1.map((GananciaDb, index) => ({
        FrecuenciaMHz: frecuenciasOriginal[index],
        GananciaDb
      }));
      const dataReferencia = placaSeleccionada.dataParseadaReferencia.fm.Data1.map((GananciaDbReferencia, index) => ({
        FrecuenciaMHz: frecuenciasReferencia[index],
        GananciaDbReferencia
      }));
      const dataMas3Db = placaSeleccionada.dataParsedMargenError.fm.DataMas3Db.map((GananciaMenos3, index) => ({
        FrecuenciaMHz: frecuenciasMargenErrorMas3[index],
        GananciaMenos3
      }));
      const dataMenos3Db = placaSeleccionada.dataParsedMargenError.fm.DataMenos3Db.map((margenMenos3, index) => ({
        FrecuenciaMHz: frecuenciasMargenErrorMmenos3[index],
        margenMenos3
      }));

      const frecuenciasUnicas = Array.from(
        new Set([
          ...frecuenciasOriginal,
          ...frecuenciasReferencia,
          ...frecuenciasMargenErrorMas3,
          ...frecuenciasMargenErrorMmenos3
        ])
      ).sort((a, b) => a - b);
      const datosCombinados = frecuenciasUnicas.map((frecuencia) => {
        const original = dataOriginal.find((d) => Math.abs(d.FrecuenciaMHz - frecuencia) < 0.0001);
        const referencia = dataReferencia.find((r) => Math.abs(r.FrecuenciaMHz - frecuencia) < 0.0001);
        const margenMas3 = dataMas3Db.find((r) => Math.abs(r.FrecuenciaMHz - frecuencia) < 0.0001);
        const margenMenos3 = dataMenos3Db.find((r) => Math.abs(r.FrecuenciaMHz - frecuencia) < 0.0001);
        return {
          FrecuenciaMHz: frecuencia,
          GananciaDb: original?.GananciaDb ?? undefined,
          GananciaDbReferencia: referencia?.GananciaDbReferencia ?? undefined,
          margenMas3: margenMas3?.GananciaMenos3 ?? undefined,
          margenMenos3: margenMenos3?.margenMenos3 ?? undefined
        };
      });
      setNuevoObjeto(datosCombinados);
    } catch (error) {
      console.log(error);
    }
  };

  const [nuevoObjetoAm, setNuevoObjetoAm] = useState([]);
  const convertirArrayAm = () => {
    const frecuenciasOriginal = placaSeleccionada.dataParseada.am.Frequency_MHz;
    const frecuenciasReferencia = placaSeleccionada.dataParseadaReferencia.am.Frequency_MHz;
    const frecuenciasMargenErrorMas3 = placaSeleccionada.dataParsedMargenError.am.Frequency_MHz;
    const frecuenciasMargenMasMenos3 = placaSeleccionada.dataParsedMargenError.am.Frequency_MHz;

    const dataOriginal = placaSeleccionada.dataParseada.am.Data1.map((GananciaDb, index) => ({
      FrecuenciaMHz: frecuenciasOriginal[index],
      GananciaDb
    }));
    const dataReferencia = placaSeleccionada.dataParseadaReferencia.am.Data1.map((GananciaDbReferencia, index) => ({
      FrecuenciaMHz: frecuenciasReferencia[index],
      GananciaDbReferencia
    }));
    const dataMenos3 = placaSeleccionada.dataParsedMargenError.am.DataMenos3Db.map((gananciaMenos3, index) => ({
      FrecuenciaMHz: frecuenciasMargenErrorMas3[index],
      gananciaMenos3
    }));
    const dataMas3 = placaSeleccionada.dataParsedMargenError.am.DataMas3Db.map((gananciaMas3, index) => ({
      FrecuenciaMHz: frecuenciasMargenMasMenos3[index],
      gananciaMas3
    }));

    const frecuenciasUnicas = Array.from(
      new Set([
        ...frecuenciasOriginal,
        ...frecuenciasReferencia,
        ...frecuenciasMargenErrorMas3,
        ...frecuenciasMargenMasMenos3
      ])
    ).sort((a, b) => a - b);

    const datosCombinados = frecuenciasUnicas.map((frecuencia) => {
      const original = dataOriginal.find((d) => Math.abs(d.FrecuenciaMHz - frecuencia) < 0.0001);
      const referencia = dataReferencia.find((r) => Math.abs(r.FrecuenciaMHz - frecuencia) < 0.0001);
      const margenMenos3 = dataMenos3.find((r) => Math.abs(r.FrecuenciaMHz - frecuencia) < 0.0001);
      const margenMas3 = dataMas3.find((r) => Math.abs(r.FrecuenciaMHz - frecuencia) < 0.0001);

      return {
        FrecuenciaMHz: frecuencia,
        GananciaDb: original?.GananciaDb ?? undefined,
        GananciaDbReferencia: referencia?.GananciaDbReferencia ?? undefined,
        margenMenos3: margenMenos3?.gananciaMenos3 ?? undefined,
        margenMas3: margenMas3?.gananciaMas3 ?? undefined
      };
    });
    setNuevoObjetoAm(datosCombinados);
  };

  useEffect(() => {
    if (openModal) {
      convertirArrayFm();
      convertirArrayAm();
    }
  }, [openModal]);

  return (
    <main className="w-[80vw] h-full flex flex-row justify-between items-start">
      {nuevoObjeto && (
        <>
          <section className=" h-full flex flex-col justify-center items-start">
            <h1 className="text-xl font-semibold">Testeo FM</h1>
            <LineChart width={600} height={550} style={{ right: "13%" }} data={nuevoObjeto}>
              <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
              <Line
                type="monotone"
                dataKey="GananciaDb"
                stroke="red"
                strokeWidth={2}
                name="Medición (MHz)"
                connectNulls={true}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="GananciaDbReferencia"
                stroke="green"
                strokeWidth={1}
                name="Ideal (MHz)"
                connectNulls={true}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="margenMas3"
                stroke="blue"
                strokeWidth={2}
                name="Margen (MHz) +3"
                connectNulls={true}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="margenMenos3"
                stroke="blue"
                strokeWidth={2}
                name="-3"
                connectNulls={true}
                dot={false}
              />
              <XAxis dataKey="FrecuenciaMHz" />
              <YAxis width={100} />
              <Legend align="right" />
              <Tooltip />
            </LineChart>
          </section>
          <h1
            className={`${
              placaSeleccionada.dataParseada.status === "OK" ? "bg-green-600" : "bg-red-600"
            } text-center font-semibold  rounded-md shadow-md text-white text-4xl px-4 py-6`}>
            {placaSeleccionada.dataParseada.status}
          </h1>
          <section className=" h-full flex flex-col justify-center items-end">
            <h1 className="text-xl font-semibold">Testeo AM</h1>
            <LineChart width={600} height={550} data={nuevoObjetoAm}>
              <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
              <Line
                type="monotone"
                dataKey="GananciaDb"
                stroke="red"
                strokeWidth={2}
                name="Medición (MHz)"
                connectNulls={true}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="GananciaDbReferencia"
                stroke="green"
                strokeWidth={1}
                name="Ideal (MHz)"
                connectNulls={true}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="margenMas3"
                stroke="blue"
                strokeWidth={2}
                name="Margen (MHz) +3"
                connectNulls={true}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="margenMenos3"
                stroke="blue"
                name="-3"
                strokeWidth={2}
                connectNulls={true}
                dot={false}
              />
              <XAxis dataKey="FrecuenciaMHz" />
              <YAxis width={100} />
              <Legend align="right" />
              <Tooltip />
            </LineChart>
          </section>
        </>
      )}
    </main>
  );
};
