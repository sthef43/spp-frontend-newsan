import axios from "axios";
import { GenericService } from "../../../services/generic.service";
import { IOQCModeloPrefijo } from "app/models/IOQCModeloPrefijo";

export class OQCModeloPrefijoService extends GenericService<IOQCModeloPrefijo> {
  Url = "OQCModeloPrefijo";
  constructor() {
    super("OQCModeloPrefijo");
  }
  public GetListByPrefijo(prefijo: string): Promise<IOQCModeloPrefijo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCModeloPrefijo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetListByPrefijo/${prefijo}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
