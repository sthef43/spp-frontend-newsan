/* eslint-disable unused-imports/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ContextApp } from "../../../Context/Context";
import { Check, Close } from "@mui/icons-material";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";

interface props {
  listaDeDatos: IOQCDesignadaResultado[];
  tieneDosImeis: boolean;
}

export const VerDatosParaAgregar: React.FC<props> = ({ listaDeDatos, tieneDosImeis }) => {
  const contextoGlobal = useContext(ContextApp);
  const dispatch = useAppDispatch();

  const goodIcon = <Check sx={{ color: "green" }}></Check>;
  const noGoodIcoon = <Close sx={{ color: "red" }}></Close>;

  const [listadoMuestras, setListadoMuestras] = useState<IOQCDesignadaResultado[]>([]);
  const [traeDosImei, setTraeDosImei] = useState(false);
  const muestrasPallet = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(
        await dispatch(OQCDesignadaResultadoSliceRequests.getAllRegisterByLPN(listaDeDatos.at(-1).cajaMaster))
      );
      if (response) {
        setListadoMuestras(response);
        response.forEach((elementos) => {
          if (elementos.imei2 == null) {
            setTraeDosImei(false);
          } else {
            setTraeDosImei(true);
          }
        });
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    if (contextoGlobal.verDatosParaAniadir) {
      muestrasPallet();
    }
  }, [contextoGlobal.verDatosParaAniadir]);

  return (
    //En este modal se pueden ver las muestras que van ah ser ingresadas al palet donde se creo, o se siguen ingresando muestras
    <main
      className={`${
        contextoGlobal.examinarPallet ? "hidden" : "block"
      } z-50 h-[90vh] w-[85vw] absolute left-0 bottom-0 top-0 right-0 bg-white m-auto rounded-md border-gray-300 px-6`}>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            contextoGlobal.setAbrirVerDatosParaAgregar(!contextoGlobal.abrirVerDatosParaAgregar);
          }}
          className="bg-gray-500 rounded-sm px-[7px] py-[2px] font-semibold text-white text-xs">
          X
        </button>
      </div>
      <header className="w-full bg-red-800 text-white text-2xl text-center py-3 mt-3 mb-6 rounded-md font-bold">
        Registros Para Ser Cargados
      </header>
      <div className="bg-gray-200 h-2/3 mt-6 shadow-[0_6px_3px_-1px_rgba(166,166,166,0.71)]">
        <TableContainer component={Paper} sx={{ marginTop: "1rem", height: "100%" }}>
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#A5E7F1" }}>
              <TableRow>
                <TableCell>Master Box</TableCell>
                <TableCell>S.Newsan</TableCell>
                <TableCell>MSN(U)</TableCell>
                <TableCell>IMEI1(U)</TableCell>
                <TableCell>IMEI1(E)</TableCell>
                <TableCell className={`${traeDosImei ? "" : "hidden"}`}>IMEI2(U)</TableCell>
                <TableCell className={`${traeDosImei ? "" : "hidden"}`}>IMEI2(E)</TableCell>
                <TableCell>EAN(U)</TableCell>
                <TableCell>Funcional</TableCell>
                <TableCell>Estética</TableCell>
                <TableCell>Packing</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listadoMuestras.map((elementos) => (
                <TableRow key={elementos.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>{elementos.cajaMaster}</TableCell>
                  <TableCell>{elementos.numeroSerie}</TableCell>
                  <TableCell>{elementos.msn}</TableCell>
                  <TableCell>{elementos.imei}</TableCell>
                  <TableCell>{elementos.imei}</TableCell>
                  <TableCell className={`${traeDosImei ? "" : "hidden"}`}>{elementos.imei2}</TableCell>
                  <TableCell className={`${traeDosImei ? "" : "hidden"}`}>{elementos.imei2}</TableCell>
                  <TableCell>{elementos.eanCode}</TableCell>
                  {/*<TableCell>{elementos.oqcHallazgoResult[0]?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre.toLowerCase().includes("funci") ? noGoodIcoon : goodIcon}</TableCell>*/}
                  <TableCell>
                    {elementos.oqcHallazgoResult.some((elementos) =>
                      elementos?.oqcBloqueHallazgo?.oqcHallazgo?.oqcPonderacion?.tipoDefecto
                        ?.toLowerCase()
                        ?.includes("funci")
                    )
                      ? noGoodIcoon
                      : goodIcon}
                  </TableCell>
                  <TableCell>
                    {elementos.oqcHallazgoResult.some((elementos) =>
                      elementos?.oqcBloqueHallazgo?.oqcHallazgo?.oqcPonderacion?.tipoDefecto
                        ?.toLowerCase()
                        ?.includes("est")
                    )
                      ? noGoodIcoon
                      : goodIcon}
                  </TableCell>
                  <TableCell>
                    {elementos.oqcHallazgoResult.some((elementos) =>
                      elementos?.oqcBloqueHallazgo?.oqcHallazgo?.oqcPonderacion?.tipoDefecto
                        ?.toLowerCase()
                        ?.includes("pack")
                    )
                      ? noGoodIcoon
                      : goodIcon}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </main>
  );
};
