import { IBateriasCodigo } from "app/features/baterias/models/IBateriasCodigo";
import { GenericService } from "../../../services/generic.service";

export class BateriasCodigoService extends GenericService<IBateriasCodigo> {
  Url = "BateriasCodigo";
  constructor() {
    super("BateriasCodigo");
  }
}
