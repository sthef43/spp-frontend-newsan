import { IBaseEntity } from "app/models";
import { ICLIImpresionEtiquetas } from "./ICLIImpresionEtiquetas";
import { ICLIUbicacionSector } from "./ICLIUbicacionSector";
import { ICLIContenedorItemsRecepcionBloq } from "../Models/ICLIContenedorItemsRecepcionBloq";
import { ICLISectores } from "./ICLISectores";

export interface ICLIContendorItems extends IBaseEntity {
  lpnGenerada: string;
  articulo: string;
  id?: number;
  modelo?: string;
  semiElaborado?: string;
  numeroOp?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  deleted?: boolean;
  cantidadTotalItems: number | null;
  permisoAgregar: string;
  cantidadBateas?: number;
  cliUbicacionesSectoresId?: number | null;
  cliSectoresId?: number | null;
  cliSectores?: ICLISectores;
  cliImpresionEtiquetas?: ICLIImpresionEtiquetas[] | null;
  cliUbicacionesSectores?: ICLIUbicacionSector | null;
  cliContenedorItemsRecepcionBloq?: ICLIContenedorItemsRecepcionBloq[];
}
