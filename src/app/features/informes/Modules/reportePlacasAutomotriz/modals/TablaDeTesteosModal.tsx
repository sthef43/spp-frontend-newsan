/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { InformePlacasAutomotrizSP } from "../Interfaces/InformePlacasAutomotrizSP";
import { obtenerDatosReferencia } from "app/shared/helpers/AutomotrizObtenerDatosReferencia";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  placaSeleccionada: InformePlacasAutomotrizSP | null;
}

export const TablaDeTesteosModal: React.FC<Props> = ({ setOpenModal, openModal, placaSeleccionada }) => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const obtenerDatos = (index: number) => {
    const datos = Object.values(placaSeleccionada.dataParseada).map((key) => key);
    if (placaSeleccionada === null) {
      return "";
    }
    return datos[index];
  };

  // const obtenerDatosReferencia = (positionKey: number, valueIndex: number) => {
  //   const datos = Object.values(placaSeleccionada.dataParseada).map((key) => key);
  //   const valuesRatedVoltageTest = datos[positionKey];
  //   const values = Object.values(valuesRatedVoltageTest);

  //   if (valueIndex[valueIndex] !== null) {
  //     return values[valueIndex];
  //   } else {
  //     return "N/A";
  //   }
  // };

  return (
    <main className="w-[55vw]">
      <header className="bg-[#dae8fd] rounded-lg p-4">
        <div className="flex flex-row justify-between items-center text-black">
          <p>SN: {obtenerDatos(0)}</p>
          <p>Estado: {obtenerDatos(6)}</p>
          <p>Cama: {obtenerDatos(2)}</p>
        </div>
      </header>
      <section className="flex flex-row w-full justify-between mt-4">
        <div className="bg-[#dae8fd] size-60 rounded-lg">
          <div className="W-full h-full flex flex-col justify-start gap-y-2 items-start p-4 text-black">
            <p className="font-semibold text-[#3E5CBB]">Rated Voltage Test</p>
            <p>Input Voltage: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 3, 0)}</p>
            <p>Input Current: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 3, 1)}</p>
            <p>Output Voltage: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 3, 2)}</p>
            <p>Output Current: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 3, 3)}</p>
          </div>
        </div>
        <div className="bg-[#F0FDF4] size-60 rounded-lg">
          <div className="W-full h-full flex flex-col justify-start gap-y-2 items-start p-4 text-black">
            <p className="font-semibold text-[#1E6A3B]">Minimum Voltage Test</p>
            <p>Input Voltage: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 4, 0)}</p>
            <p>Input Current: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 4, 1)}</p>
            <p>Output Voltage: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 4, 2)}</p>
            <p>Output Current: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 4, 3)}</p>
            <p>Efficiency: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 4, 4)}</p>
          </div>
        </div>
        <div className="bg-[#FEF2F2] size-60 rounded-lg">
          <div className="W-full h-full flex flex-col justify-start gap-y-2 items-start p-4 text-black">
            <p className="font-semibold text-[#AA3F3F]">Maximum Voltage Test</p>
            <p>Input Voltage: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 5, 0)}</p>
            <p>Input Current: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 5, 1)}</p>
            <p>Output Voltage: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 5, 2)}</p>
            <p>Output Current: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 5, 3)}</p>
            <p>Efficiency: {obtenerDatosReferencia(placaSeleccionada.dataParseada, 5, 4)}</p>
          </div>
        </div>
      </section>
    </main>
  );
};
