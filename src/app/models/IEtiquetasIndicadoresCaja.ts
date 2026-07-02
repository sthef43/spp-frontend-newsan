import { IBaseEntity } from "./IBaseEntity";

export interface IEtiquetasIndicadoresCaja extends IBaseEntity {
  tipoDeModelo: string;
  codigoDelSet: string;
  marca: string;
  codigoEBS: string;
  capacidadFoC: string;
  descripcion: string;
  codSerialNumberLG: string;
  serialNumberLG: string;
  codigoBarraLogico: string;
  numeroEan13Logico: string;
  codigoBarraFisico: string;
  numeroEan13Fisico: string;
  apilado: string;
  dimensiones: string;
  pesoNeto: string;
  leyendaLegal: string;
}
