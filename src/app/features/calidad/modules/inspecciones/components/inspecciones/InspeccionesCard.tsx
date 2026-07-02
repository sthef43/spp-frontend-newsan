import React from "react";

interface InspeccionesCardProps {
  id: number;
  codigo: string;
  inspector: string;
  estado: boolean;
  iniciado: boolean;
  finalizado: boolean;
  inspeccionVisual: string;
  inspeccionFuncional: string;
  fechaCreacion?: string;
  selected?: boolean;
  getRechazo?: (id: number) => void;
}

const InspeccionesCard = ({
  id,
  codigo,
  inspector,
  estado,
  iniciado,
  finalizado,
  inspeccionVisual,
  inspeccionFuncional,
  fechaCreacion,
  selected = false,
  getRechazo
}: InspeccionesCardProps) => {
  return (
    <div
      className={`max-w-md w-96 overflow-hidden relative bg-white border border-gray-200 rounded-lg shadow-md p-6  hover:shadow-xl transition duration-300
    ${selected ? "-translate-y-1" : ""}
    `}>
      {selected && <div className="absolute w-8 h-8 rounded-xl bg-green-800 -top-2 -left-2"></div>}

      <div className="text-gray-400 ">#{id}</div>
      <div className="text-lg font-semibold text-gray-800 mb-4">
        Código: <span className="text-blue-500">{codigo}</span>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <strong>Inspector:</strong> {inspector}
      </div>
      <div className="text-sm text-gray-600 mb-4 flex flex-col">
        <div className="flex justify-between">
          <strong>Estado:</strong>{" "}
          <span className={`${estado ? "text-green-500" : "text-red-500"} font-bold`}>
            {estado ? "GOOD" : "NO GOOD"}
          </span>
        </div>
        <div className="flex justify-between">
          <strong>Fecha:</strong> <span className=" font-bold">{fechaCreacion}</span>
        </div>
        {/* <div className="flex justify-between">
          <strong>Iniciada:</strong> <span className="text-green-500 font-bold">{iniciado ? "SI" : "NO"}</span>
        </div>
        <div className="flex justify-between">
          <strong>Finalizada:</strong> <span className="text-green-500 font-bold">{finalizado ? "SI" : "NO"}</span>
        </div> */}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Inspección Visual:</span>
          <span className={`${inspeccionVisual === "G" ? "text-green-500" : "text-red-500"}`}>
            {inspeccionVisual || "Sin Informacion"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Inspección Funcional:</span>
          <span className={`${inspeccionFuncional === "G" ? "text-green-500" : "text-red-500"}`}>
            {inspeccionFuncional || "Sin Informacion"}
          </span>
        </div>
      </div>
      {/* <div className="mt-4 text-sm text-gray-500">
        <strong>Comentarios adicionales:</strong> La inspección visual fue exitosa, pero la inspección funcional falló
        en el test de motor.
      </div> */}
      {getRechazo && (
        <div className="mt-4 flex justify-between">
          <button
            className="bg-blue-500 disabled:opacity-50 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 w-full"
            disabled={selected}
            onClick={() => {
              getRechazo(id);
            }}>
            Ver Rechazos
          </button>
        </div>
      )}
    </div>
  );
};

export default InspeccionesCard;
