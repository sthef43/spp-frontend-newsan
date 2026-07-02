import axios from "axios";
import { IZPL_Productos } from "app/models/IZPL_Productos";

export class ZPL_ProductosService {
  Url = "ZPL_Productos";
  public getAllRequest(): Promise<IZPL_Productos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Productos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByTipoEquipo(tipoE: string): Promise<IZPL_Productos[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IZPL_Productos[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByTipoEquipo/${tipoE}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
