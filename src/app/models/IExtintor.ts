import { IAppUser } from "./IAppUser";
import { IBaseEntity } from "./IBaseEntity";
import { IExtintorAgente } from "./IExtintorAgente";
import { IExtintorProceso } from "./IExtintorProceso";
import { IExtintorSitio } from "./IExtintorSitio";
import { IPlant } from "./IPlant";

export interface IExtintor extends IBaseEntity {
  plant?: IPlant | null;
  plantId: number;
  extintorSitio?: IExtintorSitio | null;
  extintorSitioId: number;
  extintorProceso?: IExtintorProceso | null;
  extintorProcesoId: number;
  extintorAgente?: IExtintorAgente | null;
  extintorAgenteId: number;
  appUser?: IAppUser;
  appUserId: number;

  capacidad: number;
  numeroCilindro: number;
  ubicacion: string;
  fechaVencimiento: string;
  fechaVencimientoPH: string;

  presion: boolean;
  seguro: boolean;
  cilindro: boolean;
  manometro: boolean;
  manguera: boolean;
  señalizacion: boolean;
  
  observacion: string;
}
