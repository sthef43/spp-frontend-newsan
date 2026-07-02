import React from "react";

// Fila que actúa como encabezado (AndonPlacasFilaEstatica)
export default function AndonPlacasFilaEstatica() {
  return (
    <div
      // Usamos 'grid' y definimos 4 columnas.
      // Las proporciones de 'grid-cols-[2fr_1fr_1fr_1fr]'
      // reflejan aproximadamente los anchos 200px vs 150px.
      className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center p-4 w-full text-5xl font-bold text-white bg-black">
      <p className="text-center">MODELO</p>
      <p className="text-center">IM</p>
      <p className="text-center">PRODUCCION</p>
      <p className="text-center">CLI</p>
    </div>
  );
}
