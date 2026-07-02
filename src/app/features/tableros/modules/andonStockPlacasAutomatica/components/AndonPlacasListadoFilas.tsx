import React, { useEffect, useState } from "react";
// Mantenemos la estructura de la ruta, asumiendo que debe ser correcta:

import AndonPlacasFila from "./common/AndonPlacasFila";
import type { IAndonPlacas } from "../models/IAndonPlacas";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { AndonPlacasSliceRequest } from "../reducers/AndonPlacasSlice";

// Intervalo de refresco en milisegundos (10 segundos)
const REFRESH_INTERVAL = 10000;

export default function AndonPlacasListadoFilas() {
  const dispatch = useAppDispatch();
  // Desestructuramos solo dataAll y loading
  const { dataAll, loading } = useAppSelector((state) => state.andonPlacas);

  // Estado local para manejar si ocurrió un error en la última llamada
  const [hasError, setHasError] = useState(false);

  // Datos a renderizar
  const datas: IAndonPlacas[] = dataAll || [];

  /**
   * Función que despacha la acción para obtener todas las placas.
   * Gestiona el estado de error local.
   */
  const getAll = async () => {
    try {
      // Reiniciamos el estado de error antes de la llamada
      setHasError(false);
      console.log("Despachando acción para obtener todas las placas...");
      // Despachamos la acción y manejamos el resultado
      const resultAction = unwrapResult(await dispatch(AndonPlacasSliceRequest.GetAllPlaquesForSectorsAndForModels()));
      if (resultAction) {
        console.log("Datos de placas actualizados:", resultAction.length, "modelos.");
      }
    } catch (err) {
      console.error("Error al despachar acción:", err);
      // Registramos el error localmente si falla la llamada
      setHasError(true);
    }
  };

  // --- EFECTO 1: Lógica de Polling (setInterval) ---
  useEffect(() => {
    // Ejecutamos la primera llamada inmediatamente al montar el componente
    getAll();

    // Configuramos el intervalo
    const intervalId = setInterval(() => {
      console.log(`Polling: Despachando acción cada ${REFRESH_INTERVAL / 1000} segundos.`);
      // Llamamos a getAll en cada intervalo
      getAll();
    }, REFRESH_INTERVAL);

    // Función de limpieza: se ejecuta al desmontar el componente o antes de re-ejecutar el useEffect
    return () => {
      console.log("Limpiando intervalo de polling.");
      clearInterval(intervalId);
    };

    // La dependencia en 'dispatch' es para asegurar que el intervalo se reinicie si el dispatch cambia
  }, []);

  // --- LÓGICA DE FLUJO DE CONTROL Y RENDERIZADO ---

  // 1. Mostrar cargando si está en proceso de carga inicial y no hay datos previos
  if (loading && datas.length === 0) {
    return <div className="p-8 text-center text-4xl text-blue-500 font-semibold">Cargando placas...</div>;
  }

  // 2. Mostrar error si no hay datos y el estado local 'hasError' es true
  if (hasError && datas.length === 0) {
    return (
      <div className="p-8 text-center text-4xl text-red-500 font-semibold">
        Error al cargar placas. Intente recargar
        <button onClick={getAll}>Refrescar</button>
      </div>
    );
  }

  // 3. Renderizado del Contenido
  return (
    <div className="py-[3px] flex flex-col items-center w-full overflow-y-hidden">
      {datas.length > 0 ? (
        <div className="w-full overflow-y-hidden">
          {/* Mapeo del Array dataAll (datas) */}
          {datas.map((placa: IAndonPlacas) => (
            <AndonPlacasFila
              // Usamos el modelo como key si es único y estable
              key={placa.modelo}
              {...placa}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 text-3xl">No se encontraron placas de producción.</div>
      )}

      {/* Opcional: Indicador de carga durante el polling (si ya hay datos en pantalla) */}
      {loading && datas.length > 0 && (
        <div className="absolute top-2 right-2 p-2 rounded-lg bg-blue-100 border border-blue-300 text-sm text-blue-800 animate-pulse transition-opacity duration-500">
          Actualizando datos...
        </div>
      )}
    </div>
  );
}
