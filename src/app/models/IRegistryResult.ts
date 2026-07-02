import { IBaseEntity } from "./IBaseEntity";
import { IRegistry } from "./IRegistry";

export interface IRegistryResult extends IBaseEntity {
  registryId?: number | null;
  itemId?: number | null;
  value?: string;
  comentario?: string;
  bloqId?: number | null;
  valorId?: number | null;
  flagMail?: boolean | null;
  flagCriterio?: boolean | null;

  registry?: IRegistry;
}
