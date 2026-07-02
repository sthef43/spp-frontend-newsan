/* eslint-disable unused-imports/no-unused-vars */
import { ILinea, IPlanProd } from "app/models";
import React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  tableCellClasses
} from "@mui/material";

interface props {
  parentRef?: any;
  lineas: ILinea[];
  keys: string[];
  plantaNombre: string;
  keysTurno: string[];
  agrupados: any;
  fechaDesde: string;
  fechaHasta: string;
  noConformes: boolean;
  paradas: Array<{ idLinea: string; minutos: number; turno: string }>;
  lineasAgrupadas: any[];
}

// Estilos
const headerStyle = { color: "white", border: "0px", paddingRight: "5px", paddingLeft: "2px" };
const cellStyle = { color: "black", paddingRight: "5px", paddingLeft: "2px" };
const rowStyle = {
  overflow: "hidden",
  [`& .MuiTableCell-root`]: {
    borderBottom: "none"
  }
};

export const ImpresionInforme = ({
  plantaNombre,
  paradas,
  parentRef,
  lineas,
  keys,
  keysTurno,
  agrupados,
  fechaDesde,
  fechaHasta,
  noConformes,
  lineasAgrupadas //Placas
}: props): JSX.Element => {
  let totalProducido = 0;
  let totalNoConformes = 0;

  const getTableRow = (element, index): JSX.Element => {
    totalProducido += parseInt(element.cantidadProducida);
    totalNoConformes += parseInt(element.cantidadRechazos);
    return (
      <TableRow
        key={index}
        sx={{
          overflow: "hidden",
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none"
          }
        }}>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.turno}
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: "black", overflowX: "hidden" }}>
          {element.codigoModelo}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.lote}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.desde}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.hasta}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.cantidadProducida}
        </TableCell>
        <TableCell component="th" scope="row" style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.target}
        </TableCell>
        <TableCell
          hidden={!noConformes}
          component="th"
          scope="row"
          style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
          {element.cantidadRechazos}
        </TableCell>
      </TableRow>
    );
  };
  const getMinutos = (key: string, turno: string) => {
    const minutos = paradas?.find((p) => p?.idLinea == key && p?.turno == turno)?.minutos;
    return minutos ? `${minutos} min` : "0 min";
  };

  const resetProducidos = () => {
    totalProducido = 0;
    totalNoConformes = 0;
  };
  const getFPY = (array: IPlanProd[]) => {
    let cantidadProducidaGroup = 0;
    let rechazosGroup = 0;
    array.forEach((p) => {
      cantidadProducidaGroup += parseInt(p.cantidadProducida);
      rechazosGroup += p.rechazosDeLote;
    });
    const promedio = Math.round((cantidadProducidaGroup / (cantidadProducidaGroup + rechazosGroup)) * 100);
    return promedio;
  };
  return (
    <div ref={parentRef}>
      <div className="flex flex-col relative">
        <div className="grid grid-cols-5 grid-rows-2 bg-reporte p-4 col-span-4 items-center mb-6">
          <div className="col-start-1 col-span-2 row-span-2 row-start-1">
            <img
              src={`${import.meta.env.BASE_URL}imagenes/newsan/LogoNewsanBlanco.svg`}
              alt="logoNewsan"
              style={{ maxHeight: "150px" }}
            />
          </div>
          <div className="col-span-3 col-start-2 row-start-1 row-span-2 w-full text-center -mt-2 ml-20 text-4xl text-white flex justify-start">
            <h1>REPORTE DE PRODUCCIÓN {plantaNombre}</h1>
          </div>
        </div>
        <div className="text-end text-white flex justify-end absolute right-0 bottom-0 " style={{ top: "154px" }}>
          <p className="p-3 pt-3 pl-11 pr-11" style={{ background: "#4E7397", fontSize: "20px" }}>
            Fecha: Desde {fechaDesde} | Hasta {fechaHasta}
          </p>
        </div>
      </div>
      <div className="  px-4 text-gray-900 break-before-avoid-page ">
        {keys.map((key, index) => (
          <div key={index} style={{ color: "#00224D" }}>
            <Typography variant="h6" sx={{ color: "#00224D" }}>
              {lineas.find((x) => x?.idLinea == parseInt(key)).descripcion}
            </Typography>
            <hr />
            <div className="w-full py-1 text-lg text-black ">
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: "#4E7397" }}>
                      <TableCell style={{ color: "white", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                        TURNO
                      </TableCell>
                      <TableCell style={{ color: "white", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                        MODELO
                      </TableCell>
                      <TableCell style={{ color: "white", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                        LOTE
                      </TableCell>
                      <TableCell style={{ color: "white", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                        DESDE
                      </TableCell>
                      <TableCell style={{ color: "white", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                        HASTA
                      </TableCell>
                      <TableCell style={{ color: "white", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                        EMBALADOS
                      </TableCell>
                      <TableCell style={{ color: "white", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                        TARGET
                      </TableCell>
                      <TableCell
                        hidden={!noConformes}
                        style={{ color: "white", border: "0px", paddingRight: "5px", paddingLeft: "2px" }}>
                        N/C
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* {agrupados[key]?.map((element, index) => getTableRow(element, index))} */}
                    {agrupados?.map((group) =>
                      Object.keys(group)?.map((turno) => {
                        resetProducidos();
                        if (group[turno][0].idLinea == key)
                          return (
                            <>
                              {group[turno]?.map((element, index) => getTableRow(element, index))}
                              <TableCell
                                component="th"
                                scope="row"
                                style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}
                                colSpan={8}>
                                <div
                                  className="flex justify-end flex-row my-1 w-full"
                                  style={{ pageBreakAfter: "inherit", color: "#00224D" }}>
                                  <Typography
                                    className="text-right font-bold text-base pr-4 p-2"
                                    sx={{ background: "#E5E5E5", display: "flex" }}>
                                    FPY:
                                    <p
                                      className={`${getFPY(group[turno]) > 94 ? "text-green-700" : "text-yellow-500"} ${
                                        getFPY(group[turno]) < 90 && "text-red-700!important"
                                      }`}>
                                      {getFPY(group[turno])}%
                                    </p>
                                  </Typography>
                                  <Typography
                                    className="text-right font-bold text-base pr-4 p-2"
                                    sx={{ background: "#E5E5E5" }}>
                                    PRODUCIDOS: {totalProducido}
                                  </Typography>
                                  <Typography
                                    className="text-right font-bold text-base pr-4 p-2"
                                    sx={{ background: "#E5E5E5" }}>
                                    PARADAS DE LINEA: {getMinutos(key, turno)}
                                  </Typography>
                                  <Typography
                                    className="text-right font-bold text-base pr-4 p-2"
                                    hidden={!noConformes}
                                    sx={{ background: "#E5E5E5" }}>
                                    NO CONFORMES: {totalNoConformes}
                                  </Typography>
                                </div>
                              </TableCell>
                            </>
                          );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        ))}
      </div>

      {/* PLACAS lotesPlacas*/}
      {lineasAgrupadas.length > 0 && (
        <div className="px-4 text-gray-900 break-before-avoid-page">
          {lineasAgrupadas.map(({ linea, registros }, index) => (
            <div key={index} style={{ color: "#00224D" }}>
              <Typography variant="h6" sx={{ color: "#00224D" }}>
                {linea}
              </Typography>
              <hr />
              <div className="w-full py-1 text-lg text-black">
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ background: "#4E7397" }}>
                        <TableCell style={headerStyle}>TURNO</TableCell>
                        <TableCell style={headerStyle}>MODELO</TableCell>
                        <TableCell style={headerStyle}>LOTE</TableCell>
                        <TableCell style={headerStyle}>DESDE</TableCell>
                        <TableCell style={headerStyle}>HASTA</TableCell>
                        <TableCell style={headerStyle}>EMBALADOS</TableCell>
                        <TableCell style={headerStyle}>TARGET</TableCell>
                        <TableCell hidden={!noConformes} style={headerStyle}>
                          N/C
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {registros.map((item, i) => (
                        <TableRow key={i} sx={rowStyle}>
                          <TableCell style={cellStyle}>{item.turno}</TableCell>
                          <TableCell style={cellStyle}>{item.codigoModelo}</TableCell>
                          <TableCell style={cellStyle}>{item.lote}</TableCell>
                          <TableCell style={cellStyle}>-</TableCell>
                          <TableCell style={cellStyle}>-</TableCell>
                          <TableCell style={cellStyle}>{item.cantidadProducida}</TableCell>
                          <TableCell style={cellStyle}>-</TableCell>
                          <TableCell hidden={!noConformes} style={cellStyle}>
                            -
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={8} style={{ color: "black", paddingRight: "5px", paddingLeft: "2px" }}>
                          <div
                            className="flex justify-end flex-row my-1 w-full"
                            style={{ pageBreakAfter: "inherit", color: "#00224D" }}>
                            <Typography
                              className="text-right font-bold text-base pr-4 p-2"
                              sx={{ background: "#E5E5E5" }}>
                              FPY: N/A
                            </Typography>
                            <Typography
                              className="text-right font-bold text-base pr-4 p-2"
                              sx={{ background: "#E5E5E5" }}>
                              PRODUCIDOS: {registros.reduce((sum, item) => sum + item.cantidadProducida, 0)}
                            </Typography>
                            <Typography
                              className="text-right font-bold text-base pr-4 p-2"
                              sx={{ background: "#E5E5E5" }}>
                              PARADAS DE LINEA: {registros.reduce((sum, item) => sum + item.paradasPlacas, 0)} min
                            </Typography>
                            <Typography
                              className="text-right font-bold text-base pr-4 p-2"
                              hidden={!noConformes}
                              sx={{ background: "#E5E5E5" }}>
                              NO CONFORMES: N/A
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
