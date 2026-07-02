import React from "react";

interface props {
  nombre: string;
  apellido: string;
  personalId: number | string;
  linea: string;
  planta: string;
  empresa: string;

  onClick?: () => void;
}
export const PersonalInfo = ({ empresa, linea, nombre, apellido, personalId, planta, onClick }: props) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 mt-3 flex justify-around rounded-sm ${onClick ? "hover:cursor-pointer" : ""}
              `}
      style={{
        backgroundColor: "var(--background-color)", border: "1px solid gray", borderRadius: 1, marginBottom: 1
      }}>
      <span>
        {nombre} {apellido}
      </span>
      <span>DNI: {personalId}</span>
      <span>Linea: {linea || " Sin Linea"}</span>
      <span>{planta || "Sin Planta"}</span>
      <span>Empresa: {empresa}</span>
    </div>
  );
};
