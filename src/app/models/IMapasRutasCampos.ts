import { IBaseEntity } from "./IBaseEntity";
import { IExpRegularValores } from "./IExpRegularValores";
import { ISubensambleSPP } from "./ISubensambleSPP";
import { ISubTipo } from "./ISubTipo";
import { ISubTipoDetalle } from "./ISubTipoDetalle";
import { ITipoMaterial } from "./ITipoMaterial";
import { IValidarSemiValor } from "./IValidarSemiValor";

export interface IMapasRutasCampos extends IBaseEntity {
  expRegularValores?: IExpRegularValores;
  expRegularValoresId?: number;
  mapasRutasId?: number;
  subTipoId?: number;
  subTipo?: ISubTipo;
  subTipoDetalleId?: number;
  subTipoDetalle?: ISubTipoDetalle;
  validarSemiValor?: IValidarSemiValor[];
  subensambleSPP?: ISubensambleSPP[];
  serie?: boolean;
  externo?: boolean;
  validarSemi?: boolean;
  tipoMaterialId?: number;
  tipoMaterial?: ITipoMaterial;
  nombre?: string;
  orden?: number;
  persiste?: boolean;
  identificador?: boolean;
  expRegular?: string;
  validarCalidad?: boolean;
  validarBatea?: boolean
  autoGenerado?: boolean
}
