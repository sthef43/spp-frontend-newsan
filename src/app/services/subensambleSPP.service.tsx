import { ISubensambleSPP } from "app/models/ISubensambleSPP";
import { GenericService } from "./generic.service";

export class SubensambleSPPService extends GenericService<ISubensambleSPP> {
  Url = "SubensambleSPP";
  constructor() {
    super("SubensambleSPP");
  }
}
