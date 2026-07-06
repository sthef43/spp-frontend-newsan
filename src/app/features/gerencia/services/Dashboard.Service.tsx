import axios, { AxiosInstance } from "axios";

//_______TYPES________
export type KPI = {
    planned: number;
    produced: number;
};

export type PlannedTypeRow = {
    tipo: string; // "SPLIT", "PORTABLE", "WINDOW", "LIGHT COMMERCIAL"
    cantidad: number;
};

export type UnitDetailRow = {
    tipo: string; // SPLIT / PORTABLE / WINDOW...
    proveedor: string; // nombre proveedor
    frigoria: number; // 25 / 32 / 50 / 60
    planExterior: number; // PlanificadoExterior
    planInterior: number; // PlanificadoInterior
    planReal: number; // PlanReal (mayor E/I o suma P/W)
};

export type ProducedDetailRow = {
    tipo: string;
    proveedor: string;
    frigoria: number;

    planificadoExterior: number;
    planificadoInterior: number;

    producidoExterior: number;
    producidoInterior: number;

    remanenteExterior: number;
    remanenteInterior: number;

    noConforme: number;
    noConformeExterior: number;
    noConformeInterior: number;
};

export type MonthRow = {
    year: number;
    month: number; // 1..12
    linea: string;
    planned: number;
    produced: number;

    overProduction: number;
    resultPercent: number;

    rejects: number;
};

export type SeasonRange = {
    temporada: string;
    fechaInicio: string | null;
    fechaFin: string | null;
};

//_________SERVICE_________
export class DashboardService {
    private api: AxiosInstance;

    constructor() {
        const baseURL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
        this.api = axios.create({ baseURL });
    }

    // TEMPORADA POR PLANTA
    async getSeasonsByPlant(plantId: number): Promise<number[]> {
        if (!plantId || plantId <= 0) return [];

        const url = `/Dashboard/Temporadas?plantId=${plantId}`;
        const { data } = await this.api.get<string[]>(url);

        const parsed = (data ?? [])
            .map((s) => Number(s))
            .filter((n) => !Number.isNaN(n));

        return parsed;
    }

    //KPI
    async getKpis(plantId: number, temporada: number): Promise<KPI> {
        const url = `/Dashboard/Kpi?plantId=${plantId}&temporada=${temporada}`;
        const { data } = await this.api.get<any>(url);

        return {
            planned: Number(data?.planned ?? data?.plannedTotal ?? 0),
            produced: Number(data?.produced ?? data?.producedTotal ?? 0),
        };
    }

    // PLANIFICADO
    async getPlannedByType(plantId: number, temporada: number): Promise<PlannedTypeRow[]> {
        if (!plantId || plantId <= 0) throw new Error("PlantId inválido");
        if (!temporada) throw new Error("Temporada inválida");

        const url = `/Dashboard/PlannedByType?plantId=${plantId}&temporada=${temporada}`;
        const { data } = await this.api.get<any[]>(url);

        const list = Array.isArray(data) ? data : [];

        return list.map((d) => {
            const rawTipo = String(d.tipo ?? d.Tipo ?? "");
            const tipoNorm = rawTipo.trim().toUpperCase();

            return {
                tipo: tipoNorm,
                cantidad: Number(
                    d.cantidad ??
                    d.Cantidad ??
                    d.planReal ??
                    d.PlanReal ??
                    0
                ),
            };
        });
    }

    // PRODUCIDO
    async getProducedByType(plantId: number, temporada: number): Promise<PlannedTypeRow[]> {
        if (!plantId || plantId <= 0) throw new Error("PlantId inválido");
        if (!temporada) throw new Error("Temporada inválida");

        const url = `/Dashboard/ProducedByType?plantId=${plantId}&temporada=${temporada}`;
        const { data } = await this.api.get<any[]>(url);

        const list = Array.isArray(data) ? data : [];

        return list.map((d) => ({
            tipo: String(d.tipo ?? d.Tipo ?? ""),
            cantidad: Number(
                d.cantidad ??
                d.Cantidad ??
                d.cantidadProducida ??
                d.CantidadProducida ??
                0
            ),
        }));
    }

