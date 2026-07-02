import { IEngineeringSectorLineGeneric } from "app/models/IEngineeringSectorLineGeneric";
import { GenericService } from "./generic.service";

export class EngineeringSectorLineGenericService extends GenericService<IEngineeringSectorLineGeneric> {
  Url = "EngineeringSectorLineGeneric";
  constructor() {
    super("EngineeringSectorLineGeneric");
  }
}
