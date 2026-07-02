import { IDefectoImagen } from "app/models/IDefectoImagen";
import axios from "axios";

export class DefectoImagenService {
  constructor(public url = "DefectoImagen") {}
  postRequest(entity: IDefectoImagen): Promise<IDefectoImagen> {
    return new Promise((resolve, reject) => {
      axios
        .post<IDefectoImagen>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  MultiPostRequest(entity: IDefectoImagen[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/MultiPost`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  putRequest(entity: IDefectoImagen): Promise<IDefectoImagen> {
    return new Promise((resolve, reject) => {
      axios
        .put<IDefectoImagen>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
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
  deleteMultiRequest(entity: IDefectoImagen[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
          .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/DeleteMultiDates`, {
              data: entity
          })
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
    }
  getAllByFamilia(familia: string): Promise<IDefectoImagen[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDefectoImagen[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByFamilia/${familia}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
