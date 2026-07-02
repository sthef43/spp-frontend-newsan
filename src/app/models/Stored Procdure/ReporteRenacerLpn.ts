export interface ReporteRenacerLpn {
    lpn: string
    modelo?: string
    totalProducido: string
    nombreEnvio?: string
    apellidoEnvio?: string
    nombreRecepcion?: string
    apellidoRecepcion?: string
    recepcionado?: boolean
    enviado?: boolean;
    fechaEnvio: string
    fechaRecepcion: string
}