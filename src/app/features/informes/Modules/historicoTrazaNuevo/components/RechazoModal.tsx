import { IRechazo } from "app/models/IRechazo";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import classNames from "classnames";
import moment from "moment";
import React from "react";
interface props {
  callbackFunction: any;
  setpopup: any;
  rechazo: IRechazo[];
}
export const RechazoModal = ({ callbackFunction, setpopup, rechazo }: props) => {
  return (
    <div>
      <TableComponent
        Dense={true}
        Overflow={false}
        buscar={true}
        IDcolumn={"idRechazo"}
        columns={[
          {
            title: "Codigo ",
            field: "barcode"
          },
          {
            title: "Puesto",
            field: "puesto"
          },
          {
            title: "Linea",
            field: "linea"
          },
          {
            title: "Estado",
            field: "estado"
          },
          {
            title: "Rechazo",
            field: "codigoRechazos.descripcionRechazo"
          },
          {
            title: "Fecha",
            field: "fecha",
            render: (row) => {
              return (
                <div className={classNames("w-full grid grid-cols-3 sm:grid-cols-2 gap-4", "py-0")}>
                  <div className="sm:hidden font-bold">Fecha:</div>
                  <div className={classNames("col-span-2 text-right  sm:text-left", "text-xs")}>
                    {moment(row.fecha).format("DD-MM-YYYY")}
                  </div>
                </div>
              );
            }
          },
          {
            title: "Hora",
            field: "hora"
          }
        ]}
        dataInfo={rechazo}
      />
    </div>
  );
};
