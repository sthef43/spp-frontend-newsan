import { IBaseEntity } from "app/models";

export interface ICLIItems extends IBaseEntity {
  nombreItem: string;
  descripcion?: string | null;
  articulo?: string | null;
}
