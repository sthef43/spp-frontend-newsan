import axios from "axios";
import { IMainReg } from "app/models/IMainReg";

export class MainRegService {
  Url = "MainReg";
  public getAllRequest(): Promise<IMainReg[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IMainReg[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByCodigo({ codigo, tipoDeCodigo }): Promise<IMainReg[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IMainReg[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByCodigo/${codigo}/${tipoDeCodigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public putRequest(model: IMainReg): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
