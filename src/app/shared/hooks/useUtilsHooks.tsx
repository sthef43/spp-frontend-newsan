import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface FormatDateHourOrMinutes {
  optionDate: "fullDate" | "onlyHourAndDate" | "onlyDate";
}

interface DateEnteredRequired extends FormatDateHourOrMinutes {
  optionHour: "fechaBaseDatos";
  fechaIngresada: string;
}

interface DateEnteredOptional extends FormatDateHourOrMinutes {
  optionHour: "fechaAutomatica";
  fechaIngresada?: string;
}

interface TypeValidationOrReplace {
  typeRegex: "email" | "number" | "letters" | "lettersAndNumbers";
}

export type PropsFormatDateHourOrMinutes = DateEnteredRequired | DateEnteredOptional;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function UseUtilHooks<T>() {
  const debounceTime = (value, delay) => {
    const [valorBusqueda, setValorBusqueda] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setValorBusqueda(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    return valorBusqueda;
  };

  const formatDateHourOrMinutes = ({ optionDate, optionHour, fechaIngresada }: PropsFormatDateHourOrMinutes) => {
    const dateCurrent = optionHour == "fechaAutomatica" ? new Date() : new Date(fechaIngresada);
    if (optionHour === "fechaAutomatica") {
      if (optionDate === "fullDate") {
        return `${formatHourOrMinutes(dateCurrent.getDate())}/${formatHourOrMinutes(
          dateCurrent.getMonth() + 1
        )}/${formatHourOrMinutes(dateCurrent.getFullYear())} ${formatHourOrMinutes(
          dateCurrent.getHours()
        )}${":"}${formatHourOrMinutes(dateCurrent.getMinutes())}`;
      } else if (optionDate === "onlyHourAndDate") {
        return `${formatHourOrMinutes(dateCurrent.getHours())}${":"}${formatHourOrMinutes(dateCurrent.getMinutes())}`;
      }
    } else if (optionHour === "fechaBaseDatos") {
      if (optionDate === "fullDate") {
        return `${formatHourOrMinutes(dateCurrent.getDate())}/${formatHourOrMinutes(
          dateCurrent.getMonth() + 1
        )}/${formatHourOrMinutes(dateCurrent.getFullYear())} ${formatHourOrMinutes(
          dateCurrent.getHours()
        )}${":"}${formatHourOrMinutes(dateCurrent.getMinutes())}`;
      } else if (optionDate === "onlyHourAndDate") {
        return `${formatHourOrMinutes(dateCurrent.getHours())}${":"}${formatHourOrMinutes(dateCurrent.getMinutes())}`;
      } else if (optionDate === "onlyDate") {
        return `${formatHourOrMinutes(dateCurrent.getDate())}${"/"}${formatHourOrMinutes(
          dateCurrent.getMonth() + 1
        )}${"/"}${formatHourOrMinutes(dateCurrent.getFullYear())}`;
      }
    }
  };

  const generateSeriesNumbers = (prefijoPlanProd: string, desde: string, hasta: string) => {
    const cantidadRepeticiones = parseInt(hasta) - parseInt(desde);
    const diferencia = 15 - (prefijoPlanProd + desde).length;
    const numerosFinales = [];
    let codigo = prefijoPlanProd;

    for (let index = 0; index <= cantidadRepeticiones; index++) {
      const numeroUltimosSerie = parseInt(desde) + index;
      numerosFinales.push(numeroUltimosSerie);
    }

    for (let index = 0; index < diferencia; index++) {
      codigo += "0";
    }
    const arrayNumerosSeries = numerosFinales.map((numero) => {
      return codigo + numero;
    });

    return arrayNumerosSeries;
  };

  const pagination = (listaPaginacion: T[], itemsPorPagina: number, paginaActual: number) => {
    if (listaPaginacion && listaPaginacion) {
      if (listaPaginacion.length === 0) {
        return { itemActuales: [], totalPaginas: 0 };
      }
      const totalPaginas = Math.ceil(listaPaginacion.length / itemsPorPagina);

      const indiceUltimoItem = paginaActual * itemsPorPagina;
      const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
      const itemActuales = listaPaginacion.slice(indicePrimerItem, indiceUltimoItem);

      return { itemActuales, totalPaginas };
    } else {
      return { itemActuales: [], totalPaginas: 0 };
    }
  };

  const generateColorRandom = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const validateOrReplaceWithRegex = (
    value: string,
    typeRegex: TypeValidationOrReplace,
    replaceOrValidate: "validate" | "replace"
  ) => {
    const regex = listRegex(typeRegex);
    if (replaceOrValidate === "validate") {
      return regex.test(value);
    }
    if (replaceOrValidate === "replace") {
      return value.replace(regex, "");
    }
  };

  // const comparateLists = (itemActual: any, listaNueva: T[], datoParaComparar: any) => {
  //     let filtro = false
  //     listaNueva.map((elementos) => {
  //         console.log(elementos[datoParaComparar], itemActual[datoParaComparar])
  //         if(elementos[datoParaComparar] === itemActual[datoParaComparar]) {
  //             filtro = true
  //         } else {
  //             filtro = false
  //         }
  //     })
  //     return filtro
  // }

  const HandleFileExcel = (e: React.ChangeEvent<HTMLInputElement>, setDatesTable: (newValue: T[]) => void) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onFileUploadExcel(setDatesTable, file);
    }
  };

  const onFileUploadExcel = (setDatesTable: (newValue: T[]) => void, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetname];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      jsonData.shift();
      console.log(jsonData);
      const arreglo = [];
      setDatesTable(arreglo);
    };
    reader.readAsArrayBuffer(file);
  };

  //----------------------------------------
  //FUNCIONES INTERNAS
  const formatHourOrMinutes = (hora: number): string => {
    if (hora < 10) {
      return "0" + hora;
    } else {
      return hora.toString();
    }
  };

  const listRegex = (regex: TypeValidationOrReplace): RegExp => {
    switch (regex.typeRegex) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      case "number":
        return /^[0-9]+$/;
      case "letters":
        return /^[a-zA-Z]+$/;
      case "lettersAndNumbers":
        return /^[a-zA-Z0-9]+$/;
      default:
        return /./;
    }
  };

  return {
    debounceTime,
    HandleFileExcel,
    formatDateHourOrMinutes,
    generateSeriesNumbers,
    pagination,
    validateOrReplaceWithRegex,
    generateColorRandom
  };
}
