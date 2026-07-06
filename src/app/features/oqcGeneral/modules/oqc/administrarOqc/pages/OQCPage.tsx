import { Button } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OQCSliceRequests } from "app/features/oqcGeneral/slices/OQCSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { OQCModeloPrefijoForm } from "app/features/oqcGeneral/modules/oqc/administrarOqc/components/OQCModeloPrefijoForm";
import { OqcTable } from "app/features/oqcGeneral/modules/oqc/administrarOqc/components/OqcTable";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";

export const OQCPage = (): JSX.Element => {
  const producto = useAppSelector((state) => state.producto.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();

  const [ModalOpen, setModalOpen] = useState(false);

  const onGetAllByProduct = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCSliceRequests.getAllByProductoIdRequest(producto.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const ModeloPrefijo = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    TitleChanger("Administrar OQC");
  }, []);

  useEffect(() => {
    producto && onGetAllByProduct();
  }, [producto]);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <ContainerForPages optionsLayout="Selects">
        <SelectOFPlantAndProducts activeLayoutGeneric />
        <Button className={classes.greenButton} variant="contained" onClick={ModeloPrefijo}>
          Prefijo Modelo
        </Button>
      </ContainerForPages>
      {producto && <OqcTable />}
      <ModalCompoment title="Prefijo Modelo" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <OQCModeloPrefijoForm setOpenPopup={setModalOpen} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
