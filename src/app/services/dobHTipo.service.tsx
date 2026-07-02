import { IDobHTipo } from "app/models/IDobHTipo";
import { GenericService } from "./generic.service";

export class DobHTipoService extends GenericService<IDobHTipo> {
  Url = "DobHTipo";
  constructor() {
    super("DobHTipo");
  }
}
