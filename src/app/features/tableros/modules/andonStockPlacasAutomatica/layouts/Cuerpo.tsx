import React from "react";

import AndonPlacasListadoFilas from "../components/AndonPlacasListadoFilas";
import AndonPlacasFilaEstatica from "../components/common/AndonPlacaFilaEstatica";

export default function Cuerpo() {
  return (
    <div className="bg-[#004208] pt-[15px] mt-[15px]">
      <AndonPlacasFilaEstatica></AndonPlacasFilaEstatica>
      <AndonPlacasListadoFilas></AndonPlacasListadoFilas>
    </div>
  );
}
