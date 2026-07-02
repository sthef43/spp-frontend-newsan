import React from "react";
import AndonPlacasReloj from "../components/common/AndonPlacasReloj";
import AndonPlacasEncabezado from "../components/AndonPlacasEncabezado";

export default function Cabecera() {
  return (
    <div className="flex flex-row justify-between p-4">
      <AndonPlacasEncabezado></AndonPlacasEncabezado>
      <AndonPlacasReloj></AndonPlacasReloj>
    </div>
  );
}
