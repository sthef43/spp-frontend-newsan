import { IDobHHerramental } from "app/models/IDobHHerramental";
import { GenericService } from "./generic.service";

export class DobHHerramentalService extends GenericService<IDobHHerramental> {
  Url = "DobHHerramental";
  constructor() {
    super("DobHHerramental");
  }
}
