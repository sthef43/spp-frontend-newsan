import { useAppDispatch } from "app/core/store/store";
import { IDefectoImagen } from "app/models/IDefectoImagen";
import React, { useState } from "react";
import { DefectoImagenSlice, DefectoImagenSliceRequest } from "app/Middleware/reducers/DefectoImagenSlice";
import { DefectoImagenForm } from "./DefectoImagenForm";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";

interface IDefectoImagenTable {
  refresh: () => void;
  tipoUnidad: string;
  familia: string;
  listaDefectos: IDefectoImagen[];
}
export const DefectoImagenTable = ({
  refresh,
  tipoUnidad,
  familia,
  listaDefectos
}: IDefectoImagenTable): JSX.Element => {
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();

  const [form, setForm] = useState(false);

  const onAdd = () => {
    dispatch(DefectoImagenSlice.actions.setObject(null));
    setForm(true);
  };
  const onDelete = async (row: IDefectoImagen) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (confirm) {
        const resp = await dispatch(DefectoImagenSliceRequest.DeleteRequest(row.idDefectoImagen));
        resp && openNotificationUI("Se elimino correctamente", "success");
        refresh();
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onEdit = (row: IDefectoImagen) => {
    dispatch(DefectoImagenSlice.actions.setObject(row));
    setForm(true);
  };

  return (
    <div>
      {listaDefectos && (
        <TableComponent
          IDcolumn="idDefectoImagen"
          columns={[
            {
              title: "Codigo defecto",
              field: "codigoDefecto"
            },
            {
              title: "Descripcion defecto",
              field: "defecto.descripcion"
            },
            {
              title: "Codigo origen",
              field: "codigoOrigen"
            },
            {
              title: "Número imagen",
              field: "numImagen"
            },
            {
              title: "Acciones",
              field: "",
              render: (row: IDefectoImagen) => (
                <ActionsButtons row={row} eliminar edit onDeleteProps={onDelete} onEditProps={onEdit} />
              )
            }
          ]}
          dataInfo={listaDefectos}
          buscar
          agregar={onAdd}
        />
      )}
      <ModalCompoment setOpenPopup={setForm} openPopup={form} title="Agregar/Editar defecto imagen">
        <DefectoImagenForm refresh={refresh} closeModal={setForm} tipoUnidad={tipoUnidad} familia={familia} />
      </ModalCompoment>
    </div>
  );
};
