import { ILista } from "app/models/ILista";
import { GenericService } from "./generic.service";

export class ListaService extends GenericService<ILista> {
  Url = "Lista";
  constructor() {
    super("Lista");
  }
}
