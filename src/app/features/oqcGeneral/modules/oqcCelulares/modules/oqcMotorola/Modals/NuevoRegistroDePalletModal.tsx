import React, { useContext, useEffect, useRef, useState } from "react";
import botonImagenAyudaEtiqueta from "../../../images/Group2447.png";
import { useForm, Controller } from "react-hook-form";
import { DatosZamplingModal } from "./DatosZamplingModal";
import { ContextApp } from "../../../Context/Context";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { IOQCModelo } from "app/models/IOQModelo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { Check, Close } from "@mui/icons-material";
import { IPlant } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { IOQCPalet } from "app/models/IOQCPalet";
import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { OQCNuevoPalletSliceRequest } from "app/features/oqcGeneral/slices/OQCNuevoPalletSlice";
import { OQCPaletSliceRequests, oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";
import { AyudaEtiquetaModal } from "../Components/AyudaEtiquetaModal";

interface props {
  refreshTable: () => void;
  modalAyuda: boolean;
  openModalAyuda: (nuevoEstado: boolean) => void;
}

export const NuevoRegistroDePalletModal: React.FC<props> = ({ refreshTable, modalAyuda, openModalAyuda }) => {
  const modeloSeleccionado = useAppSelector((state) => state.oqcModelo.object as IOQCModelo);
  const plantaSeleccionada = useAppSelector((state) => state.plant.object as IPlant);

  const contextGlobal = useContext(ContextApp);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: "onBlur"
  });

  const watchImeis = watch("codesIMEI");
  const lpnWatch = watch("cajaMultiple");

  const [codigoProducto, setCodigoProducto] = useState("");
  const [listaCodigosReferencia, setListaCodigosReferencia] = useState([]);
  const [codigosCorrectos, setCodigosCorrectos] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [datosParaAniadir, setDatosParaAniadir] = useState([]);
  const [tieneImei2, setTieneImei2] = useState(false);

  const [ultimoPalet, setUltimoPalet] = useState<IOQCPalet>();
  FetchApi<IOQCPalet>(OQCPaletSliceRequests.getLastPalet, null, true, contextGlobal.datosZampling, setUltimoPalet);

  const goodIcon = <Check sx={{ color: "green" }}></Check>;
  const noGoodIcoon = <Close sx={{ color: "red" }}></Close>;

  const getInfoLpn = async (event: any) => {
    try {
      if (event.key === "Enter") {
        event.preventDefault();
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(XXE_WIP_ITF_SERIESliceRequests.GetByLPN(lpnWatch)));
        contextGlobal.setGetDatosModelo(response);
        contextGlobal.setCodigoLpn(lpnWatch);
        if (response && response.length > 0) {
          if (response[0].codigO_PRODUCTO.substring(0, 2) == "91") {
            setCodigoProducto(response[0].codigO_PRODUCTO.slice(2));
          } else {
            setCodigoProducto(response[0].codigO_PRODUCTO);
          }
          generarListaNumerosImeis(response);
          generarEntradas(response);
          manejarEnter(event, 0);
        } else if (listaCodigosReferencia.length > 0) {
          seleccionarLpn(0);
          openNotificationUI("El codigo LPN es erroneo", "error");
          setListaCodigosReferencia([]);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log("error", error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarListaNumerosImeis = (imeis: IXXE_WIP_ITF_SERIE[]) => {
    imeis.forEach((elementos) => {
      if (elementos.referenciA_1.length !== listaCodigosReferencia.length && elementos.referenciA_2 == null) {
        setListaCodigosReferencia((prev) => [
          ...prev,
          {
            Referencia_1: elementos.referenciA_1,
            state: false
          }
        ]);
      } else if (elementos.referenciA_1.length !== listaCodigosReferencia.length && elementos.referenciA_2 !== null) {
        setListaCodigosReferencia((prev) => [
          ...prev,
          {
            Referencia_1: elementos.referenciA_1,
            state: false
          }
        ]);
        setListaCodigosReferencia((prev) => [
          ...prev,
          {
            Referencia_2: elementos.referenciA_2,
            state: false
          }
        ]);
      }
    });
  };

  const generarEntradas = (nuevosRegistros: IXXE_WIP_ITF_SERIE[]) => {
    nuevosRegistros.forEach((elementos) => {
      if (elementos.referenciA_2 === null) {
        setDatosParaAniadir((prev) =>
          prev.concat({
            lpn: elementos.lpn,
            codigoProducto: elementos.codigO_PRODUCTO,
            referencia1: elementos.referenciA_1,
            referencia2: null,
            numeroSerie: elementos.nrO_SERIE,
            nroOp: elementos.nrO_OP,
            lpnCant: nuevosRegistros.length,
            partNumber: elementos.parT_NUMBER,
            oem: elementos.oem,
            organizationCode: elementos.organizatioN_CODE,
            eanCode: modeloSeleccionado.eanCode
          })
        );
      } else {
        setTieneImei2(true);
        setDatosParaAniadir((prev) =>
          prev.concat({
            lpn: elementos.lpn,
            codigoProducto: elementos.codigO_PRODUCTO,
            referencia1: elementos.referenciA_1,
            referencia2: elementos.referenciA_2,
            numeroSerie: elementos.nrO_SERIE,
            nroOp: elementos.nrO_OP,
            lpnCant: nuevosRegistros.length,
            partNumber: elementos.parT_NUMBER,
            oem: elementos.oem,
            organizationCode: elementos.organizatioN_CODE,
            eanCode: modeloSeleccionado.eanCode
          })
        );
      }
    });
  };

  const datosPalet = () => {
    const nuevaFecha = new Date();
    const contador = ultimoPalet.id + 1;
    const digitos = contador < 10 ? 6 : 5;
    const nombrePlt = String(contador).padStart(digitos, "0");
    const numeroRegistro = `${plantaSeleccionada.organizationCode}-S-${nuevaFecha.getFullYear()}-${nombrePlt}`;
    const numeroPalet = `PLT-${nombrePlt}`;
    const nuevoPallet: IOQCPalet = {
      lpn: lpnWatch,
      oqcModeloId: modeloSeleccionado.id,
      oqcDesignadaId: contextGlobal.oqcDesigandaId,
      conforme: true,
      cerrado: true,
      operatorId: contextGlobal.auditorId,
      plantId: plantaSeleccionada.id,
      numeroPalet: numeroPalet,
      registro: numeroRegistro,
      cantidadMasterBox: 0,
      cantidadEquipos: 0
    };
    if (nuevoPallet !== null) {
      contextGlobal.setPalletCreado(nuevoPallet);
      return nuevoPallet;
    }
  };

  const onSubmit = async () => {
    const nuevoPallet = datosPalet();
    let paletCreadoId: number | null = null;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OQCPaletSliceRequests.PostRequest(nuevoPallet)));
      paletCreadoId = response.id;
      datosParaAniadir.forEach((elementos) => {
        elementos.palletId = response.id;
      });
      try {
        await dispatch(OQCNuevoPalletSliceRequest.multiPostRequest(datosParaAniadir));
      } catch (multiPostError) {
        if (paletCreadoId) {
          await dispatch(OQCPaletSliceRequests.deleteRequest(paletCreadoId));
        }
        throw multiPostError;
      }
      const verDatos = unwrapResult(await dispatch(OQCNuevoPalletSliceRequest.GetAllByLpn(lpnWatch)));
      if (verDatos) {
        contextGlobal.setPaletIngresado(verDatos);
      }
      openNotificationUI("Palet añadido", "success");
    } catch (error) {
      console.log(error);
      openNotificationUI("Error al crear el palet", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      reset();
      contextGlobal.setEquiposControlados(0);
      contextGlobal.setDatosZampling(true);
    }
  };

  const [listaCodigosMsn, setListaCodigosMsn] = useState([]);
  const [canidadImeisIngresados, setCantidadImeisIngresados] = useState([]);
  const verificarImeis = () => {
    const cambiarFormatoImei = watchImeis.split("\n").filter((elemento) => elemento !== "");
    const codigosMsn = cambiarFormatoImei.filter((msn) => msn.length <= 12);
    const imeisIngresadosFiltrados = cambiarFormatoImei.filter((imei) => imei.length >= 14);
    setCantidadImeisIngresados(imeisIngresadosFiltrados);
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    if (imeisIngresadosFiltrados.length == listaCodigosReferencia.length) {
      codigosMsn.forEach((elementos) => {
        if (elementos != null) {
          imeisIngresadosFiltrados.forEach((imeisIngresados) => {
            listaCodigosReferencia.forEach((imeisGuardados) => {
              if (imeisGuardados.Referencia_1 == imeisIngresados || imeisGuardados.Referencia_2 == imeisIngresados) {
                imeisGuardados.state = true;
              }
            });
          });
          setMostrarTabla(true);
        } else {
          openNotificationUI("Se encontraron valores nullos en el codigo QR", "warning");
        }
      });
    }
    listaCodigosReferencia.forEach((elementos) => {
      if (elementos.state) {
        setCodigosCorrectos(true);
      } else {
        setCodigosCorrectos(false);
      }
    });
    datosParaAniadir.forEach((elementos, index) => {
      elementos.msn = codigosMsn[index];
    });
    setListaCodigosMsn(codigosMsn);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const resetearImeis = () => {
    setCantidadImeisIngresados([]);
    setMostrarTabla(false);
    setValue("codesIMEI", "");
    seleccionarImeis(3);
  };

  const obtenerInput = (index: number) => inputRefs.current[index];

  const manejarEnter = async (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputActual = obtenerInput(index);
      if (!inputActual) return;
      const esValido = await trigger(inputActual.name);
      if (!esValido) {
        inputActual.select();
        return;
      }
      const siguienteInput = obtenerInput(index + 1);
      if (siguienteInput) {
        siguienteInput.focus();
      }
    }
  };

  const seleccionarImeis = (index: number) => {
    const inputActual = obtenerInput(index);
    if (inputActual) {
      inputActual.focus();
    }
  };

  const seleccionarLpn = (index: number) => {
    const inputActual = obtenerInput(index);
    if (inputActual) {
      inputActual.select();
    }
  };

  useEffect(() => {
    if (contextGlobal.masterBox) {
      seleccionarImeis(0);
    }
  }, [contextGlobal.masterBox]);

  useEffect(() => {
    if (watchImeis) {
      verificarImeis();
    }
  }, [watchImeis]);

  return (
    <section className="text-textColor z-10 w-full mt-[-24px] m-auto pt-4 rounded-md min-h-fit">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row w-full justify-between items-center mt-4">
          <p className="font-semibold text-base">Escanear Master Box según el Orden</p>
          <img
            onClick={() => {
              openModalAyuda(!modalAyuda);
            }}
            className="w-[10%] cursor-pointer"
            src={botonImagenAyudaEtiqueta}
            alt=""
          />
        </div>
        {/*Comienzo de los inputs*/}
        <section className="m-auto mt-5 w-full flex flex-col items-center justify-center gap-y-5">
          <div className="flex flex-row justify-center items-center">
            <span className="bg-green-500 text-white font-bold px-4 py-2 text-xl rounded-full mr-8">1</span>
            <div className="flex flex-col text-center">
              <Controller
                name="cajaMultiple"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="nuevo-pallet"
                    placeholder="CODIGO LPN"
                    autoComplete="off"
                    className="inputNuevoPallet"
                    onKeyUp={(event) => {
                      getInfoLpn(event);
                    }}
                    {...register("cajaMultiple", {
                      required: {
                        value: true,
                        message: "Ingrese Una Master Box"
                      },
                      validate: (value: string) => {
                        if (value.substring(0, 1).toLocaleLowerCase() != "n") {
                          return "Codigo incorrecto";
                        } else {
                          return true;
                        }
                      }
                    })}
                    ref={(el) => { inputRefs.current[0] = el; }}
                  />
                )}
              />
              {errors.cajaMultiple && errors.cajaMultiple.type === "required" && (
                <span className="text-xs font-semibold text-blue-500">Ingrese una master Box</span>
              )}
              {errors.cajaMultiple && errors.cajaMultiple.type === "validate" && (
                <p className="text-xs font-semibold text-red-600">{errors.cajaMultiple?.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-center items-center">
            <span className="bg-green-500 text-white font-bold px-4 py-2 text-xl rounded-full mr-8">2</span>
            <div className="flex flex-col text-center">
              <Controller
                name="salesModel"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="nuevo-pallet"
                    autoComplete="off"
                    placeholder="SALES MODEL"
                    className="inputNuevoPallet"
                    onKeyUp={(event) => manejarEnter(event, 1)}
                    {...register("salesModel", {
                      required: {
                        value: true,
                        message: "Ingrese un SALES MODEL"
                      },
                      validate: (value) => (value === codigoProducto ? true : "Codigo Incorrecto")
                    })}
                    ref={(el) => { inputRefs.current[1] = el; }}
                  />
                )}
              />
              {errors.salesModel && errors.salesModel?.type === "required" && (
                <span className="text-xs font-semibold text-blue-500">Ingrese un Sales Model</span>
              )}
              {errors.salesModel && errors.salesModel?.type === "validate" && (
                <p className="text-xs font-semibold text-red-600">{errors.salesModel?.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-center items-center">
            <span className="bg-green-500 text-white font-bold px-4 py-2 text-xl rounded-full mr-8">3</span>
            <div className="flex flex-col text-center">
              <Controller
                name="codeEAN"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="nuevo-pallet"
                    autoComplete="off"
                    placeholder="EAN CODE"
                    className="inputNuevoPallet"
                    onKeyUp={(event) => manejarEnter(event, 2)}
                    {...register("codeEAN", {
                      required: {
                        value: true,
                        message: "Ingrese el codigo EAN."
                      },
                      validate: (value) => (value === modeloSeleccionado.eanCode ? true : "Codigo incorrecto")
                    })}
                    ref={(el) => { inputRefs.current[2] = el; }}
                  />
                )}
              />
              {errors.codeEAN && errors.codeEAN?.type === "required" && (
                <span className="text-xs font-semibold text-blue-500">Ingrese un EAN Code</span>
              )}
              {errors.codeEAN && errors.codeEAN?.type === "validate" && (
                <p className="text-xs font-semibold text-red-600">{errors.codeEAN?.message}</p>
              )}
            </div>
          </div>
          <div
            className={`${mostrarTabla ? "absolute left-0 opacity-0" : "flex flex-row justify-center items-center"}`}>
            <span className="bg-green-500 text-white font-bold px-4 py-2 text-xl rounded-full mr-8">4</span>
            <div className="flex-col items-center">
              <Controller
                name="codesIMEI"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    name="codesIMEI"
                    placeholder="TODOS LOS NUMEROS DE IMEI"
                    cols={34}
                    rows={3}
                    style={{ border: "1px solid #d1d5db", textAlign: "left" }}
                    className="inputNuevoPallet"
                    onKeyUp={(event) => {
                      manejarEnter(event, 3);
                    }}
                    {...register("codesIMEI", {
                      required: {
                        value: true,
                        message: "Ingrese los codigos IMEI"
                      },
                      validate: () => {
                        if (codigosCorrectos) {
                          return true;
                        } else if (listaCodigosReferencia.length !== canidadImeisIngresados.length) {
                          return "Faltan codigos Imeis";
                        } else {
                          return "Codigo incorrecto";
                        }
                      }
                    })}
                    ref={(el) => { inputRefs.current[3] = el; }}
                  />
                )}
              />
            </div>
          </div>
          {/*fin de los inputs*/}
          {/*Esta parte es lo que muestra la tabla que los numeros de referencia que estan bien y los que no estan bien*/}
          <div className={`${mostrarTabla ? "flex" : "hidden"} flex flex-row justify-center items-center w-[26rem]`}>
            <span className="bg-green-500 text-white font-bold px-4 py-2 text-xl rounded-full mr-8">4</span>
            <div
              className={`${
                mostrarTabla ? "flex" : "hidden"
              } px-2 w-[60%] flex-col overflow-scroll h-28 overflow-x-hidden border border-gray-400`}>
              <p className="text-center text-sm">TODOS LOS NUMEROS DE IMEI</p>
              <div className="w-full flex flex-col">
                {listaCodigosReferencia.map((elementos, index) => (
                  <div key={index} className="flex justify-between items-end">
                    <div>
                      <p className="text-sm">{elementos.Referencia_1}</p>
                      <p className="text-sm">{elementos.Referencia_2}</p>
                    </div>
                    <p className="text-center" key={index + 1}>
                      {elementos.state ? goodIcon : noGoodIcoon}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {errors.codesIMEI && <p className="-my-4 text-xs font-semibold text-red-600">{errors.codesIMEI?.message}</p>}
          {/*Esta parte es lo que muestra la tabla que los numeros de referencia que estan bien y los que no estan bien*/}
          <button
            type="button"
            className="bg-purple-500 text-white px-2 py-2 rounded-lg font-semibold"
            onClick={() => {
              resetearImeis();
            }}>
            Volver a ingresar imeis
          </button>
          <div className="text-center mb-4">
            <button
              type="button"
              className="bg-red-500 px-4 py-2 text-white rounded-md w-40 shadow-shadowBox"
              onClick={() => {
                contextGlobal?.setMasterBox(!contextGlobal?.masterBox);
                reset();
                refreshTable();
              }}>
              Cerrar Menu
            </button>
            <button
              type="submit"
              className={`${
                !isValid ? "bg-gray-400" : "bg-blue-700"
              } cursor-pointer ml-4 px-4 py-2 text-white rounded-md w-40 shadow-shadowBox`}
              disabled={!isValid}>
              Guardar
            </button>
          </div>
        </section>
      </form>
      <ModalCompoment
        openPopup={modalAyuda}
        setOpenPopup={openModalAyuda}
        title="Ayuda"
        subTitle="Diagrama de referencia para la disposición de etiquetas en el pallet"
        titleModalStyle="Audit"
        showModalCenterPage
        onCloseDynamic>
        <AyudaEtiquetaModal />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={contextGlobal.setDatosZampling}
        openPopup={contextGlobal.datosZampling}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Ingreso de datos de muestreo para el nuevo palet"
        title="Datos Sampling"
        onCloseDynamic>
        <DatosZamplingModal
          refreshTable={refreshTable}
          ListaCodigosMsn={listaCodigosMsn}
          datosPallet={datosParaAniadir}
          tiene2Imeis={tieneImei2}
        />
      </ModalCompoment>
    </section>
  );
};
