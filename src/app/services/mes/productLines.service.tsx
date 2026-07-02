import { IProductLines } from "app/models/mes/IProductLines";
import { GenericMesService } from "./genericMes.service";

export class ProductLinesService extends GenericMesService<IProductLines> {
  Url = "ProductLines";
  constructor() {
    super("ProductLines");
  }
}
