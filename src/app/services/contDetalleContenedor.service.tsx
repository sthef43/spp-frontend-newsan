import { GenericService } from "./generic.service";
import { IContDetalleContenedor } from "app/models/IContDetalleContenedor";

export class ContDetalleContenedorService extends GenericService<IContDetalleContenedor> {
  Url = "ContDetalleContenedor";
  constructor() {
    super("ContDetalleContenedor");
  }
}
