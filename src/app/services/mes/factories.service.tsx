import { IFactories } from "app/models/mes/IFactories";
import { GenericMesService } from "./genericMes.service";

export class FactoriesService extends GenericMesService<IFactories> {
  Url = "Factories";
  constructor() {
    super("Factories");
  }
}
