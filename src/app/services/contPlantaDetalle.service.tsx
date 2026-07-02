import { GenericService } from "./generic.service";
import { IContPlantaDetalle } from "app/models/IContPlantaDetalle";

export class ContPlantaDetalleService extends GenericService<IContPlantaDetalle> {
  Url = "ContPlantaDetalle";
  constructor() {
    super("ContPlantaDetalle");
  }
}
