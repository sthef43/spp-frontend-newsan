import { IBaseEntity } from "./IBaseEntity";
import { IContDetalleContenedor } from "./IContDetalleContenedor";
import { IContEmbarque } from "./IContEmbarque";
import { IContEstado } from "./IContEstado";
import { IContObservacion } from "./IContObservacion";
import { IContPedido } from "./IContPedido";
import { IContPlantaDetalle } from "./IContPlantaDetalle";
import { IContUbicacion } from "./IContUbicacion";

export interface IContContenedor extends IBaseEntity {
  contEmbarque?: IContEmbarque;
  contEmbarqueId?: number;
  lpn?: string | null;
  tipo?: string | null;
  codigo?: string | null;
  descripcion?: string | null;
  cantidad?: string | null;
  prioridad?: number | null;
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
  contPedido?: Array<IContPedido> | null;
}

