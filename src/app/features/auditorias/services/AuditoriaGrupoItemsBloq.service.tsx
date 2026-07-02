import { GenericService } from "app/services/generic.service";
import { IAuditoriaGrupoItemsBloq } from "../models/IAuditoriaGrupoItemsBloq";

export class AuditoriaGrupoItemsBloqService extends GenericService<IAuditoriaGrupoItemsBloq> {
  constructor() {
    super("AuditoriaGrupoItemsBloq");
  }
}
