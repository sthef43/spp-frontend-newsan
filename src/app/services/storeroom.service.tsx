import { IStoreroom } from "app/models/IStoreroom";
import { GenericService } from "./generic.service";

export class StoreroomService extends GenericService<IStoreroom> {
  Url = "Storeroom";
  constructor() {
    super("Storeroom");
  }
}
