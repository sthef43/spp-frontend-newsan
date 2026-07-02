import { IFinalProduct } from "app/models/IFinalProduct";
import { GenericService } from "./generic.service";

export class FinalProductService extends GenericService<IFinalProduct> {
  Url = "FinalProduct";
  constructor() {
    super("FinalProduct");
  }
}
