import { IBaseEntity, IOperator } from "app/models";
import { ICLIContendorItems } from "./ICLIContenedorItems";
import { ICLISectores } from "./ICLISectores";

export interface ICLIContenedorItemsRecepcionBloq extends IBaseEntity {
  cliContenedorItemsId: number;
  cliSectoresId?: number;
  cliSectores?: ICLISectores;
  operatorId?: number;
  cliContenedorItems?: ICLIContendorItems;
  operator?: IOperator;
  recepcion: string;
  mensajeRechazo?: string;
}
