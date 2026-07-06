import axios from "axios";
import { IcajaElectricaLG } from "app/models/IcajaElectricaLG";

export class CajaElectricaLGService {
  Url = "cajaElectricaLG";
  public getAllRequest(): Promise<IcajaElectricaLG[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IcajaElectricaLG[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAll`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public getAllByCodigo(codigo: string): Promise<IcajaElectricaLG[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IcajaElectricaLG[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByCodigo/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
