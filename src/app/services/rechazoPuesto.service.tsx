import { GenericService } from "./generic.service";
import { IRechazoPuesto } from "../models/IRechazoPuesto";
import axios from "axios";
export class RechazoPuestoService extends GenericService<IRechazoPuesto> {
  url = "RechazoPuesto";
  constructor() {
    super("RechazoPuesto");
  }
  public getAllByProductoIdRequest(id: number): Promise<IRechazoPuesto[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IRechazoPuesto[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByProductoId/${id}`)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
