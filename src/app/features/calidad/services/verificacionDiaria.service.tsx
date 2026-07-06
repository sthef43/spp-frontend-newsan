import axios, { AxiosInstance } from "axios";

export type MaquinaTestDto = {
    id: number;
    idPlanta: number;
    idLinea: number;
    numeroSerie: string;
    marca: string;
    modelo: string;
    pn?: string | null;
    fechaFabricacion?: string | null;
    activoFijoCodigo?: string | null;
    activo: boolean;
};

export type SeguridadElectricaConfigDto = {
    id: number;
    idLinea: number;
    marca: string;
    modelo: string;
};

export type CreateSeguridadElectricaRegistroDto = {
    IdLinea: number;
    Fecha: string; // yyyy-MM-dd

    IdMaquinaTest: number;
    MaquinaTestNumeroSerie: string;

    EarthBond_SetInf: boolean;
    EarthBond_Pasa: boolean;
    EarthBond_Result: boolean;

    Withstanding_KVoltsAC: string;
    Withstanding_TSeg: string;
    Withstanding_Result: boolean;

    Insulation_VoltsDC: string;
    Insulation_TSeg: string;
    Insulation_Result: boolean;

    Instrumento: string;
    FechaVencimiento?: string | null;

    IdAuditorUser: number; // por ahora hardcode 
};

export class VerificacionDiariaService {
    private api: AxiosInstance;

    constructor() {
        const baseURL = (process.env.REACT_APP_API_URL ?? "").replace(/\/+$/, "");
        this.api = axios.create({ baseURL });
    }

    async getMaquinaActivaByPlantaLinea(idPlanta: number, idLinea: number): Promise<MaquinaTestDto | null> {
        if (!idPlanta || !idLinea) return null;

        try {
            const url = `/MaquinasTest/by-linea?idPlanta=${idPlanta}&idLinea=${idLinea}`;
            const { data } = await this.api.get<any>(url);
            if (!data) return null;

            return {
                id: Number(data.id ?? data.Id ?? 0),
                idPlanta: Number(data.idPlanta ?? data.IdPlanta ?? 0),
                idLinea: Number(data.idLinea ?? data.IdLinea ?? idLinea),
                numeroSerie: String(data.numeroSerie ?? data.NumeroSerie ?? ""),
                marca: String(data.marca ?? data.Marca ?? ""),
                modelo: String(data.modelo ?? data.Modelo ?? ""),
                pn: (data.pn ?? data.PN ?? null) as any,
                fechaFabricacion: (data.fechaFabricacion ?? data.FechaFabricacion ?? null) as any,
                activoFijoCodigo: (data.activoFijoCodigo ?? data.ActivoFijoCodigo ?? null) as any,
                activo: Boolean(data.activo ?? data.Activo ?? true),
            };
        } catch (e: any) {
            if (e?.response?.status === 404) return null;
            throw e;
        }
    }

    // CONFIG (Marca/Modelo) por línea
    async getSegElectricaConfig(idLinea: number): Promise<SeguridadElectricaConfigDto | null> {
        if (!idLinea) return null;

        try {
            const url = `/SeguridadElectrica/Config?idLinea=${idLinea}`;
            const { data } = await this.api.get<any>(url);
            if (!data) return null;

            return {
                id: Number(data.id ?? data.Id ?? 0),
                idLinea: Number(data.idLinea ?? data.IdLinea ?? idLinea),
                marca: String(data.marca ?? data.Marca ?? ""),
                modelo: String(data.modelo ?? data.Modelo ?? ""),
            };
        } catch (e: any) {
            if (e?.response?.status === 404) return null;
            throw e;
        }
    }

    // REGISTRO 
    async getSegElectricaRegistro(idLinea: number, fechaISO: string): Promise<any | null> {
        if (!idLinea || !fechaISO) return null;

        try {
            const url = `/SeguridadElectrica/Registro?idLinea=${idLinea}&fecha=${fechaISO}`;
            const { data } = await this.api.get<any>(url);
            return data ?? null;
        } catch (e: any) {
            if (e?.response?.status === 404) return null;
            throw e;
        }
    }

    async createSegElectricaRegistro(payload: CreateSeguridadElectricaRegistroDto): Promise<number> {
        const url = `/SeguridadElectrica/Registro`;
        const { data } = await this.api.post<any>(url, payload);
        return Number(data?.Id ?? data?.id ?? 0);
    }
}

export default VerificacionDiariaService;