    // GRAFICO MENSUAL
    async getMonthly(plantId: number, temporada: number): Promise<MonthRow[]> {
        const url = `/Dashboard/Monthly?plantId=${plantId}&temporada=${temporada}`;
        const { data } = await this.api.get<any[]>(url);

        const list = Array.isArray(data) ? data : [];

        return list.map((d) => {
            const year = Number(d.year ?? d.Year ?? 0);
            const month = Number(d.month ?? d.Month ?? 0);
            const linea = String(d.linea ?? d.Linea ?? "");

            const planned = Number(d.planned ?? d.Planned ?? 0);
            const produced = Number(d.produced ?? d.Produced ?? 0);
            const rejects = Number(d.rejects ?? d.Rejects ?? 0);

            return {
                year,
                month,
                linea,
                planned,
                produced,
                overProduction: 0,
                resultPercent: 0,
                rejects,
            };
        });
    }

    // DETALLE PLANIFICADO
    async getPlannedUnitsDetail(plantId: number, temporada: number): Promise<UnitDetailRow[]> {
        if (!plantId || plantId <= 0) throw new Error("PlantId inválido");
        if (!temporada) throw new Error("Temporada inválida");

        const url = `/Dashboard/PlannedUnitsDetail?plantId=${plantId}&temporada=${temporada}`;
        const { data } = await this.api.get<any[]>(url);

        const list = Array.isArray(data) ? data : [];

        return list.map((d) => {
            const rawTipo = String(d.tipo ?? d.Tipo ?? "");
            const tipoNorm = rawTipo.trim().toUpperCase();

            return {
                tipo: tipoNorm,
                proveedor: String(d.proveedor ?? d.Proveedor ?? ""),
                frigoria: Number(d.frigoria ?? d.Frigoria ?? 0),
                planExterior: Number(d.planExterior ?? d.PlanExterior ?? 0),
                planInterior: Number(d.planInterior ?? d.PlanInterior ?? 0),
                planReal: Number(
                    d.planReal ??
                    d.PlanReal ??
                    d.cantidad ??
                    d.Cantidad ??
                    0
                ),
            };
        });
    }

    // DETALLE PRODUCIDO
    async getProducedDetail(plantId: number, temporada: number): Promise<ProducedDetailRow[]> {
        if (!plantId || plantId <= 0) throw new Error("PlantId inválido");
        if (!temporada) throw new Error("Temporada inválida");

        const url = `/Dashboard/ProducedDetail?plantId=${plantId}&temporada=${temporada}`;
        const { data } = await this.api.get<any[]>(url);

        const list = Array.isArray(data) ? data : [];

        return list.map((d) => ({
            tipo: String(d.tipo ?? d.Tipo ?? ""),
            proveedor: String(d.proveedor ?? d.Proveedor ?? ""),
            frigoria: Number(d.frigoria ?? d.Frigoria ?? 0),

            planificadoExterior: Number(d.planificadoExterior ?? d.PlanificadoExterior ?? 0),
            planificadoInterior: Number(d.planificadoInterior ?? d.PlanificadoInterior ?? 0),

            producidoExterior: Number(d.producidoExterior ?? d.ProducidoExterior ?? 0),
            producidoInterior: Number(d.producidoInterior ?? d.ProducidoInterior ?? 0),

            remanenteExterior: Number(d.remanenteExterior ?? d.RemanenteExterior ?? 0),
            remanenteInterior: Number(d.remanenteInterior ?? d.RemanenteInterior ?? 0),

            noConforme: Number(d.noConforme ?? d.NoConforme ?? 0),
            noConformeExterior: Number(d.noConformeExterior ?? d.NoConformeExterior ?? 0),
            noConformeInterior: Number(d.noConformeInterior ?? d.NoConformeInterior ?? 0),
        }));
    }

    // RANGO DE TEMPORADAS
    async getSeasonRange(plantId: number, temporada: number): Promise<SeasonRange | null> {
        if (!plantId || plantId <= 0) return null;
        if (!temporada) return null;

        const url = `/Dashboard/SeasonRange?plantId=${plantId}&temporada=${temporada}`;
        const { data } = await this.api.get<any>(url);

        if (!data) return null;

        return {
            temporada: String(data.temporada ?? data.Temporada ?? ""),
            fechaInicio: data.fechaInicio ?? data.FechaInicio ?? null,
            fechaFin: data.fechaFin ?? data.FechaFin ?? null,
        };
    }
}

export default DashboardService;