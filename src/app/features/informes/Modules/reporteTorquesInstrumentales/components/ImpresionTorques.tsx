import React from "react";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { ILimitesTraza, ILinea } from "app/models";
import moment from "moment";

interface props {
  parentRef: any;
  limites: ILimitesTraza[];
  linea: ILinea;
  fechaDesde: string;
  fechaHasta: string;
  turno: string;
}

export const ImpresionTorques = ({ parentRef, limites, linea, fechaDesde, fechaHasta, turno }: props): JSX.Element => {
  const getTableRow = (element: ILimitesTraza, index): JSX.Element => {
    return (
      <TableRow
        key={index}
        sx={{
          "& th": {
            borderBottom: 0,
            breakInside: "avoid",
            fontSize: "10px"
          }
        }}>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {moment(element.createdDate).format("H:mm:ss")}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.limites?.instpuesto?.sector}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.limites?.instpuesto?.descripcion}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.limites?.numeroPuesto}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.limites?.torqueMinimo}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.limites?.torqueMaximo}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.limites?.idColorNavigation?.color1}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element?.verificacion1 === true ? "S" : "N"}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element?.verificacion2 === true ? "S" : "N"}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element?.verificacion3 === true ? "S" : "N"}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element?.verificacion4 === true ? "S" : "N"}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element?.observaciones}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element?.correccion?.length > 0 ? element?.correccion : "Sin corrección"}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element?.userName?.length > 0 ? element?.userName : "Sin usuario"}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div style={{ boxShadow: "none", background: "white", font: "black" }} ref={parentRef}>
      <style type="text/css" media="print">
        {
          "\
  @page { size: landscape; margin: 0; background-color: #002b36 !important; }\
"
        }
      </style>
      <div className="grid grid-cols-3 gap-4 ">
        <div className=" text-gray-900">
          <img src={`${import.meta.env.BASE_URL}imagenes/newsan/logonewsan.png`} alt="logoNewsan" />
        </div>
        <div className="col-span-2">
          <div className="rounded-xl text-center px-4 py-2 text-xl underline underline-offset-2 font-semibold text-gray-900">
            <h1>Trazabilidad de Torquímetros {linea?.descripcion}</h1>
          </div>
          <div className="text-gray-900 text-center text-2xl">
            <p className="text-sm">
              Fecha desde: {fechaDesde} hasta: {fechaHasta} Turno: {turno}
            </p>
          </div>
        </div>
      </div>
      <div className="  px-4 text-gray-900 break-before-avoid-page ">
        <div className="text-gray-900 ">
          <div className="w-full py-1 text-base text-black ">
            <TableContainer style={{ boxShadow: "none", background: "white", font: "black" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Hora
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Sector
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Descripción
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Puesto
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Torque mínimo
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Torque máximo
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Color
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      V1
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      V2
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      V3
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      V4
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Observaciones
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Corrección
                    </TableCell>
                    <TableCell style={{ color: "black", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                      Usuario
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{limites.map((element: ILimitesTraza, index) => getTableRow(element, index))}</TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
