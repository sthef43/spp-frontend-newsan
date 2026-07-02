import { IBaseEntityMes } from "./IBaseEntityMes";
import { IProductionOrders } from "./IProductionOrders";

export interface IFactories extends IBaseEntityMes {
  name: string;
  address: string;
  ebsOrganization: string;
  productionOrders: IProductionOrders[];
}
