import { Check, Clear } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { IcajaElectricaLG } from "app/models/IcajaElectricaLG";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
interface Props {
  data: IcajaElectricaLG[];
}
export const TestingLGVerificacionTable = ({ data }: Props) => {
  const [dataTable, setDataTable] = useState(null);
  useEffect(() => {
    setDataTable(data);
  }, [data]);

  return (
    <div>
      <TableComponent
        columns={[
          { title: "Trazabilidad de caja", field: "serial" },
          { title: "Trazabilidad", field: "trazabilidad" },
          {
            title: "Fecha",
            field: "",
            render: (row) => {
              return moment(row.cdate).format("DD/MM/YYYY hh:mm:ss");
            }
          },
          {
            title: "Estado",
            field: "",
            render: (row) => {
              return row.state ? (
                <IconButton disabled>
                  <Check color="success" />
                </IconButton>
              ) : (
                <IconButton disabled>
                  <Clear color="error" />
                </IconButton>
              );
            }
          },
          {
            title: "Fecha de ingreso",
            field: "",
            render: (row) => {
              return moment(row.cdate).format("DD/MM/YYYY");
            }
          },
          {
            title: "Hora de ingreso",
            field: "",
            render: (row) => {
              return moment(row.cdate).format("hh:mm:ss");
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
