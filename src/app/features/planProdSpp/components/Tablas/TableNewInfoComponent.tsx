// /* eslint-disable unused-imports/no-unused-vars */
import React from 'react';
// import { useAppDispatch, useAppSelector } from "app/Middleware/store/store"
// import styled from '@emotion/styled';
// import { IconButton, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material';
// import { Add, Edit, Remove } from '@mui/icons-material';
// import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
// import { useNotificationUI } from 'app/shared/hooks/useNotificationUI';
// import { LoadingUISlice } from 'app/Middleware/reducers/LoadingUISlice';
// import { unwrapResult } from '@reduxjs/toolkit';
// import { PlanProdSppSlice, PlanProdSppSliceRequest } from '../../reducers/PlanProdSppSlice';
// import { IGeneratePlanProd } from '../../models/DTOS/IGeneratePlanProd';
// import { StatesFormModalsSlice } from '../../reducers/StatesForModalsSlice';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//         backgroundColor: 'var(--background-color-table-planProdSpp)',
//         color: 'var(--text-color)',
//         padding: 6,
//         minWidth: 120
//     },
//     [`&.${tableCellClasses.body}`]: {
//         fontSize: 14,
//         padding: 10,
//     }
// }))

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:nth-of-type(even)': {
//         backgroundColor: 'var(--background-color-table-planProdSpp)',
//     },
//     '&:last-child td, &:last-child th': {
//         border: 0
//     }
// }))

// const cellSx = {
//     minWidth: 100,
//     textAlign: 'center',
//     p: 1,
//     verticalAlign: 'middle',
//     backgroundColor: 'var(--background-color)',
//     border: "none"
// }

// export const TableNewInfoComponent = () => {
//     const { planProdNew } = useAppSelector((state) => state.planProdSpp)
//     const { mostrarInformacionModeloNuevaTabla } = useAppSelector((state) => state.statesFormModals)

//     const { openNotificationUI } = useNotificationUI()
//     const dispatch = useAppDispatch()

//     const [mostrarContenedores, setMostrarContenedores] = useState(false)

//     const [page, setPage] = useState(0)
//     const [rowsPerPage, setRowsPerPage] = useState(5)

//     const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataFormatExcel.length) : 0

//     const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
//         setPage(newPage);
//     }

//     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         setRowsPerPage(parseInt(event.target.value, 10))
//         setPage(0)
//     }

//     const generarEstado = (rowEstado: string) => {
//         switch (rowEstado) {
//             case "Liberado":
//                 return (
//                     <span className="bg-green-500 px-4 py-0.5 rounded-sm"></span>
//                 )
//             case "En Aduana":
//                 return (
//                     <span className="bg-orange-500 px-4 py-0.5 rounded-sm"></span>
//                 )
//             case "Sin Liberar":
//                 return (
//                     <span className="bg-red-500 px-4 py-0.5 rounded-sm"></span>
//                 )
//         }
//     }

//     const filtrarKbtuPorFamilia = (familia: string) => {
//         if (!familia) {
//             return ""
//         }
//         const pkbu = familia.match(/\d+/g).join("")
//         return pkbu
//     }


//     console.log(lineaProduccion.object)

