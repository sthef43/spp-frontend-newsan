/* eslint-disable unused-imports/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ContextApp } from "../../../Context/Context";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModalHallazgos } from "./ModalHallazgos";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
import { VerDatosParaAgregar } from "./VerDatosParaAgregar";
import { IOQCNuevoPallet } from "app/models/IOQCNuevoPallet";
import { Add, ArrowDropDown } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { EditarSupervisores } from "./OQCSupervisores";
import { IOQCModelo } from "app/models/IOQModelo";
import { IOQCPalet } from "app/models/IOQCPalet";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { oqcSupervisoresMotorolaSlice } from "app/features/oqcGeneral/slices/OqcSupervisoresMotorola";
import { IDatesMotorola } from "app/models/sfcsplus/IDatesMotorola";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { OQCPaletSliceRequests, oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";
import { limpiarPalet } from "app/features/oqcGeneral/helpers/limpiarEntidad";

//Interface que se usa para el useForm
interface defaultValues {
  Supervisor: string;
  obaTest: string;
  Estetica: string;
  Packing: string;
  EANCodeUnitaria: string;
  serieNewsan: string;
  msnUnitaria: string;
  imei: string;
  imei2: string;
  imeiEquipo1: string;
  imeiEquipo2: string;
  trackId: string;
  observacion: string;
}

const initialValue = {
  Supervisor: "",
  obaTest: "",
  Estetica: "",
  Packing: "",
  EANCodeUnitaria: "",
  serieNewsan: "",
  msnUnitaria: "",
  imei: "",
  imei2: "",
  imeiEquipo1: "",
  imeiEquipo2: "",
  trackId: "",
  observacion: ""
};

interface prop {
  refreshTable?: () => void;
  tiene2Imeis?: boolean;
  datosPallet?: IOQCNuevoPallet[];
  equiposIngresados?: IOQCDesignadaResultado[];
  ListaCodigosMsn?: any[];
  numeroPallet?: string;
  dejarContinuarPaletAbierto?: () => void;
  refreshMuestrasPallet?: () => void;
}

export const DatosZamplingModal: React.FC<prop> = ({
  tiene2Imeis,
  datosPallet,
  equiposIngresados,
  ListaCodigosMsn,
  numeroPallet,
  refreshTable,
  dejarContinuarPaletAbierto,
  refreshMuestrasPallet
}) => {
  const modeloSeleccionado = useAppSelector((state) => state.oqcModelo.object as IOQCModelo);
  const oqcPalet = useAppSelector((state) => state.oqcPalet.object as IOQCPalet);
  const lineaSeleccionada = useAppSelector((state) => state.lineaProduccion.object as ILineaProduccion);
  const oqc = useAppSelector((state) => state.oqc.object);

  const [openModalHallazgos, setOpenModalHallazgos] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);
  const { openNotificationUI } = useNotificationUI();
  const contextoGlobal = useContext(ContextApp);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: "all"
  });
  const opciones = ["GOOD", "NG", "NO GOOD"];
  const watchEanCode = watch("EANCodeUnitaria");
  contextoGlobal.supervisor = watch("Supervisor");
  contextoGlobal.obaTest = watch("obaTest");
  contextoGlobal.estetica = watch("Estetica");
  contextoGlobal.packing = watch("Packing");
  const serieNewsanWatch = watch("serieNewsan");

  //Llamada a los modelos segun la lpn ingresada, de todos los modelos solo setea un solo modelo y asignacion del turno segun la hora
  const [datosModelo, setDatosModelo] = useState<IXXE_WIP_ITF_SERIE[]>([]);
  const [fechaFormateada, setFechaFormateada] = useState(new Date());
  const getDatosModelo = () => {
    contextoGlobal.getDatosModelo.forEach((elementos, index) => {
      if (index == 0 && datosModelo.length == 0) {
        setDatosModelo((prevState) => prevState.concat(elementos));
      }
    });
  };

  const [listadoMuestras, setListadoMuestras] = useState<IOQCDesignadaResultado[]>([]);
  const listaMuestrasIngresadas = async () => {
    if (oqcPalet.id != null) {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(
          await dispatch(OQCDesignadaResultadoSliceRequests.getAllRegistersByPalletId(oqcPalet.id))
        );
        if (response) {
          setListadoMuestras(response);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } catch (error) {
        console.log(error);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  // //Funcion que segun el select que se ingrese como NG los demas se seten como GOOD
  // const setearSegunError = () => {
  //     if (contextoGlobal.obaTest == "NG") {
  //         setValue("obaTest", `NG`)
  //         setValue("Estetica", "GOOD")
  //         setValue("Packing", "GOOD")
  //     }
  //     if (contextoGlobal.estetica == "NG") {
  //         setValue("Estetica", `NG`)
  //         setValue("obaTest", "GOOD")
  //         setValue("Packing", "GOOD")
  //     }
  //     if (contextoGlobal.packing == "NG") {
  //         setValue("Packing", `NG`)
  //         setValue("Estetica", "GOOD")
  //         setValue("obaTest", "GOOD")
  //     }
  // }

  //Funcion que envia los datos que ingreso el usuario
  const sendForm = async (datosRecibidos) => {
    let responseOqcDesignadoResultado: IOQCDesignadaResultado = null;
    const ponderacionCalculada = calcularPonderacion();
    const buscarMasterBox = listadoMuestras.filter((elementos) => elementos.cajaMaster == contextoGlobal.codigoLpn);
    let contadorMasterBox = oqcPalet.cantidadMasterBox;
    let contadorEquipos = oqcPalet.cantidadEquipos;
    if (buscarMasterBox.length == 0) {
      contadorMasterBox = contadorMasterBox += 1;
    }
    const cantidadEquipos = (contadorEquipos += 1);
    const nuevoOqcDesignadoresultado = {
      eanCode: datosRecibidos.EANCodeUnitaria,
      codigoModelo: modeloSeleccionado.modeloMoto,
      observacion: datosRecibidos.observacion,
      numeroSerie: datosRecibidos.serieNewsan,
      imei: datosRecibidos.imei,
      imei2: tiene2Imeis ? datosRecibidos.imei2 : null,
      cajaMaster: contextoGlobal.codigoLpn,
      msn: datosRecibidos.msnUnitaria,
      validate: contextoGlobal.comentariosNg.length > 0 ? false : true,
      oqcDesignadaId: contextoGlobal.oqcDesigandaId,
      oqcHallazgoResult: contextoGlobal.comentariosNg,
      operatorId: contextoGlobal.auditorId,
      oqcPaletId: oqcPalet.id,
      trackId: datosRecibidos.trackId,
      numeroOp: datosPallet[0].nroOp,
      indicePonderacion: ponderacionCalculada
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      nuevoOqcDesignadoresultado.oqcHallazgoResult.forEach((elementos) => {
        delete elementos.oqcBloqueHallazgo;
      });
      const actualizarPallet = limpiarPalet({
        ...oqcPalet,
        cantidadEquipos: cantidadEquipos,
        cantidadMasterBox: contadorMasterBox
      }) as IOQCPalet;
      const response = unwrapResult(await dispatch(OQCPaletSliceRequests.PutRequest(actualizarPallet)));
      try {
        responseOqcDesignadoResultado = unwrapResult(
          await dispatch(OQCDesignadaResultadoSliceRequests.PostRequest(nuevoOqcDesignadoresultado))
        );
      } catch (postError) {
        const revertirPalet = limpiarPalet({
          ...oqcPalet,
          cantidadEquipos: oqcPalet.cantidadEquipos,
          cantidadMasterBox: oqcPalet.cantidadMasterBox
        }) as IOQCPalet;
        await dispatch(OQCPaletSliceRequests.PutRequest(revertirPalet));
        throw postError;
      }
      if (oqc.email) {
        if (!oqc.emailNG) {
          await dispatch(EmailSliceRequest.SendEmailNewOQC(responseOqcDesignadoResultado));
        } else {
          if (contextoGlobal.comentariosNg.find((elementos) => elementos.state == false)) {
            const dataFiltrada = {
              ...responseOqcDesignadoResultado,
              oqcHallazgoResult: responseOqcDesignadoResultado.oqcHallazgoResult.filter(
                (items) => items.state === false
              )
            };
            await dispatch(EmailSliceRequest.SendEmailNewOQC(dataFiltrada));
          }
        }
      }
      openNotificationUI("Se Realizo el OQC con Exito", "success");
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    listaMuestrasIngresadas();
    aniadirLista(responseOqcDesignadoResultado);
    reset(initialValue);
    setearSupervisor();
    seleccionarImeis(0);
  };

  const [listaDeDatosParaAniadir, setListaDeDatosParaAniadir] = useState<IOQCDesignadaResultado[]>([]);
  const aniadirLista = (data: IOQCDesignadaResultado) => {
    const ponderacionCalculada = calcularPonderacion();
    setListaDeDatosParaAniadir((prev) =>
      prev.concat({
        eanCode: watchEanCode,
        codigoModelo: data.codigoModelo,
        observacion: data.observacion,
        numeroSerie: data.numeroSerie,
        imei: data.imei,
        imei2: tiene2Imeis ? data.imei2 : null,
        cajaMaster: contextoGlobal.codigoLpn,
        msn: data.msn,
        validate: contextoGlobal.comentariosNg.length > 0 ? false : true,
        oqcDesignadaId: contextoGlobal.oqcDesigandaId,
        oqcHallazgoResult: contextoGlobal.comentariosNg,
        operatorId: contextoGlobal.auditorId,
        oqcPaletId: oqcPalet.id,
        trackId: data.trackId,
        numeroOP: datosPallet[0].nroOp,
        indicePonderacion: ponderacionCalculada
      })
    );
  };

  const calcularPonderacion = () => {
    const hallazgosEncontrados: IOQCBloqueHallazgo[] = contextoGlobal.bloquesGroup.flatMap(
      (elementos) => elementos.oqcBloque.oqcBloqueHallazgo
    );
    const hallazgosFiltrados: IOQCBloqueHallazgo[] = [];

    hallazgosEncontrados.forEach((elementos) => {
      contextoGlobal.comentariosNg.map((hallazgosOQC) => {
        if (elementos.id === hallazgosOQC.oqcBloqueHallazgoId && hallazgosOQC.state === false) {
          hallazgosFiltrados.push(elementos);
        }
      });
    });

    const hallazgosPonderacionA: IOQCBloqueHallazgo[] = [];
    const hallazgosPonderacionB: IOQCBloqueHallazgo[] = [];
    const hallazgosPonderacionC: IOQCBloqueHallazgo[] = [];

    hallazgosFiltrados.forEach((elementos) => {
      switch (elementos.oqcHallazgo.oqcPonderacion.nombre) {
        case "A":
          hallazgosPonderacionA.push(elementos);
          break;
        case "B":
          hallazgosPonderacionB.push(elementos);
          break;
        case "C":
          hallazgosPonderacionC.push(elementos);
          break;
      }
    });

    let indice = 0;
    const indiceCalculado =
      (1 -
        (hallazgosPonderacionA.length + hallazgosPonderacionB.length * 0.5 + hallazgosPonderacionC.length * 0.1) /
          hallazgosEncontrados.length) *
      100;

    if (hallazgosFiltrados.length > 0) {
      indice = indiceCalculado;
    } else {
      indice = 100;
    }
    return indice;
  };

  const [datosMotorola, setDatosMotorola] = useState<IDatesMotorola[]>([]);
  const obtenerInput = (index: number) => inputRefs.current[index];

  const manejarEnter = async (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputActual = obtenerInput(index);
      if (!inputActual) return;
      const esvalido = await trigger(inputActual.name);
      if (!esvalido) {
        inputActual.select();
        return;
      }
      if (index == 0) {
        const responseMotorola = unwrapResult(
          await dispatch(OQCDesignadaResultadoSliceRequests.GetAllDatesMotorola(inputActual.value))
        );
        if (responseMotorola) {
          setDatosMotorola(responseMotorola);
        }
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

  const cambiarValorSelect = () => {
    if (contextoGlobal.obaTest == "NG") {
      setValue("obaTest", "NO GOOD");
      setOpenModalHallazgos(true);
    }
    if (contextoGlobal.packing == "NG") {
      setValue("Packing", "NO GOOD");
      setOpenModalHallazgos(true);
    }
    if (contextoGlobal.estetica == "NG") {
      setValue("Estetica", "NO GOOD");
      setOpenModalHallazgos(true);
    }
  };

  const [openModalSupervisores, setOpenModalSupervisores] = useState(false);
  const abrirModalEditarSupervisores = () => {
    setOpenModalSupervisores(!openModalSupervisores);
  };

  const watchSupervisor = watch("Supervisor");
  const setearSupervisor = () => {
    if (watchSupervisor != "") {
      setValue("Supervisor", watchSupervisor);
      const operarioBuscado = contextoGlobal.listaOperarios.find((elementos) => {
        return elementos.nombre.includes(watchSupervisor);
      });
      dispatch(oqcSupervisoresMotorolaSlice.actions.setObject(operarioBuscado));
    }
    contextoGlobal.setComentariosNg([]);
  };

  const verificarEstado = () => {
    if (
      contextoGlobal.packing != "Packing" &&
      contextoGlobal.obaTest != "Oba Test" &&
      contextoGlobal.estetica != "Estetica" &&
      contextoGlobal.supervisor != "Supervisor"
    ) {
      return true;
    } else {
      return false;
    }
  };

  const cerrarDatosZamplingAndRefres = () => {
    refreshTable();
    ListaCodigosMsn = [];
    setDatosModelo([]);
    contextoGlobal.setDatosZampling(false);
    contextoGlobal.setMasterBox(false);
    if (contextoGlobal.continuarPallet == true) {
      setTimeout(() => {
        dejarContinuarPaletAbierto();
      }, 500);
    }
  };

  //Cuando se abra el modal de datos zampling se ejecutaran estas funciones
  useEffect(() => {
    if (contextoGlobal.datosZampling) {
      console.log(contextoGlobal.continuarPallet);
      getDatosModelo();
      listaMuestrasIngresadas();
      seleccionarImeis(0);
    }
  }, [contextoGlobal.datosZampling]);

  //Cuando uno de los selects cambie de valor se ejecutaran estas funciones
  useEffect(() => {
    if (contextoGlobal.obaTest || contextoGlobal.supervisor || contextoGlobal.estetica || contextoGlobal.packing) {
      cambiarValorSelect();
      contextoGlobal.listaOperarios.map((elementos) => {
        if (getValues("Supervisor") == elementos.nombre) {
          //contextoGlobal.setDNIOperator(elementos.dni)
        }
      });
    }
  }, [contextoGlobal.obaTest, contextoGlobal.supervisor, contextoGlobal.estetica, contextoGlobal.packing]);

  return (
    <main className="w-[75vw] max-h-[80vh] overflow-y-auto">
      <section className="rounded-md m-auto text-textColor">
        <section className="w-full relative">
          <div className="w-full flex flex-row justify-between flex-wrap gap-x-3 gap-y-1 p-3 rounded-md shadow-shadowBox border-gray-200 border">
            <div>
              <p className="datosCelualresZapling">
                Fecha:{" "}
                {`${fechaFormateada.getDate()}/${fechaFormateada.getMonth() + 1}/${fechaFormateada.getFullYear()}`}
              </p>
            </div>
            <div>
              <p className="datosCelualresZapling">Turno: {fechaFormateada.getHours() > 14 ? "Tarde" : "Mañana"}</p>
            </div>
            <div>
              <p className="datosCelualresZapling">{oqcPalet.registro}</p>
            </div>
            <div>
              <p className="datosCelualresZapling">Línea: {lineaSeleccionada.nombre}</p>
            </div>
            <div>
              <p className="datosCelualresZapling">Modelo: {modeloSeleccionado.modeloNewsan}</p>
            </div>
            <div>
              <p className="datosCelualresZapling">Familia: {datosPallet[0].partNumber}</p>
            </div>
            <div>
              <p className="datosCelualresZapling">Compañía: {modeloSeleccionado.compania}</p>
            </div>
          </div>
          {/*Comienzo de el formulario donde estan los inputs donde se ingresa el codigo de serie y sus numero de referencia*/}
          <form onSubmit={handleSubmit(sendForm)} className="flex flex-row justify-between gap-2 mt-2">
            <div
              className={`${
                tiene2Imeis ? "min-h-[26rem]" : "h-full"
              } bg-secondaryNew w-1/2 rounded-md shadow-shadowBox`}>
              <div className="flex w-[100.3%] justify-between border border-[#85CDD9] bg-[#85CDD9] p-2 rounded-t-md text-sm">
                <p>{datosPallet[0].nroOp}</p>
                <p>Registro: {oqcPalet.registro}</p>
                <p>Master Box: {datosPallet[0].lpn}</p>
              </div>
              {/*Comienzo de los inputs, se verifica que cada uno de los valores que se ingresan correspondan a su numero de serie en concreto, de no ser asi se muestra el error,
                            tambien se evalua si tiene doble imei, al tener doble imei se cambia la estructura del formulario y se añaden 2 campos mas*/}
              <p className="ml-4">Escanear según el orden</p>
              <div className="flex flex-col gap-y-2 items-center">
                <div className="flex items-center w-96 flex-col">
                  <Controller
                    name="serieNewsan"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="inputsDatosZapling"
                        placeholder="Serie Newsan"
                        autoComplete="off"
                        {...register("serieNewsan", {
                          required: {
                            value: true,
                            message: "Ingrese un numero de serie"
                          },
                          validate: (value) => {
                            let enPalet = false;
                            const isCodigoValido = datosPallet.some((elememento) => {
                              return value === elememento.numeroSerie;
                            });
                            const preCargados = listaDeDatosParaAniadir.some((elemento) => {
                              return value === elemento.numeroSerie;
                            });
                            if (listadoMuestras != null) {
                              if (listadoMuestras.length > 0) {
                                enPalet = listadoMuestras.some((elementos) => {
                                  return value == elementos.numeroSerie;
                                });
                              }
                            }
                            if (!isCodigoValido) {
                              return "Codigo Incorrecto";
                            } else if (preCargados) {
                              return "Este equipo esta en la lista para ser cargado";
                            } else if (enPalet) {
                              return "Este equipo se encuentra en un palet";
                            } else {
                              return true;
                            }
                          }
                        })}
                        ref={(el) => {
                          inputRefs.current[0] = el;
                        }}
                        onKeyUp={(event) => {
                          manejarEnter(event, 0);
                        }}
                      />
                    )}
                  />
                  {errors.serieNewsan && errors.serieNewsan?.type === "required" && (
                    <span className="text-xs font-semibold text-blue-500">Ingrese un numero de serie</span>
                  )}
                  {errors.serieNewsan && errors.serieNewsan?.type === "validate" && (
                    <p className="text-xs font-semibold text-red-600">{errors.serieNewsan?.message}</p>
                  )}
                </div>
                <div className="flex items-center w-96 flex-col">
                  <Controller
                    name="EANCodeUnitaria"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="inputsDatosZapling"
                        placeholder="EAN Code (unitaria)"
                        autoComplete="off"
                        {...register("EANCodeUnitaria", {
                          required: {
                            value: true,
                            message: "Ingrese un EAN CODE"
                          },
                          validate: (value) => {
                            if (value === modeloSeleccionado.eanCode) {
                              return true;
                            } else {
                              return "El codigo es incorrecto";
                            }
                          }
                        })}
                        ref={(el) => {
                          inputRefs.current[1] = el;
                        }}
                        onKeyUp={(event) => {
                          manejarEnter(event, 1);
                        }}
                      />
                    )}
                  />
                  {errors.EANCodeUnitaria && errors.EANCodeUnitaria?.type === "required" && (
                    <span className="text-xs font-semibold text-blue-500">Ingrese un EANCODE</span>
                  )}
                  {errors.EANCodeUnitaria && errors.EANCodeUnitaria?.type === "validate" && (
                    <p className="text-xs font-semibold text-red-600">{errors.EANCodeUnitaria?.message}</p>
                  )}
                </div>
                <div className="flex items-center w-96 flex-col">
                  <Controller
                    name="imei"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="inputsDatosZapling"
                        placeholder="IMEI (unitaria)"
                        autoComplete="off"
                        {...register("imei", {
                          required: {
                            value: true,
                            message: "ingrese un imei"
                          },
                          validate: (value) => {
                            const numeroSerie = datosPallet.find(
                              (elementos) => elementos.numeroSerie == serieNewsanWatch
                            );
                            if (!numeroSerie) {
                              return "Codigo Incorrecto";
                            } else if (numeroSerie.referencia1 == value) {
                              return true;
                            } else {
                              return "Codigo incorrecto";
                            }
                          }
                        })}
                        ref={(el) => {
                          inputRefs.current[2] = el;
                        }}
                        onKeyUp={(event) => {
                          manejarEnter(event, 2);
                        }}
                      />
                    )}
                  />
                  {errors.imei && errors.imei?.type === "required" && (
                    <span className="text-xs font-semibold text-blue-500">Ingrese el primer imei</span>
                  )}
                  {errors.imei && errors.imei?.type === "validate" && (
                    <p className="text-xs font-semibold text-red-600">{errors.imei?.message}</p>
                  )}
                </div>
                {tiene2Imeis && (
                  <div className={`${tiene2Imeis ? "flex" : "hidden"} items-center w-96 flex-col`}>
                    <Controller
                      name="imei2"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="inputsDatosZapling"
                          placeholder="IMEI 2(Unitaria)"
                          autoComplete="off"
                          {...register("imei2", {
                            required: {
                              value: true,
                              message: "Ingrese un coodigo de imei de equipo"
                            },
                            validate: (value) => {
                              const numeroSerie = datosPallet.find(
                                (elementos) => elementos.numeroSerie == serieNewsanWatch
                              );
                              if (!numeroSerie) {
                                return "Codigo Incorrecto";
                              } else if (numeroSerie.referencia2 == value) {
                                return true;
                              } else {
                                return "Codigo incorrecto";
                              }
                            }
                          })}
                          ref={(el) => {
                            inputRefs.current[3] = el;
                          }}
                          onKeyUp={(event) => {
                            manejarEnter(event, tiene2Imeis ? 3 : 99);
                          }}
                        />
                      )}
                    />
                    {errors.imei2 && errors.imei2?.type === "required" && (
                      <span className="text-xs font-semibold text-blue-500">Ingrese el segundo imei</span>
                    )}
                    {errors.imei2 && errors.imei2?.type === "validate" && (
                      <p className="text-xs font-semibold text-red-600">{errors.imei2?.message}</p>
                    )}
                  </div>
                )}
                <div className="flex items-center w-96 flex-col">
                  <Controller
                    name="msnUnitaria"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="inputsDatosZapling"
                        placeholder="MSN (unitaria)"
                        autoComplete="off"
                        {...register("msnUnitaria", {
                          required: {
                            value: true,
                            message: "ingrese un msn"
                          },
                          validate: (value) => {
                            const codigo = datosMotorola.find((elementos) =>
                              elementos.codigoPuesto.toLowerCase().includes("msn")
                            );
                            if (value !== codigo.codigo) {
                              return "Codigo Incorrecto";
                            } else {
                              return true;
                            }
                          }
                        })}
                        ref={(el) => {
                          inputRefs.current[tiene2Imeis ? 4 : 3] = el;
                        }}
                        onKeyUp={(event) => {
                          manejarEnter(event, tiene2Imeis ? 4 : 3);
                        }}
                      />
                    )}
                  />
                  {errors.msnUnitaria && errors.msnUnitaria?.type === "required" && (
                    <span className="text-xs font-semibold text-blue-500">Ingrese un MSN</span>
                  )}
                  {errors.msnUnitaria && errors.msnUnitaria?.type === "validate" && (
                    <p className="text-xs font-semibold text-red-600">{errors.msnUnitaria?.message}</p>
                  )}
                </div>
                <div className="flex items-center w-96 flex-col">
                  <Controller
                    name="trackId"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...register("trackId", {
                          required: {
                            value: true,
                            message: "Ingrese un trackId"
                          },
                          validate: (value) => {
                            const codigo = datosMotorola.find(
                              (elementos) =>
                                elementos.codigoPuesto.toLowerCase().includes("track") &&
                                !elementos.codigoPuesto.toLowerCase().includes("2")
                            );
                            console.log(codigo);
                            if (value !== codigo.codigo) {
                              return "Codigo Incorrecto";
                            } else {
                              return true;
                            }
                          }
                        })}
                        ref={(el) => {
                          inputRefs.current[tiene2Imeis ? 5 : 4] = el;
                        }}
                        type="text"
                        className="inputsDatosZapling"
                        placeholder="Track ID"
                        onKeyUp={(event) => {
                          manejarEnter(event, tiene2Imeis ? 5 : 4);
                        }}
                        autoComplete="off"
                      />
                    )}
                  />
                  {errors.trackId && errors.trackId?.type === "required" && (
                    <span className="text-xs font-semibold text-blue-500">Ingrese el codigo Track ID</span>
                  )}
                  {errors.trackId && errors.trackId?.message && (
                    <p className="text-xs font-semibold text-red-600">{errors.trackId?.message}</p>
                  )}
                </div>
                <div className="flex items-center w-96 flex-col">
                  <Controller
                    name="imeiEquipo1"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="inputsDatosZapling"
                        placeholder="IMEI 1(Equipo)"
                        autoComplete="off"
                        {...register("imeiEquipo1", {
                          required: {
                            value: true,
                            message: "ingrese el primer imei"
                          },
                          validate: (value) => {
                            const numeroSerie = datosPallet.find(
                              (elementos) => elementos.numeroSerie == serieNewsanWatch
                            );
                            if (!numeroSerie) {
                              return "Codigo Incorrecto";
                            } else if (numeroSerie.referencia1 == value) {
                              return true;
                            } else {
                              return "Codigo incorrecto";
                            }
                          }
                        })}
                        ref={(el) => {
                          inputRefs.current[tiene2Imeis ? 6 : 5] = el;
                        }}
                        onKeyUp={(event) => {
                          manejarEnter(event, tiene2Imeis ? 6 : 5);
                        }}
                      />
                    )}
                  />
                  {errors.imeiEquipo1 && errors.imeiEquipo1?.type === "required" && (
                    <span className="text-xs font-semibold text-blue-500">Ingrese el primer imei</span>
                  )}
                  {errors.imeiEquipo1 && errors.imeiEquipo1?.type === "validate" && (
                    <p className="text-xs font-semibold text-red-600">{errors.imeiEquipo1?.message}</p>
                  )}
                </div>
                {tiene2Imeis && (
                  <div className={`${tiene2Imeis ? "flex" : "hidden"} items-center w-96 flex-col`}>
                    <Controller
                      name="imeiEquipo2"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="inputsDatosZapling"
                          placeholder="IMEI 2(Equipo)"
                          autoComplete="off"
                          {...register("imeiEquipo2", {
                            required: {
                              value: true,
                              message: "Ingrese un coodigo de imei de equipo"
                            },
                            validate: (value) => {
                              const numeroSerie = datosPallet.find(
                                (elementos) => elementos.numeroSerie == serieNewsanWatch
                              );
                              if (!numeroSerie) {
                                return "Codigo Incorrecto";
                              } else if (numeroSerie.referencia2 == value) {
                                return true;
                              } else {
                                return "Codigo incorrecto";
                              }
                            }
                          })}
                          ref={(el) => {
                            inputRefs.current[tiene2Imeis ? 7 : 6] = el;
                          }}
                          onKeyUp={(event) => {
                            manejarEnter(event, tiene2Imeis ? 7 : 6);
                          }}
                        />
                      )}
                    />
                    {errors.imeiEquipo2 && errors.imeiEquipo2?.type === "required" && (
                      <span className="text-xs font-semibold text-blue-500">Ingrese el segundo imei</span>
                    )}
                    {errors.imeiEquipo2 && errors.imeiEquipo2?.type === "validate" && (
                      <p className="text-xs font-semibold text-red-600">{errors.imeiEquipo2?.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/2 px-5 flex flex-col items-center">
              <div className="flex flex-row w-full items-center">
                <div className="w-full flex justify-between items-center gap-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      contextoGlobal.setAbrirVerDatosParaAgregar(!contextoGlobal.abrirVerDatosParaAgregar);
                    }}
                    disabled={true}
                    className={`${listaDeDatosParaAniadir.length == 0 ? "bg-gray-300" : "bg-blue-600"} 
                                        text-left rounded-lg border-gray-200 border-2s w-28 h-8 pl-4 text-white font-bold text-xs`}>
                    Ver Equipos
                  </button>
                  <p
                    className={`${
                      contextoGlobal.mostrarHallazgos ? "ml-0" : "ml-20"
                    } font-semibold text-lg text-black`}>
                    Controladas
                  </p>
                  <span
                    className={`${
                      contextoGlobal.mostrarHallazgos ? "w-4/12" : "px-10"
                    } py-1 bg-secondaryNew text-textColor border-2 font-bold text-xl rounded-md border-gray-300 shadow-md`}>
                    {listadoMuestras.length}
                  </span>
                </div>
              </div>
              {/*Inicio de los selects, se selecciona el supervisor que esta realizando la carga de la muestra y al selecionar una de las opciones en no good el modal de hallazgos para realizar el oqc se va a abrir*/}
              <div className="w-full flex justify-center">
                <main className="flex flex-col w-full gap-y-4 mt-3">
                  <Controller
                    name="Supervisor"
                    control={control}
                    defaultValue="Supervisor"
                    render={({ field }) => (
                      <div className="flex items-center w-full justify-between">
                        <div className="grid items-center relative w-11/12">
                          <select
                            {...field}
                            className="row-start-1 col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-secondaryNew p-2 pr-8 rounded-sm shadow-shadowBox"
                            {...register("Supervisor", {
                              required: {
                                value: true,
                                message: "Ingrese un supervisor"
                              },
                              validate: (value) => {
                                if (value == "Supervisor") {
                                  return "Seleccione un supervisor";
                                } else {
                                  return true;
                                }
                              }
                            })}>
                            <option value="Supervisor">SUPERVISOR</option>
                            {contextoGlobal.listaOperarios.map((elementos) => (
                              <option key={elementos.id} value={elementos.nombre}>
                                {elementos.nombre}
                              </option>
                            ))}
                          </select>
                          <ArrowDropDown className="absolute right-5 col-start-1 pointer-events-none" />
                        </div>
                        <div>
                          <Tooltip title="Editar Supervisores">
                            <IconButton
                              onClick={() => abrirModalEditarSupervisores()}
                              size="small"
                              style={{ position: "relative" }}>
                              <Add color="primary" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  />
                  {errors.Supervisor && (
                    <p className="text-xs font-semibold text-red-600">{errors.Supervisor.message}</p>
                  )}
                  <div
                    className={`${
                      contextoGlobal.supervisor == "Supervisor" ? "hidden" : "block"
                    } flex flex-col gap-y-4`}>
                    <Controller
                      name="obaTest"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Ingrese el test de observacion" }}
                      render={({ field }) => (
                        <div className="grid items-center relative">
                          <select
                            {...field}
                            className="row-start-1 col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-secondaryNew p-2 rounded-sm shadow-shadowBox"
                            {...register("obaTest", {
                              required: {
                                value: true,
                                message: "Ingrese un supervisor"
                              },
                              validate: (value) => {
                                if (value == "Oba Test") {
                                  return "Ingrese una opcion";
                                } else {
                                  return true;
                                }
                              }
                            })}>
                            <option value="Oba Test">OBA TEST</option>
                            {opciones.map((elementos, index) => (
                              <option
                                className={`${elementos === "NO GOOD" ? "hidden" : ""}`}
                                value={elementos}
                                key={index}>
                                {elementos}
                              </option>
                            ))}
                          </select>
                          <ArrowDropDown className="absolute right-5 col-start-1 pointer-events-none" />
                        </div>
                      )}
                    />
                    {errors.obaTest?.message && (
                      <p className="text-xs font-semibold text-red-600">{errors.obaTest.message}</p>
                    )}
                    <Controller
                      name="Estetica"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Ingrese la estetica" }}
                      render={({ field }) => (
                        <div className="grid items-center relative">
                          <select
                            {...field}
                            className="row-start-1 col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-secondaryNew p-2 rounded-sm shadow-shadowBox"
                            {...register("Estetica", {
                              required: {
                                value: true,
                                message: "Ingrese un supervisor"
                              },
                              validate: (value) => {
                                if (value == "Estetica") {
                                  return "Ingrese un supervisor";
                                } else {
                                  return true;
                                }
                              }
                            })}>
                            <option value="Estetica">ESTETICA</option>
                            {opciones.map((elementos, index) => (
                              <option
                                className={`${elementos === "NO GOOD" ? "hidden" : ""}`}
                                value={elementos}
                                key={index}>
                                {elementos}
                              </option>
                            ))}
                          </select>
                          <ArrowDropDown className="absolute right-5 col-start-1 pointer-events-none" />
                        </div>
                      )}
                    />
                    {errors.Estetica?.message && (
                      <p className="text-xs font-semibold text-red-600">{errors.Estetica?.message}</p>
                    )}
                    <Controller
                      name="Packing"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Ingrese el packing" }}
                      render={({ field }) => (
                        <div className="grid items-center relative">
                          <select
                            {...field}
                            className="row-start-1 col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-secondaryNew p-2 rounded-sm h-12 shadow-[0_2px_2px_0_rgb(138,138,138,0.60)]"
                            {...register("Packing", {
                              required: {
                                value: true,
                                message: "Ingrese un supervisor"
                              },
                              validate: (value) => {
                                if (value == "Estetica") {
                                  return "Ingrese un supervisor";
                                } else {
                                  return true;
                                }
                              }
                            })}>
                            <option value="Packing">PACKING</option>
                            {opciones.map((elementos, index) => (
                              <option
                                className={`${elementos === "NO GOOD" ? "hidden" : ""}`}
                                value={elementos}
                                key={index}>
                                {elementos}
                              </option>
                            ))}
                          </select>
                          <ArrowDropDown className="absolute right-5 col-start-1 pointer-events-none" />
                        </div>
                      )}
                    />
                    {errors.Packing?.message && (
                      <p className="text-xs font-semibold text-red-600">{errors.Packing?.message}</p>
                    )}
                  </div>
                </main>
              </div>
              <div className="w-[107%] mt-3 px-3">
                <p className="text-sm text-textColor font-semibold">OBSERVACIÓN (Opcional)*</p>
                <Controller
                  name="observacion"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={2}
                      className="text-black w-full border border-gray-200 shadow-[0_1px_2px_0_rgb(138,138,138,0.60)]"></textarea>
                  )}
                />
              </div>
              <div className="flex flex-row w-full justify-between">
                <div className="flex w-full gap-x-4 justify-center mt-3">
                  <button
                    className={`${
                      isValid && verificarEstado() ? "bg-green-500" : "bg-gray-500"
                    } min-w-[10rem] px-4 py-2 rounded-md text-white font-semibold shadow-shadowBox whitespace-nowrap`}
                    type="submit"
                    disabled={!isValid}>
                    GUARDAR
                  </button>
                </div>
                <div className="flex w-full gap-x-4 justify-center mt-3">
                  <button
                    className="bg-red-500 min-w-[10rem] px-4 py-2 rounded-md text-white font-semibold shadow-shadowBox cursor-pointer whitespace-nowrap"
                    type="button"
                    onClick={() => {
                      cerrarDatosZamplingAndRefres();
                    }}>
                    CANCELAR
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </section>
      {/*Modal para confirmar el cierre de si se va ah seguir ingresando muestras de una misma master box o se va a terminar el ingreso de muestras*/}
      <ModalCompoment
        setOpenPopup={setOpenModalHallazgos}
        openPopup={openModalHallazgos}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Hallazgos registrados durante la inspección"
        title="Lista Hallazgos">
        <ModalHallazgos setOpenModal={setOpenModalHallazgos} openModal={openModalHallazgos}></ModalHallazgos>
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalSupervisores}
        openPopup={openModalSupervisores}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Supervisores disponibles para asignación"
        title="Lista Supervisores Dispinibles">
        <EditarSupervisores setOpenModal={setOpenModalSupervisores} openModal={openModalSupervisores} />
      </ModalCompoment>
      {contextoGlobal.abrirVerDatosParaAgregar && (
        <VerDatosParaAgregar tieneDosImeis={tiene2Imeis} listaDeDatos={listadoMuestras} />
      )}
    </main>
  );
};
