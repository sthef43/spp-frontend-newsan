import { GenericService } from "../../../services/generic.service";
import { IOQCPonderacion } from "app/models/IOQCPonderacion";

export class OQCPonderacionService extends GenericService<IOQCPonderacion> {
  Url = "OQCPonderacion";
  constructor() {
    super("OQCPonderacion");
  }
}