//     return (
//         <main>
//             <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: 600 }} size="medium" aria-label="customized table">
//                     <TableHead>
//                         <TableRow>
//                             {mostrarContenedores && (
//                                 <StyledTableCell align="center">Accion</StyledTableCell>
//                             )}
//                             <StyledTableCell align="center">Accion</StyledTableCell>
//                             <StyledTableCell align="center">SKU</StyledTableCell>
//                             <StyledTableCell align="center">Pw(W)</StyledTableCell>
//                             <StyledTableCell align="center">
//                                 Categoria
//                                 <Tooltip title="Desplegar Datos">
//                                     <IconButton
//                                         onClick={() => { dispatch(StatesFormModalsSlice.actions.setShowMostrarInformacionModeloNuevaTabla(!mostrarInformacionModeloNuevaTabla)); }}
//                                         style={{ position: "relative" }} size="small">
//                                         {!mostrarInformacionModeloNuevaTabla ? (
//                                             <Add color="primary" />
//                                         ) : (
//                                             <Remove color="primary" />
//                                         )}
//                                     </IconButton>
//                                 </Tooltip>
//                             </StyledTableCell>
//                             {/* DATOS DESGLOZADOS */}
//                             {mostrarInformacionModeloNuevaTabla && (
//                                 <>
//                                     <TableCell align="center" sx={{ backgroundColor: "aquamarine", minWidth: 120 }}>Proveedor</TableCell>
//                                     <TableCell align="center" sx={{ backgroundColor: "aquamarine", minWidth: 120 }}>Marca</TableCell>
//                                     <TableCell align="center" sx={{ backgroundColor: "aquamarine", minWidth: 120 }}>Pw(KBTU)</TableCell>
//                                     <TableCell align="center" sx={{ backgroundColor: "aquamarine", minWidth: 120 }}>Familia</TableCell>
//                                     <TableCell align="center" sx={{ backgroundColor: "aquamarine", minWidth: 120 }}>Remanente</TableCell>
//                                 </>
//                             )}
//                             {/* DATOS DESGLOZADOS */}
//                             <StyledTableCell align="center">PO</StyledTableCell>
//                             <StyledTableCell align="center">Lote</StyledTableCell>
//                             <StyledTableCell align="center">Cantidad</StyledTableCell>
//                             <StyledTableCell align="center">Ritmo</StyledTableCell>
//                             <StyledTableCell align="center">OP Mont.</StyledTableCell>
//                             <StyledTableCell align="center">OP IM Main</StyledTableCell>
//                             <StyledTableCell align="center">OP IM Dis.</StyledTableCell>
//                             <StyledTableCell align="center">OP SUB</StyledTableCell>
//                             {/* {!mostrarContenedores && (
//                                 <>
//                                     <StyledTableCell align="center">
//                                         Emb
//                                         <Tooltip title="Desplegar embarques">
//                                             <IconButton
//                                                 onClick={() => { buscarEmbarques(); dispatch(StatesFormModalsSlice.actions.setMostrarContenedores(!mostrarContenedores)); }}
//                                                 style={{ position: "relative" }} size="small">
//                                                 <KeyboardDoubleArrowRight color="primary" />
//                                             </IconButton>
//                                         </Tooltip>
//                                     </StyledTableCell>
//                                 </>
//                             )}
//                             {mostrarContenedores && embarquesPlan && (
//                                 <>
//                                     {uniqueEmbarques.map((elementos) => (
//                                         <StyledTableCell key={elementos.id} align="center">
//                                             {elementos.nombreEmbarque}
//                                         </StyledTableCell>
//                                     ))}
//                                 </>
//                             )} */}
//                             <StyledTableCell align="center">Estado</StyledTableCell>
//                             <StyledTableCell align="center">Observaciones</StyledTableCell>
//                             <StyledTableCell align="center">Ritmo</StyledTableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {(rowsPerPage > 0 ? planProdNew.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : planProdNew).map((elementos) => {
//                             return (
//                                 <StyledTableRow key={elementos.id}>
//                                     <StyledTableCell align="center" component="th" scope="row">
//                                         <Tooltip
//                                             title="Editar plan de produccion">
//                                             <IconButton
//                                                 style={{ position: "relative" }} size="small">
//                                                 <Edit />
//                                             </IconButton>
//                                         </Tooltip>
//                                     </StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.modelo.nombre}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.modelo.familia.pw}</StyledTableCell>
//                                     <StyledTableCell align="center">ON/OFF</StyledTableCell>
//                                     {/* DATOS DESGLOZADOS */}
//                                     {mostrarInformacionModeloNuevaTabla && (
//                                         <>
//                                             <StyledTableCell sx={{ backgroundColor: "aquamarine" }} align="center">{elementos.modelo.familia.proveedores.descripcion}</StyledTableCell>
//                                             <StyledTableCell sx={{ backgroundColor: "aquamarine" }} align="center">{elementos.modelo.descripcion}</StyledTableCell>
//                                             <StyledTableCell sx={{ backgroundColor: "aquamarine" }} align="center">{filtrarKbtuPorFamilia(elementos.modelo.familia.nombre)}</StyledTableCell>
//                                             <StyledTableCell sx={{ backgroundColor: "aquamarine" }} align="center">{elementos.modelo.familia.nombre}</StyledTableCell>
//                                             <StyledTableCell sx={{ backgroundColor: "aquamarine" }} align="center">{elementos.remanente}</StyledTableCell>
//                                         </>
//                                     )}
//                                     {/* DATOS DESGLOZADOS */}
//                                     <StyledTableCell align="center">{elementos.po}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.lote}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.cantidad}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.ritmo}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.opMontaje}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.opImMain}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.opImDisplay}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.opSub}</StyledTableCell>
//                                     {/* {mostrarContenedores && embarquesPlan && (
//                                         <>
//                                             {uniqueEmbarques.map((unique) => {
//                                                 const datoCelda = embarquesDeLaFila.find((elementos) => elementos.id === unique.id)
//                                                 return (
//                                                     <StyledTableCell className={generarFondoEmbarques(unique.estadoEmbarque.id)}
//                                                         key={`${elementos.id}-${unique.id}`} align="center">
//                                                         {datoCelda ? datoCelda.numeroEmbarque : '---'}
//                                                     </StyledTableCell>
//                                                 );
//                                             })}
//                                         </>
//                                     )} */}
//                                     <StyledTableCell align="center">{generarEstado(elementos.estado)}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.observaciones}</StyledTableCell>
//                                     <StyledTableCell align="center">{elementos.ritmo}</StyledTableCell>
//                                 </StyledTableRow>
//                             )
//                         })}
//                         {emptyRows > 0 && (
//                             <TableRow style={{ height: 53 * emptyRows }}>
//                                 <TableCell colSpan={6} />
//                             </TableRow>
//                         )}
//                     </TableBody>
//                     <TableFooter>
//                         <TableRow>
//                             <TablePagination
//                                 rowsPerPageOptions={[1, 5, 10, 25, { label: 'All', value: -1 }]}
//                                 colSpan={100}
//                                 count={planProdNew.length}
//                                 rowsPerPage={rowsPerPage}
//                                 page={page}
//                                 slotProps={{
//                                     select: {
//                                         inputProps: {
//                                             'aria-label': "Columnas Por Pagina",
//                                         },
//                                         native: true
//                                     }
//                                 }}
//                                 onPageChange={handleChangePage}
//                                 onRowsPerPageChange={handleChangeRowsPerPage}
//                                 ActionsComponent={TablePaginationActions}
//                             />
//                         </TableRow>
//                     </TableFooter>
//                 </Table>
//             </TableContainer>
//         </main>
//     )
// }

export const TableNewInfoComponent = () => {
    return (
        <div>
        </div>
    )
}