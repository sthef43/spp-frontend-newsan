import { IPuesto } from "../models/IPuesto";
import { GenericService } from "./generic.service";
import axios from "axios";

export class PuestoService extends GenericService<IPuesto> {
  Url = "Puesto";
  constructor() {
    super("Puesto");
  }
  public GetListByTipo(tipo: string): Promise<IPuesto[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IPuesto[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetListByTipo/${tipo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
