import { ICLITipoUBC } from "../Models/ICLITipoUBC";
import { GenericService } from "app/services/generic.service";

export class CLITipoUBCService extends GenericService<ICLITipoUBC> {
  Url = "CLITipoUBC";
  constructor() {
    super("CLITipoUBC");
  }
}
