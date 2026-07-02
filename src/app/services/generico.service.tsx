import axios from "axios";
import { IGenerico } from "app/models/IGenerico";

export class GenericoService {
  Url = "Generico";
  public getAllByTipoUnidadRequest(model: string): Promise<IGenerico[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IGenerico[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllRequest(): Promise<IGenerico[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IGenerico[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public Add(entity: IGenerico): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
