// DashboardMain.tsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { SelectOFPlant } from "app/shared/helpers/SelectOfPlant";
import SelectSeason from "app/shared/helpers/SelectSeason";
import DashboardService, {
  KPI,
  MonthRow,
  PlannedTypeRow,
  UnitDetailRow,
  ProducedDetailRow,
  SeasonRange
} from "app/features/gerencia/services/Dashboard.Service";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";

//SERVICE
const servicio = new DashboardService();

//MESES
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];
//ICONOS
const ICONS: Record<string, string> = {
  SPLIT: `${process.env.PUBLIC_URL}/images/split.png`,
  PORTABLE: `${process.env.PUBLIC_URL}/images/portable.png`,
  WINDOW: `${process.env.PUBLIC_URL}/images/window.png`,
  "LIGHT COMMERCIAL": `${process.env.PUBLIC_URL}/images/comercial.png`
};
//TAMAÑO ICONOS
const STYLE_BY_TYPE: Record<string, string> = {
  SPLIT: "w-20 h-11",
  PORTABLE: "w-9 h-14",
  WINDOW: "w-11 h-11",
  "LIGHT COMMERCIAL": "w-14 h-14"
};
//FRIGORIAS
const FRIGORIAS = [25, 32, 50, 60] as const;

//COLOR DONAS
const DONUT_COLORS = ["#B9D15C", "#31B1D6", "#EF787A"];

//RENDER DONA
const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center text-[10px] opacity-70">
        <span className="font-semibold uppercase">{title}</span>
        <span>Sin datos</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <span className="text-[9px] txt4 font-semibold">{title}</span>
      <PieChart width={180} height={110}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          stroke="#00000031"
          innerRadius={0}
          minAngle={9}
          outerRadius={25}
          labelLine={{ strokeWidth: 1, stroke: "currentColor" }}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            const RADIAN = Math.PI / 180;
            const radius = outerRadius * 1.9;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="currentColor"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize={11}>
                {`${(percent * 100).toFixed(1)}%`}
              </text>
            );
          }}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};
//METRICS
const METRICS: { label: string; key: MetricKey }[] = [
  { label: "Planificado", key: "planned" },
  { label: "Producido", key: "prod" },
  { label: "Remanente", key: "rem" },
  { label: "No conforme", key: "nc" }
];
//ROW METRICS
const METRIC_ROW_CLASS: Record<MetricKey, string> = {
  planned: "text-[#7A65F2]",
  prod: "text-[#B9D15C]",
  rem: "text-[#31B1D6]",
  nc: "text-[#EF787A]"
};

const getFieldName = (line: string, metric: MetricKeyb) => `${line}_${metric}`;
//_________________TYPES________________//

type MetricKeyb = "planned" | "produced" | "rejects" | "overProd";
type Panel = "planificado" | "producido" | null;
type MetricKey = "planned" | "prod" | "rem" | "nc";

type MetricTotals = {
  T: number;
  E: number;
  I: number;
};

type MetricBucket = {
  planned: MetricTotals;
  prod: MetricTotals;
  rem: MetricTotals;
  nc: MetricTotals;
};

type ProviderProdDetail = {
  proveedor: string;
  totals: MetricBucket; // totales por métrica (plan/prod/rem/nc) E/I
  byFrigoria: Record<number, MetricBucket>; // por frigoría
};

type DonutChartProps = {
  title: string;
  data: { name: string; value: number }[];
};

//___________________________COMPONENT______________________________//

