import { ILineGeneric } from "app/models/ILineGeneric";
import { GenericService } from "./generic.service";

export class LineGenericService extends GenericService<ILineGeneric> {
  Url = "LineService";
  constructor() {
    super("LineService");
  }
}
