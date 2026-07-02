import { ISubRol } from "app/models/ISubRol";
import { GenericService } from "../../../services/generic.service";

export class SubRolService extends GenericService<ISubRol> {
  Url = "SubRol";
  constructor() {
    super("SubRol");
  }
}
