import { IBaseEntityMes } from "./IBaseEntityMes";
import { IFamilies } from "./IFamilies";
import { IProductionOrders } from "./IProductionOrders";

export interface IProducts extends IBaseEntityMes {
  name: string;
  familyId: number;
  customerId: number | null;
  enabled: boolean | null;
  isFinalProduct: boolean;
  ebsCode: string;
  ebsPrefix: string;
  activeRouteId: number | null;
  isOpAutomatic: boolean | null;
  family: IFamilies;
  productionOrders: IProductionOrders[];
}
