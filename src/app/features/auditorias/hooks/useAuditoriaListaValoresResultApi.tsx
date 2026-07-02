import { useState } from "react";
import FetchApi from "app/shared/helpers/FetchApi";
import { AuditoriaListaValoresResultSliceRequest } from "../slices/AuditoriaListaValoresResultSlice";
import { IAuditoriaListaValoresResult } from "../models/IAuditoriaListaValoresResult";
import useFetchApiCallback from "app/shared/hooks/useFetchApiCallback";

export function useGetAllListValuesByAuditId(auditoriaId: number) {
  const [response, setResponse] = useState<IAuditoriaListaValoresResult>();
  FetchApi<IAuditoriaListaValoresResult>(
    AuditoriaListaValoresResultSliceRequest.GetAllListValuesByAuditId,
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

export function useGetAllListValuesByAuditIdExcute<T>() {
  const { state: response, execute } = useFetchApiCallback<T>(
    AuditoriaListaValoresResultSliceRequest.GetAllListValuesByAuditId,
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
