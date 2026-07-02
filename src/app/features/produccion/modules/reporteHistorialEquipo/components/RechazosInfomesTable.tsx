import { unwrapResult } from "@reduxjs/toolkit";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { useAppDispatch } from "app/core/store/store";
import { IInicio } from "app/models";
import moment from "moment";
import React, { useEffect, useState } from "react";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";

interface props {
  registroInicio: IInicio;
}

export const RechazosInformesTable = ({ registroInicio }: props) => {
  const dispatch = useAppDispatch();

  const [listRechazos, setListRechazos] = useState([]);

  useEffect(() => {
    //setDataOpen([registroInicio]);
    if (registroInicio) getRechazos();
  }, [registroInicio]);

  const getRechazos = async () => {
    let rechazosResult = [];
    try {
      rechazosResult = unwrapResult(
        await dispatch(RechazoSliceRequests.getAllRechazoByCodigo(registroInicio.codigoTrazabilidad))
      );
    } catch (error) {
      throw new Error(error);
    }
    if (rechazosResult) {
      setListRechazos(rechazosResult);
      console.log(rechazosResult);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-center ">
        <TitleUIComponent title={"Rechazos"} classNameDiv="w-full whitespace-wrap mx-0" />
      </div>
      <TableComponent
        Dense={false}
        Overflow={false}
        IDcolumn={"idRechazo"}
        columns={[
          {
            title: "Fecha",
            field: "",
            render: (row) => {
              return moment(row.fecha).format("L");
            }
          },
          {
            title: "Hora",
            field: "hora"
          },
          {
            title: "Estado",
            field: "estado"
          },
          {
            title: "Puesto",
            field: "codigoRechazos.descripcionRechazo"
          }
        ]}
        dataInfo={listRechazos}
      />
    </div>
  );
};
