import { useAppSelector } from "app/core/store/store";
import { IRechazoMain } from "app/models/IRechazoMain";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import React from "react";

export const DefectoImagenTableInforme = (): JSX.Element => {
  const rechazosMain = useAppSelector((state) => state.rechazoMain.dataAll);
  const getNumImagen = (row: IRechazoMain): string => {
    return row.defecto.defectoImagen.find((dfI) => dfI.generico.trim() == row.generico.trim())?.numImagen;
  };

  return (
    <div>
      <TableComponent
        IDcolumn="idRechazoMain"
        excel
        columns={[
          {
            title: "Codigo",
            field: "",
            render: (row: IRechazoMain) => <>{row.codigoMain}</>
          },
          {
            title: "Familia",
            field: "",
            render: (row: IRechazoMain) => <>{row.generico}</>
          },
          {
            title: "Causa",
            field: "causas.descripcion"
          },
          {
            title: "Defecto",
            field: "defecto.descripcion"
          },
          {
            title: "Código defecto",
            field: "codigoRechazos.descripcionRechazo"
          },
          {
            title: "Número imagen",
            field: "",
            render: (row) => <>{getNumImagen(row)}</>
          },
          {
            title: "Fecha",
            field: "",
            render: (row: IRechazoMain) => <>{moment(row.fecha).format("L")}</>
          },
          {
            title: "Hora",
            field: "hora"
          }
        ]}
        buscar
        dataInfo={rechazosMain}
      />
    </div>
  );
};
