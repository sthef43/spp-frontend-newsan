import React from "react";
import { Chip, TableCell, Tooltip } from "@mui/material";
import _ from "lodash";
import { ResumenMensualRechazos } from "app/models/DTO/ResumenMensualRechazosdto";

interface fpyval {
  bg: string;
  color: "default" | "success" | "warning" | "primary" | "secondary" | "error" | "info";
}

const getProduccionByDay = (dia: number, produccion: any[]): any => {
  return produccion.find((d) => new Date(d.fecha).getDate() == dia);
};
const getTotalProduccion = (dia = 0, produccion: any[]): number => {
  let total = 0;
  if (dia > 0) {
    const prodTemp = getProduccionByDay(dia, produccion);
    total = prodTemp?.total ? prodTemp?.total : 0;
  } else {
    total = _.sumBy(produccion, "total");
  }

  return total;
};

const getTotalReparaciones = (dia = 0, reparaciones: any[]): number => {
  let total = 0;
  if (dia > 0) {
    total = _.sumBy(
      reparaciones.filter((d) => new Date(d.fecha).getDate() == dia),
      "total"
    );
  } else {
    total = _.sumBy(reparaciones, "total");
  }
  return total;
};

const getTotalRechazo = (puesto = null, dia = 0, rechazos: ResumenMensualRechazos[]): number => {
  let total = 0;
  if (puesto && dia == 0) {
    //rechazo total por puesto
    total = _.sumBy(
      rechazos.filter((d) => d.codigoRechazoCampos.descripcionPuesto == puesto),
      "total"
    );
  } else if (!puesto && dia > 0) {
    //rechazo total por dia
    total = _.sumBy(
      rechazos.filter((d) => new Date(d.fecha).getDate() == dia),
      "total"
    );
  } else if (puesto && dia > 0) {
    total = _.sumBy(
      rechazos.filter((d) => new Date(d.fecha).getDate() == dia && d.codigoRechazoCampos.descripcionPuesto == puesto),
      "total"
    );
  } else {
    //rechazo total
    total = _.sumBy(rechazos, "total");
  }
  return total;
};
const getTotalFPY = (dia: number, produccion: any[], rechazos: ResumenMensualRechazos[]): number => {
  const produccionTemp = getProduccionByDay(dia, produccion);
  const totalRechazos = _.sumBy(
    rechazos.filter((d) => new Date(d.fecha).getDate() == dia && d.codigoRechazoCampos.totaliza == "S"),
    "total"
  );

  if (produccionTemp?.total > 0 && totalRechazos == 0) {
    return 100;
  }

  if (produccionTemp?.total > 0 && totalRechazos > 0) {
    const fpy = Math.round((produccionTemp.total * 100) / (produccionTemp.total + totalRechazos));
    return fpy;
  }
  return 0;
};
const getColorFPY = (fpy: number): fpyval => {
  const values: fpyval = {
    bg: "#4CAF50",
    color: "success"
  };
  if (fpy >= 93) {
    return values;
  }
  if (fpy >= 90 && fpy < 93) {
    values.bg = "#d3e01c";
    values.color = "warning";
    return values;
  }
  if (fpy < 90) {
    values.bg = "#B44359";
    values.color = "error";
    return values;
  }
};
const getChip = (total: number, color: any, variant: any, styles = null): JSX.Element | "" => {
  return total > 0 ? <Chip color={color} variant={variant} style={styles} label={total} size="small" /> : "";
};
const getChipFPY = (fpy: number): JSX.Element | "" => {
  const val = getColorFPY(fpy);
  return fpy > 0 ? (
    <Chip color={val.color} style={{ fontWeight: "900", background: val.bg }} label={`${fpy}%`} size="small" />
  ) : (
    ""
  );
};
const getStyleNoTotaliza = (puesto: string, rechazos: any[]): boolean => {
  const rechazo = rechazos.find((d) => d.codigoRechazoCampos?.descripcionPuesto == puesto);
  return rechazo?.codigoRechazoCampos?.totaliza == "N" ? true : false;
};

const getRechazoComponent = (totaliza: boolean, rechazo: any[], classes: any): JSX.Element => {
  if (totaliza) {
    return (
      <Tooltip title="Rechazos no infieren en el FPY" placement="top">
        <TableCell component="td" scope="row" className={classes.totaliza}>
          {rechazo}
        </TableCell>
      </Tooltip>
    );
  }

  return (
    <TableCell component="td" scope="row">
      {rechazo}
    </TableCell>
  );
};

export {
  getProduccionByDay,
  getTotalReparaciones,
  getTotalProduccion,
  getTotalRechazo,
  getTotalFPY,
  getColorFPY,
  getChip,
  getChipFPY,
  getStyleNoTotaliza,
  getRechazoComponent
};
