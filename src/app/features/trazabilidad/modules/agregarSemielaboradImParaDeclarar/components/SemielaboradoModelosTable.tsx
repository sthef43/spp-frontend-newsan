import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { SemielaboradoModelosSliceRequests } from "app/Middleware/reducers/SemielaboradoModelosSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ISemielaboradoModelos } from "app/models/ISemielaboradoModelos";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
interface Props {
  refresh: () => void;
}
export const SemielaboradoModelosTable = ({ refresh }: Props) => {
  const semielaboradosModelos = useAppSelector((state) => state.semielaboradoModelos.dataAll);
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const onDelete = async (row: ISemielaboradoModelos) => {
    try {
      if (await getConfirmation("Esta seguro de eliminar?", "Esta por eliminar un modelo del semielaborado")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(SemielaboradoModelosSliceRequests.deleteRequest(row.id)));
        openNotificationUI("Se elimino correctamente", "success");
        refresh();
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };
  return (
    <div>
      <TableComponent
        columns={[
          {
            title: "Modelo",
            field: "modelos.codigoModelo"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => <ActionsButtons key={row.id} row={row} eliminar onDeleteProps={onDelete} />
          }
        ]}
        IDcolumn="id"
        buscar
        dataInfo={semielaboradosModelos}
      />
    </div>
  );
};
