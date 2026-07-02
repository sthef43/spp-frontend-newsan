import React, { useEffect } from "react";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
import { useAppSelector } from "app/core/store/store";
import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import { IControlLote } from "app/models";

export const InformeReprocesoTable = (): JSX.Element => {
  const reprocesos = useAppSelector((state) => state.reprocesoLinea.dataAll as IReprocesoLinea[]);
  const { openNotificationUI } = useNotificationUI();

  useEffect(() => {
    reprocesos?.length == 0 && openNotificationUI("No hay datos para esas fechas", "warning");
  }, [reprocesos]);

  return (
    <div>
      <TableComponent
        IDcolumn="idReprocesoLinea"
        columns={[
          {
            title: "Número newsan",
            field: "codigoNewsan"
          },
          {
            title: "Modelo",
            field: "controlLote.codigoModelo"
          },
          {
            title: "Supervisor",
            field: "nombreUsuario"
          },
          {
            title: "Número OP",
            field: "controlLote.numeroOp"
          },
          {
            title: "Turno",
            field: "controlLote.turno"
          },
          {
            title: "Fecha",
            field: "fecha",
            render: (row: IControlLote) => moment(row.fecha).format("L")
          }
        ]}
        dataInfo={reprocesos}
        buscar
        excel
      />
    </div>
  );
};
