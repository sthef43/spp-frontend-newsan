import { IDobHUbicacion } from "app/models/IDobHUbicacion";
import { GenericService } from "./generic.service";
import axios from "axios";

export class DobHUbicacionService extends GenericService<IDobHUbicacion> {
  Url = "DobHUbicacion";
  constructor() {
    super("DobHUbicacion");
  }
  public getListDobHUbicacion(): Promise<IDobHUbicacion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobHUbicacion[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListDobHUbicacion`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
