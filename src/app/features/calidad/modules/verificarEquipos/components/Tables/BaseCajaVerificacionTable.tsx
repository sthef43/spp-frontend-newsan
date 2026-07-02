import { IMainReg } from "app/models/IMainReg";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
interface Props {
  data: IMainReg[];
}
export const BaseCajaVerificacionTable = ({ data }: Props) => {
  const [dataTable, setDataTable] = useState(null);
  useEffect(() => {
    setDataTable(data);
  }, [data]);

  return (
    <div>
      <TableComponent
        columns={[
          { title: "Trazabilidad de Caja", field: "trazaCaja" },
          { title: "Evaporador", field: "trazaEva" },
          { title: "Trazabilidad", field: "inicio.codigoTrazabilidad" },
          { title: "Fecha", field: "fecha" },
          { title: "Hora", field: "hora" }
        ]}
        dataInfo={data}
        buscar
        IDcolumn="idRegistro"
      />
    </div>
  );
};
