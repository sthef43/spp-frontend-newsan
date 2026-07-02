import { IBaseEntity } from "./IBaseEntity";
import { IDobHTipoMaquina } from "./IDobHTipoMaquina";
import { IDobHDiametroTubo } from "./IDobHDiametroTubo";
import { IDobHTipo } from "./IDobHTipo";
import { IDobHRadioMedio } from "./IDobHRadioMedio";
import { IDobHEstado } from "./IDobHEstado";
import { IDobHProveedor } from "./IDobHProveedor";
import { IDobHHistorial } from "./IDobHHistorial";

export interface IDobHHerramental extends IBaseEntity {
  dobHTipoMaquina?: IDobHTipoMaquina | null;
  dobHTipoMaquinaId?: number;
  dobHTipo?: IDobHTipo | null;
  dobHTipoId?: number;  
  dobHDiametroTubo?: IDobHDiametroTubo | null;
  dobHDiametroTuboId?: number;
  dobHRadioMedio?: IDobHRadioMedio | null;
  dobHRadioMedioId?: number;
  dobHEstado?: IDobHEstado | null;
  dobHEstadoId?: number;
  dobHProveedor?: IDobHProveedor | null;
  dobHProveedorId?: number;
  correlativo?: number | null;
  codigo?: string | null;
  costoUSS?: number | null;
  descripcion?: string | null;
  imagen?: string | null;
  dobHHistorial?: Array<IDobHHistorial> | null;
}
