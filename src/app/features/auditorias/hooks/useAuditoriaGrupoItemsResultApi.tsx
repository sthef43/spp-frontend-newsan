import { useState } from "react";
import { IAuditoriaGrupoItemsResult } from "../models/IAuditoriaGrupoItemsResult";
import FetchApi from "app/shared/helpers/FetchApi";
import { AuditoriaGrupoItemsResultSliceRequest } from "../slices/AuditoriaGrupoItemsResultSlice";
import useFetchApiCallback from "app/shared/hooks/useFetchApiCallback";

export function useGetAllGroupResultsByAuditId(auditoriaId: number) {
  const [response, setResponse] = useState<IAuditoriaGrupoItemsResult[]>([]);
  FetchApi<IAuditoriaGrupoItemsResult[]>(
    AuditoriaGrupoItemsResultSliceRequest.GetAllGroupResultsByAuditId,
    auditoriaId,
    false,
    auditoriaId,
    setResponse,
    true,
    false,
    true
  );
  return { response };
}

export function useGetAllGroupResultsByAuditIdExcute<T>() {
  const { state: response, execute } = useFetchApiCallback<T>(
    AuditoriaGrupoItemsResultSliceRequest.GetAllGroupResultsByAuditId,
    null,
    false,
    null,
    null,
    true,
    false,
    true
  );
  return { response, execute };
}
