import { GenericService } from "app/services/generic.service";
import { IGrupoFalla } from "../Models/IGrupoFalla";

/**
 * Servicio para gestionar las entidades de Grupo de Falla.
 * Utiliza GenericService para las operaciones estándar.
 */
export class GrupoFallaService extends GenericService<IGrupoFalla> {
  Url = "GrupoFalla";
  constructor() {
    super("GrupoFalla");
  }
}
