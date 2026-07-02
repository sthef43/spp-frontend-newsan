import React from "react";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ReporteSGIModel } from "../models/ReporteSGIModel";

type ReporteSGITableProps = {
  reporte: ReporteSGIModel[];
};

const ReporteSGITable = ({ reporte }: ReporteSGITableProps): JSX.Element => {
  return (
    <TableComponent
      IDcolumn="id"
      columns={[
        {
          title: "Dia",
          field: "dia"
        },
        {
          title: "Mes",
          field: "mes"
        },
        {
          title: "Año",
          field: "año"
        },
        {
          title: "Linea",
          field: "linea"
        },
        {
          title: "Planta",
          field: "planta"
        },
        {
          title: "Modelo",
          field: "modelo"
        },
        {
          title: "Producido",
          field: "producido"
        },
        {
          title: "Problema FPY",
          field: "problemaFPY"
        }
      ]}
      buscar
      dataInfo={reporte}
    />
  );
};

export default ReporteSGITable;
