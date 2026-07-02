import axios from "axios";
import type { IAndonPlacas } from "../models/IAndonPlacas";
import { GenericService } from "app/services/generic.service";

// Heredamos de GenericService aunque solo implementemos métodos específicos,
// manteniendo la coherencia estructural.
export class AndonPlacasServices extends GenericService<IAndonPlacas> {
  Url = "CLIContenedorItemsRecepcionBloq";
  constructor() {
    super("CLIContenedorItemsRecepcionBloq"); // Nombre base para la URL
  }

  // 1. OBTENER TODAS LAS PLACAS (GET/POST Lógico)
  public async GetAllPlaquesForSectorsAndForModels(): Promise<IAndonPlacas[]> {
    return new Promise<IAndonPlacas[]>((resolve, reject) => {
      axios
        .get<IAndonPlacas[]>(`${process.env.REACT_APP_API_URL}/${this.Url}/GetAllPlaquesForSectorsAndForModels`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
