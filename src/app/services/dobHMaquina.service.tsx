import { IDobHMaquina } from "app/models/IDobHMaquina";
import { GenericService } from "./generic.service";
import axios from "axios";

export class DobHMaquinaService extends GenericService<IDobHMaquina> {
  Url = "DobHMaquina";
  constructor() {
    super("DobHMaquina");
  }
  public getListDobHMaquina(): Promise<IDobHMaquina[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobHMaquina[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListDobHMaquina`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
