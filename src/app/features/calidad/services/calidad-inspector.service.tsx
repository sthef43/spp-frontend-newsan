import { ICalidadInspector } from "app/models/ICalidadInspector";
import { GenericService } from "app/services/generic.service";

export class CalidadInspectorService extends GenericService<ICalidadInspector> {
  Url = "CalidadInspector";
  constructor() {
    super("CalidadInspector");
  }
}
