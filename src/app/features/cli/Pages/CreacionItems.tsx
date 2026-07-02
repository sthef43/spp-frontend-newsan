import FetchApi from "app/shared/helpers/FetchApi";
import React, { useEffect, useState } from "react";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { AgregarItems } from "../Modals/CrearNuevosItemsModals/AgregarItems";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, Print } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ImprimirEtiquetaModal } from "../Modals/CrearNuevosItemsModals/ImprimirEtiquetaModal";
import { ICLIItems } from "../Models/ICLIItems";
import { CLIItemsSliceRequest } from "../Middlewares/CLIItemsSlice";

export const CreacionItems = () => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();

  const [listaItems, setListaItems] = useState<ICLIItems[]>([]);
  const [itemSeleccionado, setItemSeleccionad] = useState<ICLIItems>();

  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalImprimir, setOpenModalImprimir] = useState(false);

  FetchApi<ICLIItems[]>(CLIItemsSliceRequest.getAllRequest, null, false, null, setListaItems);

  const desvincularUbicacion = async (rowData: ICLIItems) => {
    try {
      if (await getConfirmation("Borrar Item", "Se eliminara el item, desea continuar?")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
        const response = unwrapResult(await dispatch(CLIItemsSliceRequest.deleteRequest(rowData.id)));
        const responseActualizar = unwrapResult(await dispatch(CLIItemsSliceRequest.getAllRequest()));
        if (response) {
          openNotificationUI("Se elimino el item correctamente", "success");
          setListaItems(responseActualizar);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    TitleChanger("Creacion de nuevos items");
  }, []);

  return (
    <main className="p-2">
      <section className="mt-4">
        <TableComponent
          buscar
          agregar={() => {
            setOpenModalAgregar(true);
          }}
          dataInfo={listaItems === null ? [] : listaItems}
          IDcolumn="id"
          columns={[
            {
              title: "Nombre item",
              field: "nombreItem"
            },
            {
              title: "Descripcion",
              field: "descripcion"
            },
            {
              title: "Articulo",
              field: "articulo"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <section className="flex flex-row justify-start gap-x-2">
                    <div>
                      <Tooltip title="Desvincular ubicacion">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              desvincularUbicacion(row);
                            }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Imprimir unitario">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              setOpenModalImprimir(true);
                              setItemSeleccionad(row);
                            }}>
                            <Print color="primary" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </section>
                );
              }
            }
          ]}
        />
      </section>
      <ModalCompoment setOpenPopup={setOpenModalAgregar} openPopup={openModalAgregar} title="Agregar nuevo item">
        <AgregarItems refreshLista={setListaItems} setCloseModal={setOpenModalAgregar} />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModalImprimir} openPopup={openModalImprimir} title="Impimir Etiqueta">
        <ImprimirEtiquetaModal setOpenModal={setOpenModalImprimir} listaItems={itemSeleccionado} />
      </ModalCompoment>
    </main>
  );
};
