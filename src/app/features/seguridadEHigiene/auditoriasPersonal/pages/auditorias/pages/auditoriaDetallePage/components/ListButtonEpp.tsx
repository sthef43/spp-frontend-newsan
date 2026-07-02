import React from "react";
import { ButtonEpp } from "./ButtonEpp";
import { SEH_EPP } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_EPP";
import { useEppContext } from "../context/EppSelectionContext";

interface Props {
  epps?: SEH_EPP[];
}

export const ListButtonEpp = ({ epps }: Props) => {
  const { onSelect, isSelected } = useEppContext();
  return (
    <div className="w-full">
      <div className={`grid ${epps.length >= 3 ? "grid-cols-3" : `grid-cols-${epps.length}`}  gap-2`}>
        {epps.map((epp) => (
          <ButtonEpp isSelected={isSelected(epp.id)} key={epp.id} label={epp.nombre} onSelect={() => onSelect(epp)} />
        ))}
      </div>
    </div>
  );
};
