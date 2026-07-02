import axios from "axios";
import { IZPL_Reimpresiones } from "app/models/IZPL_Reimpresiones";

export class ZPL_ReimpresionesService {
  Url = "ZPL_Reimpresiones";
  public getAllRequest(): Promise<IZPL_Reimpresiones[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Reimpresiones[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IZPL_Reimpresiones): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(entity: IZPL_Reimpresiones): Promise<IZPL_Reimpresiones> {
    return new Promise((resolve, reject) => {
      axios
        .post<IZPL_Reimpresiones>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
