/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { Delete, Add, Print } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import {
  CLIContenedorItemsSlice,
  CLIContenedorItemsSliceRequest
} from "app/features/cli/Middlewares/CLIContenedorItemsSlice";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import FetchApi from "app/shared/helpers/FetchApi";
import { AsignarBateasModal } from "../modals/GenerarLpnPadre/AsignarBateasModal";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ImprimirLpnPadreModal } from "../modals/GenerarLpnPadre/ImprimirLpnPadreModal";
import { CLIContenedorItemsRecepcionBloqSliceRequest } from "app/features/cli/Middlewares/CLIContenedorItemsRecepcionBloqSlice";
import { ICLIContendorItems } from "app/features/cli/Models/ICLIContenedorItems";
import { ICLIContenedorItemsRecepcionBloq } from "app/features/cli/Models/ICLIContenedorItemsRecepcionBloq";

export const GenerarLpnPadre = () => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchPost, FetchDelete } = useFetchApiMultiResults<ICLIContendorItems>();
  const { getConfirmation } = useConfirmationDialog();

  const [openModalAsignarBateas, setOpenModalAsignarBateas] = useState(false);
  const [openModalImprimirEtiqueta, setOpenModalImprimirEtiqueta] = useState(false);

  const contenedores = useAppSelector((state) => state.cliContenedorItems.dataAll);
  FetchApi<ICLIContendorItems[]>(CLIContenedorItemsSliceRequest.GetByOptionLpn, "PROD", false, null, null, false);

  const nuevoContainer = async () => {
    const container = crearNuevoContenedor();
    if (await getConfirmation("Añadir container", "Desea añadir un nuevo contenedor?")) {
      FetchPost(CLIContenedorItemsSliceRequest.PostRequest, container, false, async (response: ICLIContendorItems) => {
        const nuevoBloque = generarNuevoBloque(response.id);
        await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.PostRequest(nuevoBloque));
        await dispatch(CLIContenedorItemsSliceRequest.GetByOptionLpn("PROD"));
        openNotificationUI("Se agrego el container correctamente", "success");
      });
    }
  };

  const deleteLpnPadre = async (padreId: number) => {
    FetchDelete({
      consoleLog: false,
      deleteId: padreId,
      sliceRequest: CLIContenedorItemsSliceRequest.DeleteRequest,
      mensajePersonalizado: true,
      messageUser: "Esta seguro de querer eliminar el lpn Padre?",
      titleUser: "Eliminar LPN Padre",
      functionAdd: async () => {
        await dispatch(CLIContenedorItemsSliceRequest.GetByOptionLpn("PROD"));
        openNotificationUI("Se Elimino el container correctamente", "success");
      }
    });
  };

  const generarNuevoBloque = (containerId: number) => {
    const bloque: ICLIContenedorItemsRecepcionBloq = {
      cliContenedorItemsId: containerId,
      recepcion: "Creado",
      cliSectoresId: 8
    };
    return bloque;
  };

  const crearNuevoContenedor = () => {
    let numeroLPN = "PROD0";
    let primerasLetras = "";
    let numerosAletorios = "";
    const arrayOriginal = ["A", "B", "C", "D", "E", "F"];

    for (let index = 0; index < 6; index++) {
      const j = Math.floor(Math.random() * 10);
      numeroLPN += j;
    }
    for (let index = 0; index < arrayOriginal.length; index++) {
      const j = Math.floor(Math.random() * arrayOriginal.length);
      primerasLetras = primerasLetras += arrayOriginal[j];
    }
    for (let index = 0; index < 12; index++) {
      numerosAletorios = numerosAletorios += String(Math.floor(Math.random() * 10));
    }
    const articuloAletorio = primerasLetras.substring(0, 3) + numerosAletorios;
    if (articuloAletorio) {
      const nuevoContainer: ICLIContendorItems = {
        lpnGenerada: numeroLPN,
        permisoAgregar: "Habilitado",
        articulo: articuloAletorio,
        cantidadTotalItems: 0,
        cantidadBateas: 0
      };
      return nuevoContainer;
    } else {
      openNotificationUI("Ocurrio un error generando los codigos aletorios", "error");
    }
  };

  const handelOpenModalAsignarBateas = (row: ICLIContendorItems) => {
    dispatch(CLIContenedorItemsSlice.actions.setContenedorObject(row));
    setOpenModalAsignarBateas(true);
  };

  const handelOpenModalImprimirEtiqueta = (row: ICLIContendorItems) => {
    dispatch(CLIContenedorItemsSlice.actions.setContenedorObject(row));
    setOpenModalImprimirEtiqueta(true);
  };

  return (
    <main className="mt-6 w-full">
      <section>
        <TableComponent
          dataInfo={contenedores}
          IDcolumn="id"
          agregar={() => nuevoContainer()}
          buscar
          columns={[
            {
              title: "Articulo",
              field: "articulo"
            },
            {
              title: "LPN Generada",
              field: "lpnGenerada"
            },
            {
              title: "Modelo",
              field: "",
              render: (row: ICLIContendorItems) => {
                return <>{row.modelo !== null ? <p>{`${row.modelo}`}</p> : <p>{`Sin asignar`}</p>}</>;
              }
            },
            {
              title: "Semielaborado",
              field: "",
              render: (row: ICLIContendorItems) => {
                return <>{row.semiElaborado !== null ? <p>{`${row.semiElaborado}`}</p> : <p>{`Sin asignar`}</p>}</>;
              }
            },
            {
              title: "Numero Op",
              field: "",
              render: (row: ICLIContendorItems) => {
                return <>{row.numeroOp !== null ? <p>{`${row.numeroOp}`}</p> : <p>{`Sin asignar`}</p>}</>;
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <section className="flex flex-row justify-start gap-x-2">
                    <div>
                      <Tooltip title="Eliminar ubicacion">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              deleteLpnPadre(row.id);
                            }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    {row.permisoAgregar == "Habilitado" && (
                      <div>
                        <Tooltip title="Agregar Items">
                          <span>
                            <IconButton
                              size="small"
                              style={{ position: "relative" }}
                              onClick={() => {
                                handelOpenModalAsignarBateas(row);
                              }}>
                              <Add color="primary" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                    )}
                    <div>
                      <Tooltip title="Imprimir Etiqueta">
                        <span>
                          <IconButton
                            disabled={row.modelo === null}
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              handelOpenModalImprimirEtiqueta(row);
                            }}>
                            <Print color={row.modelo === null ? "disabled" : "primary"} />
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
        setOpenPopup={setOpenModalAsignarBateas}
        openPopup={openModalAsignarBateas}
        title="Asignar Bateas">
        <AsignarBateasModal openModal={openModalAsignarBateas} setOpenModal={setOpenModalAsignarBateas} />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalImprimirEtiqueta}
        openPopup={openModalImprimirEtiqueta}
        title="Imprimir Etiqueta">
        <ImprimirLpnPadreModal openModal={openModalImprimirEtiqueta} setOpenModal={setOpenModalImprimirEtiqueta} />
      </ModalCompoment>
    </main>
  );
};
