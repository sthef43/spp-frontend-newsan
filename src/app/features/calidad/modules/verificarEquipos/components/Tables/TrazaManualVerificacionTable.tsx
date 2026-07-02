import { ITrazaManual } from "app/models/ITrazaManual";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
interface Props {
  data: ITrazaManual[];
}
export const TrazaManualVerificacionTable = ({ data }: Props) => {
  const [dataTable, setDataTable] = useState(null);
  useEffect(() => {
    setDataTable(data);
  }, [data]);

  return (
    <div>
      <TableComponent
        columns={[
          { title: "Trazabilidad", field: "trazabilidad" },
          { title: "Traza manual", field: "trazaManual1" },
          { title: "Código newsan", field: "codigoNewsan" },
          { title: "Turno", field: "turno" },
          {
            title: "Fecha",
            field: "",
            render: (row) => {
              return moment(row.createdDate).format("DD/MM/YYYY hh:mm:ss");
            }
          }
        ]}
        dataInfo={data}
        buscar
        IDcolumn="id"
      />
    </div>
  );
};
