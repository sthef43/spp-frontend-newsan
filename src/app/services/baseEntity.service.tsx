import { IBaseEntity } from "app/models/IBaseEntity";
import { GenericService } from "./generic.service";

export class BaseEntityService extends GenericService<IBaseEntity> {
  Url = "BaseEntity";
  constructor() {
    super("BaseEntity");
  }
}
