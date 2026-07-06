import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { ResumenMensualRechazos } from "app/models/DTO/ResumenMensualRechazosdto";
import Chip from "@mui/material/Chip";
import { Theme } from "@mui/material";
import {
  getTotalReparaciones,
  getTotalProduccion,
  getTotalRechazo,
  getTotalFPY,
  getChip,
  getChipFPY,
  getStyleNoTotaliza,
  getRechazoComponent
} from "app/shared/helpers/resumenRechazoFunciones";
import ModalRechazoGrupal from "../modals/ModalRechazoGrupal";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { RechazoMultipleSliceRequests } from "app/Middleware/reducers/rechazoMultipleSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

interface propsRechazo {
  dias: number[];
  year: number;
  month: number;
  idLinea: number;
  rechazos: ResumenMensualRechazos[];
  puestos: any[];
  produccion: any[];
  reparaciones: any[];
}

export const TableRechazo = ({
  dias,
  rechazos,
  puestos,
  produccion,
  reparaciones,
  month,
  year,
  idLinea
}: propsRechazo): JSX.Element => {
  const dispatch = useAppDispatch();
  const [modalCargaMaterialesOpen, setModalCargaMaterialesOpen] = React.useState(false);
  const [rechazoMultiple, setRechazoMultiple] = React.useState([]);

  const onChipClick = async (dia, codigoRechazo, rechazos) => {
    try {
      const rechazosDia = rechazos.find(
        (d) => new Date(d.fecha).getDate() == dia && d.codigoRechazoCampos.descripcionPuesto == codigoRechazo
      );

      if (!rechazosDia) {
        return;
      }

      console.log(rechazosDia);

      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const rechazoMultiple = unwrapResult(
        await dispatch(
          RechazoMultipleSliceRequests.GetByDay({ day: dia, month, year, idLinea, codigoRechazo: rechazosDia.puesto })
        )
      );

      setRechazoMultiple(rechazoMultiple);
      setModalCargaMaterialesOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const classes = {
    rows: "text-center !p-[6px_5px]",
    columns: "text-center !p-[6px_5px]",
    totaliza: "text-[#6A5ACD] font-bold [&>div]:bg-[#6A5ACD] [&>div]:text-white [&>div]:border-none"
  };
  return (
    <div style={{ padding: "10px" }}>
      {dias.length > 0 && rechazos.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Rechazos</TableCell>
                {dias.map((d) => (
                  <TableCell key={d} className={classes.rows}>
                    <Chip size="small" style={{ background: "#D9D9D9", color: "black" }} label={d} />
                  </TableCell>
                ))}
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/** Columna Rechazo Total Por Puesto */}
              {puestos.map((row) => (
                <TableRow key={row} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  {getRechazoComponent(getStyleNoTotaliza(row, rechazos), row, classes)}
                  {dias.map((dia) => {
                    const total = getTotalRechazo(row, dia, rechazos);
                    return (
                      <TableCell
                        key={dia}
                        component="td"
                        scope="row"
                        className={`${classes.columns} ${getStyleNoTotaliza(row, rechazos) ? classes.totaliza : ""}`}>
                        {total > 0 ? (
                          <Chip
                            color="primary"
                            onClick={() => onChipClick(dia, row, rechazos)}
                            className="pointer"
                            variant="outlined"
                            label={total}
                            size="small"
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    component="td"
                    scope="row"
                    className={`${classes.columns} ${getStyleNoTotaliza(row, rechazos) ? classes.totaliza : ""}`}>
                    {getChip(getTotalRechazo(row, 0, rechazos), "info", "")}
                  </TableCell>
                </TableRow>
              ))}
              {/** Fila Rechazo Total */}
              <TableRow>
                <TableCell component="td" scope="row">
                  Rechazo Total
                </TableCell>
                {dias.map((dia) => {
                  return (
                    <TableCell key={dia} component="td" scope="row" className={classes.columns}>
                      {getChip(getTotalRechazo(null, dia, rechazos), "secondary", "")}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row">
                  {getChip(getTotalRechazo(null, 0, rechazos), "info", "")}
                </TableCell>
              </TableRow>
              {/** Fila Reparados */}
              <TableRow>
                <TableCell component="td" scope="row">
                  Reparados
                </TableCell>
                {dias.map((dia) => {
                  return (
                    <TableCell key={dia} component="td" scope="row" className={classes.columns}>
                      {getChip(getTotalReparaciones(dia, reparaciones), "primary", "outlined")}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row">
                  {getChip(getTotalReparaciones(0, reparaciones), "info", "")}
                </TableCell>
              </TableRow>
              {/** Fila Target */}
              <TableRow>
                <TableCell component="td" scope="row">
                  Target
                </TableCell>
                {dias.map((dia) => {
                  const target = produccion.find((d) => new Date(d.fecha).getDate() == dia);
                  return (
                    <TableCell key={dia} component="td" scope="row" className={classes.columns}>
                      {target && target.target ? (
                        <Chip color="info" variant="outlined" label={target.target} size="small" />
                      ) : (
                        ""
                      )}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row"></TableCell>
              </TableRow>
              {/** Fila Produccion */}
              <TableRow>
                <TableCell component="td" scope="row">
                  Produccion
                </TableCell>
                {dias.map((dia) => {
                  return (
                    <TableCell key={dia} component="td" scope="row" className={classes.columns}>
                      {getChip(getTotalProduccion(dia, produccion), "success", "", {
                        fontWeight: "900",
                        background: "#4CAF50"
                      })}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row">
                  {getChip(getTotalProduccion(0, produccion), "success", "", {
                    fontWeight: "900",
                    background: "#4CAF50"
                  })}
                </TableCell>
              </TableRow>
              {/** Fila FPY */}
              <TableRow>
                <TableCell component="td" scope="row">
                  % FPY
                </TableCell>
                {dias.map((dia) => {
                  return (
                    <TableCell key={dia} component="td" scope="row" className={classes.columns}>
                      {getChipFPY(getTotalFPY(dia, produccion, rechazos))}
                    </TableCell>
                  );
                })}
                <TableCell component="td" scope="row"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ModalCompoment
        title="Rechazo Multiple"
        openPopup={modalCargaMaterialesOpen}
        setOpenPopup={setModalCargaMaterialesOpen}>
        <ModalRechazoGrupal rechazoMultiple={rechazoMultiple} />
      </ModalCompoment>
    </div>
  );
};
