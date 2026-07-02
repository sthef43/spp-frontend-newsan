import { ISgsmodelo } from "app/models/ISgsmodelo";
import axios from "axios";
export class SgsmodeloService {
  Url = "Sgsmodelos";
  public create = (modelo: ISgsmodelo) => {
    return new Promise((resolve, reject) => {
      return axios
        .post(`${import.meta.env.VITE_API_URL}/${this.Url}/create`, modelo)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
  public getAll = () => {
    return new Promise((resolve, reject) => {
      return axios
        .get(`${import.meta.env.VITE_API_URL}/${this.Url}/getAll`)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
}
