import { ICLIContendorItems } from "app/features/cli/Models/ICLIContenedorItems";
import { IBaseEntity } from "./IBaseEntity";
import { IBinariosIdentificadores } from "./IBinariosIdentificadores";
import { ILineaProduccionRutas } from "./ILineaProduccionRutas";
import { ITrazaOperacionesMarcaciones } from "./ITrazaOperacionesMarcaciones";
import { ITrazaUnit } from "./ITrazaUnit";
import { TrazaUnit_History } from "./ITrazaUnit_History";

export interface TrazaOperaciones extends IBaseEntity {
  // id?: number;
  fecha: string;
  ultimaRutaId: number;
  codigoInit: string;
  modelo?: string;
  familia?: string;
  semiElaborado: string;
  alias: string;
  identificador?: number | null;
  lpn?: string | null;
  caja?: string | null;
  batea?: string | null;
  lineaProduccionId?: number | null;
  terminado?: boolean | null;
  cliContenedorItemsId?: number | null;
  cliContentedorItems?: ICLIContendorItems;
  binarioIdentificador?: IBinariosIdentificadores;
  lineaProduccionRutas?: ILineaProduccionRutas;
  historial: TrazaUnit_History[];
  unidades: ITrazaUnit[];
  trazaOperacionesMarcaciones?: ITrazaOperacionesMarcaciones[];
}
