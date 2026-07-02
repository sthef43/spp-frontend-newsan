import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { useState, useCallback } from "react";
import { useFetchApiMultiResults } from "../UseFetchApiMultiResults";
import { useNotificationUI } from "../useNotificationUI";

export function useGetAllLineas<T>() {
  const [response, setResponse] = useState<T>();
  FetchApi<T>(LineaSliceRequests.getAllRequest, null, false, null, setResponse, false, false, true);
  return { response };
}

export function useGetLineaById<T>(id: number) {
  const [response, setResponse] = useState<T>();
  FetchApi<T>(LineaSliceRequests.getByIdRequest, id, false, null, setResponse, true, false, true);
  return { response };
}

export function useGetLineasByPlantId<T>(plantId: number) {
  const [response, setResponse] = useState<T>();
  FetchApi<T>(LineaSliceRequests.GetListByPlantId, plantId, false, plantId, setResponse, true, false, true);
  return { response };
}

export function usePutLinea<T>() {
  const { FetchPut } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();

  const execute = useCallback((model: T): Promise<T> => {
    return new Promise((resolve, reject) => {
      FetchPut({
        consoleLog: false,
        modelPut: model,
        sliceRequest: LineaSliceRequests.putRequest,
        activeConfirmation: true,
        mensajePersonalizado: true,
        messageUser: "Se actualizaran los datos de la linea seleccionada, ¿desea continuar?",
        titleUser: "Actualizar linea",
        functionAdd(response: unknown) {
          openNotificationUI("Se actualizo correctamente", "success");
          resolve(response as T);
        },
        functionReject(response: unknown) {
          openNotificationUI("Ocurrio un error al intentar actualizar el elemento", "error");
          reject(response);
        }
      });
    });
  }, []);
  return { execute };
}
