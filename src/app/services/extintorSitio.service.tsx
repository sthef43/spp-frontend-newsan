import axios from "axios";
import { GenericService } from "./generic.service";
import { IExtintorSitio } from "app/models/IExtintorSitio";

export class ExtintorSitioService extends GenericService<IExtintorSitio> {
  Url = "ExtintorSitio";
  constructor() {
    super("ExtintorSitio");
  }
  public GetListByPlant(planta: number): Promise<IExtintorSitio[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IExtintorSitio[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPlant/${planta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
