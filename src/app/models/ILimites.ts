import { IAtornilladoraAlim } from "./IAtornilladoraAlim";
import { IAtornilladoraFormato } from "./IAtornilladoraFormato";
import { IBaseEntity } from "./IBaseEntity";
import { IColor } from "./IColor";
import { IGenerico } from "./IGenerico";
import { IInstpuesto } from "./IInstpuesto";

export interface ILimites extends IBaseEntity {
  codigoTrazabilidad?: string | null;
  numeroPuesto?: number | null;
  identificadorLinea?: number | null;
  idGenerico?: number | null;
  instpuestoId?: number | null;
  torque?: number | null;
  torqueMinimo?: number | null;
  torqueMaximo?: number | null;
  tolerancia?: number | null;
  idColor?: number | null;
  idAtornilladoraAlim?: number | null;
  idAtornilladoraFormato?: number | null;
  atornilladoraModelo?: string | null;
  codigoPuesto?: string | null;
  version?: number | null;
  descripcion?: string | null;
  observaciones?: string | null;
  idAtornilladoraAlimNavigation?: IAtornilladoraAlim | null;
  idAtornilladoraFormatoNavigation?: IAtornilladoraFormato | null;
  idColorNavigation?: IColor | null;
  idGenericoNavigation?: IGenerico | null;
  instpuesto?: IInstpuesto | null;
}
