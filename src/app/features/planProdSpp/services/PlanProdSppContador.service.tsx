import { GenericService } from "app/services/generic.service";
import { IPlanProdSppContador } from "../models/IPlanProdSppContador";

export class PlanProdSppContadorService extends GenericService<IPlanProdSppContador> {
  Url = "PlanProdSppContador";
  constructor() {
    super("PlanProdSppContador");
  }
}
