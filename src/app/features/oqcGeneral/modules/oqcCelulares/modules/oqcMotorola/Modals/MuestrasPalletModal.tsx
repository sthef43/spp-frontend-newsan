// eslint-disable-next-line unused-imports/no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { ContextApp } from "../../../Context/Context";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { OQCPaletPrint } from "app/features/oqcGeneral/modules/oqcCelulares/global/modals/OQCPaletPrint";
import { unwrapResult } from "@reduxjs/toolkit";
import { Controller, useForm } from "react-hook-form";
import { Add, ArrowDropDown } from "@mui/icons-material";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton
} from "@mui/material";
import { XXE_WIP_ITF_SERIESlice, XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { IOQCNuevoPallet } from "app/models/IOQCNuevoPallet";
import { DatosZamplingModal } from "./DatosZamplingModal";
import { ContinuarPalletModal } from "./ContinuarPalletModal";
import { IOQCPalet } from "app/models/IOQCPalet";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { OQCNuevoPalletSliceRequest } from "app/features/oqcGeneral/slices/OQCNuevoPalletSlice";
import { oqcPaletPrintSlice } from "app/features/oqcGeneral/slices/OQCPaletPrintSlice";
import { OQCPaletSliceRequests, oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";

interface props {
  refreshPallet: () => void;
}

export const MuestrasPalletModal: React.FC<props> = ({ refreshPallet }) => {
  const {
    control,
    watch,
    trigger,
    formState: { isValid }
  } = useForm({ mode: "all" });

  const palet = useAppSelector((state) => state.oqcPalet.object);

  const dispatch = useAppDispatch();
  const contextoGlobal = useContext(ContextApp);
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();

  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  const [oqcDesignadaResultadoFormateado, setOqcDesignadaResultadoFormateado] = useState([]);
  const [hallazgosEncontrados, setHallazgosEncontrados] = useState<IOQCHallazgoResult[]>([]);
  const [nuevoPalletFormateado, setNuevoPalletFormateado] = useState<IOQCPalet>();

  const [openModalPrint, setOpenModalPrint] = useState(false);

  const [ultimaMuestra, setUltimaMuestra] = useState<IOQCDesignadaResultado>();
  const getListaMasterBox = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(OQCDesignadaResultadoSliceRequests.getAllRegistersByPalletId(palet.id))
      );
      const datosTraza = unwrapResult(await dispatch(XXE_WIP_ITF_SERIESliceRequests.GetByLPN(palet.lpn)));
      const responseLastOQC = unwrapResult(
        await dispatch(OQCDesignadaResultadoSliceRequests.getLastReportByPalletId(palet.id))
      );
      if (response || datosTraza) {
        response.map((item) => {
          if (oqcDesignadaResultadoFormateado.length == 0) {
            setOqcDesignadaResultadoFormateado((auxiliar) => {
              const existeCajaMaster = auxiliar[item.cajaMaster];
              return {
                ...auxiliar,
                [item.cajaMaster]: existeCajaMaster ? [...existeCajaMaster, item] : [item]
              };
            });
          }
        });
        dispatch(XXE_WIP_ITF_SERIESlice.actions.setObject(datosTraza[0]));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        const hallazgosEncontrados = response.filter((elementos) => elementos.oqcHallazgoResult.length > 0);
        hallazgosEncontrados.map((elementos) => {
          console.log(elementos);
          return elementos.oqcHallazgoResult?.find((busqueda) => {
            if (busqueda.oqcBloqueHallazgo.oqcHallazgo.oqcPonderacion.criticidad == "Critico") {
              setHallazgosEncontrados((prev) => prev.concat(busqueda));
            }
          });
        });
        setUltimaMuestra(responseLastOQC);
      }
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    await trigger("conformidad");
  };

  const watchConformidad = watch("conformidad");
  const cerrarPallet = async () => {
    dispatch(oqcPaletPrintSlice.actions.setObject(null));
    try {
      if (hallazgosEncontrados.length > 0 && watchConformidad == "CONFORME") {
        if (
          await getConfirmation("Continuar", "Tienes elementos con una criticidad alta, deseas declarar como conforme?")
        ) {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
          dispatch(OQCPaletSliceRequests.PutRequest(nuevoPalletFormateado));
          setOpenModalPrint(!openModalPrint);
          setHallazgosEncontrados([]);
        }
      } else {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        dispatch(OQCPaletSliceRequests.PutRequest(nuevoPalletFormateado));
        setOpenModalPrint(!openModalPrint);
      }
      dispatch(oqcPaletSlice.actions.setObject(nuevoPalletFormateado));
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const [estadoReimpresion, setEstadoReimpresion] = useState(false);
  const cambiarConformidad = async () => {
    const nuevoRegistro = generarRegistro();
    try {
      if (watchConformidad == "CONFORME") {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        setEstadoReimpresion(true);
        const cambiarConformePalet = { ...palet, conforme: true, registro: nuevoRegistro };
        delete cambiarConformePalet.oqcDesignadaResultado;
        delete cambiarConformePalet.oqcModelo;
        delete cambiarConformePalet.oqcDesignada;
        setNuevoPalletFormateado(cambiarConformePalet);
        await dispatch(OQCPaletSliceRequests.PutRequest(cambiarConformePalet));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } else if (watchConformidad == "NO CONFORME") {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        setEstadoReimpresion(false);
        const cambiarConformePalet = { ...palet, conforme: false, registro: nuevoRegistro };
        !cambiarConformePalet.conforme;
        delete cambiarConformePalet.oqcDesignadaResultado;
        delete cambiarConformePalet.oqcModelo;
        delete cambiarConformePalet.oqcDesignada;
        setNuevoPalletFormateado(cambiarConformePalet);
        await dispatch(OQCPaletSliceRequests.PutRequest(cambiarConformePalet));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listaCodigosMsn, setListaCodigosMsn] = useState([]);
  const [listaParaAniadir, setListaParaAniadir] = useState<IOQCNuevoPallet[]>([]);
  const [tiene2Imeis, setTieneImei2] = useState(false);
  const continuarMasterBox = async (cajaMaster: string) => {
    const listaArray = [];
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OQCNuevoPalletSliceRequest.GetAllByLpn(cajaMaster)));
      if (response) {
        setListaParaAniadir(response);
        response.forEach((elementos) => {
          listaArray.push(elementos.msn);
          if (elementos.referencia2 != null) {
            setTieneImei2(true);
          }
        });
        setListaCodigosMsn(listaArray);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
    }
    contextoGlobal.setCodigoLpn(cajaMaster);
    contextoGlobal.setDatosZampling(true);
  };

  const generarRegistro = () => {
    let nuevoRegistro = "";
    const año = new Date();
    if (watchConformidad === "CONFORME") {
      nuevoRegistro = `${palet.plant.organizationCode}-PLT-${año.getFullYear()}-${palet.numeroPalet.substring(4, 99)}`;
    } else {
      nuevoRegistro = `${palet.plant.organizationCode}-NG-${año.getFullYear()}-${palet.numeroPalet.substring(4, 99)}`;
    }

    if (nuevoRegistro != "") {
      return nuevoRegistro;
    } else {
      openNotificationUI("Se genero un error generando el registro", "error");
    }
  };

  function estadoMasterBox(arrayDeItems) {
    return arrayDeItems.every(
      (elemento) => Array.isArray(elemento.oqcHallazgoResult) && elemento.oqcHallazgoResult.length === 0
    );
  }

  const openModalMostrarAyuda = (estadoModal) => {
    setMostrarAyuda(estadoModal);
  };

  useEffect(() => {
    if (contextoGlobal.muestrasPallet) {
      getListaMasterBox();
    }
  }, [contextoGlobal.muestrasPallet]);

  useEffect(() => {
    if (watchConformidad) {
      cambiarConformidad();
    }
  }, [watchConformidad]);

  return (
    <main className="z-30 w-[45vw] h-[70vh] m-auto rounded-md border-gray-300 px-6 text-textColor">
      {/*En este modal vemos la cantidad de master box ingresada con su respectiva cantidad de muestras y el estado de esas muestras.
            Tambien es donde se cierra el palet al que se le dio click y la impresion del ticket con sus caracteristicas*/}
      <p className="text-center text-xl pt-5">
        El Pallet indicado a continuacion no fue finalizado, el mismo cuenta con las siguientes Master Box
        inspeccionadas por el TURNO anterior.
      </p>
      <div className="w-full h-[45%] rounded-lg shadow-shadowBox">
        <TableContainer component={Paper} sx={{ marginY: "1rem", height: "100%" }}>
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--newsan-color)", color: "white" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontSize: "14px" }}>ID Palet</TableCell>
                <TableCell sx={{ color: "white", fontSize: "14px" }}>Master Box</TableCell>
                <TableCell sx={{ color: "white", fontSize: "14px" }}>Estado Master Box</TableCell>
                <TableCell sx={{ color: "white", fontSize: "14px" }}>Muestras</TableCell>
                <TableCell sx={{ color: "white", fontSize: "14px" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(oqcDesignadaResultadoFormateado).map(([cajaMaster, arrayDeItems]) => (
                <TableRow key={cajaMaster} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>{palet.numeroPalet}</TableCell>
                  <TableCell>{cajaMaster}</TableCell>
                  <TableCell>{estadoMasterBox(arrayDeItems) ? "GOOD" : "NO GOOD"}</TableCell>
                  <TableCell>{arrayDeItems.length}</TableCell>
                  <TableCell>
                    <div>
                      <Tooltip title="Continuar Master">
                        <span>
                          <IconButton
                            onClick={() => {
                              continuarMasterBox(cajaMaster);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Add color="primary" />
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
      <Controller
        name="conformidad"
        defaultValue="Seleccione una opcion"
        control={control}
        rules={{ validate: (value) => (value === "Seleccione una opcion" ? "Ingrese una opción" : true) }}
        render={({ field }) => (
          <div className="relative w-1/2 mt-4 m-auto">
            <select
              {...field}
              className="row-start-1 w-full col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-secondaryNew p-2 rounded-sm h-12 shadow-shadowBox">
              <option value="Seleccione una opcion">SELECCIONE UNA OPCION</option>
              {["CONFORME", "NO CONFORME"].map((elementos, index) => (
                <option value={elementos} key={index}>
                  {elementos}
                </option>
              ))}
            </select>
            <ArrowDropDown className="absolute right-5 col-start-1 top-[30%]" />
          </div>
        )}
      />
      <div className="w-full flex justify-around mt-4">
        <button
          onClick={() => {
            cerrarPallet();
          }}
          className={`${
            isValid ? "bg-[#0aa70a]" : "bg-[#727272]"
          } text-white font-semibold h-10 w-56 shadow-shadowBox rounded-md`}
          disabled={!isValid}>
          FINALIZAR PALLET
        </button>
        <button
          onClick={() => {
            contextoGlobal.setContinuarPallet(true);
            contextoGlobal.setMuestrasPallet(false);
          }}
          className="bg-[#2768d9] text-white font-semibold h-10 w-56 shadow-shadowBox rounded-md">
          AGREGAR MASTER BOX
        </button>
      </div>
      <ModalCompoment setOpenPopup={setOpenModalPrint} openPopup={openModalPrint} title="Imprimir Datos Palet">
        <OQCPaletPrint
          ultimaMuestraOQC={ultimaMuestra}
          reproceso={false}
          ticketPiso={false}
          estadoReimpresion={estadoReimpresion}
          cerrarPaletOpcion={true}
          closeModal={setOpenModalPrint}
          refresh={refreshPallet}
          cerrarMuestras={contextoGlobal.setMuestrasPallet}></OQCPaletPrint>
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={contextoGlobal.setContinuarPallet}
        openPopup={contextoGlobal.continuarPallet}
        title="Continuar Palet"
        onCloseDynamic>
        <ContinuarPalletModal
          refreshTable={refreshPallet}
          modalAyuda={mostrarAyuda}
          openModalAyuda={openModalMostrarAyuda}
        />
      </ModalCompoment>
      <ModalCompoment
        title="Datos Sampling"
        setOpenPopup={contextoGlobal.setDatosZampling}
        openPopup={contextoGlobal.datosZampling}
        onCloseDynamic>
        <DatosZamplingModal
          refreshTable={refreshPallet}
          refreshMuestrasPallet={getListaMasterBox}
          ListaCodigosMsn={listaCodigosMsn}
          datosPallet={listaParaAniadir}
          tiene2Imeis={tiene2Imeis}
        />
      </ModalCompoment>
    </main>
  );
};
