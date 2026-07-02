import { IProduct } from "app/models/IProduct";
import { GenericService } from "./generic.service";

export class ProductService extends GenericService<IProduct> {
  Url = "Product";
  constructor() {
    super("Product");
  }
}
