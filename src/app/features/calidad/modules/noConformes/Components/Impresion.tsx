import { ControlLoteMaterialesSliceRequests } from "app/Middleware/reducers/ControlLoteMaterialesSlice";
import { useAppDispatch } from "app/core/store/store";
import { IControlLoteMateriales } from "app/models/IControlLoteMateriales";

import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import React from "react";

export const Impresion = (props: any) => {
  const dispatch = useAppDispatch();
  const [listaMateriales, setListaMateriales] = React.useState<IControlLoteMateriales[]>([]); //LISTA DE MATERIALES

  const onInit = async (idControlLote: number) => {
    let getListaMateriales;
    try {
      getListaMateriales = unwrapResult(
        await dispatch(ControlLoteMaterialesSliceRequests.getMaterialesByIdControlLote(idControlLote))
      );
    } catch (error) {
      getListaMateriales = null;
    }
    if (getListaMateriales) {
      setListaMateriales(getListaMateriales);
    }
  };

  React.useEffect(() => {
    onInit(props.controlLote.idControlLote);
  }, []);
  return (
    <div className="bg-white w-screen h-screen mx-2 my-2" ref={props.parentRef}>
      <div className="rounded-xl text-center px-4 py-2 text-9xl font-semibold text-gray-900">
        <h1>NO CONFORMES</h1>
      </div>

      <hr className="border-black border-solid divide-y divide-solid divide-black " />
      <div className="mx-5">
        <div className="grid grid-cols-1 text-center text-6xl font-semibold text-black gap-2 m-5">
          <div>Línea: {props.linea?.descripcion}</div>
        </div>
        <div className="grid grid-cols-2 w-full text-center gap-2">
          <div className="col-span-1 rounded-lg text-center border-2 border-black border-solid py-1 text-2xl">
            <div className="grid grid-cols-1 text-center gap-2">
              <div className="grid grid-cols-1 w-full py-1 text-lg text-black">
                <div className="grid grid-cols-1 text-center text-xl font-semibold text-black gap-2 ml-2">
                  <div className="mb-2">INFORMACIÓN DEL RECHAZO</div>
                </div>
                <div className="grid grid-cols-2 w-full py-1 space-y-4 text-lg text-black">
                  <div className="mt-4">
                    <div>
                      <label className="font-semibold ">Modelo: </label>
                      {props.controlLote.codigoModelo}
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold">Auditor: </label>
                    {props.controlLote.nombreSupervisor}
                  </div>
                  <div>
                    <label className="font-semibold">Número OP: </label>
                    {props.controlLote.numeroOp}
                  </div>
                  <div>
                    <label className="font-semibold">Lote: </label>
                    {props.controlLote.lote}
                  </div>

                  <div>
                    <label className="font-semibold">Cantidad de Rechazos: </label>
                    {props.controlLote.cantidadRechazos}
                  </div>
                  <div>
                    <label className="font-semibold">Desde | Hasta: </label>
                    {props.controlLote.serieDesde} | {props.controlLote.serieHasta}
                  </div>
                </div>
                <div className="grid grid-cols-1 w-full py-1 space-y-4 text-lg text-black text-left  px-8 mt-4">
                  <div>
                    <label className="font-semibold">Fecha: </label>
                    {moment(props.controlLote.fecha).format("L")}
                  </div>
                  <div>
                    <label className="font-semibold">Causa: </label>
                    {props.causa?.descripcion}
                  </div>
                  <div>
                    <label className="font-semibold">Causa Raíz: </label>
                    {props.controlLote.planmejora}
                  </div>
                  <div>
                    <label className="font-semibold">Contenido Defectuoso: </label>
                    {props.controlLote.contenidoDefectuoso}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 rounded-lg text-center border-2 border-black border-solid py-1 text-2xl ">
            <div className="grid grid-cols-1 text-center gap-2">
              <div className="grid grid-cols-1 text-center text-xl font-semibold text-black gap-2 ml-2">
                <div className="mb-2">LISTA DE MATERIALES</div>
              </div>
              <div className="grid grid-cols-1 w-full py-1 text-lg text-black">
                <TableContainer component={Paper} sx={{ boxShadow: "none", backgroundColor: "white", color: "black" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow className="p-0">
                        <TableCell style={{ color: "black" }}>Codigo</TableCell>
                        <TableCell style={{ color: "black" }}>Descripción</TableCell>
                        <TableCell style={{ color: "black" }}>Cantidad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listaMateriales.map((row: IControlLoteMateriales) => (
                        <TableRow
                          key={row.idControlLoteMateriales}
                          sx={{ "&:last-child th, &:last-child td": { borderBottom: 0 } }}>
                          <TableCell component="th" scope="row" style={{ color: "black" }}>
                            {row.codigoPautas}
                          </TableCell>
                          <TableCell component="th" scope="row" style={{ color: "black" }}>
                            {row.descripcion}
                          </TableCell>
                          <TableCell align="right" style={{ color: "black" }}>
                            {row.cantidad}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
