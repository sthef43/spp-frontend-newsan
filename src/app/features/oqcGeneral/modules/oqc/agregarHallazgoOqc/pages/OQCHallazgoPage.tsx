import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { OQCHallazgosTable } from "app/features/oqcGeneral/modules/oqc/agregarHallazgoOqc/components/OQCHallazgosTable";
import { OQCHallazgoSliceRequests } from "app/features/oqcGeneral/slices/OQCHallazgoSlice";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";

export const OQCHallazgoPage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [productoId, setProductoId] = useState(0);

  const onGetAllByProduct = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCHallazgoSliceRequests.getAllByProductoIdRequest(productoId));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    TitleChanger("Hallazgos de OQC");
  }, []);
  useEffect(() => {
    productoId != 0 && onGetAllByProduct();
  }, [productoId]);
  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <SelectOFPlantAndProducts activeLayoutGeneric setProductoId={setProductoId} />
      {productoId != 0 && <OQCHallazgosTable />}
    </ContainerForPages>
  );
};
