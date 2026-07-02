import axios from "axios";
import { IControlLoteMateriales } from "app/models/IControlLoteMateriales";

export class ControlLoteMaterialesService {
  Url = "ControlLoteMateriales";
  public postRequest(entity: IControlLoteMateriales): Promise<IControlLoteMateriales> {
    return new Promise((resolve, reject) => {
      axios
        .post<IControlLoteMateriales>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getMaterialesByIdControlLote(model: number): Promise<IControlLoteMateriales[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IControlLoteMateriales[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetMaterialesByIdControlLote/${model}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: IControlLoteMateriales): Promise<boolean> {
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
  public multiPostRequest(entity: IControlLoteMateriales[]): Promise<boolean> {
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
  public deleteRequest(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/?id=${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
