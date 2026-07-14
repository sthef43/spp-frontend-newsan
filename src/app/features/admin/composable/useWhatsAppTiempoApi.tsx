import { IWhatsappMsgTiempo } from "app/models/IWhatsappMsgTiempo";
import FetchApi from "app/shared/helpers/FetchApi";
import useFetchApiCallback from "app/shared/hooks/useFetchApiCallback";
import { useState } from "react";
import { WhatsappMsgTiempoSliceRequests } from "../slices/WhatsappMsgTiempoSlice";

export function useGetAllWhatsAppTiempo() {
  const { state: response, execute } = useFetchApiCallback<IWhatsappMsgTiempo[]>(
    WhatsappMsgTiempoSliceRequests.getAllRequest,
    null,
    false,
    null,
    null,
    false,
    false,
    true
  );
  return { response, execute };
}
