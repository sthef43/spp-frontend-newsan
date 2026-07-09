import { IProducto } from "app/models/IProducto";
import { GenericService } from "./generic.service";

export class ProductoService extends GenericService<IProducto> {
  Url = "Producto";
  constructor() {
    super("Producto");
  }
}
