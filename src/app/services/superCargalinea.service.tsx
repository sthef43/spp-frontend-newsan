import axios from "axios";
import { ISuperCargalinea } from "app/models/ISuperCargalinea";

export class SuperCargalineaService {
  Url = "SuperCargalinea";
  public getByNumeroOpRequest(model: string): Promise<ISuperCargalinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISuperCargalinea[]>(`${import.meta.env.VITE_API_URL}/SuperCargalinea/GetByNumeroOp/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getGroupedByModeloOp(): Promise<ISuperCargalinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISuperCargalinea[]>(`${import.meta.env.VITE_API_URL}/SuperCargalinea/GetGroupedByModeloOp`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getMateriales(): Promise<ISuperCargalinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISuperCargalinea[]>(`${import.meta.env.VITE_API_URL}/SuperCargalinea/getMateriales`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByModelo(modelo: string): Promise<ISuperCargalinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ISuperCargalinea[]>(`${import.meta.env.VITE_API_URL}/SuperCargalinea/GetByModelo/${modelo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public MultiPostNested(modelo: ISuperCargalinea[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/SuperCargalinea/MultiPostNested`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public Post(modelo: ISuperCargalinea): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/SuperCargalinea`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public Put(modelo: ISuperCargalinea): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/SuperCargalinea`, modelo)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public Deleted(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/SuperCargalinea/Deleted`, id)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  MultiDeleteRequest(entity: ISuperCargalinea[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiDelete`, entity)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
