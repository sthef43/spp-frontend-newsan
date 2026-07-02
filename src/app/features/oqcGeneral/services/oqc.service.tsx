import { IOQC } from "app/models/IOQC";
import { GenericService } from "../../../services/generic.service";
import axios from "axios";

export class OQCService extends GenericService<IOQC> {
  Url = "OQC";
  constructor() {
    super("OQC");
  }
  public GetAllByProductoId(productoId: number): Promise<IOQC[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQC[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByProductoId/${productoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
