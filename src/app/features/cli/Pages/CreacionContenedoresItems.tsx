import { Add, Delete, Print, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import FetchApi from "app/shared/helpers/FetchApi";
import React, { useEffect, useState } from "react";
import { AgregarItemsContenedores } from "../Modals/CreacionContenedoresItems/AgregarItemsContenedores";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ExaminarItems } from "../Modals/CreacionContenedoresItems/ExaminarItems";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { EliminarContenedor } from "../Modals/CreacionContenedoresItems/EliminarContenedor";
import { ImprimirEtiquetaPadre } from "../Modals/CreacionContenedoresItems/ImprimirEtiquetaPadre";
import { ICLIContendorItems } from "../Models/ICLIContenedorItems";
import { ICLIImpresionEtiquetas } from "../Models/ICLIImpresionEtiquetas";
import { UseGeneratorCodesForLabels } from "app/shared/hooks/useGeneratorCodesForLabels";
import { CLIContenedorItemsSliceRequest } from "../Middlewares/CLIContenedorItemsSlice";

export const CreacionContenedoresItems: React.FC = () => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const { generateArticleCode, generateLpnWitPrefixCode } = UseGeneratorCodesForLabels();

  const [openModalAgregar, setOpenModalAgregar] = useState<boolean>(false);
  const [openModalExaminar, setOpenModalExaminar] = useState<boolean>(false);
  const [openModalEliminar, setOpenModalEliminar] = useState<boolean>(false);
  const [openModalImprimir, setOpenModalImprimir] = useState<boolean>(false);

  const [contenedorSeleccionado, setContenedorSeleccionado] = useState<ICLIContendorItems>();
  const [listaContenedores, setListaContenedores] = useState<ICLIContendorItems[]>([]);
  const [containerConItems, setContainerConItems] = useState<ICLIImpresionEtiquetas[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [activadorVerItems, setActivadorVerItems] = useState<number | null>(null);

  const { FetchPost } = useFetchApiMultiResults<ICLIContendorItems>();

  FetchApi<ICLIContendorItems[]>(
    CLIContenedorItemsSliceRequest.GetByOptionLpn,
    "CLI",
    true,
    refreshCounter,
    setListaContenedores
  );

  FetchApi<ICLIContendorItems>(
    CLIContenedorItemsSliceRequest.GetAllWithItemsId,
    activadorVerItems,
    false,
    activadorVerItems,
    (data) => {
      if (data?.cliImpresionEtiquetas) setContainerConItems(data.cliImpresionEtiquetas);
    },
    true
  );

  const nuevoContenedor = async () => {
    if (await getConfirmation("Añadir container", "Desea añadir un nuevo contenedor?")) {
      const container = crearNuevoContenedor();
      if (!container) return;
      await FetchPost(
        CLIContenedorItemsSliceRequest.PostRequest,
        container,
        false,
        () => {
          openNotificationUI("Se agrego el container correctamente", "success");
          setRefreshCounter((prev) => prev + 1);
        }
      );
    }
  };

  const verItems = (rowItems: ICLIContendorItems) => {
    setActivadorVerItems(rowItems.id);
  };

  const crearNuevoContenedor = () => {
    const articulo = generateArticleCode(["A", "B", "C", "D", "E", "F"], 12, 3);
    const lpn = generateLpnWitPrefixCode(6, "CLI0");
    if (articulo) {
      const nuevoContenedor: ICLIContendorItems = {
        lpnGenerada: lpn,
        articulo: articulo,
        cantidadTotalItems: 0,
        permisoAgregar: "Habilitado"
      };
      return nuevoContenedor;
    } else {
      openNotificationUI("Ocurrio un error generando los codigos aletorios", "error");
    }
  };

  useEffect(() => {
    TitleChanger("Creacion de contenedores y asignacion");
  }, []);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          dataInfo={listaContenedores ?? []}
          IDcolumn="id"
          agregar={() => nuevoContenedor()}
          buscar
          columns={[
            {
              title: "Cantidad Items",
              field: "cantidadTotalItems"
            },
            {
              title: "Articulo",
              field: "articulo"
            },
            {
              title: "LPN Generada",
              field: "lpnGenerada"
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
                              verItems(row);
                              setOpenModalEliminar(true);
                              setContenedorSeleccionado(row);
                            }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Agregar Items">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              setOpenModalAgregar(true);
                              setContenedorSeleccionado(row);
                            }}>
                            <Add color="primary" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Examinar Items">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              setOpenModalExaminar(true);
                              setContenedorSeleccionado(row);
                            }}>
                            <Visibility color="primary" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Imprimir Etiqueta">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              setOpenModalImprimir(true);
                              setContenedorSeleccionado(row);
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
      </ContainerForPages>
      <ModalCompoment
        setOpenPopup={setOpenModalAgregar}
        openPopup={openModalAgregar}
        title="Agregar Items al Contenedor"
        titleModalStyle="Audit"
        showModalCenterPage
        subTitle="Agregar items a un contenedor">
        <AgregarItemsContenedores
          openModal={openModalAgregar}
          refreshLista={setListaContenedores}
          setOpenModal={setOpenModalAgregar}
          contenedorSeleccionado={contenedorSeleccionado}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalExaminar}
        openPopup={openModalExaminar}
        title="Examinar Items"
        titleModalStyle="Audit"
        showModalCenterPage
        subTitle="Examinar los items del contenedor">
        <ExaminarItems
          refreshLista={setListaContenedores}
          containerSeleecionado={contenedorSeleccionado}
          setOpenModal={setOpenModalExaminar}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalEliminar}
        openPopup={openModalEliminar}
        title="Eliminar Contenedor"
        titleModalStyle="Audit"
        showModalCenterPage
        subTitle="Eliminar contenedor seleccionado">
        <EliminarContenedor
          refreshLista={setListaContenedores}
          contenedorSeleccionado={contenedorSeleccionado}
          setOpenModal={setOpenModalEliminar}
          listaItems={containerConItems}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalImprimir}
        openPopup={openModalImprimir}
        title="Imprimir Etiqueta Padre"
        titleModalStyle="Audit"
        showModalCenterPage
        subTitle="Imprimir etiqueta del contenedor">
        <ImprimirEtiquetaPadre
          contenedorSeleccionado={contenedorSeleccionado}
          openModal={openModalImprimir}
          setOpenModal={setOpenModalImprimir}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
