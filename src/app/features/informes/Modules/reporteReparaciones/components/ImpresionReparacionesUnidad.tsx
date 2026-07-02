/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import { IReparacion } from "app/models/IReparacion";
import dayjs from "dayjs";

interface props {
  parentRef: any;
  reparaciones: IReparacion[];
  fechaDesde: any;
  fechaHasta: any;
  linea: string;
}

export const ImpresionReparacionesUnidad = ({
  parentRef,
  reparaciones,
  fechaDesde,
  fechaHasta,
  linea
}: props): JSX.Element => {
  const total = 0;

  const getTableRow = (element, index): JSX.Element => {
    return (
      <TableRow
        key={index}
        sx={{
          "&:last-child th, &:last-child td": {
            borderBottom: 0,
            breakInside: "avoid"
          }
        }}>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {dayjs(element.fecha).format("DD/MM/YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.hora}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.codigoTrazabilidad}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.defecto?.descripcion}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.causas?.descripcion}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.origenes?.descripcion}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.descripcion}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div style={{ boxShadow: "none", background: "white", font: "black" }} ref={parentRef}>
      <style type="text/css" media="print">
        {
          "\
  @page { size: landscape; margin: 0; background-color: #002b36 !important; }\
"
        }
      </style>
      <div className="grid grid-cols-3 gap-4 ">
        <div className=" text-gray-900">
          <img src={`${import.meta.env.BASE_URL}imagenes/newsan/logonewsan.png`} alt="logoNewsan" />
        </div>
        <div className="col-span-2">
          <div className="rounded-xl text-center px-4 py-2 text-2xl underline underline-offset-2 font-semibold text-gray-900">
            <h1>Detalle Diario de Reparaciones</h1>
          </div>
          <div className="text-gray-900 text-center text-2xl">
            <p className="text-sm">
              Fecha desde: {fechaDesde} | Fecha Hasta: {fechaHasta}
            </p>
          </div>
        </div>
      </div>
      <div className="  px-4 text-gray-900 break-before-avoid-page ">
        <div className="text-gray-900 ">
          <Typography textAlign="center" variant="h6">
            {linea}
          </Typography>
          <hr />
          <div className="w-full py-1 text-lg text-black ">
            <TableContainer
              sx={{
                tableContainer: {
                  boxShadow: "none",
                  background: "white",
                  font: "black"
                }
              }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "black", border: "0px" }}>Fecha</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Hora</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Código</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Defecto</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Causa</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Origen</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Descripción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{reparaciones.map((element: IReparacion, index) => getTableRow(element, index))}</TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
