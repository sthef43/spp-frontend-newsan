import { unwrapResult } from "@reduxjs/toolkit";
import { ReparacionSpSliceRequests } from "app/Middleware/reducers/reparacionSPSlice";
import { useAppDispatch } from "app/core/store/store";
import { IInicio } from "app/models";
import moment from "moment";
import React, { useEffect, useState } from "react";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { ReparadoresSliceRequests } from "app/Middleware/reducers/ReparadoresSlice";

interface props {
  registroInicio: IInicio;
}

export const ReparacionesTable = ({ registroInicio }: props) => {
  const dispatch = useAppDispatch();
  const [listReparaciones, setListReparaciones] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getReparaciones = async () => {
    let reparacionesResult = [];
    try {
      reparacionesResult = unwrapResult(
        await dispatch(
          ReparacionSpSliceRequests.getListByCodigoTrazabilidad({
            codigoTrazabilidad: registroInicio.codigoTrazabilidad
          })
        )
      );
    } catch (error) {
      throw new Error(error);
    }
    if (reparacionesResult) {
      return reparacionesResult;
    } else return null;
  };

  const getData = async () => {
    const reparaciones = await getReparaciones();

    if (!reparaciones) return false;
    //Traigo los reparadores por cada reparacion
    let reparador;
    const newArray = [];
    for (let index = 0; index < reparaciones.length; index++) {
      const element = reparaciones[index];
      if (element.reparadorId != null) {
        reparador = await getReparadorById(element.reparadorId);
        if (reparador != null) {
          newArray.push({ ...element, reparador: reparador.reparador });
        } else {
          newArray.push({ ...element, reparador: "" });
        }
      } else newArray.push({ ...element, reparador: "" });
    }
    setListReparaciones(newArray);
  };

  const getReparadorById = async (id: number) => {
    const result = unwrapResult(await dispatch(ReparadoresSliceRequests.getByIdRequest(id)));
    if (result) return result;
    else return null;
  };

  return (
    <div>
      <div className="w-full flex justify-center ">
        <TitleUIComponent title={"Reparaciones"} classNameDiv="w-full whitespace-wrap mx-0" />
      </div>
      <TableComponent
        Dense={false}
        Overflow={false}
        IDcolumn={"idReparacion"}
        columns={[
          {
            title: "Fecha",
            field: "",
            render: (row) => {
              return moment(row.fecha).format("L");
            }
          },
          {
            title: "Turno",
            field: "turno"
          },
          {
            title: "Tipo Defecto",
            field: "tipoDefecto"
          },
          {
            title: "Defecto",
            field: "defecto.descripcion"
          },
          {
            title: "Causa",
            field: "causas.descripcion"
          },
          {
            title: "Hora",
            field: "hora"
          },
          {
            title: "Reparador",
            field: "reparador"
          }
        ]}
        dataInfo={listReparaciones}
      />
    </div>
  );
};
