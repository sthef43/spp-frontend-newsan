import { SEH_Auditoria } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_Auditoria";
import React, { createContext, useContext, useState } from "react";

interface AuditoriaContextContextType {
  auditoriaData: SEH_Auditoria;
  conteoUltimoGrupoHistorial: number;
  setConteoUltimoGrupoHistorial: React.Dispatch<React.SetStateAction<number>>;
  auditoriasIdAviso: number[];
  setAuditoriasIdAviso: React.Dispatch<React.SetStateAction<number[]>>;
}

const AuditoriaContext = createContext<AuditoriaContextContextType>(undefined);

export const AuditoriaProvider = ({
  children,
  initialAuditoria
}: {
  children: React.ReactNode;
  initialAuditoria: SEH_Auditoria;
}) => {
  const [auditoriaData, setAuditoriaData] = useState<SEH_Auditoria>(initialAuditoria);
  const [conteoUltimoGrupoHistorial, setConteoUltimoGrupoHistorial] = useState<number>(0);
  const [auditoriasIdAviso, setAuditoriasIdAviso] = useState<number[]>([]);

  return (
    <AuditoriaContext.Provider
      value={{
        auditoriaData,
        conteoUltimoGrupoHistorial,
        setConteoUltimoGrupoHistorial,
        auditoriasIdAviso,
        setAuditoriasIdAviso
      }}>
      {children}
    </AuditoriaContext.Provider>
  );
};

export const useAuditoriaContext = () => {
  const context = useContext(AuditoriaContext);
  if (context === undefined) {
    throw new Error("useAuditoriaContext mal integrado");
  }
  return context;
};
