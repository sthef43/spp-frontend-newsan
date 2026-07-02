import { IUnitMeasurement } from "app/models/IUnitMeasurement";
import { GenericService } from "./generic.service";

export class UnitMeasurementService extends GenericService<IUnitMeasurement> {
  Url = "UnitMeasurement";
  constructor() {
    super("UnitMeasurement");
  }
}
