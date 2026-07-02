import { IBaseEntity } from "./IBaseEntity";
import { IEmailGroup } from "./IEmailGroup";
import { IOQCBloqueGroup } from "./IOQCBloqueGroup";
import { IOQCDesignada } from "./IOQCDesignada";
import { IProducto } from "./IProducto";

export interface IOQC extends IBaseEntity {
  nombre: string;
  emailGroupId: number;
  emailGroup?: IEmailGroup;
  productoId: number;
  producto?: IProducto;
  validarNumSerie: boolean;
  email: boolean;
  emailNG: boolean;
  numeroRegistro?: string;
  versionado?: string;
  // Deifinido por db en false, solo se cambia manual
  botonBloque: boolean;
  oqcBloqueGroup?: IOQCBloqueGroup[];
  oqcDesignada?: IOQCDesignada[];
}
