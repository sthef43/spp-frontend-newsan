/* eslint-disable react/display-name */
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
//import MaterialTable from "material-table";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from "@mui/material";
import { IInicio } from "app/models/IInicio";

interface props {
  inicios: IInicio[];
}

export const ProducidosDenseTable = ({ inicios }: props): JSX.Element => {
  return (
    <div>
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="w-full flex justify-center ">
          <TitleUIComponent title="Números de serie rechazados" classNameDiv="w-full whitespace-wrap mx-0" />
        </div>

        {/* <MaterialTable
            icons={tableIcons}
            localization={{
              body: {
                emptyDataSourceMessage: ""
              }
            }}
            style={{ fontSize: "small" }}
            columns={[
              {
                title: "Codigo Newsan",
                field: "codigoNewsan",
                render: (rowData) => {
                  return (
                    <div className="w-full grid grid-cols-3 sm:grid-cols-1 gap-4">
                      <div className="sm:hidden font-bold"> Codigo Newsan: </div>
                      <div className="col-span-2 text-right sm:text-left text-sm">{rowData.codigoNewsan}</div>
                    </div>
                  );
                }
              }
            ]}
            data={codigosFaltantes ?? []}
            options={{
              //filtering: true,
              //search: true,
              showTitle: false,
              toolbar: false,
              pageSize: 5,
              searchFieldStyle: {
                padding: 5,
                marginTop: 5
              },
              rowStyle: {
                fontSize: 10
              }
            }}
          /> */}
        <TableContainer component={Paper} style={{ height: "70vh" }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Código Trazabilidad</TableCell>
                <TableCell>Código Newsan</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Número de OP</TableCell>
                <TableCell>Lote</TableCell>
                <TableCell>Target</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inicios.map((row) => (
                <TableRow key={row.idInicio}>
                  <TableCell component="th" scope="row">
                    {row.codigoTrazabilidad}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.codigoNewsan}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.horaFin}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.modeloFin}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.nroOp}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.lote}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.target}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
