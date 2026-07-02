import axios from "axios";
import { IProduccionModelos } from "../models/IProduccionModelo";

export class ProduccionModelosService {
  Url = "ProduccionModelos";

  public GetByCodigo(codigo: string): Promise<IProduccionModelos> {
    return new Promise((resolve, reject) => {
      axios
        .get<IProduccionModelos>(`${import.meta.env.VITE_API_URL}/${this.Url}/getbycodigomodelo/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
