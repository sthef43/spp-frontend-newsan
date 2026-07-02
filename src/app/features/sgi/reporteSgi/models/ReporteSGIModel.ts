import { IBaseEntity } from "app/models";


export interface ReporteSGIFilterDTO {
    año?: string;
    mes?: string;
    dia?: string;
    modelo?: string;
    linea?: string;
    planta?: string
}

export interface IReporteSGI extends IBaseEntity {
    año: string;
    mes: string;
    dia: string;
    turno: string;
    planta: string;
    linea: string;
    modelo: string;
    producido: string;
    rechazosFPY: string;
    cantPrimerProblemaFPY: string;
    problemaFPY: string;
    accionProblemaFPY?: string;
    muestreo: string;
    rechazosOQC: string;
    categoria: string;
    problemaOQC?: string;
    causaOQC?: string;
    accionOQC?: string;
    hallazgosOQC: string;
    rechazosFPYReporte: string;
    guidId?: string,
    repetido?: boolean
}
export interface ReporteSGIExcel {
    AÑO: string;
    MES: string;
    DIA: string;
    TURNO: string;
    PLANTA: string;
    LINEA: string;
    MODELO: string;
    PRODUCIDO: string;
    "RECHAZOS FPY": string;
    "Cant 1er Problema FPY": string;
    "Problema FPY": string;
    "Acción Problema FPY": string;
    Muestreo: string;
    "RECHAZOS OQC": string;
    Categoría: string;
    "Problema OQC": string;
    Causa: string;
    "Acción OQC": string;
    "Hallazgos OQC": string;
    "Rechazos FPY reporte": string;
}
export class ReporteSGIModel implements IReporteSGI {

    año: string;
    mes: string;
    dia: string;
    turno: string;
    planta: string;
    linea: string;
    modelo: string;
    producido: string;
    rechazosFPY: string;
    cantPrimerProblemaFPY: string;
    problemaFPY: string;
    accionProblemaFPY?: string;
    muestreo: string;
    rechazosOQC: string;
    categoria: string;
    problemaOQC?: string;
    causaOQC?: string;
    accionOQC?: string;
    hallazgosOQC: string;
    rechazosFPYReporte: string;
    guidId?: string
    repetido?: boolean = false;


    constructor(data: IReporteSGI
    ) {
        const crypto: any = window.crypto as any
        this.guidId = crypto.randomUUID()
        this.año = data.año;
        this.mes = data.mes ? data.mes.toUpperCase() : data.mes;
        this.dia = data.dia;
        this.turno = data.turno ? data.turno.toUpperCase() : data.turno;
        this.planta = data.planta;
        this.linea = data.linea ? data.linea.toUpperCase() : data.linea;
        this.modelo = data.modelo ? data.modelo.toUpperCase() : data.modelo;
        this.producido = data.producido;
        this.rechazosFPY = data.rechazosFPY;
        this.cantPrimerProblemaFPY = data.cantPrimerProblemaFPY;
        this.problemaFPY = data.problemaFPY;
        this.accionProblemaFPY = data.accionProblemaFPY;
        this.muestreo = data.muestreo;
        this.rechazosOQC = data.rechazosOQC;
        this.categoria = data.categoria;
        this.problemaOQC = data.problemaOQC;
        this.causaOQC = data.causaOQC;
        this.accionOQC = data.accionOQC;
        this.hallazgosOQC = data.hallazgosOQC;
        this.rechazosFPYReporte = data.rechazosFPYReporte;
    }

}

