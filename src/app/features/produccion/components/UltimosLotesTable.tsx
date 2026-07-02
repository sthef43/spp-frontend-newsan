import React from "react";

import { IPlanProd } from "app/models/IPlanProd";
import { TableComponent } from "../../../shared/components/Table/TableComponent";

interface props {
  ultimosLotes: IPlanProd[];
}

export const UltimosLotesTable = ({ ultimosLotes }: props): JSX.Element => {
  return (
    <div>
      <TableComponent
        IDcolumn={"idProduccion"}
        columns={[
          {
            title: "Lote",
            field: "lote"
          },
          {
            title: "Desde",
            field: "desde"
          },
          {
            title: "Hasta",
            field: "hasta"
          },
          {
            title: "Número de OP",
            field: "numeroOp"
          },
          {
            title: "Prefijo",
            field: "ultimoNewsan"
          }
        ]}
        dataInfo={ultimosLotes}
        //Collapse={true}
        //buscar={true}
        Dense={true}
      />
    </div>
  );
};
