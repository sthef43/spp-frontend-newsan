import React from "react";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import { IInicio } from "app/models";
import moment from "moment";

interface props {
  parentRef: any;
  producidos: IInicio[];
  modelo: string;
}

export const ImpresionPorModelo = ({ parentRef, modelo, producidos }: props): JSX.Element => {
  let totalProducido = 0;
  let totalNoConformes = 0;

  const getTableRow = (element: IInicio, index): JSX.Element => {
    totalProducido += element.producido;
    totalNoConformes += element.rechazados;
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
          {moment(element.fecha).format("DD-MM-YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.desde}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.hasta}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.producido}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black" }}>
          {element.rechazados}
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
            <h1>Resúmen de Producción por Modelo</h1>
          </div>
        </div>
      </div>
      <div className="  px-4 text-gray-900 break-before-avoid-page ">
        <div className="text-gray-900 ">
          <Typography variant="h6">{modelo}</Typography>
          <hr />
          <div className="w-full py-1 text-lg text-black ">
            <TableContainer sx={{ boxShadow: "none", background: "white", font: "black" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "black", border: "0px" }}>Fecha</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Desde</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Hasta</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>Embalados</TableCell>
                    <TableCell style={{ color: "black", border: "0px" }}>No Conformes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{producidos.map((element: IInicio, index) => getTableRow(element, index))}</TableBody>
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
