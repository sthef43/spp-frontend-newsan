import { IAtornilladoraAlim } from "app/models";
import axios from "axios";

export class AtornilladoraAlimService {
  Url = "AtornilladoraAlim";
  public create = (modelo: IAtornilladoraAlim) => {
    return new Promise((resolve, reject) => {
      return axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/create`, modelo)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
  public update = (modelo: IAtornilladoraAlim) => {
    return new Promise((resolve, reject) => {
      return axios
        .put(`${import.meta.env.VITE_API_URL}/${this.Url}/update`, modelo)
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
  public getAllRequest(): Promise<IAtornilladoraAlim[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAtornilladoraAlim[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByIdRequest(modelo: number): Promise<IAtornilladoraAlim> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAtornilladoraAlim>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetById/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
