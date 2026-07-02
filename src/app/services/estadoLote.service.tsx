import axios from "axios";
import { IEstadoLote } from "app/models/IEstadoLote";

export class EstadoLoteService {
  Url = "EstadoLote";
  public getAllRequest(): Promise<IEstadoLote[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IEstadoLote[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
