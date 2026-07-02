import { IRoutesAyudaPadres } from "app/features/ayuda/models/IRoutesAyudaPadres";
import { GenericService } from "../../../services/generic.service";

export class RoutesAyudaPadresService extends GenericService<IRoutesAyudaPadres> {
  Url = "RoutesAyudaPadre";
  constructor() {
    super("RoutesAyudaPadre");
  }
}
