import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
import { useAppDispatch } from "app/core/store/store";
import { RolesYSubrolesTable } from "app/features/manejoSistema/rolesAndSubroles/components/RolesYSubrolesTable";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";

export const RolesYSubrolesPage = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const getAllRoles = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(RolSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    TitleChanger("Administrar roles y subroles");
    getAllRoles();
  }, []);
  return (
    <div className="m-4 flex justify-center">
      <RolesYSubrolesTable />
    </div>
  );
};
