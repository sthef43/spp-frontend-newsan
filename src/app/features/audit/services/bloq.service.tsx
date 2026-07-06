import { IBloq } from "app/models/IBloq";
import { GenericService } from "app/services/generic.service";

export class BloqService extends GenericService<IBloq> {
  Url = "Bloq";
  constructor() {
    super("Bloq");
  }
}
