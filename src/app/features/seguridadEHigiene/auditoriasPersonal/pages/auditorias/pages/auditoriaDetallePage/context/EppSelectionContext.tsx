import { useEppSelection } from "app/features/seguridadEHigiene/auditoriasPersonal/hooks/useEppSelection";
import { SEH_Auditoria_Detalles } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_Auditoria_Detalles";
import { SEH_EPP } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_EPP";

import React, { createContext, useContext } from "react";

interface EppSelectionContextType {
  selectedEpps: SEH_Auditoria_Detalles[];
  onSelect?: (epp: SEH_EPP) => void;
  onDelete?: (id: number) => void;
  isSelected: (id: number) => boolean;
  setSelectedEpps: (value: React.SetStateAction<SEH_Auditoria_Detalles[]>) => void;
}

const EppSelectionContext = createContext<EppSelectionContextType | undefined>(undefined);
export const EppSelectionProvider = ({
  children,
  initialEpps
}: {
  children: React.ReactNode;
  initialEpps: SEH_Auditoria_Detalles[];
}) => {
  const eppSelection = useEppSelection(initialEpps);
  return <EppSelectionContext.Provider value={eppSelection}>{children}</EppSelectionContext.Provider>;
};

export const useEppContext = () => {
  const context = useContext(EppSelectionContext);
  if (context === undefined) {
    throw new Error("useEppContext must be used within an EppSelectionProvider");
  }
  return context;
};
