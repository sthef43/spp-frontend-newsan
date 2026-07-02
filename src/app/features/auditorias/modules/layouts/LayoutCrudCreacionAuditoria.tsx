/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { Control, FieldErrors, FieldValues, UseFormReset, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { CreacionAuditoriaPrimerPaso } from "../components/creacionAuditorias/CreacionAuditoriaPrimerPaso";
import { CreacionAuditoriaSegundoPaso } from "../components/creacionAuditorias/CreacionAuditoriaSegundoPaso";
import { CreacionAuditoriaTercerPaso } from "../components/creacionAuditorias/CreacionAuditoriaTercerPaso";

interface Props {
  pasoActivo: number;
  controlFather: Control;
  setValuesFather: UseFormSetValue<FieldValues>;
  resetFather: UseFormReset<FieldValues>;
  errosFather: FieldErrors<FieldValues>;
  triggerFather: UseFormTrigger<FieldValues>;
}

export const LayoutCrudCreacionAuditoria: React.FC<Props> = ({
  pasoActivo,
  controlFather,
  setValuesFather,
  resetFather,
  errosFather,
  triggerFather
}) => {
  return (
    <main className="w-full px-6 mt-10">
      {pasoActivo === 1 && (
        <CreacionAuditoriaPrimerPaso
          controlFather={controlFather}
          setValuesFather={setValuesFather}
          resetFather={resetFather}
          errosFather={errosFather}
          triggerFather={triggerFather}
        />
      )}
      {pasoActivo === 2 && (
        <CreacionAuditoriaSegundoPaso
          controlFather={controlFather}
          setValuesFather={setValuesFather}
          resetFather={resetFather}
          errosFather={errosFather}
          triggerFather={triggerFather}
        />
      )}
      {pasoActivo === 3 && (
        <CreacionAuditoriaTercerPaso
          controlFather={controlFather}
          setValuesFather={setValuesFather}
          resetFather={resetFather}
          errosFather={errosFather}
          triggerFather={triggerFather}
        />
      )}
    </main>
  );
};
