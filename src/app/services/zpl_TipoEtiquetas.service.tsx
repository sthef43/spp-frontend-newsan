import axios from "axios";
import { IZPL_TipoEtiquetas } from "app/models/IZPL_TipoEtiquetas";

export class ZPL_TipoEtiquetasService {
  Url = "ZPL_TipoEtiquetas";
  public getAllRequest(): Promise<IZPL_TipoEtiquetas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_TipoEtiquetas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getListByEstadoRequest(estado): Promise<IZPL_TipoEtiquetas[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_TipoEtiquetas[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListByEstado/${estado}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
