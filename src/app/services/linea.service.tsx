import axios from "axios";
import { ILinea } from "app/models/ILinea";

export class LineaService {
  Url = "Linea";
  public getByIdRequest(model: number): Promise<ILinea> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILinea>(`${import.meta.env.VITE_API_URL}/${this.Url}/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllRequest(): Promise<ILinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILinea[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllActivas`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllSinFiltroRequest(): Promise<ILinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILinea[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public multiPutRequest(modelos: ILinea[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPut`, modelos)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public cambiarEBSRequest(condicion: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/CambiarEBS/${condicion}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(entity: ILinea): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/Add`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(entity: ILinea): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/Update`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByCodigoInicio(codigoInicio: string): Promise<ILinea> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILinea>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByCodigoInicio/${codigoInicio}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByTipoProduccion(tipoProduccion: string): Promise<ILinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILinea[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByTipoProduccion/${tipoProduccion}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByPlantId(plantaId: number): Promise<ILinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILinea[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListByPlantId/${plantaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetLineasByTypeProducctionAndActive(plantaId: number): Promise<ILinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ILinea[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetLineasByTypeProducctionAndActive/${plantaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
