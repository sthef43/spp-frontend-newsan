import { ISupermaestro } from "app/models/ISupermaestro";
import axios from "axios";

export class SupermaestroService {
  url = "Supermaestro";
  getAllRequest(): Promise<ISupermaestro[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISupermaestro[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAll`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getByGenerico(generico: string): Promise<ISupermaestro[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISupermaestro[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByGenerico/${generico}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  deleteRequest(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/Delete/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  MultiDeleteRequest(entity: ISupermaestro[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/MultiDelete`, entity)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  MultiPostNested(entity: ISupermaestro[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/MultiPost`, entity)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  PutRequest(entity: ISupermaestro): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
