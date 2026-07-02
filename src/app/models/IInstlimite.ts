import { IInstpuesto } from "./IInstpuesto";

export interface IInstlimite {
  idInstlimite?: number | null;
  codigoTrazabilidad?: string | null;
  codigoPuesto?: string | null;
  idLinea?: number | null;
  fecha?: string | null;
  generico?: string | null;
  torqueMinimo?: number | null;
  torqueMaximo?: number | null;
  observaciones?: string | null;
  color?: string | null;
  atornilladoraAlimen?: string | null;
  atornilladoraFormat?: string | null;
  idInstpuesto?: number | null;
  instpuesto?: IInstpuesto;
  codigo?: string | null;
  version?: string | null;
  codigoInicio?: string | null;
  atornilladoraModelo?: string | null;
  idGenerico?: number | null | null;
  descripcion?: string | null;
  torque?: number | null;
  tolerancia?: number | null;
}
