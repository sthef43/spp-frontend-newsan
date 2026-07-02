import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import React from "react";
import classNames from "classnames";

interface props {
  puestos: any;
  rows: any;
}

export default function TableProductionByPuesto({ puestos, rows }: props): JSX.Element {
  return (
    <TableContainer component={Paper} className={classNames("shadow-elevation-6 rounded-lg")}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Hora Desde</TableCell>
            <TableCell>Hora Hasta</TableCell>
            {puestos.map((puesto) => (
              <TableCell key={puesto}>{puesto}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.horaDesde}:00 HS</TableCell>
              <TableCell>{row.horaHasta}:00 HS</TableCell>
              {puestos.map((puesto) => (
                <TableCell key={puesto}>{row[puesto]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
