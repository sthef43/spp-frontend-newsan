import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IProducto } from "app/models";
import { OQCTargetTable } from "app/features/sgi/targetSgi/components/OQCTargetTable";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { OQCTargetSliceRequests } from "app/features/oqcGeneral/slices/OQCTargetSlice";

export const OQCTargetPage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const producto = useAppSelector<IProducto>((state) => state.producto.object);

  const onGetAllCategorias = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCTargetSliceRequests.getAllByProductoIdRequest(producto?.id || 0));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    onGetAllCategorias();
    TitleChanger("Target de OQC");
  }, []);
  useEffect(() => {
    producto?.id && onGetAllCategorias();
  }, [producto]);
  return (
    <div className="h-screen w-screen">
      <SelectOFPlantAndProducts />
      <OQCTargetTable />
    </div>
  );
};
