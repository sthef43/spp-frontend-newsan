import { IIntDetalle } from "app/models/IIntDetalle";
import { GenericService } from "./generic.service";
import axios from "axios";

export class IntDetalleService extends GenericService<IIntDetalle> {
  Url = "IntDetalle";
  constructor() {
    super("IntDetalle");
  }
  public GetAllByIntRemitoId(intRemitoId: number): Promise<IIntDetalle[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IIntDetalle[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByIntRemitoId/${intRemitoId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
