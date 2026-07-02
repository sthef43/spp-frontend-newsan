import { IExit } from "app/models/IExit";
import { GenericService } from "./generic.service";

export class ExitService extends GenericService<IExit> {
  Url = "Exit";
  constructor() {
    super("Exit");
  }
}
