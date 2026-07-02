import { IBaseEntity } from "./IBaseEntity";
import { ILineaProduccion } from "./ILineaProduccion";

export interface IOQCModelo extends IBaseEntity {
  lineaProduccionId: number;
  lineaProduccion: ILineaProduccion;
  modeloMoto: string;
  modeloNewsan: string;
  compania: string;
  eanCode: string;
  activo: boolean
}
