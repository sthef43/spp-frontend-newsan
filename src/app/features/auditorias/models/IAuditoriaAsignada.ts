import { IBaseEntity, IPlant, IRol, ISubRol, ITurno } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IAuditoria } from "./IAuditoria";
import { IAuditoriaGrupoItemsResult } from "./IAuditoriaGrupoItemsResult";
import { IAuditoriaListaValoresResult } from "./IAuditoriaListaValoresResult";

export interface IAuditoriaAsignada extends IBaseEntity {
  nombre: string;
  numeroRegistro: string;
  auditoriaMailGroup: string;
  cantidadMuestrasOriginal?: number;
  cantidadMuestras: number;
  rolId: number;
  rol?: IRol;
  subRolId: number;
  subRol?: ISubRol;
  turnoId: number;
  turno?: ITurno;
  lineaProduccionId: number;
  lineaProduccion?: ILineaProduccion;
  auditoriaId: number;
  auditoria?: IAuditoria;
  plantId: number;
  plant?: IPlant;
  auditoriaListaValoresResult?: IAuditoriaListaValoresResult;
  auditoriaGrupoItemsResult?: IAuditoriaGrupoItemsResult[];
}
