import { IDobSemi } from "app/models/IDobSemi";
import { GenericService } from "./generic.service";

export class DobSemiService extends GenericService<IDobSemi> {
  Url = "DobSemi";
  constructor() {
    super("DobSemi");
  }
}
