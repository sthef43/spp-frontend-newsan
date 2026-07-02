import { IBaseEntity } from "./IBaseEntity";
import { ILineaProduccionFamilia } from "./ILineaProduccionFamilia";
import { ILineaPuesto } from "./ILineaPuesto";
import { IPlant } from "./IPlant";
import { IProducto } from "./IProducto";

export interface ILineaProduccion extends IBaseEntity {
  plantId: number;
  planta?: IPlant;
  producto?: IProducto;
  productoId: number;
  nombre: string;
  descripcion?: string;
  alias?: string;
  tipoUnidad?: string
  tipoProduccion?: string
  lineaPuesto?: ILineaPuesto[];
  lineaProduccionFamilia?: ILineaProduccionFamilia[];
  identificadorLinea: number;
  trazaSPP: boolean;
}
