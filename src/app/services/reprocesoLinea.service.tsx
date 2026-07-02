import axios from "axios";
import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import { IReprocesoLineaConTraza } from "../models/IReprocesoConTraza";

export class ReprocesoLineaService {
  Url = "ReprocesoLinea";
  public getListByControlLoteId(model: number): Promise<IReprocesoLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReprocesoLinea[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByControlLoteId/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(entity: IReprocesoLinea): Promise<IReprocesoLinea> {
    return new Promise((resolve, reject) => {
      axios
        .post<IReprocesoLinea>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public multiPostRequest(entity: IReprocesoLinea[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPostRequest`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public multiPutRequest(entity: IReprocesoLinea[]): Promise<boolean> {
    console.log(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPutRequest`);
    console.log(entity);

    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/MultiPutRequest`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByDateRequest(fechaDesde: string, fechaHasta: string): Promise<IReprocesoLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReprocesoLinea[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByDate/${fechaDesde}/${fechaHasta}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllReproccesAndTraza(fechaDesde: string, fechaHasta: string, lineaId: number): Promise<IReprocesoLinea[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReprocesoLinea[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllReproccesAndTraza/${fechaDesde}/${fechaHasta}/${lineaId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getReprocesosByLineaAndDate(
    fechaDesde: string,
    fechaHasta: string,
    idLinea: number
  ): Promise<IReprocesoLineaConTraza[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IReprocesoLineaConTraza[]>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/GetReprocesosByLineaAndDate/${fechaDesde}/${fechaHasta}/${idLinea}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public async GetAllControlLoteByListOfId(listaId: number[]): Promise<IReprocesoLinea[]> {
    return new Promise<IReprocesoLinea[]>((resolve, reject) => {
      axios
        .post<IReprocesoLinea[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllControlLoteByListOfId`, listaId)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
