import axios from "axios";
import { GenericService } from "./generic.service";
import { IExtintorAgente } from "app/models/IExtintorAgente";

export class ExtintorAgenteService extends GenericService<IExtintorAgente> {
  Url = "ExtintorAgente";
  constructor() {
    super("ExtintorAgente");
  }
  public GetList(): Promise<IExtintorAgente[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IExtintorAgente[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetList`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
