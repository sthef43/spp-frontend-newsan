import { IAtornilladoraFormato } from "app/models";
import axios from "axios";

export class AtornilladoraFormatoService {
  Url = "AtornilladoraFormato";
  public create = (modelo: IAtornilladoraFormato) => {
    return new Promise((resolve, reject) => {
      return axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/create`, modelo)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
  public update = (modelo: IAtornilladoraFormato) => {
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
  public getAllRequest(): Promise<IAtornilladoraFormato[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAtornilladoraFormato[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByIdRequest(modelo: number): Promise<IAtornilladoraFormato> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAtornilladoraFormato>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetById/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
