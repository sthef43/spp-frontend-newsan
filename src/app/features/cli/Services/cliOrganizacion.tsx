import { ICLIOrganizacion } from "../Models/ICLIOrganizacion";
import { GenericService } from "app/services/generic.service";

export class cliOrganizacionService extends GenericService<ICLIOrganizacion> {
  Url = "CLIOrganizacion";
  constructor() {
    super("CLIOrganizacion");
  }
}
