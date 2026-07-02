import { IInicioHistory } from "app/models/IInicioHistory";
import moment from "moment";
import React from "react";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
interface Props {
  dataHistory: IInicioHistory[];
  codigoSerie: string;
}
export const InicioHistoryTable = ({ dataHistory, codigoSerie }: Props) => {
  return (
    <div>
      {dataHistory.length == 0 && codigoSerie.length > 1 && (
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew flex justify-center">
          <TitleUIComponent title="No hay historial" classNameDiv="w-min whitespace-nowrap" classNameTitle="text-2xl" />
        </div>
      )}
      {dataHistory.length > 0 && (
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div className="flex flex-col flex-wrap items-center">
            <TitleUIComponent
              title="Historial de cambios"
              classNameDiv="w-min whitespace-nowrap"
              classNameTitle="text-2xl"
            />
            <TableComponent
              IDcolumn="id"
              columns={[
                {
                  title: "Codigo newsan",
                  field: "codigoNewsan"
                },
                {
                  title: "Trazabilidad original",
                  field: "codigoTrazabilidadOriginal"
                },
                {
                  title: "Trazabilidad nuevo",
                  field: "codigoTrazabilidad"
                },
                {
                  title: "Fecha",
                  field: "",
                  render: (row) => {
                    return moment(row.fecha).format("L") + " " + moment(row.fecha).format("LTS");
                  }
                }
              ]}
              dataInfo={dataHistory}
            />
          </div>
        </div>
      )}
    </div>
  );
};
