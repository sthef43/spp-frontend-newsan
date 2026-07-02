import { ITrazabilidadLg } from "app/models/ITrazabilidadLg";
import axios from "axios";

export class TrazabilidadLgService {
  Url = "TrazabilidadLg";
  public getByNroSrv(nroSrv: string): Promise<ITrazabilidadLg> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazabilidadLg>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByNroSrv/${nroSrv}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByTrazabilidad(trazablidad: string): Promise<ITrazabilidadLg> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazabilidadLg>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByTrazabilidad/${trazablidad}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public DeleteById(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/DeleteById/${id}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
