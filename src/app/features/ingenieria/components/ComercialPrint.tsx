import React from "react";
import { ISuperCargalinea } from "../../../models/ISuperCargalinea";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

interface props {
  superCargaLinea: ISuperCargalinea[];
  parentRef?: any;
  modelo: string;
  numOpyLote: { numOp: string; numLote: string };
}

export const ComercialPrint = ({ superCargaLinea, parentRef, modelo, numOpyLote }: props): JSX.Element => {
  const getTableRow = (element: ISuperCargalinea, index): JSX.Element => {
    return (
      <TableRow key={index} className="table-row">
        <TableCell
          component="th"
          scope="row"
          style={{
            color: "black",
            paddingRight: "5px",
            paddingLeft: "10px",
            fontSize: "10px",
            paddingTop: "1px",
            paddingBottom: "2px",
            border: "none"
          }}>
          {element.area}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            color: "black",
            overflowX: "hidden",
            fontSize: "10px",
            paddingTop: "1px",
            paddingBottom: "2px",
            border: "none"
          }}>
          {element.gaveta}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          style={{
            color: "black",
            paddingRight: "5px",
            paddingLeft: "2px",
            fontSize: "10px",
            paddingTop: "1px",
            paddingBottom: "2px",
            border: "none"
          }}>
          {element.codigoPautas}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          style={{
            color: "black",
            paddingRight: "5px",
            paddingLeft: "2px",
            fontSize: "10px",
            paddingTop: "1px",
            paddingBottom: "2px",
            border: "none"
          }}>
          {element.descripSector}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          style={{
            color: "black",
            paddingRight: "5px",
            paddingLeft: "2px",
            fontSize: "10px",
            paddingTop: "1px",
            paddingBottom: "2px",
            border: "none"
          }}>
          {element.descripcion}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          style={{
            color: "black",
            paddingRight: "5px",
            paddingLeft: "2px",
            fontSize: "10px",
            paddingTop: "1px",
            paddingBottom: "2px",
            border: "none"
          }}>
          {element.cantidadMaterial}
        </TableCell>
      </TableRow>
    );
  };
  return (
    <div ref={parentRef}>
      <div className="flex flex-col relative">
        <div className="grid grid-cols-5 grid-rows-2 bg-reporte p-4 col-span-4 items-center mb-6">
          <div className="col-start-1 col-span-2 row-span-2 row-start-1">
            <img
              src={`${import.meta.env.BASE_URL}imagenes/newsan/LogoNewsanBlanco.svg`}
              alt="logoNewsan"
              style={{ maxHeight: "110px" }}
            />
          </div>
          <div className="col-span-3 col-start-2 row-start-1 row-span-2 w-full text-center -mt-2 ml-20 text-2xl text-white flex justify-start">
            <h1>LISTA DE DISTRIBUCIÓN DE MATERIALES(Carga linea)</h1>
          </div>
        </div>
        <div className="text-end text-white flex justify-end absolute right-0 bottom-0 " style={{ top: "110px" }}>
          <p className="p-3 pt-3 pl-11 pr-11" style={{ background: "#4E7397", fontSize: "15px" }}>
            Modelo: {modelo} Lote: {numOpyLote.numLote} Número OP: {numOpyLote.numOp}
          </p>
        </div>
      </div>
      <div className="  px-4  text-gray-900 break-before-avoid-page break ">
        <div className="w-full py-1 text-lg text-black ">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#4E7397", paddingTop: "50px" }}>
                  <TableCell
                    style={{
                      color: "white",
                      border: "0px",
                      paddingRight: "5px",
                      paddingLeft: "10px",
                      paddingTop: "20px"
                    }}>
                    PANEL
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      border: "0px",
                      paddingRight: "5px",
                      paddingLeft: "2px",
                      paddingTop: "20px"
                    }}>
                    GAVETA
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      border: "0px",
                      paddingRight: "5px",
                      paddingLeft: "2px",
                      paddingTop: "20px"
                    }}>
                    CÓDIGO
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      border: "0px",
                      paddingRight: "5px",
                      paddingLeft: "2px",
                      paddingTop: "20px"
                    }}>
                    POSICIÓN
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      border: "0px",
                      paddingRight: "5px",
                      paddingLeft: "2px",
                      paddingTop: "20px"
                    }}>
                    DESCRIPCIÓN
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      border: "0px",
                      paddingRight: "5px",
                      paddingLeft: "2px",
                      paddingTop: "20px"
                    }}>
                    CANTIDAD
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{superCargaLinea?.map((superc, index) => getTableRow(superc, index))}</TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
