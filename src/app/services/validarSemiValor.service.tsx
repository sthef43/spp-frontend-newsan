import { IValidarSemiValor } from "app/models/IValidarSemiValor";
import { GenericService } from "./generic.service";

export class ValidarSemiValorService extends GenericService<IValidarSemiValor> {
  Url = "ValidarSemiValor";
  constructor() {
    super("ValidarSemiValor");
  }
}
