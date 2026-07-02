import { IPeriodoHora } from "app/models/IPeriodoHora";
import axios from "axios";

export class PeriodoHoraService {
  url = "PeriodoHora";

  GetByIdRequest(Id: number): Promise<IPeriodoHora> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPeriodoHora>(`${import.meta.env.VITE_API_URL}/${this.url}/${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetAllRequest(): Promise<IPeriodoHora[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPeriodoHora[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetByPeriodoId(periodoId: number): Promise<IPeriodoHora[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPeriodoHora[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByPeriodoId/${periodoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PostRequest(entity: IPeriodoHora): Promise<IPeriodoHora> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPeriodoHora>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PutRequest(entity: IPeriodoHora): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  DeleteRequest(Id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/?Id=${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
