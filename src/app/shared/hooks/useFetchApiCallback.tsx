/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */

import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { useState, useEffect, useCallback } from "react";
import { useNotificationUI } from "../hooks/useNotificationUI";

//EL USO DE ESTE HOOK ES EXCLUSIVO PARA EL USO DE LOS useApi YA QUE CONTIENE UN CALLBACK PARA QUE SE PUEDA EJECUTAR CUANDO SE NECESITE Y NO ROMPER EL CICLO DE EJECUCION DE LOS useApi

export default function useFetchApiCallback<T>(
  sliceRequest: any,
  args?: any,
  consoleLog?: boolean,
  activador?: any,
  setearData?: (data: T | null) => void,
  soloSiTrue: boolean = false,
  showSkeleton: boolean = false,
  activeLoadingUI: boolean = true,
  functionAdd?: (response: T) => void,
  functionRemove?: () => void
) {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [state, setState] = useState<T | null>(null);

  const execute = useCallback(async (parametrosOpcionales?: any) => {
    const argumentosFinales = parametrosOpcionales !== undefined ? parametrosOpcionales : args;
    try {
      if (activeLoadingUI) {
        if (!showSkeleton) {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        } else {
          dispatch(LoadingUISlice.actions.LoadingUIOpenSkeleton());
        }
      }
      const response = unwrapResult(await dispatch(sliceRequest(argumentosFinales)));
      setState(response);

      if (setearData) {
        setearData(response);
      }
      if (response && functionAdd) {
        functionAdd(response);
      }
      if (consoleLog) {
        console.log(response);
      }

      return response as T;
    } catch (error) {
      if (functionRemove) {
        functionRemove();
      }
      console.error("Error en FetchApi:", error);
      setState(null);
      if (setearData) {
        setearData(null);
      }
      openNotificationUI(`Se produjo el error: ${error}`, "error");
      throw error;
    } finally {
      if (activeLoadingUI) {
        if (!showSkeleton) {
          dispatch(LoadingUISlice.actions.LoadingUIClose());
        } else {
          dispatch(LoadingUISlice.actions.LoadingUICloseSkeleton());
        }
      }
    }
  }, []);
  useEffect(() => {
    if (!soloSiTrue || activador) {
      execute();
    }
  }, [activador, soloSiTrue, execute]);
  return { state, setState, execute };
}
