import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPermisos, ISubRol } from "app/models";
import { Checkbox } from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import _ from "lodash";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { SubrolForm } from "../form/SubrolForm";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { SubRolSliceRequests } from "app/features/manejoSistema/slices/SubRolSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
interface ISubrolesTable {
  changeSubroles?: (id: number, state: boolean) => void;
  permisos?: IPermisos[];
  view?: boolean;
}
export const SubrolesTable = ({ changeSubroles, permisos, view }: ISubrolesTable): JSX.Element => {
  const subroles = useAppSelector((state) => state.subrol.dataAll as ISubRol[]);
  const permisosByRol = useAppSelector((state) => state.permisos.data as IPermisos[]);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [openForm, setOpenForm] = useState(false);
  const [subrol, setSubrol] = useState({} as ISubRol);
  const [viewSubroles, setViewSubroles] = useState([] as ISubRol[]);

  const onChangeCheck = (subrolId: number, event) => {
    changeSubroles(subrolId, event.target.checked);
  };
  const onEdit = (subrol: ISubRol) => {
    setSubrol(subrol);
    setOpenForm(true);
  };
  const onAdd = () => {
    if (!view) {
      setSubrol(null);
      setOpenForm(true);
    }
  };
  const onDelete = async (rol: ISubRol) => {
    try {
      const confirm = await getConfirmation("Eliminar rol", "Esta seguro de eliminar el rol?");
      if (confirm) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const resp = await dispatch(SubRolSliceRequests.deleteRequest(rol.id));
        resp && openNotificationUI("Se elimino correctamente", "success");
        await dispatch(SubRolSliceRequests.getAllRequest());
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onGetView = async () => {
    const newSubrolesView = permisosByRol?.flatMap((p) => subroles.find((subrol) => p.subrolId == subrol.id) || []);
    if (newSubrolesView.length > 0) {
      setViewSubroles(newSubrolesView);
    }
  };
  useEffect(() => {
    permisosByRol?.length > 0 && view && onGetView();
  }, [permisosByRol]);
  useEffect(() => {
    console.log(view);
  }, [view]);

  return (
    <div>
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "",
            field: "",
            render: (row: ISubRol) =>
              view ? (
                <Checkbox disabled icon={<BookmarkBorder />} checkedIcon={<Bookmark />} checked />
              ) : (
                <Checkbox
                  icon={<BookmarkBorder />}
                  checkedIcon={<Bookmark />}
                  checked={permisos.find((p) => p.subrolId == row.id && !p.deleted) ? true : false}
                  onClick={(e) => onChangeCheck(row.id, e)}
                />
              )
          },
          {
            title: "Subrol",
            field: "name"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => (
              <ActionsButtons row={row} edit onEditProps={onEdit} eliminar onDeleteProps={onDelete} disabled={view} />
            )
          }
        ]}
        dataInfo={view ? viewSubroles : _.orderBy(subroles, "name")}
        buscar
        agregar={onAdd}
      />
      <ModalCompoment title={`${subrol ? "Editar" : "Agregar"} subrol`} setOpenPopup={setOpenForm} openPopup={openForm}>
        <SubrolForm subrol={subrol} closeModal={setOpenForm} />
      </ModalCompoment>
    </div>
  );
};
