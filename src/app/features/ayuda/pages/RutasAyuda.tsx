import { ChangeCircleRounded, Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RoutesAyudaSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRoutesAyuda } from "app/features/ayuda/models/IRoutesAyuda";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { EditarRoutesAyuda } from "../modals/EditarRouteAyuda";
import { AgregarNuevaRoute } from "../modals/AgregarNuevaRoute";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { CambiarPdf } from "../modals/CambiarPdf";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const RutasAyuda = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();

  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();

  const [openModalEditar, setOpenModalEditar] = useState<boolean>(false);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalActualizarPdf, setOpenModalActualizarPdf] = useState(false);

  const [listadoRutas, setListadoRutas] = useState<IRoutesAyuda[]>([]);
  const [routeSeleccionada, setRouteSeleccionada] = useState<IRoutesAyuda>();

  FetchApi<IRoutesAyuda[]>(RoutesAyudaSliceRequest.getAllRequest, null, true, null, setListadoRutas);

  const eliminarRuta = async (id: number) => {
    try {
      if (await getConfirmation("Eliminar Ruta", "Desea Eliminar La Ruta")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(RoutesAyudaSliceRequest.deleteRequest(id)));
        const getRutas = unwrapResult(await dispatch(RoutesAyudaSliceRequest.getAllRequest()));
        if (response) {
          openNotificationUI("Se elimino la ruta", "info");
          setListadoRutas(getRutas);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const editarRuta = (row: IRoutesAyuda) => {
    setRouteSeleccionada(row);
    setOpenModalEditar(true);
  };

  const actualizarPdf = (row: IRoutesAyuda) => {
    setOpenModalActualizarPdf(true);
    setRouteSeleccionada(row);
  };

  useEffect(() => {
    TitleChanger("Agregar PDFS o Editar Rutas PDF");
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          agregar={() => {
            setOpenModalAgregar(true);
          }}
          IDcolumn="id"
          dataInfo={listadoRutas}
          buscar
          columns={[
            {
              title: "Nombre PDF",
              field: "nombrePDF"
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
              render: (rowData: IRoutesAyuda) => {
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
                    <div>
                      <Tooltip
                        title="Cambiar PDF"
                        onClick={() => {
                          actualizarPdf(rowData);
                        }}>
                        <IconButton size="medium">
                          <ChangeCircleRounded color="secondary" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </main>
                );
              }
            }
          ]}
        />
        <ModalCompoment setOpenPopup={setOpenModalEditar} openPopup={openModalEditar} title="Editar Ruta Ayuda">
          <EditarRoutesAyuda
            setListaRoutes={setListadoRutas}
            setOpenModal={setOpenModalEditar}
            openModal={openModalEditar}
            routeAyudaSeleccionada={routeSeleccionada}
          />
        </ModalCompoment>
        <ModalCompoment setOpenPopup={setOpenModalAgregar} openPopup={openModalAgregar} title="Agregar Nueva Ruta">
          <AgregarNuevaRoute
            openModal={openModalAgregar}
            setOpenModal={setOpenModalAgregar}
            setListaRoutes={setListadoRutas}
          />
        </ModalCompoment>
        <ModalCompoment
          setOpenPopup={setOpenModalActualizarPdf}
          openPopup={openModalActualizarPdf}
          title="Actualizar PDF">
          <CambiarPdf
            openModal={openModalActualizarPdf}
            pdfSeleccionado={routeSeleccionada}
            setOpenModal={setOpenModalActualizarPdf}
          />
        </ModalCompoment>
      </ContainerForPages>
    </ContainerForPages>
  );
};
