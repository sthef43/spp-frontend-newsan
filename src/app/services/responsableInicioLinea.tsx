import { IResponsableInicioLinea } from "app/models/IResponsableInicioLinea";
import axios from "axios";

export class ResponsableInicioLineaService {
  url = "ResponsableInicioLinea";

  GetByIdRequest(Id: number): Promise<IResponsableInicioLinea> {
    return new Promise((resolve, reject) => {
      axios
        .get<IResponsableInicioLinea>(`${import.meta.env.VITE_API_URL}/${this.url}/${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetAllRequest(): Promise<IResponsableInicioLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IResponsableInicioLinea[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  PostRequest(entity: IResponsableInicioLinea): Promise<IResponsableInicioLinea> {
    return new Promise((resolve, reject) => {
      axios
        .post<IResponsableInicioLinea>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PutRequest(entity: IResponsableInicioLinea): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
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
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}/?Id=${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
