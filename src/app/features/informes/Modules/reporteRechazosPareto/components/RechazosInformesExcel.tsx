import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { unwrapResult } from "@reduxjs/toolkit";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { useAppDispatch } from "app/core/store/store";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

interface props {
  editState?: any | null;
  lineaDescrip?: any | null;
}
export const RechazosInformesExcel = ({ editState, lineaDescrip }: props) => {
  const dispatch = useAppDispatch();
  const [kpi, setKpi] = useState(null);
  const excelExportRef = useRef(null);

  const getKpi = async () => {
    try {
      const result = unwrapResult(await dispatch(RechazoSliceRequests.getKPI(editState)));
      const tiposDeRechazo = [...new Set(result.map((xa) => xa.descripcionRechazo))];
      const parcial = result.map((xa) => {
        const obj = {
          Fecha: xa.fecha,
          Semana: dayjs(xa.fecha).week(),
          Turno: editState.turno,
          Línea: lineaDescrip
        };
        tiposDeRechazo.forEach((tipo) => {
          obj[tipo] = 0;
        });
        obj[xa.descripcionRechazo] = xa.total;
        return obj;
      });
      const resultado = await parcial.sort((a, b) => (a.Fecha > b.Fecha ? 1 : -1));
      const nuevoResultado = resultado.map((xa) => {
        return {
          ...xa,
          Fecha: dayjs(xa.Fecha).format("L")
        };
      });
      setKpi(nuevoResultado);
      if (excelExportRef.current) {
        excelExportRef.current.save();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editState) {
      getKpi();
    }
  }, [editState]);

  return (
    <>
      {kpi && (
        <ExcelExport data={kpi} ref={excelExportRef} fileName="KPI.xlsx">
          {Object.keys(kpi[0]).map((key) => (
            <ExcelExportColumn key={key} field={key} title={key} />
          ))}
        </ExcelExport>
      )}
    </>
  );
};
