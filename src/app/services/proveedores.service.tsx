import { IProveedores } from "app/models/IProveedores";
import axios from "axios";
import { GenericService } from "./generic.service";

export class ProveedoresService extends GenericService<IProveedores> {
  Url = "Proveedores";
  constructor() {
    super("Proveedores");
  }

  public GetAllWithOrderByName(): Promise<IProveedores[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IProveedores[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllWithOrderByName`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public GetAllProveedoresByTipeUnit(typeUnit: string): Promise<IProveedores[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IProveedores[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllProveedoresByTipeUnit/${typeUnit}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
