import React, { useEffect, useState } from "react";
import { useEppContext } from "../context/EppSelectionContext";
import { ButtonEpp } from "./ButtonEpp";
import CloseIcon from "@mui/icons-material/Close";
import { SEH_Auditoria_Detalles } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_Auditoria_Detalles";

interface props {
  canDelete?: boolean;
}
export const SelectedEppList = ({ canDelete = true }: props) => {
  const { selectedEpps: epps, onDelete } = useEppContext();
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(0);
  const [filteredEpps, setFilteredEpps] = useState<SEH_Auditoria_Detalles[]>([]);

  useEffect(() => {
    const filteredEpps = epps.filter((d) => !d.deleted);
    const cantidad = filteredEpps.length;
    setCantidadSeleccionada(cantidad);
    setFilteredEpps(filteredEpps);
  }, [epps]);

  return (
    <div
      className={`grid min-h-10 gap-2 ${
        cantidadSeleccionada >= 3 ? "grid-cols-3" : `grid-cols-${cantidadSeleccionada == 0 ? 1 : cantidadSeleccionada}`
      }`}>
      {cantidadSeleccionada == 0 ? (
        <h1 className="w-full text-center text-black bg-yellow-500 text-dark p-2 rounded-md uppercase">
          Seleccione al menos un EPP
        </h1>
      ) : (
        <>
          {filteredEpps.map((selectedEpp) => (
            <div
              key={selectedEpp.eppId}
              className="w-full flex items-center gap-2 m-auto animate-fadeIn duration-1000 ease-out">
              {canDelete && (
                <CloseIcon
                  className="bg-red-500 text-white rounded-full font-semibold hover:cursor-pointer"
                  onClick={() => onDelete(selectedEpp.eppId)}
                />
              )}
              <ButtonEpp label={selectedEpp.epp.nombre}></ButtonEpp>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
