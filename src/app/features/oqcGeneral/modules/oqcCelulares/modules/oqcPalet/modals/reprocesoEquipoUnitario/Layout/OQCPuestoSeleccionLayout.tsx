import React from "react";
import { OQCPuestoReproceso } from "../Components/OQCPuestoReproceso";
import { OQCPuestoControl } from "../Components/OQCPuestoControl";
import { OQCPuestoEmbalaje } from "../Components/OQCPuestoEmbalaje";
import { OQCPuestoEmbalajeSinValidacion } from "../Components/OQCPuestoEmbalajeSinValidacion";

interface Props {
  opcionPuesto: number;
}

export const OQCPuestoSeleccionLayout: React.FC<Props> = ({ opcionPuesto }) => {
  const cambiarMenu = () => {
    switch (opcionPuesto) {
      case 1:
        return <>{opcionPuesto === 1 && <OQCPuestoReproceso />}</>;
      case 2:
        return <>{opcionPuesto === 2 && <OQCPuestoControl />}</>;
      case 3:
        return <>{opcionPuesto === 3 && <OQCPuestoEmbalaje />}</>;
      case 4:
        return <>{opcionPuesto === 4 && <OQCPuestoEmbalajeSinValidacion />}</>;
    }
  };

  return <main>{cambiarMenu()}</main>;
};
