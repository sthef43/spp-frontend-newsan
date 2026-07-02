import { IArea } from "app/models/IArea";
import { GenericService } from "./generic.service";

export class AreaService extends GenericService<IArea> {
  Url = "Area";
  constructor() {
    super("Area");
  }
}
