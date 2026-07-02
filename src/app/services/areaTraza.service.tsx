import { IAreaTraza } from "app/models/IAreaTraza";
import { GenericService } from "./generic.service";

export class AreaTrazaService extends GenericService<IAreaTraza> {
  Url = "AreaTraza";
  constructor() {
    super("AreaTraza");
  }
}
