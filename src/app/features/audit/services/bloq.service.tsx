import { IBloq } from "app/models/IBloq";
import { GenericService } from "./generic.service";

export class BloqService extends GenericService<IBloq> {
  Url = "Bloq";
  constructor() {
    super("Bloq");
  }
}
