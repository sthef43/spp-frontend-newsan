import { IPeriodo } from "app/models/IPeriodo";
import axios from "axios";

export class PeriodoService {
  url = "Periodo";

  GetByIdRequest(Id: number): Promise<IPeriodo> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPeriodo>(`${import.meta.env.VITE_API_URL}/${this.url}/${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetAllRequest(): Promise<IPeriodo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPeriodo[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetByPeriodoId(periodoId: number): Promise<IPeriodo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPeriodo[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByPeriodoId/${periodoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PostRequest(entity: IPeriodo): Promise<IPeriodo> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPeriodo>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PutRequest(entity: IPeriodo): Promise<boolean> {
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
