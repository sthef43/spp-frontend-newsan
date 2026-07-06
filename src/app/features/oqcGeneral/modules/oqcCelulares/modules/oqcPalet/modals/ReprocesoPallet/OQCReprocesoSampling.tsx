import { ArrowDropDown } from "@mui/icons-material";
import { Button } from "@mui/material";
import { OQCSupervisoresMotorolaSliceRequest } from "app/features/oqcGeneral/slices/OqcSupervisoresMotorola";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCPalet } from "app/models/IOQCPalet";
import { IOQCSupervisoresMotorola } from "app/models/IOQCSupervisoresMotorola";
import { IOQCModelo } from "app/models/IOQModelo";
import FetchApi from "app/shared/helpers/FetchApi";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../../../../shared/components/material-ui/MaterialButtons";
import { IOQCNuevoPallet } from "app/models/IOQCNuevoPallet";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { OQCHallazgos } from "./OQCHallazgos";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { IOperator } from "app/models";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { OQCPaletPrint } from "../../../../global/modals/OQCPaletPrint";
import { OQCPaletSliceRequests } from "app/features/oqcGeneral/slices/OQCPaletSlice";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";

interface Props {
  refresh: () => void;
  setOpenModalZampling: (newValue: boolean) => void;
  openModal: boolean;
  equiposMaster: IOQCNuevoPallet[];
  dobleImei: boolean;
  listaCodigosMsn: string[];
  plantaId: number;
}

