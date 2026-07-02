import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/styles";
import { useAppDispatch } from "app/core/store/store";
import { IDatos } from "app/models/AOI/IDatos";
import { IDatos2 } from "app/models/AOI/IDatos2";
import { HeaderTablero } from "app/features/tableros/components/HeaderTablero";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React from "react";
import { Controller, useForm } from "react-hook-form";
//import { DatosService } from "app/services/AOI/datos.service";
//import FetchApi from "app/shared/helpers/FetchApi";

interface Stockers {
  datosPlacas: IDatos[];
  numeroStockers: string;
}

// CELDAS DE TABLAS ESTILIZADAS
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: "2rem",
    color: "white",
    fontWeight: 600,
    padding: "1.5rem 1.5rem",
    border: "0",
    borderRadius: "1rem",
    width: "20%",
    boxShadow: "rgb(12 12 12 / 89%) 0px 4px 10px 0px"
  }
}));
const StyledTableCellBlue = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: "2rem",
    color: "#0AE2FF",
    fontWeight: 600,
    padding: "1.5rem 1.5rem",
    border: "0",
    borderRadius: "1rem",
    width: "20%",
    boxShadow: "rgb(12 12 12 / 89%) 0px 4px 10px 0px"
  }
}));
const StyledTableHead = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: "0",
    fontWeight: 900,
    padding: "1.5rem 1rem"
  }
}));
// const StyledTableCellYellow = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: "2rem",
//     color: "#BAF321",
//     fontWeight: 600,
//     padding: "1.5rem 1.5rem",
//     border: "0",
//     borderRadius: "1rem",
//     width: "20%",
//     boxShadow: "rgb(12 12 12 / 89%) 0px 4px 10px 0px"
//   }
// }));

//______________COMPONENT______________//

export const StockPlacasAutomaticas = () => {
  const { control } = useForm();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  // DATOS REAL
  //const { state: datos } = FetchApi<IDatos2[]>(DatosSliceRequest.GetItemByDate,"2025-03-31",true);

  // DATOS MOCK FRONT
  const [datos, setDatos] = React.useState<IDatos2[]>([]);

  //______________MOCK DE PRUEBA POR OP______________//
  const mockDatos: IDatos2[] = [
    {
      id: 1,
      lot_Number: null,
      model: "PHS32HA4CNI",
      panel: null,
      prod_aoi: null,
      qty: null,
      semielaborado: "4-651-SMDM32HHAA60",
      created_at: "2025-12-10",
      updated_at: "2025-12-10",
      op: "OP-309422",
      declarados: 106,
      status: "success"
    },
    {
      id: 2,
      lot_Number: null,
      model: "PHS32HA4CNI",
      panel: null,
      prod_aoi: null,
      qty: null,
      semielaborado: "4-651-SMDDISAA0089",
      created_at: "2025-12-10",
      updated_at: "2025-12-10",
      op: "OP-309820",
      declarados: 868,
      status: "success"
    },
    {
      id: 3,
      lot_Number: null,
      model: "PHS32HA4CNE",
      panel: null,
      prod_aoi: null,
      qty: null,
      semielaborado: "4-562-SMDDISAA0089",
      created_at: "2025-12-10",
      updated_at: "2025-12-10",
      op: "OP-329423",
      declarados: 1034,
      status: "success"
    }
  ];

  // FUNCIÓN QUE TRAE LOS DATOS MOCK AHORA
  async function cargarDatos() {
    try {
      // REAL BACKEND
      // const hoy = moment().format("YYYY-MM-DD");
      // const response = await DatosService.getItemsByDate(hoy);
      // setDatos(response);

      // TEMPORAL > MOCK TESTEABLE
      console.log("Actualizando andon");
      setDatos(mockDatos);
    } catch (error) {
      console.log("Error llamando servicio, usando mock");
      setDatos(mockDatos);
    }
  }

  // USE EFFECT PARA CARGA Y REFRESH CADA 5 MIN
  React.useEffect(() => {
    cargarDatos(); // CARGA INICAL

    const intervalId = setInterval(() => {
      cargarDatos(); // REFRESH 5 MIN
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId); // CLEAN UP
  }, []);

  const fecha = moment().format("DD/MM/YYYY"); // FECHA HOY

  //______________RENDER_______________//
  return (
    <>
      {datos && (
        <main className="h-full w-screen bg-blue-950">
          <HeaderTablero />
          <section className="px-6">
            {/* INPUT */}
            <div className="mt-4 w-full">
              <Controller
                name="stockerNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="bg-background placeholder:text-3xl"
                    fullWidth
                    id="stocker-number"
                    label="Ingrese un numero de stocker"
                    variant="outlined"
                  />
                )}
              />
            </div>

            {/* TÍTULO */}
            <div className="w-full flex justify-between text-white text-3xl font-medium mt-16 mb-6 items-end">
              <p className="text-5xl">ANDÓN STOCK PLACAS</p>
              <p className="text-4xl">{fecha}</p>
            </div>

            {/* TABLA */}
            <section>
              <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", backgroundColor: "#172554", paddingBottom: "1rem" }}>
                <Table sx={{ minWidth: 650, backgroundColor: "#172554" }} aria-label="simple table">
                  {/* HEADERS */}
                  <TableHead className="bg-linearGradientHeaderTable">
                    <TableRow sx={{ "&:last-child td, &:last-child th": { fontSize: "2.5rem" } }}>
                      <StyledTableHead align="center">MODELO</StyledTableHead>
                      <div className="mx-4"></div>
                      <StyledTableHead align="center">LOTE</StyledTableHead>
                      <div className="mx-4"></div>
                      <StyledTableHead align="center">SEMIELABORADO</StyledTableHead>
                      <div className="mx-4"></div>
                      <StyledTableHead align="center">OP</StyledTableHead>
                      <div className="mx-4"></div>
                      <StyledTableHead align="center">CANTIDAD</StyledTableHead>
                    </TableRow>
                  </TableHead>

                  <div className="mt-3"></div>

                  {/* BODY */}
                  <TableBody>
                    {datos.map((e) => (
                      <React.Fragment key={e.id}>
                        <div className="my-6"></div>

                        <TableRow sx={{ backgroundColor: "#243150" }}>
                          <StyledTableCell align="center">{e.model}</StyledTableCell>
                          <div className="w-8 h-24 bg-[ #172554]"></div>

                          <StyledTableCell align="center">{e.lot_Number ?? "-"}</StyledTableCell>
                          <div className="w-8 h-24 bg-[ #172554]"></div>

                          <StyledTableCell align="center">{e.semielaborado}</StyledTableCell>
                          <div className="w-8 h-24 bg-[ #172554]"></div>

                          <StyledTableCell align="center">{e.op}</StyledTableCell>
                          <div className="w-8 h-24 bg-[ #172554]"></div>

                          <StyledTableCellBlue align="center">{e.declarados}</StyledTableCellBlue>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          </section>
        </main>
      )}
    </>
  );
};
