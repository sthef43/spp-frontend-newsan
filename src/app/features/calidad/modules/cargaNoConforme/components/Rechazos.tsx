import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Theme } from "@mui/material";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { IEstadoLote } from "app/models/IEstadoLote";
import { EstadoLoteSliceRequests } from "app/Middleware/reducers/EstadoLoteSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { IPlanProd } from "app/models/IPlanProd";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { IControlLote } from "app/models/IControlLote";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { ControlLoteMaterialesSliceRequests } from "app/Middleware/reducers/ControlLoteMaterialesSlice";
import { IControlLoteMateriales } from "app/models/IControlLoteMateriales";
import { IAppUser } from "app/models/IAppUser";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IInicio } from "app/models/IInicio";
import { ISuperCargalinea } from "app/models/ISuperCargalinea";
import _ from "lodash";
import { RechazosSlice } from "app/Middleware/reducers/RechazosSlice";
import moment from "moment";
import { MaterialesDialog } from "app/features/calidad/components/MaterialesDialog";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IPedidoMaterialesCalidad } from "app/models/IPedidoMaterialesCalidad";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { PedidoMaterialesCalidadSliceRequests } from "app/Middleware/reducers/PedidoMaterialesCalidadSlice";
import { ReprocesoLineaSliceRequests } from "app/Middleware/reducers/ReprocesoLineaSlice";
import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import { useEffect } from "react";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { NumerosSinInicio } from "app/features/calidad/modules/cargaNoConforme/modal/NumerosSinInicio";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { oqcDesignadaResultadoSlice } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";

interface props {
  ultimaTraza?: IInicio;
  plan: IPlanProd;
  refresh?: () => void;
}