export const OQCReprocesoSampling: React.FC<Props> = ({
  setOpenModalZampling,
  openModal,
  equiposMaster,
  dobleImei,
  listaCodigosMsn,
  plantaId,
  refresh
}) => {
  const {
    handleSubmit,
    control,
    watch,
    register,
    trigger,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm();

  const paletSeleccionado = useAppSelector<IOQCPalet>((state) => state.oqcPalet.object);
  const modelo = useAppSelector<IOQCModelo>((state) => state.oqcModelo.object);
  const linea = useAppSelector((state) => state.lineaProduccion.object);

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const usuario = GetInfoUser();
  const { openNotificationUI } = useNotificationUI();

  const [openModalHallazgos, setOpenModalHallazgos] = useState(false);
  const [openModalSeguirIngresando, setOpenModalSeguirIngresando] = useState(false);
  const [openModalTicket, setOpenModalTicket] = useState(false);

  const [hallazgosDispositivo, setHallazgosDispositivo] = useState([]);

  const [usarioIngresado, setUsuarioIngresado] = useState<IOperator>();
  const [listaSupervisores, setListaSupervisores] = useState<IOQCSupervisoresMotorola[]>([]);
  const [equiposEncontrado, setEquipoEncontrado] = useState<IOQCNuevoPallet>();
  const [ultimaMuestra, setUltimaMuestra] = useState<IOQCDesignadaResultado>();
  const [listaDeDatosParaAniadir, setListaDeDatosParaAniadir] = useState<IOQCDesignadaResultado[]>([]);
  const [nuevoEquiposOQC, setNuevoEquipoOQC] = useState<IOQCDesignadaResultado>();
  const [listaHallazgos, setListaHallazgos] = useState<IOQCBloqueHallazgo[]>([]);

  const fechaFormateada = new Date();
  const opciones = ["GOOD", "NG", "NO GOOD"];

  const watchSupervisores = watch("Supervisor");
  const watchObaTest = watch("obaTest");
  const watchEstetica = watch("Estetica");
  const watchPacking = watch("Packing");
  const watchReproceso = watch("reproceso");
  const watchNumeroSerie: string = watch("numeroSerie");

  FetchApi<IOperator>(OperatorSliceRequests.getInfoByDni, usuario.dni, true, openModal, setUsuarioIngresado);

  FetchApi<IOQCPalet>(OQCPaletSliceRequests.getByIdRequest, paletSeleccionado.id, true, openModal);

  FetchApi<IOQCSupervisoresMotorola[]>(
    OQCSupervisoresMotorolaSliceRequest.getAllSupervisoresByPlantId,
    plantaId,
    true,
    openModal,
    setListaSupervisores
  );

  const guardarOqcEquipos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OQCDesignadaResultadoSliceRequests.PostRequest(nuevoEquiposOQC)));
      if (response) {
        openNotificationUI("Se Realizo Con Exito los OQC", "success");
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getLastEquipo = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseLastOQC = unwrapResult(
        await dispatch(OQCDesignadaResultadoSliceRequests.getLastReportByPalletId(paletSeleccionado.id))
      );
      if (responseLastOQC) {
        setUltimaMuestra(responseLastOQC);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const aniadirLista = () => {
    setListaDeDatosParaAniadir((prev) =>
      prev.concat({
        eanCode: paletSeleccionado.oqcModelo.eanCode,
        codigoModelo: nuevoEquiposOQC.observacion,
        observacion: nuevoEquiposOQC.observacion,
        numeroSerie: nuevoEquiposOQC.numeroSerie,
        imei: nuevoEquiposOQC.imei,
        imei2: dobleImei ? nuevoEquiposOQC.imei2 : null,
        cajaMaster: equiposMaster[0].lpn,
        msn: nuevoEquiposOQC.msn,
        validate: hallazgosDispositivo.length > 0 ? false : true,
        oqcDesignadaId: paletSeleccionado.oqcDesignada.id,
        oqcHallazgoResult: hallazgosDispositivo,
        operatorId: usarioIngresado.id,
        oqcPaletId: paletSeleccionado.id,
        trackId: nuevoEquiposOQC.trackId,
        numeroOP: equiposMaster[0].nroOp,
        indicePonderacion: 0
      })
    );
    setOpenModalSeguirIngresando(true);
  };

  const sendData = (data) => {
    const nuevoObjeto: IOQCDesignadaResultado = {
      eanCode: paletSeleccionado.oqcModelo.eanCode,
      codigoModelo: paletSeleccionado.oqcModelo.modeloMoto,
      observacion: data.observacion,
      numeroSerie: data.numeroSerie,
      imei: data.imei1,
      imei2: dobleImei ? data.imei2 : null,
      cajaMaster: equiposMaster[0].lpn,
      msn: data.msnUnitaria,
      validate: hallazgosDispositivo.length > 0 ? false : true,
      oqcDesignadaId: paletSeleccionado.oqcDesignada.id,
      oqcHallazgoResult: hallazgosDispositivo,
      operatorId: usarioIngresado.id,
      oqcPaletId: paletSeleccionado.id,
      trackId: data.trackId,
      numeroOP: equiposMaster[0].nroOp,
      indicePonderacion: 0
    };
    if (nuevoObjeto != undefined) {
      nuevoObjeto.oqcHallazgoResult.forEach((elementos) => {
        delete elementos.oqcBloqueHallazgo;
      });
      setNuevoEquipoOQC(nuevoObjeto);
    }
  };
  const buscarNumeroSerie = () => {
    if (watchNumeroSerie.length >= 15) {
      setEquipoEncontrado(equiposMaster.find((elementos) => elementos.numeroSerie == watchNumeroSerie));
    } else {
      setEquipoEncontrado(undefined);
    }
  };

  const seleccionarPrimerInput = async (index) => {
    const inputs = document.querySelectorAll(".inputsDatosZapling");
    const inputActual = inputs[index] as HTMLInputElement;
    if (inputActual) {
      inputActual.focus();
    }
  };

  const manejarEnter = async (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".inputsDatosZapling");
      const inputActual = inputs[index] as HTMLInputElement;
      const esvalido = await trigger(inputActual.name);
      if (!esvalido) {
        inputActual.select();
        return;
      }
      const siguienteInput = inputs[index + 1];
      if (siguienteInput && siguienteInput instanceof HTMLElement) {
        siguienteInput.focus();
      }
    }
  };

  const activarModalHallazgos = () => {
    let opcion = "";
    if (watchPacking == "NG") {
      opcion = "packing";
      setValue("Packing", "NO GOOD");
      setOpenModalHallazgos(true);
    }
    if (watchObaTest == "NG") {
      opcion = "obaTest";
      setValue("obaTest", "NO GOOD");
      setOpenModalHallazgos(true);
    }
    if (watchEstetica == "NG") {
      opcion = "estetica";
      setValue("Estetica", "NO GOOD");
      setOpenModalHallazgos(true);
    }

    if (opcion != "") {
      filtrarHallazgos(opcion);
    }
  };

  const guardarDatos = () => {
    reset();
    setOpenModalSeguirIngresando(false);
  };

  // preguntar por el remanente del lote que estan haciendo
  const filtrarHallazgos = (opcion: string) => {
    let hallazgosFiltrados = [];
    switch (opcion) {
      case "obaTest":
        hallazgosFiltrados = paletSeleccionado.oqcDesignada.oqc.oqcBloqueGroup.filter((elementos) =>
          elementos.oqcBloque.nombre.toLocaleLowerCase().includes("func")
        );
        break;
      case "estetica":
        hallazgosFiltrados = paletSeleccionado.oqcDesignada.oqc.oqcBloqueGroup.filter((elementos) =>
          elementos.oqcBloque.nombre.toLocaleLowerCase().includes("est")
        );
        break;
      case "packing":
        hallazgosFiltrados = paletSeleccionado.oqcDesignada.oqc.oqcBloqueGroup.filter((elementos) =>
          elementos.oqcBloque.nombre.toLocaleLowerCase().includes("pack")
        );
        break;
    }
    if (hallazgosFiltrados.length > 0) {
      setListaHallazgos(hallazgosFiltrados[0].oqcBloque.oqcBloqueHallazgo);
    }
  };

  const cancelarHallazgos = () => {
    if (watchPacking == "NO GOOD") {
      setValue("Packing", "Packing");
    }
    if (watchObaTest == "NO GOOD") {
      setValue("obaTest", "Oba Test");
    }
    if (watchEstetica == "NO GOOD") {
      setValue("Estetica", "Estetica");
    }
    setOpenModalHallazgos(false);
  };

  useEffect(() => {
    getLastEquipo();
    seleccionarPrimerInput(0);
  }, [openModal]);

  useEffect(() => {
    if (watchPacking || watchObaTest || watchEstetica) {
      activarModalHallazgos();
    }
  }, [watchPacking, watchObaTest, watchEstetica]);

  return (
    <main className="w-[80vw]">
      <section className="w-full">
        <div className="w-full flex flex-row gap-x-3 justify-between p-3 rounded-md shadow-shadowBox border-gray-200 border">
          <div>
            <p className="datosCelualresZapling">
              Fecha: {`${fechaFormateada.getDate()}/${fechaFormateada.getMonth() + 1}/${fechaFormateada.getFullYear()}`}
            </p>
          </div>
          <div>
            <p className="datosCelualresZapling">Turno: {fechaFormateada.getHours() > 14 ? "Tarde" : "Mañana"}</p>
          </div>
          <div>
            <p className="datosCelualresZapling">Registro: {paletSeleccionado.registro}</p>
          </div>
          <div>
            <p className="datosCelualresZapling">Línea: {linea.nombre}</p>
          </div>
          <div>
            <p className="datosCelualresZapling">Modelo: {modelo.modeloNewsan}</p>
          </div>
          {equiposMaster.length > 0 && (
            <div>
              <p className="datosCelualresZapling">Familia: {equiposMaster[0].partNumber}</p>
            </div>
          )}
          <div>
            <p className="datosCelualresZapling">Compañía: {modelo.compania}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(sendData)} className="flex flex-row justify-between">
          <section className="bg-background w-1/2 rounded-md shadow-shadowBox h-[35rem] mt-2">
            {equiposMaster.length > 0 && (
              <div className="flex w-[100.3%] justify-between border border-[#85CDD9] bg-[#85CDD9] px-4 py-4 rounded-t-md ">
                <p>{equiposMaster[0].nroOp}</p>
                <p>{paletSeleccionado.registro}</p>
                <p>Master Box: {equiposMaster[0].lpn}</p>
              </div>
            )}
            <p className="ml-1">Escanear según el orden</p>
            <section className="flex flex-col items-center gap-y-4">
              <div className="flex flex-col items-center w-96">
                <Controller
                  name="numeroSerie"
                  defaultValue=""
                  control={control}
                  rules={{ required: { value: true, message: "Ingrese un numero de serie" } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="inputsDatosZapling"
                      placeholder="Serie Newsan"
                      autoComplete="off"
                      {...register("numeroSerie", {
                        validate: (value) => {
                          const numeroIngresado = listaDeDatosParaAniadir.some((elementos) => {
                            return value === elementos.numeroSerie;
                          });
                          if (numeroIngresado) {
                            return "El numero ya fue inresado";
                          } else {
                            return true;
                          }
                        }
                      })}
                      onKeyUp={(event) => {
                        manejarEnter(event, 0);
                        buscarNumeroSerie();
                      }}
                    />
                  )}
                />
                {errors.numeroSerie && errors.numeroSerie?.type === "required" && (
                  <p className="text-xs font-semibold text-blue-600">{errors.numeroSerie?.message}</p>
                )}
                {errors.numeroSerie && errors.numeroSerie?.type === "validate" && (
                  <p className="text-xs font-semibold text-red-600">{errors.numeroSerie?.message}</p>
                )}
              </div>
              <div className="flex flex-col items-center w-96">
                <Controller
                  name="EANCodeUnitaria"
                  control={control}
                  defaultValue=""
                  rules={{ required: { value: true, message: "Ingrese el EAN Code" } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="inputsDatosZapling"
                      placeholder="EAN Code (unitaria)"
                      autoComplete="off"
                      onKeyUp={(event) => {
                        manejarEnter(event, 1);
                      }}
                      {...register("EANCodeUnitaria", {
                        validate: (value) => {
                          if (value == equiposEncontrado.eanCode) {
                            return true;
                          } else {
                            return "El numero EAN Code es incorrecto";
                          }
                        }
                      })}
                    />
                  )}
                />
                {errors.EANCodeUnitaria && errors.EANCodeUnitaria?.type === "required" && (
                  <p className="text-xs font-semibold text-blue-600">{errors.EANCodeUnitaria?.message}</p>
                )}
                {errors.EANCodeUnitaria && errors.EANCodeUnitaria?.type === "validate" && (
                  <p className="text-xs font-semibold text-red-600">{errors.EANCodeUnitaria?.message}</p>
                )}
              </div>
              <div className="flex flex-col items-center w-96">
                <Controller
                  name="imei1"
                  control={control}
                  defaultValue=""
                  rules={{ required: { value: true, message: "Ingrese el IMEI 1(Unitaria)" } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="inputsDatosZapling"
                      placeholder="IMEI 1(Unitaria)"
                      autoComplete="off"
                      onKeyUp={(event) => {
                        manejarEnter(event, 2);
                      }}
                      {...register("imei1", {
                        validate: (value) => {
                          if (value == equiposEncontrado.referencia1) {
                            return true;
                          } else {
                            return "El numero IMEI 1 es incorrecto";
                          }
                        }
                      })}
                    />
                  )}
                />
                {errors.imei1 && errors.imei1?.type === "required" && (
                  <p className="text-xs font-semibold text-blue-600">{errors.imei1?.message}</p>
                )}
                {errors.imei1 && errors.imei1?.type === "validate" && (
                  <p className="text-xs font-semibold text-red-600">{errors.imei1?.message}</p>
                )}
              </div>
              {dobleImei && (
                <div className="flex flex-col items-center w-96">
                  <Controller
                    name="imei2"
                    control={control}
                    defaultValue=""
                    rules={{ required: { value: true, message: "Ingrese el IMEI 2(Unitaria)" } }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="inputsDatosZapling"
                        placeholder="IMEI 2(Unitaria)"
                        autoComplete="off"
                        {...register("imei2", {
                          validate: (value) => {
                            if (value == equiposEncontrado.referencia2) {
                              return true;
                            } else {
                              return "El numero IMEI 2 es incorrecto";
                            }
                          }
                        })}
                        onKeyUp={(event) => {
                          manejarEnter(event, dobleImei ? 3 : 99);
                        }}
                      />
                    )}
                  />
                  {errors.imei2 && errors.imei2?.type === "required" && (
                    <p className="text-xs font-semibold text-blue-600">{errors.imei2?.message}</p>
                  )}
                  {errors.imei2 && errors.imei2?.type === "validate" && (
                    <p className="text-xs font-semibold text-red-600">{errors.imei2?.message}</p>
                  )}
                </div>
              )}
              <div className="flex flex-col items-center w-96">
                <Controller
                  name="msnUnitaria"
                  control={control}
                  defaultValue=""
                  rules={{ required: { value: true, message: "Ingrese el Codigo MSN" } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="inputsDatosZapling"
                      placeholder="MSN (Unitaria)"
                      autoComplete="off"
                      onKeyUp={(event) => {
                        manejarEnter(event, dobleImei ? 4 : 3);
                      }}
                      {...register("msnUnitaria", {
                        validate: (value) => {
                          const numeroEncontrado = listaCodigosMsn.some((elementos) => {
                            return elementos == value;
                          });
                          if (numeroEncontrado) {
                            return true;
                          } else {
                            return "El numero MSN no fue encontrado";
                          }
                        }
                      })}
                    />
                  )}
                />
                {errors.msnUnitaria && errors.msnUnitaria?.type === "required" && (
                  <p className="text-xs font-semibold text-blue-600">{errors.msnUnitaria?.message}</p>
                )}
                {errors.msnUnitaria && errors.msnUnitaria?.type === "validate" && (
                  <p className="text-xs font-semibold text-red-600">{errors.msnUnitaria?.message}</p>
                )}
              </div>
              <div className="flex flex-col items-center w-96">
                <Controller
                  name="trackId"
                  control={control}
                  defaultValue=""
                  rules={{ required: { value: true, message: "Ingrese el Track ID" } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="inputsDatosZapling"
                      placeholder="Track ID"
                      autoComplete="off"
                      onKeyUp={(event) => {
                        manejarEnter(event, dobleImei ? 5 : 4);
                      }}
                      {...register("trackId", {
                        minLength: {
                          value: 5,
                          message: "Ingrese un Track ID con mas digitos"
                        },
                        maxLength: {
                          value: 10,
                          message: "Ingrese un Track ID que no supere los 10 digitos"
                        },
                        pattern: {
                          value: /^Z[a-zA-Z0-9]*$/,
                          message: "Ingrese un Track ID que comience con Z"
                        }
                      })}
                    />
                  )}
                />
                {errors.trackId && <p className="text-xs font-semibold text-red-600">{errors.trackId?.message}</p>}
              </div>
              <div className="flex flex-col items-center w-96">
                <Controller
                  name="imeiEquipo1"
                  control={control}
                  defaultValue=""
                  rules={{ required: { value: true, message: "Ingrese el IMEI 1(Equipo)" } }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="inputsDatosZapling"
                      placeholder="IMEI 1(Equipo)"
                      autoComplete="off"
                      onKeyUp={(event) => {
                        manejarEnter(event, dobleImei ? 6 : 5);
                      }}
                      {...register("imeiEquipo1", {
                        validate: (value) => {
                          if (value == equiposEncontrado.referencia1) {
                            return true;
                          } else {
                            return "El numero IMEI 1 es incorrecto";
                          }
                        }
                      })}
                    />
                  )}
                />
                {errors.imeiEquipo1 && errors.imeiEquipo1?.type === "required" && (
                  <p className="text-xs font-semibold text-blue-600">{errors.imeiEquipo1?.message}</p>
                )}
                {errors.imeiEquipo1 && errors.imeiEquipo1?.type === "validate" && (
                  <p className="text-xs font-semibold text-red-600">{errors.imeiEquipo1?.message}</p>
                )}
              </div>
              {dobleImei && (
                <div className="flex flex-col items-center w-96">
                  <Controller
                    name="imeiEquipo2"
                    control={control}
                    defaultValue=""
                    rules={{ required: { value: true, message: "Ingrese el IMEI 2(Equipo)" } }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="inputsDatosZapling"
                        placeholder="IMEI 2(Equipo)"
                        autoComplete="off"
                        onKeyUp={(event) => {
                          manejarEnter(event, dobleImei ? 7 : 6);
                        }}
                      />
                    )}
                  />
                  {errors.imeiEquipo2 && errors.imeiEquipo2?.type === "required" && (
                    <p className="text-xs font-semibold text-blue-600">{errors.imeiEquipo2?.message}</p>
                  )}
                  {errors.imeiEquipo2 && errors.imeiEquipo2?.type === "validate" && (
                    <p className="text-xs font-semibold text-red-600">{errors.imeiEquipo2?.message}</p>
                  )}
                </div>
              )}
            </section>
          </section>
          <section className="w-1/2 mt-2 ml-4">
            <Controller
              name="Supervisor"
              control={control}
              defaultValue="Supervisor"
              render={({ field }) => (
                <div className="flex items-center w-full justify-between">
                  <div className="grid items-center relative w-full">
                    <select
                      {...field}
                      className="row-start-1 col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-background p-2 pr-8 rounded-sm shadow-shadowBox"
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
                      {listaSupervisores.map((elementos) => (
                        <option key={elementos.id} value={elementos.nombre}>
                          {elementos.nombre}
                        </option>
                      ))}
                    </select>
                    <ArrowDropDown className="absolute right-5 col-start-1" />
                  </div>
                </div>
              )}
            />
            <div className={`${watchSupervisores == "Supervisor" ? "block" : "block"} flex flex-col gap-y-4 mt-4`}>
              <Controller
                name="obaTest"
                control={control}
                defaultValue="Oba Test"
                rules={{ required: "Ingrese el test de observacion" }}
                render={({ field }) => (
                  <div className="grid items-center relative">
                    <select
                      {...field}
                      className="row-start-1 col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-background p-2 rounded-sm shadow-shadowBox"
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
                        <option className={`${elementos === "NO GOOD" ? "hidden" : ""}`} value={elementos} key={index}>
                          {elementos}
                        </option>
                      ))}
                    </select>
                    <ArrowDropDown className="absolute right-5 col-start-1" />
                  </div>
                )}
              />
              {errors.obaTest?.message && (
                <p className="text-xs font-semibold text-red-600">{errors.obaTest.message}</p>
              )}
              <Controller
                name="Estetica"
                control={control}
                defaultValue="Estetica"
                rules={{ required: "Ingrese la estetica" }}
                render={({ field }) => (
                  <div className="grid items-center relative">
                    <select
                      {...field}
                      className="row-start-1 col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-background p-2 rounded-sm shadow-shadowBox"
                      {...register("Estetica", {
                        required: {
                          value: true,
                          message: "Ingrese un supervisor"
                        },
                        validate: (value) => {
                          if (value == "Estetica") {
                            return "Ingrese una opcion";
                          } else {
                            return true;
                          }
                        }
                      })}>
                      <option value="Estetica">ESTETICA</option>
                      {opciones.map((elementos, index) => (
                        <option className={`${elementos === "NO GOOD" ? "hidden" : ""}`} value={elementos} key={index}>
                          {elementos}
                        </option>
                      ))}
                    </select>
                    <ArrowDropDown className="absolute right-5 col-start-1" />
                  </div>
                )}
              />
              {errors.Estetica?.message && (
                <p className="text-xs font-semibold text-red-600">{errors.Estetica?.message}</p>
              )}
              <Controller
                name="Packing"
                control={control}
                defaultValue="Packing"
                rules={{ required: "Ingrese el packing" }}
                render={({ field }) => (
                  <div className="grid items-center relative">
                    <select
                      {...field}
                      className="row-start-1 col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-background p-2 rounded-sm h-12 shadow-[0_2px_2px_0_rgb(138,138,138,0.60)]"
                      {...register("Packing", {
                        required: {
                          value: true,
                          message: "Ingrese un supervisor"
                        },
                        validate: (value) => {
                          if (value == "Packing") {
                            return "Ingrese una opcion";
                          } else {
                            return true;
                          }
                        }
                      })}>
                      <option value="Packing">PACKING</option>
                      {opciones.map((elementos, index) => (
                        <option className={`${elementos === "NO GOOD" ? "hidden" : ""}`} value={elementos} key={index}>
                          {elementos}
                        </option>
                      ))}
                    </select>
                    <ArrowDropDown className="absolute right-5 col-start-1" />
                  </div>
                )}
              />
              {errors.Packing?.message && (
                <p className="text-xs font-semibold text-red-600">{errors.Packing?.message}</p>
              )}
            </div>
            <div className="w-full mt-6">
              <p className="text-sm text-textColor font-semibold">OBSERVACIÓN (Opcional)*</p>
              <Controller
                name="observacion"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={2}
                    className="text-black w-full border border-gray-200 shadow-shadowBox"></textarea>
                )}
              />
            </div>
            <div className="mt-6">
              <Controller
                name="reproceso"
                control={control}
                defaultValue="Reproceso"
                rules={{ required: { value: true, message: "Reproceso" } }}
                render={({ field }) => (
                  <div className="grid items-center relative">
                    <select
                      {...field}
                      className="row-start-1 col-start-1 appearance-none focus:outline-none border-[1px] border-gray-300 bg-background p-2 rounded-sm h-12 shadow-[0_2px_2px_0_rgb(138,138,138,0.60)]"
                      {...register("reproceso", {
                        validate: (value) => {
                          if (value === "Reproceso") {
                            return "Seleccione una opcion";
                          } else {
                            return true;
                          }
                        }
                      })}>
                      <option value="Reproceso">REPROCESO</option>
                      {["CONFORME", "NO CONFORME"].map((elementos, index) => (
                        <option value={elementos} key={index}>
                          {elementos}
                        </option>
                      ))}
                    </select>
                    <ArrowDropDown className="absolute right-5 col-start-1" />
                  </div>
                )}
              />
            </div>
            <div>
              <section className="flex justify-center gap-x-4 mt-6">
                <div>
                  <Button
                    type="submit"
                    disabled={!isValid}
                    onClick={() => {
                      setOpenModalSeguirIngresando(true);
                    }}
                    className={buttonClases.greenButton}>
                    Verificar
                  </Button>
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={() => {
                      setOpenModalZampling(false);
                    }}
                    className={buttonClases.redButton}>
                    Cancelar
                  </Button>
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={() => {
                      setOpenModalTicket(true);
                    }}
                    disabled={watchReproceso == "Reproceso" || watchReproceso == "NO CONFORME"}
                    className={buttonClases.blueButton}>
                    Reprocesar
                  </Button>
                </div>
              </section>
            </div>
          </section>
        </form>
      </section>
      <div className={`${!openModalSeguirIngresando ? "hidden" : "cuadroCerrarMasterBox"}`}>
        <p className="text-lg border-b-[3px] font-medium border-gray-300 pb-4 w-[40rem]">
          ¿Desea seguir ingresando equipos en <strong>Master Box</strong>?
        </p>
        <div className="flex gap-x-6 justify-center">
          <button
            className="w-40 bg-red-500 px-4 py-2 rounded-md text-white font-semibold shadow-[0_3px_3px_0_rgb(138,138,138,0.60)]"
            type="button"
            onClick={() => {
              setOpenModalSeguirIngresando(false);
              setOpenModalZampling(false);
            }}>
            NO
          </button>
          <button
            onClick={() => {
              guardarDatos();
              aniadirLista();
              setOpenModalSeguirIngresando(false);
              guardarOqcEquipos();
            }}
            className="w-40 bg-blue-600 px-4 py-2 rounded-md text-white font-semibold shadow-[0_3px_3px_0_rgb(138,138,138,0.60)]"
            type="button">
            SI
          </button>
        </div>
      </div>
      {/* Modal para marcar los hallazgos de la muestra */}
      <ModalCompoment
        setOpenPopup={setOpenModalHallazgos}
        openPopup={openModalHallazgos}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Registro de hallazgos para el equipo"
        title="Carga Hallazgos">
        <OQCHallazgos
          setOpenModal={setOpenModalHallazgos}
          cancelarOpciones={cancelarHallazgos}
          openModal={openModalHallazgos}
          hallazgos={listaHallazgos}
          hallazgosEquipo={setHallazgosDispositivo}
        />
      </ModalCompoment>
      {/* Modal para marcar los hallazgos de la muestra */}

      {/* Modal para imprimir ticket */}
      <ModalCompoment
        openPopup={openModalTicket}
        setOpenPopup={setOpenModalTicket}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Impresión de ticket de reproceso"
        title="Imprimir Ticket Reproceso">
        <OQCPaletPrint
          reproceso={true}
          closeModal={setOpenModalTicket}
          cerrarReprocesoZampling={setOpenModalZampling}
          refresh={refresh}
          ultimaMuestraOQC={ultimaMuestra}
        />
      </ModalCompoment>
      {/* Modal para imprimir ticket */}
    </main>
  );
};
