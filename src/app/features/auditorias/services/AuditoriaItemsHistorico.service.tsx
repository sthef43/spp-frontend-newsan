import { GenericService } from "app/services/generic.service";
import { IAuditoriaItemsHistorico } from "../models/IAuditoriaItemsHistorico";

export class AuditoriaItemsHistoricoService extends GenericService<IAuditoriaItemsHistorico> {
  Url = "AuditoriaItemsHistorico";
  constructor() {
    super("AuditoriaItemsHistorico");
  }
}
