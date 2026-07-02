import { IContEmbarque } from "app/models/IContEmbarque";
import { GenericService } from "./generic.service";

export class ContEmbarqueService extends GenericService<IContEmbarque> {
  Url = "ContEmbarque";
  constructor() {
    super("ContEmbarque");
  }
}
