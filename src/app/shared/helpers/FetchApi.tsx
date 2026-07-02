/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/**
 * @typedef {import("@reduxjs/toolkit").AsyncThunk} AsyncThunk
 */

import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { useState, useEffect } from "react";
import { useNotificationUI } from "../hooks/useNotificationUI";

/**
 * Hook personalizado para realizar peticiones a la API utilizando Redux Toolkit y gestionar el estado de carga y notificaciones.
 *
 * Este hook encapsula la lógica para despachar acciones asíncronas (async thunks),
 * manejar los estados de carga (con o sin esqueleto), mostrar notificaciones
 * en caso de error y actualizar el estado interno o externo con los datos obtenidos.
 *
 * @template T El tipo de dato esperado en la respuesta de la petición.
 *
 * @param {AsyncThunk<T, any, any>} sliceRequest La acción asíncrona (async thunk) de Redux Toolkit a despachar.
 *                                                Debe ser una función que retorne una promesa con los datos de tipo T.
 * @param {any} [args] Los argumentos que se pasarán a la `sliceRequest`. Si la acción no requiere argumentos, puede ser `undefined` o `null`.
 * @param {boolean} [consoleLog=false] Si es `true`, la respuesta de la petición se imprimirá en la consola.
 * @param {any} [activador] Una dependencia que, cuando cambia, dispara la ejecución de la petición. Puede ser un estado, un prop, etc.
 *                          Si `soloSiTrue` es `true`, la petición solo se ejecutará si `activador` es un valor verdadero (truthy).
 * @param {(data: T | null) => void} [setearData] Una función opcional para actualizar los datos obtenidos en un componente externo.
 *                                                 Recibe los datos de tipo `T` o `null` en caso de error.
 * @param {boolean} [soloSiTrue=false] Si es `true`, la petición solo se ejecutará si `activador` tiene un valor verdadero (truthy).
 *                                      Esto es útil para peticiones condicionales.
 * @param {boolean} [showSkeleton=false] Si es `true`, se mostrará una interfaz de carga de tipo esqueleto (`LoadingUIOpenSkeleton`).
 *                                        Si es `false`, se mostrará un spinner de carga genérico (`LoadingUIOpen`).
 * @param {boolean} [activeLoadingUI=true] Si es `true`, se activará la interfaz de usuario de carga (ya sea spinner o esqueleto).
 *                                          Si es `false`, la interfaz de carga no se mostrará.
 * @param {(response: T) => void} [functionAdd] Una función opcional que se ejecutará con la respuesta de la petición
 *                                                si la petición fue exitosa y `response` no es `undefined` o un array vacío.
 *
 * @returns {{ state: T | null, setState: React.Dispatch<React.SetStateAction<T | null>> }} Un objeto que contiene:
 *          - `state`: El estado interno del hook, que guarda los datos obtenidos de la petición (o `null` si no hay datos o hubo un error).
 *          - `setState`: La función para actualizar el `state` interno del hook.
 *
 * @example
 * // Ejemplo de uso para obtener una lista de ítems:
 * const { state: items, setState: setItems } = FetchApi<IItem[]>(
 *   itemsSlice.getMany, // Asume que `getMany` es un async thunk
 *   null, // No requiere argumentos
 *   true, // Imprime la respuesta en consola
 *   null, // No hay activador específico, se ejecuta una vez
 *   (data) => console.log('Datos actualizados externamente:', data), // Callback para uso externo
 *   false, // Se ejecuta siempre que el componente se monta
 *   true, // Muestra un esqueleto de carga
 *   true, // Activa la UI de carga
 *   (response) => console.log('Función adicional con respuesta:', response)
 * );
 *
 * @example
 * // Ejemplo de uso con un activador (ej. cuando cambia un `id`):
 * const [productId, setProductId] = useState<string | null>(null);
 * const { state: productDetails } = FetchApi<IProduct>(
 *   productSlice.getById,
 *   productId,
 *   false,
 *   productId, // La petición se re-ejecuta cuando `productId` cambia
 *   undefined,
 *   true // Solo se ejecuta si `productId` tiene un valor
 * );
 */
export default function FetchApi<T>(
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
  const adicionarFuncion = functionAdd ? functionAdd : false;
  const adicionarFuncionError = functionRemove ? functionRemove : false;

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [state, setState] = useState<T | null>(null);
  useEffect(() => {
    // Si `soloSiTrue` es `true`, la petición solo se ejecutará si `activador` tiene un valor verdadero.
    // Si `soloSiTrue` es `false`, la petición se ejecutará si `activador` cambia (o una vez si `activador` es `null`/`undefined`).
    if (!soloSiTrue || activador) {
      const init = async () => {
        try {
          if (activeLoadingUI) {
            if (!showSkeleton) {
              dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
            }
            if (showSkeleton) {
              dispatch(LoadingUISlice.actions.LoadingUIOpenSkeleton());
            }
          }
          const response = unwrapResult(await dispatch(sliceRequest(args)));

          // Actualiza el estado interno del hook
          setState(response);

          // Si se proporcionó un callback `setearData`, úsalo para actualizar datos externos
          if (setearData) {
            setearData(response);
          }

          // Si se proporcionó `functionAdd` y la respuesta es válida, se ejecuta la funcion
          if (response && adicionarFuncion) {
            functionAdd(response);
          }

          if (consoleLog) {
            console.log(response);
          }
        } catch (error) {
          if (adicionarFuncionError) {
            functionRemove();
          }
          console.error("Error en FetchApi:", error); // Usar console.error para errores
          setState(null); // Limpiar el estado en caso de error
          if (setearData) {
            setearData(null); // Notificar error a componentes externos
          }
          openNotificationUI(`Se produjo el error: ${error}`, "error");
        } finally {
          if (activeLoadingUI) {
            if (!showSkeleton) {
              dispatch(LoadingUISlice.actions.LoadingUIClose());
            }
            if (showSkeleton) {
              dispatch(LoadingUISlice.actions.LoadingUICloseSkeleton());
            }
          }
        }
      };
      init();
    }
  }, [activador, soloSiTrue]);

  return { state, setState };
}
