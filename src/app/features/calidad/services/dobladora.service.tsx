import { GenericService } from "app/services/generic.service";
import { IDobladora } from "../models/IDobladora";

export class DobladoraService extends GenericService<IDobladora> {
  Url = "Dobladora";
  constructor() {
    super("Dobladora");
  }
}
