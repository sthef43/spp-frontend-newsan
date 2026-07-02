import { TableComponent } from "app/shared/components/Table/TableComponent";
import React from "react";

interface ModalRechazoGrupalProps {
  rechazoMultiple: any[];
}

const ModalRechazoGrupal = ({ rechazoMultiple }: ModalRechazoGrupalProps) => {
  console.log(rechazoMultiple);
  return (
    <TableComponent
      IDcolumn="id"
      excel
      columns={[
        {
          title: "Componente",
          field: "componente"
        },
        {
          title: "SubComponente",
          field: "subComponente"
        },
        {
          title: "Defecto",
          field: "defecto"
        }
      ]}
      buscar
      dataInfo={rechazoMultiple}
    />
  );
};

export default ModalRechazoGrupal;
