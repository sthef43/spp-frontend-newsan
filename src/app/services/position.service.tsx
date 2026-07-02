import { IPosition } from "app/models/IPosition";
import { GenericService } from "./generic.service";

export class PositionService extends GenericService<IPosition> {
  Url = "Position";
  constructor() {
    super("Position");
  }
}
