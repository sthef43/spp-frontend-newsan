import axios from "axios";
import { IPedidoMaterialesProduccion } from "../models/IPedidoMaterialesProduccion";

export class PedidoMaterialesProduccionService {
  Url = "PedidoMaterialesProduccion";

  public getByIdRequest(model: number): Promise<IPedidoMaterialesProduccion> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPedidoMaterialesProduccion>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetById/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getAllPedidoMaterialesProduccionRequest(): Promise<IPedidoMaterialesProduccion[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPedidoMaterialesProduccion[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllPedidoMaterialesProduccion`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(entity: IPedidoMaterialesProduccion): Promise<IPedidoMaterialesProduccion> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPedidoMaterialesProduccion>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IPedidoMaterialesProduccion): Promise<boolean> {
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
