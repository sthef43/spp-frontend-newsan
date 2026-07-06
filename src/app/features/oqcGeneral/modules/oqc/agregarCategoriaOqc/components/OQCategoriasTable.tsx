import React, { useState } from "react";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { IOQCCategoria } from "app/models/IOQCCategoria";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { OQCCategoriaForm } from "./OQCCategoriaForm";
import { OQCCategoriaSliceRequests, oqcCategoriaSlice } from "app/features/oqcGeneral/slices/OQCCategoriaSlice";

export const OQCategoriasTable = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const [form, setForm] = useState(false);
  const categorias = useAppSelector<IOQCCategoria[]>((state) => state.oqcCategoria.dataAll);

  const onEliminar = async (categoria: IOQCCategoria) => {
    try {
      if (await getConfirmation("Eliminar categoria", "Esta seguro que quiere eliminar la categoria")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        await dispatch(OQCCategoriaSliceRequests.deleteRequest(categoria.id));
        await dispatch(OQCCategoriaSliceRequests.getAllRequest());
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };
  const onEdit = async (categoria: IOQCCategoria) => {
    await dispatch(oqcCategoriaSlice.actions.setObject(categoria));
    setForm(true);
  };
  const onOpenForm = async () => {
    await dispatch(oqcCategoriaSlice.actions.setObject(null));
    setForm(true);
  };
  return (
    <div>
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => <ActionsButtons row={row} edit eliminar onDeleteProps={onEliminar} onEditProps={onEdit} />
          }
        ]}
        agregar={onOpenForm}
        buscar
        dataInfo={categorias}
      />
      <ModalCompoment openPopup={form} setOpenPopup={setForm} title="Agregar/editar una categoria">
        <OQCCategoriaForm closeModal={setForm} />
      </ModalCompoment>
    </div>
  );
};
