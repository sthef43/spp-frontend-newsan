import { useEffect, useMemo, useState } from "react";
import { Button, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { HoraSliceRequests } from "app/Middleware/reducers/HoraSlice";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ParadasDeLineaSliceRequests } from "app/Middleware/reducers/ParadasDeLineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { TargetsSliceRequests } from "app/Middleware/reducers/TargetsSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { PeriodoLineaSliceRequest } from "app/Middleware/reducers/periodoLineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IInicio, ILinea, IPlant } from "app/models";
import { ReporteProduccionExcelDTO } from "app/models/DTO/ReporteProduccionExcelDTO";
import { IHora } from "app/models/IHora";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IParadasDeLinea } from "app/models/IParadasDeLinea";
import { ITargets } from "app/models/ITargets";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OQCTargetSliceRequests } from "app/features/oqcGeneral/slices/OQCTargetSlice";

interface initialState {
  codigoInicio: number; // representa la linea.
  fecha: Date | null;
  turno: string;
  turnoRadioButton: string;
  planta: number;
}

const initialStateVar = {
  codigoInicio: 0,
  fecha: null,
  turnoRadioButton: "M ",
  planta: 0
};

export const GraficoProduccionPorHora = () => {
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();

  const [target, setTarget] = useState(0);
  const [lote, setLote] = useState("0");
  const [listOfProduccionPorHora, setListOfProduccionPorHora] = useState<any[]>([]);
  const [listOfProduccionPorHoraParadas, setListOfProduccionPorHoraParadas] = useState<any[]>([]);
  const [paradasDeLinea, setParadasDeLinea] = useState<IParadasDeLinea[]>([]);
  const [paradasChartData, setParadasChartData] = useState<any[]>([]);
  const [lineaProduccion, setLineaProduccion] = useState<ILineaProduccion>();
  const [listOfProduccionPorHoraExcel, setListOfProduccionPorHoraExcel] = useState<ReporteProduccionExcelDTO[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [fpy, setFpy] = useState(0);
  const [produccionTotal2, setContadorProduccion] = useState(0);
  const [modelosProducidos, setModelosProducidos] = useState<any[]>([]);
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);

  const renderTool = false;
  let paradasTurno;

  //Leer Plantas
  const [listPlantas, setListPantas] = useState<IPlant[]>([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  useEffect(() => {
    TitleChanger("PRODUCCION POR HORA");
    getPlantas();
    dispatch(HoraSliceRequests.getAll()); //Me traigo por unica vez TODAS las horas desde el back.
  }, []);

  const formatTiempoPerdido = (minutos: number) => {
    if (!minutos || minutos < 60) return `${minutos} min`;

    const h = Math.floor(minutos / 60);
    const m = minutos % 60;

    if (m === 0) return `${h} h`;
    return `${h} h ${m} min`;
  };

  const customToolTip = (value) => {
    const { active, label } = value;
    let { payload } = value;

    if (active && payload) {
      payload = payload.filter((pld) => pld.value > 0);
      if (payload.length > 0) {
        const t = listOfProduccionPorHora.find((d) => d.hora == label);

        if (!t) return null;

        const producido = (t.produccion ?? 0) + (t.sobreProduccion ?? 0);
        const targetValue = t.target ?? 0;
        const sobre = t.sobreProduccion ?? 0;
        const dif = t.diferencia ?? 0;

        return (
          <div className="bg-NewPrimary border-[var(--border)] rounded-[3px] shadow-Box border px-4 py-3">
            <div className="text-[12px] text-textNew mb-2">{label}</div>

            <div className="text-[12px] text-textNew mb-1">
              <span className="dot-blue" />
              <span className="font-semibold">Target:</span> {targetValue}
            </div>

            <div className="text-[12px] text-textNew mb-1">
              <span className="dot-blue !bg-[#A2D911]" />
              <span className="font-semibold">Producido:</span> {producido}
            </div>

            {sobre > 0 && (
              <div className="text-[12px] text-textNew mb-1">
                <span className="dot-blue !bg-[#31B1D6]" />
                <span className="font-semibold">Sobre Producción:</span> {sobre}
              </div>
            )}

            {dif > 0 && (
              <div className="text-[12px] text-textNew">
                <span className="dot-blue !bg-[#EF787A]" />
                <span className="font-semibold">Diferencia:</span> {dif}
              </div>
            )}

            <style>
              {`
              .text-textNew{ color: #3F3D56; }
              .bg-NewPrimary border-[var(--border)]{
              background-color: #F8FAFB;
              border-color: #EAEEF4;
              }
              .dot-blue{
              width: 8px;
              height: 8px;
              border-radius: 9999px;
              background-color: #137FEC;
              display: inline-block;
              flex-shrink: 0;
              margin-right: 5px;
              }

              /* dark mode */
              .dark .text-textNew{ color: #FFF; }
              .dark .bg-NewPrimary border-[var(--border)]{
              background-color: #000027;
              border-color: #0f2053;
              }
              `}
            </style>
          </div>
        );
      }
    }
    return null;
  };

  const DotParada = (props: any) => {
    const { cx, cy, payload } = props;

    if (!payload?.paradas || payload.paradas.length === 0) return null;

    return <circle cx={cx} cy={cy} r={3} stroke="black" strokeWidth={1} fill="#2D9CDB" />;
  };

  const TooltipParadasProduccion = (props: any) => {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;

    const p = payload[0]?.payload;
    const produccion = p?.produccion ?? 0;
    const paradas = p?.paradas ?? [];

    // tooltip solo cuando hay parada descomentar
    if (!paradas.length) return null;

    const minutosTotal = (paradas || []).reduce((acc: number, x: any) => acc + getStopMinutes(x), 0);

    const causas = (paradas || [])
      .map((x: any) => (x?.causa || x?.motivo || x?.descripcion || "").toString().trim())
      .filter((s: string) => !!s);

    const causaText =
      causas.length === 0
        ? "Sin motivo"
        : causas.length === 1
        ? causas[0]
        : `${causas[0]} (+${causas.length - 1} Paradas)`;

    return (
      <div className="bg-NewPrimary border-[var(--border)] rounded-[3px] shadow-Box border px-4 py-3">
        <div className="text-[12px] text-textNew mb-2">{label}</div>

        {/* <div className="text-[12px] text-textNew mb-1">
          <span className="dot-blue"></span>
          <span>Producido:</span> {produccion}
        </div> */}

        {paradas.length > 0 && (
          <>
            <div className="text-[12px] text-textNew mb-1">
              <span className="dot-blue"></span>
              {minutosTotal} minutos
            </div>
            <div className="text-[12px] text-textNew">
              <span className="dot-blue"></span>
              <span>Motivo:</span> {causaText}
            </div>
          </>
        )}
        <style>
          {`
        .text-textNew{color: #3F3D56}
        .text-[#137FEC]{color: #137FEC}
        .bg-NewPrimary border-[var(--border)]{background-color: #F8FAFB; border-color: #EAEFF4}
        .dot-blue {
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background-color: #137FEC;
        display: inline-block;
        flex-shrink: 0;
        margin-right:5px;
        }
        .dark .text-textNew{color: #FFF}
        .dark .text-[#137FEC]{color: #FFF}
        .dark .bg-NewPrimary border-[var(--border)]{background-color: #000d27; border-color: #0f2053}`}
        </style>
      </div>
    );
  };

  const customTick = (values) => {
    const { x, y, stroke, payload } = values;
    let text = payload.value;
    if (text == target) {
      text = `${text} (Target)`;
    }
    return (
      <text x={x} dy={5} y={y} textAnchor="end" fill="var(--rc-axis)" className="text-[12px]">
        {text}
      </text>
    );
  };

  const fecha = watch("fecha");
  const watchTurno = watch("turnoRadioButton");
  const watchLinea = watch("codigoInicio");
  const watchPlanta = watch("planta");

  //Leer Líneas por planta
  const [lineas, setLineas] = useState<ILinea[]>([]);
  const [fpyTarget, setFpyTarget] = useState<number | null>(null);

  const getTargetColors = (valor: number, target: number | null) => {
    if (target == null) return "bg-gray-400";
    if (valor > target) return "bg-[#A2D911] text-[#39863C]";
    if (valor >= target - 1) return "bg-[#FBFE5E] text-[#d3942fff]";
    return "bg-[#FF625B] text-[#952d28ff]";
  };

  const getLineas = async () => {
    try {
      const responses = unwrapResult(await dispatch(LineaSliceRequests.GetListByPlantId(watchPlanta)));
      setLineas(responses);
    } catch (error) {
      openNotificationUI("Error al leer lineas.", "error");
    }
  };

  useEffect(() => {
    if (watchPlanta) {
      watchLinea == 0;
      getLineas();
    }
  }, [watchPlanta]);

  useEffect(() => {
    const codigoInicio = Number(watchLinea);

    if (!codigoInicio) {
      setFpyTarget(null);
      return;
    }

    (async () => {
      try {
        // Puente BD08 (codigoInicio) -> BD13 (LineaProduccion.id)
        const lp = unwrapResult(await dispatch(LineaProduccionSliceRequests.getByIdentificadorLinea(codigoInicio)));

        const idLinea13 = lp?.id;
        if (!idLinea13) {
          setFpyTarget(null);
          return;
        }

        const resp = unwrapResult(await dispatch(OQCTargetSliceRequests.getByLineaId(idLinea13)));

        const t = Number(resp?.target ?? null);
        setFpyTarget(Number.isFinite(t) ? t : null);
      } catch {
        setFpyTarget(null);
      }
    })();
  }, [watchLinea]);

  const getPlanProdByNroOp = async (nroOp: string) => {
    const result = unwrapResult(await dispatch(PlanProdSliceRequests.getPlanprodByNumeroOpRequest(nroOp)));
    if (result) return result;
    return null;
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
      console.error(error);
    }
    if (result) {
      setLote(planProd.lote);
      setTarget(result.target);
      return result.target;
    } else {
      openNotificationUI("No existe el target para el generico " + generico, "info");
      return 0;
    }
  };

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

    let minutosPorHora = minutosActuales;

    if (
      horaActual >= horaActualDesde &&
      horaActual <= horaActualHasta &&
      moment(getValues("fecha")).format("L") == moment().format("L")
    ) {
      const diferencia = moment().diff(moment(desdeHora, "HH:mm"), "minutes");
      minutosPorHora = diferencia;
    }

    if (horaActual < horaActualDesde && moment(getValues("fecha")).format("L") == moment().format("L")) {
      minutosPorHora = 0;
    }
    const total = (minutosPorHora * targetTotal) / minutosTotalesTrabajo;

    return Math.trunc(total);
  };

  const calcularMinutosTotales = (listHoras: IHora[]) => {
    let sumaTotal = 0;
    for (let index = 0; index < listHoras.length; index++) {
      sumaTotal += listHoras[index].minutos;
    }
    return sumaTotal;
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
      console.error(error);
    }
    if (result) return result.length;
  };

  const getData = async (
    parametros,
    element,
    minutosTotalesTrabajo,
    paradas: IParadasDeLinea[],
    index,
    total,
    produccionConParadas: any[],
    data
  ) => {
    let result = [];
    const response: {
      produccion: any;
      paradas: any[];
      modelosProducidos: any;
      rechazo: number;
    } = {
      produccion: null,
      paradas: [],
      modelosProducidos: [],
      rechazo: 0
    };

    let puntos = [];
    result = unwrapResult(await dispatch(InicioSliceRequests.getAllByFechaAndTurnoAndOthers(parametros)));
    const rechazados = await getRechazados(element.idHora);
    response.rechazo += rechazados;

    const modelos = _.groupBy(result, "modeloFin");
    for (const modelo of Object.keys(modelos)) {
      if (data.length > 0) {
        const find = data.find((d) => d.modelo == modelo);
        if (find) {
          find.producido += modelos[modelo].length;
        } else {
          const obj = { modelo, producido: modelos[modelo].length };
          response.modelosProducidos.push(obj);
        }
      } else {
        const obj = { modelo, producido: modelos[modelo].length };
        response.modelosProducidos.push(obj);
      }
    }

    if (result) {
      const target = await calcularTarget(
        element.desdeHora,
        element.hastaHora,
        minutosTotalesTrabajo,
        element.minutos,
        result[0]
      );
      const horaFinal = moment(element.hastaHora, "HH:mm").format("HH:mm");
      const filterParadas = paradas.filter((d) => moment(d.horaInicio, "HH:mm").isBefore(moment(horaFinal, "HH:mm")));

      if (index == 0) {
        puntos.push(
          moment(element.desdeHora, "HH:mm").format("HH:mm"),
          moment(element.hastaHora, "HH:mm").format("HH:mm")
        );

        if (filterParadas.length > 0) {
          for (const parada of filterParadas) {
            const horaInicio = moment(parada.horaInicio, "HH:mm").format("HH:mm");
            const findHoraIgual = puntos.find((d) => d == horaInicio);
            if (!findHoraIgual) puntos.push(horaInicio);
          }
        }
      } else {
        puntos.push(moment(element.hastaHora, "HH:mm").format("HH:mm"));
        if (filterParadas.length > 0) {
          for (const parada of filterParadas) {
            const horaInicioParada = moment(parada.horaInicio, "HH:mm").format("HH:mm");
            const findHoraIgual = puntos.find((d) => d == horaInicioParada);
            if (!findHoraIgual) puntos.push(horaInicioParada);
          }
        }
      }

      puntos = _.orderBy(puntos);
      let produccionTemporal = result;
      for (const p of puntos) {
        const pro = produccionTemporal.filter((d) => moment(d.horaFin, "HH:mm").isBefore(moment(p, "HH:mm")));
        produccionTemporal = produccionTemporal.filter((d) => !moment(d.horaFin, "HH:mm").isBefore(moment(p, "HH:mm")));
        const produccion = pro.length;

        const puntoYaExiste = produccionConParadas.find((d) => d.hora == p);
        if (puntoYaExiste) {
          puntoYaExiste.paradas = filterParadas.filter((d) => moment(d.horaInicio, "HH:mm").isSame(moment(p, "HH:mm")));
        } else {
          const obj = {
            id: element.idHora,
            hora: p,
            produccion,
            target: target,
            diferencia: pro.length < target ? target - pro.length : 0,
            rechazados: 0,
            sobreProduccion: produccion > target ? produccion - target : 0,
            paradas: filterParadas.filter((d) => moment(d.horaInicio, "HH:mm").isSame(moment(p, "HH:mm")))
          };
          response.paradas.push(obj);
        }
      }

      response.paradas = _.orderBy(response.paradas, "hora");

      let produccion = result.length;
      let rojo = 0;
      let verde = produccion;
      let azul = 0;

      if (produccion > target) {
        verde = target;
        azul = produccion - target;
      } else if (produccion < target) {
        rojo = target - produccion;
        verde = target - rojo;
      }

      produccion = verde;

      const objeto = {
        id: element.idHora,
        hora: `${moment(element.desdeHora, "HH:mm").format("HH:mm")} a ${moment(element.hastaHora, "HH:mm").format(
          "HH:mm"
        )}`,
        desde: element.desdeHora,
        hasta: element.hastaHora,
        produccion,
        target: target,
        diferencia: rojo,
        rechazados: 0,
        sobreProduccion: azul,
        paradas: filterParadas,
        rojo,
        verde,
        azul
      };
      response.produccion = objeto;
      return response;
    }
  };

  const calcularFpy = (produccionTotal: number, rechazosTotal: number) => {
    let fpyAux = 0;
    fpyAux = (produccionTotal / (produccionTotal + rechazosTotal)) * 100;
    fpyAux = parseFloat(fpyAux.toFixed(2));
    setFpy(fpyAux);
  };

  const getStopMinutes = (p: any): number => {
    if (p?.minutos != null) return Number(p.minutos) || 0;
    if (p?.minutosParada != null) return Number(p.minutosParada) || 0;
    if (p?.duracion != null) return Number(p.duracion) || 0;

    try {
      // fallback HH:mm
      const ini = moment(p.horaInicio, "HH:mm");
      const fin = moment(p.horaFin, "HH:mm");
      const diff = fin.diff(ini, "minutes");
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  };

  const buildParadasChartData = (paradas: any[], startHour = "06:00", endHour = "15:00") => {
    const start = moment(startHour, "HH:mm");
    const end = moment(endHour, "HH:mm");

    const mapMinutes: Record<string, number> = {};
    const mapMotivos: Record<string, string[]> = {};

    for (let t = start.clone(); t.isSameOrBefore(end); t.add(1, "hour")) {
      const key = t.format("HH:00");
      mapMinutes[key] = 0;
      mapMotivos[key] = [];
    }

    for (const p of paradas || []) {
      const key = moment(p.horaInicio, "HH:mm").format("HH:00");
      if (mapMinutes[key] == null) continue;

      const mins = getStopMinutes(p);
      mapMinutes[key] += mins;

      const motivo = (p.causa || p.descripcion || p.detalle || "").toString().trim();
      if (motivo) mapMotivos[key].push(motivo);
    }

    const points: any[] = [];
    Object.keys(mapMinutes).forEach((key) => {
      const motivos = mapMotivos[key];
      const motivoTooltip =
        motivos.length === 0
          ? "Sin motivo"
          : motivos.length === 1
          ? motivos[0]
          : `${motivos[0]} (+${motivos.length - 1})`;

      points.push({
        hora: key,
        minutos: Number(mapMinutes[key] || 0),
        motivo: motivoTooltip
      });
    });

    return points;
  };

  // const TooltipParadas = (props: any) => {
  //   const { active, payload, label } = props;
  //   if (!active || !payload?.length) return null;

  //   const p = payload[0]?.payload;
  //   const mins = p?.minutos ?? 0;
  //   const motivo = p?.causa ?? "Sin motivo";

  //   if (!mins || mins <= 0) return null;

  //   return (
  //     <div className="bg-white rounded-xs shadow-elevation-4 border border-black/10 px-4 py-3">
  //       <div className="text-[12px] font-semibold mb-2">{label}</div>
  //       <div className="text-[12px] font-bold text-[#1976d2] mb-1">{mins} minutos</div>
  //       <div className="text-[12px]">
  //         <span className="font-semibold">Motivo:</span> {motivo}
  //       </div>
  //     </div>
  //   );
  // };

  const paradasTotales = useMemo(() => paradasDeLinea?.length || 0, [paradasDeLinea]);
  const tiempoPerdido = useMemo(() => {
    return (paradasDeLinea || []).reduce((acc: number, p: any) => acc + getStopMinutes(p), 0);
  }, [paradasDeLinea]);

  const handleSearch = async (listHoras: IHora[], lineaProduccionId: number) => {
    const fechaFrom = getValues("fecha");
    dispatch(LoadingUISlice.actions.LoadingUIClose);
    if (!fechaFrom) {
      openNotificationUI("Selecciione una fecha", "info");
      return;
    }

    let totalProduccion = 0;
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));

    //buscar paradas de linea
    const filter = {
      fechaInicio: moment(fechaFrom).format("YYYY-MM-DD"),
      fechaFin: moment(fechaFrom).format("YYYY-MM-DD"),
      lineaId: lineaProduccionId,
      turnoId: 1
    };

    let paradas = unwrapResult(await dispatch(ParadasDeLineaSliceRequests.GetByFilters(filter)));

    paradas = paradas.map((d) => {
      const horaInicio = +moment(d.horaInicio, "HH:mm").format("HH");
      const horaFin = +moment(d.horaFin, "HH:mm").format("HH");
      if (d.horaInicio.toLowerCase().includes("pm") && horaInicio != 12) {
        d.horaInicio = moment(d.horaInicio, "HH:mm").add(12, "hour").format("HH:mm");
      }
      if (d.horaFin.toLowerCase().includes("pm") && horaFin != 12) {
        d.horaFin = moment(d.horaFin, "HH:mm").add(12, "hour").format("HH:mm");
      }
      return d;
    });

    setParadasDeLinea(paradas);
    setParadasChartData(buildParadasChartData(paradas, "06:00", "15:00"));

    //
    const produccionHora: any[] = []; //PRODUCCION POR HORA
    let produccionHora2: any[] = []; //PRODUCCION CON PARADAS
    let produccionTotal = 0; //contabiliza el total de los producidos
    let rechazosTotal = 0; //Contabiliza los rechazos totales
    const minutosTotalesTrabajo = calcularMinutosTotales(listHoras);

    let index = 0;
    let modelosProducidos: any[] = [];

    for (const element of listHoras) {
      const parametros = {
        fecha: moment(getValues("fecha")).format("YYYY-MM-DD"),
        turno: watchTurno,
        codigoInicio: watch("codigoInicio"),
        idHora: element.idHora
      };

      const data = await getData(
        parametros,
        element,
        minutosTotalesTrabajo,
        paradas,
        index,
        listHoras.length,
        produccionHora2,
        modelosProducidos
      );

      produccionHora.push(data.produccion);
      produccionHora2 = [...produccionHora2, ...data.paradas];
      modelosProducidos = [...modelosProducidos, ...data.modelosProducidos];

      produccionTotal += data.produccion.produccion;
      rechazosTotal += data.rechazo;
      index++;
    }

    calcularFpy(produccionTotal, rechazosTotal);

    modelosProducidos.forEach((elementos) => {
      totalProduccion += elementos.producido;
      setContadorProduccion(totalProduccion);
    });

    setListOfProduccionPorHora(produccionHora);
    setListOfProduccionPorHoraParadas(produccionHora2);
    setModelosProducidos(modelosProducidos);

    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const getHoras = async () => {
    exportarExcelInfo();
    const fechaFrom = getValues("fecha");
    if (!fechaFrom) {
      openNotificationUI("Seleccione una fecha", "info");
      return false;
    }

    const lineaSeleccionada = lineas.find((x) => x.codigoInicio === getValues("codigoInicio").toString());
    if (lineaSeleccionada == null) return false;

    let periodoLinea;

    const lineaProduccion = unwrapResult(
      await dispatch(LineaProduccionSliceRequests.getByIdentificadorLinea(lineaSeleccionada.codigoInicio))
    );
    setLineaProduccion(lineaProduccion);

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
      console.error(error);
    }

    if (periodoLinea) {
      if (periodoLinea.periodo) {
        const listHoras = periodoLinea.periodo.periodoHora.map((x) => x.hora);
        handleSearch(listHoras, lineaProduccion.id);
      }
    } else {
      openNotificationUI(
        "No se encuentra un periodo asignado para esa linea. Asegurese de asignar un Periodo a la Linea.",
        "error"
      );
    }
  };

  const exportarExcelInfo = async () => {
    const fechaForm = getValues("fecha");
    const plantaForm = getValues("planta");

    if (!fechaForm || !plantaForm || Number(plantaForm) === 0) return false;

    try {
      const response = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.GetAllReportByRangeDateRequest({
            fecha: moment(fechaForm).format("YYYY-MM-DD"),
            plantId: plantaForm
          })
        )
      );
      if (response) {
        exportarExcel(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportarExcel = (dataExcel: ReporteProduccionExcelDTO[]) => {
    const dataExport = dataExcel.map((x) => {
      return {
        ...x,
        fecha: moment(getValues("fecha")).format("YYYY-MM-DD")
      };
    });
    setListOfProduccionPorHoraExcel(dataExport);
  };

  useEffect(() => {
    if (watchLinea > 0) {
      getHoras();
      // exportarExcelInfo();
    }
  }, [watchLinea, fecha]);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      {/* TITULO SECCION */}
      <div className="px-6 pb-6">
        <div className="text-3xl font-bold">Producción detallada por línea</div>
        {/* FILTROS */}
        <div className="flex items-center w-full gap-6">
          <div className="flex gap-6 mt-5 w-[100%]">
            {/* Planta */}
            <div className="w-[50%]">
              <SelectComponentForm
                control={control}
                name="planta"
                label="Seleccionar Planta"
                listItems={listPlantas}
                valueLabel={(item) => item.name}
                valueSelect={(item) => item.id}
                rules={{ required: true }}
              />
            </div>
            {/* Línea */}
            <div className="w-[50%]">
              <SelectComponentForm
                control={control}
                name="codigoInicio"
                label="Seleccionar Línea"
                listItems={lineas}
                valueLabel={(item) => item.descripcion}
                valueSelect={(item) => item.codigoInicio}
                rules={{ required: true }}
              />
            </div>
            {/* Fecha */}
            <div className="w-[50%]">
              <FormControl variant="outlined" className="w-full">
                <DesktopDatePicker
                  value={fecha}
                  inputFormat="DD/MM/YYYY"
                  onChange={(e: any) => setValue("fecha", e)}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" className="w-full" label="Seleccionar Fecha" />
                  )}
                />
              </FormControl>
            </div>

            {/* Turno */}
            <div className="w-full">
              <div className="text-[14px] font-medium text-textNew">Turno</div>
              <FormControl>
                <Controller
                  render={({ field }) => (
                    <RadioGroup {...field} row className=" text-textNew font-medium gap-3">
                      <FormControlLabel value="M " control={<Radio />} label="Mañana" />
                      <FormControlLabel value="T " control={<Radio />} label="Tarde" />
                      <FormControlLabel value="N " control={<Radio />} label="Noche" />
                    </RadioGroup>
                  )}
                  rules={{ required: true }}
                  control={control}
                  defaultValue="M"
                  name="turnoRadioButton"
                />
              </FormControl>
            </div>
          </div>

          {/* Botones derecha */}
          <div className="flex gap-9 mb-2">
            <Button
              variant="outlined"
              onClick={getHoras}
              className="!px-8 !w-[115px] !shadow-Box !h-[38px] !border-[#137FEC] !text-[12px] !normal-case border-[2px]">
              Refrescar
            </Button>

            <ExportExcel
              titleButton="EXPORTAR"
              title="Produccion Diaria"
              stylesButton="m-0"
              data={listOfProduccionPorHoraExcel}
              columns={[
                { title: "Fecha", field: `fecha` },
                { title: "Linea", field: "linea" },
                { title: "Modelo", field: "modelo" },
                { title: "Familia", field: "familia" },
                { title: "Produccido", field: "producidos" },
                { title: "Cantidad", field: "cantidad" },
                { title: "Lote", field: "lote" },
                { title: "Target", field: "target" }
              ]}
            />
          </div>
        </div>

        <div className="border-b border-divider my-2" />

        {listOfProduccionPorHora.length > 0 && (
          <>
            {/*_____PRODUCCION TABLERO_____*/}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-New rounded-[3px] shadow-Box p-6">
                <div className="text-[14px] ml-1 text-textNew">PRODUCCIÓN DIARIA</div>
                <div className="text-[28px] font-black ml-1 text-[#137FEC] mb-2">{target}</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={listOfProduccionPorHora}
                    margin={{ top: 30, right: 30, left: -25, bottom: 0 }}
                    barSize={40}>
                    <CartesianGrid strokeDasharray="2 2" stroke="var(--grid)" strokeWidth={1} />
                    <XAxis dataKey="hora" width={300} tick={{ fontSize: 12, fill: "var(--axis)" }} tickMargin={10} />
                    <YAxis tickCount={5} tick={customTick} />
                    <Tooltip content={customToolTip} cursor={{ fill: "#82828218" }} />
                    <Legend
                      iconType="circle"
                      iconSize={9}
                      formatter={(value) => <span className="text-[12px] text-textNew lowercase">{value}</span>}
                    />
                    <Bar dataKey="produccion" stackId="a" fill="#A2D911" />
                    <Bar dataKey="diferencia" stackId="a" fill="#EF787A" />
                    <Bar dataKey="sobreProduccion" stackId="a" fill="#31B1D6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* CARD DER: KPIS + Traveler */}
              <div className="bg-New rounded-[3px] p-6 shadow-Box">
                <div className="grid grid-cols-4 gap-4 mb-5">
                  <div className="text-center">
                    <div className="text-[12px] text-textNew mb-2">PRODUCIDO</div>
                    <div className="h-[40px] rounded-[3px] border bg-NewPrimary border-[var(--border)] font-black flex items-center justify-center text-[#137FEC]">
                      {produccionTotal2}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[12px] text-textNew mb-2">TARGET</div>
                    <div className="h-[40px] rounded-[3px] border bg-NewPrimary border-[var(--border)] font-black flex items-center justify-center text-[#137FEC]">
                      {target}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[12px] text-textNew mb-2">FPY</div>
                    <div
                      className={`h-[40px] rounded-[3px] font-black flex items-center justify-center ${getTargetColors(
                        fpy,
                        fpyTarget
                      )}`}>
                      {fpy || "0"}%
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[12px] text-textNew mb-2">STANDARD</div>
                    <div className="h-[40px] rounded-[3px] border bg-NewPrimary border-[var(--border)] font-black flex items-center justify-center text-[#137FEC]">
                      25
                    </div>
                  </div>
                </div>

                <div className="rounded-[3px] border h-[220px] bg-NewPrimary border-[var(--border)]">
                  <div className="grid grid-cols-3 text-center text-[12px] text-textNew bg-NewPrimary border-[var(--border)] border-b items-center">
                    <div className="flex justify-center items-center py-3">MODELO PRODUCIDO</div>
                    <div className="flex justify-center items-center py-3">LOTE</div>
                    <div className="flex justify-center items-center py-3">PRODUCCIÓN</div>
                  </div>

                  <div className="pt-3">
                    {modelosProducidos.map((modelo) => (
                      <div key={modelo.modelo} className="grid grid-cols-3 text-textNew text-center py-2 text-[13px]">
                        <div className="break-words">{modelo.modelo}</div>
                        <div>{lote}</div>
                        <div>{modelo.producido}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/*_____PARADAS DE LINEA______*/}
            {/* {listOfProduccionPorHoraParadas?.length > 0 && (
              <div className="mt-6 bg-New rounded-[3px] shadow-Box p-5">
                <div className="flex items-start gap-6 mb-3">
                  <div className="text-[14px] p-5 font-medium text-textNew uppercase">PARADAS DE LINEA</div>

                  <div className="flex gap-[50px]">
                    <div className="bg-NewPrimary border-[var(--border)] border px-8 py-2 text-center min-w-[190px] h-[50px]">
                      <div className="text-[12px] text-textNew ">Paradas totales</div>
                      <div className="text-[14px] font-black text-[#137FEC]">{paradasTotales}</div>
                    </div>

                    <div className="bg-NewPrimary border-[var(--border)] border px-8 py-2 text-center min-w-[190px] h-[50px]">
                      <div className="text-[12px] text-textNew">Tiempo perdido</div>
                      <div className="text-[14px] font-black text-[#137FEC]">{formatTiempoPerdido(tiempoPerdido)}</div>
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart
                    data={listOfProduccionPorHoraParadas}
                    margin={{ top: 10, right: 30, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="var(--grid)" strokeWidth={1} />
                    <XAxis dataKey="hora" tickMargin={10} tick={{ fontSize: 12, fill: "var(--axis)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--axis)" }} />

                    <Tooltip content={<TooltipParadasProduccion />} />

                    <Area
                      type="linear"
                      dataKey="produccion"
                      stroke="#31B1D6"
                      fill="#BEE3FF"
                      fillOpacity={0.8}
                      dot={<DotParada />} // dot solo si hay paradas
                      activeDot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )} */}

            {/*
              <div className="m-2 c-chart">
              <div className={"graph_bg2"}>
              <div className="font-semibold text-2xl ml-14">Paradas de Línea</div>
              <ResponsiveContainer width="100%" height={280}>
              <AreaChart
              width={500}
              height={400}
              data={listOfProduccionPorHoraParadas}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--rc-grid)" />
              <XAxis dataKey="hora" tickMargin={10} tick={{ fontSize: 15, fill: "var(--rc-axis)" }} />
              <YAxis tick={{ fontSize: 15, fill: "var(--rc-axis)" }} />
              <Area type="monotone" dataKey="produccion" stroke="#2D9CDB" fill="#2D9CDB" dot={<CustomizedDot />} />
              </AreaChart>
              </ResponsiveContainer>
              </div>
              </div>
              */}
          </>
        )}

        {/*
              <ModalCompoment openPopup={openModal} setOpenPopup={setOpenModal} title="Informe Parada De Linea">
              <ModalParadasDeLinea setOpenModal={setOpenModal} paradasDeLinea={paradasDeLinea} />
              </ModalCompoment>
              */}
      </div>
    </ContainerForPages>
  );
};
