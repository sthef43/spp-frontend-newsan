import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RoutesAyudaPadresSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaPadresSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRoutesAyudaPadres } from "app/features/ayuda/models/IRoutesAyudaPadres";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { EditarPadre } from "../modals/EditarPadre";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

export const PadresRoutes = () => {
  const { TitleChanger } = useTitleOfApp();

  const dispatch = useAppDispatch();

  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();

  const [openModalAñadirPadre, setOpenModalAñadirPadre] = useState(false);

  const [listaPadres, setListaPadres] = useState<IRoutesAyudaPadres[]>([]);
  FetchApi<IRoutesAyudaPadres[]>(RoutesAyudaPadresSliceRequest.getAllRequest, null, true, null, setListaPadres);

  const eliminarRuta = async (id: number) => {
    try {
      if (await getConfirmation("Eliminar Padre", "Desea Eliminar El Padre")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(RoutesAyudaPadresSliceRequest.deleteRequest(id)));
        const getRutas = unwrapResult(await dispatch(RoutesAyudaPadresSliceRequest.getAllRequest()));
        if (response) {
          openNotificationUI("Se elimino la ruta", "info");
          setListaPadres(getRutas);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [infoPadre, setInfoPadre] = useState<IRoutesAyudaPadres>();
  const editarRuta = (rowData: IRoutesAyudaPadres) => {
    setInfoPadre(rowData);
    setOpenModalAñadirPadre(true);
  };

  useEffect(() => {
    TitleChanger("Editar Rutas Padres");
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          IDcolumn="id"
          buscar
          dataInfo={listaPadres}
          columns={[
            {
              title: "Nombre Padre",
              field: "padre"
            },
            {
              title: "Acciones",
              field: "",
              render: (rowData: IRoutesAyudaPadres) => {
                return (
                  <main className="flex flex-row gap-x-1 w-full">
                    <div>
                      <Tooltip title="Editar Ruta">
                        <IconButton
                          size="medium"
                          onClick={() => {
                            editarRuta(rowData);
                          }}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip
                        title="Eliminar Ruta"
                        onClick={() => {
                          eliminarRuta(rowData.id);
                        }}>
                        <IconButton size="medium">
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </main>
                );
              }
            }
          ]}
        />
        <ModalCompoment setOpenPopup={setOpenModalAñadirPadre} openPopup={openModalAñadirPadre} title="Añadir Padre">
          <EditarPadre
            refreshListaPadres={setListaPadres}
            setOpenModalEditarPadre={setOpenModalAñadirPadre}
            listaPadres={listaPadres}
            padreSeleccionado={infoPadre}
          />
        </ModalCompoment>
      </ContainerForPages>
    </ContainerForPages>
  );
};
