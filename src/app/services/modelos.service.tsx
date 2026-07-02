import axios from "axios";
import { IModelos } from "app/models/IModelos";

export class ModelosService {
  Url = "Modelos";
  public getAllByTemporadaTipoUnidadRequest(modelA: number, modelB: string, modelC: string): Promise<IModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelos[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByTemporadaTipoUnidad/${modelA}/${modelB}/${modelC}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public create = (modelo: IModelos) => {
    return new Promise((resolve, reject) => {
      return axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/create`, modelo)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
  public update = (modelo: IModelos) => {
    return new Promise((resolve, reject) => {
      return axios
        .put(`${import.meta.env.VITE_API_URL}/${this.Url}/update`, modelo)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
  public getModelosByTemporada(model: number): Promise<IModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetModelosByTemporada/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  GetAllRequest(): Promise<IModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getModelosByTipoUnidad(model: string): Promise<IModelos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IModelos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetModelosByTipoUnidad/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public async GetModeloByName(nombreModelo: string): Promise<IModelos> {
    return new Promise<IModelos>((resolve, reject) => {
      axios
        .get<IModelos>(`${process.env.REACT_APP_API_URL}/${this.Url}/GetModeloByName/${nombreModelo}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}?id=${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
