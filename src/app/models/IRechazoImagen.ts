import { IBaseEntity } from "./IBaseEntity";
import { IFamilia } from "./IFamilia";
import { ILineaProduccion } from "./ILineaProduccion";
import { IRechazoPuesto } from "./IRechazoPuesto";

export interface IRechazoImagen extends IBaseEntity {
  lineaProduccionId: number;
  lineaProduccion: ILineaProduccion;
  rechazoPuestoId: number;
  rechazoPuesto: IRechazoPuesto;
  familiaId: number;
  familia: IFamilia;
  imagenUrl: string;
  numerosColumnas: string;
  codigoRechazo: number;
}
