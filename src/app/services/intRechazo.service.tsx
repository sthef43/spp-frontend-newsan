import { IIntRechazo } from "app/models/IIntRechazo";
import { GenericService } from "./generic.service";

export class IntRechazoService extends GenericService<IIntRechazo> {
  Url = "IntRechazo";
  constructor() {
    super("IntRechazo");
  }
}
