/* eslint-disable unused-imports/no-unused-vars */
import {
  Delete,
  DescriptionOutlined,
  Download,
  ImageOutlined,
  PictureAsPdf,
  TableChartOutlined,
  Visibility
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { VerImagenCargadaModal } from "../VerImagenCargadaModal";
import React, { useState } from "react";
import { ITicketsArchivos } from "../../models/ITicketsArchivos";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { TicketsArchivosSliceRequest } from "../../reducers/TicketsArchivosSlice";

interface Props {
  openModal: boolean;
  setopenModal: (newValue: boolean) => void;
  srcImagen?: any[];
  vistaAgenteDetalles?: boolean;
  ticketId?: number;
  setListaArchivos?: (newValue: File[]) => void;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const ListaArchivosPreCargados: React.FC<Props> = ({
  openModal,
  setopenModal,
  srcImagen,
  vistaAgenteDetalles,
  setListaArchivos,
  ticketId
}) => {
  const dispatch = useAppDispatch();

  const [openModalImagen, setOpenModalImagen] = useState(false);

  const eliminarArchivo = (nombre: string) => {
    const clonListaArchivos = [...srcImagen];
    const nuevaLista = clonListaArchivos.filter((elementos) => {
      return elementos.file.name != nombre;
    });
    setListaArchivos(nuevaLista);
  };

  const [urlImagenSeleccionada, setUrlImagenSeleccionada] = useState("");
  const handleOpenModalVerImagen = async (nombreArchivo: string) => {
    try {
      LoadingUISlice.actions.LoadingUIOpen();
      const response = unwrapResult(
        await dispatch(
          TicketsArchivosSliceRequest.GetImageTicketPreview({ ticketId: ticketId, nombreArchivo: nombreArchivo })
        )
      );
      LoadingUISlice.actions.LoadingUIClose();
      if (response) {
        console.log(response);
        setUrlImagenSeleccionada(response);
        setOpenModalImagen(true);
      }
    } catch (error) {
      LoadingUISlice.actions.LoadingUIClose();
      console.log(error);
    } finally {
      LoadingUISlice.actions.LoadingUIClose();
    }
  };

  const handleDescarArchivo = async (url: string) => {
    try {
      LoadingUISlice.actions.LoadingUIOpen();
      const response = unwrapResult(
        await dispatch(TicketsArchivosSliceRequest.DownloadArchiveTicket({ ticketId: ticketId, nombreArchivo: url }))
      );
      LoadingUISlice.actions.LoadingUIClose();
      if (response) {
        console.log(response);
      }
    } catch (error) {
      LoadingUISlice.actions.LoadingUIClose();
      console.log(error);
    } finally {
      LoadingUISlice.actions.LoadingUIClose();
    }
  };

  const generarHtml = (elemento: ITicketsArchivos) => {
    if (elemento.tipoArchivo.includes("image")) {
      return (
        <Tooltip title="Examinar Imagen">
          <span>
            <IconButton
              onClick={() => {
                handleOpenModalVerImagen(elemento.urlArchivo);
              }}
              size="small"
              style={{ position: "relative" }}>
              <Visibility color="primary" />
            </IconButton>
          </span>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="Descargar Archivo">
          <a rel="noreferrer" onClick={() => handleDescarArchivo(elemento.urlArchivo)}>
            <IconButton size="small" style={{ position: "relative" }}>
              <Download color="primary" />
            </IconButton>
          </a>
        </Tooltip>
      );
    }
  };

  const generarImagen = (elemento: ITicketsArchivos) => {
    if (elemento.tipoArchivo.includes("image")) {
      return <ImageOutlined />;
    } else if (elemento.tipoArchivo.includes("pdf")) {
      return <PictureAsPdf />;
    } else if (elemento.tipoArchivo.includes("sheet") || elemento.tipoArchivo.includes("xlsx")) {
      return <TableChartOutlined />;
    } else {
      return <DescriptionOutlined />;
    }
  };

  return (
    <main className="w-[60vw]">
      {vistaAgenteDetalles ? (
        <>
          <div className="flex flex-col gap-y-4 justify-center w-full">
            {srcImagen &&
              srcImagen.length > 0 &&
              srcImagen.map((elementos) => (
                <figure
                  key={elementos.id}
                  className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center hover:bg-gray-300/35 transition-colors">
                  <div className="flex flex-row justify-between w-full items-center">
                    <div className="flex flex-row items-center gap-x-4">
                      <div>{generarImagen(elementos)}</div>
                      <div>
                        <h2 className="mb-2">{elementos.nombreOriginal}</h2>
                        <p className="text-xs text-gray-500">Tipo: {`${elementos.tipoArchivo}`}</p>
                      </div>
                    </div>
                    <div className="flex flex-row justify-center gap-x-4">
                      <div>{generarHtml(elementos)}</div>
                    </div>
                  </div>
                </figure>
              ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-y-4 justify-center w-full">
          {srcImagen && srcImagen.length > 0 ? (
            srcImagen.map((elementos, index) => (
              <figure
                key={index}
                className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center hover:bg-gray-300/35 transition-colors">
                <div className="flex flex-row justify-between w-full items-center">
                  <div>
                    <h2 className="mb-2">{elementos.file.name}</h2>
                    <p className="text-xs text-gray-500">Tipo: {`${elementos.file.type}`}</p>
                  </div>
                  <div className="flex flex-row justify-center gap-x-4">
                    <div>
                      <Tooltip title="Eliminar Archivo">
                        <span>
                          <IconButton
                            onClick={() => {
                              eliminarArchivo(elementos.file.name);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      {/* {elementos.type.includes("image") && (
                                            <Tooltip title="Examinar Imagen">
                                                <span>
                                                    <IconButton
                                                        onClick={() => { handleOpenModalVerImagen(elementos.url) }}
                                                        size="small"
                                                        style={{ position: "relative" }}>
                                                        <Visibility color="primary" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        )} */}
                    </div>
                  </div>
                </div>
              </figure>
            ))
          ) : (
            <p>No se Encontraron Items</p>
          )}
        </div>
      )}
      <ModalCompoment setOpenPopup={setOpenModalImagen} openPopup={openModalImagen} title="Imagen pre cargada">
        <VerImagenCargadaModal
          setOpenModal={setOpenModalImagen}
          urlImagen={urlImagenSeleccionada}
          openModal={openModalImagen}
          vistaAgenteDetalles
          ticketId={ticketId}
        />
      </ModalCompoment>
    </main>
  );
};
