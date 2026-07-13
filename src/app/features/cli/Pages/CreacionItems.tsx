/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, Print } from "@mui/icons-material";
import FetchApi from "app/shared/helpers/FetchApi";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalComponent } from "app/shared/components/ui/ModalComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useAppSelector } from "app/core/store/store";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { AgregarItems } from "../Modals/CrearNuevosItemsModals/AgregarItems";
import { ImprimirEtiquetaModal } from "../Modals/CrearNuevosItemsModals/ImprimirEtiquetaModal";
import { ICLIItems } from "../Models/ICLIItems";
import { CLIItemsSliceRequest } from "../Middlewares/CLIItemsSlice";

export const CreacionItems: React.FC = () => {
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { FetchDelete } = useFetchApiMultiResults<ICLIItems>();

  const listaItems = useAppSelector((state) => (state as any).cliItems?.dataAll ?? []);
  const [itemSeleccionado, setItemSeleccionado] = useState<ICLIItems>();

  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalImprimir, setOpenModalImprimir] = useState(false);

  FetchApi<ICLIItems[]>(CLIItemsSliceRequest.getAllRequest, undefined, false, null);

  const eliminarItem = async (rowData: ICLIItems) => {
    FetchDelete({
      consoleLog: false,
      deleteId: rowData.id,
      sliceRequest: CLIItemsSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      titleUser: "Borrar Item",
      messageUser: "Se eliminará el item, desea continuar?",
      functionAdd: () => {
        openNotificationUI("Se eliminó el item correctamente", "success");
      }
    });
  };

  useEffect(() => {
    TitleChanger("Creación de nuevos items");
  }, [TitleChanger]);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <TableComponent
          buscar
          agregar={() => {
            setOpenModalAgregar(true);
          }}
          dataInfo={listaItems}
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
              field: "_actions",
              render: (row: ICLIItems) => {
                return (
                  <section className="flex flex-row justify-start gap-x-2">
                    <div>
                      <Tooltip title="Desvincular ubicacion">
                        <IconButton
                          size="small"
                          sx={{ position: "relative" }}
                          aria-label="Eliminar item"
                          onClick={() => {
                            eliminarItem(row);
                          }}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Imprimir unitario">
                        <IconButton
                          size="small"
                          sx={{ position: "relative" }}
                          aria-label="Imprimir etiqueta"
                          onClick={() => {
                            setOpenModalImprimir(true);
                            setItemSeleccionado(row);
                          }}>
                          <Print color="primary" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </section>
                );
              }
            }
          ]}
        />
      </ContainerForPages>
      <ModalComponent
        setOpenPopup={setOpenModalAgregar}
        openPopup={openModalAgregar}
        title="Agregar nuevo item"
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Formulario para agregar un nuevo item"
      >
        <AgregarItems refreshLista={() => {}} setOpenModal={setOpenModalAgregar} />
      </ModalComponent>
      <ModalComponent
        setOpenPopup={setOpenModalImprimir}
        openPopup={openModalImprimir}
        title="Imprimir Etiqueta"
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Seleccione e imprima etiquetas para los items"
      >
        <ImprimirEtiquetaModal setOpenModal={setOpenModalImprimir} listaItems={itemSeleccionado} />
      </ModalComponent>
    </ContainerForPages>
  );
};
