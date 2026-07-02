import axios from "axios";
import { IProduccionInicio } from "../models/IProduccionInicio";

export class ProduccionInicioService {
  Url = "ProduccionInicio";

  public GetByCodigo(codigo: string): Promise<IProduccionInicio> {
    return new Promise((resolve, reject) => {
      axios
        .get<IProduccionInicio>(`${import.meta.env.VITE_API_URL}/${this.Url}/getbycodigomodelo/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
