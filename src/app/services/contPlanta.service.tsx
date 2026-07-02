import { GenericService } from "./generic.service";
import { IContPlanta } from "app/models/IContPlanta";

export class ContPlantaService extends GenericService<IContPlanta> {
  Url = "ContPlanta";
  constructor() {
    super("ContPlanta");
  }
}
