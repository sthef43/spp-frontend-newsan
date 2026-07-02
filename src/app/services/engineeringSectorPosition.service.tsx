import { IEngineeringSectorPosition } from "app/models/IEngineeringSectorPosition";
import { GenericService } from "./generic.service";

export class EngineeringSectorPositionService extends GenericService<IEngineeringSectorPosition> {
  Url = "EngineeringSectorPosition";
  constructor() {
    super("EngineeringSectorPosition");
  }
}
