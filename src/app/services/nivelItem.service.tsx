import { INivelItem } from "app/models/INivelItem";
import { GenericService } from "./generic.service";

export class NivelItemService extends GenericService<INivelItem> {
  Url = "NivelItem";
  constructor() {
    super("NivelItem");
  }
}
