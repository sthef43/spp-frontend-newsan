import { IBaseEntity } from "app/models";
import { ICLIItems } from "./ICLIItems";
import { ICLISectores } from "./ICLISectores";

export interface ICLIImpresionEtiquetas extends IBaseEntity {
  cliItemsId: number | null;
  cliSectoresId: number | null;
  cliContenedorItemsId?: number | null;
  cliItems?: ICLIItems | null;
  cliSectores?: ICLISectores | null;
  cliUbicacionesSectoresId?: number | null;
  lpnGenerada: string | null;
  articulo: string | null;
  cantidad: number | null;
}
