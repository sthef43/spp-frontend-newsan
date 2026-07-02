import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { OQCPonderacionTable } from "app/features/oqcGeneral/modules/oqc/agregarPonderacionOqc/components/OQCPonderacionTable";
import { OQCPonderacionSliceRequests } from "app/features/oqcGeneral/slices/OQCPonderacionSlice";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";

export const OQCPonderacionPage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const onGetAllCategorias = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCPonderacionSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    onGetAllCategorias();
    TitleChanger("Ponderación de OQC");
  }, []);
  return (
    <div className="h-screen w-screen">
      <OQCPonderacionTable />
    </div>
  );
};
