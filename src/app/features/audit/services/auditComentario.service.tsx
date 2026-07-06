import { IAuditComentario } from "app/models/IAuditComentario";
import { GenericService } from "./generic.service";

export class AuditComentarioService extends GenericService<IAuditComentario> {
  url = "AuditComentario";
  constructor() {
    super("AuditComentario");
  }
}
