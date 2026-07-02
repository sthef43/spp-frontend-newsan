import { GenericService } from "app/services/generic.service";
import { IAuditoriaGrupoMails } from "../models/IAuditoriaGrupoMails";

export class AuditoriaGrupoMailsService extends GenericService<IAuditoriaGrupoMails> {
  constructor() {
    super("AuditoriaGrupoMails");
  }
}
