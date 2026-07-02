import { IAjuste } from "app/models/IAjuste";
import axios from "axios";

export class AjusteService {
  Url = "Ajuste";
  public getAllByLineaId(id: number): Promise<IAjuste[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAjuste[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByLineaId/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getByLineaId(id: number): Promise<IAjuste> {
    return new Promise((resolve, reject) => {
      axios
        .get<IAjuste>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetByLineaId/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public PutRequest(e: IAjuste): Promise<IAjuste> {
    return new Promise((resolve, reject) => {
      axios
        .put<IAjuste>(`${import.meta.env.VITE_API_URL}/${this.Url}`, e)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
