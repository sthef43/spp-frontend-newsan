export interface ISuperCargalinea {
  cargado?: any;
  idSupercargalinea?: number | null;
  puesto?: number | null;
  gaveta?: number | null;
  codigoPautas?: string | null;
  codigoWip?: string | null;
  descripSector?: string | null;
  descripcion?: string | null;
  alternativo1?: string | null;
  alternativo2?: string | null;
  fecha?: Date | null;
  hora?: string;
  codigoModelo?: string | null;
  lote?: string | null;
  numeroOp?: string | null;
  generico?: string | null;
  usuario?: string | null;
  area?: string | null;
  cantidadMaterial?: number | null;
  stockGaveta?: number | null;
  stockSeguridad?: number | null;
  idLinea?: number | null;
  deleted?: boolean | false;
}
