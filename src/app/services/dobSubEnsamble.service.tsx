import { IDobSubEnsamble } from "app/models/IDobSubEnsamble";
import { GenericService } from "./generic.service";

export class DobSubEnsambleService extends GenericService<IDobSubEnsamble> {
  Url = "DobSubEnsamble";
  constructor() {
    super("DobSubEnsamble");
  }
}
