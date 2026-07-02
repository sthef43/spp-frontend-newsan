import { ISerieLg } from "app/models/ISerieLg";
import axios from "axios";

export class SerieLgService {
  Url = "SerieLg";
  public getByNroSrv(nroSrv: string): Promise<ISerieLg> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISerieLg>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByNroSrv/${nroSrv}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public ClearUsadoByTraza(traza: string): Promise<ISerieLg> {
    return new Promise((resolve, reject) => {
      axios
        .delete<ISerieLg>(`${import.meta.env.VITE_API_URL}/${this.Url}/ClearUsadoByTraza/${traza}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByMG({ modelo, generico }): Promise<ISerieLg[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISerieLg[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByMG/${generico}/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public EliminarById(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/EliminarById/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(modelo: ISerieLg): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(modelo: ISerieLg): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public multiPost(modelo: ISerieLg[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPost`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
