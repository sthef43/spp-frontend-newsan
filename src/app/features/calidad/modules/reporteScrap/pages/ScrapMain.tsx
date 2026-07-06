import React, { useEffect, useMemo, useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import * as XLSX from "xlsx";
import { SelectOFPlant } from "app/shared/helpers/SelectOfPlant";
import FileInput from "../components/FileInput";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField, Button } from "@mui/material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import { Group } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { Sliders } from "app/features/ayuda/components/Sliders";
import { StackedLineChart, DonutSmall, BarChart as BarChartIcon } from "@mui/icons-material";
import {
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  BarChart,
  Tooltip
} from "recharts";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { CalidadScrapService } from "app/features/calidad/services/CalidadScrap.service";

//_______HELPERS_______//
const normHeader = (s: any) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\n/g, " ")
    .replace(/[^\w\s()/-]/g, "")
    .replace(/\./g, "")
    .replace(/\s/g, "");

const isSheetEmpty = (sheet: XLSX.WorkSheet) => {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, blankrows: false }) as any[][];
  if (rows.length === 0) return true;
  return rows.every(
    (r) => !r || r.length === 0 || r.every((c) => c === undefined || c === null || String(c).trim() === "")
  );
};

const detectHeaderRow = (sheet: XLSX.WorkSheet, range: XLSX.Range) => {
  const totalCols = range.e.c - range.s.c + 1;
  for (let r = range.s.r; r <= Math.min(range.s.r + 10, range.e.r); r++) {
    let strings = 0;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      if (cell && typeof cell.v === "string" && cell.v.trim() !== "") strings++;
    }
    if (strings / totalCols >= 0.5) return r;
  }
  return range.s.r;
};

const isDateFieldName = (field: string) => /(^|_)(fecha|date)(_|$)/i.test(field.replace(/\s+/g, "_"));
const isCostFieldName = (field: string) => /(costo|cost|importe|monto|precio|costo total)/i.test(field);
const parseLocaleNumber = (v: any): number | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const s = String(v).trim();
  if (!s) return null;
  const normalized =
    s.includes(",") && s.lastIndexOf(",") > s.lastIndexOf(".")
      ? s.replace(/\./g, "").replace(",", ".") // "1.234,56" -> "1234.56"
      : s.replace(/,/g, ""); // "1,234.56" -> "1234.56"
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
};

//____UTILIDADES DE FECHA Y FORMATO____//
const pad2 = (n: number) => String(n).padStart(2, "0");
const formatDateYMDLocal = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const formatMoney = (n: number) => n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const toYMDValue = (value: any): string => {
  if (value instanceof Date) return formatDateYMDLocal(value);
  if (typeof value === "number") {
    const o = XLSX.SSF.parse_date_code(value);
    if (o) return `${o.y}-${pad2(o.m)}-${pad2(o.d)}`;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    const n = parseLocaleNumber(s);
    if (n !== null) {
      const o = XLSX.SSF.parse_date_code(n);
      if (o) return `${o.y}-${pad2(o.m)}-${pad2(o.d)}`;
    }
  }
  return "";
};

const toDisplayByField = (field: string, value: any) => {
  if (isDateFieldName(field)) return toYMDValue(value);
  if (isCostFieldName(field)) {
    const n = parseLocaleNumber(value);
    return n !== null ? formatMoney(n) : value ?? "";
  }
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value.trim() : value;
};

const dateToYMD = (d: Date | null) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

//_______TYPES / CONST_______//

type TcCol = { title: string; field: string };
const ROW_ID_KEY = "ROW_ID";

