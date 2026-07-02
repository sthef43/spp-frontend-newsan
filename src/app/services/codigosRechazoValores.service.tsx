import { ICodigosRechazosValores } from "app/models/ICodigosRechazosValores";
import axios from "axios";
import { GenericService } from "./generic.service";

export class CodigosRechazoValoresService extends GenericService<ICodigosRechazosValores> {
  Url = "CodigosRechazoValores";
  constructor() {
    super("CodigosRechazoValores");
  }
  public getAllByCodId(codId: number, productoId: number): Promise<ICodigosRechazosValores[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICodigosRechazosValores[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/getAllByCodId/${codId}/${productoId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
