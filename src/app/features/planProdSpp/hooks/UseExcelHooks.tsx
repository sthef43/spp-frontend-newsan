/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { StatesFormModalsSlice } from "../reducers/StatesForModalsSlice";
import { IDataExcelFormat } from "../models/IDataExcelFormat";

export function UseExcelHooks() {
  const lineaProduccion = useAppSelector((state) => state.lineaProduccion);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

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

  const HandleFileExcel = (e: React.ChangeEvent<HTMLInputElement>, mesFiltro: string, mesFinFiltro: string) => {
    console.log(mesFiltro, mesFinFiltro);
    const file = e.target.files && e.target.files[0];
    if (file) {
      onFileUploadExcel(file, mesFiltro, mesFinFiltro);
    }
    e.target.value = "";
  };

  const onFileUploadExcel = (file: File, mesFiltro: string, mesFinFiltro: string) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetname];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      jsonData.shift();
      const dataFormateada = formatDataExcel(jsonData, mesFiltro, mesFinFiltro);
      console.log(dataFormateada);
      dispatch(StatesFormModalsSlice.actions.setDataFormatExcel(dataFormateada));
    };
    reader.readAsArrayBuffer(file);
    openNotificationUI("Se importo el excel con exito", "success");
  };

  const formatDataExcel = (stringDataExcel: any[], mesFiltro: string, mesFinFiltro: string): IDataExcelFormat[] => {
    const lineaPiso = tipoLinea();
    const mesess: string[] = filtrarMeses(mesFiltro, mesFinFiltro);
    const date = new Date();
    const currentYear = date.getFullYear();
    const dataFiltrada = stringDataExcel.filter((elementos: any) => elementos && elementos.length > 10);
    const excelFormat = dataFiltrada
      .filter((row: any) => {
        const estaEnRangoMes = mesess.some((mes) => mes.includes(row[7]));
        const esAnioActual = row[6] !== null && Number(row[6]) === currentYear;
        const esLineaPiso = row[3] != null && String(row[3]) === lineaPiso;
        const esCodigoValido = row[1] != null && String(row[1]).trim() !== "";
        return esCodigoValido && row[7] != null && estaEnRangoMes && esAnioActual && esLineaPiso;
      })
      .map(
        (row: any): IDataExcelFormat => ({
          codigoModelo: String(row[1]).substring(2, 999),
          po: row[2],
          tipoLinea: row[3],
          frigorias: row[4],
          codigoModelo2: row[5],
          anio: row[6],
          mes: row[7].toLowerCase(),
          comentarios: row[9],
          cantidad: row[10],
          calculo1: row[11],
          ritmo: row[12],
          aux: row[12]
        })
      );
    const arrayWithDataExcel: IDataExcelFormat[] = [];
    excelFormat.forEach((elementos) => {
      if (elementos.aux !== "RITMO") {
        arrayWithDataExcel.push(elementos);
      }
    });
    return arrayWithDataExcel;
  };

  const tipoLinea = () => {
    let pisoLinea = "";
    if (lineaProduccion.object.nombre.includes("PB")) {
      pisoLinea = "HR";
    } else if (lineaProduccion.object.nombre.includes("PA")) {
      pisoLinea = "LR";
    }
    return pisoLinea;
  };

  const generarMeses = (locale = "es-ES") => {
    const meses = [];
    const fechaBase = new Date(2025, 0, 1);
    for (let i = 0; i < 12; i++) {
      fechaBase.setMonth(i);
      const nombreMes = new Intl.DateTimeFormat(locale, { month: "long" }).format(fechaBase);
      meses.push(nombreMes.toUpperCase());
    }
    return meses;
  };

  const filtrarMeses = (mesInicio: string, mesFin: string) => {
    const meses = generarMeses();
    const mesesFiltrados: string[] = [];
    const indexMeses: number[] = [];

    let indexMesInicio = meses.findIndex((elementos) => mesInicio === elementos);
    const indexMesFin = meses.findIndex((elementos) => mesFin === elementos);

    indexMeses.push(indexMesInicio);
    meses.forEach((elementos, index) => {
      if (indexMesInicio === index) {
        if (indexMesInicio !== indexMesFin + 1) {
          mesesFiltrados.push(elementos);
          indexMesInicio += 1;
        }
      }
    });
    return mesesFiltrados;
  };

  return { debounceTime, HandleFileExcel, filtrarMeses };
}
