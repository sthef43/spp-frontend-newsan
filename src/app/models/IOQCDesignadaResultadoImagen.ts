import { IBaseEntity } from "./IBaseEntity";
import { IOQCBloqueGroup } from "./IOQCBloqueGroup";
import { IOQCDesignadaResultado } from "./IOQCDesignadaResultado";

export interface IOQCDesignadaResultadoImagen extends IBaseEntity {
  imagenUrl: string | ArrayBuffer;
  oqcBloqueGroupId: number;
  oqcBloqueGroup?: IOQCBloqueGroup;
  oqcDesignadaResultadoId?: number;
  oqcDesignadaResultado?: IOQCDesignadaResultado;
  image?: any;
}
