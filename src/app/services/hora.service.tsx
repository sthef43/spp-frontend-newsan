import { IHora } from "app/models/IHora";
import axios from "axios";

export class HoraService {
  Url = "Hora";

  public async Getall(): Promise<IHora[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IHora[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public async GetAllByTurno(turno: string): Promise<IHora[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IHora[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByTurno/${turno}/`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
  public async Post(modelo: IHora): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}`, modelo)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }
  PutRequest(entity: IHora): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}`, entity)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  Delete(idHora: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}?Id=${idHora}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
