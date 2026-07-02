/* eslint-disable unused-imports/no-unused-vars */
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import React, { useEffect, useState } from "react";
import { InformePlacasAutomotrizSP } from "../Interfaces/InformePlacasAutomotrizSP";

interface objetoValidacion {
  entrada: number;
  salida: number;
  valido: boolean;
  position: boolean;
}

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  placaSeleccionada: InformePlacasAutomotrizSP | null;
}

export const TablaDeAGSModal: React.FC<Props> = ({ openModal, setOpenModal, placaSeleccionada }) => {
  const medicionesFijas = [-11.50000000000001, -11.300000000000011, -11.100000000000012, -10.900000000000013];

  const [numerosBuscados, setNumerosBuscados] = useState<objetoValidacion[]>([]);
  const buscarNumeros = () => {
    const indicesEncontrados: objetoValidacion[] = [];
    placaSeleccionada.dataParseada.agc.entrada.forEach((elementos, index) => {
      const encontrado = medicionesFijas.some((fijas) => {
        return fijas == elementos;
      });
      if (encontrado || !encontrado) {
        const nuevoObjeto = {
          entrada: elementos,
          salida: placaSeleccionada.dataParseada.agc.salida[index],
          position: encontrado ? true : false,
          valido: placaSeleccionada.dataParseada.agc.salida[index] > 0 && encontrado ? true : false
        };
        indicesEncontrados.push(nuevoObjeto);
      }
    });
    setNumerosBuscados(indicesEncontrados);
  };

  useEffect(() => {
    buscarNumeros();
  }, [openModal]);

  return (
    <main className="w-[65vw]">
      {numerosBuscados.length == 25 && (
        <TableContainer component={Paper} sx={{ marginTop: "1rem", height: "100%", border: "none" }}>
          <Table sx={{ width: "100%", border: "1px solid gray", borderRadius: "6px" }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--secondary-color)" }}>
              <TableRow>
                <TableCell>Entrada</TableCell>
                <TableCell>Salida</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {numerosBuscados.map((elementos, index) => (
                <TableRow
                  className={`${elementos.position ? "bg-backgroundTableAGC" : ""}`}
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0, borderBottom: "none" } }}>
                  <TableCell className="border-none">{elementos.entrada}</TableCell>
                  <TableCell
                    className={`${
                      !elementos.position ? "text-textColor" : elementos.valido ? "text-green-500" : "text-red-500"
                    } border-none`}>
                    {elementos.salida}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </main>
  );
};
