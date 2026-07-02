import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { SemielaboradoSliceRequests } from "app/Middleware/reducers/SemielaboradoSlice";
import { useAppDispatch } from "app/core/store/store";
import { ISemielaborado } from "app/models/ISemielaborado";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { SemielaboradoModelos } from "./SemielaboradoModelos";
interface Props {
  dataTable: ISemielaborado[];
  onAddProps: any;
  lineaId: number;
  refresh: () => void;
  setEditForm: (row) => void;
}
export const SemielaboradosTable = ({ dataTable, onAddProps, lineaId, refresh, setEditForm }: Props) => {
  const [openAddModelos, setOpenAddModelos] = useState(false);
  const [semielaboradoId, setSemielaboradoId] = useState<number>(0);
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const onAdd = () => {
    if (onAddProps != null) onAddProps();
  };
  console.log(dataTable);

  const onDelete = async (row: ISemielaborado) => {
    try {
      if (await getConfirmation("Esta seguro de eliminar?", "Esta por eliminar un semielaborado")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(SemielaboradoSliceRequests.deleteRequest(row.id)));
        openNotificationUI("Se elimino correctamente", "success");
        refresh();
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };
  const onEdit = (row: ISemielaborado) => {
    setEditForm(row);
  };
  const onAddModelos = (row: ISemielaborado) => {
    setSemielaboradoId(row.id);
    setOpenAddModelos(true);
  };
  return (
    <div className="my-3">
      <TableComponent
        columns={[
          {
            title: "Semielaborado",
            field: "nombre"
          },
          {
            title: "Semielaborado tipo",
            field: "semielaboradoTipo.nombre"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => (
              <ActionsButtons
                key={row.nombre}
                row={row}
                edit={setEditForm != null ? true : false}
                eliminar
                add
                addTitle="Asignar modelos"
                addColor={row.semielaboradoModelos.length != 0 ? "success" : "error"}
                onDeleteProps={onDelete}
                onEditProps={onEdit}
                onAddProps={onAddModelos}
              />
            )
          }
        ]}
        IDcolumn="id"
        buscar
        agregar={onAdd}
        dataInfo={dataTable}
      />
      <ModalCompoment
        setOpenPopup={setOpenAddModelos}
        title="Agregar modelos al semielaborado"
        openPopup={openAddModelos}>
        <SemielaboradoModelos semielaboradoId={semielaboradoId} lineaId={lineaId} />
      </ModalCompoment>
    </div>
  );
};
