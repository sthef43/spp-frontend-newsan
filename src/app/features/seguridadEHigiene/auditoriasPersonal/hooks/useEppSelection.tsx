import { useState } from "react";
import { SEH_EPP } from "../interfaces/SEH_EPP";
import { SEH_Auditoria_Detalles } from "../interfaces/SEH_Auditoria_Detalles";

export const useEppSelection = (initialEpps: SEH_Auditoria_Detalles[]) => {
  const [selectedEpps, setSelectedEpps] = useState(initialEpps);

  const onSelect = (epp: SEH_EPP): void => {
    setSelectedEpps((prevSelectedEpps) => {
      if (isSelected(epp.id)) return prevSelectedEpps;
      const found = selectedEpps.find((d) => d.eppId == epp.id);
      if (found && found?.id > 0) {
        const newSelectedList = selectedEpps.map((d) => {
          if (d.eppId == epp.id) {
            d.deleted = false;
          }
          return d;
        });
        setSelectedEpps([...newSelectedList]);
      } else {
        const newEppDetalle: SEH_Auditoria_Detalles = {
          cumple: false,
          eppId: epp.id,
          epp: epp,
          deleted: false
        };
        return [...prevSelectedEpps, newEppDetalle];
      }
    });
  };

  const onDelete = (sehEPPId: number): void => {
    const found = selectedEpps.find((d) => d.eppId == sehEPPId);
    if (found && found?.id > 0) {
      const newSelectedList = selectedEpps.map((d) => {
        if (d.eppId == sehEPPId) {
          d.deleted = true;
        }
        return d;
      });
      setSelectedEpps([...newSelectedList]);
      return;
    }
    setSelectedEpps((prevSelectedEpps) => {
      return prevSelectedEpps.filter((epp) => epp.eppId != sehEPPId);
    });
  };

  const isSelected = (sehEPPId: number): boolean => {
    return selectedEpps.some((epp) => epp.eppId == sehEPPId && !epp.deleted);
  };

  return {
    onSelect,
    onDelete,
    isSelected,
    selectedEpps,
    setSelectedEpps
  };
};
