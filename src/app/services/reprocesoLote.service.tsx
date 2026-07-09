import axios from "axios";
import { IReprocesoLote } from "app/models/IReprocesoLote";

export class ReprocesoLoteService {
  Url = "ReprocesoLote";
  public getAllByIdControlLoteRequest(model: number): Promise<IReprocesoLote[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReprocesoLote[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllReprocesos/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public multiPostRequest(entity: IReprocesoLote[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPostRequest`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
