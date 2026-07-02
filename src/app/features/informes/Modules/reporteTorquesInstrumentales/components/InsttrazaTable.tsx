import React from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { IInsttraza } from "app/models/IInsttraza";
import moment from "moment";

interface props {
  insttraza: IInsttraza[];
  refresh?: () => void;
}

export const InsttrazaPorDiaTable = ({ insttraza, refresh }: props): JSX.Element => {
  return (
    <div>
      <TableComponent
        IDcolumn={"id"}
        columns={[
          {
            title: "Sector",
            field: "instlimite.instpuesto.sector"
          },
          {
            title: "Descripción",
            field: "instlimite.instpuesto.descripcion"
          },
          {
            title: "Puesto",
            field: "instlimite.instpuesto.codigoPuesto"
          },
          {
            title: "Color",
            field: "instlimite.color"
          },
          {
            title: "V1",
            field: "verificacion1"
          },
          {
            title: "V2",
            field: "verificacion2"
          },
          {
            title: "V3",
            field: "verificacion3"
          },
          {
            title: "V4",
            field: "verificacion4"
          },
          {
            title: "Observaciones",
            field: "observaciones"
          },
          {
            title: "Fecha",
            field: "",
            render: (row) => moment(row.fecha).format("L")
          },
          {
            title: "Hora",
            field: "hora"
          }
        ]}
        dataInfo={insttraza}
        buscar
        Dense
        filterWithSpecificValues={"Estado"}
      />
    </div>
  );
};
