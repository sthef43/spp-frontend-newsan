import { IBaseEntity, IPlant } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IModelo } from "app/models/IModelo";
import { IPlanProdSppEmbarquesBloque } from "./IPlanProdSppEmbarqueBloque";
import { IDotacionModelo } from "app/features/ingenieria/modules/dotacionMantenimiento/models/IDotacionModelo";

export interface IPlanProdSpp extends IBaseEntity {
  empresa: string;
  lote: string;
  cantidad: number;
  po: string;
  remanente: string;
  opMontaje?: string;
  opImDisplay?: string;
  opImMain?: string;
  opSub?: string;
  obs?: string;
  estado: string;
  observaciones: string;
  ritmo: number;
  organizationCode?: string;
  position?: number;
  mes?: string;
  anio?: number;
  produciendo: boolean;
  lineaProduccionId: number;
  lineaProduccion?: ILineaProduccion;
  plantId: number;
  plant?: IPlant;
  dotacionModeloId?: number;
  dotacionModelo?: IDotacionModelo;
  modeloId?: number;
  modelo?: IModelo;
  planProdSppEmbarqueBloque?: IPlanProdSppEmbarquesBloque[];
}
