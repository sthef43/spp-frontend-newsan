import { IBaseEntityMes } from "app/models/mes/IBaseEntityMes";
import axios from "axios";

export class GenericMesService<T extends IBaseEntityMes> {
  GetAll = "/GetAll";
  Get = "";
  Post = "";
  Put = "";
  GetAllPagintated = "/GetAllbyPuestoLinea";
  Delete = "";
  MultiPut = "/MultiPut";
  MultiPost = "/MultiPost";
  constructor(public url: string) {}

  GetByIdRequest(Id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      axios
        .get<T>(`${import.meta.env.VITE_API_URL}/${this.url}/${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetAllRequest(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<T[]>(`${import.meta.env.VITE_API_URL}/${this.url}${this.GetAll}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PostRequest(entity: T): Promise<T> {
    return new Promise((resolve, reject) => {
      axios
        .post<T>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  PutRequest(entity: T): Promise<T> {
    return new Promise((resolve, reject) => {
      axios
        .put<T>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  MultiPostRequest(entity: T[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}${this.MultiPost}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  MultiPutRequest(entity: T[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}${this.MultiPut}`, entity)
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
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}${this.Delete}?Id=${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
