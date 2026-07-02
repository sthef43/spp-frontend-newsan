import { GenericService } from "../../../services/generic.service";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";

export class OQCBloqueHallazgoService extends GenericService<IOQCBloqueHallazgo> {
  Url = "OQCBloqueHallazgo";
  constructor() {
    super("OQCBloqueHallazgo");
  }
}
