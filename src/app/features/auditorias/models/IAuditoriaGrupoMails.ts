import { IBaseEntity, IPlant } from "app/models";

export interface IAuditoriaGrupoMails extends IBaseEntity {
  nombre: string;
  descripcion: string;
  plantId: number;
  plant: IPlant;
}
