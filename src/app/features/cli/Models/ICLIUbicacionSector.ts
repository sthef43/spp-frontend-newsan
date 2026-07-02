import { IBaseEntity } from "app/models";
import { ICLIContendorItems } from "./ICLIContenedorItems";
import { ICLIImpresionEtiquetas } from "./ICLIImpresionEtiquetas";
import { ICLIOrganizacion } from "./ICLIOrganizacion";
import { ICLISectores } from "./ICLISectores";
import { ICLITipoUBC } from "./ICLITipoUBC";

export interface ICLIUbicacionSector extends IBaseEntity {
  cliTipoUBCId: number;
  cliOrganizacionId: number;
  cliSectoresId?: number;
  cliTipoUBC?: ICLITipoUBC | null;
  cliOrganizacion?: ICLIOrganizacion | null;
  cliContenedorItems?: ICLIContendorItems | null;
  cliImpresionEtiquetas?: ICLIImpresionEtiquetas | null;
  cliSectores?: ICLISectores | null;
  cliSubinventario?: string;
  localizador: string;
  estado: boolean;
}
