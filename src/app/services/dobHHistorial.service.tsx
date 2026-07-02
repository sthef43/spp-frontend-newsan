import { IDobHHistorial } from "app/models/IDobHHistorial";
import { GenericService } from "./generic.service";
import axios from "axios";

export class DobHHistorialService extends GenericService<IDobHHistorial> {
  Url = "DobHHistorial";
  constructor() {
    super("DobHHistorial");
  }
  public GetListByDobHUbicacionId(ubicacionId: number): Promise<IDobHHistorial[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobHHistorial[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByDobHUbicacionId/${ubicacionId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByDobHMaquinaId(maquinaId: number): Promise<IDobHHistorial[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobHHistorial[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByDobHMaquinaId/${maquinaId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListDobHHistorial(): Promise<IDobHHistorial[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobHHistorial[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListDobHHistorial`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
