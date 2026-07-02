import { IBaseEntityMes } from "./IBaseEntityMes";
import { IProducts } from "./IProducts";

export interface IFamilies extends IBaseEntityMes {
  name: string;
  productLineId: number;
  enabled: boolean | null;
  products: IProducts[];
}
