import React, { useEffect, useMemo, useState, useRef } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { SelectOFPlant } from "app/shared/helpers/SelectOfPlant";
import { SelectOFLineasP6 } from "app/shared/helpers/SelectOFLineasP6";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField, Button } from "@mui/material";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Line,
  ReferenceLine,
  Cell,
  LabelList
} from "recharts";
import { ReporteCalidadService } from "app/services/reporteCalidad.service";

//_______TYPES______//
type RowCalidad = {
  dayLabel: string;
  ymd: string;
  produced: number;
  fpy: number;
  targetFpy: number;
};

type RowTopRechazo = {
  motivo: string;
  cantidad: number;
};

//_______HELPERS_______//
const pad2 = (n: number) => String(n).padStart(2, "0");
const dateToYMD = (d: Date | null) => {
  if (!d) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
// const clampPct = (n: number) => Math.max(0, Math.min(100, n));
const formatInt = (n: number) => n.toLocaleString("es-AR");
const formatPct = (n: number) => `${n.toFixed(1)}%`;

//_______MAPEO_______//
const LINE_TO_CODIGO_NEWSAN2: Record<number, number> = {
  1: 200,
  2: 300,
  4: 400,
  5: 100,
  6: 20,
  8: 600,
  9: 700,
  10: 800,
  11: 900,
  12: 80,
  18: 1100,
  19: 1001,
  20: 1002,
  29: 2003,
  30: 1011,
  47: 2100,
  49: 2200,
  50: 2300,
  52: 9000,
  57: 6000,
  75: 7000,
  77: 8500,
  78: 7700,
  82: 9005
};

const LINE_ID_TO_LABEL: Record<number, string> = {
  1: "INTERIOR HR",
  2: "EXTERIOR LR",
  4: "INTERIOR LR",
  5: "EXTERIOR HR",
  6: "PORTABLES",
  8: "INTERIOR LC PA",
  9: "EXTERIOR LC PA",
  10: "WINDOW",
  11: "IM LINEA 1",
  12: "IM LINEA 2",
  18: "DISPLAY PB",
  19: "CE IPB",
  20: "CE IPA",
  29: "CE EPA",
  30: "DISPLAY PA",
  47: "IM PLACA CONTROL",
  49: "IM DISPLAY",
  50: "IM IR PORTABLE",
  52: "IM SUB",
  57: "IM DISPLAY 2",
  75: "CE RENACER EPA",
  77: "CE EPB",
  78: "IM RENACER",
  82: "AUTOMOTRIZ"
};

//__________COMPONENT___________//
export const ReporteCalidad = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [plantId, setPlantId] = useState<number>(0);
  const [lineId, setLineId] = useState<number>(0);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [topRechazos, setTopRechazos] = useState<RowTopRechazo[]>([]);
  const [rows, setRows] = useState<RowCalidad[]>([]);
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetFpy, setTargetFpy] = useState<number>(0);
  const [appFrom, SetAppFrom] = useState<Date | null>(null);
  const [appTo, SetAppTo] = useState<Date | null>(null);

  const serviceRef = useRef<ReporteCalidadService>(new ReporteCalidadService());
  const chartWrapRef = useRef<HTMLDivElement | null>(null);
  const codigoNewsan2 = LINE_TO_CODIGO_NEWSAN2[lineId];

  //____TITULO____//
  useEffect(() => {
    TitleChanger("Reporte Calidad");
  }, [TitleChanger]);

  //______KPIs______//
  const kpiProduced = useMemo(() => rows.reduce((a, r) => a + (r.produced ?? 0), 0), [rows]);

  const kpiFpy = useMemo(() => {
    if (!rows.length) return 0;
    return Math.round(rows.reduce((a, r) => a + r.fpy, 0) / rows.length);
  }, [rows]);

  const kpiTarget = useMemo(() => {
    if (!rows.length) return 0;
    return rows[0].targetFpy ?? 0;
  }, [rows]);

  const fpyOk = useMemo(() => {
    if (!kpiTarget) return true;
    return kpiFpy >= kpiTarget;
  }, [kpiFpy, kpiTarget]);

  const yRightDomain: [number, number] = useMemo(() => {
    if (!rows.length) return [80, 100];
    const min = Math.min(...rows.map((r) => r.fpy), kpiTarget) - 5;
    const max = Math.max(...rows.map((r) => r.fpy), kpiTarget) + 3;
    return [Math.max(0, Math.floor(min)), Math.min(100, Math.ceil(max))];
  }, [rows, kpiTarget]);

  const showFpyLabels = useMemo(() => {
    // OCULTAR PORCENTAJE FPY GRAFICO A FECHAS LARGAS
    if (!appFrom || !appTo) return true;

    const from = new Date(appFrom.getFullYear(), appFrom.getMonth(), 1);
    const to = new Date(appTo.getFullYear(), appTo.getMonth(), 1);

    const monthsDiff = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());

    return monthsDiff <= 1;
  }, [appFrom, appTo]);

  useEffect(() => {
    const fetchTarget = async () => {
      if (!lineId) return;

      const codigoNewsan2 = LINE_TO_CODIGO_NEWSAN2[lineId];
      if (!codigoNewsan2) return;

      try {
        const t = await serviceRef.current.getTarget(codigoNewsan2);
        setTargetFpy(t ?? 0);
      } catch {
        setTargetFpy(0);
      }
    };

    fetchTarget();
  }, [lineId]);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveIndex(null);
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  //______BUSCAR______//
  const handleBuscar = async () => {
    try {
      if (!plantId) {
        openNotificationUI("Seleccioná una planta", "error");
        return;
      }
      if (!lineId) {
        openNotificationUI("Seleccioná una línea", "error");
        return;
      }

      const fromYMD = dateToYMD(fromDate);
      const toYMD = dateToYMD(toDate);
      const codigoStr = String(codigoNewsan2);

      if (!fromYMD || !toYMD) {
        openNotificationUI("Seleccioná 'desde' y 'hasta'", "error");
        return;
      }
      if (fromYMD > toYMD) {
        openNotificationUI("La fecha 'desde' no puede ser mayor a 'hasta'", "error");
        return;
      }

      if (codigoNewsan2 == null) {
        openNotificationUI("No hay mapeo de CodigoNewsan2 para la línea seleccionada", "error");
        return;
      }

      setIsLoading(true);
      dispatch(LoadingUISlice.actions.LoadingUIOpen());

      const service = serviceRef.current;

      // TARGET REAL
      const targetFpy = Number(await service.getTarget(codigoNewsan2)) || 0;

      const daily = await service.getDaily({
        desde: fromYMD,
        hasta: toYMD,
        codigoNewsan2,
        idLinea: lineId
      });
      const mappedRows: RowCalidad[] = daily.map((d: any) => {
        const date = new Date(d.fecha ?? d.Fecha);
        return {
          dayLabel: `${date.getDate()}/${date.getMonth() + 1}`,
          ymd: dateToYMD(date),
          produced: Number(d.producido ?? d.Producido ?? 0),
          fpy: Number(d.fpy ?? d.FPY ?? 0),
          targetFpy: targetFpy // viene del backend
        };
      });

      const top = await service.getTopRechazos({
        desde: fromYMD,
        hasta: toYMD,
        codigoNewsan2: codigoStr,
        top: 10
      });

      setRows(mappedRows);
      setTopRechazos(
        top.map((t: any) => ({
          motivo: String(t.motivo ?? t.Motivo ?? "").toUpperCase(),
          cantidad: Number(t.total ?? t.Total ?? 0)
        }))
      );

      SetAppFrom(fromDate);
      SetAppTo(toDate);
      setSearched(true);
      setActiveIndex(null);
      setTooltipPos(null);
    } catch (e: any) {
      openNotificationUI(e?.message ?? "Error al buscar datos", "error");
    } finally {
      setIsLoading(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const TopBarLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const v = Number(value ?? 0);
    const cy = y + height / 2;
    const MIN_WIDTH_FOR_INSIDE = 18;
    const isSmall = width < MIN_WIDTH_FOR_INSIDE;
    const cx = isSmall ? x + width - 5.5 : x + width / 2;

    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill="#F71E4E">
        {v}
      </text>
    );
  };

  const TwoLineTick = (props: any) => {
    const { x, y, payload } = props;
    const raw = String(payload?.value ?? "").trim();
    if (!raw) return null;

    const text = raw.toUpperCase();

    const MAX_LINE1 = 25;
    const MAX_LINE2 = 58;

    const splitWords = (s: string) => s.split(/\s+/).filter(Boolean);

    const words = splitWords(text);
    let line1 = "";
    let i = 0;

    // arma línea 1
    while (i < words.length) {
      const next = line1 ? `${line1} ${words[i]}` : words[i];
      if (next.length > MAX_LINE1) break;
      line1 = next;
      i++;
    }

    // arma línea 2 con lo que queda
    let line2 = "";
    while (i < words.length) {
      const next = line2 ? `${line2} ${words[i]}` : words[i];
      if (next.length > MAX_LINE2) break;
      line2 = next;
      i++;
    }

    return (
      <text x={x - 6} y={y} textAnchor="end" fill="var(--axis)" fontSize={9}>
        <tspan x={x - 6} dy="0.35em">
          {line1}
        </tspan>
        {line2 && (
          <tspan x={x - 6} dy="1.15em">
            {line2}
          </tspan>
        )}
      </text>
    );
  };

  //_________RENDER________//
  return (
    <div className="w-full h-full px-10">
      {/* FILTROS */}
      <div className="bg-secondary py-3">
        <div className="flex items-center justify-between gap-2">
          {/* PLANTA */}
          <div className="w-[230px] [&_.bg-secondaryNew]:!bg-transparent">
            <SelectOFPlant
              setPlantId={(id: number) => {
                setPlantId(id);
                setRows([]);
                setSearched(false);
                setLineId(0);
                setActiveIndex(null);
                setTooltipPos(null);
              }}
            />
          </div>

          {/* LINEA */}
          <div className="w-[230px] [&_.bg-secondaryNew]:!bg-transparent">
            <SelectOFLineasP6 setIdLinea={(id: number) => setLineId(id)} />
          </div>

          {/* FECHA DESDE */}
          <div className="w-[230px]">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha desde"
                inputFormat="dd/MM/yyyy"
                value={fromDate}
                onChange={(v) => setFromDate(v)}
                renderInput={(params) => <TextField variant="standard" {...params} fullWidth />}
              />
            </LocalizationProvider>
          </div>

          {/* FECHA HASTA */}
          <div className="w-[200px]">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha hasta"
                inputFormat="dd/MM/yyyy"
                value={toDate}
                onChange={(v) => setToDate(v)}
                renderInput={(params) => <TextField variant="standard" {...params} fullWidth />}
              />
            </LocalizationProvider>
          </div>

          <Button
            onClick={handleBuscar}
            variant="contained"
            className="w-[200px] h-[57px]"
            sx={{
              textTransform: "none",
              fontSize: 18,
              borderRadius: 1,
              bgcolor: "#66B8FF",
              "&:hover": { bgcolor: "#4FA9FF" }
            }}>
            Buscar
          </Button>
        </div>
      </div>
      {/* BLOQUE UNIFICADO */}
      <div className="bg-New rounded-md shadow-Box p-3">
        {/* KPIs */}
        <div className="w-full flex justify-center mb-3">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[820px]">
            <div className="bg-Card rounded-md p-2">
              <div className="text-[14px] text-center font-semibold text-New">Producido</div>
              <div className="text-[24px] text-center font-inter font-semibold">{formatInt(kpiProduced)}</div>
            </div>

            <div className="bg-Card rounded-md p-2">
              <div className="text-[14px] text-center font-semibold text-New">FPY%</div>
              <div
                className="text-[24px] text-center font-inter font-semibold"
                style={{ color: fpyOk ? "#4CAF50" : "#FF1E4E" }}>
                {formatPct(kpiFpy)}
              </div>
            </div>

            <div className="bg-Card rounded-md p-2">
              <div className="text-[14px] text-center font-semibold text-New">Target FPY</div>
              <div className="text-[24px] text-center font-inter font-semibold text-[#4CAF50]">
                {formatPct(kpiTarget)}
              </div>
            </div>
          </div>
        </div>

        {/* GRAFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* PRINCIPAL */}
          <div className="lg:col-span-8 bg-New p-3 rounded-md">
            <div className="text-[18px] ml-[70px] font-semibold text-New text-left">{LINE_ID_TO_LABEL[lineId]}</div>
            {rows.length > 0 ? (
              <div
                ref={chartWrapRef}
                className="h-[320px] relative"
                onClick={() => {
                  setActiveIndex(null);
                  setTooltipPos(null);
                }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={rows} margin={{ top: 25, right: 0, bottom: -10, left: 10 }}>
                    <CartesianGrid stroke="var(--grid)" strokeDasharray="2 2" />
                    <XAxis dataKey="dayLabel" tick={{ fontSize: 12, fill: "var(--axis)" }} />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12, fill: "var(--axis)" }}
                      tickFormatter={(v) =>
                        v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1).replace(".0", "")} mil` : `${v}`
                      }
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={yRightDomain}
                      tick={{ fontSize: 12, fill: "var(--axis)" }}
                      tickFormatter={(v) => `${v}%`}
                    />

                    <Bar yAxisId="left" dataKey="produced" radius={[2, 2, 0, 0]}>
                      {rows.map((_, index) => (
                        <Cell
                          key={index}
                          fill="#72B5E0"
                          fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.25}
                          onClick={(e: any) => {
                            e?.stopPropagation?.();

                            if (activeIndex === index) {
                              setActiveIndex(null);
                              setTooltipPos(null);
                              return;
                            }

                            setActiveIndex(index);

                            const target = e?.target as HTMLElement | null;
                            const wrap = chartWrapRef.current;
                            if (!target || !wrap) return;

                            const barRect = (target as any).getBoundingClientRect?.();
                            const wrapRect = wrap.getBoundingClientRect();
                            if (!barRect) return;

                            const centerX = barRect.left + barRect.width / 2 - wrapRect.left;
                            const topY = barRect.top - wrapRect.top;

                            setTooltipPos({ x: centerX, y: topY });
                          }}
                        />
                      ))}
                    </Bar>

                    {/* TARGET */}
                    <ReferenceLine
                      yAxisId="right"
                      y={kpiTarget}
                      stroke="#4CAF50"
                      strokeWidth={2}
                      strokeDasharray="6 6"
                    />

                    {/* FPY */}
                    <Line
                      yAxisId="right"
                      type="linear"
                      dataKey="fpy"
                      stroke={fpyOk ? "#4CAF50" : "#FF1E4E"}
                      strokeWidth={2}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        if (cx == null || cy == null) return null;

                        const fpy = Number(payload?.fpy ?? 0);
                        const target = Number(payload?.targetFpy ?? 0);

                        const ok = target > 0 ? fpy >= target : true;
                        const color = ok ? "#4CAF50" : "#FF1E4E";

                        return (
                          <g>
                            <circle cx={cx} cy={cy} r={4} fill={color} />
                            {showFpyLabels && (
                              <text x={cx} y={cy - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
                                {`${Math.round(fpy)}%`}
                              </text>
                            )}
                          </g>
                        );
                      }}
                      activeDot={{ r: 5 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>

                {/* TOOLTIP CUSTOM  */}
                <div
                  className={`absolute translate-x-[-50%] translate-y-[-90%] bg-white text-[#47475F] p-[10px]
                  rounded-[5px] text-[12px] z-50 pointer-events-none whitespace-nowrap max-w-[90vw]
                  transition-opacity duration-280 ease-out transition-transform duration-280 ease-out
                  ${activeIndex !== null && tooltipPos ? "opacity-100 translate-y-[-100%]" : ""}`}
                  style={{
                    left: tooltipPos?.x ?? -9999,
                    top: tooltipPos?.y ?? -9999
                  }}>
                  {activeIndex !== null &&
                    rows[activeIndex] &&
                    (() => {
                      const dayFpy = Number(rows[activeIndex].fpy ?? 0);
                      const dayTarget = Number(rows[activeIndex].targetFpy ?? 0);
                      const isDayOk = dayTarget > 0 ? dayFpy >= dayTarget : true;

                      const fpyColor = isDayOk ? "#4CAF50" : "#FF1E4E";

                      return (
                        <>
                          <div style={{ fontWeight: 700, marginBottom: 6, textAlign: "center" }}>
                            {rows[activeIndex].dayLabel}
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#72B5E0",
                                display: "inline-block"
                              }}
                            />
                            <span>
                              Producido: <b>{formatInt(rows[activeIndex].produced)}</b>
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: fpyColor, //rojo o verde
                                display: "inline-block"
                              }}
                            />
                            <span>
                              FPY%: <b style={{ color: fpyColor }}>{formatPct(dayFpy)}</b>
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#4CAF50",
                                display: "inline-block"
                              }}
                            />
                            <span>
                              Target FPY: <b>{formatPct(dayTarget)}</b>
                            </span>
                          </div>
                        </>
                      );
                    })()}
                </div>
              </div>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-sm opacity-70">
                {searched ? "Sin datos para el rango seleccionado." : "Seleccioná filtros y tocá Buscar."}
              </div>
            )}
          </div>

          {/* TOP TEN */}
          <div className="lg:col-span-4 bg-New p-3 rounded-md">
            <div className="text-[18px] sm:text-[20px] ml-[145px] font-semibold tracking-wide text-New text-center lg:text-left">
              TOP TEN RECHAZOS
            </div>
            {topRechazos.length > 0 ? (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topRechazos} layout="vertical" margin={{ top: 15, right: 10, bottom: -10, left: 40 }}>
                    <CartesianGrid stroke="var(--grid)" strokeDasharray="2 2" />

                    <XAxis type="number" tick={{ fontSize: 12, fill: "var(--axis)" }} allowDecimals={false} />

                    <YAxis type="category" dataKey="motivo" width={105} tick={<TwoLineTick />} />
                    <Bar dataKey="cantidad" fill="#FAA7A8" radius={[0, 2, 2, 0]}>
                      <LabelList dataKey="cantidad" position="right" content={TopBarLabel} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-sm opacity-70">
                {searched ? "Sin datos de rechazos." : "Buscá para ver rechazos."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteCalidad;
