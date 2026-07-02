import { IItemBloq } from "app/models/IItemBloq";
import { GenericService } from "./generic.service";

export class ItemBloqService extends GenericService<IItemBloq> {
  Url = "ItemBloq";
  constructor() {
    super("ItemBloq");
  }
}
