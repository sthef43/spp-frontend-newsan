import { IDobProveedor } from "app/models/IDobProveedor";
import { GenericService } from "./generic.service";

export class DobProveedorService extends GenericService<IDobProveedor> {
  Url = "DobProveedor";
  constructor() {
    super("DobProveedor");
  }
}
