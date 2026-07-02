import React from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { IInicio } from "app/models";
import moment from "moment";

interface props {
  inicio: IInicio[];
}

export const ProduccionDiaria = ({ inicio }: props): JSX.Element => {
  const createData = () => {
    const varData = [];
    inicio.map((ini: IInicio) => {
      const aux = {
        ...ini,
        fecha: moment(ini.fecha).format("DD-MM-YYYY")
      };
      varData.push(aux);
    });
    return varData;
  };

  React.useEffect(() => {
    createData();
  }, []);

  return (
    <div className="w-full">
      <TableComponent
        IDcolumn={"desde"}
        columns={[
          {
            title: "Fecha",
            field: "fecha"
          },
          {
            title: "Producidos",
            field: "producido"
          },
          {
            title: "Desde",
            field: "desde"
          },
          {
            title: "Hasta",
            field: "hasta"
          }
        ]}
        dataInfo={createData()}
        //Collapse={true}
        // rowStyle={(rowData) => {
        //   return rowData.cargando ?? { backgroundColor: "#2697F" };
        // }}
        // buscar={true}
        Dense={true}
      />
      <br />
    </div>
  );
};
