import { IAuditoria } from "../IAuditoria";
import { IAuditoriaGrupoItemsResult } from "../IAuditoriaGrupoItemsResult";
import { IAuditoriaItems } from "../IAuditoriaItems";
import { IAuditoriaListaValores } from "../IAuditoriaListaValores";
import { IAuditoriaAsignada } from "../IAuditoriaAsignada";
import { IAuditoriaValores } from "../IAuditoriaValores";
import { IAuditoriaValoresResult } from "../IAuditoriaValoresResult";

export interface AuditoriaEntidadesDTO {
  auditoriaListaValores: IAuditoriaListaValores;
  auditoriaValores: IAuditoriaValores[];
  auditoriaGrupoItems?: IAuditoriaGrupoItemsResult[];
  auditoriaItems?: IAuditoriaItems[];
  auditoria?: IAuditoria;
  auditoriaAsignada?: IAuditoriaAsignada;
}

export interface AuditoriaEditDTO {
  auditoriaValores: IAuditoriaValoresResult[];
  auditoriaGrupoItems: IAuditoriaGrupoItemsResult[];
  auditoriaAsignada: IAuditoriaAsignada;
}
