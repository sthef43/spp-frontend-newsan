import FetchApi from "app/shared/helpers/FetchApi";
import { useState } from "react";
import { AuditoriaSliceRequest } from "../slices/AuditoriaSlice";

export function useGetAllAuditsFatherByRolAndPlantId<T>(idPlant: number, idRol: number) {
  const [response, setResponse] = useState<T>();
  FetchApi<T>(
    AuditoriaSliceRequest.GetAllAuditsFatherByRolAndPlantId,
    { idPlant, idRol },
    false,
    idPlant,
    setResponse,
    true,
    false,
    true
  );
  return { response };
}
