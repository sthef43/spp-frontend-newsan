import { IBaseEntity } from "app/models/IBaseEntity";
import axios from "axios";

export interface SearchRequestDTO {
  key: string;
  value: string;
}

export class GenericService<T extends IBaseEntity> {
  GetAll = "/GetAll";
  Get = "";
  Post = "";
  Put = "";
  GetAllPagintated = "/GetAllbyPuestoLinea";
  Delete = "";
  MultiPut = "/MultiPut";
  MultiPost = "/MultiPost";
  NestedAdd = "/NestedAdd";
  NestedUpdate = "/NestedUpdate";
  TransactionNestedAdd = "/TransactionNestedAdd";
  getAllByDateFromTo = "/GetAllByDateFromTo";
  constructor(public url: string) {}

  SearchRequest(search: SearchRequestDTO): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/SearchRequest`, search)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

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
  NestedAddRequest(entity: T): Promise<T> {
    console.log(entity);

    return new Promise((resolve, reject) => {
      axios
        .post<T>(`${import.meta.env.VITE_API_URL}/${this.url}${this.NestedAdd}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  NestedUpdateRequest(entity: T): Promise<T> {
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
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}${this.MultiPut}`, entity)
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
  TransactionNestedAddRequest(entity: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}${this.TransactionNestedAdd}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  GetAllByDateFromTo(dateFrom: string, dateTo: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      axios
        .post<T[]>(`${import.meta.env.VITE_API_URL}/${this.url}${this.getAllByDateFromTo}/${dateFrom}/${dateTo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
