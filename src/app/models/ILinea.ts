import { IPlant } from ".";

export interface ILinea {
  id?:number
  idLinea?: number | null;
  descripcion?: string | null;
  alias?: string | null;
  codigo?: string | null;
  tipo?: string | null;
  tipoUnidad?: string | null;
  codigoInicio?: string | null;
  codigoReparacion?: string | null;
  relacionaPlis?: string | null;
  relacionaEbs?: string | null;
  relacionaTrazabilidad?: string | null;
  utilizaReparPlis?: string | null;
  utilizaReparPlaqueta?: string | null;
  utilizaPareja?: string | null;
  estadoAndon?: string | null;
  fpy?: number | null;
  porcentajeFpy?: number | null;
  desvinculaEvaporador?: string | null;
  imprimeNroserie?: string | null;
  verficaMes?: string | null;
  testingLg?: string | null;
  testingLgCe?: string | null;
  accesrios?: string | null;
  loteSiguiente?: string;
  tipoProduccion?: string;
  activa?: boolean;
  plant?: IPlant
  plantId?: number;
}
