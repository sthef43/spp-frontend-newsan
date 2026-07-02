import { tipoDato } from "../../features/informes/Modules/reportePlacasAutomotriz/Interfaces/InformePlacasAutomotrizSP";

export const obtenerDatosReferencia = (dataParseada: tipoDato, positionKey: number, valueIndex: number) => {
  const datos = Object.values(dataParseada).map((key) => key);
  const valuesRatedVoltageTest = datos[positionKey];
  const values = Object.values(valuesRatedVoltageTest);

  if (valueIndex[valueIndex] !== null) {
    return values[valueIndex];
  } else {
    return "N/A";
  }
};
