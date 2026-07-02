import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { OQCategoriasTable } from "app/features/oqcGeneral/modules/oqc/agregarCategoriaOqc/components/OQCategoriasTable";
import { OQCCategoriaSliceRequests } from "app/features/oqcGeneral/slices/OQCCategoriaSlice";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";

export const OQCCategoriaPage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const onGetAllCategorias = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCCategoriaSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    onGetAllCategorias();
    TitleChanger("Categorias de OQC");
  }, []);

  return (
    <div className="h-screen w-screen">
      <OQCategoriasTable />
    </div>
  );
};
