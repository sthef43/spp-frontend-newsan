import React, { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { ContPedidoSliceRequests } from "app/Middleware/reducers/ContPedidoSlice";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import moment from "moment";

interface IHistorialContenedorForm {
  setOpenPopup: any;
  stateHistorial: number;
}

export const HistorialContenedorForm = ({ setOpenPopup, stateHistorial }: IHistorialContenedorForm): JSX.Element => {
  // const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [historial, setHistorial] = useState([]);
  const getHistorial = async () => {
    if (stateHistorial) {
      try {
        const result = unwrapResult(
          await dispatch(ContPedidoSliceRequests.getListByContContenedorIdRequest(stateHistorial))
        );
        setHistorial(result);
      } catch (error) {
        openNotificationUI("Error al leer...", "error");
      }
    }
  };
  useEffect(() => {
    console.log(historial);
  }, [historial]);

  useEffect(() => {
    getHistorial();
  }, [stateHistorial]);

  return (
    <div>
      {historial && (
        <TableComponent
          Dense={true}
          // buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Id",
              field: "id"
            },
            {
              title: "Id Contenedor",
              field: "contContenedorId"
            },
            {
              title: "Detalle de Planta",
              field: "contPlantaDetalle.detalle"
            },
            {
              title: "Detalle de Contenedor",
              field: "contDetalleContenedor.detalle"
            },
            {
              title: "Estado",
              field: "contEstado.detalle"
            },
            {
              title: "Ubicación",
              field: "contUbicacion.detalle"
            },
            {
              title: "Observación",
              field: "contObservacion.observacion"
            },
            {
              title: "Programado",
              field: "",
              render: (row) => {
                return moment(row.fechaProgramado).format("L");
              }
            },
            {
              title: "Entregado",
              field: "",
              render: (row) => {
                return moment(row.fechaEntregado).format("L");
              }
            },
            {
              title: "Creación",
              field: "",
              render: (row) => {
                return moment(row.createdDate).format("L");
              }
            },
            {
              title: "Modificación",
              field: "",
              render: (row) => {
                return moment(row.lastModifiedDate).format("L");
              }
            }
          ]}
          dataInfo={historial}
        />
      )}
    </div>
  );
};
