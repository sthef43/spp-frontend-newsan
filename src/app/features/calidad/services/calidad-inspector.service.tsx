
import { ICalidadInspector } from "app/models/ICalidadInspector";
import { GenericService } from "./generic.service";


export class CalidadInspectorService extends GenericService<ICalidadInspector> {
  Url = "CalidadInspector";
  constructor() {
    super("CalidadInspector");
  }
}
