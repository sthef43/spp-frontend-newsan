import { GenericService } from "app/services/generic.service";
import { SEH_EPP } from "../interfaces/SEH_EPP";

export class SEH_EPPServices extends GenericService<SEH_EPP> {
  constructor() {
    super("SEHEPP");
  }
}
