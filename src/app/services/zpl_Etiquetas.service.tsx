import axios from "axios";
import { IZPL_Etiquetas } from "app/models/IZPL_Etiquetas";

export class ZPL_EtiquetasService {
  Url = "ZPL_Etiquetas";
  public getAllRequest(): Promise<IZPL_Etiquetas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Etiquetas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByTipoEtiquetaId(tipoEtiquetaId: number): Promise<IZPL_Etiquetas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Etiquetas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByTipoEtiquetaId/${tipoEtiquetaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PostRequest(entity: IZPL_Etiquetas): Promise<IZPL_Etiquetas> {
    return new Promise((resolve, reject) => {
      axios
        .post<IZPL_Etiquetas>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PutRequest(entity: IZPL_Etiquetas): Promise<IZPL_Etiquetas> {
    return new Promise((resolve, reject) => {
      axios
        .put<IZPL_Etiquetas>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
