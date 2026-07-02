import { Check, Clear } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import { ILinea } from "app/models";
import React from "react";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { TableComponent } from "app/shared/components/Table/TableComponent";

export const ControlEBSTable = () => {
  const lineas: ILinea[] = useAppSelector<ILinea[]>((action) => action.linea.dataAll);

  return (
    <ContainerForPages optionsLayout="Table">
      <TableComponent
        columns={[
          {
            title: "Linea de produccion",
            field: "descripcion"
          },
          {
            title: "Graba en EBS?",
            field: "",
            render: (row) => {
              return row.relacionaEbs == "S" ? (
                <IconButton disabled>
                  <Check color="success" />
                </IconButton>
              ) : (
                <IconButton disabled>
                  <Clear color="error" />
                </IconButton>
              );
            }
          }
        ]}
        IDcolumn="idLinea"
        dataInfo={lineas}
      />
    </ContainerForPages>
  );
};
