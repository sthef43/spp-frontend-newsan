import { IBaseEntity } from "./IBaseEntity";
import { IContContenedor } from "./IContContenedor";
import { IContDetalleContenedor } from "./IContDetalleContenedor";
import { IContEstado } from "./IContEstado";
import { IContObservacion } from "./IContObservacion";
import { IContPlantaDetalle } from "./IContPlantaDetalle";
import { IContUbicacion } from "./IContUbicacion";

export interface IContPedido extends IBaseEntity {
  contContenedor?: IContContenedor;
  contContenedorId?: number;
  contPlantaDetalle?: IContPlantaDetalle;
  contPlantaDetalleId?: number;
  contDetalleContenedor?: IContDetalleContenedor;
  contDetalleContenedorId?: number;
  contEstado?: IContEstado;
  contEstadoId?: number;
  contUbicacion?: IContUbicacion;
  contUbicacionId?: number;
  contObservacion?: IContObservacion;
  contObservacionId?: number;
  fechaProgramado?: string | null;
  fechaEntregado?: string | null;  
}
