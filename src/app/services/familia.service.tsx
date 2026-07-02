import { IFamilia } from "app/models/IFamilia";
import axios from "axios";
import { GenericService } from "./generic.service";

export class FamiliaService extends GenericService<IFamilia> {
  Url = "Familia";
  constructor() {
    super("Familia");
  }
  public getAllByProductoId(id: number): Promise<IFamilia[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IFamilia[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getAllByProductoId/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getListByNombre(tipoUnidad: string): Promise<IFamilia[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IFamilia[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListByNombre/${tipoUnidad}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
