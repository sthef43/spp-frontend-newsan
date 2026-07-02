import { Typography } from "@mui/material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import React from "react";
interface props {
  arrayListDotaHistorico: any;
}

export const DotaHistoricoList = ({ arrayListDotaHistorico }: props) => {
  return (
    <div className="w-full">
      {arrayListDotaHistorico &&
        arrayListDotaHistorico.length > 0 &&
        arrayListDotaHistorico.map((x) => (
          <div className="flex p-4" key={x}>
            <div
              className="w-1/4"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center"
              }}>
              <Typography>{arrayListDotaHistorico[0] == x ? "VIGENTE" : "HISTORICO"}</Typography>
              <Typography>{moment(x[0].createdDate).format("L")}</Typography>
            </div>
            <TableComponent
              Dense={true}
              Overflow={false}
              buscar={false}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Sector",
                  field: "sector"
                },
                {
                  title: "puesto",
                  field: "puesto"
                },
                {
                  title: "Cantidad",
                  field: "cantidad"
                },
                {
                  title: "Numeracion",
                  field: "numeracion"
                },
                {
                  title: "Activo",
                  field: "",
                  render: (row: any) => (row.activo == true ? "SI" : "NO")
                }
              ]}
              dataInfo={x}
            />
          </div>
        ))}
    </div>
  );
};
