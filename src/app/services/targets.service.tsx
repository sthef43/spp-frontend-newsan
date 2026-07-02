import axios from "axios";
import { ITargets } from "app/models/ITargets";

export class TargetsService {
  Url = "Targets";
  public getTargetByIdLineaGenericoRequest({ idLinea, generico }): Promise<ITargets> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITargets>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAllByIdLineaGenerico/${idLinea}/${generico}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(e: ITargets): Promise<ITargets> {
    return new Promise((resolve, reject) => {
      axios
        .put<ITargets>(`${import.meta.env.VITE_API_URL}/${this.Url}`, e)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByIdLinea(idLinea): Promise<ITargets> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITargets>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListByIdLinea/${idLinea}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public postRequest(e: ITargets): Promise<ITargets> {
    return new Promise((resolve, reject) => {
      axios
        .post<ITargets>(`${import.meta.env.VITE_API_URL}/${this.Url}`, e)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
