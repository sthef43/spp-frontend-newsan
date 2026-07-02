import React, { useEffect, useState } from "react";

import { TableComponent } from "../../../shared/components/Table/TableComponent";
import moment from "moment";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobImpresionesPlanosSliceRequests } from "app/Middleware/reducers/DobImpresionesPlanosSlice";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface props {
  dobPlanoId: number;
}
// export const ImpresionPlanosFormDocument = ({ setOpenPopup, fila, impresion, refresh }: props): JSX.Element => {
export const VerImpresionesPlanosForm = ({ dobPlanoId }: props): JSX.Element => {
  //EL USUARIO QUE SE LOGUEA TRAE EL ROL ***************** Y ADEMÁS ES EL ULTIMO QUE CAMBIO EL PLANO
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [impresionesPlanos, setImpresionesPlanos] = useState([]);

  // getImpresionesPlanos();
  const getImpresionesPlanos = async () => {
    try {
      const result = unwrapResult(await dispatch(DobImpresionesPlanosSliceRequests.getByDobPlano(dobPlanoId)));
      setImpresionesPlanos(result);
    } catch (error) {
      openNotificationUI("Error al leer Impresiones de Planos.", "error");
    }
  };

  useEffect(() => {
    getImpresionesPlanos();
  }, [dobPlanoId]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <div className="my-2 mx-4 h-full">
        {impresionesPlanos && (
          <TableComponent
            Dense={true}
            buscar={true}
            IDcolumn={"id"}
            columns={[
              {
                title: "Id",
                field: "id"
              },
              {
                title: "Usuario",
                field: "",
                render: (row) => {
                  return row.appUser.operator.surname + " " + row.appUser.operator.name;
                }
              },
              {
                title: "Fecha Hora Impresión",
                field: "",
                render: (row) => {
                  return moment(row.lastModifiedDate).format("YYYY-MM-DD HH:mm");
                }
              },
              {
                title: "Fecha Hora Modificación",
                field: "",
                render: (row) => {
                  return moment(row.lastModifiedDate).format("YYYY-MM-DD HH:mm");
                }
              },
              {
                title: "Estado",
                field: "estado"
              }
            ]}
            dataInfo={impresionesPlanos}
          />
        )}
      </div>
    </div>
  );
};
