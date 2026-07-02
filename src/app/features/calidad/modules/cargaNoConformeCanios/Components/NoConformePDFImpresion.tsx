/* eslint-disable unused-imports/no-unused-vars */
import { Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { QRCode } from "react-qrcode-logo";
import { IRechazoDobladora } from "../Models/IRechazoDobladora";

interface Props {
  datosNoConforme: IRechazoDobladora;
  componentRef: React.RefObject<HTMLDivElement>;
}

/**
 * Componente visual diseñado para ser impreso (hoja A4).
 * Muestra el detalle completo de un rechazo incluyendo un código QR.
 */
export const NoConformePDFImpresion: React.FC<Props> = ({ datosNoConforme, componentRef }) => {
  return (
    <main ref={componentRef} className="flex flex-col border-2 border-black rounded-lg m-10 bg-white h-[90vh] w-[95vw]">
      <header className="w-full border-b-2 border-black">
        <Typography color="black" textAlign="center" fontSize={32} fontWeight={700}>
          NO CONFORME CAÑOS
        </Typography>
      </header>
      <section className="flex flex-col justify-center px-3 py-4">
        <div className="flex justify-between flex-row border-2 border-black p-4 rounded-lg h-[10vh] items-center">
          <Typography fontSize={25} color={"black"} fontWeight={700}>
            Fecha: {moment(datosNoConforme.createdDate).format("L")}
          </Typography>
          <Typography fontSize={25} color={"black"} fontWeight={700}>
            Linea: {datosNoConforme.linea.descripcion}
          </Typography>
          <Typography fontSize={25} color={"black"} fontWeight={700}>
            Auditor: {datosNoConforme.operator.name} {datosNoConforme.operator.surname}
          </Typography>
        </div>
        <div className="flex flex-row justify-between w-full border-2 border-black rounded-lg mt-2 h-[65vh]">
          <div className="flex flex-col gap-y-3 border-r-2 border-black w-1/2 p-4">
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Máquina: {datosNoConforme.dobladora.codigoDobladora} - {datosNoConforme.dobladora.nombreDobladora}
            </Typography>
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Familia: {datosNoConforme.familia}
            </Typography>
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Caños: {datosNoConforme.articulo}
            </Typography>
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Descripción Caño: {datosNoConforme.descripcionCanio}
            </Typography>
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Causa Raíz: {datosNoConforme.multiplesCausas}
            </Typography>
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Descripción Causa Raíz: {datosNoConforme.multiplesDescripcionRechazo}
            </Typography>
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Etiqueta LPN: {datosNoConforme.lpn ? datosNoConforme.lpn : "No ingresado"}
            </Typography>
          </div>
          <div className="flex flex-col gap-y-6 w-1/2 p-4">
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Cantidad: {datosNoConforme.cantidadRechazada}
            </Typography>
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Descripcion Rechazo: {datosNoConforme.descripcionRechazoOperador}
            </Typography>
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              Acción Correctiva: {datosNoConforme.accionCorrectiva}
            </Typography>
            <Typography fontSize={25} color={"black"} fontWeight={700}>
              QR de identificación
            </Typography>
            <div className="w-full flex flex-col items-center justify-center mt-2">
              <QRCode value={datosNoConforme.codigoQr} logoWidth={100} />
              <Typography fontSize={25} color={"black"} fontWeight={700}>
                {datosNoConforme.codigoQr}
              </Typography>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
