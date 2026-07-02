import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useCallback, useEffect, useState } from "react";
import { RoutesSliceRequests } from "../../slices/RoutesSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import _ from "lodash";
import { IRoutes } from "../../../../models/IRoutes";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ManejoSistemaForm } from "app/features/manejoSistema/administarRutas/forms/ManejoSistemaForm";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";

export const AdministrarRutasPage = () => {
  const { openNotificationUI } = useNotificationUI();
  const rutas = useAppSelector((state) => state.routes.dataAll);
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const [openModal, setOpenModal] = useState(false);
  const [editState, setEditState] = useState<IRoutes>(null);
  const onInit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(RoutesSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      openNotificationUI(e, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };
  const onDelete = async (id: number) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (confirm) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const resp = await dispatch(RoutesSliceRequests.deleteRequest(id));
        resp && openNotificationUI("Se elimino correctamente", "success");
        await dispatch(RoutesSliceRequests.getAllRequest());
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (e) {
      openNotificationUI(e, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };
  const handleEdit = (row: IRoutes) => {
    setEditState(row);
    setOpenModal(true);
  };
  const editCL = useCallback((row) => {
    handleEdit(row);
  }, []);
  const deleteCL = useCallback((row) => {
    onDelete(row.id);
  }, []);

  useEffect(() => {
    onInit();
    TitleChanger("Administración de rutas");
  }, []);

  return (
    <div className="shadow-elevation-4 m-5">
      <TableComponent
        columns={[
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Padre",
            field: "padre"
          },
          {
            title: "Ruta",
            field: "ruta"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => <ActionsButtons row={row} edit eliminar onEditProps={editCL} onDeleteProps={deleteCL} />
          }
        ]}
        agregar={() => {
          setOpenModal(true);
          setEditState(null);
        }}
        buscar
        Dense
        IDcolumn="id"
        dataInfo={_.orderBy(rutas, "padre")}
      />
      <ModalCompoment
        title={editState ? "Editar una ruta" : "Agregar una ruta"}
        setOpenPopup={setOpenModal}
        openPopup={openModal}>
        <ManejoSistemaForm editState={editState} setOpenModal={setOpenModal} />
      </ModalCompoment>
    </div>
  );
};
