import { IDobHProveedor } from "app/models/IDobHProveedor";
import { GenericService } from "./generic.service";

export class DobHProveedorService extends GenericService<IDobHProveedor> {
  Url = "DobHProveedor";
  constructor() {
    super("DobHProveedor");
  }
}