const MONTHS_ES = [
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
const SHOW_EMPTY_MONTHS = false;

//_______COMPONENT________//
export const ScrapMain = (): JSX.Element => {
  const [chartView, setChartView] = useState<"general" | "componente" | "ops" | "motivos" | null>(null);
  const [expanded, setExpanded] = useState<string | false>("scrap");
  const [opcionSlider, setOpcionSlider] = useState<string>("scrap");

  const { getConfirmation } = useConfirmationDialog();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [agrupados, setAgrupados] = useState(false);
  const [plantaId, setPlantaId] = useState<number>(0);
  const [filePickerKey, setFilePickerKey] = useState(0);
  const [tcColumns, setTcColumns] = useState<TcCol[]>([]);
  const [allRows, setAllRows] = useState<any[]>([]);
  const [dateField, setDateField] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const servicio = useMemo(() => new CalidadScrapService(), []);

  const clearDataset = () => {
    setTcColumns([]);
    setAllRows([]);
    setDateField(null);
    setFromDate(null);
    setToDate(null);
    setChartView(null);
  };

  //_______PARSE EXCEL LOCAL_______//
  const loadWorkbookFromArrayBuffer = (buffer: ArrayBuffer, renderUi: boolean) => {
    const wb = XLSX.read(buffer, { type: "array", cellDates: true });
    const firstSheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[firstSheetName];
    if (!sheet) throw new Error("No se encontró la primera hoja del Excel.");
    if (isSheetEmpty(sheet)) throw new Error("La hoja está vacía.");

    const range = XLSX.utils.decode_range(sheet["!ref"] || "");
    const headerRowIndex = detectHeaderRow(sheet, range);

    const headerCells: string[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r: headerRowIndex, c })];
      headerCells.push(normHeader(cell?.v ?? `Col_${c - range.s.c + 1}`));
    }

    const raw = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
      range: { s: { r: headerRowIndex + 1, c: range.s.c }, e: range.e },
      header: headerCells,
      defval: "",
      raw: true
    });

    const normalized = raw.map((r, i) => {
      const out: Record<string, any> = { [ROW_ID_KEY]: i + 1 };
      Object.keys(r).forEach((k) => (out[k] = toDisplayByField(k, (r as any)[k])));
      return out;
    });

    if (normalized.length === 0) throw new Error("No se encontraron filas debajo del encabezado.");

    if (renderUi) {
      const usedKeys = new Set<string>();
      normalized.forEach((r) => Object.keys(r).forEach((k) => usedKeys.add(k)));
      usedKeys.delete(ROW_ID_KEY);

      const cols = Array.from(usedKeys).map((k) => ({
        title: k.replace(/_/g, " "),
        field: k
      }));

      const candidateDateField =
        cols.find((c) => ["fecha", "date"].includes(c.field.replace(/_/g, "").toLowerCase()))?.field ??
        cols.find((c) => ["fecha", "date"].includes(c.title.replace(/\s+/g, "").toLowerCase()))?.field ??
        null;

      setDateField(candidateDateField);
      setFromDate(null);
      setToDate(null);
      setTcColumns(cols);
      setAllRows(normalized);
    }

    // Siempre devolvemos las filas para armar el payload
    return normalized;
  };

  //_______CAMBIO DE PLANTA_______//
  const handlePlantChange = async (id: number) => {
    setPlantaId(id);
    clearDataset();
    setFilePickerKey((k) => k + 1);
    if (!id || id <= 0) return;

    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));

      const rows = await servicio.getByPlant(id);
      if (!rows || rows.length === 0) {
        return;
      }

      const rowsNorm = rows.map((r: any) => {
        const o: any = { ...r };
        if (o.temporada !== undefined && o.Temporada === undefined) {
          o.Temporada = o.temporada;
          delete o.temporada;
        }
        Object.keys(o).forEach((k) => {
          if (/(^|_)(fecha|date)(_|$)/i.test(k)) {
            o[k] = toYMDValue(o[k]);
          }
        });
        return o;
      });

      const used = new Set<string>();
      rowsNorm.forEach((r) => Object.keys(r).forEach((k) => used.add(k)));
      //Campos que no queremos mostrar
      ["id", "plantId", "deleted", "createdDate", "lastModifiedDate"].forEach((key) => used.delete(key));

      setTcColumns(Array.from(used).map((k) => ({ title: k.replace(/_/g, " "), field: k })));
      setAllRows(rowsNorm);

      const df = Array.from(used).find((k) => /(^|_)(fecha|date)(_|$)/i.test(k)) ?? null;
      setDateField(df);
    } catch (e: any) {
      openNotificationUI(e?.message ?? "Error obteniendo datos de la planta", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //_______SUBIDA AL BACKEND_______//
  const handleFileUpload = async (file: File) => {
    if (!plantaId || plantaId <= 0) {
      openNotificationUI("Seleccioná una planta antes de subir el archivo", "error");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx") {
      openNotificationUI("Solo se aceptan archivos Excel con formato .xlsx", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));

        const buffer = evt.target?.result as ArrayBuffer;
        if (!buffer) throw new Error("No se pudo leer el archivo.");

        // Parseás (llena la tabla en memoria)
        const parsedRows = loadWorkbookFromArrayBuffer(buffer, false);

        // Arma las filas para guardar
        const rowsForSave = parsedRows.map((r: any) => {
          const { [ROW_ID_KEY]: _drop, Id, Deleted, CreatedDate, LastModifiedDate, ...rest } = r;

          return {
            ...rest,
            PlantId: Number(plantaId),
            Cantidad: parseLocaleNumber(rest.Cantidad),
            CostoUnitario: parseLocaleNumber(rest.CostoUnitario),
            CostoTotal: parseLocaleNumber(rest.CostoTotal),
            Semana: rest.Semana === "" || rest.Semana == null ? null : parseInt(String(rest.Semana), 10)
          };
        });

        // Guarda en el backend
        const res = await servicio.saveScrap(rowsForSave, "replace");
        openNotificationUI(`Se guardo con éxito `, "success");

        // se recarga TODO desde la BD
        await handlePlantChange(plantaId);

        // (handlePlantChange ya limpia dataset y resetea file input)
      } catch (err: any) {
        openNotificationUI(err?.message ?? "Error guardando filas", "error");
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    };

    reader.readAsArrayBuffer(file);
  };

  //_____AGRUPADOR____//
  const groupByItem = async () => {
    if (!agrupados) {
      const confirmed = await getConfirmation("Agrupar", "¿Desea agrupar por Item?");
      if (!confirmed) return;
      setAgrupados(true);
    } else {
      const confirmed = await getConfirmation("Desagrupar", "¿Desea volver a la tabla?");
      if (!confirmed) return;
      setAgrupados(false);
    }
  };

  //____FILTRO FECHA____//
  const displayedRows = useMemo(() => {
    if (allRows.length === 0) return [];
    if (!dateField) return allRows;

    const fromYMD = dateToYMD(fromDate);
    const toYMD = dateToYMD(toDate);
    const shouldFilter = Boolean(fromYMD || toYMD);
    if (!shouldFilter) return allRows;

    return allRows.filter((row) => {
      const ymd = toYMDValue(row[dateField]);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
      const gteFrom = fromYMD ? ymd >= fromYMD : true;
      const lteTo = toYMD ? ymd <= toYMD : true;
      return gteFrom && lteTo;
    });
  }, [allRows, dateField, fromDate, toDate]);

  //___AGRUPACION SOLO A TABLA___//
  const tableRows = useMemo(() => {
    if (!agrupados) return displayedRows;
    if (!displayedRows.length) return [];

    // Agrupamos por Item (soporta item/Item)
    const grouped = _.groupBy(displayedRows, (r) => String(r.item ?? r.Item ?? "SIN_ITEM").trim() || "SIN_ITEM");

    return Object.entries(grouped).map(([itemKey, group]) => {
      const first = group[0];

      const sumField = (names: string[]) =>
        group.reduce((acc, row) => {
          for (const n of names) {
            if (row[n] !== undefined) {
              const val = parseLocaleNumber(row[n]);
              if (val !== null) return acc + val;
            }
          }
          return acc;
        }, 0);

      const distinct = (field: string) => {
        const values = _.uniq(
          group.map((r) => r[field]).filter((v) => v !== undefined && v !== null && String(v).trim() !== "")
        );
        return values.length > 1 ? "VARIOS" : values[0] ?? "";
      };

      return {
        ...first,
        item: itemKey,
        op: distinct("op"),
        modelo: distinct("modelo"),
        linea: distinct("linea"),
        fecha: distinct("fecha"),
        motivo: distinct("motivo"),
        descripcion: distinct("descripcion"),
        cantidad: sumField(["cantidad", "Cantidad"]).toFixed(0),
        costoUnitario: sumField(["costoUnitario", "CostoUnitario"]).toFixed(1),
        costoTotal: sumField(["costoTotal", "CostoTotal"]).toFixed(1)
      };
    });
  }, [agrupados, displayedRows]);

  const TileBtn = ({
    icon,
    label,
    onClick,
    disabled = false
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
            flex items-center gap-2 px-4 py-2
            rounded-md h-[50px]
            bg-[#BEE3FF] hover:shadow-none
            text-[#000D27] transition
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-Box
            `}>
      <span className="opacity-90">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );

  //____TEMPORADAS DISPONIBLES____//
  const yearsAvailable = useMemo(() => {
    const set = new Set<number>();
    allRows.forEach((r) => {
      // soporta "Temporada" o "temporada"
      const y = Number(r.Temporada ?? r.temporada);
      if (!Number.isNaN(y)) set.add(y);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [allRows]);
  const [selectedSeason, setSelectedSeason] = useState<number | "">("");
  const [selectedMonth, setSelectedMonth] = useState<number | "">("");
  const monthsAvailable = useMemo(() => {
    if (selectedSeason === "") return [];
    const set = new Set<number>();
    allRows.forEach((r) => {
      if (Number(r.Temporada ?? r.temporada) !== Number(selectedSeason)) return;
      const ymd = String(r.fecha ?? r.Fecha ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return;
      const d = new Date(ymd);
      if (!Number.isNaN(d.getTime())) set.add(d.getMonth() + 1); // 1..12
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [allRows, selectedSeason]);

  const parseMoney = (v: any) => {
    const n = parseLocaleNumber?.(v);
    return n ?? 0;
  };

  const sumCostoTotalOfSeason = (season: number) => {
    let total = 0;
    allRows.forEach((r) => {
      const t = Number(r.Temporada ?? r.temporada);
      if (t === season) total += parseMoney(r.costoTotal ?? r.CostoTotal);
    });
    return total;
  };
  const moneyMillions = (n: number) => `$${(n / 1_000_000).toFixed(2)} mill.`;
  const pctChange = (actual: number, anterior: number): number | null => {
    if (anterior === 0) {
      if (actual === 0) return 0;
      return null; // N/A (no se puede comparar)
    }
    return ((actual - anterior) / anterior) * 100;
  };
  const formatPct = (v: number) => `${v.toFixed(1)}%`;

  //______DATASETS_____//
  const dataGrafico = useMemo(() => {
    if (!selectedSeason) return [];

    const season = Number(selectedSeason);

    // allRows ya viene filtrado por planta (getByPlant),
    // acá filtramos solo por temporada.
    const seasonRows = allRows.filter((r: any) => {
      const temp = Number(r.Temporada ?? r.temporada);
      return temp === season;
    });

    // acumulador enero..diciembre en pesos
    const acc = Array(12).fill(0);

    seasonRows.forEach((r: any) => {
      // normalizamos fecha: solo YYYY-MM-DD
      const raw = String(r.Fecha ?? r.fecha ?? "").slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return;

      const month = Number(raw.slice(5, 7)); // 01..12
      if (month < 1 || month > 12) return;

      const val = parseMoney(r.CostoTotal ?? r.costoTotal);
      if (!isFinite(val)) return;

      acc[month - 1] += val;
    });

    // armamos dataset en millones
    let data = acc.map((total, idx) => ({
      mes: MONTHS_ES[idx],
      totalMill: Number((total / 1_000_000).toFixed(2))
    }));

    if (!SHOW_EMPTY_MONTHS) {
      data = data.filter((d) => d.totalMill !== 0);
    }

    return data;
  }, [allRows, selectedSeason]);

  const dataComponenteBar = useMemo(() => {
    if (selectedSeason === "") return [];
    const season = Number(selectedSeason);
    const acc: Record<string, { total: number; descripcionCompleta: string }> = {};
    allRows.forEach((r) => {
      if (Number(r.Temporada ?? r.temporada) !== season) return;

      // filtro por mes si corresponde
      const ymd = String(r.fecha ?? r.Fecha ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return;
      const d = new Date(ymd);
      const month = d.getMonth() + 1;
      if (selectedMonth !== "" && month !== Number(selectedMonth)) return;

      const descCompleta = String(r.Descripcion ?? r.descripcion ?? "N/D").trim();
      const desc = descCompleta;

      const val = parseLocaleNumber(r.CostoTotal ?? r.costoTotal) ?? 0;

      // agrupamos por descripción corta pero guardamos también la completa
      if (!acc[desc]) {
        acc[desc] = { total: 0, descripcionCompleta: descCompleta };
      }
      acc[desc].total += val;
    });

    //Top 10 por monto
    return Object.entries(acc)
      .map(([name, obj]) => ({
        name,
        descripcionCompleta: obj.descripcionCompleta,
        total: obj.total, // monto real
        totalMill: obj.total / 1_000_000 // en millones
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [allRows, selectedSeason, selectedMonth]);

  const dataSectorDonut = useMemo(() => {
    if (selectedSeason === "") return [];
    const season = Number(selectedSeason);

    const acc: Record<string, number> = {};
    allRows.forEach((r) => {
      if (Number(r.Temporada ?? r.temporada) !== season) return;
      const ymd = String(r.fecha ?? r.Fecha ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return;
      const d = new Date(ymd);
      const month = d.getMonth() + 1;
      if (selectedMonth !== "" && month !== Number(selectedMonth)) return;

      const sector = String(r.Sector ?? r.sector ?? "Sin sector");
      const val = parseLocaleNumber(r.CostoTotal ?? r.costoTotal) ?? 0;
      acc[sector] = (acc[sector] || 0) + val;
    });

    return Object.entries(acc)
      .map(([name, total]) => ({ name, value: Number((total / 1_000_000).toFixed(2)) }))
      .sort((a, b) => b.value - a.value);
  }, [allRows, selectedSeason, selectedMonth]);

  const dataComponenteUnidades = useMemo(() => {
    if (selectedSeason === "") return [];
    const season = Number(selectedSeason);
    const acc: Record<string, number> = {};

    allRows.forEach((r) => {
      if (Number(r.Temporada ?? r.temporada) !== season) return;
      const ymd = String(r.fecha ?? r.Fecha ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return;
      const d = new Date(ymd);
      const month = d.getMonth() + 1;
      if (selectedMonth !== "" && month !== Number(selectedMonth)) return;

      const descCompleta = String(r.Descripcion ?? r.descripcion ?? "N/D").trim();
      acc[descCompleta] = (acc[descCompleta] || 0) + (parseLocaleNumber(r.Cantidad ?? r.cantidad) ?? 0);
    });

    //  GUARDA DESCRIPCION COMPLETA
    return Object.entries(acc)
      .map(([descCompleta, total]) => ({
        name: descCompleta, //
        descripcionCompleta: descCompleta, // texto largo (tooltip)
        total
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [allRows, selectedSeason, selectedMonth]);

  const dataMotivosBar = useMemo(() => {
    if (selectedSeason === "") return [];
    const season = Number(selectedSeason);

    const acc: Record<string, number> = {};
    allRows.forEach((r) => {
      if (Number(r.Temporada ?? r.temporada) !== season) return;

      // FILTRAR POR MES SI APLICA
      const ymd = String(r.fecha ?? r.Fecha ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return;
      const d = new Date(ymd);
      const month = d.getMonth() + 1;
      if (selectedMonth !== "" && month !== Number(selectedMonth)) return;

      const motivo = String(r.Motivo ?? r.motivo ?? "Sin motivo").trim();
      const val = parseLocaleNumber(r.Cantidad ?? r.cantidad) ?? 0;
      acc[motivo] = (acc[motivo] || 0) + val;
    });

    // ORDENAR Y DEJAR TOP
    return Object.entries(acc)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [allRows, selectedSeason, selectedMonth]);

  useEffect(() => {
    if (selectedSeason === "" && yearsAvailable.length) {
      setSelectedSeason(yearsAvailable[yearsAvailable.length - 1]);
    }
  }, [yearsAvailable, selectedSeason]);

  useEffect(() => {
    TitleChanger("Reporte Scrap");
  }, [TitleChanger]);

  useEffect(() => {
    setSelectedMonth("");
  }, [selectedSeason]);

  // AUTO-SELECCIONADOR DE MES EN GRAFICOS
  useEffect(() => {
    if (chartView !== "ops" && chartView !== "componente" && chartView !== "motivos") return;

    if (!monthsAvailable || monthsAvailable.length === 0) {
      setSelectedMonth(null as any);
      return;
    }

    if (
      selectedMonth == null || // null / undefined
      !monthsAvailable.includes(Number(selectedMonth))
    ) {
      setSelectedMonth(monthsAvailable[0]);
    }
  }, [chartView, monthsAvailable, selectedMonth]);

  const DONUT_COLORS = ["#73EEFF", "#FFB53F", "#E48D91", "#60a5fa", "#c084fc", "#34d399", "#f87171", "#eab308"];
  const totalActual = selectedSeason === "" ? 0 : sumCostoTotalOfSeason(selectedSeason as number);
  const totalAnterior = selectedSeason === "" ? 0 : sumCostoTotalOfSeason((selectedSeason as number) - 1);
  const variacionPct = pctChange(totalActual, totalAnterior); // puede ser null
  const variacionEsBuena = variacionPct !== null ? variacionPct <= 0 : null; // bajar scrap = bueno
  const chartTitle = useMemo(() => {
    //ASIGNACION DE TITULO A PESTAÑAS
    switch (chartView) {
      case "general":
        return "Scrap General";
      case "componente":
        return "Scrap ($) por Componente";
      case "ops":
        return "Scrap (Un.) Componente";
      case "motivos":
        return "Scrap Motivos";
      default:
        return "";
    }
  }, [chartView]);

  //_____RENDER_____//
  return (
    <div className="h-full p-10 pt-1 rounded-lg shadow-elevation-4 bg-secondary ">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 w-full border-b border-divider h-[100px] ">
        {/* SELECCION DE PLANTA Y FECHAS */}
        <div className="flex flex-wrap items-center justify-between gap-14">
          <div
            className="w-[200px] mb-3 
                    [&_.bg-secondaryNew]:!bg-[var(--color-secondary)]
                    [&_.container]:!text-left
                    [&_.MuiInputLabel-root]:!hidden">
            <SelectOFPlant setPlantId={handlePlantChange} notShadow />
          </div>
          <div className="flex gap-14 ml-8 mb-3">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Desde"
                inputFormat="dd/MM/yyyy"
                value={fromDate}
                onChange={(v) => setFromDate(v)}
                renderInput={(params) => <TextField variant="standard" {...params} sx={{ width: 200 }} />}
              />
              <DesktopDatePicker
                label="Hasta"
                inputFormat="dd/MM/yyyy"
                value={toDate}
                onChange={(v) => setToDate(v)}
                renderInput={(params) => <TextField variant="standard" {...params} sx={{ width: 200 }} />}
              />
            </LocalizationProvider>
          </div>
        </div>
        {/* BOTON EXCEL Y AGRUPAR */}
        <div className="flex items-end gap-8 mr-0">
          <div>
            <FileInput key={filePickerKey} onFileUpload={handleFileUpload} />
          </div>
          <Button
            className="bg-[#7A65F2] hover:bg-[#6A56E0] normal-case font-medium p-1 shadow-Box h-[42px] w-[150px]"
            startIcon={<Group />}
            disabled={allRows.length === 0}
            onClick={groupByItem}
            variant="contained">
            {!agrupados ? "Agrupar" : "Desagrupar"}
          </Button>
        </div>
      </div>
      {/* SLIDER DE TABLA */}
      <div className="mt-9 [&_.MuiAccordion-root]:!border-none">
        <Sliders
          titleSlider="Scrap"
          nameSlider="scrap"
          expandend={expanded}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <div
              className="
                        [&_.MuiButton-root]:!normal-case
                        [&_.MuiButton-root]:!bg-[#61D864]
                        my-2 mx-0 h-full p-3 mt-3 rounded-lg bg-secondaryNew">
              <TableComponent
                Dense
                buscar
                excel
                fileNameExcel="Scrap.xlsx"
                IDcolumn={ROW_ID_KEY}
                columns={tcColumns}
                dataInfo={tableRows}
              />
            </div>
          }
        />
      </div>
      {/* SLIDER GRAFICO */}
      <div className="mt-7 [&_.MuiAccordion-root]:!border-none">
        <Sliders
          titleSlider="Gráfico"
          nameSlider="grafico"
          expandend={expanded}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <div className="p-4 bg-secondaryNew rounded-lg">
              {/* FILA DE BOTONES */}
              <div className="flex flex-wrap justify-center gap-[100px]">
                <TileBtn
                  icon={<BarChartIcon fontSize="small" />}
                  label="Scrap General"
                  onClick={() => setChartView("general")}
                  disabled={allRows.length === 0}
                />
                <TileBtn
                  icon={<StackedLineChart fontSize="small" />}
                  label="Scrap ($) Componente"
                  onClick={() => setChartView("componente")}
                  disabled={allRows.length === 0}
                />
                <TileBtn
                  icon={<DonutSmall fontSize="small" />}
                  label="Scrap (Un.) Componente"
                  onClick={() => setChartView("ops")}
                  disabled={allRows.length === 0}
                />
                <TileBtn
                  icon={<BarChartIcon fontSize="small" />}
                  label="Scrap (Motivos)"
                  onClick={() => setChartView("motivos")}
                  disabled={allRows.length === 0}
                />
              </div>
              {chartView && (
                <div className="mt-6 p-4 rounded-md">
                  {/* Toolbar del gráfico */}
                  <div className="flex items-center rounded justify-between mb-4 bg-NewPrimary h-[60px] p-3 ">
                    {/* Select de Temporada */}
                    <div className="flex items-center p-3 mb-2 gap-3 ">
                      <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(e.target.value === "" ? "" : Number(e.target.value))}
                        className="py-2 !bg-transparent text-TextNew border-b-[1px] w-[200px] ">
                        {yearsAvailable.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                      {chartView !== "general" && (
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value === "" ? "" : Number(e.target.value))}
                          className="py-2 bg-transparent text-TextNew border-b-[1px] w-[160px]">
                          {monthsAvailable.map((m) => (
                            <option key={m} value={m}>
                              {MONTHS_ES[m - 1]}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {/* Resumen derecha */}
                    <div className="flex items-center gap-2 text-sm text-TextNew">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/trash-icon.png`}
                        alt="Scrap icon"
                        className="w-8 h-8"
                      />
                      <span className="inline-flex items-center gap-2 px-3 py-1">
                        <span>Total Scrap:</span>
                        <strong className="text-red-400">{moneyMillions(totalActual)}</strong>
                      </span>
                      <span className="text-TextNew opacity-60">|</span>
                      <span className="inline-flex items-center gap-2 px-3 py-1">
                        <span>Año Anterior:</span>
                        <strong className="text-red-400">{moneyMillions(totalAnterior)}</strong>
                      </span>
                      {/* Variación porcentual */}
                      {variacionPct === null ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1">
                          <strong className="text-gray-300"></strong>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1">
                          <strong
                            className={
                              variacionEsBuena
                                ? "text-[#3E8D59] bg-[#61D864] rounded w-[80px] text-center"
                                : "text-[#cc4747] bg-[#ff96aa] rounded w-[80px] text-center"
                            }>
                            {variacionEsBuena ? " " : "- "}
                            {formatPct(variacionPct)}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Contenido según botón activo */}
                  {chartView === "general" ? (
                    dataGrafico.length > 0 ? (
                      <div className="relative">
                        <div className="absolute top-0 right-0 px-3 py-1 text-m font-medium translate-y-[-20px] translate-x-[-30px]">
                          {chartTitle}{" "}
                        </div>
                        <ResponsiveContainer width="100%" height={380}>
                          <BarChart data={dataGrafico} margin={{ top: 20, right: 30, bottom: 20, left: 40 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="var(--grid)" />
                            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "var(--axis)" }} />
                            <YAxis
                              tick={{ fontSize: 12, fill: "var(--axis)" }}
                              tickFormatter={(v) => `$${v.toFixed(1)} mill`}
                            />
                            <Bar dataKey="totalMill" fill="#00D2FF">
                              <LabelList
                                dataKey="totalMill"
                                position="top"
                                formatter={(v: any) => `$${Number(v).toFixed(1)} mill`}
                                fill="#DF5754"
                              />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center text-sm opacity-70">No hay datos para graficar</div>
                    )
                  ) : chartView === "componente" ? (
                    <div className="relative">
                      {/* TITULO DE GRAFICO */}
                      <div className="absolute top-0 right-0 px-3 py-1 text-m font-medium translate-y-[-10px] translate-x-[-10px]">
                        {chartTitle}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                        {/* Barra: $ por Descripción */}
                        <div className="w-full">
                          {dataComponenteBar.length > 0 ? (
                            <ResponsiveContainer width="110%" height={330}>
                              <BarChart data={dataComponenteBar} margin={{ top: 40, right: 0, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="2 2" stroke="var(--grid)" />
                                <XAxis dataKey=" " tick={{ fontSize: 12, fill: "var(--axis)" }} />
                                <YAxis
                                  tick={{ fontSize: 12, fill: "var(--axis)" }}
                                  tickFormatter={(v: number) => {
                                    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} mill`;
                                    if (v >= 1_000) return `${(v / 1_000).toFixed(0)} mil`;
                                    return v.toFixed(0);
                                  }}
                                />
                                <Tooltip
                                  content={({ active, payload }) => {
                                    if (!active || !payload || !payload.length) return null;
                                    const desc = payload[0]?.payload?.descripcionCompleta ?? "";
                                    return (
                                      <div
                                        style={{
                                          background: "#001134",
                                          color: "#ffffffff",
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          borderRadius: "10px",
                                          padding: 5,
                                          whiteSpace: "normal",
                                          lineHeight: 1.3
                                        }}>
                                        {desc}
                                      </div>
                                    );
                                  }}
                                  cursor={{ fill: "#18181812" }}
                                />
                                <Bar dataKey="total" fill="#6AE4F4">
                                  <LabelList
                                    dataKey="total"
                                    position="top"
                                    formatter={(v: number) => {
                                      if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}mill`;
                                      if (v >= 1_000) return `${(v / 1_000).toFixed(0)}mil`;
                                      return v.toFixed(0);
                                    }}
                                    fill="#DF5754"
                                  />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="text-center text-sm opacity-70">Sin datos para esta selección.</div>
                          )}
                        </div>
                        {/* Dona: $ por Sector */}
                        <div className="w-full">
                          {dataSectorDonut.length > 0 ? (
                            <div className="border border-dashed border-[var(--grid)] mt-10 ml-[180px] h-[260px] w-[400px] ">
                              <span className=" absolute text-sm p-2"> Scrap por Sector</span>
                              <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                  <Pie
                                    data={dataSectorDonut}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={80} //Tamaño de dona
                                    stroke="#3f3d5661"
                                    cx="50%"
                                    cy="40%"
                                    labelLine={{ strokeWidth: 1, stroke: "currentColor" }}
                                    label={(props: any) => {
                                      const { name, value, cx, cy, midAngle, outerRadius } = props;
                                      const RAD = Math.PI / 180;
                                      const rx = cx + (outerRadius + 16) * Math.cos(-midAngle * RAD);
                                      const ry = cy + (outerRadius + 16) * Math.sin(-midAngle * RAD);
                                      // total para porcentaje
                                      const total =
                                        dataSectorDonut.reduce((a, b) => a + (Number(b.value) || 0), 0) || 1;
                                      const pct = ((Number(value) / total) * 100).toFixed(1);
                                      // orientación: texto a la derecha o izquierda del punto
                                      const anchor = rx > cx ? "start" : "end";
                                      const offset = rx > cx ? 4 : -4; // pequeño desplazamiento
                                      return (
                                        <>
                                          {/* Nombre del sector */}
                                          <text
                                            x={rx + offset}
                                            y={ry}
                                            fontSize={11}
                                            fontWeight={300}
                                            textAnchor={anchor}
                                            fill="currentColor">
                                            {name}
                                          </text>
                                          {/* Porcentaje debajo del nombre */}
                                          <text
                                            x={rx + offset}
                                            y={ry + 12} // desplaza el porcentaje debajo
                                            fill="currentColor"
                                            fontSize={11}
                                            textAnchor={anchor}>
                                            {pct}%
                                          </text>
                                        </>
                                      );
                                    }}>
                                    {dataSectorDonut.map((_, i) => (
                                      <Cell key={`cell-${i}`} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                                    ))}

                                    {/* label central igual que antes */}
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <div className="text-center text-sm opacity-70">Sin datos para esta selección.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : chartView === "ops" ? (
                    <div className="relative">
                      {/* título arriba a la derecha */}
                      <div className="absolute top-0 right-0 px-3 py-1 text-m font-medium translate-y-[-10px] translate-x-[-10px]">
                        {chartTitle}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                        {/* Barra: Cantidad por Descripción */}
                        <div className="w-full">
                          {dataComponenteUnidades.length > 0 ? (
                            <ResponsiveContainer width="110%" height={330}>
                              <BarChart
                                data={dataComponenteUnidades}
                                margin={{ top: 40, right: 0, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="2 2" stroke="var(--grid)" />
                                <XAxis dataKey=" " tick={{ fontSize: 12, fill: "var(--axis)" }} />
                                <YAxis tick={{ fontSize: 12, fill: "var(--axis)" }} />
                                <Tooltip
                                  content={({ active, payload }) => {
                                    if (!active || !payload || !payload.length) return null;
                                    const desc = payload[0]?.payload?.descripcionCompleta ?? "";
                                    return (
                                      <div
                                        style={{
                                          background: "#001134",
                                          color: "#ffffffff",
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          borderRadius: "10px",
                                          padding: 5,
                                          whiteSpace: "normal",
                                          lineHeight: 1.3
                                        }}>
                                        {desc}
                                      </div>
                                    );
                                  }}
                                  cursor={{ fill: "#18181812" }}
                                />
                                <Bar dataKey="total" fill="#6AE4F4">
                                  <LabelList
                                    dataKey="total"
                                    position="top"
                                    formatter={(v: number) => v.toFixed(0)}
                                    fill="#DF5754"
                                  />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="text-center text-sm opacity-70">Sin datos para esta selección.</div>
                          )}
                        </div>
                        {/* Dona: $ por Sector */}
                        <div className="w-full">
                          {dataSectorDonut.length > 0 ? (
                            <div className="border border-dashed border-[var(--grid)] mt-10 ml-[180px] h-[260px] w-[400px] ">
                              <span className=" absolute text-sm p-2"> Scrap por Sector</span>
                              <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                  <Pie
                                    data={dataSectorDonut}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={80} //Tamaño de dona
                                    stroke="#3f3d5658"
                                    cx="50%"
                                    cy="40%"
                                    labelLine={{ strokeWidth: 1, stroke: "currentColor" }}
                                    label={(props: any) => {
                                      const { name, value, cx, cy, midAngle, outerRadius } = props;
                                      const RAD = Math.PI / 180;
                                      const rx = cx + (outerRadius + 16) * Math.cos(-midAngle * RAD);
                                      const ry = cy + (outerRadius + 16) * Math.sin(-midAngle * RAD);
                                      // total para porcentaje
                                      const total =
                                        dataSectorDonut.reduce((a, b) => a + (Number(b.value) || 0), 0) || 1;
                                      const pct = ((Number(value) / total) * 100).toFixed(1);
                                      // orientación: texto a la derecha o izquierda del punto
                                      const anchor = rx > cx ? "start" : "end";
                                      const offset = rx > cx ? 4 : -4; // pequeño desplazamiento
                                      return (
                                        <>
                                          {/* Nombre del sector */}
                                          <text
                                            x={rx + offset}
                                            y={ry}
                                            fill="currentColor"
                                            fontSize={11}
                                            fontWeight={300}
                                            textAnchor={anchor}>
                                            {name}
                                          </text>
                                          {/* Porcentaje debajo del nombre */}
                                          <text
                                            x={rx + offset}
                                            y={ry + 12} // desplaza el porcentaje debajo
                                            fill="currentColor"
                                            fontSize={11}
                                            textAnchor={anchor}>
                                            {pct}%
                                          </text>
                                        </>
                                      );
                                    }}>
                                    {dataSectorDonut.map((_, i) => (
                                      <Cell key={`cell-${i}`} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                                    ))}
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <div className="text-center text-sm opacity-70">Sin datos para esta selección.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : chartView === "motivos" ? (
                    <div className="relative">
                      {/* título arriba a la derecha */}
                      <div className="absolute top-0 right-0 px-3 py-1 text-m font-medium translate-y-[-20px]">
                        {chartTitle}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
                        {/* IZQ Barra horizontal por Motivo (Cantidad) */}
                        <div className="w-full -ml-12 ">
                          {dataMotivosBar.length > 0 ? (
                            <ResponsiveContainer width="120%" height={480}>
                              <BarChart
                                data={dataMotivosBar}
                                layout="vertical"
                                margin={{ top: 10, right: 50, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="2 2" stroke="var(--grid)" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 12, fill: "var(--axis)" }} />
                                <YAxis
                                  type="category"
                                  dataKey="name"
                                  tick={{ fontSize: 12, fill: "var(--axis)" }}
                                  width={150}
                                />
                                <Bar dataKey="total" fill="#6AE4F4">
                                  <LabelList
                                    dataKey="total"
                                    position="right"
                                    formatter={(v: number) => v.toFixed(0)}
                                    style={{ fontSize: 14 }}
                                    fill="#DF5754"
                                  />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="text-center text-sm opacity-70">Sin datos para esta selección.</div>
                          )}
                        </div>
                        {/* DERECHA: arriba Barra $ por Componente, abajo Dona por Sector */}
                        <div className="w-full grid grid-rows-2 pl-14">
                          {/* Barra $ por Descripción */}
                          {dataComponenteBar.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                              <BarChart data={dataComponenteBar} margin={{ top: 30, right: 20, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="2 2" stroke="var(--grid)" />
                                <XAxis dataKey=" " tick={{ fontSize: 12, fill: "var(--axis)" }} />
                                <YAxis
                                  tick={{ fontSize: 12, fill: "var(--axis)" }}
                                  tickFormatter={(v: number) => {
                                    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} mill`;
                                    if (v >= 1_000) return `${(v / 1_000).toFixed(0)} mil`;
                                    return v.toFixed(0);
                                  }}
                                />
                                <Tooltip
                                  content={({ active, payload }) => {
                                    if (!active || !payload || !payload.length) return null;
                                    const desc = payload[0]?.payload?.descripcionCompleta ?? "";
                                    return (
                                      <div
                                        style={{
                                          background: "#001134",
                                          color: "#ffffffff",
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          borderRadius: "10px",
                                          padding: 5,
                                          whiteSpace: "normal",
                                          lineHeight: 1.3
                                        }}>
                                        {desc}
                                      </div>
                                    );
                                  }}
                                  cursor={{ fill: "#18181812" }}
                                />
                                <Bar dataKey="total" fill="#6AE4F4">
                                  <LabelList
                                    style={{ fontSize: 12 }}
                                    dataKey="total"
                                    position="top"
                                    formatter={(v: number) => {
                                      if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}mill`;
                                      if (v >= 1_000) return `${(v / 1_000).toFixed(0)}mil`;
                                      return v.toFixed(0);
                                    }}
                                    fill="#DF5754"
                                  />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="text-center text-sm opacity-70">Sin datos.</div>
                          )}
                          {/* Dona */}
                          <div className=" border border-dashed border-[var(--grid)] h-[230px] p-2 ml-12 relative flex items-center ">
                            <span className="absolute top-2 left-3 text-sm tracking-wide">Scrap por sector</span>
                            <ResponsiveContainer width="100%" height={220}>
                              <PieChart>
                                <Pie
                                  data={dataSectorDonut}
                                  dataKey="value"
                                  nameKey="name"
                                  outerRadius={80}
                                  stroke="#3f3d562e"
                                  cx="60%"
                                  cy="50%"
                                  labelLine={{ strokeWidth: 1, stroke: "currentColor" }}
                                  label={(props: any) => {
                                    const { name, value, cx, cy, midAngle, outerRadius } = props;
                                    const RAD = Math.PI / 180;
                                    const rx = cx + (outerRadius + 16) * Math.cos(-midAngle * RAD);
                                    const ry = cy + (outerRadius + 16) * Math.sin(-midAngle * RAD);
                                    // total para porcentaje
                                    const total = dataSectorDonut.reduce((a, b) => a + (Number(b.value) || 0), 0) || 1;
                                    const pct = ((Number(value) / total) * 100).toFixed(1);
                                    // orientación: texto a la derecha o izquierda del punto
                                    const anchor = rx > cx ? "start" : "end";
                                    const offset = rx > cx ? 4 : -4; // pequeño desplazamiento
                                    return (
                                      <>
                                        {/* Nombre del sector */}
                                        <text
                                          x={rx + offset}
                                          y={ry}
                                          fill="currentColor"
                                          fontSize={11}
                                          fontWeight={300}
                                          textAnchor={anchor}>
                                          {name}
                                        </text>
                                        {/* Porcentaje debajo del nombre */}
                                        <text
                                          x={rx + offset}
                                          y={ry + 12} // desplaza el porcentaje debajo
                                          fill="currentColor"
                                          fontSize={11}
                                          textAnchor={anchor}>
                                          {pct}%
                                        </text>
                                      </>
                                    );
                                  }}>
                                  {dataSectorDonut.map((_, i) => (
                                    <Cell key={`cell-${i}`} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ScrapMain;
