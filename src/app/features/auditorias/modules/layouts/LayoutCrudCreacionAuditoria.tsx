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
  modoEdicionGlobal?: boolean;
  cantidadAuditoriasAfectadas?: number;
}

export const LayoutCrudCreacionAuditoria: React.FC<Props> = ({
  pasoActivo,
  controlFather,
  setValuesFather,
  resetFather,
  errosFather,
  triggerFather,
  modoEdicionGlobal = false,
  cantidadAuditoriasAfectadas = 0
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
        <>
          <CreacionAuditoriaTercerPaso
            controlFather={controlFather}
            setValuesFather={setValuesFather}
            resetFather={resetFather}
            errosFather={errosFather}
            triggerFather={triggerFather}
          />
          {modoEdicionGlobal && cantidadAuditoriasAfectadas > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 font-semibold text-lg">
                Modo Edición Global Activo
              </p>
              <p className="text-blue-600">
                Los cambios realizados se aplicarán a <strong>{cantidadAuditoriasAfectadas}</strong> auditoría(s) asignada(s).
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
};
