/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import _ from "lodash";
import React from "react";
import classNames from "classnames";

const TableByPuestoIM = ({ cantidadByFamilia }: { cantidadByFamilia: any[] }): JSX.Element => {
  // Obtener los encabezados únicos (lineaPuestoId)
  const d = cantidadByFamilia.filter((d) => d.cantidad.length > 0);
  console.log(d);
  const headers = _(d).map("puesto").uniq().sort().value();

  const familias = _(d)
    .flatMap((item) =>
      item.cantidad.map((c) => ({
        familia: c.familia,
        puesto: item.puesto,
        cantidad: Number(c.cantidad) || 0
      }))
    )
    .groupBy("familia")
    .map((items, familia) => ({
      familia,
      cantidades: _.fromPairs(
        headers.map((header) => {
          const itemsEnPuesto = _.filter(items, { puesto: header });
          const total = _.sumBy(itemsEnPuesto, "cantidad");
          return [header, total > 0 ? total : null];
        })
      )
    }))
    .value();

  const getTotales = (puesto) => {
    const soloElPuesto = cantidadByFamilia.filter((d) => d.puesto == puesto);
    if (!soloElPuesto) {
      return 0;
    }
    return _.sumBy(
      soloElPuesto.flatMap((d) => d.cantidad),
      "cantidad"
    );
  };

  return (
    <TableContainer component={Paper} className={classNames("shadow-elevation-6 rounded-lg")}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Familia</TableCell>
            {headers.map((header) => (
              <TableCell key={header} align="right">
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {familias.map((familia, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {familia.familia}
              </TableCell>
              {headers.map((header) => (
                <TableCell align="right" key={header}>
                  {familia.cantidades[header] !== null ? familia.cantidades[header] : ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell component="th" scope="row">
              TOTAL
            </TableCell>
            {headers.map((header) => (
              <TableCell key={header} align="right">
                {getTotales(header)}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableByPuestoIM;
