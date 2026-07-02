import { IParada } from "app/models/IParada";
import axios from "axios";

export class ParadaService {
  url = "Parada";

  GetByIdRequest(Id: number): Promise<IParada> {
    return new Promise((resolve, reject) => {
      axios
        .get<IParada>(`${import.meta.env.VITE_API_URL}/${this.url}/${Id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetAllRequest(): Promise<IParada[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IParada[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  GetListByDesdeHasta({ fechaDesde, fechaHasta }): Promise<IParada[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IParada[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByDesdeHasta/${fechaDesde}/${fechaHasta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  PostRequest(entity: IParada): Promise<IParada> {
    return new Promise((resolve, reject) => {
      axios
        .post<IParada>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  PutRequest(entity: IParada): Promise<boolean> {
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
  GetByLineaPlantaFecha({ linea, planta, fecha }): Promise<IParada> {
    return new Promise((resolve, reject) => {
      axios
        .get<IParada>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByLineaPlantaFecha/${linea}/${planta}/${fecha}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
