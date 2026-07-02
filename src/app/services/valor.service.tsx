import { IValor } from "app/models/IValor";
import { GenericService } from "./generic.service";

export class ValorService extends GenericService<IValor> {
  Url = "Valor";
  constructor() {
    super("Valor");
  }
}
