import { ICodigoRechazos } from "app/models/ICodigoRechazos";
import axios from "axios";

export class CodigoRechazosService {
  constructor(public url = "CodigoRechazos") {}
  getAll(): Promise<ICodigoRechazos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICodigoRechazos[]>(`${import.meta.env.VITE_API_URL}/${this.url}/getAll`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getListByLineaId(lineaId: number): Promise<ICodigoRechazos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICodigoRechazos[]>(`${import.meta.env.VITE_API_URL}/${this.url}/getListByLineaId/${lineaId}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getListByCodigoAndLinea({ codigo, lineaId }): Promise<ICodigoRechazos> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICodigoRechazos>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByCodigo/${codigo}/${lineaId}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  postRequest(entity: ICodigoRechazos): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  putRequest(entity: ICodigoRechazos): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
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
