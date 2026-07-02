import { IPlant } from "app/models/IPlant";
import { GenericService } from "./generic.service";

export class PlantService extends GenericService<IPlant> {
  Url = "Plant";
  constructor() {
    super("Plant");
  }
}
