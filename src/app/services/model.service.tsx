import { IModel } from "app/models/IModel";
import { GenericService } from "./generic.service";

export class ModelService extends GenericService<IModel> {
  Url = "Model";
  constructor() {
    super("Model");
  }
}
