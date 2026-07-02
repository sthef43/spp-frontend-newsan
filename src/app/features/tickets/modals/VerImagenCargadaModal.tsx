/* eslint-disable unused-imports/no-unused-vars */
import React from "react";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  urlImagen: string;
  vistaAgenteDetalles?: boolean;
  archivoChat?: boolean;
  openModal: boolean;
  ticketId?: number;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const VerImagenCargadaModal: React.FC<Props> = ({
  setOpenModal,
  urlImagen,
  vistaAgenteDetalles,
  openModal,
  ticketId,
  archivoChat
}) => {
  return (
    <main className="w-[60vw] h-[50vh]">
      {vistaAgenteDetalles && archivoChat == false ? (
        <figure className="w-full h-full flex justify-center">
          <img
            src={`${import.meta.env.BASE_URL}imagenes/archivos-tickets/${ticketId}/${urlImagen}`}
            alt="imagen cargada"
          />
        </figure>
      ) : (
        <figure className="w-full h-full flex justify-center">
          <img src={urlImagen} alt="imagen cargada" />
        </figure>
      )}
    </main>
  );
};
