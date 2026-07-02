import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { TrazaUnit_History2SliceRequests } from "app/Middleware/reducers/TrazaUnit_History2Slice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IRechazo } from "app/models/IRechazo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import classNames from "classnames";
import produce from "immer";
import React, { useState } from "react";
interface IRechazoTable {
  familia: string;
  producidos: number;
  rechazos: number;
}
export const TableroPuestoBody = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [colorAndon, setColorAndon] = useState("");
  const lineaPuestoTablero = useAppSelector((state) => state.lineaPuestoTablero.object);

  // const [rechazosTable, setRechazosTable] = useState<Dictionary<IRechazoTable>>({});
  const [rechazosTable, setRechazosTable] = useState<IRechazoTable[]>([]);

  const rechazos: IRechazo[] = useAppSelector((state) => state.rechazo.dataAll);

  const colores = {
    verde: "#0F2415",
    amarillo: "#FFBE16",
    rojo: "#96322c"
  };
  const getTableRow = (element, index): JSX.Element => {
    return (
      <TableRow
        key={index}
        sx={{
          "&:last-child th, &:last-child td": {
            borderBottom: 1,
            breakInside: "avoid"
          },
          "&:nth-of-type(odd)": {
            backgroundColor: colorAndon == "verde" ? "#9AD2C7" : colorAndon == "amarillo" ? "#F8E378" : "#EF787A"
          }
        }}>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: colorAndon == "amarillo" ? "black" : "white",
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
            color: colorAndon == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.producidos}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: colorAndon == "amarillo" ? "black" : "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "40px"
          }}>
          {element.rechazos}
        </TableCell>
      </TableRow>
    );
  };

  const setDataTable = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      for (const r of rechazos) {
        const { familia } = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.getByCodigo(r.barcode)));
        setDataRechazos(familia);
      }
      getProdByFamilia();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const getProdByFamilia = async (): Promise<void> => {
    try {
      const prodxFamilia: Array<{ familia: string; cantidad: number }> = unwrapResult(
        await dispatch(
          TrazaUnit_History2SliceRequests.getProduccidoPorFamiliaTodayByLineaPuesto(lineaPuestoTablero.lineaPuestoId)
        )
      );
      for (const prodF of prodxFamilia) {
        setDataRechazos(prodF.familia, prodF.cantidad);
      }
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const setDataRechazos = (familia: string, cantidad?: number) => {
    setRechazosTable(
      produce((draft) => {
        const index = draft.findIndex((f) => f.familia == familia);
        if (index != -1) {
          if (cantidad) {
            draft[index] = { ...draft[index], producidos: cantidad };
          } else {
            draft[index] = { ...draft[index], rechazos: draft[index].rechazos + 1 };
          }
        } else {
          if (cantidad) {
            draft.push({ familia, producidos: cantidad, rechazos: 0 });
          } else {
            draft.push({ familia, producidos: cantidad, rechazos: 1 });
          }
        }
      })
    );
  };

  // Si cambio la fecha reseteo todos los states
  // React.useEffect(() => {
  //   if (cambioFecha) {
  //     setRechazosTable({});
  //   }
  // }, [cambioFecha]);
  // Cuando hace la consulta en el  componente padre y tiene datos, actualiza el state para mostrar en pantalla
  React.useEffect(() => {
    if (rechazos) {
      setRechazosTable([]);
      setDataTable();
    }
  }, [rechazos]);
  React.useEffect(() => {
    if (lineaPuestoTablero?.producido > 0) {
      getProdByFamilia();
    }
  }, [lineaPuestoTablero]);

  return (
    <div className="mt-5">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <div className="w-full py-1 text-lg text-white ">
            <TableContainer
              sx={{
                boxShadow: "none",
                background:
                  colorAndon == "verde" ? colores.verde : colorAndon == "amarillo" ? colores.amarillo : colores.rojo,
                font: "black"
              }}>
              <Table size="small">
                <TableHead style={{ backgroundColor: "#151144", border: "white solid 1px" }}>
                  <TableRow style={{ height: "75px" }}>
                    <TableCell
                      sx={{
                        color: "white",
                        border: "0px",
                        textAlign: "center",
                        fontSize: "40px",
                        fontWeight: "bold"
                      }}>
                      FAMILIA
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        border: "0px",
                        textAlign: "center",
                        fontSize: "40px",
                        fontWeight: "bold"
                      }}>
                      CANTIDAD
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        border: "0px",
                        textAlign: "center",
                        fontSize: "40px",
                        fontWeight: "bold"
                      }}>
                      RECHAZOS
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
