import { GenericService } from "app/services/generic.service";
import { IPlanProdSppMes } from "../models/IPlanProdSppMes";

export class PlanProdSppMesService extends GenericService<IPlanProdSppMes> {
  Url = "PlanProdSppMes";
  constructor() {
    super("PlanProdSppMes");
  }
}
