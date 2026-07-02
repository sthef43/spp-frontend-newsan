import { Stock_CLISliceRequests } from "app/Middleware/reducers/Stock_CLISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { IStock_CLI } from "app/models/IStock_CLI";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ICLIUbicaciones } from "app/features/cli/Models/ICLIUbicaciones";

interface props {
  setOpenPopup: any;
  editState?: ICLIUbicaciones | null;
}

export const CLIStock_PlantaForm = ({ setOpenPopup, editState }: props) => {
  console.log(editState);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  //Leer listas
  useEffect(() => {
    if (editState) {
      getStock_CLI();
    }
  }, [editState]);

  //Leer
  const [stock_CLI, setCtock_CLI] = useState<IStock_CLI[] | null>(null);
  const getStock_CLI = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      // const valor = "F2.02.02";
      const responses = unwrapResult(await dispatch(Stock_CLISliceRequests.getByLocalizador(editState.localizador)));
      // const responses = unwrapResult(await dispatch(Stock_CLISliceRequests.getByLocalizador(valor)));
      setCtock_CLI(responses);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      openNotificationUI("Error al leer ubicaciones.", "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        buscar={true}
        IDcolumn={"id"}
        excel
        columns={[
          {
            title: "Organización",
            field: "organizacion"
          },
          {
            title: "LPN_ETIQUETA",
            field: "lpN_ETIQUETA"
          },
          {
            title: "parenT_LPN_ID",
            field: "parenT_LPN_ID"
          },
          {
            title: "LPN_PALLET",
            field: "lpN_PALLET"
          },
          {
            title: "Subinventario",
            field: "subinventario"
          },
          {
            title: "Localizador",
            field: "localizador"
          },
          {
            title: "Cantidad",
            field: "cantidad"
          },
          {
            title: "COSTO_UNIT",
            field: "costO_UNIT"
          },
          {
            title: "COSTO_TOTAL",
            field: "costO_TOTAL"
          }
        ]}
        dataInfo={stock_CLI}
      />
    </div>
  );
};
