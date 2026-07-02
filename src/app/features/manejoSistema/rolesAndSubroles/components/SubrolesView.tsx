import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PermisosSliceRequests } from "app/features/manejoSistema/slices/PermisosSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRol } from "app/models";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { SubrolesTable } from "./SubrolesTable";
import { SubRolSliceRequests } from "app/features/manejoSistema/slices/SubRolSlice";
interface ISubrolesView {
  rol: IRol;
  closeModal: (state: boolean) => void;
}
export const SubrolesView = ({ closeModal, rol }: ISubrolesView): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const onGetSubrolByRol = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(SubRolSliceRequests.getAllRequest());
      await dispatch(PermisosSliceRequests.getByRolId(rol.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    onGetSubrolByRol();
  }, []);
  return (
    <div>
      <SubrolesTable view />
    </div>
  );
};
