import axios from "axios";
import { IZPL_EtiquetaFija } from "app/models/IZPL_EtiquetaFija";

export class ZPL_EttiquetaFijaService {
  Url = "ZPL_EtiquetaFija";
  public getAllRequest(): Promise<IZPL_EtiquetaFija[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_EtiquetaFija[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByTipoEtiquetaId(tipoEtiquetaId: number): Promise<IZPL_EtiquetaFija[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_EtiquetaFija[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByTipoEtiquetaId/${tipoEtiquetaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public post(modelo: IZPL_EtiquetaFija): Promise<IZPL_EtiquetaFija> {
    return new Promise((resolve, reject) => {
      axios
        .post<IZPL_EtiquetaFija>(`${import.meta.env.VITE_API_URL}/${this.Url}`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public put(modelo: IZPL_EtiquetaFija): Promise<boolean> {
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
  public delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/?Id=${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
