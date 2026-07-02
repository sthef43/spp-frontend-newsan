import React from "react"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

interface Resultado {
    EquiposConSerie: any[];
    equiposSinSerie: string[];
}

interface Props {
    setOpenModal: (newValue: boolean) => void
    listaNumeros: Resultado
}

export const NumerosSinInicio: React.FC<Props> = ({ setOpenModal, listaNumeros }) => {
    console.log(listaNumeros)

    return (
        <main>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} aria-label="tablaNumeros">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, fontSize:"1rem"}}>Equipos sin declaracion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listaNumeros.equiposSinSerie?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )
}