import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import moment from "moment";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { HoraSliceRequests } from "app/Middleware/reducers/HoraSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IHora } from "app/models/IHora";
import { IInicio } from "app/models";
import { ITargets } from "app/models/ITargets";
import { TargetsSliceRequests } from "app/Middleware/reducers/TargetsSlice";
import { PeriodoLineaSliceRequest } from "app/Middleware/reducers/periodoLineaSlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";

export const ProduccionPorHora = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const lineas = useAppSelector((state) => state.linea.dataAll);
  const [listOfProduccionPorHora, setListOfProduccionPorHora] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [contadorProduccion, setContadorProduccion] = useState(0);
  const [target, setTarget] = useState(0);
  const [totalRechazados, setTotalRechazados] = useState(0);
  const [fpy, setFpy] = useState(0);
  const [diferencia, setDiferencia] = useState(0);

  React.useEffect(() => {
    TitleChanger("PRODUCCION POR HORA");
    dispatch(LineaSliceRequests.getAllRequest());
    dispatch(HoraSliceRequests.getAll()); //Me traigo por unica vez TODAS las horas desde el back.
  }, []);

  interface initialState {
    codigoInicio: number; // representa la linea.
    fecha: Date;
    turno: string;
    turnoRadioButton: string;
  }

  const initialStateVar = {
    codigoInicio: 0,
    fecha: moment().toDate(),
    turnoRadioButton: "M "
  };

  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const fecha = watch("fecha");
  const watchTurno = watch("turnoRadioButton");
  const watchLinea = watch("codigoInicio");

  //Normalmente da 535, por que suma 60 minutos * 9 (540) hs de trabajo . Pero de la ultima hora, solo suma 55 (535)
  const calcularMinutosTotales = (listHoras: IHora[]) => {
    let sumaTotal = 0;
    for (let index = 0; index < listHoras.length; index++) {
      sumaTotal += listHoras[index].minutos;
    }

    return sumaTotal;
  };

  const getPlanProdByNroOp = async (nroOp: string) => {
    const result = unwrapResult(await dispatch(PlanProdSliceRequests.getPlanprodByNumeroOpRequest(nroOp)));
    if (result) {
      return result;
    } else return null;
  };

  const getTarget = async (registroInicio: IInicio) => {
    let result: ITargets;
    const planProd = await getPlanProdByNroOp(registroInicio.nroOp);

    const generico = planProd != null ? planProd.capacidad : "";

    const lineaSeleccionada = lineas.find((x) => x.codigoInicio === getValues("codigoInicio").toString());
    const param = {
      idLinea: lineaSeleccionada.idLinea,
      generico: generico
    };
    try {
      result = unwrapResult(await dispatch(TargetsSliceRequests.getTargetByIdLineaGenericoRequest(param)));
    } catch (error) {
      console.log(error);
    }
    if (result) {
      setTarget(result.target);
      return result.target;
    } else {
      openNotificationUI("No existe el target para el generico " + generico, "info");
    }
  };

  //Calcula el target de cada registro
  const calcularTarget = async (
    desdeHora: string,
    hastaHora: string,
    minutosTotalesTrabajo,
    minutosActuales,
    registroInicio: IInicio | any
  ) => {
    let targetTotal = 0;
    const horaActual = moment().format("HH:mm");
    const horaActualDesde = moment(desdeHora, "HH:mm").format("HH:mm");
    const horaActualHasta = moment(hastaHora, "HH:mm").format("HH:mm");

    if (registroInicio) targetTotal = await getTarget(registroInicio);
    else targetTotal = target;

    let minutosPorHora = minutosActuales; //Normalmente es 60 o 55 si es el ultimo registro.

    //Si la hora actual esta dentro del rango del horario del registro Desde Hasta, obtengo los minutos. normalmente ronda entre 1 min y 60 min.
    if (
      horaActual >= horaActualDesde &&
      horaActual <= horaActualHasta &&
      moment(getValues("fecha")).format("L") == moment().format("L")
    ) {
      const diferencia = moment().diff(moment(desdeHora, "HH:mm"), "minutes");
      minutosPorHora = diferencia;
    }
    //Si son las 10 y estoy consultando el registro de las 11 o > y la fecha es = a la actual. Entonces no calculo nada.
    if (horaActual < horaActualDesde && moment(getValues("fecha")).format("L") == moment().format("L")) {
      minutosPorHora = 0;
    }
    const total = (minutosPorHora * targetTotal) / minutosTotalesTrabajo;
    return Math.trunc(total); //Devuelve solo la parte entera.
  };

  const getRechazados = async (horaId: number) => {
    let result = [];
    const lineaSeleccionada = lineas.find((x) => x.codigoInicio === getValues("codigoInicio").toString());
    try {
      result = unwrapResult(
        await dispatch(
          RechazoSliceRequests.getAllByLineaAndFechaAndaDesdeHasta({
            lineaId: lineaSeleccionada.idLinea,
            fecha: moment(getValues("fecha")).format("YYYY-MM-DD"),
            horaId: horaId
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
    if (result) {
      return result.length;
    }
  };

  //Obtiene un array de registros Inicio. La cantidad todal es equivalente a la cantidad producida.
  const getData = async (parametros, element, minutosTotalesTrabajo) => {
    let result = [];
    result = unwrapResult(await dispatch(InicioSliceRequests.getAllByFechaAndTurnoAndOthers(parametros)));
    if (result) {
      const target = await calcularTarget(
        element.desdeHora,
        element.hastaHora,
        minutosTotalesTrabajo,
        element.minutos,
        result[0]
      );

      const produccion = result.length;
      const rechazados = await getRechazados(element.idHora);

      const objeto = {
        id: element.idHora,
        desde: element.desdeHora,
        hasta: element.hastaHora,
        produccion,
        target,
        diferencia: produccion - target,
        rechazados: rechazados
      };
      return objeto;
    }
  };

  const calcularFpy = (produccionHora, produccionTotal: number, rechazosTotal: number) => {
    let fpyAux = 0;
    if (produccionHora.length > 0) {
      fpyAux = (produccionTotal / (produccionTotal + rechazosTotal)) * 100;
    }
    fpyAux = parseFloat(fpyAux.toFixed(2));
    setFpy(fpyAux);
  };

  const handleSearch = async (listHoras: IHora[]) => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let objeto: {
      id: number;
      desde: string;
      hasta: string;
      produccion: number;
      rechazados: number;
      diferencia: number;
    };
    const produccionHora = [];
    let produccionTotal = 0; //contabiliza el total de los producidos
    let rechazosTotal = 0; //Contabiliza los rechazos totales
    let diferencia = 0; //Contabilñiza la diferencia total
    const minutosTotalesTrabajo = calcularMinutosTotales(listHoras);
    //Recorro las horas y armo la lista de cada registro con la produccion, target, diferencia, etc...
    for (const element of listHoras) {
      const parametros = {
        fecha: moment(getValues("fecha")).format("YYYY-MM-DD"),
        turno: watchTurno,
        codigoInicio: watch("codigoInicio"),
        idHora: element.idHora
      };
      objeto = await getData(parametros, element, minutosTotalesTrabajo);
      produccionHora.push(objeto);
      produccionTotal += objeto.produccion;
      rechazosTotal += objeto.rechazados;
      diferencia += objeto.diferencia;
    }
    setDiferencia(diferencia);
    calcularFpy(produccionHora, produccionTotal, rechazosTotal);
    setListOfProduccionPorHora(produccionHora);
    setContadorProduccion(produccionTotal);
    setTotalRechazados(rechazosTotal);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const getHoras = async () => {
    const lineaSeleccionada = lineas.find((x) => x.codigoInicio === getValues("codigoInicio").toString());

    if (lineaSeleccionada == null) {
      return false;
    }
    let periodoLinea;

    try {
      periodoLinea = unwrapResult(
        await dispatch(
          PeriodoLineaSliceRequest.getByLineaAndTurno({
            lineaId: lineaSeleccionada.idLinea,
            turno: getValues("turnoRadioButton")
          })
        )
      );
    } catch (error) {
      console.log(error);
    }

    if (periodoLinea) {
      if (periodoLinea.periodo) {
        const listHoras = periodoLinea.periodo.periodoHora.map((x) => x.hora); //Me obtengo el array de Horas.
        handleSearch(listHoras);
      }
    } else {
      openNotificationUI(
        "No se encuentra un periodo asignado para esa linea. Asegurese de asignar un Periodo a la Linea.",
        "error"
      );
    }
  };

  useEffect(() => {
    if (watchLinea > 0) getHoras(); /* handleSearch(); */
  }, [watchLinea, fecha, watchTurno]);

  return (
    <div className="p-4">
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-4 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          <div>
            <Controller
              name="codigoInicio"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Linea</InputLabel>
                  <Select {...field} placeholder="Seleccione una Linea" variant="standard">
                    {lineas &&
                      lineas.map((x) => (
                        <MenuItem key={x.codigoInicio} value={x.codigoInicio}>
                          <div className="w-full">
                            <div>{x.descripcion}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          {/* ----------------FECHA---------------*/}
          <div>
            <DesktopDatePicker
              label="Fecha"
              value={fecha}
              inputFormat="DD/MM/yyyy"
              onChange={(e: any) => {
                setValue("fecha", e);
              }}
              renderInput={(field) => <TextField {...field} variant="standard" />}
            />
          </div>
          <div>
            <FormControl>
              <FormLabel>Turno</FormLabel>
              <Controller
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <div className="sm:grid sm:grid-cols-1 ">
                      <div className="sm:col-span-1 ">
                        <FormControlLabel value="M " control={<Radio />} label="Mañana" />
                        <FormControlLabel value="T " control={<Radio />} label="Tarde" />
                        <FormControlLabel value="N " control={<Radio />} label="Noche" />
                      </div>
                    </div>
                  </RadioGroup>
                )}
                rules={{ required: true }}
                control={control}
                defaultValue="M"
                name="turnoRadioButton"
              />
            </FormControl>
          </div>
          <div>
            <Button variant="outlined" onClick={getHoras}>
              Refrescar
            </Button>
          </div>
        </div>
      </form>

      {listOfProduccionPorHora.length > 0 && (
        <div className="animate__animated animate__fadeInUp">
          <div className="flex w-full justify-evenly my-4 bg-secondaryNew rounded-md py-3">
            <div className="flex flex-col items-center gap-y-1">
              <p>Target</p>
              <p className="text-blue-500 font-semibold">{target}</p>
            </div>
            <div className="flex flex-col items-center gap-y-1">
              <p>Producido</p>
              <p className="text-green-500 font-semibold">{contadorProduccion}</p>
            </div>
            <div className="flex flex-col items-center gap-y-1">
              <p>Diferencia</p>
              <p className="text-orange-400 font-semibold">{diferencia}</p>
            </div>
            <div className="flex flex-col items-center gap-y-1">
              <p>Rechazados</p>
              <p className="text-red-500 font-semibold">{totalRechazados}</p>
            </div>
            <div className="flex flex-col items-center gap-y-1">
              <p>FPY</p>
              <p className="text-blue-500 font-semibold">{fpy}</p>
            </div>
            {/* <TitleUIComponent
              title={`Producidos: ${contadorProduccion} - Target: ${target} - Rechazados: ${totalRechazados} - FPY: ${fpy}% - Diferencia: ${diferencia} `}
              classNameDiv="w-full whitespace-wrap mx-0"
            /> */}
          </div>

          <TableComponent
            Dense={true}
            Overflow={false}
            buscar={false}
            IDcolumn={"id"}
            columns={[
              {
                title: "Desde",
                field: "desde"
              },
              {
                title: "Hasta",
                field: "hasta"
              },
              {
                title: "Prod.",
                field: "produccion"
              },
              {
                title: "Target",
                field: "target"
              },
              {
                title: "Diferencia",
                field: "diferencia"
              },
              {
                title: "Rechazos",
                field: "rechazados"
              }
            ]}
            dataInfo={listOfProduccionPorHora}
          />
        </div>
      )}
    </div>
  );
};
