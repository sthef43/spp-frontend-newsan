import { GenericService } from "app/services/generic.service";
import { ICLIUbicaciones } from "../Models/ICLIUbicaciones";
import axios from "axios";

export class CLIUbicacionesService extends GenericService<ICLIUbicaciones> {
  Url = "CLIUbicaciones";
  constructor() {
    super("CLIUbicaciones");
  }
  public getByLocalizador(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/getByLocalizador`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
