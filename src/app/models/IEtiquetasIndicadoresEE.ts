import { IBaseEntity } from "./IBaseEntity";

export interface IEtiquetasIndicadoresEE extends IBaseEntity {
  tipoDeModelo: string;
  codigoEBS: string;
  marca: string;
  marcaAcondicionadorAire?: string;
  modeloInt?: string;
  modeloExt?: string;
  modeloTipo?: string;
  modeloTipoCompacto?: string;
  claseDeEE?: string;
  indiceDeEEE?: string;
  tipoPrestacionRefri?: string;
  tipoPrestacionRefriCalor?: string;
  coeficientePerformane?: string;
  numCertificado?: string;
  consumoEAnual?: string;
  capRefri?: string;
  claseEE?: string;
  escalaClaseEE?: string;
  consumoEAnualCalefaccion?: string;
  capCalefaccion?: string;
}
