import React, { useContext, useEffect, useRef, useState } from "react";
import botonImagenAyudaEtiqueta from "../../../images/Group2447.png";
import { ContextApp } from "../../../Context/Context";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { DatosZamplingModal } from "./DatosZamplingModal";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { Check, Close } from "@mui/icons-material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { OQCNuevoPalletSliceRequest } from "app/features/oqcGeneral/slices/OQCNuevoPalletSlice";
import { AyudaEtiquetaModal } from "../Components/AyudaEtiquetaModal";

interface Props {
  refreshTable: () => void;
  modalAyuda: boolean;
  openModalAyuda: (nuevoEstado: boolean) => void;
}

export const ContinuarPalletModal: React.FC<Props> = ({ refreshTable, openModalAyuda, modalAyuda }) => {
  const datosPalet = useAppSelector((state) => state.oqcPalet.object);
  const modeloSeleccionado = useAppSelector((state) => state.oqcModelo.object);

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
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);
  const { openNotificationUI } = useNotificationUI();
  const contextGlobal = useContext(ContextApp);
  const dispatch = useAppDispatch();
  const [tiene2Imeis, setTieneImei2] = useState(false);
  const watchImeis = watch("codesIMEI");
  const lpnWatch = watch("cajaMaster");
  const goodIcon = <Check sx={{ color: "green" }}></Check>;
  const noGoodIcoon = <Close sx={{ color: "red" }}></Close>;

  const [modeloNewsan, setModeloNewsan] = useState("");
  const [listaCodigosReferencia, setListaCodigosReferencia] = useState([]);
  const [datosParaAniadir, setDatosParaAniadir] = useState([]);
  const verDatosTrazaLpn = async (event: any) => {
    try {
      if (event.key === "Enter") {
        event.preventDefault();
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(XXE_WIP_ITF_SERIESliceRequests.GetByLPN(lpnWatch)));
        contextGlobal.setGetDatosModelo(response);
        if (response && response.length > 0) {
          if (modeloSeleccionado.modeloNewsan.substring(0, 2) == "91") {
            setModeloNewsan(modeloSeleccionado.modeloNewsan.slice(2));
            console.log(response);
          } else {
            console.log(modeloSeleccionado.modeloNewsan);
            setModeloNewsan(modeloSeleccionado.modeloNewsan);
          }
          generarListaNumerosImeis(response);
          generarEntradas(response);
          manejarEnter(event, 0);
        } else {
          seleccionarLpn(0);
          openNotificationUI("El codigo LPN es erroneo", "error");
          setListaCodigosReferencia([]);
          setDatosParaAniadir([]);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error);
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
            eanCode: modeloSeleccionado.eanCode,
            palletId: datosPalet.id
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
            eanCode: modeloSeleccionado.eanCode,
            palletId: datosPalet.id
          })
        );
      }
    });
  };

  const [listaMasterBox, setListaMasterBox] = useState([]);
  const verificarSiEstaIngresado = async () => {
    const array: any[] = [];
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(OQCDesignadaResultadoSliceRequests.getAllRegistersByPalletId(datosPalet.id))
      );
      if (response) {
        response.forEach((elementos) => {
          array.push(elementos.cajaMaster);
        });
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error, "Error");
    }
    setListaMasterBox([...new Set(array)]);
  };

  const getPallets = async () => {
    contextGlobal.setPaletId(datosPalet.id);
    contextGlobal.setOqcDesigandaId(datosPalet.oqcDesignadaId);
    contextGlobal.setPaletId(datosPalet.id);
  };

  const onSubmit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const verDatos = unwrapResult(await dispatch(OQCNuevoPalletSliceRequest.GetAllByLpn(lpnWatch)));
      await dispatch(OQCNuevoPalletSliceRequest.multiPostRequest(datosParaAniadir));
      if (verDatos.length > 0) {
        contextGlobal.setPaletIngresado(verDatos);
      }
      contextGlobal.setCodigoLpn(lpnWatch);
      contextGlobal.setDatosZampling(true);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
    }
    reset();
    setCantidadImeisIngresados([]);
    setMostrarTabla(false);
    setValue("codesIMEI", "");
    console.log(contextGlobal.continuarPallet);
  };

  const [listaNumerosMsn, setListaNumerosMsn] = useState([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [codigosCorrectos, setCodigosCorrectos] = useState(false);
  const [cantidadImeisIngresados, setCantidadImeisIngresados] = useState([]);

  const verificarImeis = () => {
    const cambiarFormatoImei = watchImeis.split("\n").filter((elemento) => elemento !== "");
    const codigosMsn = cambiarFormatoImei.filter((msn) => msn.length <= 12);
    const imeisIngresadosFiltrados = cambiarFormatoImei.filter((imei) => imei.length >= 14);
    setCantidadImeisIngresados(imeisIngresadosFiltrados);
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));

    console.log(codigosMsn);

    if (imeisIngresadosFiltrados.length == listaCodigosReferencia.length) {
      codigosMsn.forEach((elementos) => {
        if (elementos != null) {
          imeisIngresadosFiltrados.forEach((imeisIngresados) => {
            listaCodigosReferencia.forEach((imeisGuardados) => {
              console.log(imeisGuardados.Referencia_1, imeisGuardados.Referencia_2, imeisIngresados);
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
    setListaNumerosMsn(codigosMsn);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
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

  const resetearImeis = () => {
    setCantidadImeisIngresados([]);
    setMostrarTabla(false);
    setValue("codesIMEI", "");
    seleccionarImeis(3);
  };

  const dejarContinuarPalletAbierto = () => {
    seleccionarImeis(0);
    getPallets();
    verificarSiEstaIngresado();
    setListaCodigosReferencia([]);
  };

  useEffect(() => {
    if (contextGlobal.continuarPallet) {
      seleccionarImeis(0);
      getPallets();
      verificarSiEstaIngresado();
    }
  }, [contextGlobal.continuarPallet]);

  useEffect(() => {
    if (watchImeis) {
      verificarImeis();
    }
  }, [watchImeis]);

  return (
    //Este modal es lo mismo que el modal de nuevoRegistro, solo que en vez de crear un nuevo palet seguimos ingresando muestras sobre el mismo palet que ingresamos cuando hicimos un nuevo registro. Las verificaciones son las mismas que en el otro modal
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
        <section className="m-auto mt-5 w-full flex flex-col items-center justify-center gap-y-5">
          <div className="flex flex-row justify-center items-center">
            <span className="bg-green-500 text-white font-bold px-4 py-2 text-xl rounded-full mr-8">1</span>
            <div className="flex flex-col text-center">
              <Controller
                name="cajaMaster"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    name="cajaMaster"
                    placeholder="MASTER BOX"
                    autoComplete="off"
                    onKeyUp={(event) => {
                      verDatosTrazaLpn(event);
                    }}
                    className="inputNuevoPallet"
                    {...register("cajaMaster", {
                      required: {
                        value: true,
                        message: "Ingrese una Master Box"
                      },
                      validate: (value: string) => {
                        const masterEncontrada = listaMasterBox.some((elementos) => {
                          return value == elementos;
                        });
                        if (value.substring(0, 1).toLowerCase() != "n") {
                          return "Codigo incorrecto";
                        } else if (masterEncontrada) {
                          return "La caja ya se encuentra en el pallet";
                        } else {
                          return true;
                        }
                      }
                    })}
                    ref={(el) => { inputRefs.current[0] = el; }}
                  />
                )}
              />
              {errors.cajaMaster && errors.cajaMaster?.type === "required" && (
                <span className="text-xs font-semibold text-blue-500">Ingrese una master Box</span>
              )}
              {errors.cajaMaster && errors.cajaMaster?.type === "validate" && (
                <span className="text-xs font-semibold text-red-500">{errors.cajaMaster.message}</span>
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
                    name="salesModel"
                    placeholder="SALES MODEL"
                    autoComplete="off"
                    className="inputNuevoPallet"
                    {...register("salesModel", {
                      required: {
                        value: true,
                        message: "Ingrese un SALES MODEL"
                      },
                      validate: (value) => (value == modeloNewsan ? true : "Codigo incorrecto")
                    })}
                    ref={(el) => { inputRefs.current[1] = el; }}
                    onKeyUp={(event) => {
                      manejarEnter(event, 1);
                    }}
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
                    placeholder="EAN CODE"
                    autoComplete="off"
                    className="inputNuevoPallet"
                    {...register("codeEAN", {
                      required: {
                        value: true,
                        message: "Ingrese el codigo EAN."
                      },
                      validate: (value) => (value == datosPalet.oqcModelo.eanCode ? true : "Codigo incorrecto")
                    })}
                    ref={(el) => { inputRefs.current[2] = el; }}
                    onKeyUp={(event) => {
                      manejarEnter(event, 2);
                    }}
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
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="TODOS LOS NUMEROS DE IMEI"
                    cols={34}
                    rows={3}
                    className="inputNuevoPallet"
                    style={{ border: "1px solid #d1d5db", textAlign: "left" }}
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
                        } else if (listaCodigosReferencia.length !== cantidadImeisIngresados.length) {
                          return "Faltan imeis";
                        } else {
                          return "Codigos incorrectos";
                        }
                      }
                    })}
                    ref={(el) => { inputRefs.current[3] = el; }}
                  />
                )}
              />
            </div>
          </div>
          <div className={`${mostrarTabla ? "flex" : "hidden"} flex flex-row justify-center items-center w-[26rem]`}>
            <span className="bg-green-500 text-white font-bold px-4 py-2 text-xl rounded-full mr-8">4</span>
            <div
              className={`${
                mostrarTabla ? "flex" : "hidden"
              } px-2 w-[60%] flex-col overflow-scroll h-32 overflow-x-hidden border border-gray-400`}>
              <p className="text-center text-sm">TODOS LOS NUMEROS DE IMEI</p>
              <div className="w-full flex flex-col">
                {listaCodigosReferencia.map((elementos, index) => (
                  <div key={index} className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-textColor">{elementos.Referencia_1}</p>
                      <p className="text-sm text-textColor">{elementos.Referencia_2}</p>
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
                contextGlobal.setContinuarPallet(false);
                reset();
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
        subTitle="Ingreso de datos de muestreo para el palet"
        title="Datos Sampling"
        onCloseDynamic>
        <DatosZamplingModal
          dejarContinuarPaletAbierto={dejarContinuarPalletAbierto}
          refreshTable={refreshTable}
          ListaCodigosMsn={listaNumerosMsn}
          datosPallet={datosParaAniadir}
          tiene2Imeis={tiene2Imeis}
        />
      </ModalCompoment>
      {/* <Dialog fullScreen={fullScreen} open={contextGlobal.datosZampling} onClose={contextGlobal.setDatosZampling} classes={{ paper: classes.dialogWrapper }}>
                <DialogTitle>
                    <div className="bg-gradient-to-r from-newsan via-newsanLighten to-newsan shadow-elevation-6 rounded-md text-gray-900 dark:text-gray-200 ">
                        <div className="rounded-xl text-center px-4 py-2">
                            <h1 className="text-2xl text-gray-50">{"Iniciando Nuevo Pallet"}</h1>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent sx={{ maxHeight: "none" }}>
                    <DatosZampling dejarContinuarPaletAbierto={dejarContinuarPalletAbierto} refreshTable={refreshTable} ListaCodigosMsn={listaNumerosMsn} datosPallet={datosParaAniadir} tiene2Imeis={tiene2Imeis} />
                </DialogContent>
            </Dialog> */}
    </section>
  );
};
