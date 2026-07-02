import { IBaseEntity } from "app/models";
import { IGrupoFalla } from "./IGrupoFalla";

/**
 * Interfaz para la entidad de Causa de Dobladura/Soldadura.
 * Relaciona una falla específica con un grupo de fallas.
 */
export interface ICausaDobladuraSoldadura extends IBaseEntity {
  falla: string;
  grupoFallaId: number;
  grupoFalla?: IGrupoFalla;
}
