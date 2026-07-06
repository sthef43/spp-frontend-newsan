import { ICausa } from "app/models/ICausa";
import axios from "axios";

export class CausaService {
  constructor(public url = "Causas") {}
  getAll(): Promise<ICausa[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICausa[]>(`${import.meta.env.VITE_API_URL}/${this.url}/getAll`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAllByCodRep(codRep: number): Promise<ICausa[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICausa[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByCodRepa/${codRep}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  postRequest(entity: ICausa): Promise<boolean> {
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
  putRequest(entity: ICausa): Promise<boolean> {
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
