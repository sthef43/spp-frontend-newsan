
import { GenericService } from "./generic.service";
import { ICalidadInspeccionTarea } from "app/models/ICalidadInspeccionTarea";

export class CalidadInspeccionTareaService extends GenericService<ICalidadInspeccionTarea> {
  Url = "CalidadInspeccionTarea";
  constructor() {
    super("CalidadInspeccionTarea");
  }
}
