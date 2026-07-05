/* eslint-disable unused-imports/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ContextApp } from "../../../Context/Context";
import { Check, Close, Delete, Print } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { EliminarRegistroModal } from "./EliminarRegsitroModal";
import { OQCPaletPrint } from "app/features/oqcGeneral/modules/oqcCelulares/global/modals/OQCPaletPrint";
import { NumerosNewsanDTO } from "app/models/DTO/NumerosNewsanDTO";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { oqcPaletPrintSlice } from "app/features/oqcGeneral/slices/OQCPaletPrintSlice";
import { OQCPaletSliceRequests } from "app/features/oqcGeneral/slices/OQCPaletSlice";

interface Props {
  refreshPallet: () => void;
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const ExaminarMuestrasDelPalletModal: React.FC<Props> = ({ refreshPallet, setOpenModal, openModal }) => {
  const palet = useAppSelector((state) => state.oqcPalet.object);
  const modeloSeleccionado = useAppSelector((state) => state.oqcModelo.object);

  const contextGlobal = useContext(ContextApp);
  const dispatch = useAppDispatch();

  const contextoGlobal = useContext(ContextApp);
  const [traeDosImei, setTraeDosImei] = useState(false);
  const goodIcon = <Check sx={{ color: "green" }}></Check>;
  const noGoodIcoon = <Close sx={{ color: "red" }}></Close>;

  const [muestraEliminada, setMuestraEliminada] = useState<IOQCDesignadaResultado>();
  const [cantidadMasterBox, setCantidadMasterBox] = useState([]);
  const [openModalPrint, setOpenModalPrint] = useState(false);

  const [listadoMuestras, setListadoMuestras] = useState<IOQCDesignadaResultado[]>([]);
  const [numerosNewsan, setNumerosNewsan] = useState<NumerosNewsanDTO>();
  const muestrasPallet = async () => {
    const arrayAux = [];
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(
        await dispatch(OQCDesignadaResultadoSliceRequests.getAllRegistersByPalletId(palet.id))
      );
      const numerosNewsan = unwrapResult(
        await dispatch(OQCDesignadaResultadoSliceRequests.getNewsanFromAndUntil(palet.id))
      );
      if (response) {
        setNumerosNewsan(numerosNewsan);
        setListadoMuestras(response);
        response.forEach((elementos) => {
          arrayAux.push(elementos.cajaMaster);
          if (elementos.imei2 == null) {
            setTraeDosImei(false);
          } else {
            setTraeDosImei(true);
          }
        });
      }
      setCantidadMasterBox([...new Set(arrayAux)]);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getPallets = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responsePrueba = unwrapResult(
        await dispatch(
          OQCPaletSliceRequests.getAllDatesPalletByPlantAndModelId({
            plantId: contextGlobal.plantaId,
            modeloId: modeloSeleccionado.id
          })
        )
      );
      if (responsePrueba) {
        contextGlobal.setPaletsExistentes(responsePrueba);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error, "Error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const deleteRegistro = async (muestra: IOQCDesignadaResultado) => {
    contextGlobal.setEliminarMuestra(true);
    setMuestraEliminada(muestra);
    getPallets();
  };

  const [numeroLpn, setNumeroLpn] = useState("");
  const [opcionPrint, setOpcionPrint] = useState(false);
  const imprimirTicket = (lpn: string) => {
    setNumeroLpn(lpn);
    setOpenModalPrint(true);
    setOpcionPrint(true);
    dispatch(oqcPaletPrintSlice.actions.setObject(null));
  };

  useEffect(() => {
    if (contextoGlobal.examinarPallet || !contextGlobal.eliminarMuestra) {
      muestrasPallet();
    }
  }, [contextoGlobal.examinarPallet, contextGlobal.eliminarMuestra]);

  useEffect(() => {
    if (contextGlobal.eliminarMuestra || !contextGlobal.eliminarMuestra) {
      getPallets();
      muestrasPallet();
    }
  }, [contextGlobal.eliminarMuestra]);

  return (
    //En este modal lo que podemos hacer es examinar cada una de las muestras que se realizaron para ver que sus datos correspondan y el estado en el que se encuentra esa muestra
    <main className="h-full z-30 w-[85vw] bg-secondaryNew m-auto rounded-md border border-gray-100 p-6">
      <div className="w-full bg-secondaryNew text-center text-lg py-2 rounded-md font-semibold shadow-shadowBox text-textColor border border-gray-100/10 flex flex-row justify-evenly">
        <div>
          <span>Numero Palet: {palet.numeroPalet}</span>
          <br />
          <span>Registro: {palet.registro}</span>
        </div>
        {numerosNewsan && (
          <div>
            <span>Newsan Desde: {numerosNewsan.numeroNewsanDesde}</span>
            <br />
            <span>Newsan Hasta: {numerosNewsan.numeroNewsanHasta}</span>
          </div>
        )}
      </div>
      <div className="h-[75%]">
        <TableContainer component={Paper} sx={{ marginTop: "1rem", height: "100%", border: "1px solid gray" }}>
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--secondary-color)" }}>
              <TableRow>
                <TableCell>Usuario</TableCell>
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
                <TableCell>Estado</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listadoMuestras.map((elementos) => (
                <TableRow key={elementos.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell
                    component="th"
                    scope="elementos">{`${elementos.operator.name} ${elementos.operator.surname}`}</TableCell>
                  <TableCell>{elementos.cajaMaster}</TableCell>
                  <TableCell>{elementos.numeroSerie}</TableCell>
                  <TableCell>{elementos.msn}</TableCell>
                  <TableCell>{elementos.imei}</TableCell>
                  <TableCell>{elementos.imei}</TableCell>
                  <TableCell className={`${traeDosImei ? "" : "hidden"}`}>{elementos.imei2}</TableCell>
                  <TableCell className={`${traeDosImei ? "" : "hidden"}`}>{elementos.imei2}</TableCell>
                  <TableCell>{elementos.eanCode}</TableCell>
                  {/*
                                    <TableCell>{elementos.oqcHallazgoResult[0]?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre.toLowerCase().includes("funci") ? noGoodIcoon : goodIcon}</TableCell>
                                    <TableCell>{elementos.oqcHallazgoResult[0]?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre.toLowerCase().includes("est") ? noGoodIcoon : goodIcon}</TableCell>
                                    <TableCell>{elementos.oqcHallazgoResult[0]?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre.toLowerCase().includes("pack") ? noGoodIcoon : goodIcon}</TableCell>
                                    */}
                  <TableCell>
                    {elementos.oqcHallazgoResult.some((elementos) =>
                      elementos?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre?.toLowerCase()?.includes("funci")
                    )
                      ? noGoodIcoon
                      : goodIcon}
                  </TableCell>
                  <TableCell>
                    {elementos.oqcHallazgoResult.some((elementos) =>
                      elementos?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre?.toLowerCase()?.includes("est")
                    )
                      ? noGoodIcoon
                      : goodIcon}
                  </TableCell>
                  <TableCell>
                    {elementos.oqcHallazgoResult.some((elementos) =>
                      elementos?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre?.toLowerCase()?.includes("pack")
                    )
                      ? noGoodIcoon
                      : goodIcon}
                  </TableCell>
                  <TableCell
                    className={`${elementos.oqcHallazgoResult.length > 0 ? "text-red-500" : "text-green-500"}`}>
                    {elementos.oqcHallazgoResult.length > 0 ? "NO GOOD" : "GOOD"}
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <Tooltip title="Borrar muestra del palet">
                        <span>
                          <IconButton
                            onClick={() => {
                              deleteRegistro(elementos);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Generar Ticket NO CONFORME">
                        <span className={elementos.oqcHallazgoResult.length > 0 ? "block" : "hidden"}>
                          <IconButton
                            onClick={() => {
                              imprimirTicket(elementos.cajaMaster);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Print color="primary" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <ModalCompoment
        setOpenPopup={contextGlobal.setEliminarMuestra}
        openPopup={contextGlobal.eliminarMuestra}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Registro de motivo de eliminación de muestra"
        title="Agregar Causa De Eliminacion">
        <EliminarRegistroModal
          refresh={muestrasPallet}
          setOpenModalEliminar={contextGlobal.setEliminarMuestra}
          muestraEliminada={muestraEliminada}></EliminarRegistroModal>
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalPrint}
        openPopup={openModalPrint}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Impresión de ticket de muestreo"
        title="Imprimir Ticket">
        <OQCPaletPrint
          reproceso={false}
          estadoReimpresion={false}
          cerrarPaletOpcion={false}
          closeModal={setOpenModalPrint}
          refresh={refreshPallet}
          cerrarMuestras={contextoGlobal.setMuestrasPallet}
          numeroLpn={numeroLpn}></OQCPaletPrint>
      </ModalCompoment>
    </main>
  );
};

/*
<table className="rounded-md w-full text-center table-auto">
                    <thead className="bg-[#a5e7f1] border-b rounded-t-lg border-sky-200 h-8">
                        <tr>
                            <th className="text-[1rem] text-blue-800 font-medium">Usuario</th>
                            <th className="text-[1rem] text-blue-800 font-medium">Master Box</th>
                            <th className="text-[1rem] text-blue-800 font-medium">S.Newsan</th>
                            <th className="text-[1rem] text-blue-800 font-medium">MSN(U)</th>
                            <th className="text-[1rem] text-blue-800 font-medium">IMEI1(U)</th>
                            <th className="text-[1rem] text-blue-800 font-medium">IMEI1(E)</th>
                            <th className={`${traeDosImei ? "" : "hidden"} text-[1rem] text-blue-800 font-medium`}>IMEI2(U)</th>
                            <th className={`${traeDosImei ? "" : "hidden"} text-[1rem] text-blue-800 font-medium`}>IMEI2(E)</th>
                            <th className="text-[1rem] text-blue-800 font-medium">EAN(U)</th>
                            <th className="text-[1rem] text-blue-800 font-medium">Funcional</th>
                            <th className="text-[1rem] text-blue-800 font-medium">Estética</th>
                            <th className="text-[1rem] text-blue-800 font-medium">Packing</th>
                            <th className="text-[1rem] text-blue-800 font-medium">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="h-16 text-black">
                    {listadoMuestras.map((elementos, index) => (
                            <tr key={index}>
                                <td>{`${elementos.operator.name} ${elementos.operator.surname}`}</td>
                                <td>{elementos.cajaMaster}</td>
                                <td>{elementos.numeroSerie}</td>
                                <td>{elementos.msn}</td>
                                <td>{elementos.imei}</td>
                                <td>{elementos.imei}</td>
                                <td className={`${traeDosImei ? "" : "hidden"}`}>{elementos.imei2}</td>
                                <td className={`${traeDosImei ? "" : "hidden"}`}>{elementos.imei2}</td>
                                <td>{elementos.eanCode}</td>
                                <td>{elementos.oqcHallazgoResult[0]?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre.toLowerCase().includes("funci") ? noGoodIcoon : goodIcon}</td>
                                <td>{elementos.oqcHallazgoResult[0]?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre.toLowerCase().includes("est") ? noGoodIcoon : goodIcon}</td>
                                <td>{elementos.oqcHallazgoResult[0]?.oqcBloqueHallazgo?.oqcHallazgo?.oqcCategoria?.nombre.toLowerCase().includes("pack") ? noGoodIcoon : goodIcon}</td>
                                <td className={`${elementos.oqcHallazgoResult.length > 0 ? "text-red-500" : "text-green-500"} font-semibold`}>
                                    {elementos.oqcHallazgoResult.length > 0 ? "NO GOOD" : "GOOD"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
*/
