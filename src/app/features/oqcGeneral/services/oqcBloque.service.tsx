import axios from "axios";
import { GenericService } from "../../../services/generic.service";
import { IOQCBloque } from "app/models/IOQCBloque";

export class OQCBloqueService extends GenericService<IOQCBloque> {
  Url = "OQCBloque";
  constructor() {
    super("OQCBloque");
  }
  public GetAllByProductoId(productoId: number): Promise<IOQCBloque[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCBloque[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByProductoId/${productoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
