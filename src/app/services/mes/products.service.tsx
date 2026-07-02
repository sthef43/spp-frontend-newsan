import { IProducts } from "app/models/mes/IProducts";
import { GenericMesService } from "./genericMes.service";

export class ProductsService extends GenericMesService<IProducts> {
  Url = "Products";
  constructor() {
    super("Products");
  }
}
