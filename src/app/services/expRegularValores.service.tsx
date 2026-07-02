import { IExpRegularValores } from "app/models/IExpRegularValores";
import { GenericService } from "./generic.service";

export class ExpRegularValoresService extends GenericService<IExpRegularValores> {
  Url = "ExpRegularValores";
  constructor() {
    super("ExpRegularValores");
  }
}
