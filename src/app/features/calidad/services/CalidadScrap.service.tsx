import axios, { AxiosInstance } from "axios";
export type SaveMode = "replace" | "append";

export interface ScrapRow {
    PlantId: number;
    Etiqueta: string;
    ORG: string;
    OP: string;
    Modelo: string;
    Linea: string;
    Lote: string;
    Item: string;
    Descripcion: string;
    Puesto: string;
    Motivo: string;
    Cantidad: number | null;
    UDM: string;
    Fecha: string; // "YYYY-MM-DD"
    Usuario: string;
    Impresora: string;
    SubinvOrigen: string;
    SubinvDestino: string;
    SubinvActual: string;
    Semana: number | null;
    CostoUnitario: number | null;
    CostoTotal: number | null;

    // --- vienen desde la BD (los setean los SPs) ---
    Temporada?: number | null;
    Sector?: string | null;
}

export interface SaveScrapResponse {
    ok: boolean;
    rows: number;
    plantId: number;
    mode: SaveMode;
}

// --------- Service ---------
export class CalidadScrapService {
    private api: AxiosInstance;

constructor() {
const baseURL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
this.api = axios.create({ baseURL });
}

    async saveScrap(rows: ScrapRow[], mode: SaveMode = "replace"): Promise<SaveScrapResponse> {
        if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error("No hay filas para guardar.");
        }
        const plantId = rows[0]?.PlantId;
        if (!plantId || plantId <= 0) {
            throw new Error("Falta PlantId en las filas.");
        }

        const url = `/CalidadScrap/SaveScrap?mode=${mode}`;
        try {
            const { data } = await this.api.post<SaveScrapResponse>(url, rows, {
                headers: { "Content-Type": "application/json" },
            });
            return data;
        } catch (err: any) {
            const msg = err?.response?.data ?? err?.message ?? "Error guardando ScrapEBS.";
            throw new Error(msg);
        }
    }

    async getByPlant(plantId: number): Promise<ScrapRow[]> {
        if (!plantId || plantId <= 0) throw new Error("PlantId inválido.");
        const url = `/CalidadScrap/ByPlant/${plantId}`;
        try {
            const { data } = await this.api.get<ScrapRow[]>(url);
            return data ?? [];
        } catch (err: any) {
            const msg = err?.response?.data ?? err?.message ?? "Error obteniendo datos por planta.";
            throw new Error(msg);
        }
    }

    // Alias de compatibilidad (si existía)
    async upsertRowsJson(_plantId: number, rows: any[], mode: SaveMode = "replace") {
        return this.saveScrap(rows as ScrapRow[], mode);
    }
}
