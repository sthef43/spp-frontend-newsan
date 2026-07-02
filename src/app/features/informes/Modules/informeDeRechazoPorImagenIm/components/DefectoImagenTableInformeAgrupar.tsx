import { useAppSelector } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useEffect, useState } from "react";

export const DefectoImagenTableInformeAgrupar = (): JSX.Element => {
  const rechazosMain = useAppSelector((state) => state.rechazoMain.dataAll);

  const [filtrado, setfiltrado] = useState(null);
  const rechazosMainFiltrado = () => {
    const groupedData = rechazosMain.reduce((acc, item) => {
      const key = `${item.idCausa}-${item.idDefecto}`;
      if (!acc[key]) {
        acc[key] = { ...item, cantidad: 0 };
      }
      acc[key].cantidad += 1;
      return acc;
    }, {});
    const result = Object.values(groupedData);
    setfiltrado(result);
  };

  useEffect(() => {
    rechazosMainFiltrado();
  }, [rechazosMain]);

  return (
    <div>
      <TableComponent
        IDcolumn="idRechazoMain"
        excel
        columns={[
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
            title: "Cantidad",
            field: "cantidad"
          }
        ]}
        buscar
        dataInfo={filtrado}
      />
    </div>
  );
};
