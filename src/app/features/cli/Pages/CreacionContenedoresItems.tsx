import { Add, Delete, Print, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import React, { useEffect, useState } from "react";
import { AgregarItemsContenedores } from "../Modals/CreacionContenedoresItems/AgregarItemsContenedores";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ExaminarItems } from "../Modals/CreacionContenedoresItems/ExaminarItems";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { EliminarContenedor } from "../Modals/CreacionContenedoresItems/EliminarContenedor";
import { ImprimirEtiquetaPadre } from "../Modals/CreacionContenedoresItems/ImprimirEtiquetaPadre";
import { ICLIContendorItems } from "../Models/ICLIContenedorItems";
import { ICLIImpresionEtiquetas } from "../Models/ICLIImpresionEtiquetas";
import { UseGeneratorCodesForLabels } from "app/shared/hooks/useGeneratorCodesForLabels";
import { CLIContenedorItemsSliceRequest } from "../Middlewares/CLIContenedorItemsSlice";

export const CreacionContenedoresItems = () => {
  const dispatch = useAppDispatch();

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

  FetchApi<ICLIContendorItems[]>(
    CLIContenedorItemsSliceRequest.GetByOptionLpn,
    "CLI",
    true,
    null,
    setListaContenedores
  );

  const nuevoContainer = async () => {
    const container = crearNuevoContenedor();
    try {
      if (await getConfirmation("Añadir container", "Desea añadir un nuevo contenedor?")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.PostRequest(container)));
        const refresh = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.GetByOptionLpn("CLI")));
        if (response) {
          openNotificationUI("Se agrego el container correctamente", "success");
          setListaContenedores(refresh);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const verItems = async (rowItems: ICLIContendorItems) => {
    try {
      const response = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.GetAllWithItemsId(rowItems.id)));
      if (response) {
        setContainerConItems(response.cliImpresionEtiquetas);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const crearNuevoContenedor = () => {
    const articulo = generateArticleCode(["A", "B", "C", "D", "E", "F"], 12, 3);
    const lpn = generateLpnWitPrefixCode(6, "CLI0");
    if (articulo) {
      const nuevoContainer: ICLIContendorItems = {
        lpnGenerada: lpn,
        articulo: articulo,
        cantidadTotalItems: 0,
        permisoAgregar: "Habilitado"
      };
      return nuevoContainer;
    } else {
      openNotificationUI("Ocurrio un error generando los codigos aletorios", "error");
    }
  };

  useEffect(() => {
    TitleChanger("Creacion de contenedores y asignacion");
  });

  return (
    <main className="p-4">
      <section>
        <TableComponent
          dataInfo={listaContenedores == null ? [] : listaContenedores}
          IDcolumn="id"
          agregar={() => nuevoContainer()}
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
      </section>
      <ModalCompoment
        setOpenPopup={setOpenModalAgregar}
        openPopup={openModalAgregar}
        title="Agregar Items al Contenedor">
        <AgregarItemsContenedores
          openModal={openModalAgregar}
          refreshLista={setListaContenedores}
          setOpenModal={setOpenModalAgregar}
          contenedorSeleccionado={contenedorSeleccionado}
        />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModalExaminar} openPopup={openModalExaminar} title="Examinar Items">
        <ExaminarItems
          refreshLista={setListaContenedores}
          containerSeleecionado={contenedorSeleccionado}
          setOpenModal={setOpenModalExaminar}
        />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModalEliminar} openPopup={openModalEliminar} title="Eliminar Contenedor">
        <EliminarContenedor
          refreshLista={setListaContenedores}
          contenedorSeleccionado={contenedorSeleccionado}
          setOpenModal={setOpenModalEliminar}
          listaItems={containerConItems}
        />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModalImprimir} openPopup={openModalImprimir} title="Imprimir Etiqueta Padre">
        <ImprimirEtiquetaPadre
          contenedorSeleccionado={contenedorSeleccionado}
          openModal={openModalImprimir}
          setOpenModal={setOpenModalImprimir}
        />
      </ModalCompoment>
    </main>
  );
};
