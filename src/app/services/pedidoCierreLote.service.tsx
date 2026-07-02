import axios from "axios";
import { IPedidoCierreLote } from "app/models/IPedidoCierreLote";

export class PedidoCierreLoteService {
  Url = "PedidoCierreLote";

  public getByIdRequest(model: number): Promise<IPedidoCierreLote> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPedidoCierreLote>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetById/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllPedidoCierreLoteRequest(): Promise<IPedidoCierreLote[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPedidoCierreLote[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPedidoCierreLote`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(entity: IPedidoCierreLote): Promise<IPedidoCierreLote> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPedidoCierreLote>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IPedidoCierreLote): Promise<boolean> {
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
}
