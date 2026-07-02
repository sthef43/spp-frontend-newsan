import { IBaseEntity, ILinea } from "app/models";

/**
 * Interfaz que define un Grupo de Falla.
 * Agrupa diferentes tipos de fallas asociadas a una línea de producción.
 */
export interface IGrupoFalla extends IBaseEntity {
  grupo: string;
  descripcion: string;
  lineaId: number;
  linea?: ILinea;
}
