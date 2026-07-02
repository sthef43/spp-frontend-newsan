import { IDobPlano } from "app/models/IDobPlano";
import axios from "axios";
import { GenericService } from "./generic.service";

export class DobPlanoService extends GenericService<IDobPlano> {
  // export class DobPlanoService {
  Url = "DobPlano";
  constructor() {
    super("DobPlano");
  }
  public getListDobPlano(): Promise<IDobPlano[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobPlano[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/getListDobPlano`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetListByRolId(rolId: number): Promise<IDobPlano[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IDobPlano[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByRolId/${rolId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
