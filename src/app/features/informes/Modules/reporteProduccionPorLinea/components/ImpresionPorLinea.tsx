import React from "react";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import { IPlanProd } from "app/models/IPlanProd";
import moment from "moment";

interface props {
  parentRef: any;
  producidos: IPlanProd[];
  linea: string;
  fechaDesde: string;
  fechaHasta: string;
}

export const ImpresionPorLinea = ({ parentRef, linea, fechaDesde, fechaHasta, producidos }: props): JSX.Element => {
  let totalProducido = 0;
  let totalNoConformes = 0;

  const getTableRow = (element, index): JSX.Element => {
    totalProducido += parseInt(element.cantidadProducida);
    totalNoConformes += parseInt(element.cantidadRechazos);
    return (
      <TableRow
        key={index}
        sx={{
          "&:last-child th, &:last-child td": {
            borderBottom: 0,
            breakInside: "avoid"
          }
        }}>
        <TableCell component="th" scope="row" sx={{ color: "black", overflowX: "hidden" }}>
          {element.codigoModelo}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {moment(element.fechaInicio).format("DD-MM-YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {moment(element.fechaFinal).format("DD-MM-YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.desde}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.hasta}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.cantidadProducida}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.cantidadRechazos}
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
            <h1>Resúmen de Producción por Línea</h1>
          </div>
          <div className="text-gray-900 text-center text-2xl">
            <p className="text-sm">
              Fecha desde: {fechaDesde} | Hasta: {fechaHasta}
            </p>
          </div>
        </div>
      </div>
      <div className="  px-4 text-gray-900 break-before-avoid-page ">
        <div className="text-gray-900 ">
          <Typography variant="h6">{linea}</Typography>
          <hr />
          <div className="w-full py-1 text-lg text-black ">
            <TableContainer sx={{ boxShadow: "none", background: "white", font: "black" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "black", border: "0px" }}>Modelo</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Fecha Inicio</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Fecha Fin</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Desde</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Hasta</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Embalados</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>No Conformes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{producidos.map((element, index) => getTableRow(element, index))}</TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="grid grid-cols-1 text-gray-900 my-6 mr-12" style={{ pageBreakAfter: "inherit" }}>
            <Typography className="text-right font-bold text-lg">Total producido: {totalProducido}</Typography>
            <Typography className="text-right font-bold text-lg">Total no conformes: {totalNoConformes}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
