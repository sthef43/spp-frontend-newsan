import { IListaValores } from "app/models/IListaValores";
import { GenericService } from "./generic.service";

export class ListaValoresService extends GenericService<IListaValores> {
  Url = "ListaValores";
  constructor() {
    super("ListaValores");
  }
}
