import React from "react";

import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import classNames from "classnames";
import { ISPReparacion } from "app/models/ISPReparacion";
import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar, LabelList } from "recharts";

interface props {
  parentRef: any;
  reparaciones: ISPReparacion[];
  fechaDesde: any;
  fechaHasta: any;
  linea: string;
}
export const ImpresionReparaciones = ({
  parentRef,
  reparaciones,
  fechaDesde,
  fechaHasta,
  linea
}: props): JSX.Element => {
  let total = 0;

  const getTableRow = (element: ISPReparacion, index): JSX.Element => {
    total += element.total;
    //totalNoConformes += element.rechazados;
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
          {element.codigoDefecto}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.descripcionDefecto}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.codigoCausa}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.descripcionCausa}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.codigoOrigen}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.descripcionOrigen}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.total}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div style={{ boxShadow: "none", background: "white", font: "black" }} ref={parentRef}>
      <style type="text/css" media="print">
        {
          "\
  @page { size: A4; margin: 0; background-color: #002b36 !important; }\
"
        }
      </style>
      <div className="grid grid-cols-3 gap-4 ">
        <div className=" text-gray-900">
          <img src={`${import.meta.env.BASE_URL}imagenes/newsan/logonewsan.png`} alt="logoNewsan" />
        </div>
        <div className="col-span-2">
          <div className="rounded-xl text-center px-4 py-2 text-2xl underline underline-offset-2 font-semibold text-gray-900">
            <h1>Resúmen de Reparaciones</h1>
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
                    <TableCell style={{ color: "black", border: "0px" }}>Cod. Defecto</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Descripcion</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Cod. Causa</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Descripcion</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Cod. Origen</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Descripcion</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reparaciones.map((element: ISPReparacion, index) => getTableRow(element, index))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="grid grid-cols-1 text-gray-900 my-6 mr-12" style={{ pageBreakAfter: "inherit" }}>
            <Typography className="text-right font-bold text-lg">Total: {total}</Typography>
          </div>
          <div>
            {/*             <ResponsiveContainer width="100%" height={380}>
             */}{" "}
            <BarChart width={730} height={300} data={reparaciones}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="descripcionRechazo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#1FA552">
                <LabelList dataKey="total" position="top" />
              </Bar>
            </BarChart>
            {/* </ResponsiveContainer> */}
          </div>
        </div>
      </div>
    </div>
  );
};
