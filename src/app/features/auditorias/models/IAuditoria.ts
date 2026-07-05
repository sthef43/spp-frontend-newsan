import { IBaseEntity, IPlant, IRol } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IAuditoriaTipos } from "./IAuditoriaTipos";
import { IAuditoriaGrupoItemsResult } from "./IAuditoriaGrupoItemsResult";
import { IAuditoriaListaValoresResult } from "./IAuditoriaListaValoresResult";

export interface IAuditoria extends IBaseEntity {
  nombre: string;
  numeroRegistro: string;
  auditoriaMailGroup: string;
  tipoAuditoriaId: number;
  tipoAuditoria?: IAuditoriaTipos;
  auditoriaTipoId: number;
  rolId: number;
  rol?: IRol;
  plantId?: number;
  plant?: IPlant;
  lineaProduccionId?: number;
  lineaProduccion?: ILineaProduccion;
  auditoriaGrupoItemsResult?: IAuditoriaGrupoItemsResult[];
  auditoriaListaValoresResult?: IAuditoriaListaValoresResult;
}
