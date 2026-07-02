import { GenericService } from "./generic.service";
import { ITrazaCambios } from "../models/ITrazaCambios";
import axios from "axios";

export class TrazaCambiosService extends GenericService<ITrazaCambios> {
  Url = "TrazaCambios";
  constructor() {
    super("Modelo");
  }

  GetHistorialByCodigo(codigo: string): Promise<ITrazaCambios[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITrazaCambios[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetHistorialByCodigo/${codigo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
