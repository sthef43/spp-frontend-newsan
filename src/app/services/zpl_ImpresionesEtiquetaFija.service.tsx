import axios from "axios";
import { IZPL_ImpresionesEtiquetaFija } from "app/models/IZPL_ImpresionesEtiquetaFija";

export class ZPL_ImpresionesEtiquetaFijaService {
  Url = "ZPL_ImpresionesEtiquetaFija";
  public getAllRequest(): Promise<IZPL_ImpresionesEtiquetaFija[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_ImpresionesEtiquetaFija[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByEtiquetaFijaId(id: number): Promise<IZPL_ImpresionesEtiquetaFija[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_ImpresionesEtiquetaFija[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetListByEtiquetaFijaId/${id}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public post(modelo: IZPL_ImpresionesEtiquetaFija): Promise<IZPL_ImpresionesEtiquetaFija> {
    return new Promise((resolve, reject) => {
      axios
        .post<IZPL_ImpresionesEtiquetaFija>(`${import.meta.env.VITE_API_URL}/${this.Url}`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public put(modelo: IZPL_ImpresionesEtiquetaFija): Promise<boolean> {
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
