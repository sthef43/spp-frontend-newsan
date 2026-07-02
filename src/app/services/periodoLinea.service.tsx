import { IPeriodoLinea } from "app/models/IPeriodoLinea";
import axios from "axios";

export class PeriodoLineaService {
  url = "PeriodoLinea";

  GetByIdRequest(Id: number): Promise<IPeriodoLinea> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPeriodoLinea>(`${import.meta.env.VITE_API_URL}/${this.url}/${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetAllRequest(): Promise<IPeriodoLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPeriodoLinea[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetByLineaAndTurno(lineaId: number, turno: string): Promise<IPeriodoLinea> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPeriodoLinea>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByLineaAndTurno/${lineaId}/${turno}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PostRequest(entity: IPeriodoLinea): Promise<IPeriodoLinea> {
    return new Promise((resolve, reject) => {
      axios
        .post<IPeriodoLinea>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PutRequest(entity: IPeriodoLinea): Promise<boolean> {
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
