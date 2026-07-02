import { unwrapResult } from "@reduxjs/toolkit";
import { ContContenedorSliceRequests } from "app/Middleware/reducers/ContContenedorSlice";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";

export const PedidosFin = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  //Leer datos de ContPedido cuando cambia FechaSelect
  const [pedidos, setPedidos] = useState(null);
  const getContenedoresHasta = async () => {
    if (fechaSelect) {
      try {
        const result = unwrapResult(
          await dispatch(ContContenedorSliceRequests.GetListByPlanProduccionAbiertoRequest(fechaSelect))
        );
        const objectSubmit = result.map((elem) => {
          return {
            ...elem,
            fechaProgramado: moment(elem.fechaProgramado).format("L"),
            fechaEntregado: moment(elem.fechaEntregado).format("L")
          };
        });
        setPedidos(objectSubmit);
      } catch (error) {
        openNotificationUI("Error al leer.", "error");
      }
    }
  };

  //Fecha
  const [fechaSelect, setfechaSelect] = useState(null);
  const onChangeFecha = (fecha: string) => {
    setfechaSelect(moment(fecha).format("YYYY-MM-DD"));
  };
  useEffect(() => {
    getContenedoresHasta();
  }, [fechaSelect]);

  useEffect(() => {
    //Establece la fecha del día
    TitleChanger("Contenedor con Pedido Finalizado x Mes");
    const today = new Date();
    setfechaSelect(moment(today).format("YYYY-MM-DD"));
  }, []);

  return (
    <div>
      <div className=" flex-col grid grid-cols-3 gap-30 " style={{ height: "100%" }}>
        <SelectOfDate pickFecha setFechaProps={onChangeFecha} />
      </div>
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        {pedidos && (
          <div className="my-2 mx-4 h-full">
            <TableComponent
              Dense={true}
              // Overflow={true}
              buscar={true}
              IDcolumn={"id"}
              excel={true}
              columns={[
                {
                  title: "Id",
                  field: "id"
                },
                {
                  title: "Contenedor",
                  field: "lpn"
                },
                {
                  title: "Estado",
                  field: "contEstado.detalle"
                },
                {
                  title: "Programado",
                  field: "fechaProgramado"
                },
                {
                  title: "Entregado",
                  field: "fechaEntregado"
                },
                {
                  title: "Embarque",
                  field: "contEmbarque.detalle"
                },
                {
                  title: "N° Embarque",
                  field: "contEmbarque.numero"
                },
                {
                  title: "Línea",
                  field: "contEmbarque.contPlanProduccion.linea"
                },
                {
                  title: "Modelo",
                  field: "contEmbarque.contPlanProduccion.modelo"
                },
                {
                  title: "Lote",
                  field: "contEmbarque.contPlanProduccion.lote"
                },
                {
                  title: "Cantidad",
                  field: "contEmbarque.contPlanProduccion.cantidad"
                },
                {
                  title: "PO",
                  field: "contEmbarque.contPlanProduccion.po"
                },
                {
                  title: "Planta",
                  field: "contEmbarque.contPlanProduccion.contPlanta.nombre"
                }
              ]}
              dataInfo={pedidos}
            />
          </div>
        )}
      </div>
    </div>
  );
};
