import { IComunicado } from "app/models/IComunicado";
import axios from "axios";

export class ComunicadoService {
  Url = "Comunicado";
  public update = (modelo: IComunicado) => {
    return new Promise((resolve, reject) => {
      return axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/put`, modelo)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
  public getList = () => {
    return new Promise((resolve, reject) => {
      return axios
        .get<IComunicado>(`${import.meta.env.VITE_API_URL}/${this.Url}/getList`)
        .then((data) => resolve(data.data))
        .catch((data) => reject(data));
    });
  };
}
