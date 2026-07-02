import { ISubTipo } from "app/models/ISubTipo";
import { GenericService } from "./generic.service";

export class SubTipoService extends GenericService<ISubTipo> {
  Url = "SubTipo";
  constructor() {
    super("SubTipo");
  }
}
