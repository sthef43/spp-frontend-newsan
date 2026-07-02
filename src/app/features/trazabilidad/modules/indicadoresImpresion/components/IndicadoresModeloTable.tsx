import React from "react";
import { IndicadoresModeloEXTTable } from "./IndicadorModelo/IndicadoresModeloEXTTable";
import { IndicadoresModeloINTTable } from "./IndicadorModelo/IndicadoresModeloINTTable";
import { IndicadoresModeloWTable } from "./IndicadorModelo/IndicadoresModeloWTable";
interface Props {
  tipoModelo: string;
  tipoUnidad: string;
}
export const IndicadoresModeloTable = ({ tipoModelo, tipoUnidad }: Props) => {
  return (
    <div className="p-3 mb-3">
      {tipoModelo == "SP" && tipoUnidad == "UE" && (
        <IndicadoresModeloEXTTable tipoModelo={tipoModelo} tipoUnidad={tipoUnidad} />
      )}
      {tipoModelo == "SP" && tipoUnidad == "UI" && (
        <IndicadoresModeloINTTable tipoModelo={tipoModelo} tipoUnidad={tipoUnidad} />
      )}
      {tipoModelo == "VE" && <IndicadoresModeloWTable tipoModelo={tipoModelo} />}
    </div>
  );
};
