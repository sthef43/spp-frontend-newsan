import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { LineasTermoformado } from "./SeleccionarLineas";
import { TableroRequests } from "app/Middleware/reducers/TableroSlice";
import { ITableroTermoformado } from "app/models/Tableros/ITableroTermoformado";

interface props {
  termoformado: LineasTermoformado;
  cambioFecha: boolean;
}

export const TablaTermoformado = ({ termoformado, cambioFecha }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      color: theme.palette.common.white,
      backgroundColor: "#20234A",
      fontSize: 20,
      padding: "5px",
      fontFamily: "Montserrat"
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 25,
      fontFamily: "Roboto",
      padding: "0px"
    }
  }));

  const [dataInfo, setDataInfo] = useState<ITableroTermoformado[]>([]);

  const getInicios = async () => {
    console.log("el get inicios !!!");
    try {
      const { diarioLineaPuestoId, consumoLineaPuesto } = termoformado;
      const result = unwrapResult(
        await dispatch(TableroRequests.getTableroTermoformados({ diarioLineaPuestoId, consumoLineaPuesto }))
      );
      setDataInfo(result.filter((d) => d.diario > 0));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (termoformado != null) {
      getInicios();
      repetirCada5min();
    }
    return () => {
      clearInterval(identificadorIntervaloDeTiempo);
    };
  }, [termoformado]);
  // Si cambio la fecha reseteo todos los states
  React.useEffect(() => {
    if (cambioFecha) {
      setDataInfo([]);
    }
  }, [cambioFecha]);

  const cambiarColorFila = (row: ITableroTermoformado) => {
    const porcentajeScrap = (row.scrapDiario * 100) / (row.diario + row.scrapDiario);
    return (
      <TableRow key={row.familia}>
        <StyledTableCell align="center" component="th" scope="row">
          {row.familia}
        </StyledTableCell>
        <StyledTableCell align="center">{row.diario}</StyledTableCell>
        <StyledTableCell align="center" style={{ color: "#FAA7A8" }}>
          {row.scrapDiario}
        </StyledTableCell>
        <StyledTableCell align="center" style={{ color: "#FAA7A8" }}>
          {porcentajeScrap.toFixed(2)}%
        </StyledTableCell>
      </TableRow>
    );
  };
  const rellenar = (length) => {
    const fillerRows = Array(5 - length)
      .fill(1)
      .map((num, index) => (
        <TableRow key={index} className="border-0" style={{ height: "29px" }}>
          <StyledTableCell align="center" component="th" scope="row" className="border-0">
            <h1 className="hidden">{index}</h1>
          </StyledTableCell>
        </TableRow>
      ));
    return fillerRows;
  };

  let identificadorIntervaloDeTiempo;
  //Funcion para que cada 30 seg refresque la info.
  function repetirCada5min() {
    identificadorIntervaloDeTiempo = setInterval(() => {
      getInicios();
    }, 300000);
  }

  return (
    <div style={{ filter: "drop-shadow(9px 7px 8px rgba(0, 0, 0, 0.25))" }}>
      <div
        className={`shadow-elevation-4 text-center w-full p-1 mb-4`}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}imagenes/fondos/fondo-tablero.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          left: "25%",
          borderRadius: "10px"
        }}>
        <h1
          style={{ fontFamily: "Montserrat", color: "#7FE2FF", textAlign: "center" }}
          className="w-full text-4xl font-bold">
          {termoformado != null ? termoformado.linea.nombre.toUpperCase() : ""}
        </h1>
      </div>
      {dataInfo.length > 0 ? (
        <div>
          <TableContainer
            component={Paper}
            style={{
              backgroundImage: `url(${import.meta.env.BASE_URL}imagenes/fondos/fondo-tablero.png)`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover"
            }}>
            <Table sx={{ minWidth: 700, paddingTop: "10px" }} aria-label="customized table" size={"small"}>
              <TableHead style={{ paddingTop: "10px" }}>
                <TableRow>
                  <StyledTableCell align="center">GENERICO</StyledTableCell>
                  <StyledTableCell align="center">GOOD</StyledTableCell>
                  <StyledTableCell align="center">NO GOOD</StyledTableCell>
                  <StyledTableCell align="center">NO GOOD %</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataInfo.map((row) => cambiarColorFila(row))}
                {dataInfo.length >= 4 ? <div></div> : rellenar(dataInfo.length)}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div
          className="text-center flex items-center justify-center w-full h-full"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}imagenes/fondos/fondo-tablero.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            minHeight: "150px"
          }}>
          <Typography
            className="w-full text-5xl py-10"
            style={{ textAlign: "center", fontFamily: "Montserrat", minHeight: "150px" }}>
            Sin informacion
          </Typography>
        </div>
      )}
    </div>
  );
};
