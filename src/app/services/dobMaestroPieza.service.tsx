import { IDobMaestroPieza } from "app/models/IDobMaestroPieza";
import { GenericService } from "./generic.service";
import axios from "axios";

export class DobMaestroPiezaService extends GenericService<IDobMaestroPieza> {
  Url = "DobMaestroPieza";
  constructor() {
    super("DobMaestroPieza");
  }

  public GetByArticulo(articulo: string): Promise<IDobMaestroPieza> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobMaestroPieza>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByArticulo/${articulo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetListByGenerico(generico: string): Promise<IDobMaestroPieza[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobMaestroPieza[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByGenerico/${generico}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async GetAllGenericList(): Promise<IDobMaestroPieza[]> {
    return new Promise<IDobMaestroPieza[]>((resolve, reject) => {
      axios
        .get<IDobMaestroPieza[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllGenericList`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
