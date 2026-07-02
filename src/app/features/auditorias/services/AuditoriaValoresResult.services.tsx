import { GenericService } from "app/services/generic.service";
import { IAuditoriaValoresResult } from "../models/IAuditoriaValoresResult";

export class AuditoriaValoresResultService extends GenericService<IAuditoriaValoresResult> {
  Url = "AuditoriaValoresResult";
  constructor() {
    super("AuditoriaValoresResult");
  }
}
