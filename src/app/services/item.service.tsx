import { IItem } from "app/models/IItem";
import { GenericService } from "./generic.service";

export class ItemService extends GenericService<IItem> {
  Url = "Item";
  constructor() {
    super("Item");
  }
}
