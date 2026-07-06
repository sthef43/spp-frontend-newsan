import axios, { AxiosInstance } from "axios";

export type ReporteCalidadDailyDto = {
    fecha: string;
    producido: number;
    rechazado: number;
    fpy: number;
};

export type ReporteCalidadTopRechazoDto = {
    motivo: string;
    total: number;
};

export class ReporteCalidadService {
    private api: AxiosInstance;

    constructor() {
        const baseURL = (process.env.REACT_APP_API_URL ?? "").replace(/\/+$/, "");
        this.api = axios.create({ baseURL });
    }

    async getTarget(codigoNewsan2: number): Promise<number> {
        const { data } = await this.api.get<number>(
            `/ReporteCalidad/target?codigoNewsan2=${codigoNewsan2}`
        );
        return Number(data ?? 0);
    }

    async getDaily(params: {
        desde: string;
        hasta: string;
        codigoNewsan2: number;
        idLinea: number;
    }): Promise<ReporteCalidadDailyDto[]> {
        const { desde, hasta, codigoNewsan2, idLinea } = params;

        const url = `/ReporteCalidad/Daily?desde=${desde}&hasta=${hasta}&codigoNewsan2=${codigoNewsan2}&idLinea=${idLinea}`;
        const { data } = await this.api.get<any[]>(url);

        const list = Array.isArray(data) ? data : [];
        return list.map((d) => ({
            fecha: String(d.fecha ?? d.Fecha ?? ""),
            producido: Number(d.producido ?? d.Producido ?? 0),
            rechazado: Number(d.rechazado ?? d.Rechazado ?? 0),
            fpy: Number(d.fpy ?? d.FPY ?? 0),
        }));
    }

    async getTopRechazos(params: {
        desde: string;
        hasta: string;
        codigoNewsan2: string;
        top?: number;
    }): Promise<ReporteCalidadTopRechazoDto[]> {
        const { desde, hasta, codigoNewsan2, top = 10 } = params;

        const url = `/ReporteCalidad/TopRechazos?desde=${desde}&hasta=${hasta}&codigoNewsan2=${encodeURIComponent(
            codigoNewsan2
        )}&top=${top}`;

        const { data } = await this.api.get<any[]>(url);

        const list = Array.isArray(data) ? data : [];
        return list.map((d) => ({
            motivo: String(d.motivo ?? d.Motivo ?? ""),
            total: Number(d.total ?? d.Total ?? 0),
        }));
    }
}

export default ReporteCalidadService;