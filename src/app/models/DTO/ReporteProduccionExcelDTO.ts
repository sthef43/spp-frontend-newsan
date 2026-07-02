export interface ReporteProduccionExcelDTO {
  modelo: string;
  linea: string;
  prefijo: string;
  lote: number;
  numeroOp: string;
  cantidad: number;
  target: number;
  producidos: number;
  noConformes: number;
  familia: string;
  fecha: string;
}
