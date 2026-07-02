import { GenericService } from "./generic.service";
import { IOrganizacion } from "app/models/IOrganizacion";

export class OrganizacionService extends GenericService<IOrganizacion> {
  Url = "Organizacion";
  constructor() {
    super("Organizacion");
  }
}
