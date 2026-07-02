import { useCallback, useState } from "react";
import FetchApi from "app/shared/helpers/FetchApi";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { useNotificationUI } from "../useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";

export function useGetAllPlants<T>() {
  const [response, setResponse] = useState<T>();
  FetchApi<T>(PlantSliceRequests.getAllRequest, null, true, null, setResponse, false, false, true);
  return { response };
}

export function useGetAllPlantsExecute<T>() {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [response, setResponse] = useState<T>();

  const execute = useCallback(async () => {
    try {
      LoadingUISlice.actions.LoadingUIOpen("Cargando...");
      const response = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      if (response) {
        setResponse(response as T);
      }
    } catch (error) {
      openNotificationUI(error, "error");
      LoadingUISlice.actions.LoadingUIClose();
    } finally {
      LoadingUISlice.actions.LoadingUIClose();
    }
  }, []);

  return { response, execute };
}
