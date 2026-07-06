/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RechazoPuestoSliceRequests } from "app/Middleware/reducers/RechazoPuestoSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRechazoPuesto } from "app/models/IRechazoPuesto";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useCallback, useEffect, useState } from "react";
import { RechazoPuestoTable } from "../Components/RechazoPuestoTable";
import { RechazoPuestoForm } from "../Modals/RechazoPuestoForm";

export const RechazoPuestoPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [productoId, setProductoId] = useState<number>(0);
  const [editState, setEditState] = useState<IRechazoPuesto>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);

  const onGetPuestos = async (id?: number) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(RechazoPuestoSliceRequests.GetAllByProductoIdRequest(id ? id : productoId));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const setEditStateTable = useCallback((puesto) => {
    setEditState(puesto);
    setOpenForm(true);
  }, []);

  const setProductoIdCB = useCallback((id: number) => {
    setProductoId(id);
  }, []);

  const onAdd = () => {
    setEditState(null);
    setOpenForm(true);
  };
  useEffect(() => {
    TitleChanger("Puestos de rechazo para linea");
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <SelectOFPlantAndProducts onGetProps={onGetPuestos} setProductoId={setProductoIdCB} />
      {productoId > 0 && <RechazoPuestoTable refresh={onGetPuestos} onAddProps={onAdd} setEdit={setEditStateTable} />}
      <ModalCompoment
        setOpenPopup={setOpenForm}
        openPopup={openForm}
        title={editState ? "Editar un puesto" : "Agregar un puesto"}>
        <RechazoPuestoForm
          refresh={onGetPuestos}
          editState={editState}
          productoId={productoId}
          closeModal={setOpenForm}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
