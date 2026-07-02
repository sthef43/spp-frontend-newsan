import React from "react";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { RechazoPuestoSliceRequests } from "app/Middleware/reducers/RechazoPuestoSlice";
import { useAppSelector, useAppDispatch } from "app/core/store/store";
import { IRechazoPuesto } from "app/models/IRechazoPuesto";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface IRPuestoTableProps {
  refresh: () => void;
  onAddProps: () => void;
  setEdit: (puesto) => void;
}
export const RechazoPuestoTable = ({ refresh, onAddProps, setEdit }: IRPuestoTableProps) => {
  const rechazoPuestos = useAppSelector<IRechazoPuesto[]>((state) => state.rechazoPuesto.dataAll);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const onDelete = async (puesto: IRechazoPuesto) => {
    try {
      const confirm = await getConfirmation("Eliminar puesto", "Esta seguro de eliminar el puesto?");
      if (confirm) {
        const resp = await dispatch(RechazoPuestoSliceRequests.deleteRequest(puesto.id));
        resp && openNotificationUI("Se elimino correctamente", "success");
        refresh();
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const onAdd = () => {
    onAddProps();
  };

  return (
    <ContainerForPages optionsLayout="Table">
      <TableComponent
        columns={[
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Es rechazo de placas?",
            field: "",
            render: (row) => (row.placas ? "Si" : "No")
          },
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Codigo de origen",
            field: "codigoOrigen"
          },
          {
            title: "Tipo de filas",
            field: "rechazoPuestoFila.nombre"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => <ActionsButtons edit eliminar row={row} onEditProps={setEdit} onDeleteProps={onDelete} />
          }
        ]}
        dataInfo={rechazoPuestos}
        IDcolumn={"id"}
        buscar
        agregar={onAdd}
      />
    </ContainerForPages>
  );
};
