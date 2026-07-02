import { GenericService } from "app/services/generic.service";
import { IPlanProdSppEstadoEmbarque } from "../models/IPlanProdSppEstadoEmbarque";

export class PlanProdSppEstadoEmbarqueService extends GenericService<IPlanProdSppEstadoEmbarque> {
  Url = "PlanProdSppEstadoEmbarque";
  constructor() {
    super("PlanProdSppEstadoEmbarque");
  }
}
