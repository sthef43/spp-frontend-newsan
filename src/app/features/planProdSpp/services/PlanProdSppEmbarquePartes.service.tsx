import { GenericService } from "app/services/generic.service";
import { IPlanProdSppEmbarquePartes } from "../models/IPlanProdSppEmbarquePartes";

export class PlanProdSppEmbarquePartesService extends GenericService<IPlanProdSppEmbarquePartes> {
  Url = "PlanProdSppEmbarquePartes";
  constructor() {
    super("PlanProdSppEmbarquePartes");
  }
}