export const DashboardMain = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [plantId, setPlantId] = useState<number | null>(null);
  const [season, setSeason] = useState<number | "">("");
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [monthly, setMonthly] = useState<MonthRow[]>([]);
  const [panel, setPanel] = useState<Panel>(null);
  const [seasonRange, setSeasonRange] = useState<SeasonRange | null>(null);

  const [view, setView] = useState<"general" | "planTypes" | "prodTypes">("general");
  const [plannedTypes, setPlannedTypes] = useState<PlannedTypeRow[]>([]);
  const [producedTypes, setProducedTypes] = useState<PlannedTypeRow[]>([]);
  const [unitDetails, setUnitDetails] = useState<UnitDetailRow[]>([]);
  const [producedDetail, setProducedDetail] = useState<ProducedDetailRow[]>([]);
  const [openType, setOpenType] = useState<string | null>(null); // solo cuál card está abierta
  const [activeLine, setActiveLine] = useState<string | null>(null);
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //TITULO DE MODULO
  useEffect(() => {
    TitleChanger("Dashboard");
  }, [TitleChanger]);

  useEffect(() => {
    if (!plantId || !season) {
      setSeasonRange(null);
      setOpenType(null);
      return;
    }

    const temporadaNum = typeof season === "string" ? parseInt(season, 10) : season;

    servicio
      .getSeasonRange(plantId, temporadaNum)
      .then(setSeasonRange)
      .catch(() => setSeasonRange(null));
  }, [plantId, season]);

  //RESET AL CARGAR
  const handlePlantChange = (id: number) => {
    setPlantId(id);
    setSeason("");
    setKpi(null);
    setMonthly([]);
    setPanel(null);
    setView("general");
    setPlannedTypes([]);
    setProducedTypes([]);
    setUnitDetails([]);
    setProducedDetail([]);
    setOpenType(null);
  };

  //CARGA DE KPI + GRÁFICO + TIPOS/DETALLE
  useEffect(() => {
    if (!plantId || !season) {
      setKpi(null);
      return;
    }

    let cancel = false;

    const loadKpi = async () => {
      try {
        const temporadaNum = typeof season === "string" ? parseInt(season, 10) : season;

        const resp = await servicio.getKpis(plantId, temporadaNum);
        if (!cancel) setKpi(resp);
      } catch (err) {
        console.error("Error loading KPI:", err);
        if (!cancel) setKpi(null);
      }
    };

    loadKpi();
    return () => {
      cancel = true;
    };
  }, [plantId, season]);
  //-------------------------------
  useEffect(() => {
    if (!plantId || !season) {
      setKpi(null);
      setMonthly([]);
      setPlannedTypes([]);
      setUnitDetails([]);
      setProducedTypes([]);
      setProducedDetail([]);
      setOpenType(null);
      return;
    }

    let cancel = false;

    const load = async () => {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      setIsLoading(true);
      try {
        const temporadaNum = typeof season === "string" ? parseInt(season, 10) : season;

        if (view === "general") {
          const [kpiResp, monthlyResp] = await Promise.all([
            servicio.getKpis(plantId, temporadaNum),
            servicio.getMonthly(plantId, temporadaNum)
          ]);
          if (cancel) return;

          setKpi(kpiResp);
          setMonthly(monthlyResp);
          return;
        }

        if (view === "planTypes") {
          // SE DEBEN CARGAR TIPO Y DETALLE
          const [types, detail] = await Promise.all([
            servicio.getPlannedByType(plantId, temporadaNum),
            servicio.getPlannedUnitsDetail(plantId, temporadaNum)
          ]);
          if (cancel) return;

          setPlannedTypes(types);
          setUnitDetails(detail);
          setOpenType(null);
          return;
        }

        if (view === "prodTypes") {
          // SE DEBEN CARGAR TIPO Y DETALLE
          const [types, detail] = await Promise.all([
            servicio.getProducedByType(plantId, temporadaNum),
            servicio.getProducedDetail(plantId, temporadaNum)
          ]);
          if (cancel) return;

          const normalized = types.map((r) => ({
            tipo: String(r.tipo ?? "")
              .trim()
              .toUpperCase(),
            cantidad: Number(r.cantidad ?? 0)
          }));

          setProducedTypes(normalized);
          setProducedDetail(detail);
          setOpenType(null);
          return;
        }
      } finally {
        if (!cancel) dispatch(LoadingUISlice.actions.LoadingUIClose());
        setIsLoading(false);
      }
    };

    load();
    return () => {
      cancel = true;
    };
  }, [plantId, season, view]);

  //LINE NAMES
  const lineNames = useMemo(() => {
    const set = new Set<string>();
    for (const m of monthly) {
      const linea = (m.linea || "").trim();
      if (linea) set.add(linea);
    }
    return Array.from(set);
  }, [monthly]);

  const chartData = useMemo(() => {
    console.log(monthly.filter((m) => m.year === 2025 && m.month === 6 && m.linea?.trim() === "EPA"));

    const map = new Map<string, any>();

    for (const m of monthly) {
      const monthNum = Number(m.month ?? 0);
      if (!monthNum || monthNum < 1 || monthNum > 12) continue;

      const key = `${m.year}-${monthNum}`;
      const name = MONTH_NAMES[monthNum - 1] ?? `Mes ${monthNum}`;

      let row = map.get(key);
      if (!row) {
        row = { key, name, year: m.year, month: monthNum };
        map.set(key, row);
      }

      const line = (m.linea || "").trim() || "SIN_LINEA";

      const planned = Number(m.planned ?? 0);
      const producedTotal = Number(m.produced ?? 0);
      const rejects = Number(m.rejects ?? 0);

      const fPlanned = getFieldName(line, "planned");
      const fProduced = getFieldName(line, "produced");
      const fRejects = getFieldName(line, "rejects");

      row[fPlanned] = planned;
      row[fProduced] = producedTotal;
      row[fRejects] = rejects;
    }

    const result = Array.from(map.values());

    for (const row of result) {
      for (const line of lineNames) {
        const fPlanned = getFieldName(line, "planned");
        const fProduced = getFieldName(line, "produced");
        const fOver = getFieldName(line, "overProd");

        const planned = Number(row[fPlanned] ?? 0);
        const producedTotal = Number(row[fProduced] ?? 0);

        const baseProduced = Math.min(producedTotal, planned);
        const over = Math.max(producedTotal - planned, 0);

        row[fProduced] = baseProduced;
        row[fOver] = over;
      }
    }

    // ordenar por año/mes
    return result.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [monthly, lineNames]);

  const formatCell = (val: number) => (val ? val.toLocaleString("es-AR") : "-");

  //TOOLTIP CUSTOM
  const CustomTooltip = ({ active, payload, label, activeLine }: any) => {
    if (!active || !payload || !payload.length || !activeLine) return null;

    const row = payload[0].payload;

    const planned = Number(row[getFieldName(activeLine, "planned")] ?? 0);
    const producedBase = Number(row[getFieldName(activeLine, "produced")] ?? 0);
    const rejects = Number(row[getFieldName(activeLine, "rejects")] ?? 0);
    const overProd = Number(row[getFieldName(activeLine, "overProd")] ?? 0);

    const producedTotal = producedBase + overProd;
    const resultPct = planned > 0 ? (producedTotal / planned) * 100 : 0;

    return (
      <div className="bg-slate-900/95 text-white text-xs px-3 py-2 rounded shadow-lg border border-slate-700">
        <div className="font-semibold mb-1">{label}</div>
        <div className="font-semibold mb-1">{activeLine}</div>
        <div>Planificado: {planned.toLocaleString("es-AR")}</div>
        <div>Producido: {producedTotal.toLocaleString("es-AR")}</div>
        <div>Sobreproducción: {overProd.toLocaleString("es-AR")}</div>
        <div>Rechazos: {rejects.toLocaleString("es-AR")}</div>
        <div>Resultado: {resultPct.toFixed(1)}%</div>
      </div>
    );
  };

  //EXPORTAR EXCEL
  const handleExportExcel = () => {
    if (!monthly.length) return;

    const rows = monthly.map((m) => {
      const monthNum = Number(m.month ?? 0);
      const name = MONTH_NAMES[monthNum - 1] ?? `Mes ${m.month || "?"}`;

      const planned = Number(m.planned ?? 0);
      const produced = Number(m.produced ?? 0);
      const rejects = Number(m.rejects ?? 0);
      const overProd = Math.max(produced - planned, 0);
      const resultPercent = planned > 0 ? (produced / planned) * 100 : 0;

      return {
        Año: m.year,
        Mes: name,
        Línea: m.linea,
        Planificado: planned,
        Producido: produced,
        Rechazos: rejects,
        Sobreproducción: overProd,
        Resultado: `${resultPercent.toFixed(1)}%`
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DatosGenerales");
    XLSX.writeFile(wb, `Dashboard_DatosGenerales_${season || "TEMPORADA"}.xlsx`);
  };

  //HELPER: tipos + detalle unidades (planificado)
  const fetchPlannedTypesAndDetail = async (pid: number, temporadaNum: number) => {
    const [rows, detailRows] = await Promise.all([
      servicio.getPlannedByType(pid, temporadaNum),
      servicio.getPlannedUnitsDetail(pid, temporadaNum)
    ]);
    setPlannedTypes(rows);
    setUnitDetails(detailRows);
    setOpenType(null);
  };

  //OPEN PLANIFICADO
  const handleOpenPlanTypes = async () => {
    if (!plantId || !season) return;

    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      setIsLoading(true);
      const temporada = typeof season === "string" ? parseInt(season, 10) : season;

      await fetchPlannedTypesAndDetail(plantId, temporada);
      setView("planTypes");
    } catch (e: any) {
      openNotificationUI(e?.message ?? "Error obteniendo planificación por tipo", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      setIsLoading(false);
    }
  };

  //OPEN PRODUCIDO
  const handleOpenProducedTypes = async () => {
    if (!plantId || !season) return;

    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      setIsLoading(true);
      const temporada = typeof season === "string" ? parseInt(season, 10) : season;
      const [rows, detailRows] = await Promise.all([
        servicio.getProducedByType(plantId, temporada),
        servicio.getProducedDetail(plantId, temporada)
      ]);

      // NORMALIZACIÓN CRÍTICA
      const normalized = rows.map((r) => ({
        tipo: String(r.tipo ?? "")
          .trim()
          .toUpperCase(),
        cantidad: Number(r.cantidad ?? 0)
      }));

      setProducedTypes(normalized);
      setProducedDetail(detailRows);
      setView("prodTypes");
      setOpenType(null);
    } catch (e: any) {
      openNotificationUI(e?.message ?? "Error obteniendo datos de producción por tipo", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      setIsLoading(false);
    }
  };

  // DETALLES DE PROVEEDOR POR TIPO (PLANIFICADO)
  const getProviderDetailsForType = (tipo: string) => {
    if (!unitDetails || unitDetails.length === 0) return [];

    const rows = unitDetails.filter((r) => r.tipo === tipo);
    if (rows.length === 0) return [];

    const providers: any[] = [];

    rows.forEach((row) => {
      const existing = providers.find((p) => p.proveedor === row.proveedor);

      if (!existing) {
        providers.push({
          proveedor: row.proveedor,
          total: row.planReal,
          byFrigoria: {
            25: row.frigoria === 25 ? row.planReal : 0,
            32: row.frigoria === 32 ? row.planReal : 0,
            50: row.frigoria === 50 ? row.planReal : 0,
            60: row.frigoria === 60 ? row.planReal : 0
          }
        });
      } else {
        existing.total += row.planReal;
        if (row.frigoria in existing.byFrigoria) {
          existing.byFrigoria[row.frigoria] += row.planReal;
        }
      }
    });

    return providers;
  };

  // DETALLE PRODUCIDO por proveedor para el tipo seleccionado (render tipo SPLIT)
  const producedProviderDetails: ProviderProdDetail[] = useMemo(() => {
    if (!openType) return [];

    const rows = producedDetail.filter((r) => r.tipo === openType);

    const map = new Map<string, ProviderProdDetail>();

    const emptyTotals = (): MetricTotals => ({ E: 0, I: 0, T: 0 });

    const emptyBucket = (): MetricBucket => ({
      planned: emptyTotals(),
      prod: emptyTotals(),
      rem: emptyTotals(),
      nc: emptyTotals()
    });

    const ensureProvider = (name: string): ProviderProdDetail => {
      const key = name || "SIN PROVEEDOR";
      let prov = map.get(key);
      if (!prov) {
        prov = {
          proveedor: key,
          totals: emptyBucket(),
          byFrigoria: {}
        };
        map.set(key, prov);
      }
      return prov;
    };

    const ensureFrigBucket = (prov: ProviderProdDetail, frig: number): MetricBucket | null => {
      if (!FRIGORIAS.includes(frig as (typeof FRIGORIAS)[number])) return null;
      let bucket = prov.byFrigoria[frig];
      if (!bucket) {
        bucket = emptyBucket();
        prov.byFrigoria[frig] = bucket;
      }
      return bucket;
    };

    for (const row of rows) {
      const prov = ensureProvider(row.proveedor);
      const frigBucket = ensureFrigBucket(prov, row.frigoria);

      const pExt = row.planificadoExterior ?? 0;
      const pInt = row.planificadoInterior ?? 0;
      const prExt = row.producidoExterior ?? 0;
      const prInt = row.producidoInterior ?? 0;
      const rExt = row.remanenteExterior ?? 0;
      const rInt = row.remanenteInterior ?? 0;
      const ncT = row.noConforme ?? 0;
      const ncE = row.noConformeExterior ?? 0;
      const ncI = row.noConformeInterior ?? 0;

      //TOTALES
      prov.totals.planned.E += pExt;
      prov.totals.planned.I += pInt;
      prov.totals.prod.E += prExt;
      prov.totals.prod.I += prInt;
      prov.totals.rem.E += rExt;
      prov.totals.rem.I += rInt;
      prov.totals.nc.T += ncT;
      prov.totals.nc.E += ncE;
      prov.totals.nc.I += ncI;

      if (frigBucket) {
        frigBucket.planned.E += pExt;
        frigBucket.planned.I += pInt;
        frigBucket.prod.E += prExt;
        frigBucket.prod.I += prInt;
        frigBucket.rem.E += rExt;
        frigBucket.rem.I += rInt;
        frigBucket.nc.T += ncT;
        frigBucket.nc.E += ncE;
        frigBucket.nc.I += ncI;
      }
    }
    for (const prov of map.values()) {
      // Totales (solo faltante, nunca negativo)
      prov.totals.rem.E = Math.max(prov.totals.planned.E - prov.totals.prod.E, 0);
      prov.totals.rem.I = Math.max(prov.totals.planned.I - prov.totals.prod.I, 0);

      // Por frigoría
      for (const f of FRIGORIAS) {
        const bucket = prov.byFrigoria[f];
        if (!bucket) continue;

        bucket.rem.E = Math.max(bucket.planned.E - bucket.prod.E, 0);
        bucket.rem.I = Math.max(bucket.planned.I - bucket.prod.I, 0);
      }
    }
    return Array.from(map.values());
  }, [producedDetail, openType]);

  const getMetricValue = (
    prov: ProviderProdDetail,
    metric: MetricKey,
    column: "totals" | number,
    side: "T" | "E" | "I"
  ): number => {
    if (column === "totals") return prov.totals[metric][side];
    const bucket = prov.byFrigoria[column];
    if (!bucket) return 0;
    return bucket[metric][side];
  };

  //______________RENDER_______________//
  return (
    <div className="w-full h-full flex flex-col gap-6 p-5">
      <div className="flex flex-wrap justify-end gap-[100px]">
        <div
          className="w-[250px]  
                    [&_.bg-secondaryNew]:!bg-[var(--color-secondary)]
                    [&_.container]:!text-left">
          <SelectOFPlant setPlantId={handlePlantChange} />
        </div>
        <div
          className="w-[250px]  
                    [&_.bg-secondaryNew]:!bg-[var(--color-secondary)]
                    [&_.container]:!text-left">
          <SelectSeason plantId={plantId ?? 0} value={season} onChange={setSeason} notShadow />
        </div>
      </div>
      {/* VISTA GENERAL: KPI */}
      {view === "general" && (
        <div className="flex flex-wrap justify-center items-center gap-10 my-4">
          {/* PLANIFICADO */}
          <button
            onClick={handleOpenPlanTypes}
            className={`w-64 h-64 flex flex-col txt justify-center items-center rounded shadow-Box dashboard-kpi-btn`}>
            <img src={`${process.env.PUBLIC_URL}/images/worker.png`} alt="worker icon" className="w-20 h-20" />
            <p className="text-2xl font-extrabold">
              {kpi ? kpi.planned.toLocaleString("es-AR") : "-"}
              <span className="text-sm font-normal ml-1">unidades</span>
            </p>
            <p className="font-bold text-xs mt-5">PLANIFICADO</p>
          </button>

          {/* PRODUCIDO */}
          <button
            onClick={handleOpenProducedTypes}
            className={`w-64 h-64 flex flex-col txt justify-center items-center rounded shadow-Box dashboard-kpi-btn`}>
            <img src={`${process.env.PUBLIC_URL}/images/conveyor.png`} alt="worker icon" className="w-20 h-20" />
            <p className="text-2xl font-extrabold">
              {kpi ? kpi.produced.toLocaleString("es-AR") : "-"}
              <span className="text-sm font-normal ml-1">unidades</span>
            </p>
            <p className="font-bold text-xs mt-5">PRODUCIDO</p>
          </button>
        </div>
      )}
      {/* VISTA GENERAL: GRÁFICO MENSUAL */}
      {view === "general" && (
        <div className="rounded-lg graf-color shadow-Box mb-10 ml-10 mr-10 mt-1">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#474760]">
            <div className="text-sm font-semibold">Datos generales</div>
            {/*Legend custom */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: "#A2D911" }}></span>
                <span>Producción</span>
              </div>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: "#EF787A" }}></span>
                <span>Rechazos</span>
              </div>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-full" style={{ background: "#31B1D6" }}></span>
                <span>Sobreproducción</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="px-3 w-32 h-9 font-bold text-[#3F3D56] rounded bg-[#61D864] text-sm hover:bg-[#73ea77ff] shadow-2xl">
                Exportar
              </button>
            </div>
          </div>

          <div className="h-[360px] px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 8 }} barSize={15} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: "#18181812" }}
                  content={(props) => <CustomTooltip {...props} activeLine={activeLine} />}
                />

                {lineNames.map((line) => (
                  <React.Fragment key={line}>
                    {/* Producido */}
                    <Bar
                      dataKey={getFieldName(line, "produced")}
                      stackId={line}
                      fill="#B9D15C"
                      onMouseMove={() => setActiveLine(line)}
                      onMouseLeave={() => setActiveLine(null)}
                    />
                    {/* Rechazos */}
                    <Bar
                      dataKey={getFieldName(line, "rejects")}
                      stackId={line}
                      fill="#EF787A"
                      onMouseMove={() => setActiveLine(line)}
                      onMouseLeave={() => setActiveLine(null)}
                    />
                    {/* Sobreproducción */}
                    <Bar
                      dataKey={getFieldName(line, "overProd")}
                      stackId={line}
                      fill="#31B1D6"
                      onMouseMove={() => setActiveLine(line)}
                      onMouseLeave={() => setActiveLine(null)}
                    />
                  </React.Fragment>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* VISTA PLANIFICADO POR TIPO */}
      {view === "planTypes" && (
        <div className="ml-10 px-2 py-2">
          {/* BARRA DE TEMPORADA */}
          <div className="w-full flex justify-center mb-5">
            <div className="w-full rounded px-6 py-2 bg-gradient-to-r from-[#253B90] via-[#001947] to-[#253B90] text-center">
              <span className=" uppercase text-[#FFF] text-sm">
                {seasonRange && seasonRange.fechaInicio && seasonRange.fechaFin
                  ? `TEMPORADA ${seasonRange.temporada} (${new Date(seasonRange.fechaInicio).toLocaleDateString(
                      "es-AR"
                    )} AL ${new Date(seasonRange.fechaFin).toLocaleDateString("es-AR")})`
                  : season
                  ? `TEMPORADA ${season}`
                  : "TEMPORADA"}
              </span>
            </div>
          </div>

          {/* CARD PRINCIPAL PLANIFICADO */}
          <div className="w-full flex justify-center mb-8">
            <div className="w-full max-w-3xl h-60 rounded dashboard-kpi-btn shadow-2xl px-[150px] py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={`${process.env.PUBLIC_URL}/images/worker.png`} alt="worker icon" className="w-32 h-32" />
              </div>
              <div className="text-center txt">
                <span className="text-lg mb-10 font-normal uppercase ">Planificado</span>
                <div className="flex gap-2 text-lg font-bold">
                  {kpi ? kpi.planned.toLocaleString("es-AR") : "-"}
                  <div className="text-sm mt-1 font-bold">unidades</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mb-6">
            <button
              onClick={() => {
                setView("general");
                setOpenType(null);
              }}
              className="px-3 py-1.5 w-32 h-9 font-bold rounded dashboard-kpi-btn text-sm txt shadow-2xl">
              Volver
            </button>
          </div>

          {/* LÍNEA DIVISORIA */}
          <div className="border-t border-slate-700/50 mb-8 mx-4" />

          {/* EXTENSIÓN DE CARD */}
          <div className="flex flex-wrap justify-center gap-[47px]">
            {["SPLIT", "PORTABLE", "WINDOW", "LIGHT COMMERCIAL"].map((tipo) => {
              const row = plannedTypes.find((r) => r.tipo === tipo);
              const cantidad = row?.cantidad ?? 0;
              const isActive = openType === tipo;

              // detalle solo si esta card está abierta
              const providers = isActive ? getProviderDetailsForType(tipo) : [];

              return (
                <div key={tipo} className="w-full md:w-1/5">
                  <div
                    ref={isActive ? activeCardRef : undefined}
                    onClick={() => setOpenType((prev) => (prev === tipo ? null : tipo))}
                    className="cursor-pointer rounded-lg w-64 min-h-32 dashboard-kpi-btn px-6 py-4 shadow-2xl flex flex-col items-stretch transition">
                    {/* CABECERA */}
                    <div className="flex flex-col txt gap-3">
                      <div className="flex items-center justify-center w-full">
                        <span className="text-sm underline font-bold uppercase">{tipo}</span>
                      </div>
                      <div
                        className={cantidad > 0 ? "flex flex-row justify-between" : "flex items-center justify-center"}>
                        <img src={ICONS[tipo]} alt={tipo} className={STYLE_BY_TYPE[tipo]} />

                        {cantidad > 0 && (
                          <span className="text-xl underline mt-4 font-bold">{cantidad.toLocaleString("es-AR")}</span>
                        )}
                      </div>
                    </div>

                    {/* DETALLE QUE “EXTIENDE” LA CARD */}
                    {isActive && (
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          isActive ? "max-h-[1000px] mt-3 pt-3" : "max-h-0"
                        }`}>
                        {providers.length === 0 && (
                          <div className="text-[10px] text-center">Sin datos para este tipo.</div>
                        )}

                        {providers.map((prov, idx) => {
                          const name = prov.proveedor;

                          return (
                            <div key={name} className={idx === 0 ? "" : "mt-3 pt-3"}>
                              {/* línea 1: nombre + total */}
                              <div className="flex txt1 items-center justify-between text-xs font-bold border-b border-slate-400">
                                <span className="uppercase">{name}</span>
                                <span>{prov.total.toLocaleString("es-AR")}</span>
                              </div>
                              <span className="text-[9px] pt-0 mt-0 pb-3 txt1 text-left">Frigoria</span>
                              {/* línea 2: títulos de frigoría */}
                              <div className="flex txt2 justify-between text-xs">
                                {FRIGORIAS.map((f) => (
                                  <span key={f} className="w-1/4 text-center">
                                    {f}
                                  </span>
                                ))}
                              </div>

                              {/* línea 3: valores por frigoría */}
                              <div className="flex txt1 justify-between font-bold text-[10px]">
                                {FRIGORIAS.map((f) => {
                                  const val = prov.byFrigoria[f] ?? 0;
                                  return (
                                    <span key={f} className="w-1/4 text-center">
                                      {val.toLocaleString("es-AR")}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* VISTA PRODUCIDO POR TIPO + DETALLE (SPLIT, PORTABLE, etc.) */}
      {view === "prodTypes" && (
        <div className="w-full px-2 py-2">
          {/* CONTENEDOR CENTRAL COMPARTIDO CARDS + DETALLE */}
          <div className="w-full max-w-6xl mx-auto">
            {/* BARRA DE TEMPORADA */}
            <div className="w-full flex justify-center mb-5">
              <div className="w-full rounded px-6 py-2 bg-gradient-to-r from-[#253B90] via-[#001947] to-[#253B90] text-center">
                <span className="uppercase text-[#FFF] text-sm">
                  {seasonRange && seasonRange.fechaInicio && seasonRange.fechaFin
                    ? `TEMPORADA ${seasonRange.temporada} (${new Date(seasonRange.fechaInicio).toLocaleDateString(
                        "es-AR"
                      )} AL ${new Date(seasonRange.fechaFin).toLocaleDateString("es-AR")})`
                    : season
                    ? `TEMPORADA ${season}`
                    : "TEMPORADA"}
                </span>
              </div>
            </div>

            {/* CARD PRINCIPAL PRODUCIDO */}
            <div className="w-full flex justify-center mb-8">
              <div className="w-full max-w-3xl h-60 rounded dashboard-kpi-btn shadow-2xl px-[150px] py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/conveyor.png`}
                    alt="conveyor icon"
                    className="w-32 h-32"
                  />
                </div>
                <div className="text-center txt">
                  <span className="text-lg mb-10 font-normal uppercase">Producido</span>
                  <div className="flex gap-2 text-lg font-bold">
                    {kpi ? kpi.produced.toLocaleString("es-AR") : "-"}
                    <div className="text-sm mt-1 font-bold">unidades</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN VOLVER */}
            <div className="flex items-center justify-end mb-6">
              <button
                onClick={() => {
                  setView("general");
                  setOpenType(null);
                }}
                className="px-3 py-1.5 w-32 h-9 font-bold rounded dashboard-kpi-btn text-sm txt shadow-2xl">
                Volver
              </button>
            </div>

            {/* LÍNEA DIVISORIA */}
            <div className="border-t border-slate-700/50 mb-8 mx-4" />

            {/* CARDS POR TIPO */}
            <div className="flex flex-wrap justify-center gap-[74px] mr-10 mb-0">
              {["SPLIT", "PORTABLE", "WINDOW", "LIGHT COMMERCIAL"].map((tipo) => {
                const row = producedTypes.find((r) => r.tipo === tipo);
                const cantidad = row?.cantidad ?? 0;
                const isActive = openType === tipo;

                return (
                  <div key={tipo} className="w-full md:w-1/5">
                    <div
                      onClick={() => setOpenType((prev) => (prev === tipo ? null : tipo))}
                      className={`cursor-pointer w-64 min-h-32 rounded-lg dashboard-kpi-btn px-6 py-4 shadow-2xl flex flex-col items-stretch transition ${
                        isActive ? "min-h-[170px]" : ""
                      }`}>
                      <div className="flex flex-col txt gap-3">
                        <div className="flex items-center justify-center w-full">
                          <span className="text-sm underline font-bold uppercase">{tipo}</span>
                        </div>
                        <div
                          className={
                            cantidad > 0 ? "flex flex-row justify-between" : "flex items-center justify-center"
                          }>
                          <img src={ICONS[tipo]} alt={tipo} className={STYLE_BY_TYPE[tipo]} />

                          {cantidad > 0 && (
                            <span className="text-xl underline mt-4 font-bold">{cantidad.toLocaleString("es-AR")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CARD GRANDE DE DETALLE */}
            {openType && (
              <div className="flex justify-center mb-10">
                <div className="w-full -mt-3 rounded-2xl rounded-t-none graf-color txt shadow-2xl px-6 py-5">
                  {producedProviderDetails.length === 0 && (
                    <div className="text-sm opacity-70">Sin detalles de producción para este tipo.</div>
                  )}

                  {producedProviderDetails.map((prov, idx) => {
                    // === CÁLCULOS DE TOTALES, REMANENTE, ETC. ===
                    const totalProdE = prov.totals.prod.E;
                    const totalProdI = prov.totals.prod.I;

                    const totalPlanE = prov.totals.planned.E;
                    const totalPlanI = prov.totals.planned.I;

                    const isSimple = openType === "PORTABLE" || openType === "WINDOW";

                    const totalProduccion = isSimple ? totalProdE + totalProdI : Math.min(totalProdE, totalProdI);

                    const totalPlanReal = isSimple ? totalPlanE + totalPlanI : Math.min(totalPlanE, totalPlanI);

                    const remanenteReal = Math.max(totalPlanReal - totalProduccion, 0);

                    const remI = Math.max(totalPlanI - totalProdI, 0);
                    const remE = Math.max(totalPlanE - totalProdE, 0);

                    const interiorDonutData = [
                      { name: "Producido", value: totalProdI },
                      { name: "Remanente", value: remI },
                      { name: "No conforme", value: prov.totals.nc.I }
                    ].filter((d) => d.value > 0);

                    const exteriorDonutData = [
                      { name: "Producido", value: totalProdE },
                      { name: "Remanente", value: remE },
                      { name: "No conforme", value: prov.totals.nc.E }
                    ].filter((d) => d.value > 0);

                    const simpleDonutData = [
                      { name: "Producido", value: totalProduccion },
                      { name: "Remanente", value: remanenteReal },
                      { name: "No conforme", value: prov.totals.nc.T }
                    ].filter((d) => d.value > 0);

                    return (
                      <div
                        key={prov.proveedor}
                        className={`flex flex-col lg:flex-row gap-6 ${
                          idx > 0 ? "mt-6 pt-6 border-t border-slate-600" : ""
                        }`}>
                        {/* IZQUIERDA: PROVEEDOR + TOTAL PRODUCIDOS */}
                        <div className="flex flex-col justify-center min-w-[160px] text-center">
                          <div className="text-lg txt4 font-extrabold uppercase">{prov.proveedor}</div>
                          <div className="mt-2">
                            <div className="text-lg txt4 font-bold">{totalProduccion.toLocaleString("es-AR")}</div>
                            <div className="text-xs txt italic">Producidos</div>
                          </div>
                        </div>

                        {/* CENTRO: TABLA */}
                        <div className="flex-1">
                          <div className="w-full">
                            {/* TABLA SIMPLE (PORTABLE / WINDOW) */}
                            {isSimple ? (
                              <>
                                <table className="w-full text-xs border-spacing-y-[2px]">
                                  <thead>
                                    <tr>
                                      <th className="text-left pb-1 italic txt4 text-xs font-normal">Frigorías</th>

                                      {/* Totales (ocupa 2 columnas) */}
                                      <th
                                        colSpan={2}
                                        className="pb-1 pl-2 text-center text-lg txt4 font-semibold border-r border-slate-600">
                                        Totales
                                      </th>

                                      {/* Columnas por frigoría (cada una ocupa 2 columnas) */}
                                      {FRIGORIAS.map((f) => (
                                        <th
                                          key={f}
                                          colSpan={2}
                                          className="pb-1 text-center text-lg txt4 font-extrabold min-w-[60px]">
                                          {f}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {METRICS.map((m) => (
                                      <tr
                                        key={m.key}
                                        className={`${METRIC_ROW_CLASS[m.key] || ""} border-t border-slate-600`}>
                                        {/* Nombre de la métrica */}
                                        <td className="pr-2 py-2 font-semibold">{m.label}</td>

                                        {/* ====== TOTALES (2 columnas reales) ====== */}

                                        {/* Columna 1: valor combinado E+I */}
                                        <td className="text-center pr-1 font-semibold">
                                          {formatCell(
                                            m.key === "nc"
                                              ? getMetricValue(prov, "nc", "totals", "T")
                                              : getMetricValue(prov, m.key, "totals", "E") +
                                                  getMetricValue(prov, m.key, "totals", "I")
                                          )}
                                        </td>

                                        <td className="border-r border-slate-600 w-[4px] p-0 m-0" />

                                        {/* ====== FRIGORÍAS (cada una = 2 columnas) ====== */}
                                        {FRIGORIAS.map((f) => {
                                          const valor =
                                            m.key === "nc"
                                              ? getMetricValue(prov, "nc", f, "T")
                                              : getMetricValue(prov, m.key, f, "E") +
                                                getMetricValue(prov, m.key, f, "I");

                                          return (
                                            <React.Fragment key={f}>
                                              {/* Columna 1: valor combinado E+I */}
                                              <td className="text-center font-semibold px-1 min-w-[62px]">
                                                {valor ? valor.toLocaleString("es-AR") : "-"}
                                              </td>

                                              {/* Columna 2: fantasma para respetar el colSpan */}
                                              <td className="w-[4px] p-0 m-0" />
                                            </React.Fragment>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </>
                            ) : (
                              /* TABLA COMPLETA (SPLIT / LC) */
                              <table className="w-full text-xs table-fixed border-spacing-y-[2px]">
                                <table className="w-full text-xs mb-1 border-b border-slate-600 ">
                                  <thead>
                                    <tr>
                                      <th className=" text-left pb-1 italic txt4 text-xs font-normal ">Frigorías</th>
                                      <th
                                        colSpan={2}
                                        className="pb-1 border-r border-slate-600 text-center text-lg txt4 font-semibold min-w-[60px]">
                                        Totales
                                      </th>
                                      {FRIGORIAS.map((f) => (
                                        <th
                                          key={f}
                                          colSpan={2}
                                          className="pb-1 text-center text-lg txt4 font-semibold min-w-[60px]">
                                          {f}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                </table>

                                <table className="w-full text-xs border-spacing-y-[2px]">
                                  <thead>
                                    <tr>
                                      <th className="text-left pb-1"></th>

                                      {/* Totales E / I */}
                                      <th className="text-center pb-1 w-[61px]">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full graf-color2 txt text-sm mx-auto">
                                          E
                                        </div>
                                      </th>
                                      <th className="text-center pb-1 w-[61px]">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full graf-color2 txt text-sm mx-auto">
                                          I
                                        </div>
                                      </th>

                                      {/* Frigorías: E / I */}
                                      {FRIGORIAS.map((f) => (
                                        <React.Fragment key={f}>
                                          <th className="text-center pb-1 w-[61px]">
                                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full graf-color2 txt text-sm mx-auto">
                                              E
                                            </div>
                                          </th>
                                          <th className="text-center pb-1 w-[61px]">
                                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full graf-color2 txt text-sm mx-auto">
                                              I
                                            </div>
                                          </th>
                                        </React.Fragment>
                                      ))}
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {METRICS.map((m) => (
                                      <tr
                                        key={m.key}
                                        className={`${METRIC_ROW_CLASS[m.key] || ""} border-t border-slate-600`}>
                                        <td className="pr-2 py-1 font-semibold">{m.label}</td>

                                        {/* Totales E / I */}
                                        <td className="text-center pr-1 py-1 min-w-[61px] font-semibold">
                                          {formatCell(getMetricValue(prov, m.key, "totals", "E"))}
                                        </td>
                                        <td className="text-center border-r border-slate-600 pr-1 py-2 min-w-[40px] font-semibold">
                                          {formatCell(getMetricValue(prov, m.key, "totals", "I"))}
                                        </td>

                                        {/* Por frigoría: E / I */}
                                        {FRIGORIAS.map((f) => (
                                          <React.Fragment key={f}>
                                            <td className="text-center pr-1 py-1 min-w-[40px] font-semibold">
                                              {formatCell(getMetricValue(prov, m.key, f, "E"))}
                                            </td>
                                            <td className="text-center pr-1 py-1 min-w-[40px] font-semibold">
                                              {formatCell(getMetricValue(prov, m.key, f, "I"))}
                                            </td>
                                          </React.Fragment>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </table>
                            )}
                          </div>
                        </div>

                        {/* DERECHA: DONAS */}
                        <div className="flex flex-col items-center justify-center border-l border-slate-600 min-w-[180px]">
                          {isSimple ? (
                            <DonutChart title="Equipos" data={simpleDonutData} />
                          ) : (
                            <>
                              <DonutChart title="Equipos Interior" data={interiorDonutData} />
                              <DonutChart title="Equipos Exterior" data={exteriorDonutData} />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-[#000000cc] z-[9999] flex items-center justify-center pointer-events-auto"></div>
      )}
      <style>{`

/*________________LIGHT_______________*/

/*KPI*/
.dashboard-kpi-btn {
background-color: #BEE3FF;
color: #001134;
}
.txt{color: #3F3D56}
.txt1{color: #3F3D56}
.txt2{color: #5962D3}
.txt4{color: #474760}

/*GRAFICO*/
.graf-color{
background-color: #ffffffff;
color: #3F3D56;
}
.graf-color2{
background-color: #BEE3FF;
color: ##474760;
}

/*CARDS*/
.dashboard-unit-btn {
background-color: #BEE3FF;
color: #001134;
}

/*________________DARK_______________*/

/*KPI*/
.dark .dashboard-kpi-btn {
background-color: #001947;
color: #BEE3FF;
}
.dark .txt {color: #FFF}
.dark .txt1 {color: #FFF}
.dark .txt2 {color: #5962D3}
.dark .txt4 {color: #BEE3FF}

/*GRAFICO*/
.dark .graf-color{
background-color: #001947;
color: #FFFFFF;
}

.dark .graf-color2{
background-color: #001134;
color: #FFFFFF;
}

/*CARDS*/
.dark .dashboard-unit-btn {
background-color: #001947;
color: var(--text-color);
}
            `}</style>
    </div>
  );
};

export default DashboardMain;
