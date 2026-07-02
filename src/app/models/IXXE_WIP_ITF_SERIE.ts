export interface IXXE_WIP_ITF_SERIE {
  id?: number;
  iD_TRAZABILIDAD?: number;
  organizatioN_CODE: string;
  nrO_OP: string;
  nrO_INFORME?: number;
  nrO_SERIE?: string;
  codigO_PRODUCTO: string;
  cantidad: number;
  lpn?: string;
  referenciA_1?: string;
  referenciA_2?: string;
  oem?: string;
  parT_NUMBER?: string;
  lpN_CANT?: number;
  fechA_PROCESO?: Date;
  tranS_OK: number;
  ebS_ERROR_DESC?: string;
  ebS_ERROR_TRANS?: string;
  fechA_INSERCION: Date;
  usuario?: string;
  oP_REFRESH?: number;
  transDetalles?: string | null;
  estado?: string;
}
