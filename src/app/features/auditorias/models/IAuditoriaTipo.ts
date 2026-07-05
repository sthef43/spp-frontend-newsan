import { IBaseEntity, IPlant, IRol } from "app/models";

export interface IAuditoriaTipo extends IBaseEntity {
  nombre: string;
  descripcion: string;
  rolId: number;
  rol?: IRol;
  plantId: number;
  plant?: IPlant;
}
