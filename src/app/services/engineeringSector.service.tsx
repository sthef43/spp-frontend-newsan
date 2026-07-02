import { IEngineeringSector } from "app/models/IEngineeringSector";
import { GenericService } from "./generic.service";

export class EngineeringSectorService extends GenericService<IEngineeringSector> {
  Url = "EngineeringSector";
  constructor() {
    super("EngineeringSector");
  }
}
