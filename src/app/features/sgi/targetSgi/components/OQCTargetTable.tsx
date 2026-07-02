import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCPonderacion } from "app/models/IOQCPonderacion";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { ModalCompoment } from "../../../../shared/components/ModalComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { OQCTargetForm } from "../modals/OQCTargetForm";
import { IOQCTarget } from "app/models/IOQCTarget";
import { OQCTargetSliceRequests, oqcTargetSlice } from "app/features/oqcGeneral/slices/OQCTargetSlice";

export const OQCTargetTable = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const [form, setForm] = useState(false);
  const targets = useAppSelector<IOQCTarget[]>((state) => state.oqcTarget.dataAll);

  const onEliminar = async (ponderacion: IOQCPonderacion) => {
    try {
      if (await getConfirmation("Eliminar ponderación", "Esta seguro que quiere eliminar la ponderación")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        await dispatch(OQCTargetSliceRequests.deleteRequest(ponderacion.id));
        await dispatch(OQCTargetSliceRequests.getAllRequest());
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };
  const onEdit = (Target: IOQCTarget) => {
    dispatch(oqcTargetSlice.actions.setObject(Target));
    setForm(true);
  };
  const onOpenForm = () => {
    dispatch(oqcTargetSlice.actions.setObject(null));
    setForm(true);
  };
  return (
    <div>
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Target",
            field: "target"
          },
          {
            title: "Linea de producción",
            field: "",
            render: (row) =>
              row.lineaProduccionId != 0 ? row.lineaProduccion.nombre : "Target corresponde al producto"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => <ActionsButtons row={row} edit eliminar onDeleteProps={onEliminar} onEditProps={onEdit} />
          }
        ]}
        agregar={onOpenForm}
        buscar
        dataInfo={targets}
      />
      <ModalCompoment openPopup={form} setOpenPopup={setForm} title="Agregar/editar una categoria">
        <OQCTargetForm closeModal={setForm} />
      </ModalCompoment>
    </div>
  );
};
