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

interface props {
  termoformado: LineasTermoformado;
  cambioFecha: boolean;
}

export const TablaAcumulado = ({ termoformado, cambioFecha }: props): JSX.Element => {
  const dispatch = useAppDispatch();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      color: theme.palette.common.white,
      backgroundColor: "#20234A",
      fontSize: 40,
      paddinTop: "20px",
      padding: "20px",
      fontFamily: "Montserrat"
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 25,
      fontFamily: "Roboto",
      padding: "0px",
      justifyContent: "space-around"
    },
    [`&.${tableCellClasses}`]: {
      "&:last-child th, &:last-child td": {
        borderBottom: 1,
        breakInside: "avoid"
      }
    }
  }));

  const [dataInfo, setDataInfo] = useState([]);

  const getInicios = async () => {
    try {
      const { diarioLineaPuestoId, consumoLineaPuesto } = termoformado;
      const result = unwrapResult(
        await dispatch(TableroRequests.getTableroTermoformados({ diarioLineaPuestoId, consumoLineaPuesto }))
      );
      console.log(result);
      setDataInfo(result);
    } catch (error) {
      console.log(error);
    }
  };
  const rellenar = (length) => {
    const fillerRows = Array(15 - length)
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

  const cambiarColorFila = (row) => {
    return (
      <TableRow key={row.familia}>
        <StyledTableCell align="center" component="th" scope="row">
          {row.familia}
        </StyledTableCell>
        <StyledTableCell align="center">{row.acumulado}</StyledTableCell>
        <StyledTableCell align="center" style={{ color: "#FAA7A8" }}>
          {row.scrapAcumulado}
        </StyledTableCell>
        <StyledTableCell align="center" style={{ color: "#FAA7A8" }}>
          {((row.scrapAcumulado * 100) / (row.acumulado + row.scrapAcumulado)).toFixed(2)}%
        </StyledTableCell>
      </TableRow>
    );
  };

  let identificadorIntervaloDeTiempo;
  //Funcion para que cada 30 seg refresque la info.
  function repetirCada5min() {
    identificadorIntervaloDeTiempo = setInterval(() => {
      getInicios();
    }, 300000);
  }

  return (
    <div className="relative" style={{ filter: "drop-shadow(9px 7px 8px rgba(0, 0, 0, 0.25))", height: "100%" }}>
      <div
        className={`shadow-elevation-4  absolute -top-12  p-1 px-32`}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}imagenes/fondos/fondo-tablero.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          left: "25%",
          borderRadius: "10px"
        }}>
        <h1
          style={{ fontFamily: "Montserrat", color: "#7FE2FF", textAlign: "center" }}
          className="w-full text-3xl font-bold">
          STOCK GENERAL
        </h1>
      </div>

      <div style={{ filter: "drop-shadow(9px 7px 8px rgba(0, 0, 0, 0.25))", height: "100%" }}>
        {dataInfo.length > 0 ? (
          <div>
            <TableContainer
              component={Paper}
              style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}imagenes/fondos/fondo-tablero.png)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
              }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell colSpan={4} align="center">
                      Acumulado
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell align="center" style={{ fontSize: "20px", padding: "5px" }}>
                      Generico
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{ fontSize: "20px", padding: "5px" }}>
                      GOOD
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{ fontSize: "20px", padding: "5px" }}>
                      NO GOOD
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{ fontSize: "20px", padding: "5px" }}>
                      Scrap %
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{dataInfo.map((row) => cambiarColorFila(row))}</TableBody>
                {dataInfo.length >= 15 ? <div></div> : rellenar(dataInfo.length)}
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
              minHeight: "300px"
            }}>
            <Typography
              className="w-full text-5xl py-10"
              style={{ textAlign: "center", fontFamily: "Montserrat", minHeight: "300px" }}>
              Sin informacion
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
