import { Check, Clear } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { IIDU1200ensayos } from "app/models/IIDU1200ensayos";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
interface Props {
  data: IIDU1200ensayos[];
}
export const TestingNwVerificacionTable = ({ data }: Props) => {
  const [dataTable, setDataTable] = useState(null);
  useEffect(() => {
    setDataTable(data);
  }, [data]);

  return (
    <div>
      <TableComponent
        columns={[
          { title: "Referencia", field: "referencia" },
          { title: "Area", field: "area" },
          { title: "Ensayo parte", field: "ensayoParte" },
          { title: "DCF", field: "dcf" },
          {
            title: "Fecha",
            field: "",
            render: (row) => {
              return moment(row.fecha).format("DD/MM/YYYY hh:mm:ss");
            }
          },
          {
            title: "Aprobado",
            field: "",
            render: (row) => {
              return row.aprobado ? (
                <IconButton>
                  <Check color="success" />
                </IconButton>
              ) : (
                <IconButton>
                  <Clear color="error" />
                </IconButton>
              );
            }
          },
          { title: "Observaciones", field: "observaciones" },
          { title: "Falla", field: "falla" },
          { title: "Paso", field: "paso" }
        ]}
        dataInfo={data}
        buscar
        IDcolumn="id"
      />
    </div>
  );
};
