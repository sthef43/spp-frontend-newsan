import axios from "axios";
import { GenericService } from "./generic.service";
import { IExtintor } from "app/models/IExtintor";

export class ExtintorService extends GenericService<IExtintor> {
  Url = "Extintor";
  constructor() {
    super("Extintor");
  }
  public GetListVencidosByPlant(planta: number): Promise<IExtintor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IExtintor[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListVencidosByPlant/${planta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByPSPA({planta, sitio, proceso, agente}): Promise<IExtintor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IExtintor[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByPSPA/${planta}/${sitio}/${proceso}/${agente}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetByNumeroCilindro(cilindro: number): Promise<IExtintor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IExtintor[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByNumeroCilindro/${cilindro}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
