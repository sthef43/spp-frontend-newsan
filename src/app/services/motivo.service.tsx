import { IMotivo } from "app/models/IMotivo";
import axios from "axios";

export class MotivoService {
  url = "Motivo";

  GetByIdRequest(Id: number): Promise<IMotivo> {
    return new Promise((resolve, reject) => {
      axios
        .get<IMotivo>(`${import.meta.env.VITE_API_URL}/${this.url}/${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetAllRequest(): Promise<IMotivo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IMotivo[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  PostRequest(entity: IMotivo): Promise<IMotivo> {
    console.log("post de motivo service");
    console.log(entity);
    console.log(`${import.meta.env.VITE_API_URL}/${this.url}`);

    return new Promise((resolve, reject) => {
      axios
        .post<IMotivo>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PutRequest(entity: IMotivo): Promise<boolean> {
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
