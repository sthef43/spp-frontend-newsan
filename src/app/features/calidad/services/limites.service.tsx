/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ILimites } from "app/models";
import { GenericService } from "app/services/generic.service";
import axios from "axios";

export class LimitesService extends GenericService<ILimites> {
  Url = "Limites";
  constructor() {
    super("Limites");
  }
  public create = (modelo: ILimites) => {
    return new Promise((resolve, reject) => {
      return axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/create`, modelo)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
  public getAllByLineaGenerico({ linea, generico }): Promise<ILimites[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILimites[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLineaGenerico/${linea}/${generico}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByLinea({ linea }): Promise<ILimites[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILimites[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLinea/${linea}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
