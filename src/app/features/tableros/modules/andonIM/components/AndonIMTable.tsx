/* eslint-disable unused-imports/no-unused-vars */
import { TableCell, TableRow, tableCellClasses, tableRowClasses } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IRechazo } from "app/models/IRechazo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Dictionary } from "lodash";
import produce from "immer";
import moment from "moment";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";

interface IRechazoTable {
  familia: string;
  rechazoD: number;
  rechazoA: number;
  reparados: number;
}
interface IAndonIMTable {
  cambioFecha: boolean;
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "#333333",
    background: "#9CA2C6",
    fontSize: 85,
    fontWeight: 700
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 85,
    padding: "0px",
    borderBottom: "none",
    fontWeight: 700,
    color: "#73EEFF;"
  }
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`&.${tableRowClasses.head}`]: {
    fontSize: 40,
    marginTop: theme.spacing(4)
  }
}));
export const AndonIMTable = ({ cambioFecha }: IAndonIMTable): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [rechazosTable, setRechazosTable] = useState<Dictionary<IRechazoTable>>({});
  const rechazos: IRechazo[] = useAppSelector((state) => state.rechazo.dataAll);
  const linea = useAppSelector((state) => state.lineaProduccion.object);
  const turnos = useAppSelector((state) => state.turno.dataAll);
  const lineaPuesto = useAppSelector((state) => state.lineaPuesto.object);

  // const cambiarColorFila = (row: IRechazoTable) => {
  // ANTIGUA FUNCION QUE SE USABA EN LA TABLA
  //   return (
  //     <StyledTableRow
  //       key={row.familia}
  //       sx={{ marginTop: "80px" }}>
  //       <StyledTableCell
  //         align="center"
  //         component="th"
  //         scope="row"
  //         sx={{
  //           spa: "40px"
  //         }}>
  //         {row.familia}
  //       </StyledTableCell>
  //       <StyledTableCell align="center">{row.rechazoD}</StyledTableCell>
  //       <StyledTableCell align="center">{row.rechazoA}</StyledTableCell>
  //       <StyledTableCell align="center" style={{ color: " #C0FF19" }}>
  //         {row.reparados}
  //       </StyledTableCell>
  //     </StyledTableRow>
  //   );
  // };

  const cambiarColorFila2 = (row: IRechazoTable) => {
    return (
      <ul className="mt-10 flex justify-between w-full text-7xl font-semibold bg-[#243150] text-center p-3 rounded-lg py-6 shadow-[0px_10px_10px_-5px_rgba(0,0,0,1)]">
        <li className="w-1/4">{row.familia}</li>
        <li className="w-1/4">{row.rechazoD}</li>
        <li className="w-1/4">{row.rechazoA}</li>
        <li className="text-[#C0FF19] w-1/4">{row.reparados}</li>
      </ul>
    );
  };

  const setDataRechazos = (familia: string, estado: string, acum: boolean) => {
    setRechazosTable(
      produce((draft) => {
        if (draft[familia]) {
          const { rechazoA, rechazoD, reparados } = draft[familia];
          const rechazoACount = estado === "R" ? 1 : 0;
          const reparadosCount = estado === "A" ? 1 : 0;
          draft[familia] = {
            ...draft[familia],
            rechazoA: rechazoA + rechazoACount,
            rechazoD: rechazoD + (acum ? 0 : 1),
            reparados: reparados + reparadosCount
          };
        } else {
          const rechazoACount = estado === "R" ? 1 : 0;
          const reparadosCount = estado === "A" ? 1 : 0;
          draft[familia] = {
            familia,
            rechazoA: rechazoACount,
            rechazoD: 1,
            reparados: reparadosCount
          };
        }
      })
    );
  };

  const setDataTable = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const arrayAux: string[] = [];
      for (const r of rechazos) {
        const { familia } = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.getByCodigo(r.barcode)));
        setDataRechazos(familia, r.estado, false);
        if (!arrayAux.includes(familia)) {
          arrayAux.push(familia);
        }
      }
      await Promise.all(arrayAux.map((familia) => getAllAcum(familia)));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const getAllAcum = async (familia) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const hora = moment().format("HH:mm:ss");
      const fecha = moment().format("YYYY-MM-DD");
      const { desdeHora } = turnos.find((t) => t.desdeHora <= hora && t.hastaHora >= hora);
      const response = unwrapResult(
        await dispatch(
          TrazaOperacionesSliceRequests.getTotalRechazosByFamiliaRequest({
            fecha,
            familia,
            lineaId: linea.id,
            hours: desdeHora
          })
        )
      );
      for (const trazaO of response) {
        const rechazo = unwrapResult(await dispatch(RechazoSliceRequests.getHistorialByCodigo(trazaO.codigoInit)));
        if (rechazo.puesto == lineaPuesto.puesto.nombre) {
          setDataRechazos(trazaO.familia, rechazo.estado, true);
        }
      }

      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  // Si cambio la fecha reseteo todos los states
  React.useEffect(() => {
    if (cambioFecha) {
      setRechazosTable({});
    }
  }, [cambioFecha]);
  // Cuando hace la consulta en el  componente padre y tiene datos, actualiza el state para mostrar en pantalla
  React.useEffect(() => {
    if (rechazos) {
      setRechazosTable({});
      setDataTable();
    }
  }, [rechazos]);
  return (
    // ANTIGUO HTML QUE IBA CON LA ANTIGUA FUNCION QUE SE USABA PARA EL RENDERIZADO
    // <div className="w-full mt-10">
    //   <TableContainer component={Paper}>
    //     <Table
    //       sx={{
    //         backgroundImage: `url(${import.meta.env.BASE_URL}imagenes/fondos/fondo-tablero.png)`,
    //         backgroundRepeat: "no-repeat",
    //         backgroundSize: "cover",
    //         minWidth: 700,
    //         borderCollapse: "separate",
    //         borderSpacing: "0px 80px",
    //         borderColor: "transparent"
    //       }}
    //       aria-label="customized table"
    //       size="small">
    //       <TableHead sx={{ height: "115px" }}>
    //         <TableRow>
    //           <StyledTableCell align="center">GENÉRICO</StyledTableCell>
    //           <StyledTableCell align="center">RECHAZO D</StyledTableCell>
    //           <StyledTableCell align="center">RECHAZO A</StyledTableCell>
    //           <StyledTableCell align="center">REPARADOS</StyledTableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody sx={{ "& > :not(:last-child)": { marginTop: "20px" } }}>
    //         {Object.keys(rechazosTable)?.map((key) => cambiarColorFila(rechazosTable[key]))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </div>
    <>
      <div className="w-full mt-20">
        <ul className="text-center bg-linearGradientHeaderTable flex justify-between text-5xl font-semibold text-black border border-transparent py-4 rounded-lg p-3.5 shadow-[0px_10px_10px_-5px_rgba(0,0,0,1)]">
          <li className="w-1/4">GENÉRICO</li>
          <li className="w-1/4">DIARIO</li>
          <li className="w-1/4">ACUMULADO</li>
          <li className="w-1/4">REPARADOS</li>
        </ul>
        {Object.keys(rechazosTable)?.map((key) => cambiarColorFila2(rechazosTable[key]))}
      </div>
    </>
  );
};
