import { IBaseEntity } from "../../../../../models/IBaseEntity";
import { IDotacionModelo } from "./IDotacionModelo";
import { ILineaProduccion } from "../../../../../models/ILineaProduccion";
import { IProveedores } from "../../../../../models/IProveedores";
import { ITurno } from "app/models";
import { IDotacionGrupoSectores } from "./IDotacionGrupoSectores";
import { IDotacionTotales } from "./IDotacionTotales";

export interface IDotacion extends IBaseEntity {
  dotacionModeloId: number;
  dotacionModelo?: IDotacionModelo | null;
  proveedoresId?: number;
  proveedores?: IProveedores | null;
  lineaProduccionId?: number;
  lineaProduccion?: ILineaProduccion | null;
  potencia?: number;
  mañana?: number;
  tarde?: number;
  noche?: number;
  turnoMontaje?: number;
  turnoId?: number;
  turno?: ITurno;
  ritmoPauta: number;
  ritmoPlan: number;
  eficiencia?: number;
  dotacionGrupoSectoresId?: number;
  dotacionGrupoSectores?: IDotacionGrupoSectores;
  total?: number;
  dotacionTotales?: IDotacionTotales;
  sumatoriaTotal?: number;
}
