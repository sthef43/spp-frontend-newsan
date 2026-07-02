import axios from "axios";
import { IZPL_Familias } from "app/models/IZPL_Familias";

export class ZPL_FamiliasService {
  Url = "ZPL_Familias";
  public getAllRequest(): Promise<IZPL_Familias[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Familias[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getRequest(): Promise<IZPL_Familias[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Familias[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IZPL_Familias): Promise<boolean> {
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
  public postRequest(entity: IZPL_Familias): Promise<IZPL_Familias[]> {
    return new Promise((resolve, reject) => {
      axios
        .post<IZPL_Familias[]>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public deleteRequest(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/?id=${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
