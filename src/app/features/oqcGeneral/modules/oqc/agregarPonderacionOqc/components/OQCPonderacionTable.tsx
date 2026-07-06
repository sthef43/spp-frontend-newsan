import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCPonderacion } from "app/models/IOQCPonderacion";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
import { OQCPonderacionForm } from "./OQCPonderacionForm";
import { OQCPonderacionSliceRequests, oqcPonderacionSlice } from "app/features/oqcGeneral/slices/OQCPonderacionSlice";

export const OQCPonderacionTable = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const [form, setForm] = useState(false);
  const ponderaciones = useAppSelector<IOQCPonderacion[]>((state) => state.oqcPonderacion.dataAll);

  const onEliminar = async (ponderacion: IOQCPonderacion) => {
    try {
      if (await getConfirmation("Eliminar ponderación", "Esta seguro que quiere eliminar la ponderación")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        await dispatch(OQCPonderacionSliceRequests.deleteRequest(ponderacion.id));
        await dispatch(OQCPonderacionSliceRequests.getAllRequest());
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };
  const onEdit = async (ponderacion: IOQCPonderacion) => {
    await dispatch(oqcPonderacionSlice.actions.setObject(ponderacion));
    setForm(true);
  };
  const onOpenForm = async () => {
    await dispatch(oqcPonderacionSlice.actions.setObject(null));
    setForm(true);
  };
  return (
    <div>
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Criticidad",
            field: "criticidad"
          },
          {
            title: "Tipo de defecto",
            field: "tipoDefecto"
          },
          {
            title: "Ponderación",
            field: "",
            render: (row) => <div>%{row.ponderacion}</div>
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => <ActionsButtons row={row} edit eliminar onDeleteProps={onEliminar} onEditProps={onEdit} />
          }
        ]}
        agregar={onOpenForm}
        buscar
        dataInfo={ponderaciones}
        rowStyle={(rowData: IOQCPonderacion) => {
          switch (rowData.color) {
            case "Rojo":
              return { padding: 1, backgroundColor: "#f44b4e", fontSize: 14 };
            case "Verde":
              return { padding: 1, backgroundColor: "#5dae3a", fontSize: 14 };
            case "Amarillo":
              return { padding: 1, backgroundColor: "#fdaf59", fontSize: 14 };
            default:
              return { padding: 1, fontSize: 14 };
          }
        }}
      />
      <ModalCompoment openPopup={form} setOpenPopup={setForm} title="Agregar/editar una categoria">
        <OQCPonderacionForm closeModal={setForm} />
      </ModalCompoment>
    </div>
  );
};
