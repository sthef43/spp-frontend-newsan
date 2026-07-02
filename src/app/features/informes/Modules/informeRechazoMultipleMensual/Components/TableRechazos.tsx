import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@mui/material";

import { IInformeRechazoMensual } from "app/models/IInformeRechazoMensual";
import _ from "lodash";
import React from "react";

interface Props {
  dias: number[];
  rechazos: IInformeRechazoMensual[];
  reparaciones: any[];
  producciones: any[];
}

interface fpyval {
  bg: string;
  color: "default" | "success" | "warning" | "primary" | "secondary" | "error" | "info";
}

export const TableRechazos: React.FC<Props> = ({ dias, rechazos, reparaciones, producciones }) => {

  const getTotalRechazo = (puesto = null, dia = 0, rechazos: IInformeRechazoMensual[]): number => {
    let total = 0;
    if (puesto && dia == 0) {
      //rechazo total por puesto
      total = _.sumBy(
        rechazos.filter((d) => d.componente == puesto),
        "totalDefectos"
      );
    } else if (!puesto && dia > 0) {
      //rechazo total por dia
      total = _.sumBy(
        rechazos.filter((d) => new Date(d.fecha).getDate() == dia),
        "totalDefectos"
      );
    } else if (puesto && dia > 0) {
      total = _.sumBy(
        rechazos.filter((d) => new Date(d.fecha).getDate() == dia && d.componente == puesto),
        "totalDefectos"
      );
    } else {
      //rechazo total
      total = _.sumBy(rechazos, "totalDefectos");
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

  const getProduccionByDay = (dia: number, produccion: any[]): any => {
    return produccion.find((d) => new Date(d.fecha).getDate() == dia);
  };

  const getTotalFPY = (dia: number, produccion: any[], rechazos: IInformeRechazoMensual[]): number => {
    const produccionTemp = getProduccionByDay(dia, produccion);
    const totalRechazos = _.sumBy(
      rechazos.filter((d) => new Date(d.fecha).getDate() == dia && d.totaliza == "S"),
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

  const getChipFPY = (fpy: number): JSX.Element | "" => {
    const val = getColorFPY(fpy);
    return fpy > 0 ? (
      <Chip color={val.color} style={{ fontWeight: "900", background: val.bg }} label={`${fpy}%`} size="small" />
    ) : (
      ""
    );
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

  const getChip = (total: number, color: any, variant: any, styles = null): JSX.Element | "" => {
    return total > 0 ? <Chip color={color} variant={variant} style={styles} label={total} size="small" /> : "";
  };

  const getStyleNoTotaliza = (puesto: string, rechazos: IInformeRechazoMensual[]): boolean => {
    const rechazo = rechazos.find((d) => d.componente == puesto);
    return rechazo.totaliza == "N" ? true : false;
  };

  console.log(rechazos);

  return (
    <main className="pb-6">
      {dias.length > 0 && rechazos.length > 0 && (
        <TableContainer component={Paper} sx={{ paddingBottom: "1rem" }}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Componente</TableCell>
                <TableCell>Sub Componente</TableCell>
                <TableCell>Defecto</TableCell>
                {dias.map((elementos, index) => (
                  <TableCell key={index}>
                    <Chip size="small" style={{ background: "#fff", color: "black" }} label={elementos} />
                  </TableCell>
                ))}
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Fila de Componentes, Defectos y Sub Componentes */}
              {rechazos.map((elementosRechazos, index) => (
                <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="elementos">
                    {elementosRechazos.componente}
                  </TableCell>
                  <TableCell component="th" scope="elementos">
                    {elementosRechazos.subComponente}
                  </TableCell>
                  <TableCell component="th" scope="elementos">
                    {elementosRechazos.defecto}
                  </TableCell>
                  {dias.map((elementosDias) => {
                    const total = getTotalRechazo(elementosRechazos.componente, elementosDias, rechazos);
                    return (
                      <TableCell key={elementosDias} component="td" scope="row">
                        {total > 0 ? (
                          <Chip color="primary" className="pointer" variant="outlined" label={total} size="small" />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    component="td"
                    scope="row"
                    sx={{
                      textAlign: "center",
                      padding: "6px 5px!important",
                      ...(getStyleNoTotaliza(elementosRechazos.componente, rechazos) && {
                        color: "slateblue",
                        fontWeight: "bold",
                        "& div": {
                          backgroundColor: "slateblue",
                          color: "white",
                          border: "none"
                        }
                      })
                    }}>
                    {getChip(getTotalRechazo(elementosRechazos.componente, 0, rechazos), "info", "")}
                  </TableCell>
                </TableRow>
              ))}
              {/* Fila de Rechazos Totales */}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>Rechazo Total</TableCell>
                {dias.map((elementos) => {
                  return (
                    <TableCell key={elementos} component="td" scope="row">
                      {getChip(getTotalRechazo(null, elementos, rechazos), "secondary", "")}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row">
                  {getChip(getTotalRechazo(null, 0, rechazos), "info", "")}
                </TableCell>
              </TableRow>
              {/* Fila de Reparaciones */}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>Reparaciones</TableCell>
                {dias.map((elementos) => {
                  return (
                    <TableCell key={elementos} component="td" scope="row">
                      {getChip(getTotalReparaciones(elementos, reparaciones), "primary", "outlined")}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row">
                  {getChip(getTotalReparaciones(0, reparaciones), "info", "")}
                </TableCell>
              </TableRow>
              {/* Fila de Target */}
              <TableRow>
                <TableCell component="td" scope="row"></TableCell>
                <TableCell component="td" scope="row"></TableCell>
                <TableCell component="td" scope="row">
                  Target
                </TableCell>
                {dias.map((dia) => {
                  const target = producciones.find((d) => new Date(d.fecha).getDate() == dia);
                  return (
                    <TableCell key={dia} component="td" scope="row" sx={{ textAlign: "center", padding: "6px 5px!important" }}>
                      {target && target.target ? (
                        <Chip color="info" variant="outlined" label={target.target} size="small" />
                      ) : (
                        ""
                      )}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row"></TableCell>
                {/* Fila de produccion */}
              </TableRow>
              <TableRow>
                <TableCell component="td" scope="row"></TableCell>
                <TableCell component="td" scope="row"></TableCell>
                <TableCell component="td" scope="row">
                  Produccion
                </TableCell>
                {dias.map((dia) => {
                  return (
                    <TableCell key={dia} component="td" scope="row" sx={{ textAlign: "center", padding: "6px 5px!important" }}>
                      {getChip(getTotalProduccion(dia, producciones), "success", "", {
                        fontWeight: "900",
                        background: "#4CAF50"
                      })}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row">
                  {getChip(getTotalProduccion(0, producciones), "success", "", {
                    fontWeight: "900",
                    background: "#4CAF50"
                  })}
                </TableCell>
              </TableRow>
              {/* Fila de FPY */}
              <TableRow>
                <TableCell component="td" scope="row"></TableCell>
                <TableCell component="td" scope="row"></TableCell>
                <TableCell component="td" scope="row">
                  % FPY
                </TableCell>
                {dias.map((dia) => {
                  return (
                    <TableCell key={dia} component="td" scope="row" sx={{ textAlign: "center", padding: "6px 5px!important" }}>
                      {getChipFPY(getTotalFPY(dia, producciones, rechazos))}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </main>
  );
};
