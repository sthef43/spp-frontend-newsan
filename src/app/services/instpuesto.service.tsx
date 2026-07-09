/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from "axios";
import { IInstpuesto } from "app/models/IInstpuesto";
import { GenericService } from "./generic.service";

export class InstpuestoService extends GenericService<IInstpuesto> {
  Url = "Instpuesto";
  constructor() {
    super("Instpuesto");
  }
  public getAllByProductoId(productoId: number): Promise<IInstpuesto[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IInstpuesto[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByProductoId/${productoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
