import { IInicio } from "app/models";
import moment from "moment";
import React, { useEffect, useState } from "react";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";

interface props {
  registroInicio: IInicio;
}

export const InicializacionTable = ({ registroInicio }: props) => {
  useEffect(() => {
    setDataOpen([registroInicio]);
  }, [registroInicio]);

  const [dataOpen, setDataOpen] = useState([]);

  return (
    <div>
      <div className="w-full flex justify-center ">
        <TitleUIComponent title={"Datos de Inicializacion"} classNameDiv="w-full whitespace-wrap mx-0" />
      </div>
      <TableComponent
        Dense={false}
        Overflow={false}
        IDcolumn={"idInicio"}
        columns={[
          {
            title: "Codigo Newsan",
            field: "codigoNewsan"
          },
          {
            title: "Fecha",
            field: "",
            render: (row) => {
              return moment(row.fecha).format("L");
            }
          },
          {
            title: "Turno",
            field: "turno"
          },
          {
            title: "Hora",
            field: "hora"
          },
          {
            title: "Nombre Operador",
            field: "nombreInicio"
          }
        ]}
        dataInfo={dataOpen}
      />
    </div>
  );
};
