/* eslint-disable unused-imports/no-unused-vars */
import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import React, { useState } from "react";
import { ICLIContendorItems } from "../../Models/ICLIContenedorItems";
import { ICLIImpresionEtiquetas } from "../../Models/ICLIImpresionEtiquetas";
import { CLIContenedorItemsSliceRequest } from "../../Middlewares/CLIContenedorItemsSlice";
import { CLIImpresionEtiquetasSliceRequests } from "../../Middlewares/CLIImpresionEtiquetas";

interface Props {
  refreshLista: (newValue: ICLIContendorItems[]) => void;
  setOpenModal: (newValue: boolean) => void;
  containerSeleecionado: ICLIContendorItems;
}

export const ExaminarItems: React.FC<Props> = ({ setOpenModal, containerSeleecionado, refreshLista }) => {
  const dispatch = useAppDispatch();

  const [containerItems, setContainerItems] = useState<ICLIContendorItems>();

  FetchApi<ICLIContendorItems>(
    CLIContenedorItemsSliceRequest.GetAllWithItemsId,
    containerSeleecionado.id,
    true,
    null,
    setContainerItems
  );

  const eliminarItemContainer = async (rowData) => {
    const item = formatearItem(rowData);
    const cantidadItems = containerItems.cliImpresionEtiquetas.length - 1;
    const nuevoContainer = { ...containerSeleecionado, cantidadTotalItems: cantidadItems };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(CLIImpresionEtiquetasSliceRequests.PutRequest(item)));
      const responseContainer = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.PutRequest(nuevoContainer)));
      const actualizarLista = unwrapResult(
        await dispatch(CLIContenedorItemsSliceRequest.GetAllWithItemsId(containerSeleecionado.id))
      );
      const refreshTabla = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.GetByOptionLpn("CLI")));
      if (responseContainer) {
        setContainerItems(actualizarLista);
        refreshLista(refreshTabla);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const formatearItem = (rowData: ICLIImpresionEtiquetas) => {
    const nuevoItem = { ...rowData, cliContenedorItemsId: null };
    delete nuevoItem.cliItems;
    delete nuevoItem.cliSectores;
    if (nuevoItem != null || nuevoItem != undefined) {
      return nuevoItem;
    }
  };

  return (
    <main className="w-[55vw]">
      {containerItems != undefined && (
        <section>
          <TableComponent
            IDcolumn="id"
            dataInfo={containerItems.cliImpresionEtiquetas}
            columns={[
              {
                title: "Nombre Item",
                field: "cliItems.nombreItem"
              },
              {
                title: "Articulo",
                field: "articulo"
              },
              {
                title: "LPN",
                field: "lpnGenerada"
              },
              {
                title: "Nombre Sector",
                field: "cliSectores.nombreSector"
              },
              {
                title: "Cantidad",
                field: "cantidad"
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => (
                  <section>
                    <div>
                      <Tooltip title="Eliminar de la lista">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              eliminarItemContainer(row);
                            }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </section>
                )
              }
            ]}
          />
        </section>
      )}
    </main>
  );
};
