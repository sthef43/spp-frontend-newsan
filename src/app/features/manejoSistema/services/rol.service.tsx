import { IRol } from "app/models/IRol";
import { GenericService } from "../../../services/generic.service";

export class RolService extends GenericService<IRol> {
  Url = "Rol";
  constructor() {
    super("Rol");
  }
}
