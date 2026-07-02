export interface InformeRechazos {
    id: number;
    barcode: string;
    linea: string;
    lineaId: number;
    estado: string;
    puesto: string;
    turno: string;
    fecha: string;
    hora: string;
    cantidadUnitaria: number;
    subComponente: string;
    componente: string;
    defecto: string;
    descripcionRechazo: string;
    //categoria: string;
    cantidadTotal: number;
}