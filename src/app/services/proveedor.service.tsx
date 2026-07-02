import axios from "axios";
import { IProveedor } from "app/models/IProveedor";

export class ProveedorService {
  Url = "Proveedor";
  public getAllByTipoUnidadRequest(model: string): Promise<IProveedor> {
    return new Promise((resolve, reject) => {
      axios
        .get<IProveedor>(`${import.meta.env.VITE_API_URL}/${this.Url}/${model}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
