import { IBaseEntity } from "./IBaseEntity";

export interface IAuditComentario extends IBaseEntity {
  userDni: number;
  comentario: string;
  auditTrackingId?: number;
}
