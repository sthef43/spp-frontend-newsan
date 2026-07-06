import { ISector } from "app/models/ISector";
import { GenericService } from "./generic.service";

export class SectorService extends GenericService<ISector> {
  Url = "Sector";
  constructor() {
    super("Sector");
  }
}
