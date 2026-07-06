import { IDobladora } from "app/models/IDobladora";
import { GenericService } from "app/services/generic.service";

export class DobladoraService extends GenericService<IDobladora> {
  Url = "Dobladora";
  constructor() {
    super("Dobladora");
  }
}
