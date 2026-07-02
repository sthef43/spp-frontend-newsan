import { QRCode } from "react-qrcode-logo";
import { Typography } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import moment from "moment";
import React from "react";

interface IOQCPaletPrintView {
  parentRef?: any;
  reproceso: boolean;
  estadoReimpresion: boolean;
}

export const OQCPaletPrintView = ({ parentRef, reproceso, estadoReimpresion }: IOQCPaletPrintView): JSX.Element => {
  const modeloSelecciono = useAppSelector((state) => state.oqcModelo.object);
  const lineaProduccion = useAppSelector((state) => state.lineaProduccion.object);
  const paletPrint = useAppSelector((state) => state.oqcPaletPrint.object);
  const palet = useAppSelector((state) => state.oqcPalet.object);

  return (
    <div
      ref={parentRef}
      className="flex m-5 flex-col border-black border-2 text-black bg-white"
      style={{ fontFamily: "Roboto" }}>
      <div>
        {reproceso ? (
          <div
            className={`${
              reproceso ? "bg-green-500 text-white" : "bg-red-500 text-white"
            } w-full border-b-2 border-black p-2`}>
            <Typography fontSize={50} fontWeight={700} textAlign="center" color={"black"}>
              {reproceso ? "CONFORME" : "NO CONFORME"}
            </Typography>
            <Typography fontSize={20} fontWeight={500} textAlign="center" color={"black"}>
              (Producto Reprocesado)
            </Typography>
          </div>
        ) : (
          <div
            className={`${
              estadoReimpresion ? "bg-green-500 text-white" : "bg-red-500 text-white"
            } w-full border-b-2 border-black p-2`}>
            <Typography fontSize={50} fontWeight={700} textAlign="center" color={"black"}>
              {estadoReimpresion ? "CONFORME" : "NO CONFORME"}
            </Typography>
          </div>
        )}
      </div>
      <div className="w-full border-b-2 border-black p-5 flex flex-row gap-5 justify-between">
        <Typography fontWeight={700} display="flex gap-4">
          Fecha: <Typography>{moment(paletPrint?.createdDate).format("L")}</Typography>
        </Typography>
        <Typography fontWeight={700} display="flex gap-4">
          Linea: <Typography>{lineaProduccion.nombre}</Typography>
        </Typography>
        <Typography fontWeight={700} display="flex gap-4">
          Turno: <Typography>{paletPrint?.turno.nombre}</Typography>
        </Typography>
        <Typography fontWeight={700} display="flex gap-4">
          Supervisor: <Typography>{paletPrint?.supervisor}</Typography>
        </Typography>
        <Typography fontWeight={700} display="flex gap-4">
          Auditor: <Typography>{paletPrint?.operator.name + " " + paletPrint?.operator.surname}</Typography>
        </Typography>
      </div>
      <div className="w-full border-b-2 border-black px-5 grid grid-cols-3 items-center">
        <div className="col-span-1 flex flex-col gap-5 ">
          <div className="flex flex-col gap-2 pt-5">
            <Typography fontWeight={700}>COMPAÑIA</Typography>
            <div className="p-5 border-black border-2">
              <Typography>{modeloSelecciono.compania}</Typography>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Typography fontWeight={700}>MODELO</Typography>
            <div className="p-5 border-black border-2">
              <Typography>{modeloSelecciono.modeloNewsan}</Typography>
            </div>
          </div>
          <div className="flex flex-col gap-2 pb-5">
            <Typography fontWeight={700}>OP-PRODUCCIÓN</Typography>
            <div className="p-5 border-black border-2">
              <Typography>{paletPrint?.numOp}</Typography>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col justify-between border-l-2 border-black ml-5 pl-5">
          <div className="flex flex-row gap-5 w-full justify-between">
            <div className="flex flex-col gap-2">
              <Typography fontWeight={700}>Serie Desde</Typography>
              <div className="p-5 border-black border-2">
                <Typography>{paletPrint?.numDesde}</Typography>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Typography fontWeight={700}>Serie Hasta</Typography>
              <div className="p-5 border-black border-2">
                <Typography>{paletPrint?.numHasta}</Typography>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Typography fontWeight={700}>
                {paletPrint?.ticketConforme ? "Cantidad aprobada" : "Rechazo unitario"}
              </Typography>
              <div className="p-5 border-black border-2">
                <Typography>{paletPrint?.total}</Typography>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-3">
            <div className="col-span-2">
              <div className="flex flex-col gap-2">
                <Typography fontWeight={700}> Master Box Unidades Rechazadas</Typography>
                <div className="p-5 border-black border-2">
                  <Typography>{paletPrint?.masterBox ? paletPrint?.masterBox : "----------------------"}</Typography>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Typography fontWeight={700}> Motivo de rechazo</Typography>
                <div className="p-5 border-black border-2">
                  <Typography>
                    {paletPrint?.motivoRechazo ? paletPrint?.motivoRechazo : "----------------------"}
                  </Typography>
                </div>
              </div>
            </div>
            {/*
            Esto es por si quieres que muestre el numero de lpn como nombre
            <div className="w-full flex justify-center flex-col">
              <Typography align="center" fontWeight={700}>
                LPN
              </Typography>
              <div className="w-full  flex justify-center">
                <QRCode value={paletPrint?.oqcPalet?.lpn} logoWidth={100} />
              </div>
              <Typography align="center" fontWeight={700} fontSize={25}>
                {paletPrint?.oqcPalet?.lpn}
              </Typography>
            </div>
            */}
            <div className="w-full flex justify-center flex-col">
              <Typography align="center" fontWeight={700}>
                NUMERO PALLET
              </Typography>
              <div className="w-full  flex justify-center">
                <QRCode value={palet.numeroPalet} logoWidth={100} />
              </div>
              <Typography align="center" fontWeight={700} fontSize={25}>
                {palet.numeroPalet}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-black p-2 ">
        <Typography fontSize={20} textAlign="center" color={"white"}>
          OBSERVACIÓN
        </Typography>
      </div>
      <div className="w-full border-b-2 border-black p-5">
        <Typography fontSize={15} textAlign="center" color={"black"}>
          {paletPrint?.observaciones}
        </Typography>
      </div>
      <div className="w-full border-b-2 border-black p-5">
        <Typography fontSize={15} textAlign="center" color={"black"}>
          Para obtener mayor información diríjase al OQC de la línea o al departamento de calidad con el número de LPN
          correspondiente.
        </Typography>
      </div>
    </div>
  );
};
