import { GenericService } from "app/services/generic.service";
import { ICausaDobladuraSoldadura } from "../Models/ICausaDobladuraSoldadura";
import axios from "axios";

/**
 * Servicio para obtener datos sobre las causas de fallas en dobladura/soldadura.
 */
export class CausaDobladuraSoldaduraService extends GenericService<ICausaDobladuraSoldadura> {
  Url = "CausaDobladuraSoldadura";
  constructor() {
    super("CausaDobladuraSoldadura");
  }

  /**
   * Devuelve las causas filtradas por el ID del grupo de falla.
   * @param grupoFallaId Identificador del grupo
   * @returns Lista de causas asociadas
   */
  public async GetAllCausesByFailGroupId(grupoFallaId: number): Promise<ICausaDobladuraSoldadura[]> {
    return new Promise<ICausaDobladuraSoldadura[]>((resolve, reject) => {
      axios
        .get<ICausaDobladuraSoldadura[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllCausesByFailGroupId/${grupoFallaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
