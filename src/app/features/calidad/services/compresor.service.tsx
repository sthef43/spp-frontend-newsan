import { ICompresor } from "app/models/ICompresor";
import axios from "axios";

export class CompresorService {
  Url = "Compresor";
  public create = (modelo: ICompresor) => {
    return new Promise((resolve, reject) => {
      return axios
        .post<ICompresor>(`${import.meta.env.VITE_API_URL}/${this.Url}`, modelo)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
  public update = (modelo: ICompresor) => {
    return new Promise((resolve, reject) => {
      return axios
        .put<ICompresor>(`${import.meta.env.VITE_API_URL}/${this.Url}`, modelo)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
  public deleteRequest(Id: number): Promise<boolean> {
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
  public getAllRequest(): Promise<ICompresor[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICompresor[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByIdRequest(modelo: number): Promise<ICompresor> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICompresor>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetById/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
