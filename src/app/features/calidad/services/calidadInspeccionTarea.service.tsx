import { ICalidadInspeccionTarea } from "app/models/ICalidadInspeccionTarea";
import { GenericService } from "app/services/generic.service";

export class CalidadInspeccionTareaService extends GenericService<ICalidadInspeccionTarea> {
  Url = "CalidadInspeccionTarea";
  constructor() {
    super("CalidadInspeccionTarea");
  }
}
