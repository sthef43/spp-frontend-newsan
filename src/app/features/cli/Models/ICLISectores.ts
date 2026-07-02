import { IBaseEntity } from "app/models";
import { ICLIUbicacionSector } from "./ICLIUbicacionSector";

export interface ICLISectores extends IBaseEntity {
  jefeSector: string;
  cantidadStacks: number;
  nombreSector: string;
  cliUbicacionesSectores?: ICLIUbicacionSector[] | null;
}
