import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
import { AuditoriaProvider } from "./context/AuditoriaContext";
import { AuditoriaPageContent } from "./AuditoriaPageContent";
import { EppSelectionProvider } from "./context/EppSelectionContext";
import { useParams } from "react-router-dom";
import { SEH_Auditoria } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_Auditoria";
import { SEH_Auditoria_Detalles } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_Auditoria_Detalles";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { sehAuditoriaSliceRequest } from "app/features/seguridadEHigiene/auditoriasPersonal/reducers/SEH_AuditoriaSlice";

export const AuditoriaDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [initialAuditoria, setInitialAuditoria] = useState<SEH_Auditoria>(null);
  const [initialEpps, setInitialEpps] = useState<SEH_Auditoria_Detalles[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuditoriaById = async (id: number) => {
    try {
      setLoading(true);
      const auditoria = unwrapResult(await dispatch(sehAuditoriaSliceRequest.getByIdRequest(+id)));
      if (auditoria) {
        setInitialAuditoria(auditoria);
        setInitialEpps(auditoria.detalles);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (id) {
      getAuditoriaById(+id);
    } else {
      setLoading(false);
    }
  }, [id]);

  return (
    <>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <AuditoriaProvider initialAuditoria={initialAuditoria}>
          <EppSelectionProvider initialEpps={initialEpps}>
            <AuditoriaPageContent />
          </EppSelectionProvider>
          {/* <div>Hola</div> */}
        </AuditoriaProvider>
      )}
    </>
  );
};
