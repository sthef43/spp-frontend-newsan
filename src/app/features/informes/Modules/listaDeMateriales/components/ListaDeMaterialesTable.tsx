import { ISuperCargalinea } from "app/models";
import moment from "moment";
import React from "react";
import { TableComponent } from "app/shared/components/Table/TableComponent";

interface Props {
  data: ISuperCargalinea[];
}

export const ListaDeMaterialesTable = ({
  data,
}: Props): JSX.Element => {
  
  return (
    <div>
      <TableComponent
        excel
        IDcolumn="idSupercargalinea"
        buscar
        columns={[
          {
            title: "Código modelo",
            field: "codigoModelo"
          },
          {
            title: "Gaveta",
            field: "gaveta"
          },
          {
            title: "Cantidad",
            field: "cantidadMaterial"
          },
          {
            title: "Código de pautas",
            field: "codigoPautas"
          },
          {
            title: "Descripción",
            field: "descripcion"
          },
          {
            title: "Posicion",
            field: "descripSector"
          },
          {
            title: "Alternativo",
            field: "alternativo1"
          },
          {
            title: "Fecha",
            field: "",
            render: (row) => moment(row).format("L")
          },
          {
            title: "Usuario",
            field: "usuario"
          },
          {
            title: "Cantidad de material",
            field: "cantidadMaterial"
          },
        ]}
        dataInfo={data}
      />
    </div>
  );
};
