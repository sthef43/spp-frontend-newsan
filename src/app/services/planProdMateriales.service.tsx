import axios from "axios";
import { IPlanProdMateriales } from "app/models/IPlanProdMateriales";

export class PlanProdMaterialesService {
  Url = "PlanProdMateriales";
  public postRequest(entity: IPlanProdMateriales): Promise<IPlanProdMateriales> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPlanProdMateriales>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getMaterialesByIdPlanProd(model: number): Promise<IPlanProdMateriales[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPlanProdMateriales[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetMaterialesByIdPlanProd/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IPlanProdMateriales): Promise<boolean> {
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
  public multiPostRequest(entity: IPlanProdMateriales[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPost`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  PutRequest(entity: IPlanProdMateriales): Promise<boolean> {
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

  DeleteRequest(Id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}?Id=${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