export const Rechazos = ({ plan, refresh, ultimaTraza }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const rechazados: IControlLote[] = useAppSelector((state) => state.rechazados.data as any);
  const oqcDesRes = useAppSelector<IOQCDesignadaResultado>((state) => state.oqcDesignadaResultado.object);
  const [ultimoNewsan, setUltimoNewsan] = React.useState(plan.ultimoNewsan.toString());

  const initialState = {
    desde: null,
    hasta: null,
    nroDesde: "",
    nroHasta: "",
    causa: null,
    contenidoDefectuoso: "",
    accionCorrectiva: "",
    causaRaiz: "",
    descripcion: ""
  };

  const sxStyles = {
    formControl: {
      minWidth: 170
    },
    selectEmpty: {
      marginTop: 2
    }
  };

  const [selectedMaterial, setSelectedMaterial] = React.useState<ISuperCargalinea[]>([]);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [materialDisabled, setMaterialDisabled] = React.useState<boolean>(true);
  const [errorIzq, setErrorIzq] = React.useState<string>("");
  const [errorDerecha, setErrorDerecha] = React.useState<string>("");
  const [modalRechazoOpen, setModalRechazoOpen] = React.useState(false);
  const [openModalNumerosSinInicio, setOpenModalNumeroSinInicio] = React.useState(false);
  const [datosControlLote, setdatosControlLote] = React.useState<IControlLote[]>([]);
  const [numerosEncontrados, setNumerosEncontrados] = React.useState(null);

  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    watch,
    register,
    formState: { errors },
    trigger
  } = useForm({
    defaultValues: initialState,
    mode: "onTouched"
  });

  const [causaList, setCausaList] = React.useState<IEstadoLote[]>([]);

  const watchCorrectiva = watch("accionCorrectiva");
  const watchNroDesde = watch("nroDesde");
  const watchNroHasta = watch("nroHasta");
  const watchCausa = watch("causa");
  const watchDefectuoso = watch("contenidoDefectuoso");
  const watchCausaRaiz = watch("causaRaiz");

  const onInit = async () => {
    let fetchEstadoLoteResult: IEstadoLote[];
    let fetchRechazosResult: IControlLote[];
    try {
      fetchEstadoLoteResult = unwrapResult(await dispatch(EstadoLoteSliceRequests.getAllRequest()));
      fetchRechazosResult = unwrapResult(
        await dispatch(
          ControlLoteSliceRequests.getAllRechazosRequest({
            modeloA: plan?.numeroOp,
            modeloB: plan?.lote
          })
        )
      );
    } catch (error) {
      fetchEstadoLoteResult = null;
      fetchRechazosResult = null;
    }
    if (fetchEstadoLoteResult && fetchRechazosResult) {
      setCausaList(fetchEstadoLoteResult);
      setdatosControlLote(fetchRechazosResult);
    }
  };

  //SETEO LOS CAMPOS DE LOS TEXT FIELD
  const setearCampos = () => {
    setValue("desde", plan.desde);
    const ultimoNewsan = plan.ultimoNewsan.toString();
    const regex = new RegExp(ultimoNewsan, "g");
    const hasta = ultimaTraza.codigoNewsan.replace(regex, ""); //Numero hasta sin el ultimo newsan
    setValue("hasta", parseInt(hasta));
  };

  React.useEffect(() => {
    onInit();
  }, []);
  React.useEffect(() => {
    if (plan) setearCampos();
    console.log(plan);
  }, [plan]);

  const handleAgregarMaterial = () => {
    setModalRechazoOpen(true);
  };

  const tieneReproceso = async (controlLoteId, numero) => {
    const reprocesoLinea = await getReprocesoLineaByControlLoteId(controlLoteId);
    if (reprocesoLinea != null) return generarNumerosYVerificarExistencia(reprocesoLinea, numero);
    return false;
  };

  //Se fija si esta el numero en los reprocesados.
  const generarNumerosYVerificarExistencia = (reprocesoLinea: IReprocesoLinea[], numero) => {
    const listadoOrdenadoReprocesados = _.orderBy(reprocesoLinea, "codigoNewsan"); //Los ordeno por codigo newsan.
    const listadoCod = [];
    //Obtengo solamente la numeracion del codigo, quitandole la primera parte estatica de numeros y los 0. para poder trabajar mejor.
    listadoOrdenadoReprocesados.forEach((element) => {
      const codigoSinPrimerosdigitos = parseInt(element.codigoNewsan.substring(5));
      const codigoSinCeros = Number(codigoSinPrimerosdigitos);
      listadoCod.push(codigoSinCeros);
    });
    if (listadoCod.includes(numero)) {
      return true;
    } else {
      return false;
    }
  };

  const getReprocesoLineaByControlLoteId = async (idControlLote: number) => {
    const result = unwrapResult(await dispatch(ReprocesoLineaSliceRequests.getListByControlLoteId(idControlLote || 0)));
    if (result && result.length > 0) {
      return result;
    } else return null;
  };

  /*
  const handleNroDesdeChange = async (numero: number, der: boolean) => {
    let rechazado = false;
    if (der) {
      if (numero >= plan.desde && numero <= plan.hasta && numero >= parseInt(getValues("nroDesde")) && der === true) {
        const { existe, controlLoteId } = existeRechazo(numero, rechazados);
        let estaReprocesado = true;
        if (controlLoteId) estaReprocesado = await tieneReproceso(controlLoteId, numero);
        rechazado = existe; //consulta todos los rechazos del lote ese y devuelve true en caso de que el rango a rechazar contenga numeros ya rechazados
        if (rechazado && !estaReprocesado) {
          setErrorDerecha("Número de serie inválido");
          return numero;
        }
        setErrorDerecha("");
        return numero;
      }
      setErrorDerecha("Número de serie inválido");
    } else {
      if (watchNroHasta === "") {
        if (numero >= plan.desde && numero <= plan.hasta) {
          const { existe, controlLoteId } = existeRechazo(numero, rechazados);
          let estaReprocesado = true;
          if (controlLoteId) estaReprocesado = await tieneReproceso(controlLoteId, numero);
          rechazado = existe; //consulta todos los rechazos del lote ese y devuelve true en caso de que el rango a rechazar contenga numeros ya rechazados
          if (rechazado && !estaReprocesado) {
            setErrorIzq("Número de serie inválido");
            return numero;
          }
          setErrorIzq("");
          return numero;
        }
      } else {
        if (numero >= plan.desde && numero <= plan.hasta && numero <= parseInt(getValues("nroHasta"))) {
          const { existe, controlLoteId } = existeRechazo(numero, rechazados);
          rechazado = existe; //consulta todos los rechazos del lote ese y devuelve true en caso de que el rango a rechazar contenga numeros ya rechazados

          if (rechazado) {
            setErrorIzq("Número de serie inválido");
            return numero;
          }
          setErrorIzq("");
          return numero;
        }
      }
      setErrorIzq("Número de serie inválido");
    }

    return numero;
  };*/

  const calcularCantidad = () => {
    let cantidad = 0;
    plan &&
      plan.inicio.map((prodDia: IInicio) => {
        cantidad += prodDia.producido;
      });
    return plan.cantidad - cantidad;
  };

  const calcularCantidadRechazos = (): number => {
    const rechazados = parseInt(getValues("nroHasta")) - parseInt(getValues("nroDesde")) + 1;
    return rechazados;
  };

  //Hago el multiPost con la lista de ControlLoteMateriales
  const guardarControlLoteMateriales = async (material: IControlLoteMateriales[]): Promise<boolean> => {
    let guardarListaMateriales;
    try {
      guardarListaMateriales = unwrapResult(
        await dispatch(ControlLoteMaterialesSliceRequests.multiPostRequest(_.cloneDeep(material)))
      );
    } catch (error) {
      guardarListaMateriales = null;
    }
    if (guardarListaMateriales) {
      return true;
    }
    return false;
  };

  //creo todos los materiales que se van a guardar en la base de datos
  const crearMaterialesList = (data: IControlLote): IControlLoteMateriales[] => {
    const materialesAux: IControlLoteMateriales[] = [];
    selectedMaterial.map((mat: ISuperCargalinea) => {
      const guardarListaMateriales: IControlLoteMateriales = {
        codigoModelo: mat.codigoModelo,
        codigoPautas: mat.codigoPautas,
        numeroOp: mat.numeroOp,
        cantidad: mat.cantidadMaterial,
        nombreSupervisor: infoUser.operator.name + " " + infoUser.operator.surname,
        descripcion: mat.descripcion,
        idControlLote: data.idControlLote
      };
      materialesAux.push(guardarListaMateriales);
    });

    return materialesAux;
  };

  const sendEmailPedidoMaterialesCalidad = async (observaciones: string, controlLote: IControlLote): Promise<void> => {
    await dispatch(
      EmailSliceRequest.EmailPedidoMaterialCalidad({
        controlLote: controlLote?.idControlLote,
        infoSupervisor: GetInfoUser().username,
        observaciones: observaciones,
        descripLinea: plan?.idLinea
      })
    );
  };

  const enviarMailPedidoMateriales = async (
    observaciones: string,
    nuevoControlLote: IControlLote,
    nuevoPedidoMateriales: IPedidoMaterialesCalidad
  ) => {
    let pedidoMaterialesCalidadResult;
    try {
      pedidoMaterialesCalidadResult = unwrapResult(
        await dispatch(PedidoMaterialesCalidadSliceRequests.postRequest(nuevoPedidoMateriales))
      );
    } catch (error) {
      pedidoMaterialesCalidadResult = null;
    }

    if (pedidoMaterialesCalidadResult) {
      await sendEmailPedidoMaterialesCalidad(observaciones, nuevoControlLote);
      openNotificationUI("Solicitud enviada con éxito", "success");
    } else {
      openNotificationUI("No se pudo enviar la solicitud", "error");
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  //guardo el control lote en la bd
  const guardarRechazo = async (nuevoControlLote: IControlLote) => {
    let guardarControlLote: IControlLote;
    if (numerosEncontrados.equiposSinSerie.length > 0) {
      if (
        await getConfirmation("Equipos Invalidos", "Hay equipos que no pasaron por el puesto fin, desea continuar?")
      ) {
        try {
          guardarControlLote = unwrapResult(await dispatch(ControlLoteSliceRequests.postRequest(nuevoControlLote)));
        } catch (error) {
          guardarControlLote = null;
        }

        //Si se guardó correctamente ejecuto esto
        if (guardarControlLote) {
          //si se creo correctamente el rechazo creo la lista de materiales
          const materiales = crearMaterialesList(guardarControlLote);
          //intento guardar los materiales
          if (guardarControlLoteMateriales(materiales)) {
            dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
            //si el rechazo es por faltante de materiales (NO HAY STOCK)
            if (guardarControlLote?.idEstadoLote === 4) {
              const nuevoPedidoMaterialesCalidad: IPedidoMaterialesCalidad = {
                idControlLote: guardarControlLote?.idControlLote,
                estadoPedido: "P", //PENDIENTE = P, RECHAZADO = R, APROBADO = A
                observaciones: nuevoControlLote?.observaciones
                // devolucion: ""
              };
              await enviarMailPedidoMateriales(
                nuevoControlLote?.observaciones,
                guardarControlLote,
                nuevoPedidoMaterialesCalidad
              );
              //y creo el registro en la tabla de pedido materiales de CALIDAD
            }
            //hago un delay para que se alcance a guardar todo en la bd antes de mandar el correo
            await delay(3000);
            await dispatch(EmailSliceRequest.EmailRechazos(guardarControlLote.idControlLote)); //acá mando el correo con los datos
            dispatch(LoadingUISlice.actions.LoadingUIClose());
            openNotificationUI("Rechazo guardado con éxito", "success");
          } else {
            openNotificationUI("Error al guardar rechazo", "error");
          }
        } else {
          openNotificationUI("Error al guardar rechazo", "error");
        }
      }
    } else {
      try {
        guardarControlLote = unwrapResult(await dispatch(ControlLoteSliceRequests.postRequest(nuevoControlLote)));
      } catch (error) {
        guardarControlLote = null;
      }

      //Si se guardó correctamente ejecuto esto
      if (guardarControlLote) {
        //si se creo correctamente el rechazo creo la lista de materiales
        const materiales = crearMaterialesList(guardarControlLote);
        //intento guardar los materiales
        if (guardarControlLoteMateriales(materiales)) {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
          //si el rechazo es por faltante de materiales (NO HAY STOCK)
          if (guardarControlLote?.idEstadoLote === 4) {
            const nuevoPedidoMaterialesCalidad: IPedidoMaterialesCalidad = {
              idControlLote: guardarControlLote?.idControlLote,
              estadoPedido: "P", //PENDIENTE = P, RECHAZADO = R, APROBADO = A
              observaciones: nuevoControlLote?.observaciones
              // devolucion: ""
            };
            await enviarMailPedidoMateriales(
              nuevoControlLote?.observaciones,
              guardarControlLote,
              nuevoPedidoMaterialesCalidad
            );
            //y creo el registro en la tabla de pedido materiales de CALIDAD
          }
          //hago un delay para que se alcance a guardar todo en la bd antes de mandar el correo
          await delay(3000);
          await dispatch(EmailSliceRequest.EmailRechazos(guardarControlLote.idControlLote)); //acá mando el correo con los datos
          dispatch(LoadingUISlice.actions.LoadingUIClose());
          openNotificationUI("Rechazo guardado con éxito", "success");
        } else {
          openNotificationUI("Error al guardar rechazo", "error");
        }
      } else {
        openNotificationUI("Error al guardar rechazo", "error");
      }
    }
  };

  //calculo el turno dependiendo del id
  const getTurno = (turno: number) => {
    switch (turno) {
      case 1:
        return "M";
      case 2:
        return "T";
      case 3:
        return "N";
    }
  };

  const resetNumeros = () => {
    setValue("nroDesde", null);
    setValue("nroHasta", null);
  };

  //handler que se dispara cuando presiono guardar rechazo
  const handleGuardar = async (e) => {
    // Ahora tengo que crear el nuevo objeto de ControlLote
    const nuevoControlLote: IControlLote = {
      idLinea: plan.idLinea,
      turno: getTurno(infoUser.operator.turnoId),
      nombreSupervisor: infoUser.operator.name + " " + infoUser.operator.surname,
      codigoModelo: plan.codigoModelo,
      lote: plan.lote,
      cantidadLote: plan.cantidad,
      numeroOp: plan.numeroOp,
      cantidadRechazos: calcularCantidadRechazos(),
      cantidadReprocesos: 0, //siempre es 0 porque recien se está creando el rechazo
      cantidadProducido: plan?.cantidad - calcularCantidad(),
      cantidadFaltante: calcularCantidad(),
      idEstadoLote: getValues("causa"), //la causa por la cual se cierra el lote
      observaciones: getValues("descripcion"),
      tipoControl: "R", //rechazo
      estadoReproceso: "N", //se usa cuando no se reproceso nada o queda por reporcesar
      estadoEbs: "ACTIVO",
      serieDesde: parseInt(getValues("nroDesde")),
      serieHasta: parseInt(getValues("nroHasta")),
      idProveedor: plan.idProveedor || null,
      contenidoDefectuoso: getValues("contenidoDefectuoso"),
      accioncorrectiva: getValues("accionCorrectiva"),
      planmejora: getValues("causaRaiz"),
      fecha: moment().toDate(),
      oqcDesignadaResultId: oqcDesRes ? oqcDesRes.id : null
    };
    console.log("hola");
    //guardo el control lote en la db
    await guardarRechazo(nuevoControlLote);
    reset(); //limpio el formulario
    dispatch(RechazosSlice.actions.setOnInitTrue());
    resetNumeros();
  };

  const [desabilitarCausa, setDesabilitarCausa] = React.useState(false);
  const puedeGuardar = async () => {
    //Validacion de Numeros desde y Hasta
    const isValidD = await trigger("nroDesde");
    const isValidH = await trigger("nroHasta");
    if (watchCausa === 4 || watchCausa === 5 || watchCausa === 6) {
      if (selectedMaterial.length === 0) {
        return false;
      } else {
        if (
          isValidD &&
          isValidH &&
          watchNroDesde !== "" &&
          watchNroHasta !== "" &&
          watchCausa !== "" &&
          watchDefectuoso !== "" &&
          watchCausaRaiz !== "" &&
          watchCorrectiva !== ""
        ) {
          return true;
        }
        return false;
      }
    } else {
      if (
        isValidD &&
        isValidH &&
        watchNroDesde !== "" &&
        watchNroHasta !== "" &&
        watchCausa !== "" &&
        watchDefectuoso !== "" &&
        watchCausaRaiz !== "" &&
        watchCorrectiva !== ""
      ) {
        return true;
      }
      return false;
    }
  };

  const validarCampos = async () => {
    const desactivado = (await puedeGuardar()) === true && errorIzq.length === 0 && errorDerecha.length === 0;
    const materialDisabled = watchCausa !== 4 && watchCausa !== 5 && watchCausa !== 6;
    setDisabled(!desactivado);
    setMaterialDisabled(materialDisabled);
  };

  React.useEffect(() => {
    validarCampos();
  }, [
    errorIzq,
    errorDerecha,
    watchNroDesde,
    watchNroHasta,
    watchCausa,
    watchDefectuoso,
    watchCausaRaiz,
    watchCorrectiva,
    selectedMaterial
  ]);

  useEffect(() => {
    return () => {
      dispatch(oqcDesignadaResultadoSlice.actions.setObject(null));
    };
  }, []);

  const buscarTraza = async (event) => {
    const numerosSerie = generarNumerosSerie();
    const logitudNumeroHasta = plan.desde.toString();
    if (watchNroHasta.length >= logitudNumeroHasta.length) {
      event.preventDefault();
      try {
        // dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(InicioSliceRequests.GetAllByDesdeHasta(numerosSerie)));
        if (response) {
          console.log(response);
          setNumerosEncontrados(response);
        }
      } catch (error) {
        console.log(error);
      }
      // finally {
      //   dispatch(LoadingUISlice.actions.LoadingUIClose());
      // }
    }
  };

  //GENERO LOS NUMEROS DE SERIE SEGUN LA CANTIDAD DE REPETICIONES Y LUEGO LOS BUSCO EN LA BASE DE DATOS
  const generarNumerosSerie = () => {
    const totalCeros = ultimaTraza.codigoNewsan;
    const regex = /[1-9](0+)[1-9]/g;
    const resultado = [...totalCeros.matchAll(regex)].map((elementos) => elementos[1]);
    let numeroInicial = null;
    if (resultado && resultado.length > 1) {
      numeroInicial = `0${ultimoNewsan}${resultado[1]}`;
    }
    const arrayConNumeroSerie = [];

    const repeticiones = parseInt(watchNroHasta) - parseInt(watchNroDesde);
    const numeroSumado = parseInt(watchNroDesde);
    for (let index = 0; index <= repeticiones; index++) {
      const numeroSerie = numeroSumado + index;
      const numeroFormateado = numeroInicial + numeroSerie;
      arrayConNumeroSerie.push(numeroFormateado);
    }

    if (arrayConNumeroSerie != null) {
      return arrayConNumeroSerie;
    }
  };

  return (
    <div className="text-center ">
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <form onSubmit={handleSubmit(handleGuardar)}>
          <div className="w-full flex justify-center ">
            <TitleUIComponent title="Rango de números a rechazar" classNameDiv="w-full whitespace-wrap mx-0" />
          </div>
          <div className=" sm:p-8">
            <div className="inline-flex sm:gap-x-36 gap-x-10">
              {/* ----------------DESDE---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="desde"
                  control={control}
                  render={({ field }) => <TextField disabled label="Desde" {...field} variant="standard" />}
                />
              </div>
              {/* ----------------HASTA---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="hasta"
                  control={control}
                  render={({ field }) => <TextField disabled label="Hasta" {...field} variant="standard" />}
                />
              </div>
            </div>
            <div className="sm:inline-flex sm:gap-x-36 gap-x-10">
              <div className="inline-flex sm:gap-x-36 gap-x-10">
                {/* ----------------NRO DESDE---------------*/}
                <div className="text-center sm:text-left p-2">
                  <Controller
                    name="nroDesde"
                    control={control}
                    rules={{ required: true, min: 1 }}
                    render={({ field }) => (
                      <TextField
                        {...register("nroDesde", {
                          required: {
                            value: true,
                            message: "Es requerido un número"
                          },
                          validate: (value) => {
                            if (parseInt(value) > plan.hasta) {
                              return "Ingrese un número menor al número de hasta";
                            } else if (plan.desde > parseInt(value)) {
                              return "Ingrese un número mayor al número de desde";
                            } else {
                              // return "esta bien!!!";
                              return true;
                            }
                          }
                        })}
                        label="Nro Desde"
                        {...field}
                        type="number"
                        inputProps={{ inputMode: "numeric", pattern: "[1-9]*" }}
                        helperText={errorIzq}
                        /*   onChange={(e: any)  => {
                          field.onChange(handleNroDesdeChange(parseInt(e.target.value, 10), false)); //acá teiene que devolver un string
                        }} */
                        variant="standard"
                      />
                    )}
                  />
                  {errors.nroDesde && <p className="text-xs font-semibold text-red-600">{errors.nroDesde?.message}</p>}
                </div>
                {/* ----------------NRO HASTA---------------*/}
                <div className="text-center sm:text-left p-2">
                  <Controller
                    name="nroHasta"
                    control={control}
                    rules={{ required: true, minLength: 1 }}
                    render={({ field }) => (
                      <TextField
                        {...register("nroHasta", {
                          required: {
                            value: true,
                            message: "Es requerido un número"
                          },
                          validate: (value) => {
                            if (parseInt(value) > getValues("hasta")) {
                              return "Ingrese un número menor al número de hasta";
                            } else if (parseInt(value) < parseInt(watchNroDesde)) {
                              return "Ingrese un número mayor al número desde ingresado";
                            } else {
                              setDesabilitarCausa(true);
                              return true;
                            }
                          }
                        })}
                        label="Nro Hasta"
                        {...field}
                        type="number"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        helperText={errorDerecha}
                        onKeyUp={() => {
                          buscarTraza(event);
                        }}
                        /*  onChange={(e: any) => {
                          field.onChange(handleNroDesdeChange(parseInt(e.target.value, 10), true)); //acá teiene que devolver un string
                        }} */
                        variant="standard"
                      />
                    )}
                  />
                  {errors.nroHasta && <p className="text-xs font-semibold text-red-600">{errors.nroHasta?.message}</p>}
                </div>
              </div>
            </div>
            <div className="content-center mt-4">
              {/* ----------------CAUSA---------------*/}
              <FormControl sx={sxStyles.formControl} variant="standard">
                <InputLabel>Causa</InputLabel>
                <Controller
                  name="causa"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select {...field} variant="standard" disabled={!desabilitarCausa}>
                      {causaList &&
                        causaList.map((lote) => (
                          <MenuItem key={lote.idEstadoLote} value={lote.idEstadoLote}>
                            {lote.descripcion}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            {/* ----------------CONTENIDO DEFECTUOSO---------------*/}
            <div className="text-center sm:text-left p-2 w-full">
              <Controller
                name="contenidoDefectuoso"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Contenido Defectuoso"
                    {...field}
                    className="w-full"
                    // autoComplete="off"
                    variant="standard"
                  />
                )}
              />
            </div>
            {/* ----------------ACCION CORRECTIVA---------------*/}
            <div className="text-center sm:text-left p-2 w-full">
              <Controller
                name="accionCorrectiva"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Acción Correctiva"
                    {...field}
                    className="w-full"
                    // autoComplete="off"
                    variant="standard"
                  />
                )}
              />
            </div>
            {/* ----------------CAUSA RAIZ---------------*/}
            <div className="text-center sm:text-left p-2 w-full">
              <Controller
                name="causaRaiz"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField label="Causa Raíz" {...field} className="w-full" variant="standard" />
                )}
              />
            </div>
            {/* ----------------Descripcion del Rechazo---------------*/}
            <div className="text-center sm:text-left p-2">
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Descripcion del Rechazo"
                    {...field}
                    className="w-full"
                    // autoComplete="off"
                    variant="standard"
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Button
                className={buttonClasses.blueButton}
                variant="contained"
                onClick={handleAgregarMaterial}
                disabled={materialDisabled}>
                Agregar Material
              </Button>
              <Button className={buttonClasses.greenButton} type="submit" variant="contained" disabled={disabled}>
                Guardar Rechazo
              </Button>
              {numerosEncontrados && (
                <Button
                  className={buttonClasses.greenButton}
                  onClick={() => {
                    setOpenModalNumeroSinInicio(true);
                  }}
                  type="submit"
                  variant="contained"
                  disabled={numerosEncontrados.equiposSinSerie?.length == 0}>
                  Ver listado sin inicio
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
      <ModalCompoment title="Agregar Material" openPopup={modalRechazoOpen} setOpenPopup={setModalRechazoOpen}>
        <MaterialesDialog
          numeroOp={plan?.numeroOp}
          cantidadEquipos={parseInt(getValues("nroHasta")) - parseInt(getValues("nroDesde")) + 1}
          setSelectedMaterial={setSelectedMaterial}
          setOpenPopup={setModalRechazoOpen}
        />
      </ModalCompoment>
      <ModalCompoment
        title="Numeros sin Inicio"
        setOpenPopup={setOpenModalNumeroSinInicio}
        openPopup={openModalNumerosSinInicio}>
        <NumerosSinInicio setOpenModal={setOpenModalNumeroSinInicio} listaNumeros={numerosEncontrados} />
      </ModalCompoment>
    </div>
  );
};
