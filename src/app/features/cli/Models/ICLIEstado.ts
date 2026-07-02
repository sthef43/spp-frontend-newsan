import { IBaseEntity } from "app/models";

export interface ICLIEstado extends IBaseEntity {
  nombre: string;
  descripcion?: string | null;
}
