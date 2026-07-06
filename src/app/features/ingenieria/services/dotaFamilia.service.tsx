import { GenericService } from "./generic.service";
import { IDotaFamilia } from "app/models/IDotaFamilia";

export class DotaFamiliaService extends GenericService<IDotaFamilia> {
  url = "DotaFamilia";
  constructor() {
    super("DotaFamilia");
  }
}
