import { IBaseEntity } from "./IBaseEntity";
import { IOQCModelo } from "./IOQModelo";
import { IOQCDesignada } from "./IOQCDesignada";
import { IOQCDesignadaResultado } from "./IOQCDesignadaResultado";
import { IOQCPaletPrint } from "./IOQCPaletPrint";
import { IPlant } from "./IPlant";
import { IOperator } from "./IOperator";

export interface IOQCPalet extends IBaseEntity {
  oqcModeloId: number;
  oqcModelo?: IOQCModelo;
  oqcDesignadaId: number;
  oqcDesignada?: IOQCDesignada;
  lpn: string;
  plantId?: number;
  operatorId?: number 
  cerrado: boolean;
  conforme: boolean;
  reprocesado?: boolean;
  oqcDesignadaResultado?: IOQCDesignadaResultado[];
  oqcPaletPrint?: IOQCPaletPrint[];
  plant?: IPlant;
  operator?: IOperator;
  registro?: string;
  numeroPalet?: string;
  cantidadMasterBox?: number;
  cantidadEquipos?: number
}
