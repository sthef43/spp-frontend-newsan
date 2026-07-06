import React, { useState } from "react";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { RolForm } from "../form/RolForm";
import { IRol } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
import { SubrolesView } from "./SubrolesView";
import { SubrolesForm } from "../form/SubrolesForm";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

export const RolesYSubrolesTable = (): JSX.Element => {
  const roles = useAppSelector((state) => state.rol.dataAll);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [openForm, setOpenForm] = useState(false);
  const [openSubroles, setOpenSubroles] = useState(false);
  const [openSubrolesForm, setOpenSubrolesForm] = useState(false);
  const [editState, setEditState] = useState({} as IRol);

  const onEdit = (rol: IRol) => {
    setEditState(rol);
    setOpenForm(true);
  };
  const onAdd = () => {
    setEditState(null);
    setOpenForm(true);
  };
  const onViewSubroles = (rol: IRol) => {
    setEditState(rol);
    setOpenSubroles(true);
  };
  const onAddSubroles = (rol: IRol) => {
    setEditState(rol);
    setOpenSubrolesForm(true);
  };
  const onDelete = async (rol: IRol) => {
    try {
      const confirm = await getConfirmation("Eliminar rol", "Esta seguro de eliminar el rol?");
      if (confirm) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const resp = await dispatch(RolSliceRequests.deleteRequest(rol.id));
        resp && openNotificationUI("Se elimino correctamente", "success");
        await dispatch(RolSliceRequests.getAllRequest());
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  return (
    <div>
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Rol",
            field: "name"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => (
              <ActionsButtons
                row={row}
                add
                edit
                eliminar
                info
                onDeleteProps={onDelete}
                onEditProps={onEdit}
                onInfoProps={onViewSubroles}
                onAddProps={onAddSubroles}
                addTitle="Agregar/quitas subroles"
              />
            )
          }
        ]}
        dataInfo={roles}
        buscar
        agregar={onAdd}
      />
      <ModalCompoment
        title={editState ? "Editar un rol" : "Agregar un rol"}
        setOpenPopup={setOpenForm}
        openPopup={openForm}>
        <RolForm rol={editState} closeModal={setOpenForm} />
      </ModalCompoment>
      <ModalCompoment title="Subroles del rol" setOpenPopup={setOpenSubroles} openPopup={openSubroles}>
        <SubrolesView rol={editState} closeModal={setOpenSubroles} />
      </ModalCompoment>
      <ModalCompoment
        title="Agregar/quitar subroles del rol"
        setOpenPopup={setOpenSubrolesForm}
        openPopup={openSubrolesForm}>
        <SubrolesForm rol={editState} closeForm={setOpenSubrolesForm} />
      </ModalCompoment>
    </div>
  );
};
