import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant } from "app/models";
import { IFamilia } from "app/models/IFamilia";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";

interface props {
  plantaId: IPlant;
  datosFamilia: IFamilia;
  setAbrirExaminar: (state: boolean) => void;
  setMostrarFondo: (state: boolean) => void;
  producto: number;
  lineas: ILineaProduccion[];
}

export const ExaminarFamilia: React.FC<props> = ({
  datosFamilia,
  setAbrirExaminar,
  plantaId,
  producto,
  setMostrarFondo,
  lineas
}) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const getLineasProduccion = async () => {
    try {
      const response = unwrapResult(
        await dispatch(
          LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId({ plantaId: plantaId.id, productoId: producto })
        )
      );
      if (response) {
        console.log(response);
      }
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };

  const [filtradoLineas, setFiltradoLineas] = useState([]);
  const filtarLineas = () => {
    const nombreLineasConFamilia = lineas.map((elementos) => {
      return {
        linea: elementos.nombre,
        lineaProduccion: elementos.lineaProduccionFamilia.filter((aux) => aux.familiaId == datosFamilia.id)
      };
    });
    const lineasConFamilia = nombreLineasConFamilia.map((elementos) => {
      if (elementos.lineaProduccion.length !== 0) {
        return elementos.linea;
      }
    });
    lineasConFamilia.map((elementos) => {
      const lineaFiltrada = lineas.filter((elementos2) => elementos2.nombre == elementos);
      setFiltradoLineas((prev) => prev.concat(lineaFiltrada));
    });
  };

  useEffect(() => {
    if (setAbrirExaminar) {
      filtarLineas();
      getLineasProduccion();
    }
  }, [setAbrirExaminar]);

  return (
    <main className="bg-white border border-gray-200 w-full absolute top-0 right-0 px-4 rounded-md pb-8 z-10">
      <div className="w-full flex flex-row justify-end">
        <button
          onClick={() => {
            setAbrirExaminar(false);
            setMostrarFondo(false);
            setFiltradoLineas([]);
          }}
          className="bg-gray-500 rounded-sm px-[7px] py-[2px] font-semibold text-white text-xs mt-4">
          X
        </button>
      </div>
      <section>
        <header className="w-full bg-red-800 text-white text-2xl text-center py-3 mt-3 mb-6 rounded-md font-bold">
          Examinar Datos Model Number
        </header>
      </section>
      <div className="bg-[#f8f8f8] border-gray-200 rounded-lg border mt-6 shadow-[0_6px_3px_-1px_rgba(166,166,166,0.71)]">
        <table className="rounded-md w-full text-center">
          <thead className="bg-[#a5e7f1] border-b rounded-t-lg border-sky-200 h-8">
            <tr>
              <th className="text-[1rem] text-blue-800 font-medium">Nombre Linea</th>
              <th className="text-[1rem] text-blue-800 font-medium">Producto</th>
              <th className="text-[1rem] text-blue-800 font-medium">Planta</th>
              <th className="text-[1rem] text-blue-800 font-medium">Model Number</th>
            </tr>
          </thead>
          <tbody className="h-16 text-black">
            {filtradoLineas.map((elementos, index) => (
              <tr key={index}>
                <td>{elementos.nombre}</td>
                <td>{elementos.producto?.nombre}</td>
                <td>{elementos.plant?.name}</td>
                <td>{datosFamilia.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
