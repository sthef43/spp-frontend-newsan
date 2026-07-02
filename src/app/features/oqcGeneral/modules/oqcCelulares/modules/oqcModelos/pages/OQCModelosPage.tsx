import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { OQCModeloTable } from "app/features/oqcGeneral/modules/oqcCelulares/modules/oqcModelos/modals/OQCModeloTable";
import { OQCModeloSliceRequests } from "app/features/oqcGeneral/slices/OQCModeloSlice";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";

export const OQCModelosPage = (): JSX.Element => {
  const linea = useAppSelector((state) => state.lineaProduccion.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const onGetAllByLinea = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCModeloSliceRequests.getAllByLineaIdRequest(linea.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    TitleChanger("Modelos de OQC");
  }, []);

  useEffect(() => {
    linea && onGetAllByLinea();
  }, [linea]);

  return (
    <ContainerForPages optionsLayout="page">
      <SelectOFPlantAndProducts selectLineas activeLayoutGeneric />
      {linea && <OQCModeloTable />}
    </ContainerForPages>
  );
};
