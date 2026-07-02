import axios from "axios";
import { IPedidoMaterialesCalidad } from "../models/IPedidoMaterialesCalidad";

export class PedidoMaterialesCalidadService {
  Url = "PedidoMaterialesCalidad";

  public getByIdRequest(model: number): Promise<IPedidoMaterialesCalidad> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPedidoMaterialesCalidad>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetById/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllPedidoMaterialesCalidadRequest(): Promise<IPedidoMaterialesCalidad[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPedidoMaterialesCalidad[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPedidoMaterialesCalidad`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(entity: IPedidoMaterialesCalidad): Promise<IPedidoMaterialesCalidad> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPedidoMaterialesCalidad>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IPedidoMaterialesCalidad): Promise<boolean> {
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
