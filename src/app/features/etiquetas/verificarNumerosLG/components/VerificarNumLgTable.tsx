import React from "react";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
interface Props {
  codigos: any;
}
export const VerificarNumLgTable = ({ codigos }: Props) => {
  const [dataTable, setDataTable] = React.useState([]);
  React.useEffect(() => {
    setDataTable(codigos);
  }, [codigos]);
  const verEstado = (estado: string) => {
    switch (estado) {
      case "1":
        return "El código no se encuentra en la base de datos";
      case "2":
        return "El código se encuentra en uso";
      case "3":
        return "El código se puede utilizar(:";
    }
  };

  return (
    <div className="animate__animated animate__fadeInUp mt-3">
      <TableComponent
        columns={[
          {
            title: "Trazabilidad",
            field: "codigo"
          },
          {
            title: "Estado",
            field: "estado",
            render: (row) => {
              return verEstado(row.estado);
            },
            lookup: {
              "1": "El código no se encuentra en la base de datos",
              "2": "El código se encuentra en uso",
              "3": "El código se puede utilizar(:"
            }
          }
        ]}
        rowStyle={(rowData) => {
          switch (rowData.estado) {
            case "1":
              return { padding: 1, backgroundColor: "#f44b4e", fontSize: 14 };
            case "2":
              return { padding: 1, backgroundColor: "#fdaf59", fontSize: 14 };
            case "3":
              return { padding: 1, backgroundColor: "#5dae3a", fontSize: 14 };
            default:
              return { padding: 1, fontSize: 14 };
          }
        }}
        IDcolumn="codigo"
        dataInfo={dataTable}
      />
    </div>
  );
};
