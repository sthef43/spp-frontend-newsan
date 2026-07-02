import { unwrapResult } from "@reduxjs/toolkit";
import { ReparacionSpSliceRequests } from "app/Middleware/reducers/reparacionSPSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILinea } from "app/models";
import { IReparacionesGroupDefectoDTO } from "app/models/IReparacionesGroupDefectoDTO";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";

interface props {
  lineaId: number;
  lineas: ILinea[];
  fecha: any;
  turno: string;
}

export const ReparacionesTable = ({ lineaId, lineas, fecha, turno }: props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [reparacionesDTOTable, setReparacionesDTOtable] = useState<IReparacionesGroupDefectoDTO[]>(null);

  const getReparaciones = async (codigoInicio: number) => {
    const result = unwrapResult(
      await dispatch(
        ReparacionSpSliceRequests.GetCantReparacionesByFechaAndLineaHora({
          horaDesde: turno == "M" ? "06:00:00" : turno == "T" ? "15:00:00" : "00:00:00",
          horaHasta: turno == "M" ? "15:00:00" : turno == "T" ? "23:59:59" : "05:59:59",
          fecha: moment(fecha).format("YYYY-MM-DD"),
          codigoError2: codigoInicio.toString()
        })
      )
    );

    if (result) {
      setReparacionesDTOtable(result);
    } else setReparacionesDTOtable(null);
  };

  useEffect(() => {
    getData();
  }, [lineaId]);

  const getData = () => {
    if (lineaId != 0 && lineas != null && lineas.length > 0) {
      const linea = lineas.find((x) => x.idLinea == lineaId);
      if (linea == null || linea == undefined) {
        openNotificationUI("No existe la linea ", "error");
      }
      if (linea.codigoInicio == null) {
        openNotificationUI("La linea no contiene codigoInicio", "error");
      }
      getReparaciones(parseInt(linea.codigoInicio));
    }
  };

  useEffect(() => {
    getData();
  }, [fecha]);

  useEffect(() => {
    getData();
  }, [turno]);

  return (
    <div>
      <div className="w-full flex justify-center">
        <TitleUIComponent title={"Reparaciones"} classNameDiv="w-full whitespace-wrap mx-0" />
      </div>
      <div>
        <TableComponent
          Dense={true}
          IDcolumn={"idDefecto"}
          columns={[
            {
              title: "Descripcion",
              field: "descripcion"
            },
            {
              title: "Cantidad",
              field: "repeticiones"
            }
          ]}
          dataInfo={reparacionesDTOTable}
        />
      </div>
    </div>
  );
};
