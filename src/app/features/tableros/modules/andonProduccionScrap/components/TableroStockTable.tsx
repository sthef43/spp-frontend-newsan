import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { TrazaUnit_History2SliceRequests } from "app/Middleware/reducers/TrazaUnit_History2Slice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ITableroStock } from "app/models/ITableroStock";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import classNames from "classnames";
import React, { useState } from "react";

export const TableroStockTable = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const lineaPuestoTablero = useAppSelector((state) => state.lineaPuestoTablero.object);
  const linea = useAppSelector((state) => state.lineaProduccion.object);

  const [rechazosTable, setRechazosTable] = useState<ITableroStock[]>([]);

  const getTableRow = (element, index): JSX.Element => {
    return (
      <TableRow
        key={index}
        sx={{
          "&:last-child th, &:last-child td": {
            borderBottom: 1,
            breakInside: "avoid",
            color: "white"
          },
          "&:nth-of-type(odd)": {
            backgroundColor: "#9CA2C6",
            color: "white"
          }
        }}>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.familia}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.good}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.noGood}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.scrap / (element.good + element.noGood)}
        </TableCell>
      </TableRow>
    );
  };
  const setDataTable = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const data: ITableroStock[] = unwrapResult(
        await dispatch(
          TrazaUnit_History2SliceRequests.getGNGPorFamiliaTodayByLineaPuesto({
            lineaId: linea.id,
            lineaPuestoId: lineaPuestoTablero.lineaPuestoId,
            nombrePuesto: lineaPuestoTablero.lineaPuesto.puesto.nombre
          })
        )
      );
      setRechazosTable(data);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  React.useEffect(() => {
    if (lineaPuestoTablero?.producido > 0) {
      setDataTable();
    }
  }, [lineaPuestoTablero]);

  return (
    <div className="mt-5">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <div className="w-full py-1 text-lg text-white ">
            <TableContainer sx={{ boxShadow: "none", font: "black" }}>
              <Table size="small">
                <TableHead style={{ backgroundColor: "#FFF" }}>
                  <TableRow style={{ height: "75px" }}>
                    <TableCell
                      sx={{
                        color: "#121D48",
                        border: "0px",
                        textAlign: "center",
                        fontSize: "40px",
                        fontWeight: "bold"
                      }}>
                      GENERICO
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#121D48",
                        border: "0px",
                        textAlign: "center",
                        fontSize: "40px",
                        fontWeight: "bold"
                      }}>
                      GOOD
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#121D48",
                        border: "0px",
                        textAlign: "center",
                        fontSize: "40px",
                        fontWeight: "bold"
                      }}>
                      NO GOOD
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#121D48",
                        border: "0px",
                        textAlign: "center",
                        fontSize: "40px",
                        fontWeight: "bold"
                      }}>
                      % SCRAP
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{rechazosTable.map((element, index) => getTableRow(element, index))}</TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
