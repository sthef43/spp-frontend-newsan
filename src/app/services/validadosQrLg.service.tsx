import { GenericService } from "./generic.service";
import { IValidadosQrLg } from "app/models/IValidadosQrLg";

export class ValidadosQrLgService extends GenericService<IValidadosQrLg> {
  Url = "ValidadosQrLg";
  constructor() {
    super("ValidadosQrLg");
  }
}
