import { IDobHDiametroTubo } from "app/models/IDobHDiametroTubo";
import { GenericService } from "./generic.service";

export class DobHDiametroTuboService extends GenericService<IDobHDiametroTubo> {
  Url = "DobHDiametroTubo";
  constructor() {
    super("DobHDiametroTubo");
  }
}
