import { IBaseEntityMes } from "./IBaseEntityMes";
import { IFactories } from "./IFactories";
import { IProducts } from "./IProducts";

export interface IProductionOrders extends IBaseEntityMes {
  name: string;
  totalQty?: number | null;
  consumedQty?: number | null;
  productId?: number | null;
  enabled?: boolean | null;
  factoryId?: number | null;
  factory?: IFactories;
  product?: IProducts;
}
