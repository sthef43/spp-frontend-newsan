import { IOrigenes } from "app/models/IOrigen";
import axios from "axios";

export class OrigenService {
  constructor(public url = "Origenes") {}
  getAll(): Promise<IOrigenes[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOrigenes[]>(`${import.meta.env.VITE_API_URL}/${this.url}/getAll`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAllByCodRep(codRep: number): Promise<IOrigenes[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOrigenes[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByCodRepa/${codRep}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  postRequest(entity: IOrigenes): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/Post`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  putRequest(entity: IOrigenes): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/Put`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  deleteRequest(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}?id=${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
